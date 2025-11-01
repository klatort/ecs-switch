const {
  BasicCredentials,
} = require("@huaweicloud/huaweicloud-sdk-core/auth/BasicCredentials");
const { Region } = require("@huaweicloud/huaweicloud-sdk-core/region/region");
const {
  EcsClient,
  EcsRegion,
  ListServersDetailsRequest,
  NovaShowServerRequest,
  BatchStartServersRequest,
  BatchStartServersRequestBody,
  BatchStartServersOption,
  BatchStopServersRequest,
  BatchStopServersRequestBody,
  BatchStopServersOption,
  NovaAssociateSecurityGroupRequest,
  NovaAssociateSecurityGroupRequestBody,
  NovaDisassociateSecurityGroupRequest,
  NovaDisassociateSecurityGroupRequestBody,
} = require("@huaweicloud/huaweicloud-sdk-ecs");
const {
  VpcClient,
  VpcRegion,
  CreateSecurityGroupRequest,
  CreateSecurityGroupRequestBody,
  CreateSecurityGroupOption,
  CreateSecurityGroupRuleRequest,
  CreateSecurityGroupRuleRequestBody,
  CreateSecurityGroupRuleOption,
  DeleteSecurityGroupRequest,
  DeleteSecurityGroupRuleRequest,
  ListSecurityGroupRulesRequest,
} = require("@huaweicloud/huaweicloud-sdk-vpc");

const SA_LIMA = new Region("sa-peru-1", "https://ecs.sa-peru-1.myhuaweicloud.com");

// Available ECS regions - filter out undefined ones
const REGIONS = [
  EcsRegion.AF_NORTH_1, // AF-Cairo
  EcsRegion.AF_SOUTH_1, // AF-Johannesburg
  EcsRegion.AP_SOUTHEAST_1, // CN-Hong Kong
  EcsRegion.AP_SOUTHEAST_2, // AP-Bangkok
  EcsRegion.AP_SOUTHEAST_3, // AP-Singapore
  EcsRegion.AP_SOUTHEAST_4, // AP-Jakarta
  EcsRegion.CN_EAST_3, // CN East-Shanghai1
  EcsRegion.CN_EAST_5, // CN East-Qingdao
  EcsRegion.CN_NORTH_4, // CN North-Beijing4
  EcsRegion.CN_SOUTH_1, // CN South-Guangzhou
  EcsRegion.CN_SOUTHWEST_2, // CN Southwest-Guiyang1
  SA_LIMA, // SA-Lima (Peru) - Custom region
  EcsRegion.LA_NORTH_2, // LA-Mexico City2
  EcsRegion.LA_SOUTH_2, // LA-Santiago
  EcsRegion.ME_EAST_1, // ME-Riyadh
  EcsRegion.NA_MEXICO_1, // LA-Mexico City1
  EcsRegion.SA_BRAZIL_1, // LA-Sao Paulo1
  EcsRegion.TR_WEST_1, // TR-Istanbul
];

// Timeout wrapper function
function withTimeout(promise, timeoutMs, operation) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`${operation} timed out after ${timeoutMs / 1000}s`)), timeoutMs)
    )
  ]);
}

function createClient(ak, sk, region) {
  const credentials = new BasicCredentials().withAk(ak).withSk(sk);

  return EcsClient.newBuilder()
    .withCredential(credentials)
    .withRegion(region)
    .build();
}

function createVpcClient(ak, sk, region) {
  const credentials = new BasicCredentials().withAk(ak).withSk(sk);
  
  // Map ECS region to VPC region
  let vpcRegion;
  
  // For custom Lima region
  if (region.id === "sa-peru-1") {
    vpcRegion = new Region("sa-peru-1", "https://vpc.sa-peru-1.myhuaweicloud.com");
  } else {
    // Convert region ID from hyphen format to underscore format for VPC
    // e.g., "la-south-2" -> "LA_SOUTH_2"
    const vpcRegionId = region.id.toUpperCase().replace(/-/g, '_');
    vpcRegion = VpcRegion[vpcRegionId];
    
    if (!vpcRegion) {
      console.error(`[API] Warning: VPC region not found for ${vpcRegionId}, using fallback`);
      // Fallback: construct from ECS endpoint
      const vpcEndpoint = region.endpoint.replace('ecs.', 'vpc.');
      vpcRegion = new Region(region.id, vpcEndpoint);
    }
  }
  
  console.log(`[API] VPC Region: ${vpcRegion.id}, VPC Endpoint: ${vpcRegion.endpoint}`);
  
  return VpcClient.newBuilder()
    .withCredential(credentials)
    .withRegion(vpcRegion)
    .build();
}

async function validateCredentials(ak, sk) {
  console.log("[API] Starting credential validation...");
  const startTime = Date.now();

  try {
    const client = createClient(ak, sk, EcsRegion.LA_SOUTH_2);
    const request = new ListServersDetailsRequest();
    request.limit = 1;

    console.log("[API] Sending validation request to LA_SOUTH_2...");
    await withTimeout(client.listServersDetails(request), 10000, "Credential validation");

    const duration = Date.now() - startTime;
    console.log(`[API] ✓ Credentials validated successfully in ${duration}ms`);
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API] ✗ Credential validation failed after ${duration}ms:`,
      error.message
    );
    return false;
  }
}

async function listAllServers(ak, sk) {
  console.log("[API] Starting to list servers from all regions...");
  const startTime = Date.now();
  const allServers = [];

  // Query all regions in parallel for speed
  const regionPromises = REGIONS.map(async (region) => {
    try {
      // Skip if region is undefined
      if (!region || !region.id) {
        console.log(`[API] ⊘ Skipping undefined region`);
        return [];
      }

      const regionStartTime = Date.now();
      console.log(`[API] → Checking region: ${region.id}...`);

      const client = createClient(ak, sk, region);
      const request = new ListServersDetailsRequest();

      const response = await withTimeout(
        client.listServersDetails(request),
        10000,
        `List servers in ${region.id}`
      );
      const regionDuration = Date.now() - regionStartTime;

      if (response.servers && response.servers.length > 0) {
        console.log(
          `[API] ✓ Found ${response.servers.length} server(s) in ${region.id} (${regionDuration}ms)`
        );

        return response.servers.map((server) => {
          // Extract public/floating IP if available
          let publicIp = null;
          if (server.addresses) {
            // Addresses is an object with network names as keys
            for (const networkName in server.addresses) {
              const addresses = server.addresses[networkName];
              if (Array.isArray(addresses)) {
                // Find floating IP (OS-EXT-IPS:type === 'floating') or public IP
                const floatingIp = addresses.find(addr => 
                  addr['OS-EXT-IPS:type'] === 'floating' || 
                  addr.version === 4 && addr.addr && !addr.addr.startsWith('192.168.') && !addr.addr.startsWith('10.')
                );
                if (floatingIp && floatingIp.addr) {
                  publicIp = floatingIp.addr;
                  break;
                }
              }
            }
          }
          
          return {
            id: server.id,
            name: server.name,
            status: server.status,
            region: region.id,
            displayName: `${server.name} (${region.id})`,
            publicIp: publicIp
          };
        });
      } else {
        console.log(`[API] ○ No servers in ${region.id} (${regionDuration}ms)`);
        return [];
      }
    } catch (error) {
      const regionName = region?.id || "unknown";
      console.log(`[API] ⊘ Skipping region ${regionName}: ${error.message}`);
      return [];
    }
  });

  // Wait for all regions to complete in parallel
  const results = await Promise.all(regionPromises);
  const servers = results.flat();

  const totalDuration = Date.now() - startTime;
  const successCount = results.filter((r) => r.length > 0).length;
  const skipCount = REGIONS.length - results.filter((r) => r !== null).length;

  console.log(
    `[API] ✓ Listing complete: ${servers.length} total servers from ${successCount} regions (${skipCount} skipped) in ${totalDuration}ms`
  );

  return servers;
}

async function getServerStatus(ak, sk, serverId, regionId) {
  console.log(`[API] Getting status for server ${serverId} in ${regionId}...`);
  const startTime = Date.now();

  try {
    const region =
      REGIONS.find((r) => r.id === regionId) || EcsRegion.valueOf(regionId);
    const client = createClient(ak, sk, region);

    const request = new NovaShowServerRequest();
    request.serverId = serverId;

    const response = await withTimeout(
      client.novaShowServer(request),
      10000,
      `Get server status for ${serverId}`
    );
    const duration = Date.now() - startTime;

    console.log(
      `[API] ✓ Server status: ${response.server.status} (${duration}ms)`
    );
    return response.server.status;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API] ✗ Failed to get server status after ${duration}ms:`,
      error.message
    );
    throw error;
  }
}

async function waitForServerState(
  ak,
  sk,
  serverId,
  regionId,
  targetStates,
  timeoutMs = 60000
) {
  console.log(
    `[API] Waiting for server ${serverId} to reach state: ${targetStates.join(
      " or "
    )}...`
  );
  const startTime = Date.now();
  const checkInterval = 3000; // Check every 3 seconds

  while (true) {
    const elapsed = Date.now() - startTime;

    if (elapsed >= timeoutMs) {
      console.error(
        `[API] ✗ Timeout: Server did not reach target state after ${
          timeoutMs / 1000
        }s`
      );
      throw new Error(
        `Operation timed out after ${
          timeoutMs / 1000
        } seconds. Server may still be transitioning.`
      );
    }

    try {
      const status = await getServerStatus(ak, sk, serverId, regionId);

      if (targetStates.includes(status)) {
        const duration = Date.now() - startTime;
        console.log(
          `[API] ✓ Server reached target state: ${status} (${duration}ms)`
        );
        return status;
      }

      console.log(
        `[API] ⟳ Current state: ${status}, waiting... (${Math.round(
          elapsed / 1000
        )}s elapsed)`
      );
      await new Promise((resolve) => setTimeout(resolve, checkInterval));
    } catch (error) {
      console.error(`[API] ✗ Error checking server state:`, error.message);
      throw error;
    }
  }
}

async function startServer(ak, sk, serverId, regionId) {
  console.log(`[API] Starting server ${serverId} in ${regionId}...`);
  const startTime = Date.now();

  try {
    const region =
      REGIONS.find((r) => r.id === regionId) || EcsRegion.valueOf(regionId);
    const client = createClient(ak, sk, region);

    const osStart = new BatchStartServersOption();
    osStart.servers = [{ id: serverId }];

    const body = new BatchStartServersRequestBody();
    body.osStart = osStart;

    const request = new BatchStartServersRequest();
    request.body = body;

    await withTimeout(
      client.batchStartServers(request),
      15000,
      `Start server ${serverId}`
    );
    const duration = Date.now() - startTime;

    console.log(
      `[API] ✓ Server start command sent successfully (${duration}ms)`
    );

    // Wait for server to actually start (with 60s timeout)
    await waitForServerState(
      ak,
      sk,
      serverId,
      regionId,
      ["ACTIVE", "RUNNING"],
      60000
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API] ✗ Failed to start server after ${duration}ms:`,
      error.message
    );
    throw error;
  }
}

async function stopServer(ak, sk, serverId, regionId) {
  console.log(`[API] Stopping server ${serverId} in ${regionId}...`);
  const startTime = Date.now();

  try {
    const region =
      REGIONS.find((r) => r.id === regionId) || EcsRegion.valueOf(regionId);
    const client = createClient(ak, sk, region);

    const osStop = new BatchStopServersOption();
    osStop.servers = [{ id: serverId }];
    osStop.type = "SOFT"; // Use string instead of TypeEnum

    const body = new BatchStopServersRequestBody();
    body.osStop = osStop;

    const request = new BatchStopServersRequest();
    request.body = body;

    await withTimeout(
      client.batchStopServers(request),
      15000,
      `Stop server ${serverId}`
    );
    const duration = Date.now() - startTime;

    console.log(
      `[API] ✓ Server stop command sent successfully (${duration}ms)`
    );

    // Wait for server to actually stop (with 60s timeout)
    await waitForServerState(
      ak,
      sk,
      serverId,
      regionId,
      ["SHUTOFF", "STOPPED"],
      60000
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(
      `[API] ✗ Failed to stop server after ${duration}ms:`,
      error.message
    );
    throw error;
  }
}

// Get user's public IP
async function getPublicIp() {
  const https = require('https');
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.ip);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

// Create temporary security group with user's IP
async function createTempSecurityGroup(ak, sk, serverId, regionId, userIp) {
  console.log(`[API] Creating temporary security group for ${userIp}...`);
  const startTime = Date.now();

  try {
    const region = REGIONS.find((r) => r.id === regionId) || EcsRegion.valueOf(regionId);
    console.log(`[API] Region: ${region.id}, Endpoint: ${region.endpoint}`);
    
    const vpcClient = createVpcClient(ak, sk, region);
    const ecsClient = createClient(ak, sk, region);

    // Create security group
    const timestamp = Date.now();
    const sgRequest = new CreateSecurityGroupRequest();
    const sgBody = new CreateSecurityGroupRequestBody();
    const sgOption = new CreateSecurityGroupOption();
    sgOption.name = `temp-access-${timestamp}`;
    sgOption.description = `Temporary access for ${userIp}`;
    sgBody.security_group = sgOption;
    sgRequest.body = sgBody;

    console.log(`[API] Sending security group create request...`);
    const sgResponse = await withTimeout(
      vpcClient.createSecurityGroup(sgRequest),
      15000,
      "Create security group"
    );
    const sgId = sgResponse.security_group.id;
    const sgName = `temp-access-${timestamp}`;
    console.log(`[API] ✓ Created security group: ${sgId} (${sgName})`);

    // Add ingress rule for all ports from user's IP
    const ruleRequest = new CreateSecurityGroupRuleRequest();
    const ruleBody = new CreateSecurityGroupRuleRequestBody();
    const ruleOption = new CreateSecurityGroupRuleOption();
    ruleOption.security_group_id = sgId;
    ruleOption.direction = 'ingress';
    ruleOption.ethertype = 'IPv4';
    ruleOption.protocol = 'tcp';
    ruleOption.remote_ip_prefix = `${userIp}/32`;
    ruleOption.description = `Temp access from ${userIp}`;
    ruleBody.security_group_rule = ruleOption;
    ruleRequest.body = ruleBody;

    await withTimeout(
      vpcClient.createSecurityGroupRule(ruleRequest),
      15000,
      "Create security group rule"
    );
    console.log(`[API] ✓ Added rule for ${userIp}`);

    // Associate security group with server
    const assocRequest = new NovaAssociateSecurityGroupRequest();
    assocRequest.serverId = serverId;
    const assocBody = new NovaAssociateSecurityGroupRequestBody();
    assocBody.addSecurityGroup = { name: sgOption.name };
    assocRequest.body = assocBody;

    await withTimeout(
      ecsClient.novaAssociateSecurityGroup(assocRequest),
      15000,
      "Associate security group"
    );

    const duration = Date.now() - startTime;
    console.log(`[API] ✓ Security group associated (${duration}ms)`);
    
    // Return both ID and name for cleanup
    return { sgId, sgName };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] ✗ Failed to create security group after ${duration}ms:`, error.message);
    throw error;
  }
}

// Remove temporary security group
async function removeTempSecurityGroup(ak, sk, serverId, regionId, sgId, sgName) {
  console.log(`[API] Removing temporary security group ${sgId} (${sgName})...`);
  const startTime = Date.now();

  try {
    const region = REGIONS.find((r) => r.id === regionId) || EcsRegion.valueOf(regionId);
    const vpcClient = createVpcClient(ak, sk, region);
    const ecsClient = createClient(ak, sk, region);

    // First, disassociate from server using the security group name
    console.log(`[API] Step 1: Disassociating security group ${sgName} from server ${serverId}...`);
    const disassocRequest = new NovaDisassociateSecurityGroupRequest();
    disassocRequest.serverId = serverId;
    const disassocBody = new NovaDisassociateSecurityGroupRequestBody();
    disassocBody.removeSecurityGroup = { name: sgName };
    disassocRequest.body = disassocBody;

    await withTimeout(
      ecsClient.novaDisassociateSecurityGroup(disassocRequest),
      15000,
      "Disassociate security group"
    );
    console.log(`[API] ✓ Security group disassociated from server`);
    
    // Wait for the disassociation to fully propagate
    console.log(`[API] Step 2: Waiting 5 seconds for disassociation to propagate...`);
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete security group
    console.log(`[API] Step 3: Deleting security group ${sgId}...`);
    const deleteRequest = new DeleteSecurityGroupRequest();
    deleteRequest.securityGroupId = sgId;

    await withTimeout(
      vpcClient.deleteSecurityGroup(deleteRequest),
      15000,
      "Delete security group"
    );

    const duration = Date.now() - startTime;
    console.log(`[API] ✓ Security group deleted successfully (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[API] ✗ Failed to remove security group after ${duration}ms:`, error.message);
    console.error(`[API] Error details:`, error);
    // Don't throw - cleanup failure shouldn't block server stop
  }
}

module.exports = {
  validateCredentials,
  listAllServers,
  getServerStatus,
  startServer,
  stopServer,
  getPublicIp,
  createTempSecurityGroup,
  removeTempSecurityGroup
};

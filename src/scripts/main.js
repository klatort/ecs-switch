let currentServer = null;
let servers = [];
let isOperating = false;
let factInterval = null;
// Track security groups per server ID
const serverSecurityGroups = new Map(); // Map<serverId, {sgId, sgName}>
// Track operation states per server ID
const serverOperations = new Map(); // Map<serverId, {operation: 'start'|'stop', startTime: number}>

// Load persisted security groups from localStorage
function loadSecurityGroups() {
  try {
    const saved = localStorage.getItem('serverSecurityGroups');
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.entries(parsed).forEach(([serverId, sgInfo]) => {
        serverSecurityGroups.set(serverId, sgInfo);
      });
      console.log(`[UI] Loaded ${serverSecurityGroups.size} persisted security group(s)`);
    }
  } catch (error) {
    console.error('[UI] Failed to load persisted security groups:', error);
  }
}

// Save security groups to localStorage
function saveSecurityGroups() {
  try {
    const obj = Object.fromEntries(serverSecurityGroups);
    localStorage.setItem('serverSecurityGroups', JSON.stringify(obj));
  } catch (error) {
    console.error('[UI] Failed to save security groups:', error);
  }
}

// Load persisted operation states from localStorage
function loadOperationStates() {
  try {
    const saved = localStorage.getItem('serverOperations');
    if (saved) {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      Object.entries(parsed).forEach(([serverId, opState]) => {
        // Only restore if less than 5 minutes old (prevent stale states)
        if (now - opState.startTime < 5 * 60 * 1000) {
          serverOperations.set(serverId, opState);
        }
      });
      console.log(`[UI] Loaded ${serverOperations.size} active operation(s)`);
    }
  } catch (error) {
    console.error('[UI] Failed to load persisted operation states:', error);
  }
}

// Save operation states to localStorage
function saveOperationStates() {
  try {
    const obj = Object.fromEntries(serverOperations);
    localStorage.setItem('serverOperations', JSON.stringify(obj));
  } catch (error) {
    console.error('[UI] Failed to save operation states:', error);
  }
}

// IT facts (inline to avoid require() in renderer process)
const IT_FACTS = [
  "The first computer bug was an actual moth found in a relay of the Harvard Mark II computer in 1947.",
  "The first 1GB hard drive weighed over 500 pounds and cost $40,000.",
  "Python is named after Monty Python's Flying Circus, not the snake.",
  "The first computer mouse was made of wood and had only one button.",
  "CAPTCHA stands for 'Completely Automated Public Turing test to tell Computers and Humans Apart'.",
  "The first email was sent by Ray Tomlinson to himself in 1971.",
  "The QWERTY keyboard layout was designed to slow down typing to prevent typewriter jams.",
  "The first webcam was created at Cambridge University to monitor a coffee pot.",
  "The first computer programmer was Ada Lovelace in the 1840s.",
  "Google's name is a misspelling of 'googol', which is the number 1 followed by 100 zeros.",
  "The Firefox logo isn't a fox – it's actually a red panda.",
  "Approximately 90% of the world's currency only exists on computers.",
  "The first Apple computer was sold for $666.66.",
  "Email existed before the World Wide Web.",
  "The first computer game was created in 1961 and was called 'Spacewar!'.",
  "HP, Microsoft, and Apple all started in garages.",
  "The term 'debugging' comes from Admiral Grace Hopper removing a moth from a computer.",
  "The first YouTube video was uploaded on April 23, 2005, titled 'Me at the zoo'.",
  "The 'Save' icon in most programs is a floppy disk, which many young people have never seen.",
  "The first tweet ever was sent by Jack Dorsey on March 21, 2006: 'just setting up my twttr'.",
  "Doug Engelbart created the first computer mouse in 1964, and it was made of wood.",
  "The name 'Bluetooth' comes from a 10th-century Danish king, Harald Bluetooth.",
  "Linux is named after its creator, Linus Torvalds.",
  "The 'Ctrl + Alt + Delete' command was created by IBM developer David Bradley.",
  "The average smartphone has more computing power than the computers used for Apollo 11.",
  "There are approximately 3.5 billion Google searches per day.",
  "The first computer to beat a world chess champion was IBM's Deep Blue in 1997.",
  "The term 'spam' for junk email comes from a Monty Python sketch.",
  "Amazon was originally called 'Cadabra' as in 'abracadabra'.",
  "The @ symbol was first used in email addresses in 1971.",
  "The first SMS text message was sent in 1992 and read 'Merry Christmas'.",
  "JavaScript was created in just 10 days by Brendan Eich.",
  "The term 'cookie' in web browsing comes from 'magic cookie', a Unix programming term.",
  "The USB symbol represents Neptune's trident, showing its 'universal' power.",
  "The first website went live on August 6, 1991.",
  "There are more transistors in a modern CPU than there are people on Earth.",
  "The term 'bit' is short for 'binary digit'.",
  "The first emoji was created in 1999 by Shigetaka Kurita in Japan.",
  "The term 'booting' a computer comes from 'bootstrapping'.",
  "The first computer to pass the Turing test was Eugene Goostman in 2014.",
  "The dark web makes up only 0.01% of the deep web.",
  "The first electronic spreadsheet program was VisiCalc in 1979.",
  "The term 'malware' is a combination of 'malicious' and 'software'.",
  "The term 'phishing' comes from 'fishing' for information using email as bait.",
  "There are more than 100,000 cybersecurity job openings in the US alone.",
  "The average person checks their phone 58 times a day.",
  "Approximately 6,000 new computer viruses are released every month.",
  "YouTube users upload 500 hours of video every minute.",
  "More people in the world own a mobile phone than a toothbrush.",
  "Approximately 90% of text messages are read within 3 minutes of being sent.",
  "The first computer worm infected 10% of all internet-connected computers in 1988.",
  "Over 3.8 billion people use social media worldwide.",
  "The term 'firewall' comes from physical barriers used to prevent fires from spreading.",
  "Amazon sells more items per second during peak hours than some stores sell in a year.",
  "Every minute, more than 500 hours of video are uploaded to YouTube.",
  "The average smartphone user touches their phone 2,617 times a day.",
  "More than 4 million blog posts are published every day.",
  "The average person spends more time on their phone than sleeping.",
  "Over 200 billion emails are sent every day.",
  "The average website takes 3 seconds to load, but 40% of users abandon it if longer.",
  "The world's first website is still online: info.cern.ch",
  "The first hard disk drive was made by IBM in 1956 and could store 5MB of data.",
  "The first digital camera was invented in 1975 and weighed 8 pounds.",
  "The first graphical user interface was created by Xerox in the 1970s.",
  "The first video game console was the Magnavox Odyssey, released in 1972.",
  "The first smartphone, IBM Simon, was released in 1994 and cost $899.",
  "The first social media site was Six Degrees, launched in 1997.",
  "The first computer with a color display was the Apple II in 1977.",
  "The first laptop computer was the Osborne 1, which weighed 24 pounds.",
  "The first popular web browser was Mosaic, released in 1993.",
  "The first computer with a gigabyte of RAM wasn't available until the late 1980s.",
  "The first computer with a CD-ROM drive was released in 1985.",
  "The average webpage size has increased by 300% in the last 10 years.",
  "The first computer with a touchscreen was the HP-150 in 1983.",
  "The average office worker will spend about 50% of their time on email.",
  "More than 80% of all emails sent daily are spam.",
  "The term 'bug' was used to describe technical errors even before computers existed.",
  "The first computer password was created at MIT in the early 1960s.",
  "The first programming language was FORTRAN, created in 1957.",
  "The average person will spend 7 years of their life looking at screens.",
  "The first computer animation was created in 1963.",
  "Sweden has the highest percentage of internet users in the world.",
  "Nintendo was founded in 1889 as a playing card company.",
  "The first banner ad appeared on the web in 1994 and had a 44% click-through rate.",
  "There are more than 1.5 billion websites, but only about 200 million are active.",
  "The IBM 5100 was the first portable computer, weighing 55 pounds.",
  "The first VCR, made in 1956, was the size of a piano.",
  "The first computer, ENIAC, weighed 30 tons and took up 1800 square feet.",
  "The average computer user blinks 7 times a minute, less than half the normal rate.",
  "The first iPod had a storage capacity of only 5GB.",
  "The average office worker receives 121 emails per day.",
  "The term 'cloud computing' was inspired by the cloud symbol used in flowcharts.",
  "Wi-Fi doesn't stand for anything – it's just a trademarked name.",
  "The @ symbol is called 'at' in English, but 'little mouse' in Chinese.",
  "The most expensive domain name ever sold was CarInsurance.com for $49.7 million.",
  "The first alarm clock could only ring at 4 a.m.",
  "If you open a calculator and type 5318008 then flip it, it spells 'BOOBIES'.",
  "A group of 12 or more servers is called a 'cluster'.",
  "The average person will click their mouse over 20 million times in their lifetime.",
  "The average person will type approximately 30,000 words per month.",
  "The average person will spend 2 years of their life watching YouTube videos.",
  "The average person will spend 5 years and 4 months of their lifetime on social media.",
];

// DOM Elements
const serverSelect = document.getElementById("serverSelect");
const ignitionButton = document.getElementById("ignitionButton");
const buttonIcon = document.getElementById("buttonIcon");
const statusText = document.getElementById("statusText");
const itFact = document.getElementById("itFact");
const errorDisplay = document.getElementById("errorDisplay");
const loadingOverlay = document.getElementById("loadingOverlay");
const logoutButton = document.getElementById("logoutButton");
const closeButton = document.getElementById("closeButton");
const ipContainer = document.getElementById("ipContainer");
const ipText = document.getElementById("ipText");
const copyIpButton = document.getElementById("copyIpButton");
const autoIpToggle = document.getElementById("autoIpToggle");

// Initialize
async function init() {
  showLoading(true);

  // Load saved auto-IP preference
  const autoIpEnabled = localStorage.getItem("autoIpEnabled") === "true";
  autoIpToggle.checked = autoIpEnabled;

  // Load persisted security groups
  loadSecurityGroups();
  
  // Load persisted operation states
  loadOperationStates();

  await loadServers();
  
  // Clean up orphaned security groups (servers that are stopped)
  if (autoIpEnabled && serverSecurityGroups.size > 0) {
    cleanupOrphanedSecurityGroups();
  }
  
  showLoading(false);
}

// Clean up security groups for servers that are stopped
async function cleanupOrphanedSecurityGroups() {
  console.log('[UI] Checking for orphaned security groups...');
  const toRemove = [];
  
  for (const [serverId, sgInfo] of serverSecurityGroups.entries()) {
    const server = servers.find(s => s.id === serverId);
    
    if (server) {
      const status = server.status.toUpperCase();
      // If server is stopped, remove its security group
      if (status === 'SHUTOFF' || status === 'STOPPED') {
        console.log(`[UI] Found orphaned security group for stopped server ${serverId}`);
        toRemove.push({ serverId, server, sgInfo });
      }
    } else {
      // Server not found (deleted?), remove security group reference
      console.log(`[UI] Found security group for non-existent server ${serverId}, removing reference`);
      serverSecurityGroups.delete(serverId);
      saveSecurityGroups();
    }
  }
  
  // Remove orphaned security groups
  for (const { serverId, server, sgInfo } of toRemove) {
    try {
      console.log(`[UI] Cleaning up security group ${sgInfo.sgId} for server ${serverId}...`);
      const result = await window.electronAPI.removeTempSecurityGroup({
        serverId,
        region: server.region,
        sgId: sgInfo.sgId,
        sgName: sgInfo.sgName,
      });
      
      if (result.success) {
        serverSecurityGroups.delete(serverId);
        saveSecurityGroups();
        console.log(`[UI] ✓ Cleaned up orphaned security group ${sgInfo.sgId}`);
      } else {
        console.error(`[UI] ✗ Failed to clean up security group ${sgInfo.sgId}:`, result.error);
      }
    } catch (error) {
      console.error(`[UI] Error cleaning up security group for ${serverId}:`, error);
    }
  }
}

// Save auto-IP toggle state
autoIpToggle.addEventListener("change", () => {
  localStorage.setItem("autoIpEnabled", autoIpToggle.checked);
});

// Load servers from all regions
async function loadServers() {
  try {
    const result = await window.electronAPI.getServers();

    if (result.success) {
      servers = result.servers;

      serverSelect.innerHTML = "";

      if (servers.length === 0) {
        serverSelect.innerHTML = '<option value="">No servers found</option>';
        serverSelect.disabled = true;
      } else {
        serverSelect.innerHTML = '<option value="">Select a server...</option>';

        // Group servers by region
        const serversByRegion = {};
        servers.forEach((server) => {
          if (!serversByRegion[server.region]) {
            serversByRegion[server.region] = [];
          }
          serversByRegion[server.region].push(server);
        });

        // Sort regions alphabetically
        const sortedRegions = Object.keys(serversByRegion).sort();

        // Add servers grouped by region with optgroup
        sortedRegions.forEach((region) => {
          const optgroup = document.createElement("optgroup");
          optgroup.label = `${region} (${serversByRegion[region].length})`;

          serversByRegion[region].forEach((server) => {
            const option = document.createElement("option");
            option.value = JSON.stringify({
              id: server.id,
              region: server.region,
            });

            // Add status indicator
            const status = server.status.toUpperCase();
            let indicator = "⚪"; // Default/unknown
            if (status === "ACTIVE" || status === "RUNNING") {
              indicator = "🟢"; // Running - green circle
            } else if (status === "SHUTOFF" || status === "STOPPED") {
              indicator = "🔴"; // Stopped - red circle
            } else {
              indicator = "🟠"; // Transitioning - orange circle
            }

            option.textContent = `${indicator} ${server.name}`;
            optgroup.appendChild(option);
          });

          serverSelect.appendChild(optgroup);
        });

        serverSelect.disabled = false;
      }
    } else {
      showError("Failed to load servers: " + result.error);
    }
  } catch (error) {
    console.error("Error loading servers:", error);
    showError("Failed to load servers. Please try again.");
  }
}

// Server selection handler
serverSelect.addEventListener("change", async (e) => {
  const value = e.target.value;

  if (!value) {
    currentServer = null;
    isOperating = false;
    clearInterval(factInterval);
    hideFact();
    resetButton();
    hideElasticIp();
    return;
  }

  try {
    const serverInfo = JSON.parse(value);
    const server = servers.find((s) => s.id === serverInfo.id);

    if (server) {
      currentServer = server;
      
      // Check if this server has an active operation
      const activeOp = serverOperations.get(server.id);
      if (activeOp) {
        console.log(`[UI] Server ${server.id} has active ${activeOp.operation} operation`);
        isOperating = true;
        
        // Show working state with IT facts
        ignitionButton.classList.remove("state-off", "state-on");
        ignitionButton.classList.add("state-working");
        statusText.textContent = activeOp.operation === "start" ? "Starting..." : "Stopping...";
        statusText.classList.remove("status-running", "status-stopped");
        statusText.classList.add("status-working");
        
        // Show IT facts
        if (!factInterval) {
          showRandomFact();
          factInterval = setInterval(showRandomFact, 8000);
        }
        
        // Hide IP while operating
        hideElasticIp();
      } else {
        // No active operation, show cached state immediately
        isOperating = false;
        clearInterval(factInterval);
        factInterval = null;
        hideFact();
        updateButtonState(server.status);
        updateElasticIpDisplay(server.publicIp);
      }
      
      // Then fetch fresh status in background
      updateServerStatus().catch(error => {
        console.error("Error updating server status:", error);
      });
    }
  } catch (error) {
    console.error("Error selecting server:", error);
    showError("Failed to select server.");
  }
});

// Copy IP button handler
copyIpButton.addEventListener("click", async () => {
  if (!currentServer || !currentServer.publicIp) return;

  try {
    await navigator.clipboard.writeText(currentServer.publicIp);

    // Visual feedback
    copyIpButton.classList.add("copied");
    const originalHTML = copyIpButton.innerHTML;
    copyIpButton.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    setTimeout(() => {
      copyIpButton.classList.remove("copied");
      copyIpButton.innerHTML = originalHTML;
    }, 1500);
  } catch (error) {
    console.error("Error copying IP:", error);
    showError("Failed to copy IP address.");
  }
});

// Update Elastic IP display
function updateElasticIpDisplay(publicIp) {
  if (publicIp) {
    ipText.textContent = publicIp;
    ipContainer.style.display = "block";
  } else {
    hideElasticIp();
  }
}

// Hide Elastic IP display
function hideElasticIp() {
  ipContainer.style.display = "none";
  ipText.textContent = "-";
}

// Update server status
async function updateServerStatus() {
  if (!currentServer) return;

  try {
    const result = await window.electronAPI.getServerStatus({
      serverId: currentServer.id,
      region: currentServer.region,
    });

    if (result.success) {
      // Only update button state if this server is NOT currently operating
      const isCurrentlyOperating = serverOperations.has(currentServer.id);
      if (!isCurrentlyOperating) {
        updateButtonState(result.status);
      }
    } else {
      showError("Failed to get server status: " + result.error);
    }
  } catch (error) {
    console.error("Error getting server status:", error);
    showError("Failed to get server status.");
  }
}

// Update button state based on server status
function updateButtonState(status) {
  ignitionButton.disabled = false;
  ignitionButton.classList.remove("state-off", "state-on", "state-working");
  statusText.classList.remove(
    "status-running",
    "status-stopped",
    "status-working"
  );

  const upperStatus = status.toUpperCase();

  if (upperStatus === "ACTIVE" || upperStatus === "RUNNING") {
    ignitionButton.classList.add("state-on");
    statusText.textContent = "Running";
    statusText.classList.add("status-running");
    
    // Show IP when running and not operating
    if (currentServer && currentServer.publicIp && !serverOperations.has(currentServer.id)) {
      updateElasticIpDisplay(currentServer.publicIp);
    }
  } else if (upperStatus === "SHUTOFF" || upperStatus === "STOPPED") {
    ignitionButton.classList.add("state-off");
    statusText.textContent = "Stopped";
    statusText.classList.add("status-stopped");
    
    // Show IP when stopped and not operating
    if (currentServer && currentServer.publicIp && !serverOperations.has(currentServer.id)) {
      updateElasticIpDisplay(currentServer.publicIp);
    }
  } else {
    // Transitioning state
    ignitionButton.classList.add("state-working");
    statusText.textContent =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    statusText.classList.add("status-working");

    // Poll for status update
    setTimeout(() => updateServerStatus(), 3000);
  }
}

// Ignition button click handler
ignitionButton.addEventListener("click", async () => {
  if (!currentServer) return;
  
  // Check if THIS server is operating (not just any server)
  const thisServerOperating = serverOperations.has(currentServer.id);
  if (thisServerOperating) {
    console.log(`[UI] Server ${currentServer.id} is already performing an operation`);
    return;
  }

  const currentStatus = getCurrentButtonState();

  if (currentStatus === "on") {
    // Stop server
    await performServerOperation("stop");
  } else if (currentStatus === "off") {
    // Start server
    await performServerOperation("start");
  }
});

// Copy IP button handler
copyIpButton.addEventListener("click", async () => {
  if (!currentServer || !currentServer.publicIp) return;

  try {
    await navigator.clipboard.writeText(currentServer.publicIp);

    // Visual feedback
    copyIpButton.classList.add("copied");
    const originalHTML = copyIpButton.innerHTML;
    copyIpButton.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>';

    setTimeout(() => {
      copyIpButton.classList.remove("copied");
      copyIpButton.innerHTML = originalHTML;
    }, 1500);
  } catch (error) {
    console.error("Error copying IP:", error);
    showError("Failed to copy IP address.");
  }
});

// Get current button state
function getCurrentButtonState() {
  if (ignitionButton.classList.contains("state-on")) return "on";
  if (ignitionButton.classList.contains("state-off")) return "off";
  return "working";
}

// Perform server operation
async function performServerOperation(operation) {
  const operatingServerId = currentServer.id;
  console.log(`[UI] Starting ${operation} operation for server ${operatingServerId}`);
  isOperating = true;
  hideError();

  // Track this operation for this server
  serverOperations.set(operatingServerId, {
    operation,
    startTime: Date.now()
  });
  saveOperationStates();

  // Set working state
  ignitionButton.classList.remove("state-off", "state-on");
  ignitionButton.classList.add("state-working");
  statusText.textContent =
    operation === "start" ? "Starting..." : "Stopping...";
  statusText.classList.remove("status-running", "status-stopped");
  statusText.classList.add("status-working");

  // Show IT facts while waiting
  showRandomFact();
  factInterval = setInterval(showRandomFact, 8000); // Change fact every 8 seconds

  try {
    // If auto-IP is enabled and starting, create security group first
    if (operation === "start" && autoIpToggle.checked) {
      console.log(`[UI] Auto-IP enabled, creating security group...`);
      statusText.textContent = "Setting up security...";
      const ipResult = await window.electronAPI.getPublicIp();

      if (ipResult.success) {
        console.log(`[UI] Public IP retrieved: ${ipResult.ip}`);
        const sgResult = await window.electronAPI.createTempSecurityGroup({
          serverId: operatingServerId,
          region: currentServer.region,
          userIp: ipResult.ip,
        });

        if (sgResult.success) {
          // Store security group info per server
          serverSecurityGroups.set(operatingServerId, {
            sgId: sgResult.sgId,
            sgName: sgResult.sgName
          });
          saveSecurityGroups(); // Persist to localStorage
          console.log(
            `[UI] Temporary security group created: ${sgResult.sgId} (${sgResult.sgName})`
          );
        } else {
          console.error(`[UI] Failed to create security group:`, sgResult.error);
        }
      } else {
        console.error(`[UI] Failed to get public IP:`, ipResult.error);
      }
      statusText.textContent = "Starting...";
    }

    if (operation === "stop" && autoIpToggle.checked) {
      // Get the security group for this specific server
      const sgInfo = serverSecurityGroups.get(operatingServerId);
      
      if (sgInfo) {
        console.log(`[UI] Auto-IP enabled, removing security group...`);
        statusText.textContent = "Cleaning up security...";
        console.log(
          `[UI] Removing temporary security group: ${sgInfo.sgId} (${sgInfo.sgName})`
        );
        const sgResult = await window.electronAPI.removeTempSecurityGroup({
          serverId: operatingServerId,
          region: currentServer.region,
          sgId: sgInfo.sgId,
          sgName: sgInfo.sgName,
        });

        if (sgResult.success) {
          // Remove from the map
          serverSecurityGroups.delete(operatingServerId);
          saveSecurityGroups(); // Persist to localStorage
          console.log(
            `[UI] Temporary security group removed: ${sgInfo.sgId} (${sgInfo.sgName})`
          );
        } else {
          console.error(`[UI] Failed to remove security group:`, sgResult.error);
          // Don't remove from map if removal failed - keep for retry
        }
      } else {
        console.log(`[UI] No security group found for this server`);
      }
      statusText.textContent = "Stopping...";
    }

    console.log(`[UI] Calling ${operation} API...`);
    const apiCall =
      operation === "start"
        ? window.electronAPI.startServer
        : window.electronAPI.stopServer;

    const result = await apiCall({
      serverId: operatingServerId,
      region: currentServer.region,
    });

    console.log(`[UI] ${operation} API result:`, result);

    // Clear operation tracking for this server
    serverOperations.delete(operatingServerId);
    saveOperationStates();

    // Stop showing facts
    clearInterval(factInterval);
    factInterval = null;
    hideFact();

    if (result.success) {
      console.log(`[UI] ${operation} operation completed successfully`);
      // Server operation completed successfully (state confirmed)
      
      // Only update UI if this is still the currently selected server
      if (currentServer && currentServer.id === operatingServerId) {
        await updateServerStatus();
      }
      
      // Refresh dropdown to update indicators
      await refreshDropdownIndicators();
      
      // Clear isOperating flag only if no other servers are operating
      isOperating = serverOperations.size > 0;
    } else {
      console.error(`[UI] ${operation} operation failed:`, result.error);
      // Handle error (including timeout errors)
      const isTimeout = result.error && result.error.includes("timed out");
      const errorPrefix = isTimeout
        ? "Operation timed out"
        : `Failed to ${operation} server`;
      showError(`${errorPrefix}: ${result.error}`);

      // Update status to show current state (might be different than expected)
      // Only update UI if this is still the currently selected server
      if (currentServer && currentServer.id === operatingServerId) {
        await updateServerStatus();
      }
      
      // Refresh dropdown to update indicators
      await refreshDropdownIndicators();
      
      // Clear isOperating flag only if no other servers are operating
      isOperating = serverOperations.size > 0;
    }
  } catch (error) {
    console.error(`[UI] Error ${operation}ing server:`, error);
    showError(`Failed to ${operation} server. Please try again.`);

    // Clear operation tracking for this server
    serverOperations.delete(operatingServerId);
    saveOperationStates();

    // Stop showing facts
    clearInterval(factInterval);
    factInterval = null;
    hideFact();

    // Only update UI if this is still the currently selected server
    if (currentServer && currentServer.id === operatingServerId) {
      await updateServerStatus();
    }
    
    // Refresh dropdown to update indicators
    await refreshDropdownIndicators();
    
    // Clear isOperating flag only if no other servers are operating
    isOperating = serverOperations.size > 0;
  }
}

// Refresh dropdown indicators after status change
async function refreshDropdownIndicators() {
  const selectedValue = serverSelect.value;
  await loadServers();
  // Restore selection
  if (selectedValue) {
    serverSelect.value = selectedValue;
  }
}

// Show random IT fact
function showRandomFact() {
  const randomIndex = Math.floor(Math.random() * IT_FACTS.length);
  itFact.textContent = IT_FACTS[randomIndex];
  itFact.classList.add("show");
  // Hide IP when showing fact
  ipContainer.style.display = "none";
}

// Hide IT fact
function hideFact() {
  itFact.classList.remove("show");
  // Show IP again if available
  if (currentServer && currentServer.publicIp) {
    ipContainer.style.display = "block";
  }
}

// Reset button to default state
function resetButton() {
  ignitionButton.disabled = true;
  ignitionButton.classList.remove("state-off", "state-on", "state-working");
  statusText.textContent = "No server selected";
  statusText.classList.remove(
    "status-running",
    "status-stopped",
    "status-working"
  );
  hideElasticIp();
}

// Update Elastic IP display
function updateElasticIpDisplay(publicIp) {
  if (publicIp) {
    ipText.textContent = publicIp;
    ipContainer.style.display = "block";
  } else {
    hideElasticIp();
  }
}

// Hide Elastic IP display
function hideElasticIp() {
  ipContainer.style.display = "none";
  ipText.textContent = "-";
}

// Show/hide loading overlay
function showLoading(show) {
  if (show) {
    loadingOverlay.classList.add("show");
  } else {
    loadingOverlay.classList.remove("show");
  }
}

// Show error message
function showError(message) {
  errorDisplay.textContent = message;
  errorDisplay.classList.add("show");

  setTimeout(() => {
    hideError();
  }, 5000);
}

// Hide error message
function hideError() {
  errorDisplay.classList.remove("show");
}

// Close button handler
closeButton.addEventListener("click", () => {
  // Warn if there are active security groups
  if (serverSecurityGroups.size > 0) {
    const shouldClose = confirm(
      `You have ${serverSecurityGroups.size} active security group(s).\n\n` +
      `They will be cleaned up automatically on next launch.\n\n` +
      `Are you sure you want to close the app?`
    );
    if (!shouldClose) return;
  }
  
  window.close();
});

// Auto-refresh server status every 30 seconds if a server is selected
setInterval(() => {
  if (currentServer && !isOperating) {
    updateServerStatus();
  }
}, 30000);

// Auto-refresh dropdown indicators every 30 seconds
setInterval(async () => {
  if (!isOperating) {
    await loadServers();
    // Restore selection if a server was selected
    if (currentServer) {
      const optionValue = JSON.stringify({
        id: currentServer.id,
        region: currentServer.region,
      });
      serverSelect.value = optionValue;
    }
  }
}, 30000);

// Handle logout - offer to clean up security groups first
const originalLogout = logoutButton.onclick;
logoutButton.onclick = null;
logoutButton.addEventListener('click', async (e) => {
  e.preventDefault();
  
  if (serverSecurityGroups.size > 0) {
    const shouldCleanup = confirm(
      `You have ${serverSecurityGroups.size} active security group(s).\n\n` +
      `Do you want to clean them up before logging out?\n` +
      `(They will be cleaned up automatically on next login if you choose "Cancel")`
    );
    
    if (shouldCleanup) {
      showLoading(true);
      // Clean up all active security groups
      for (const [serverId, sgInfo] of serverSecurityGroups.entries()) {
        const server = servers.find(s => s.id === serverId);
        if (server) {
          try {
            await window.electronAPI.removeTempSecurityGroup({
              serverId,
              region: server.region,
              sgId: sgInfo.sgId,
              sgName: sgInfo.sgName,
            });
            serverSecurityGroups.delete(serverId);
          } catch (error) {
            console.error(`Failed to cleanup security group for ${serverId}:`, error);
          }
        }
      }
      saveSecurityGroups();
      showLoading(false);
    }
  }
  
  if (confirm("Are you sure you want to logout?")) {
    await window.electronAPI.logout();
  }
});

// Initialize on load
init();


// Existing code
let tabData = [];

// Save tabs at regular intervals (e.g., every 5 minutes)
setInterval(() => {
  saveTabs();
}, 5 * 60 * 1000);  // 5 minutes in milliseconds

// Save tabs when a new tab is activated or a tab is updated (navigated to a new page)
chrome.tabs.onActivated.addListener(() => {
  saveTabs();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    saveTabs();
  }
});

// Function to save the current tabs
function saveTabs() {
  chrome.tabs.query({ currentWindow: true }, function(tabs) {
    const tabUrls = tabs.map(tab => tab.url);
    chrome.storage.local.set({ currentTabs: tabUrls }, function() {
      console.log('Tabs saved automatically');
    });
  });
}

// Existing code for handling messages
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getTabs") {
    sendResponse({ tabs: tabData });
  } else if (request.action === "updateTabs") {
    tabData = request.tabs;
  }
});

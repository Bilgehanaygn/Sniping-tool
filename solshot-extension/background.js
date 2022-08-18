async function updateRules() {
  const res = await fetch("https://solshot.io/static/deneme.json");
  const options = await res.json();
  chrome.declarativeNetRequest.updateDynamicRules(options);
}

chrome.runtime.onInstalled.addListener(updateRules);
chrome.runtime.onStartup.addListener(updateRules);

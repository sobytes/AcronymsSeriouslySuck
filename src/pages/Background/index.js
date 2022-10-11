
chrome.runtime.onInstalled.addListener((details) => {
    chrome.storage.local.set({
        found: [],
        token: '',
        autorun: false,
        acronyms: false,
    });
    chrome.contextMenus.create({
        title: "Lookup Acronym",
        id: "SearchAcronymContextMenu",
        contexts: ["page", "selection"]
    });
});
chrome.contextMenus.onClicked.addListener((event) => {
    if (event.menuItemId === "SearchAcronymContextMenu") {
        chrome.tabs.create({
            url: `https://www.acronymsseriouslysuck.com/search/${event.selectionText.toLowerCase()}`
        });
    }
});
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
    if (data) {
        chrome.action.setBadgeBackgroundColor({ color: '#00FF00' })
        chrome.action.setBadgeText({
            tabId: sender.tab.id,
            text: String(data.found.length)
        });
        chrome.storage.local.set({
            found: data.found
        });
    }
    sendResponse({ received: true });
});
/* Initial Setup
–––––––––––––––––––––––––––––––––––––––––––––––––– */

init();

function init() {
    // By default set the onClicked action.
    var action = chrome.action != null ? chrome.action : chrome.browserAction;
    action.setPopup({popup:"popup.html"});
    setDefaultSettings();
    setContextMenus();
    setIcon();
    setUninstallPage();
}

function setUninstallPage() {
    chrome.runtime.setUninstallURL('https://dogecoin.com');
}

chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        chrome.tabs.create({ url: 'https://dogecoin.com' });
    } else if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
    }

    init();
})



/* Context Menus
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function setContextMenus() {
    chrome.contextMenus.removeAll()
};

/* Inject
–––––––––––––––––––––––––––––––––––––––––––––––––– */

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    var manifestData = chrome.runtime.getManifest();
    if(manifestData.manifest_version === 3){
        if (changeInfo.status === "complete") {
            // All Sites
            chrome.scripting.executeScript({
                target: { tabId: tabId, allFrames: true },
                files: [
                    "jquery-3.6.0.min.js"
                ],
            });

            // Specific Sites
            // Twitter
            if (/twitter\.com/.test(tab.url)) {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: ["dogecoin-twitter.js"],
                });
            }

        }
    }
});

/* Dark Mode Icon
–––––––––––––––––––––––––––––––––––––––––––––––––– */
function setIcon() {
    chrome.windows.getCurrent({}, function(currentWindow) {
        var isSystemDark = currentWindow.matchMedia && currentWindow.matchMedia('(prefers-color-scheme: dark)').matches;

        var action = chrome.action != null ? chrome.action : chrome.browserAction;

        if(isSystemDark) {
             action.setIcon({
                 path : {
                     "16": "icon16-dark.png",
                     "32": "icon32-dark.png",
                     "48": "icon48-dark.png",
                     "128": "icon128-dark.png"
                 }
             });
        }
    });
}

// Light/Dark Mode
chrome.runtime.onMessage.addListener((request) => {
    var action = chrome.action != null ? chrome.action : chrome.browserAction;

    action.setIcon({
        path:
        request.scheme === 'dark'
        ? {
            '16': 'icon16-dark.png',
            '32': 'icon32-dark.png',
            '48': 'icon48-dark.png',
            '128': 'icon128-dark.png',
        }
        : {
            '16': 'icon16.png',
            '32': 'icon32.png',
            '48': 'icon48.png',
            '128': 'icon128.png',
        },
    });
});


/* Default Settings
–––––––––––––––––––––––––––––––––––––––––––––––––– */

function setDefaultSettings() {
    chrome.storage.local.get("migrated", function(result) {

        if (JSON.stringify(result) === "{}") {
            var store = {};
            store['doge.op.tipindoge'] = 'tipindoge';
            store['migrated'] = true;

            chrome.storage.local.set(store, function() {

            });
        }
    });
}
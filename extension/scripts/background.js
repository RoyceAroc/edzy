/*
- if it's a pdf or something we can't inject into
  - we always open side panel
  - only context menu item selection works
  - if no selection, then open side panel ui which by default also has a crop button
- if we can inject, we show default view and have side panel option button 
- we wait for first 5 and choose best one
- once we get the rest we show the ui for the rest
- rmbr to ping server like every 5 mins to prevent cold start TBD
- fix css on iframe n shi
- &mute=1 works for real autoplay
- support white/dark mode
- redo controls on yt video
- make logo gold
- light mode/dark mode (default use browser one)
*/

let currentWindowId = 0;

function getSelection() {
  let selectionText = window.getSelection().toString();
  return selectionText; 
}
  chrome.action.onClicked.addListener(async (tab) => {
    chrome.storage.session.set({ selectionText: ""});
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSelection
    }, async (result) => {
      if(result != undefined) {
        chrome.storage.session.set({ selectionText: result[0].result});
        chrome.sidePanel.open({ windowId: tab.windowId });
      } else {
        chrome.storage.session.set({ selectionText: ""});
        chrome.sidePanel.open({ windowId: tab.windowId });
      }
    });
  });

  chrome.tabs.onActivated.addListener(function (info) {
    var tab = chrome.tabs.get(info.tabId, function (tab) {
        currentWindowId = tab.windowId;
    });
  });

  var contextMenuItem = {

    "id": "Selected",
    "title": "Search videos on Edzy",
    "contexts": ["selection"]
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "Selected",
    title: "Search videos on Edzy",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(clickData, tabId){
    if (clickData.menuItemId == "Selected" && clickData.selectionText) {
        result = clickData.selectionText;
        if(result != undefined) {
          chrome.storage.session.set({ selectionText: result});
          chrome.sidePanel.open({ windowId: currentWindowId });
        } else {
          chrome.storage.session.set({ selectionText: ""});
          chrome.sidePanel.open({ windowId: currentWindowId });
        }
    }
})

chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.service == "openai") {
      chrome.storage.session.set({ selectionText: request.query});
      chrome.sidePanel.open({ windowId: sender.tab.windowId});
      sendResponse({completed: "true"});
    }
  }
);
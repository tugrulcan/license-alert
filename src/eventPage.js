function getOwnerRepoFromUrl(url) {
    url = url.split('/');
    let owner = url[3];
    let repo = url[4];
    let owner_repo = null;

    if (owner !== undefined && repo !== undefined) {
        owner_repo = owner + "/" + repo;
    }
    return owner_repo;
}

function getRepoInfo(owner_repo, api_token, tab_id) {

    let repoInfo = {};
    let apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + api_token;
    let json = null;
    $.ajax({
            type: "GET",
            url: apiUrl,
            error: function (xhr, statusText) {
                repoInfo.license = xhr.responseJSON.message;
            },
            success: function (msg) {
                repoInfo.license = msg.license;
            },
            complete: function () {
                repoInfo.controlDate = (new Date()).getTime();
                repoInfo.ignore = false;
                chrome.storage.sync.set({[owner_repo]: repoInfo}, function () {
                });
                chrome.tabs.sendMessage(tab_id, {repoInfo: repoInfo});
                return repoInfo; // not returning!!!
            }
        });
}

function showRepoInfo(tab_id) {
    chrome.tabs.get(tab_id, function (tab) {
        chrome.pageAction.show(tab.id);
        let owner_repo = getOwnerRepoFromUrl(tab.url);
        let repoInfo = null;
        if (owner_repo) {
            chrome.storage.sync.get([owner_repo, "api_token"], function (items) {
                if (items[owner_repo]) { //if the repo info already exist
                    repoInfo = items[owner_repo];
                    let now = new Date();
                    let duration_in_mil = repoInfo.controlDate - now;
                    let days = Math.abs(Math.floor(duration_in_mil / (1000 * 24 * 60 * 60)));

                    if (days > 1) { // if repoInfo is expired
                        console.log("expired!");
                        getRepoInfo(owner_repo, items.api_token, tab.id);
                    } else if (repoInfo.ignore === false) {
                        chrome.tabs.sendMessage(tab.id, {repoInfo: repoInfo});
                    }
                }
                else {
                    getRepoInfo(owner_repo, items.api_token, tab.id);
                }

            });
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        //NOTE: "matches" in manifest.json is not effecting, so -unfortunately- check hostname here.
        let url = new URL(tab.url);
        let domain = url.hostname;
        if(domain === "github.com")
        {
            showRepoInfo(tabId);
        }
    }
});
function getOwnerRepoFromUrl(url) {
    url = url.split('/');
    var owner = url[3].toString();
    var repo = url[4].toString();
    var owner_repo = null;
    if (url.toString().includes("github.com")) {
        if (owner != undefined && repo != undefined) {
            owner_repo = owner + "/" + repo;
        }
    }

    return owner_repo;
}


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "show") {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.pageAction.show(tabs[0].id);

            var owner_repo = getOwnerRepoFromUrl(tabs[0].url);
            var repoInfo = null;
            if (owner_repo) {
                chrome.storage.sync.get([owner_repo, "api_token"], function (items) {
                    if (items[owner_repo]) { //if the repo info already exist
                        repoInfo = items[owner_repo];

                        var now = new Date();
                        var weeks = Math.abs(Math.round((repoInfo.controlDate - now) / 604800000));
                        if (weeks >= 3) { // if repoInfo is expired

                            var updated_repoInfo = {};
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                            var json = null;
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                if (this.status === 404) {
                                    // license not found
                                    updated_repoInfo.license = "notFound";
                                    updated_repoInfo.controlDate = (new Date()).getTime();
                                    updated_repoInfo.ignore = false;

                                    chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                    });
                                    chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                                }
                            }
                            xhr.open("GET", apiUrl, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    json = JSON.parse(xhr.response);
                                    updated_repoInfo.license = json.license;
                                    updated_repoInfo.controlDate = (new Date()).getTime();
                                    updated_repoInfo.ignore = false;
                                    chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                    });
                                    chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                                }
                            }
                            xhr.send();
                        } else if (repoInfo.ignore === false) {
                            chrome.tabs.sendMessage(tabs[0].id, {repoInfo: repoInfo});
                        }
                    }
                    else {
                        var new_repoInfo = {};
                        var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                        var json = null;
                        var xhr = new XMLHttpRequest();

                        xhr.onload = function () {
                            if (this.status === 404) {
                                // license not found
                                new_repoInfo.license = "notFound";
                                new_repoInfo.controlDate = (new Date()).getTime();
                                new_repoInfo.ignore = false;

                                chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                            }
                        }
                        xhr.open("GET", apiUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                json = JSON.parse(xhr.response);
                                new_repoInfo.license = json.license;
                                new_repoInfo.controlDate = (new Date()).getTime();
                                new_repoInfo.ignore = false;
                                chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                            }
                        }
                        xhr.send();
                    }

                });
            }

        });
    }

});


chrome.tabs.onActivated.addListener(function (activeInfo) {
    //alert(JSON.stringify(activeInfo));//activeInfo içerisinde tabID var zaten.

    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.pageAction.show(tabs[0].id);
        var owner_repo = getOwnerRepoFromUrl(tabs[0].url);
        var repoInfo = null;
        if (owner_repo) {
            chrome.storage.sync.get([owner_repo, "api_token"], function (items) {
                if (items[owner_repo]) { //if the repo info already exist
                    repoInfo = items[owner_repo];

                    var now = new Date();
                    var weeks = Math.abs(Math.round((repoInfo.controlDate - now) / 604800000));
                    if (weeks >= 3) { // if repoInfo is expired

                        var updated_repoInfo = {};
                        var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                        var json = null;
                        var xhr = new XMLHttpRequest();

                        xhr.onload = function () {
                            if (this.status === 404) {
                                // license not found
                                updated_repoInfo.license = "notFound";
                                updated_repoInfo.controlDate = (new Date()).getTime();
                                updated_repoInfo.ignore = false;

                                chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                });
                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                            }
                        }
                        xhr.open("GET", apiUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                json = JSON.parse(xhr.response);
                                updated_repoInfo.license = json.license;
                                updated_repoInfo.controlDate = (new Date()).getTime();
                                updated_repoInfo.ignore = false;
                                chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                });
                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                            }
                        }
                        xhr.send();
                    } else if (repoInfo.ignore === false) {
                        chrome.tabs.sendMessage(tabs[0].id, {repoInfo: repoInfo});
                    }
                }
                else {
                    var new_repoInfo = {};
                    var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                    var json = null;
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function () {
                        if (this.status === 404) {
                            // license not found
                            new_repoInfo.license = "notFound";
                            new_repoInfo.controlDate = (new Date()).getTime();
                            new_repoInfo.ignore = false;

                            chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                            });

                            chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                        }
                    }
                    xhr.open("GET", apiUrl, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            json = JSON.parse(xhr.response);
                            new_repoInfo.license = json.license;
                            new_repoInfo.controlDate = (new Date()).getTime();
                            new_repoInfo.ignore = false;
                            chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                            });

                            chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                        }
                    }
                    xhr.send();
                }

            });
        }
    });
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status.toString() == "complete") {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.pageAction.show(tabs[0].id);

            //alert("tabs[0].url: " + tabs[0].url);
            var owner_repo = getOwnerRepoFromUrl(tabs[0].url);
            var repoInfo = null;
            if (owner_repo) {
                chrome.storage.sync.get([owner_repo, "api_token"], function (items) {
                    if (items[owner_repo]) { //if the repo info already exist
                        repoInfo = items[owner_repo];

                        var now = new Date();
                        var weeks = Math.abs(Math.round((repoInfo.controlDate - now) / 604800000));
                        if (weeks >= 3) { // if repoInfo is expired

                            var updated_repoInfo = {};
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                            var json = null;
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                if (this.status === 404) {
                                    // license not found
                                    updated_repoInfo.license = "notFound";
                                    updated_repoInfo.controlDate = (new Date()).getTime();
                                    updated_repoInfo.ignore = false;

                                    chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                    });
                                    chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                                }
                            }
                            xhr.open("GET", apiUrl, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    json = JSON.parse(xhr.response);
                                    updated_repoInfo.license = json.license;
                                    updated_repoInfo.controlDate = (new Date()).getTime();
                                    updated_repoInfo.ignore = false;
                                    chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                    });
                                    chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                                }
                            }
                            xhr.send();
                        } else if (repoInfo.ignore === false) {
                            chrome.tabs.sendMessage(tabs[0].id, {repoInfo: repoInfo});
                        }
                    }
                    else {
                        var new_repoInfo = {};
                        var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                        var json = null;
                        var xhr = new XMLHttpRequest();

                        xhr.onload = function () {
                            if (this.status === 404) {
                                // license not found
                                new_repoInfo.license = "notFound";
                                new_repoInfo.controlDate = (new Date()).getTime();
                                new_repoInfo.ignore = false;

                                chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                            }
                        }
                        xhr.open("GET", apiUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                json = JSON.parse(xhr.response);
                                new_repoInfo.license = json.license;
                                new_repoInfo.controlDate = (new Date()).getTime();
                                new_repoInfo.ignore = false;
                                chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo});
                            }
                        }
                        xhr.send();
                    }

                });
            }
        });
    }
});


chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (details.frameId === 0) {
        console.log("213");
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function (tab) {

            if (tab.url != details.url) {
                chrome.pageAction.show(tab.id);
                var owner_repo = getOwnerRepoFromUrl(tab.url);
                var repoInfo = null;
                if (owner_repo) {
                    chrome.storage.sync.get([owner_repo, "api_token"], function (items) {
                        if (items[owner_repo]) { //if the repo info already exist
                            repoInfo = items[owner_repo];

                            var now = new Date();
                            var weeks = Math.abs(Math.round((repoInfo.controlDate - now) / 604800000));
                            if (weeks >= 3) { // if repoInfo is expired
                                var updated_repoInfo = {};
                                var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                                var json = null;
                                var xhr = new XMLHttpRequest();

                                xhr.onload = function () {
                                    if (this.status === 404) {
                                        // license not found
                                        updated_repoInfo.license = "notFound";
                                        updated_repoInfo.controlDate = (new Date()).getTime();
                                        updated_repoInfo.ignore = false;
                                        chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                        });
                                        chrome.tabs.sendMessage(tab.id, {repoInfo: updated_repoInfo});
                                    }
                                }
                                xhr.open("GET", apiUrl, true);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState == 4) {
                                        json = JSON.parse(xhr.response);
                                        updated_repoInfo.license = json.license;
                                        updated_repoInfo.controlDate = (new Date()).getTime();
                                        updated_repoInfo.ignore = false;
                                        chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                        });
                                        chrome.tabs.sendMessage(tab.id, {repoInfo: updated_repoInfo});
                                    }
                                }
                                xhr.send();
                            } else if (repoInfo.ignore === false) {
                                chrome.tabs.sendMessage(tab.id, {repoInfo: repoInfo});
                            }
                        }
                        else {
                            var new_repoInfo = {};
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                            var json = null;
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                if (this.status === 404) {
                                    // license not found
                                    new_repoInfo.license = "notFound";
                                    new_repoInfo.controlDate = (new Date()).getTime();
                                    new_repoInfo.ignore = false;

                                    chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                    });

                                    chrome.tabs.sendMessage(tab.id, {repoInfo: new_repoInfo});
                                }
                            }
                            xhr.open("GET", apiUrl, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    json = JSON.parse(xhr.response);
                                    new_repoInfo.license = json.license;
                                    new_repoInfo.controlDate = (new Date()).getTime();
                                    new_repoInfo.ignore = false;
                                    chrome.storage.sync.set({[owner_repo]: new_repoInfo}, function () {
                                    });

                                    chrome.tabs.sendMessage(tab.id, {repoInfo: new_repoInfo});
                                }
                            }
                            xhr.send();
                        }

                    });
                }
            }
        });
    }
});


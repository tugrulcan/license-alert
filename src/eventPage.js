/*function getRepoInfo(owner_repo, api_token) {
    var new_repoInfo = {};
    var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + api_token;
    var json = null;
    var xhr = new XMLHttpRequest();

    xhr.onload = function () {
        if (this.status === 404) {
            // license not found
            new_repoInfo.license = "notFound";
            new_repoInfo.controlDate = moment();
            new_repoInfo.ignore = false;

            return new_repoInfo;
        }
    }
    xhr.open("GET", apiUrl, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            json = JSON.parse(xhr.response);
            new_repoInfo.license =  json.license;
            new_repoInfo.controlDate = moment();
            new_repoInfo.ignore = false;
            alert(JSON.stringify(new_repoInfo));
            return new_repoInfo;
        }
    }
    xhr.send();

}*/
function getOwnerRepoFromUrl(url) {
    url = url.split('/');
    var owner = url[3].toString();
    var repo = url[4].toString();
    var owner_repo = null;

    if (owner != undefined && repo != undefined){
        owner_repo = owner + "/" + repo;
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
                        alert(JSON.stringify(repoInfo.license));

                        var now = new Date();
                        var weeks = Math.abs(Math.round((repoInfo.controlDate-now)/ 604800000));
                        alert("weeks: " + parseInt(weeks));
                        if (weeks >= 3) { // if repoInfo is expired

                            var updated_repoInfo = {};
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                            var json = null;
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                if (this.status === 404) {
                                    // license not found
                                    updated_repoInfo.license = "notFound";
                                    updated_repoInfo.controlDate = new Date();
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
                                    updated_repoInfo.license =  json.license;
                                    updated_repoInfo.controlDate = new Date();
                                    updated_repoInfo.ignore = false;
                                    chrome.storage.sync.set({[owner_repo]: updated_repoInfo}, function () {
                                    });
                                    chrome.tabs.sendMessage(tabs[0].id, {repoInfo: updated_repoInfo});
                                }
                            }
                            xhr.send();
                            //--------------------


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
                                new_repoInfo.controlDate = new Date();
                                new_repoInfo.ignore = false;

                                chrome.storage.sync.set({[owner_repo]: new_repoInfo }, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo });                            }
                        }
                        xhr.open("GET", apiUrl, true);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState == 4) {
                                json = JSON.parse(xhr.response);
                                new_repoInfo.license =  json.license;
                                new_repoInfo.controlDate = new Date();
                                new_repoInfo.ignore = false;
                                chrome.storage.sync.set({[owner_repo]: new_repoInfo }, function () {
                                });

                                chrome.tabs.sendMessage(tabs[0].id, {repoInfo: new_repoInfo });
                            }
                        }
                        xhr.send();
                    }

                });
            }

        });
    }

});

/*
chrome.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.pageAction.show(tabs[0].id);
        var url = tabs[0].url;
        url = url.split('/');
        var owner = url[3].toString();
        var repo = url[4].toString();
        var owner_repo = owner + "/" + repo;
        var license = null;
        var license_dict = null;


        chrome.storage.sync.get("license_dict", function (items) {
            if (items.license_dict) {
                license_dict = items.license_dict;
                if (license_dict[owner_repo] != undefined) {
                    //alert(owner_repo +  " license found in cache!");
                    license = license_dict[owner_repo];
                    //alert("license: " + license);
                    chrome.tabs.sendMessage(tabs[0].id, {license: license});
                } else {
                    //alert(owner_repo +  " license not found api call!");
                    var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                    var json = null;
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function () {
                        if (this.status === 404) {
                            // license not found
                            license = "notFound";
                            chrome.tabs.sendMessage(tabs[0].id, {license: license});
                            license_dict[owner_repo] = license;
                            chrome.storage.sync.set({"license_dict": license_dict}, function () {
                            });

                        } else if (this.status === 403) {
                            // API request limit exceed
                            license = "limitExceed";
                            chrome.tabs.sendMessage(tabs[0].id, {license: license});
                        }
                    };
                    xhr.open("GET", apiUrl, true);
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4) {
                            json = JSON.parse(xhr.response);
                            license = json.license;
                            chrome.tabs.sendMessage(tabs[0].id, {license: license});
                            license_dict[owner_repo] = license;
                            chrome.storage.sync.set({"license_dict": license_dict}, function () {
                            });
                        }
                    }
                    xhr.send();
                }
            } else {
                license_dict = {};
                //alert(owner_repo +  " license not found api call!");
                var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                var json = null;
                var xhr = new XMLHttpRequest();

                xhr.onload = function () {
                    if (this.status === 404) {
                        // license not found
                        license = "notFound";
                        chrome.tabs.sendMessage(tabs[0].id, {license: license});
                        license_dict[owner_repo] = license;
                        chrome.storage.sync.set({"license_dict": license_dict}, function () {
                        });

                    }
                }
                xhr.open("GET", apiUrl, true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        json = JSON.parse(xhr.response);
                        license = json.license;
                        chrome.tabs.sendMessage(tabs[0].id, {license: license});
                        license_dict[owner_repo] = license;
                        chrome.storage.sync.set({"license_dict": license_dict}, function () {
                        });
                    }
                }
                xhr.send();

            }
        });
    });

});
*/

/*
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details) {
    if (details.frameId === 0) {
        // Fires only when details.url === currentTab.url
        chrome.tabs.get(details.tabId, function (tab) {
            if (tab.url === details.url) {
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    chrome.pageAction.show(tabs[0].id);

                    var url = tabs[0].url;
                    url = url.split('/');
                    var owner = url[3].toString();
                    var repo = url[4].toString();
                    var owner_repo = owner + "/" + repo;
                    var license = null;
                    var license_dict = null;


                    chrome.storage.sync.get("license_dict", function (items) {
                        if (items.license_dict) {
                            license_dict = items.license_dict;
                            if (license_dict[owner_repo] != undefined) {
                                license = license_dict[owner_repo];
                                chrome.tabs.sendMessage(tabs[0].id, {license: license});
                            } else {
                                var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                                var json = null;
                                var xhr = new XMLHttpRequest();

                                xhr.onload = function () {
                                    if (this.status === 404) {
                                        // license not found
                                        license = "notFound";
                                        chrome.tabs.sendMessage(tabs[0].id, {license: license});
                                        license_dict[owner_repo] = license;
                                        chrome.storage.sync.set({"license_dict": license_dict}, function () {
                                        });

                                    }
                                }
                                xhr.open("GET", apiUrl, true);
                                xhr.onreadystatechange = function () {
                                    if (xhr.readyState == 4) {
                                        json = JSON.parse(xhr.response);
                                        license = json.license;
                                        chrome.tabs.sendMessage(tabs[0].id, {license: license});
                                        license_dict[owner_repo] = license;
                                        chrome.storage.sync.set({"license_dict": license_dict}, function () {
                                        });
                                    }
                                }
                                xhr.send();
                            }
                        } else {
                            license_dict = {};
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license?access_token=" + items.api_token;
                            var json = null;
                            var xhr = new XMLHttpRequest();

                            xhr.onload = function () {
                                if (this.status === 404) {
                                    // license not found
                                    license = "notFound";
                                    chrome.tabs.sendMessage(tabs[0].id, {license: license});
                                    license_dict[owner_repo] = license;
                                    chrome.storage.sync.set({"license_dict": license_dict}, function () {
                                    });

                                }
                            }
                            xhr.open("GET", apiUrl, true);
                            xhr.onreadystatechange = function () {
                                if (xhr.readyState == 4) {
                                    json = JSON.parse(xhr.response);
                                    license = json.license;
                                    chrome.tabs.sendMessage(tabs[0].id, {license: license});
                                    license_dict[owner_repo] = license;
                                    chrome.storage.sync.set({"license_dict": license_dict}, function () {
                                    });
                                }
                            }
                            xhr.send();

                        }
                    });
                });
            }
        });
    }
});

*/

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "show") {
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
                        var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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
                    var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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
                    var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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
                var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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
                                var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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
                            var apiUrl = "https://api.github.com/repos/" + owner_repo + "/license";
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


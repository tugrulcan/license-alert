chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (document.getElementById("license_alert") == null) {
       /* if (request.license === "limitExceed") {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_limit_exceed'class='flash license_alert limit_exceed'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>Github Licenses API limit exceed!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        }*/

        if (request.repoInfo.license === "notFound") {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_not_found'class='flash license_alert warning'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>No License!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        } else if (request.repoInfo.license.featured === false) {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_alert'class='flash license_alert warning'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>License: " + request.repoInfo.license.spdx_id.toString() + "</strong></div></div>";
            $(".repository-content").prepend(htmlWarning);


        }
    }
});

//-----------------------------------------------


/*
 print all
 --> chrome.storage.sync.get(null, function (data) { console.info(data) });

 delete all
 --> chrome.storage.sync.clear(function() {
 var error = chrome.runtime.lastError;
 if (error) {
 console.error(error);
 }
 });
 --> combined :D

 chrome.storage.sync.get(null, function (data) { console.info(data) });
 console.log("Clear!");
 chrome.storage.sync.clear(function() {
 var error = chrome.runtime.lastError;
 if (error) {
 console.error(error);
 }
 });
 console.log("Cleared!");
 chrome.storage.sync.get(null, function (data) { console.info(data) });
*/



$(function () {
    chrome.storage.sync.get("api_token", function (items) {
        if (items.api_token === undefined) {
            if (document.getElementById("la_api_token") === null) {
                var htmlWarning = " <div class='flash-messages'><div id='la_api_token'class='flash license_alert limit_exceed'>" +
                    "<table><tr><td><strong>Please <a href='https://github.com/settings/tokens/new'> create </a> and enter Github API token</strong> </td>" +
                    "<td style='padding: 10px;'><input id='la-api-token-input' type='text' class='form-control input-block input-contrast' placeholder='Paste your new API token here ' value='' autocomplete='off'> </td>" +
                    "<td><button type='submit' class='btn btn-primary' id='la_submit_token'>Save</button></td>" +
                    "</tr></table></div> ";

                $(".repository-content").prepend(htmlWarning);
            }
        }
    });

    $("body").on('click', '#la_submit_token', function () {
        chrome.storage.sync.get(null, function (data) {
            console.info(data)
        });

        var token = $("#la-api-token-input").val();
        if (token) {
            chrome.storage.sync.clear();
            chrome.storage.sync.set({"api_token": token.trim()}, function () {
                alert('API token saved!');
                location.reload();
            });
        }
    });


    $(".flash.license_alert.closebtn").click(function () {
        $(this).parent().fadeToggle();
    });
});

chrome.runtime.sendMessage({action: "show"});

chrome.storage.sync.get(null, function (data) { console.info(data) });

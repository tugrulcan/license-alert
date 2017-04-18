chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    $(function () {
        if (document.getElementById("la-license") === null) {
            if (request.repoInfo.license === "Not Found") {
                var htmlWarning = "<span itemscope='' itemtype='http://schema.org/ListItem' itemprop='itemListElement' id='la-license'>" +
                    "<a class='js-selected-navigation-item reponav-item' style='background-color: rgba(255, 0, 0, 0.2);' >" +
                    "<svg aria-hidden='true' class='octicon octicon-law' height='16' version='1.1' viewBox='0 0 14 16' width='14'>" + "" +
                    "<path fill-rule='evenodd' d='M7 4c-.83 0-1.5-.67-1.5-1.5S6.17 1 7 1s1.5.67 1.5 1.5S7.83 4 7 4zm7 6c0 1.11-.89 2-2 2h-1c-1.11 0-2-.89-2-2l2-4h-1c-.55 0-1-.45-1-1H8v8c.42 0 1 .45 1 1h1c.42 0 1 .45 1 1H3c0-.55.58-1 1-1h1c0-.55.58-1 1-1h.03L6 5H5c0 .55-.45 1-1 1H3l2 4c0 1.11-.89 2-2 2H2c-1.11 0-2-.89-2-2l2-4H1V5h3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1h3v1h-1l2 4zM2.5 7L1 10h3L2.5 7zM13 10l-1.5-3-1.5 3h3z'></path></svg>" +
                    "\n<span style='color:#CB2431;'>Not Found!</span>\n" +
                    "</span>";


                $(".js-selected-navigation-item.reponav-item").last().after(htmlWarning);

            } else if (request.repoInfo.license.featured === false) {
                var htmlWarning = "<span itemscope='' itemtype='http://schema.org/ListItem' itemprop='itemListElement' id='la-license'>" +
                    "<a class='js-selected-navigation-item reponav-item' style='background-color: rgba(255, 0, 0, 0.2);' >" +
                    "<svg aria-hidden='true' class='octicon octicon-law' height='16' version='1.1' viewBox='0 0 14 16' width='14'>" + "" +
                    "<path fill-rule='evenodd' d='M7 4c-.83 0-1.5-.67-1.5-1.5S6.17 1 7 1s1.5.67 1.5 1.5S7.83 4 7 4zm7 6c0 1.11-.89 2-2 2h-1c-1.11 0-2-.89-2-2l2-4h-1c-.55 0-1-.45-1-1H8v8c.42 0 1 .45 1 1h1c.42 0 1 .45 1 1H3c0-.55.58-1 1-1h1c0-.55.58-1 1-1h.03L6 5H5c0 .55-.45 1-1 1H3l2 4c0 1.11-.89 2-2 2H2c-1.11 0-2-.89-2-2l2-4H1V5h3c0-.55.45-1 1-1h4c.55 0 1 .45 1 1h3v1h-1l2 4zM2.5 7L1 10h3L2.5 7zM13 10l-1.5-3-1.5 3h3z'></path></svg>" +
                    "\n<span style='color:#CB2431;'>" + request.repoInfo.license.spdx_id.toString() + "</span>\n" +
                    "</span>";

                $(htmlWarning).insertAfter($(".js-selected-navigation-item.reponav-item").last());
            }
        }
    });

});

/*
 print all
 --> chrome.storage.sync.get(null, function (data) { console.info(data) });
 delete all
 --> chrome.storage.sync.clear();
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

                $("#js-repo-pjax-container").prepend(htmlWarning);

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

    $("#la-ignore").click(function () {
        $(this).parent().fadeToggle();
    });
});


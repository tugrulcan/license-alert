chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(document.getElementById("license_warning_ext") == null){
        if(request.license === "limitExceed"){
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_warning_ext'class='flash license_alert limit_exceed'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>Github Licenses API limit exceed!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        }


        if(request.license === "notFound")
        {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_warning_ext'class='flash license_alert warning'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>No License found!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        }


        else if(request.license.featured === false)
        {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_warning_ext'class='flash license_alert warning'>" +
                "<span class='flash license_alert closebtn'>&times;</span>" +
                "<strong>License: " + request.license.spdx_id.toString() + "</strong></div></div>";
            $(".repository-content").prepend(htmlWarning);


        }
    }
});
chrome.runtime.sendMessage({action:"show"});

$(function () {
    $(".flash.license_alert.closebtn").click(function () {
        $(this).parent().fadeToggle();
    });
});

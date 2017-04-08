
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(document.getElementById("license_warning_ext") == null){
        if(request.license == "limitExceed"){
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_warning_ext'class='flash' style ='background-color: rgba(220,218,61,0.77);color:#fafbfc;'><strong>" +
                "Github Licenses API limit exceed!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        }


        if(request.license == "notFound")
        {
            var htmlWarning = "<div class='flash-messages'>" +
                "<div id='license_warning_ext'class='flash' style ='background-color: rgba(203, 36, 49, 0.77);color:#fafbfc;'><strong>" +
                "No License found!</strong></div>";
            $(".repository-content").prepend(htmlWarning);
        }


        else if(request.license.featured == false)
        {
            var htmlWarning = "<div class='flash-messages'>" +
                            "<div id='license_warning_ext'class='flash' style ='background-color: rgba(203, 36, 49, 0.77);color:#fafbfc;'><strong>" +
                             "License: " + request.license.spdx_id.toString() + "</strong></div></div>";
            $(".repository-content").prepend(htmlWarning);


        }
    }
});
chrome.runtime.sendMessage({action:"show"});
//alert("activated!");

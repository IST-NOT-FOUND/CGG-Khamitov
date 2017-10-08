var isPlaying = false;
var eas = $(document).find('.easter');
var b = $(document).find('body');
var au = new Audio('./css/etc.css');

$( document ).ready(function() {
    var path = location.pathname;
    var pathToJSON;
    if (path.substr(path.lastIndexOf("/")+1) == 'index.html'){
        pathToJSON = 'projectConfig.json';
    } else pathToJSON = '../projectConfig.json';

    $.getJSON(pathToJSON, function(data) {
        for(var i=0;i<data.length;i++){
            var elem = document.querySelector("#top-" + data[i].chapter);
            if (data[i].status == "0"){
                elem.classList.add("not-started");
            } else {

                if (data[i].status == "1") {
                    elem.classList.add("waiting");
                } else if (data[i].status == "2"){
                    elem.classList.add("in-process");
                } else if (data[i].status == "3"){
                    elem.classList.add("finished");
                }

                if (path.substr(path.lastIndexOf("/")+1) == "chapter" + data[i].chapter + ".html"){

                    var elem1 = document.querySelector("#modal-panel");
                    $(document).find(".modal-panel-bottom").css("display", "block");
                    $(document).find(".comment-name").text(data[i].comment_name);
                    $(document).find(".comment-text").text(data[i].comment_text);
                    if (data[i].comment_img == "1"){
                        //$(document).find(".comment-img").css("backgroundImage","url()");
                    }

                    if (data[i].status == "1") {
                        $(document).find('.status-indicator').css("backgroundColor", "#cc14b5");
                        $(document).find('.status-text').text("Ожидается задание");
                        $(document).find('.status-text').css("color", "#cc14b5");
                        elem.classList.add("waiting");
                    } else if (data[i].status == "2"){
                        $(document).find('.status-indicator').css("backgroundColor", "#ccbe14");
                        $(document).find('.status-text').text("Выполняется");
                        $(document).find('.status-text').css("color", "#ccbe14");
                        elem1.classList.add("modal-panel-bottom-hover");
                        elem.classList.add("in-process");
                    } else if (data[i].status == "3"){
                        $(document).find('.status-indicator').css("backgroundColor", "#1db9dc");
                        $(document).find('.status-text').text("Выполнен");
                        $(document).find('.status-text').css("color", "#1db9dc");
                        elem1.classList.add("modal-panel-bottom-hover");
                        elem.classList.add("finished");
                    }
                }
            }
        }
    });
});

function easter() {
    au.volume = 0.1;
    au.loop = true;
    if (!isPlaying){
        au.play();
        isPlaying = true;
        eas.css("backgroundColor", "#f3f3f3");
        b.css("animationName", "pulse");
        b.css("animationDuration", "2s");
        b.css("animationIterationCount", "infinite");
    } else {
        au.load();
        isPlaying = false;
        eas.css("backgroundColor", "transparent");
        b.css("animationName", "none");
        b.css("backgroundColor", "#eee");
    }
}
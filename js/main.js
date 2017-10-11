var isPlaying = false,
    eas = $(document).find('.easter'),
    b = $(document).find('body'),
    au, tempElemId = "q-1";

$( document ).ready(function() {
    var path = location.pathname;
    var pathToJSON, pathToImg;

    //Определение местоположения рабочей страницы
    if (path.substr(path.lastIndexOf("/")+1) == 'index.html'){
        pathToJSON = 'projectConfig.json';
        pathToImg = 'img/comImg';
        au = new Audio('css/etc.css')
    } else {
        pathToJSON = '../projectConfig.json';
        pathToImg = '../img/comImg';
        au = new Audio('../css/etc.css')
    }

    //Запрос данных файла конфигурации проекта
    $.getJSON(pathToJSON, function( data, status ) {
        for(var i=0;i<data.length;i++){
            var elem = document.querySelector("#top-" + data[i].chapter);

            //Определяем статус выполнения главы
            if (data[i].status == "0"){
                // Статус "не начат"
                elem.classList.add("not-started");
            } else {

                if (data[i].status == "1") {
                    // Статус "ожидание"
                    elem.classList.add("waiting");
                } else if (data[i].status == "2"){
                    // Статус "в процессе"
                    elem.classList.add("in-process");
                } else if (data[i].status == "3"){
                    // Статус "закончен"
                    elem.classList.add("finished");
                }

                // Определяем какая глава содежится в рабочей странице
                if (path.substr(path.lastIndexOf("/")+1) == "chapter" + data[i].chapter + ".html"){

                    var elem1 = document.querySelector("#modal-panel");

                    //Отображаем нижнюю панель на странице
                    $(document).find(".modal-panel-bottom").css("display", "block");

                    //Задаем имя пользователя, оставивший задание
                    $(document).find(".comment-name").text(data[i].comment_name);

                    //Делим текст индивидуального задания на lines и выводим его
                    var dividedText = data[i].comment_text.split('/');
                    var dividedString = '';
                    if (dividedText.length > 1){
                        dividedString += dividedText[0];
                        for (var k = 1; k <= dividedText.length - 1; k++){
                            dividedString += '<br/>' + dividedText[k];
                        }
                    } else dividedString = dividedText;
                    $(document).find(".comment-text").html(dividedString);

                    //Задаем аватарку пользователя, оставивший задание
                    if (data[i].comment_img == "1"){
                        $(document).find(".comment-img").css("backgroundImage","url(" + pathToImg + "1.png)");
                    } else if (data[i].comment_img == "2"){
                        $(document).find(".comment-img").css("backgroundImage","url(" + pathToImg + "2.png)");
                    }

                    //Определяем статус выполнения данной главы
                    if (data[i].status == "1") {
                        //Задаем стиль и текст нижней панели, зависящий от статуса
                        $(document).find('.status-indicator').css("backgroundColor", "#cc14b5");
                        $(document).find('.status-text').text("Ожидается задание");
                        $(document).find('.status-text').css("color", "#cc14b5");
                        //Задаем цвет "ожидания задания" на главной панеле
                        elem.classList.add("waiting");
                    } else if (data[i].status == "2"){
                        //Задаем стиль и текст нижней панели, зависящий от статуса
                        $(document).find('.status-indicator').css("backgroundColor", "#ccbe14");
                        $(document).find('.status-text').text("Выполняется");
                        $(document).find('.status-text').css("color", "#ccbe14");
                        //Делаем нижнюю панель активной
                        activePanel(elem1);
                        //Задаем цвет "в процессе выполнения" на главной панеле
                        elem.classList.add("in-process");
                    } else if (data[i].status == "3"){
                        //Задаем стиль и текст нижней панели, зависящий от статуса
                        $(document).find('.status-indicator').css("backgroundColor", "#1db9dc");
                        $(document).find('.status-text').text("Выполнен");
                        $(document).find('.status-text').css("color", "#1db9dc");
                        //Делаем нижнюю панель активной
                        activePanel(elem1);
                        //Задаем цвет "задание выполнено" на главной панеле
                        elem.classList.add("finished");
                    }
                }
            }
        }
    }).fail(function () {
        alert("Данная страница не обработала файл конфигурации projectConfig.json!\nРекомендуется запустить проект на веб-сервере, для использования полного функционала (так, как оно задумано)");
    });

    //Отображаем первый пример при загрузке страницы
    $(document).find("#divq-1").css("display", "block");
    $(document).find("#q-1").css("backgroundColor", "#1db9dc");
});

//???
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

//Функция перехода между примерами в главах
function questChoose(elem){
    var curElemId = elem.id;

    if (tempElemId != "") {
        $(document).find("#" + tempElemId).css("backgroundColor", "#fff");
        $(document).find("#div" + tempElemId).css("display", "none");
    }
    $(document).find("#" + curElemId).css("backgroundColor", "#1db9dc");
    $(document).find("#div" + curElemId).css("display", "block");

    tempElemId = curElemId;
}

function activePanel(elem1){
    $(document).find('#modal-panel').css("animationName", "activePanelHint");
    $(document).find('#modal-panel').css("animationDuration", "1s");
    $(document).find('#modal-panel').css("animationIterationCount", "1");
    setTimeout(function() {elem1.classList.add("modal-panel-bottom-hover");}, 1001);
}
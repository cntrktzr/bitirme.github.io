function googleTranslateElementInit() {
    new google.translate.TranslateElement({ includedLanguages: 'en,es,fr,pt', layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL }, 'google_translate_element');
}

function triggerHtmlEvent(element, eventName) {
    var event;
    if (document.createEvent) {
        event = document.createEvent('HTMLEvents');
        event.initEvent(eventName, true, true);
        element.dispatchEvent(event);
    } else {
        event = document.createEventObject();
        event.eventType = eventName;
        element.fireEvent('on' + event.eventType, event);
    }
}
$(document).ready(function () {
    $(document).on('click', '.languageOption', function () {
        var value = $(this).attr("data-lang");

        updateLanguage(value);

    })


    function updateLanguage(value) {
        var selectIndex = 0;
        var a = document.querySelector("#google_translate_element select");
        switch (value) {
            case "en":
                selectIndex = 0;
                break;
            case "es":
                selectIndex = 3;
                break;
            case "fr":
                selectIndex = 1;
                break;
            case "pt":
                selectIndex = 2;
                break;

        }
        a.selectedIndex = selectIndex;
        a.dispatchEvent(new Event('change'));
    }
})
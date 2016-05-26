if(head.browser.name == 'ff') head.load("css/firefox.css");

var scripts = [
        "../../vendor/jquery-2.1.3.min.js",
        "../../vendor/jquery-ui/js/jquery-ui.js",
        "../../vendor/bootstrap/js/bootstrap.min.js",
        "../../vendor/jGrowl/jquery.jgrowl.min.js",
        "../../vendor/colorpick/js/colpick.js",
        "../common.js",
        "../analitics.js"
];

if(head.browser.name == 'ff'){
    scripts = scripts.concat([
        "../../vendor/q.js",
        "../../vendor/dexie.js",
        "../../vendor/LargeLocalStorage.min.js",
        "../../browsers/browser-firefox.js",
        "../../browsers/datebase-firefox.js",
        "../backend/theme.js",
        "../backend/groups.js",
        "../backend/dials.js",
        "../backend/backend.js",
        "../backend/install.js",
        "../../browsers/page-firefox.js"
    ]);
}else if(head.browser.name == 'chrome'){
    scripts = scripts.concat([
        "../../browsers/browser-chrome.js",
        "../../browsers/datebase-chrome.js",
        "../../browsers/page-chrome.js"
    ]);
}//else

scripts = scripts.concat([
        "js/content/header.js",
        "js/content/welcome.js",
        "js/content/rating.js",
        "js/content/feedback.js",
        "js/content/random_themes.js",
        "js/content/flixel_add.js",
        "js/common.js",
        "js/options.js",
        "../../vendor/share42/share42.js"
]);

head.load(scripts);
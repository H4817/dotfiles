if(head.browser.name == 'ff') head.load("css/firefox.css");

var scripts = [
        "../../vendor/jquery-2.1.3.min.js",
        "../../vendor/jquery-ui/js/jquery-ui.js",
        "../../vendor/bootstrap/js/bootstrap.min.js",
        "../../vendor/parallax.min.js",
        "../../vendor/clock/js/vendor/jquery.counteverest.js",
        "../../vendor/jquery.pulse.min.js",
        "../../vendor/contextmenu/jquery.contextmenu.js",
        "../../vendor/jGrowl/jquery.jgrowl.min.js",
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
        "js/search.js",
        "js/theme.js",
        "js/page.js",
        "js/tiles.js",
        "js/popup.js",
        "js/todo.js",
        "js/clock.js",
        "js/speech.js",
        "js/weather.js",
        "js/rate.js",
        "js/bookmarks.js",
        "js/relax.js",
        "js/sidebar.js",
        "js/new_dial.js",
        "js/tile_context_menu.js",
        "js/group_context_menu.js"
]);

head.load(scripts);
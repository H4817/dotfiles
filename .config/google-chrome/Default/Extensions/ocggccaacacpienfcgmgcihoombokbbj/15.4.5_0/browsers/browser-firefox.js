//VARIABLES
const BROWSER = 'firefox';
var Firefox_ActiveTabId;
var addonDir = "resource://team-at-livestartpage-dot-com";
var saveFilesInLargeLocalStorage = true;
//var shareBasicUrl = "https://addons.mozilla.org/en-US/firefox/addon/live-start-page-lst/";

var appStoreUrlEn = "https://addons.mozilla.org/en-US/firefox/addon/live-start-page-lst/reviews/add";
var appStoreUrlRu = "https://addons.mozilla.org/en-US/firefox/addon/live-start-page-lst/reviews/add";

var redirectSearchEngine = "http://fvdmedia.com/addon_search/?from=ff_lst&q=";

var optionsHelpUrlEn = "http://livestartpage.com/helpfirefoxen.php";
var optionsHelpUrlRu = "http://livestartpage.com/helpfirefoxru.php";

//@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@

function BRW_options_page_prepare(){
    $("#available-live-themes-button").remove();//Hide not support live theme button
    $(".available-themes-container li").css({
        width: '33%',
        float: 'left'
    })
}//BRW_options_page_prepare

function BRW_urlTunnel(url){
    if(String(url).indexOf("parallaxnewtab.com") > 0) return url;
    
    else if(String(url).indexOf("resource://") >= 0) return url;
    
    else if(String(url).indexOf("s3.amazonaws.com/fvd-data/sdpreview") >= 0) return url;
        //return "http://tunnel.thwf.ru:8081/index.php?src="+encodeURIComponent(url);//TEMPORARY!!!!!!!!!!
    
    else
        return "http://parallaxnewtab.com/tunnel/index.php?src="+encodeURIComponent(url);
}//BRW_urlTunnel


/*Chrome API functions*/
function extensionGetUrl(src){
    return addonDir+String("/"+src).split('//').join('/');
}//extensionGetUrl

function BRW_favicon(url){
    return "http://www.google.com/s2/favicons?domain=" + url;
}//BRW_favicon

/*Chrome API functions*/

/*From /pages/backend/backend.js OFF*/
function BRW_browserbrowserActionOnClicked(){
    //Button on panel
    //console.info("OFF BRW_browserbrowserActionOnClicked() - NOT REWORKED, empty");
    
    /*
    chrome.browserAction.onClicked.addListener(function(){
        var foundTabId = null;
        var foundTabIndex;
        var newTabUrl = "chrome://newtab/";
        var newTabUrlFull = "pages/newtab/newtab.html";
        
        chrome.tabs.query({url: newTabUrl}, function (tabs) {
            if (tabs.length > 0) {
                foundTabId = tabs[0].id;
                foundTabIndex = tabs[0].index;
            }

            chrome.tabs.query({url: chrome.extension.getURL(newTabUrlFull)}, function (tabs) {
                if (tabs.length > 0)
                    foundTabId = tabs[0].id;

                chrome.tabs.query({active: true}, function (tabs) {
                    var tab = tabs[0];
                    if(tab.url != newTabUrlFull && tab.url != newTabUrl) {
                        if (foundTabId) {
                            chrome.tabs.update(foundTabId, {active: true});
                        } else {
                            chrome.tabs.update(tab.id, {url: newTabUrlFull});
                        }
                    }
                });
            });
        });
    });
    */
}//BRW_browserbrowserActionOnClicked


//############# TEST MESSAGE ###############
//sendTest();
function sendTest() {
    setTimeout(function(){sendTest()}, (1200*1000));
    //window.postMessage("Message from page script", "*");
    BRW_sendMessage({'TEST':'TEST MESSAGE', 'date':Date(), command:'testMessage'}, function(){console.log('CALLBACK test function alert()');});
}
//############# TEST MESSAGE ###############

//Addon message sender
//Command, sendResponse
function BRW_sendMessage(message, callBack){
    $(function(){   
    //BRW_getFileSystem(function(){
        if(callBack) message['callBackFunction'] = callBack;

        var event = document.createEvent('CustomEvent');
        event.initCustomEvent("addon-message", true, true, message);
        document.documentElement.dispatchEvent(event);
    //});
    });
}//function


/*From /pages/backend/backend.js*/
//BRW_onMessageAddListener_ADDED = false;
function BRW_onMessageAddListener(){
    //console.log("ADD EVENT LISTENER: BRW_onMessageAddListener() - ok");
    
    window.addEventListener("addon-message", function(event) {
        //console.log("############ BRW_onMessageAddListener >>>");
        FF_messageListenerExec(event);
    }, false);//window.addEventListener
}//BRW_onMessageAddListener

function FF_messageListenerExec(event){
        var message = event.detail;
        var sendResponse = event.detail.callBackFunction;//event.detail.sendResponse;
    
        if(typeof(message.command) != "undefined") {
            //console.log("MESSAGE, FF_messageListenerExec | "+message.command);
            
            if(message.command == "testMessage"){
                console.log(message);
                sendResponse.call();
            }else
            
            if(message.command == "getBackgroundParams") { // get application install status
                getBackgroundNewPageParams(sendResponse);
                return true;
            } else if(message.command == "thumbLoad") { // load site thumb image
                if(message.tiles)
                    updateDialThumbByType(message.tiles);
            } else if(message.command == "textThumbLoad") { // load site text thumb for old dials version support
                getSitesTextThumbs(message.tiles);
            } else if(message.command == "showDialTextThumb") { // load site text thumb
                loadSitesTextThumb(message.tile);
            } else if(message.command == "showDialGalleryThumb" || message.command == "showDialScreenThumb") { // load site gallery or live thumb
                loadSitesEverhelperServiceThumb(message.tile);
            } else if(message.command == "addHostToBlackList") { // add thumb host to black list
                addHostToBlackList(message.val, sendResponse);
                return true;
            } else if(message.command == "restoreRemovedDialByUrl") { // remove thumb host from black list by url
                removeHostFromBlackList(message.val, sendResponse);
                return true;
            } else if(message.command == "getBackgroundImage") { // get current theme background image
                if(getRandomThemesDisplay()) {
                    getFileSystem(loadRandomBackgroundFile, sendResponse);
                } else {
                    if(getBackgroundVideoFile() && getDisplayVideoTheme())
                        getFileSystem(loadBackgroundVideoFile, sendResponse);
                    else
                        getFileSystem(loadBackgroundImageFile, sendResponse);
                }
                return true;
            } else if(message.command == "checkDisplayVideoThemeOffer") {
                currentThemeId(checkDisplayVideoThemeOffer, {sendResponse : sendResponse});
                return true;
            } else if(message.command == "applyVideoThemeOffer") {
                sendResponse({"startDownloadVideoTheme" : true, theme: message.theme});
                // try find bg video in file system else download
                loadThemeConfig(message.theme, startDownloadVideoTheme);
            } else if(message.command == "cancelVideoThemeOffer") {
                setHideVideoThemeOfferThemeId(message.theme);
            } else if(message.command == "getCurrentThemeSettings") {
                if(getLastInstalledThemeId()) {
                    currentThemeId(getCurrentThemeInfo, {sendResponse : sendResponse});
                    return true;
                }
            } else if(message.command == "getInstalledThemesSettings") {
                currentThemeId(getInstalledThemesData, {sendResponse : sendResponse});
                return true;
            } else if(message.command == "applyResolutionVideoTheme") {
                if(sendResponse) //???
                    sendResponse({"startDownloadResolutionVideoTheme" : true, theme: message.theme, resolution : message.resolution});
                loadThemeConfig(message.theme, startDownloadResolutionVideoTheme, {"resolution" : message.resolution});
            } else if(message.command == "setDisplayTilesCount") {
                setDisplayTilesCount(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayVideoTheme") {
                setDisplayVideoTheme(message.val);
                getNetTabPages(reloadTabPages);
            } else if(message.command == "setDisplayParallaxVideoTheme") {
                setDisplayParallaxVideoTheme(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setBackgroundParallaxValue") {
                setBackgroundParallaxValue(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayRelax") {
                setDisplayRelax(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setVisibleSpeedDialPanel") {
                setVisibleSpeedDialPanel(message.val);
            } else if(message.command == "getVisibleSpeedDialPanel") {
                sendResponse({visible : getVisibleSpeedDialPanel(message.val)});
            } else if(message.command == "setDisplaySpeedDialPanel") {
                setDisplaySpeedDialPanel(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayPopularGroup") {
                setDisplayPopularGroup(message.val);
                if(message.val) {
                    getNetTabPages(reloadTabPages);
                    getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
                } else {
                    getActiveGroup(function(val) {
                        switchActiveGroupToDefault(val, message.tab);
                    });
                }
            } else if(message.command == "getDisplayPopularGroup") {
                sendResponse({"display" : getDisplayPopularGroup()});
            } else if(message.command == "setDialsFormOpacity") {
                setDialsFormOpacity(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setOpenDialType") {
                setOpenDialType(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setNewSpeedDialThumbType") {
                setNewSpeedDialThumbType(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDialsColumnsCount") {
                setDialsColumnsCount(message.val);
                setVisibleSpeedDialPanel(1);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "getDialsColumnsCount") {
                getDialsColumnsCount(function(val) {
                    sendResponse({"maxColumns" : val});
                });
                return true;
            } else if(message.command == "setWelcomeSettingsPageAlwaysHideStatus") {
                setSettingsWelcomePageAlwaysHideState(message.val);
            } else if(message.command == "openSelectedDialUrl") {
                //var openDialType = message.newtab ? openNewTab : getOpenDialType();
                
                var openDialType = message.newtab ? openBackgroundTab : getOpenDialType();
                openSelectedUrl(openDialType, message.url);
            } else if(message.command == "openContextSelectedDialUrl") {
                openSelectedUrl(message.openType, message.url);
            } else if(message.command == "openSearchFormUrl") {
                openSelectedUrl(getOpenSearchType(), message.url);
            } else if(message.command == "setDisplaySearchForm") {
                setDisplaySearchForm(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setSearchFormProviderType") {
                setSearchFormProviderType(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setOpenSearchType") {
                setOpenSearchType(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setSearchFormOpacity") {
                setSearchFormOpacity(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "disableCurrentVideo") {
                sendResponse({result: disableCurrentVideo()});
            } else if(message.command == "disableCurrentImage") {
                sendResponse({result: disableCurrentImage()});
            } else if(message.command == "changeTodoContainerVisible") {
                setVisibleTodoPanel(message.val);
            } else if(message.command == "updateAvailableThemesList") {
//
                getAvailableThemesList(sendUpdatedAvailableThemes, {sendResponse : sendResponse});
                return true;
            } else if(message.command == "updateFlixelThemesList") {
                getFlixelThemesList(sendUpdatedFlixelThemes, {sendResponse : sendResponse});
                return true;
            } else if(message.command == "changeImageBackground") {
                getFileSystem(changeBackgroundImageFile, {sendResponse: sendResponse, themeId: message.theme});
                return true;
            } else if(message.command == "changeVideoBackground") {
                getFileSystem(changeBackgroundVideoFile, {sendResponse: sendResponse, themeId: message.theme});
                return true;
            } else if(message.command == "changeFlixerVideoBackground") {
                getFileSystem(changeBackgroundFlixerVideoFile, {sendResponse: sendResponse, themeId: message.theme, resolution: message.resolution});
                return true;
            } else if(message.command == "openInstallThemeTab") {
                openUrlInNewTab(message.url);
            } else if(message.command == "changeSettingsBackgroundCurrentTab") {
                setSettingsBackgroundTabId(message.tabid);
            } else if(message.command == "loadMoreFlixelContentBackend") {
                loadMoreFlixelContentBackend({});
            } else if(message.command == "saveTodoItemDb") {
                saveTodoItemDb(message.id, message.title, message.order);
            } else if(message.command == "deleteTodoItemDb") {
                deleteTodoItemDb(message.id);
            } else if(message.command == "changeTodoItemTitleDb") {
                changeTodoItemTitleDb(message.id, message.title);
            } else if(message.command == "changeTodoItemDoneDb") {
                changeTodoItemDoneDb(message.id, message.done);
            } else if(message.command == "changeTodoItemSort") {
                changeTodoItemSortDb(message.items);
            } else if(message.command == "setDisplayTodoPanel") {
                setDisplayTodoPanel(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayClockPanel") {
                setDisplayClockPanel(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockFormat") {
                setClockFormat(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockColorSchemeType") {
                setClockColorSchemeType(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockSecondsVisible") {
                setVisibleClockSeconds(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockFormatLabel") {
                setClockFormatLabel(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockVisibleLabel") {
                setClockVisibleLabel(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setShareAppStatus") {
                setShareAppStatus(true);
            } else if(message.command == "setClockFontBold") {
                setClockFontBold(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockType") {
                setClockType(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockBackgroundType") {
                setClockBackgroundType(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockOpacity") {
                setClockOpacity(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setClockBackgroundOpacity") {
                setClockBackgroundOpacity(message.val);
                setVisibleSpeedDialPanel(0);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "changeTodoItemCoordinates") {
                setDisplayTodoCoordinates(message.top, message.left);
            } else if(message.command == "changeTodoItemSize") {
                setDisplayTodoSize(message.width, message.height);
            } else if(message.command == "clearDoneTodoElementsDb") {
                clearTodoDoneElementsDb();
            } else if(message.command == "setApplicationRating") {
                setApplicationRating(message.val);
            } else if(message.command == "setApplicationNewtabRatingModal") {
                setApplicationNewtabRatingModal();
            } else if(message.command == "setDisplayWeatherPanel") {
                setDisplayWeatherPanel(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setWeatherUnit") {
                setWeatherUnit(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayWeatherUnit") {
                setDisplayWeatherUnit(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setDisplayWeatherBackground") {
                setDisplayWeatherBackground(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "changeWeatherItemCoordinates") {
                setDisplayWeatherCoordinates(message.top, message.left);
            } else if(message.command == "resetWeatherPosition") {
                resetWeatherPosition();
            } else if(message.command == "setWeatherOpacity") {
                setWeatherOpacity(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setWeatherBackgroundOpacity") {
                setWeatherBackgroundOpacity(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "resetTodoPositionSize") {
                resetTodoPositionSize();
            } else if(message.command == "setBookmarksDisable") {
                setBookmarksDisable();
            } else if(message.command == "setRelaxModalDisable") {
                setRelaxModalDisable();
            } else if(message.command == "setDisplayAppsLink") {
                setDisplayAppsLink(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setBottomPanelOpacity") {
                setBottomPanelOpacity(message.val);
                getNetTabPages(reloadTabPages);
                getSettingsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "removeContentFavoriteMark") {
                sendRemoveFavoriteMarkMessage(message.data);
            } else if(message.command == "setRandomThemesDisplay") {
                setRandomThemesDisplay(message.val);
                getNetTabPages(reloadTabPages);
                getOptionsTabPages(reloadTabPages);
                getFavoriteTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setRandomThemesDisplaySettings") {
                setRandomThemesDisplay(message.val);
                getNetTabPages(reloadTabPages);
                getFavoriteTabPages(reloadTabPages);
                getOptionsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setThemesSortType") {
                setThemesSortType(message.val);
                getOptionsTabPages(reloadTabPages);
                
                //location.reload();//temporary
            } else if(message.command == "setFooterLinksBlockDisplay") {
                setFooterLinksBlockDisplay(message.val);
                if(message.tab)
                    getNetTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setSidebarStatus") {
                setSidebarStatus(message.val);
            } else if(message.command == "getSidebarStatus") {
                getSidebarStatus(function(status) {
                    sendResponse({"status" : status});
                });
                return true;
            } else if(message.command == "getActiveGroup") { // get active group
                var withDials = message.withDials;
                getActiveGroup(function(val) {
                    bgGetActiveGroup(val, withDials, sendResponse);
                });
                return true;
            } else if(message.command == "getAvailableGroups") { // get available groups
                getActiveGroup(function(val) {
                    bgGetAvailableGroups(val, sendResponse, GROUP_SORT_BY_ORDER);
                });
                return true;
            } else if(message.command == "getAddNewDialGroups") {
                getActiveGroup(function(val) {
                    bgGetAvailableGroups(val, sendResponse, GROUP_SORT_ADD_NEW_DIAL);
                });
                return true;
            } else if(message.command == "bgAddNewDial") { // add new dial
                bgAddNewDial(message.dial, message.collectDials, sendResponse);
                return true;
            } else if(message.command == "deleteDialById") {
                bgDeleteDial(message.dialId, message.collectDials, sendResponse);
                return true;
            } else if(message.command == "moveDialsOrder") {
                bgMoveDialsOrder(message.collectDials);
            } else if(message.command == "bgEditNewDial") {
                bgEditNewDial(message.dial, message.collectDials, message.groupChanged, sendResponse);
                return true;
            } else if(message.command == "bgAddNewGroup") {
                bgAddNewGroup(message.group, message.collectGroups, sendResponse);
                getNetTabPages(reloadTabPages, {skipTab: message.tab});
                return true;
            } else if(message.command == "deleteGroupById") {
                bgDeleteGroup(message.groupId, message.collectGroups);
                getNetTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "moveGroupsOrder") {
                bgMoveGroupsOrder(message.collectGroups);
            } else if(message.command == "bgEditNewGroup") {
                bgEditNewGroup(message.group, message.collectGroups, sendResponse);
                getNetTabPages(reloadTabPages, {skipTab: message.tab});
                return true;
            } else if(message.command == "changeActiveGroup") {
                bgChangeActiveGroup(message.groupId, sendResponse);
                return true;
            } else if(message.command == "getGroupDialsCount") {
                bgGetGroupDialsCount(message.groupId, sendResponse);
                return true;
            } else if(message.command == "restoreRemovedDialById") {
                bgRestoreRemovedDialById(message.val, sendResponse);
                return true;
            }
        }
}//function



/*From /pages/backend/install.js*/
function BRW_setAppUninstallHandler() {
    /*Move it to /firefox.js*/
    //console.log("UNINSTALL (LATE) page - BRW_setAppUninstallHandler - NOT REWORKED, empty");
    
    /*
    chrome.i18n.getAcceptLanguages(function(languages) {
        var hasRuLanguage = languages.indexOf("ru") != -1;
        chrome.runtime.setUninstallURL(shareBasicUrl + (hasRuLanguage ? "ru/" : "") + "uninstall");
    });
    */
}//BRW_setAppUninstallHandler

/*From /pages/common.js*/
function BRW_analyzeHistory(callback, analyzeLastItemsCount, data) {
    //console.log("HISTORY (OK) - BRW_analyzeHistory");
    
    if(getDisplaySpeedDialPanel()) {

        FF_whileLoaded(function(){
            CNT.getHistory(function(visitedURLs){
                var visitedURLs = JSON.parse(visitedURLs);
                
                for(var k in visitedURLs){
                    visitedURLs[k]['typedCount']    = visitedURLs[k]['visitCount'];
                    visitedURLs[k]['lastVisitTime'] = visitedURLs[k]['time'];
                    visitedURLs[k]['id']            = visitedURLs[k]['url'];
                }//for
                
                //alert(callback);
                callback(visitedURLs, data);
            });
        }, function(){
            return (typeof CNT !== "undefined") ? true : false;
        }, {name:"Wait for CNT"});
        
    } else {
        callback([], data);
    }
}//BRW_analyzeHistory



/*From /pages/theme.js*/
function BRW_currentThemeId(callback, data){
    //console.log("BRW_currentThemeId - ok. Ever return 'null' ");
    
    //inf Returns a list of information about installed extensions and apps.
    
    //m Return null because firefox doesn't support this functionality
    
    var themeId = null;
    
    callback(themeId, data);
    
    /*
    chrome.management.getAll(function(exts) {
        var themeId = null;
        for(var i = 0; i < exts.length; i++)
            if(exts[i].type == "theme") {
                themeId = exts[i].id;
                break;
            }
        callback(themeId, data);
    });*/
}

/*BLOCK From /pages/backend/theme.js*/  
function BRW_themeHandlerInstallAndEnable(){
    //For CHROME 
    //console.log("OFF: BRW_themeHandlerInstallAndEnable BLOCK - NOT REWORKED, empty");
    
    /**
     * Theme install event handler
     */    
    /*
    chrome.management.onInstalled.addListener(function(ext) {
        if(ext.type == "theme") {
            clearHideVideoThemeOfferThemeId();
            //localStorage.removeItem("background-image-file");
            //localStorage.removeItem("background-image-resolution");
            localStorage.removeItem("background-video-file");
            localStorage.removeItem("background-video-resolution");
            localStorage.removeItem("hide-video-theme-offer");
            getNetTabPages(reloadTabPages);
            getOptionsThemesTabPages(reloadTabPages);
        }
    });

    // Theme enable handler
    chrome.management.onEnabled.addListener(function(ext) {
        if(ext.type == "theme") {
            currentThemeId(tryLoadBackgroundImage);
            getOptionsThemesTabPages(reloadTabPages);
        }
    });*/
}//BRW_hemeHandlerInstallAndEnable

/*From /pages/backend/backend.js*/ 
var fileStorage=false, fileStorageReady=false, fileStorageStarting=false;
function BRW_getFileSystem(callBack, data) {
    //Changed to Large Local Storage
    
    //console.log("STORAGE, BRW_getFileSystem - ok");
    //console.log(data);
    
    if(fileStorageStarting){
        whenStorageReady(function(){
            //console.log("STORAGE: already created");
            callBack(fileStorage, data);
        });
    }else{
        fileStorageStarting = true;
        
        // Specify desired capacity in bytes
        var desiredCapacity = 60 * 1024 * 1024;//60MB

        // Create a key-value store
        fileStorage = new LargeLocalStorage({size: desiredCapacity, name: 'fileStorage'});

        // Await initialization of the storage area
        fileStorage.initialized.then(function(grantedCapacity) {
          if (grantedCapacity != -1 && grantedCapacity != desiredCapacity) {
              //console.log("STORAGE: SUCCESSFULLY created");

              fileStorageReady = true;
              callBack(fileStorage, data);
          }
        });
    }//else
}//BRW_getFileSystem
getFileSystem();


//File storage >>>
function whenStorageReady(func, trys){
    if(!trys) trys=0;
    
    if(!fileStorage || !fileStorage.ready()){
        if(trys < 50) setTimeout(function(){whenStorageReady(func, ++trys)}, 50); //Wait for loading
        else console.error("Can't wait for Storage ready!"); //Error message
    }else{//Use functions
        func.call();   
    }//else
}//function

function FF_getFileNameFromURL(source){
    return String(source).split('?').shift().split('/').pop(); //Clean name of file
}

function FF_getBlobTypeFromName(fileName){
    if(String(fileName).indexOf(".mp4")) var type = 'video/mp4';         
    else if(String(fileName).indexOf(".png")) var type = 'image/png';         
    else var type = 'image/jpeg';
    
    return type;
}//FF_getBlobTypeFromName

//Put file in file storage
function fileStorageGet(source, folder, sFunc, pFunc, obj, returnSrc){
    var fileName = FF_getFileNameFromURL(source); //Clean name of file
    var folder = String(folder).split("/"+fileName)[0]; //Prepare DB folder name
    
    if((!saveFilesInLargeLocalStorage) || (String(source).split('://').length == 'OFF'/*1*/)){//Don't load files from DB
        sFunc.call(obj, source);
        return false;
    }//if
    
    BRW_getFileSystem(function(){
        fileStorage.getAttachment(folder, fileName).then(function(blob) {
            if(blob){//Use file
                var url = URL.createObjectURL(blob);
                sFunc.call(obj, url);
            }else{//Download file
                if(returnSrc) sFunc.call(obj, source);
                
                var type = FF_getBlobTypeFromName(fileName);
                
                xhrToBlob(source,
                    function(blob){// Download complete
                        //Put file into storage
                        fileStorage.setAttachment(folder, fileName, blob).then(function() {
                            //alert('finished setting the titleImage attachment');
                            //console.log(blob);
                            //alert(blob);
                        });

                        var url = URL.createObjectURL(blob);
                    
                        if(!returnSrc) sFunc.call(obj, url);
                    }, function(percent){// Download percent function
                        if(pFunc) pFunc.call(obj, percent);
                    },
                    obj, type
                );
            }//else
        });
    });
}//fileStoragePut

function xhrToBlob(url, sFunc, pFunc, obj, type) {
    if(!url){
        console.log('URL is Empty');
        return true;
    }//if
    
    if(String(url).indexOf('://') > 0){
        var url = BRW_urlTunnel(url);//TUNNEL
    }else{
        var url = addonDir+"/"+url;
        //console.log('Load directly: '+url);
    }//else   

    var xhrBlob = new XMLHttpRequest();
    xhrBlob.open('GET', url, true);
    xhrBlob.responseType = 'arraybuffer';

    xhrBlob.onload = function (e) {
        //console.log(this.status);
        
        if(xhrBlob.readyState == 4) {
            if (this.status == 200) {
                if(!type) type = 'image/jpeg';//try image
                var blob = new Blob([this.response], {type:type});
                
                if(blob) sFunc.call(obj, blob);
            } else {
                console.log('Error by path', url);
            }//else
        }
    };

    xhrBlob.onprogress = function(e) {
        if (e.lengthComputable) {
            var percentComplete = Math.ceil(e.loaded / e.total * 100);
            if(percentComplete > 0 && percentComplete <= 100) {
                pFunc.call(obj, percentComplete);
                
                //console.log(percentComplete);
            }
        }
    };

    xhrBlob.onerror = function () {
        console.log('Error by path', url);
    };

    xhrBlob.send();
}

/*From /pages/backend/common.js*/ 
function BRW_createDirectoryStructure(rootDirEntry, folders, fs, data, callback) {
    //No need to create a structure for LLS
    callback(fs, data);
    
    /*    
    if (folders[0] == '.' || folders[0] == '') folders = folders.slice(1);

    rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
        if (folders.length)
            createDirectoryStructure(dirEntry, folders.slice(1), fs, data, callback);
        else
            callback(fs, data);
    }, function() {
        console.log("error create directories structure");
    });
    */
}//BRW_createDirectoryStructure

/*From /pages/backend/common.js*/ 
function BRW_saveFileComplete(fs, data) {
    var fullPath = data.path + "/" + data.name;
    //console.log('SAVE: '+fullPath);
    
    // data.data.type = FF_getBlobTypeFromName(data.name);
    // console.info(data);
    // SAVE: themes/ndza6yswd0k6vlboxyhk/ndza6yswd0k6vlboxyhk.tablet.mp4
    
    var url = URL.createObjectURL(data.data);
    //alert(url);
    
    fileStorage.setAttachment(data.path, data.name, data.data/*blob*/).then(function() {
        //console.log('BRW_saveFileComplete [finished], URL: '+url);
        
        if(typeof (data.callback) != "undefined") data.callback(url, data);
    });
    /*
    .catch(function(err){
        console.log("ERROR: BRW_saveFileComplete - fileStorage.setAttachment");
        console.log(err);
    });
    */
}//BRW_saveFileComplete(fs, data)

// << LARGE LOCAL STORAGE

/*From /pages/backend/install.js*/ 
function BRW_setDefaultDownloadedLiveBackground(currentTheme, defaultContent) {
    var fileName = defaultContent.lastInstallBgVideo.fileName;
    var themePath = defaultContent.path;
    var fullPath  = themePath + "/" + fileName;
    
    var folder = /*"/"+*/getThemesFileSystemDir()+"/"+defaultContent.id/*+"/"*/;
    
    //console.log("BRW_setDefaultDownloadedLiveBackground ("+folder+") / ("+fullPath+")");
    
    //alert(folder);
    
    fileStorageGet(fullPath, folder, 
        function(blob_file){//Success
            //console.log('FILE: '+blob_file);

            addThemeInstalledElement(defaultContent, fileName, defaultContent.resolution, "bgVideoPath", flixelBackgroundType);//? 
        
            localStorage.setItem("background-video-file", defaultContent.id + "/" + fileName);
            localStorage.setItem("background-video-resolution", defaultContent.resolution);
            localStorage.setItem("background-video-content-type", flixelBackgroundType);

            localStorage.setItem("background-video-content-author", defaultContent.author);
        
            localStorage.setItem("background-video-content-handmade", (defaultContent.handmade ? 1 : 0));
            localStorage.setItem("background-video-content-author-url", (defaultContent.author_url ? defaultContent.author_url : ""));
            
            localStorage.setItem("last_installed_theme", currentTheme);
            localStorage.setItem("hide-video-theme-offer", currentTheme);
            
            BRW_setVideoPosterImage(defaultContent.id, extensionGetUrl("/default-content/video/juh8o6z8icha8uodbqcm.thumbnail.jpg"));
            
            setTimeout(function() {
                getNetTabPages(reloadTabPages);//Reload net tab pages?
                
                //CNT.newTabOpen("/pages/options/options.html", '_self');
                
            }, 200);
            
        }, 
        function(p){//Percent
            //console.log('DOWNLOAD [BRW_setDefaultDownloadedLiveBackground] ('+fullPath+'): '+p+'%');
        }
        /*,obj, returnSrc*/
    );
}//BRW_setDefaultDownloadedLiveBackground


/*From /pages/backend/theme.js*/ 
var FF_LAST_BRW_changeBackgroundFlixelVideoFileLoad;

function BRW_changeBackgroundFlixelVideoFileLoad(fs, data) {
    data = data || {};

    if(typeof (data.pageCallback) == "undefined")
        data.pageCallback = getNetTabPages;

    if(xhrBgVideo) {
        xhrBgVideo.onload = null;
        xhrBgVideo.onprogress = null;
        xhrBgVideo.onerror = null;
        xhrBgVideo.abort();
        xhrBgVideo = null;
        clearDownloadingVideoData();
    }
    
    var fileName = FF_getFileNameFromURL(data.bg.url); //Clean name of file
    var folder = String(data.filePath).split("/"+fileName)[0]; //Prepare DB folder name
    
    BRW_getFileSystem(function(){//Wait for load filesystem
        fileStorage.getAttachment(folder, fileName).then(function(blob){// try load hd video
            if(blob){//Found, use file
                data.url = URL.createObjectURL(blob);
                changeBackgroundFlixerVideoFileLoadSuccess(data);                
            }else{// background flixer video not found on local fs and try download
                var installedThemes = getInstalledThemes();
                if(!installedThemes || typeof (installedThemes[data.theme.id]) == "undefined") {
                    changeBackgroundFlixerVideoFileDownload(data.bg, data.theme, data.pageCallback);
                } else {
                    if(typeof (installedThemes[data.theme.id]["bgVideoPath"][data.resolution]) == "undefined") {
                        changeBackgroundFlixerVideoFileDownload(data.bg, data.theme, data.pageCallback);
                    } else {
                        var tryLoadHdFileUrl;
                        if(data.theme && data.theme.handmade)
                            tryLoadHdFileUrl = data.filePath.replace("v1920bg", "v1024bg");
                        else
                            tryLoadHdFileUrl = data.filePath.replace(".hd.", ".tablet.");

                        fileStorage.getAttachment(folder, tryLoadHdFileUrl).then(function(blob_lq){// try load low quality video
                            if(blob_lq){//Found, use file
                                if(data.theme && data.theme.handmade)
                                    data.bg.fileName = data.bg.fileName.replace("v1920bg", "v1024bg");
                                else
                                    data.bg.fileName = data.bg.fileName.replace(".hd.", ".tablet.");

                                data.url = URL.createObjectURL(blob_lq);
                                changeBackgroundFlixerVideoFileLoadSuccess(data);
                            }else{//Unfound low quality
                                changeBackgroundFlixerVideoFileDownload(data.bg, data.theme, data.pageCallback);
                            }//else
                        });
                    }//else
                }//else
            }//else
        });
    });
}//BRW_changeBackgroundFlixelVideoFileLoad

/*From /pages/backend/common.js*/ 
function BRW_getOptionsThemesTabPages(callback, data) {
    //console.log("BRW_getOptionsThemesTabPages() - Just call callback, without tabs");
    
    if(callback) callback(data);
    
    /*    
    chrome.tabs.query({ url: chrome.extension.getURL("/pages/options/options.html") }, function(tabs) {
        data = data || {};
        data.tabs = tabs;
        chrome.tabs.query({ url: chrome.extension.getURL("/pages/options/favorite.html") }, function(tabs) {
            if(data.tabs && data.tabs.length) {
                for(var i in tabs)
                    data.tabs.push(tabs[i]);
            } else
                data.tabs = tabs;
            if(callback)
                callback(data);
        });
    });
    */
}//getOptionsThemesTabPages

function BRW_sendThemeDownloadProgress(data) {
    //console.log("BRW_sendThemeDownloadProgress - Just current tab");
    //console.log(data);
    
    BRW_sendMessage({"command" : data.messageCommand, "percentComplete" : data.percentComplete, "downloadingFile" : data.downloadingFile});
}//BRW_sendThemeDownloadProgress


/*From /pages/backend/theme.js*/ 
function BRW_PARTLY_changeBackgroundImageFileLoadComplete(data){
    //console.log('BRW_PARTLY_changeBackgroundImageFileLoadComplete');
    getNetTabPages(reloadTabPages);//Reload new tab pages
    
    //getOptionsThemesTabPages(function(data) {
        BRW_sendMessage({
            "command" : "changeStaticBackgroundToOptionsPage",
            "image" : data.image,
            "theme" : data.theme
        });
    //}, data);
}//BRW_PARTLY_changeBackgroundImageFileLoadComplete

/*From /pages/backend/theme.js*/ 
function BRW_PARTLY_changeBackgroundFlixerVideoFileComplete(data){
    //console.log('BRW_PARTLY_changeBackgroundFlixerVideoFileComplete');
    
    getNetTabPages(reloadTabPages);
    
    var response = {
        "command" : "changeFlixerBackgroundToOptionsPage",
        "videoThemeId" : data.theme.id,
        "currentImage" : getBackgroundImageFile(),
        "currentImageResolution" : getBackgroundImageFileResolution(),
        "currentVideo" : getBackgroundVideoFile(),
        "currentVideoResolution" : getBackgroundVideoFileResolution()
    };
    
    BRW_sendMessage(response);
}//BRW_PARTLY_changeBackgroundFlixerVideoFileComplete

/*From pages/backend/backend.js*/
function BRW_loadBackgroundVideoFile(fs, sendResponse, defaultResponse) {
    var filePath = getBackgroundVideoFile();
    defaultResponse = defaultResponse || {
            "video" : "",
            "image" : "",
            "parallaxValue" : getBackgroundParallaxValue(),
            "visibleDials" : getVisibleSpeedDialPanel(),
            "displayDials" : getDisplaySpeedDialPanel(),

            "isFlixelVideoContent" : isBackgroundVideoFlixelContent(),
            "flixelVideoContentAuthor" : getBackgroundVideoFlixelContentAuthor(),

            "visibleTodoPanel" : getVisibleTodoPanel(),
            "displayTodoDialPanel" : getDisplayTodoDialPanel(),
            "displayTodoCoordinates" : getDisplayTodoCoordinates(),
            "displayTodoSize" : getDisplayTodoSize()
        };
    defaultResponse.enableParallax = getDisplayParallaxVideoTheme();
    

    if(filePath) {
        BRW_getFileSystem(function(){//Wait for load filesystem
            if(localStorage.getItem("firefox-background-video-poster-image")){//Background image
                fileStorage.getAttachment(
                    localStorage.getItem("firefox-background-video-poster-folder"),
                    localStorage.getItem("firefox-background-video-poster-image")
                ).then(function(blob){
                    loadBackgroundVideoFileInner();
                    
                    var posterURL = URL.createObjectURL(blob);
                    
                    setTimeout(function(){
                        $("#background-container").append(
                            $("<img/>", {src:posterURL}).addClass("fill").css({
                                'top'       : 0,
                                'left'      : 0,
                                "opacity"   : 1,//0.0,
                                'width'     : '100%',
                                //"margin-top": '-30px',
                                'z-index'   : '-1000',
                                'position'  : 'fixed',
                                'min-width' : localStorage.getItem("background-video-resolution")
                            })
                            .animate({"opacity":1}, 700, function(){
                                recalculateMediaSize();
                            })
                        );
                        //recalculateMediaSize();
                    }, 500);
                    
                    
                });
            }
            
            /*
            if(localStorage.getItem("firefox-background-video-url")){
                defaultResponse.video = localStorage.getItem("firefox-background-video-url");
                sendResponse(defaultResponse); 
            }
            */
            else loadBackgroundVideoFileInner();

            
            function loadBackgroundVideoFileInner(){
                var folder = String(filePath).split('/');
                var fileName = folder.pop();
                folder = folder.join('/');

                fileStorage.getAttachment(folder, fileName).then(function(blob){// try load hd video
                    if(blob){//Found, use file
                        defaultResponse.video = URL.createObjectURL(blob);
                        sendResponse(defaultResponse);                
                    }else{//Unfound
                        var filePath = getStorageBackgroundVideoFile();
                        var resolution = getBackgroundVideoFileResolution();
                        var backgroundType = getBackgroundVideoContentType();
                        var themeId = getThemeIdByFilePath(filePath);
                        if(themeId && resolution) {
                            if(backgroundType == flixelBackgroundType)
                                BRW_getFileSystem(changeBackgroundFlixerVideoFile, {sendResponse: sendResponse, themeId: themeId, resolution: resolution});
                            else
                                loadThemeConfig(themeId, startDownloadResolutionVideoTheme, {"resolution" : resolution});
                        } else
                            sendResponse(defaultResponse);
                    }//else
                });
            }//function
        });
    } else
        sendResponse(defaultResponse);
    
}//BRW_loadBackgroundVideoFile


/*From /pages/common.js*/    
function BRW_refreshNewTabPages(data){
    BRW_getNetTabPages(function(){
        //BRW_reloadTabPages(data);
    }, data);
}

/*From /pages/common.js*/              
function BRW_getNetTabPages(callback, data) {
    FF_getURLTabPages(callback, data, "/pages/newtab/newtab.html");
} 

/*From /pages/backend/common.js*/ 
function BRW_getSettingsTabPages(callback, data){
    FF_getURLTabPages(callback, data, "/pages/options/settings.html");
}//BRW_getSettingsTabPages


/*From /pages/backend/common.js*/ 
function BRW_getOptionsTabPages(callback, data) {
    FF_getURLTabPages(callback, data, "/pages/options/options.html");
}//BRW_getOptionsTabPages

/*From /pages/backend/common.js*/ 
function BRW_getFavoriteTabPages(callback, data) {
    FF_getURLTabPages(callback, data, "/pages/options/favorite.html");
}//BRW_getFavoriteTabPages

//Universal get tab pages by URL
function FF_getURLTabPages(callback, data, extURL){//console.info('FF_getURLTabPages(callback, data, extURL)', callback, data, extURL);
    FF_whileLoaded(function(){
        CNT.getTabsIdByURL(extensionGetUrl(extURL), function(answer){
            var answer = JSON.parse(answer);

            if(callback) {
                data = data || {};
                data.tabs = answer;
                callback(data);
            }
        });
    }, function(){
        return (typeof CNT !== "undefined") ? true : false;
    }, {name:"Wait for CNT"});
}//FF_getURLTabPages

/*From /pages/backend/common.js*/ 
function BRW_reloadTabPages(data) {
    
    if(!data || !data.tabs){
        console.info('SKIP "BRW_reloadTabPages"', data);
        return false;
    }//if
    
    setTimeout(function() {
        if('skipTab' in data) data.skipTab = Firefox_ActiveTabId;

        var tabs = data.tabs;
        var tabsCount = tabs.length, i;
        var skipTab = data.skipTab || 0;

        for(i = 0; i < tabsCount; i++) {
            if(skipTab != tabs[i])
                CNT.reloadTabById(tabs[i]);
        }
    }, 250);
    
    return true;
}//BRW_reloadTabPages


/*From pages/backend/backend.js*/
function BRW_getFavoriteCurentTab(callback) {
    //console.info("DO NOTHING, BRW_getFavoriteCurentTab, just callback");
    
    callback();
}//BRW_getFavoriteCurentTab

/////////////////////  Language functions /////////////////////
var language, defaultUserCountry = "EN", languageArr={}, languageSafety={};
//FF_countryFromBrowser();

function FF_checkCountryIsActual(country) {
    var countries = ["US", "GB", "EN", "RU", "IT", "FR", "ES", "DE", "JA", "TR"];//, "GB", "UK", "NL", "IE", "CH", "CA", "BE", "AU", "AT"];
    return countries.indexOf(country) >= 0;
}

function FF_countryFromBrowser(browser_locate){
    var definedLocation = localStorage.getItem("definedLocation");
    
    if(!definedLocation){
        var country = "";
        var searchBy = 'COUNTRY_SEARCH_BY_DEFAULT';
        
        language = browser_locate || localStorage.getItem("browserLocation");

        if(language && String(language).length > 1) {
            country = language.substr(0, 2).toUpperCase();

            if(!FF_checkCountryIsActual(country)) {
                country = defaultUserCountry;
            } else {
                searchBy = 'COUNTRY_SEARCH_BY_LANGUAGE';
            }
        }else{
            country = defaultUserCountry;
        }
        
        //alert('Search: '+language);

        localStorage.setItem("definedLocation", country);
        localStorage.setItem("locationDefinedBy", searchBy);

        FF_getLanguageFromFile('group_3', country, searchBy);
    }else{
        //alert('Use: '+definedLocation);
        FF_getLanguageFromFile('group_2', definedLocation, localStorage.getItem("locationDefinedBy"));
    }//else
}//function

// Load language json file from "_locates"
function FF_getLanguageFromFile(group, country, searchBy){
    var eng = ["us", "gb", "uk"/*, "ru"*/];
    
    var fldr = country.toLowerCase();
    if(eng.indexOf(fldr) >= 0) fldr = 'en';
    
    if(fldr != 'en') FF_getSafetyEnLanguage();
    
    var file = "../../_locales/"+fldr+"/messages.json";
    
    loadStaticJSON(file, function (response) {
        // Parse JSON string into object
        var actual_JSON = JSON.parse(response);
        languageArr = actual_JSON;
    });
    
    return true;
}//function

function FF_getSafetyEnLanguage(){
    var file = "../../_locales/en/messages.json";
    
    loadStaticJSON(file, function (response) {
        var actual_JSON = JSON.parse(response);
        languageSafety = actual_JSON;
    });
}

function BRW_langLoaded(func, trys, deft){
    if(!trys) trys=0; if(!deft) deft=false;
    
    if (!Object.keys(languageArr).length){
        if(trys < 35) setTimeout(function(){BRW_langLoaded(func, ++trys, deft)}, 65);
        /*
        else if(!deft){
            FF_countryFromBrowser();
            setTimeout(function(){BRW_langLoaded(func, 0, true)}, 50); //Wait for loading by default
        }
        */
        else console.log("Can't load language\Try to refresh page");
    }else{//Use functions
        func.call(false, String(localStorage.getItem("definedLocation")).toLowerCase()); 
    }
}//function

//Load static JSON file
function loadStaticJSON(file, callback) {
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);

        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    
    xobj.send(null);  
}//loadStaticJSON

//Load static XML file
function loadStaticXML(fileUrl, callbackSuccess, callbackError) {
    console.info("Try to load static XML file", fileUrl);
    
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/xml");
        xobj.open('GET', fileUrl, true);

        xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {//Success
               console.info("Static XML file successfully loaded", xobj.responseXML);
              
               if(callbackSuccess) 
                   callbackSuccess(xobj.responseXML);
          }else{//Error
               if(callbackError) 
                   callbackError();
          }
        };
        
        xobj.onerror = function(){//Error
            if(callbackError) 
                callbackError();
        }; 
    
    xobj.send(null);  
}//loadStaticXML

/////////////////// <<< Language functions ////////////////////


////////////////////    COMMON FUNCTIONS   ////////////////////

/*From /pages/backend/common.js*/  
function translate(key) {
    if(!languageArr[key]){
        if(!languageSafety[key]){
            console.info('Can`t translate '+key+' to '+localStorage.getItem('definedLocation'));
            return '';   
        }return languageSafety[key].message;
    }return languageArr[key].message; //chrome.i18n.getMessage(key);
}

function BRW_getAcceptLanguages(func){
    BRW_langLoaded(func);
}//function

function BRW_getUILanguage(func){
    BRW_langLoaded(func);
}//function


function FF_whileLoaded(execFunction, condFunction, obj){
    if(!obj) obj={}; if(!obj.trys) obj.trys=0; if(!obj.name) obj.name='UNNAMED WAIT';
    
    if (!condFunction.call()){
        obj.trys++;
        if(obj.trys < 25) setTimeout(function(){FF_whileLoaded(execFunction, condFunction, obj)}, 70);
        else console.log("Can't wait to "+obj.name);
    }else{//Use functions
        execFunction.call(); 
    }
}//function

/*From /pages/backend/common.js*/ 
function BRW_openUrlInCurrentTab(url){
    window.location.href=url;
}

/*From /pages/backend/common.js*/ 
function BRW_openUrlInNewTab(url){
    //console.trace();
    CNT.newTabOpen(url, '_blank');
}

/*From /pages/backend/common.js*/     
function BRW_openUrlInBackgroundTab(url){
    CNT.newTabOpen(url, '_background');
}

function BRW_TabsGetCurrentID(func){
    FF_whileLoaded(
        function(){
            func.call(false, Firefox_ActiveTabId);
        }, function(){
            //console.log("Firefox_ActiveTabId: "+Firefox_ActiveTabId);
            return Firefox_ActiveTabId != undefined ? true : false;
        }, 
        {name: 'BRW_TabsGetCurrentID'}
    );
}//BRW_TabsGetCurrentID

//Universal request function
function BRW_ajax(url, successFunction, errorFunction, param){
    var myself = this;
    myself.execute = true;
    
    CNT.ffRequest(url, {}, function(answer){
       if(myself.execute){
            var data = JSON.parse(answer);

            myself.answer = data;
            //console.log("↓ ↓ ↓ ↓ ↓ CNT.ffRequest ↓ ↓ ↓ ↓ ↓");
            //console.log(data);
            //console.log("↑ ↑ ↑ ↑ ↑ CNT.ffRequest ↑ ↑ ↑ ↑ ↑");

            if(data.statusCode == 200){//Success
                var callbackData = false;
                
                if(param && (param.xml || param.dataType == 'xml')) callbackData = myself.getXML();
                else if(param && param.text) callbackData = myself.getText();//data.text;
                else callbackData = data.json;
                
                successFunction.call(true, callbackData);
            }else{//Error
                if(errorFunction)
                    errorFunction.call(true, data.statusText);
                else{
                    //console.info(data.statusText, url);
                }
            }
       }else console.log('OK, Request aborted by script.');
    });
    
    myself.getText = function(){
        myself.responseText = myself.answer.text;
        return myself.responseText;
    }    
    myself.getXML = function(){
        myself.responseXML = parseXml(myself.answer.text);
        return myself.responseXML;
    }
    
    myself.abort = function(){
        myself.execute = false;
    }
    
    return myself;
}//BRW_ajax

//Universal JSON queries
function BRW_json(url, successFunction, errorFunction, param){
    BRW_ajax(url, successFunction, errorFunction, param);
}

//Universal POST function
function BRW_post(url, data, successFunction, errorFunction){
    CNT.ffRequest(url, {type:'POST', content:data}, function(answer){
        var data = JSON.parse(answer);
        
        //console.log("↓ ↓ ↓ ↓ ↓ (POST) CNT.ffRequest ↓ ↓ ↓ ↓ ↓");
        //console.log(data);
        //console.log("↑ ↑ ↑ ↑ ↑ (POST) CNT.ffRequest ↑ ↑ ↑ ↑ ↑");
        
        if(data.statusCode == 200){//Success
            successFunction.call(true, data.json);
        }else{//Error
            errorFunction.call(true, data.statusText);
        }
    });    
}//BRW_post

//Universal getFile function
function BRW_fsGetFile(fs_not_needed, filePath, successFunction, notFoundFunction){
    //console.info("BRW_fsGetFile(filePath = "+filePath+")");
    
    var folder = String(filePath).split('/');
    var fileName = folder.pop();
    folder = folder.join('/');
    
    BRW_getFileSystem(function(){//Wait (check) for load filesystem
        fileStorage.getAttachment(folder, fileName).then(function(blob){// try load form LLS
            if(blob){//Found, use file
                var url = URL.createObjectURL(blob);
                //console.log("↑ BRW_fsGetFile: Found ("+url+")");
                successFunction.call(true, url);              
            }else{//Unfound
                //console.log("↑ BRW_fsGetFile: NOT Found");
                notFoundFunction.call();
            }//else
        });
    });
}//BRW_fsGetFile

function BRW_fsRemoveFile(folder, fileName, sFunc, eFunc){
    BRW_getFileSystem(function(){
        fileStorage.rmAttachment(folder, fileName).then(function() {
            console.log('Removed: ', folder, fileName);
        }).catch(function(e) {
            console.log('Attachment removal failed: ' + e);
        }); 
    });
}//function


function BRW_setVideoPosterImage(themeID, imageURL){
    localStorage.setItem("firefox-background-video-poster-image", false);
    localStorage.setItem("firefox-background-video-poster-folder", false);

    fileStorageGet(imageURL, "thumbnails/"+themeID, 
        function(blob_file){//Success
            //console.log('THUMB: '+blob_file);
            localStorage.setItem("firefox-background-video-poster-image" , FF_getFileNameFromURL(imageURL));
            localStorage.setItem("firefox-background-video-poster-folder", "thumbnails/"+themeID);
        }, 
        function(p){//Percent
            //console.log('DOWNLOAD [BRW_setVideoPosterImage] ('+imageURL+'): '+p+'%');
        }
    );
            
}

function BRW_bgVideoControl(action){
    var video = document.getElementById("background");
    
    if(video){
        console.log('BG VIDEO: '+action);
        
        switch(action){
            case "activate":
                video.play();
            break;
            case "deactivate":
                video.pause();
            break;                
        }//switch
    }//if
}//BRW_bgVideoControl


//////////////////// LIBRARY ////////////////////

function parseXml(xml) {
   var dom = null;
   if (window.DOMParser) {
      try { 
         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
      } 
      catch (e) { dom = null; }
   }
   else if (window.ActiveXObject) {
      try {
         dom = new ActiveXObject('Microsoft.XMLDOM');
         dom.async = false;
         if (!dom.loadXML(xml)) // parse error ..

            window.alert(dom.parseError.reason + dom.parseError.srcText);
      } 
      catch (e) { dom = null; }
   }
   else
      alert("cannot parse xml string!");
   return dom;
}








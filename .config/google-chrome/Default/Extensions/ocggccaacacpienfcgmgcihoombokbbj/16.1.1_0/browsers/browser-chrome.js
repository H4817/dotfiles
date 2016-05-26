const BROWSER = 'chrome';
if(localStorage.getItem("html5-video-h264") == null) localStorage.setItem("html5-video-h264", html5VideoDetectH264());

if(!localStorage.getItem("definedLocation")){
    localStorage.setItem("definedLocation", chrome.i18n.getUILanguage());
}//if

function BRW_options_page_prepare(){
    return true;//Do nothing
}

/*Chrome API functions*/
function extensionGetUrl(src){
    return chrome.extension.getURL(src);
}//extensionGetUrl

function BRW_favicon(url){
    return "chrome://favicon/" + url;
}//BRW_favicon

/*Chrome API functions*/

/*From pages/backend/backend.js*/
function BRW_browserbrowserActionOnClicked(){
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
}//BRW_browserbrowserActionOnClicked
     
function BRW_sendMessage(message, callBack){
    chrome.runtime.sendMessage(message, callBack);    
}//function 

/*From pages/backend/backend.js*/
function BRW_onMessageAddListener(){
    chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
        if(typeof(message.command) != "undefined") {
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
                var openDialType = message.newtab ? message.newtab : getOpenDialType();
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
                getAvailableThemesList(sendUpdatedAvailableThemes, {sendResponse : sendResponse, search: message.search || false});
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
            } else if(message.command == "setClockDate") {
                setClockDate(message.val);
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
                getOptionsTabPages(reloadTabPages, {skipTab: message.tab});
                getFavoriteTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setRandomThemesDisplaySettings") {
                setRandomThemesDisplay(message.val);
                getNetTabPages(reloadTabPages);
                getFavoriteTabPages(reloadTabPages, {skipTab: message.tab});
                getOptionsTabPages(reloadTabPages, {skipTab: message.tab});
            } else if(message.command == "setThemesSortType") {
                setThemesSortType(message.val);
                getOptionsTabPages(reloadTabPages);
            } else if(message.command == "setImagesSortType") {
                setImagesSortType(message.val);
                getOptionsTabPages(reloadTabPages);
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
            } else if(message.command == "getThumbForUserImage") {
                getThumbForUserImage(message.theme);
                return true;
            } else if(message.command == "saveInputFileImage") {
                saveInputFileImage(message.blob, message.theme);
                return true;
            } else if(message.command == "loadBackgroundImageFromUser") {
                loadBackgroundImageFromUser(message.url, message.theme);
                return true;
            } else if(message.command == "changeBackgroundImageFileLoadComplete") {
                changeBackgroundImageFileLoadComplete(message.url, message.data);
                return true;
            }
        }
    });
}//BRW_onMessageAddListener

/*From pages/backend/install.js*/
function BRW_setAppUninstallHandler() {
    chrome.i18n.getAcceptLanguages(function(languages) {
        var hasRuLanguage = languages.indexOf("ru") != -1;
        chrome.runtime.setUninstallURL(shareBasicUrl + (hasRuLanguage ? "ru/" : "") + "uninstall");
    });
}//BRW_setAppUninstallHandler

/*From pages/common.js*/
function BRW_analyzeHistory(callback, analyzeLastItemsCount, data) {
    analyzeLastItemsCount = analyzeLastItemsCount ? analyzeLastItemsCount : getAnalyzeHistoryLength();
    if(getDisplaySpeedDialPanel()) {
        chrome.history.search({"text" : "", "maxResults" : analyzeLastItemsCount, startTime: 0, endTime: (new Date()).getTime()}, function(visitedURLs) {
            callback(visitedURLs, data);
        });
    } else {
        callback([], data);
    }
}//BRW_analyzeHistory



/*From pages/theme.js*/
function BRW_currentThemeId(callback, data){
    //inf Returns a list of information about installed extensions and apps.
    
    chrome.management.getAll(function(exts) {
        var themeId = null;
        for(var i = 0; i < exts.length; i++)
            if(exts[i].type == "theme") {
                themeId = exts[i].id;
                break;
            }
        
        callback(themeId, data);
    });
}

/*From /pages/common.js*/              
function BRW_getNetTabPages(callback, data) {
    chrome.tabs.query({ url: "chrome://newtab/" }, function(tabs) {
        if (typeof(tabs) != "undefined") {
            if(callback) {
                data = data || {};
                data.tabs = tabs;
                callback(data);
            }
        }
    });
}//BRW_getNetTabPages  

/*From /pages/common.js*/    
function BRW_refreshNewTabPages(data){
    if(data && data.tabs){
        var tabs = data.tabs;
        var newTabPageUrl = extensionGetUrl( "pages/newtab/newtab.html" );
        var tabsCount = tabs.length, i;
        for(i = 0; i < tabsCount; i++)
            chrome.tabs.update(tabs[i].id, { url: newTabPageUrl });
    }
}

/*BLOCK From /pages/backend/theme.js*/  
function BRW_themeHandlerInstallAndEnable(){
    /**
     * Theme install event handler
     */    
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

    /**
     * Theme enable handler
     */
    chrome.management.onEnabled.addListener(function(ext) {
        if(ext.type == "theme") {
            currentThemeId(tryLoadBackgroundImage);
            getOptionsThemesTabPages(reloadTabPages);
        }
    });
}//BRW_hemeHandlerInstallAndEnable


/*From /pages/backend/backend.js*/ 
function BRW_getFileSystem(callBack, data) {
    navigator.webkitPersistentStorage.requestQuota(1024*1024, function(grantedBytes) {
        window.requestFileSystem(PERSISTENT, grantedBytes, function(fs) {
            callBack(fs, data);
        });
    });
}

/*From /pages/backend/common.js*/ 
function BRW_reloadTabPages(data) {
    var tabs = data.tabs;
    var tabsCount = tabs.length, i;
    var skipTab = data.skipTab;
    
    for(i = 0; i < tabsCount; i++) {
        if(skipTab != tabs[i].id)
            chrome.tabs.reload(tabs[i].id);
    }
}

/*From /pages/backend/install.js*/ 
function BRW_setDefaultDownloadedLiveBackground(currentTheme, defaultContent) {
    //console.log("LOG - install.js - setDefaultDownloadedLiveBackground");
    var fileName = defaultContent.lastInstallBgVideo.fileName;
    /*
    if(!html5VideoDetectH264() && fileName == "juh8o6z8icha8uodbqcm.hd.mp4"){
        console.log('change to webm');
        fileName == "juh8o6z8icha8uodbqcm.webm";
    }else console.log('MP4444', html5VideoDetectH264(), fileName);
    */
    var themePath = defaultContent.path;
    var fullPath  = themePath + "/" + fileName;
    
    getFileSystem(function(fs, data) {
        chrome.runtime.getPackageDirectoryEntry(function(root) {
            root.getFile(fullPath, {}, function(fileEntry) {
                if(fileEntry.name.indexOf(".mp4") > 0 || fileEntry.name.indexOf(".webm") > 0) {
                    fs.root.getDirectory(getThemesFileSystemDir(), {create: true}, function (themesDirEntry) {
                        themesDirEntry.getDirectory(defaultContent.id, {create: true}, function (dirEntry) {
                            fileEntry.copyTo(dirEntry);
                            addThemeInstalledElement(defaultContent, fileName, defaultContent.resolution, "bgVideoPath", flixelBackgroundType);
                            localStorage.setItem("background-video-file", defaultContent.id + "/" + fileName);
                            localStorage.setItem("background-video-resolution", defaultContent.resolution);
                            localStorage.setItem("background-video-content-type", flixelBackgroundType);
                            localStorage.setItem("background-video-content-author", defaultContent.author);
                            localStorage.setItem("background-video-content-handmade", (defaultContent.handmade ? 1 : 0));
                            localStorage.setItem("background-video-content-author-url", (defaultContent.author_url ? defaultContent.author_url : ""));
                            localStorage.setItem("last_installed_theme", currentTheme);
                            localStorage.setItem("hide-video-theme-offer", currentTheme);
                            setTimeout(function() {
                                getNetTabPages(reloadTabPages);
                                openUrlInNewTab(chrome.extension.getURL("/pages/options/options.html"));
                            }, 200);
                        });
                    });
                }
            });
        });
    }, {});
}//BRW_setDefaultDownloadedLiveBackground

/*From /pages/backend/theme.js*/ 
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

        fs.root.getFile(data.filePath, {}, function(fileEntry) { // try load hd video
            data.url = fileEntry.toURL();
            changeBackgroundFlixerVideoFileLoadSuccess(data);
        }, function() { // background flixer video not found on local fs and try download
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

                    fs.root.getFile(tryLoadHdFileUrl, {}, function(fileEntry) { // try load low quality video
                        if(data.theme && data.theme.handmade)
                            data.bg.fileName = data.bg.fileName.replace("v1920bg", "v1024bg");
                        else
                            data.bg.fileName = data.bg.fileName.replace(".hd.", ".tablet.");
                        data.url = fileEntry.toURL();
                        changeBackgroundFlixerVideoFileLoadSuccess(data);
                    }, function() {
                        changeBackgroundFlixerVideoFileDownload(data.bg, data.theme, data.pageCallback);
                    });
                }
            }
        });
}//BRW_changeBackgroundFlixelVideoFileLoad

/*From /pages/backend/common.js*/ 
function BRW_createDirectoryStructure(rootDirEntry, folders, fs, data, callback) {
    if (folders[0] == '.' || folders[0] == '') folders = folders.slice(1);

    rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
        if (folders.length)
            createDirectoryStructure(dirEntry, folders.slice(1), fs, data, callback);
        else
            callback(fs, data);
    }, function() {
        console.log("error create directories structure");
    });
}

/*From /pages/backend/common.js*/ 
function BRW_saveFileComplete(fs, data) {
    var fullPath = data.path + "/" + data.name;
    fs.root.getFile(fullPath, {create: true}, function (fileEntry) {
        fileEntry.createWriter(function (writer) {
            var blob = new Blob([data.data]);
            writer.onwriteend = function () {
                var url = fileEntry.toURL();
                if(typeof (data.callback) != "undefined")
                    data.callback(url, data);
            };
            writer.write(blob);
        });
    });
}

/*From /pages/backend/common.js*/ 
function BRW_getOptionsThemesTabPages(callback, data) {
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
}//getOptionsThemesTabPages

/*From /pages/backend/theme.js*/ 
function BRW_sendThemeDownloadProgress(data) {
    var tabs = data.tabs;
    var tabsCount = tabs.length, i;
    for(i = 0; i < tabsCount; i++) {
        if(typeof (data.percentComplete) != "undefined")
            chrome.tabs.sendMessage(tabs[i].id, {"command" : data.messageCommand, "percentComplete" : data.percentComplete, "downloadingFile" : data.downloadingFile});
    }
}//BRW_sendThemeDownloadProgress


/*From /pages/backend/theme.js*/ 
function BRW_PARTLY_changeBackgroundImageFileLoadComplete(data){
    getNetTabPages(reloadTabPages);
    getOptionsThemesTabPages(function(data) {
        var tabs = data.tabs;
        var tabsCount = tabs.length, i;
        for(i = 0; i < tabsCount; i++) {
            if(typeof (data.image) != "undefined") {
                chrome.tabs.sendMessage(tabs[i].id, {
                    "command" : "changeStaticBackgroundToOptionsPage",
                    "image" : data.image,
                    "theme" : data.theme
                });
            }
        }
    }, data);
}//BRW_PARTLY_changeBackgroundImageFileLoadComplete

/*From /pages/backend/theme.js*/ 
function BRW_PARTLY_changeBackgroundFlixerVideoFileComplete(data){
    getNetTabPages(reloadTabPages);
    getOptionsThemesTabPages(function(data) {
        var tabs = data.tabs;
        var tabsCount = tabs.length, i;
        var response = {
            "command" : "changeFlixerBackgroundToOptionsPage",
            "videoThemeId" : data.theme.id,
            "currentImage" : getBackgroundImageFile(),
            "currentImageResolution" : getBackgroundImageFileResolution(),
            "currentVideo" : getBackgroundVideoFile(),
            "currentVideoResolution" : getBackgroundVideoFileResolution()
        };
        for(i = 0; i < tabsCount; i++) {
            if(typeof (data.video) != "undefined") {
                chrome.tabs.sendMessage(tabs[i].id, response);
            }
        }
    }, data);
}//BRW_PARTLY_changeBackgroundFlixerVideoFileComplete

/*From /pages/backend/common.js*/ 
function BRW_getSettingsTabPages(callback, data){
    chrome.tabs.query({ url: chrome.extension.getURL("/pages/options/settings.html") }, function(tabs) {
        if (typeof(tabs) != "undefined") {
            if(callback) {
                data = data || {};
                data.tabs = tabs;
                callback(data);
            }
        }
    });
}//BRW_getSettingsTabPages

/*From /pages/backend/common.js*/ 
function BRW_getOptionsTabPages(callback, data) {
    chrome.tabs.query({ url: chrome.extension.getURL("/pages/options/options.html") }, function(tabs) {
        if (typeof(tabs) != "undefined") {
            if(callback) {
                data = data || {};
                data.tabs = tabs;
                callback(data);
            }
        }
    });
}//BRW_getOptionsTabPages

/*From /pages/backend/common.js*/ 
function BRW_getFavoriteTabPages(callback, data) {
    chrome.tabs.query({ url: chrome.extension.getURL("/pages/options/favorite.html") }, function(tabs) {
        if (typeof(tabs) != "undefined") {
            if(callback) {
                data = data || {};
                data.tabs = tabs;
                callback(data);
            }
        }
    });
}//BRW_getFavoriteTabPages

/*From pages/backend/backend.js*/
function BRW_loadBackgroundVideoFile(fs, sendResponse, defaultResponse) {
    //console.log("LOG - backend.js - loadBackgroundVideoFile");
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
        fs.root.getFile(filePath, {}, function (fileEntry) {
            defaultResponse.video = fileEntry.toURL();
            sendResponse(defaultResponse);
        }, function (error) {
            var filePath = getStorageBackgroundVideoFile();
            var resolution = getBackgroundVideoFileResolution();
            var backgroundType = getBackgroundVideoContentType();
            var themeId = getThemeIdByFilePath(filePath);
            if(themeId && resolution) {
                if(backgroundType == flixelBackgroundType)
                    getFileSystem(changeBackgroundFlixerVideoFile, {sendResponse: sendResponse, themeId: themeId, resolution: resolution});
                else
                    loadThemeConfig(themeId, startDownloadResolutionVideoTheme, {"resolution" : resolution});
            } else
                sendResponse(defaultResponse);
        });
    } else
        sendResponse(defaultResponse);
}//BRW_loadBackgroundVideoFile

/*From pages/backend/backend.js*/
function BRW_getFavoriteCurentTab(callback) {
    chrome.tabs.getCurrent(function(tab) {
        favoriteTabId = tab.id;
        callback();
    });
}//BRW_getFavoriteCurentTab

//////////////////// COMMON FUNCTIONS ////////////////////

function BRW_openDefaultTab(url){
    chrome.tabs.update({
        url: "chrome-search://local-ntp/local-ntp.html"
    });
}

/*From /pages/backend/common.js*/ 
function BRW_openUrlInCurrentTab(url){
    chrome.tabs.update({
        url: url
    });
}

/*From /pages/backend/common.js*/ 
function BRW_openUrlInNewTab(url){
    chrome.tabs.create({
        url: url,
        active: true
    });
}

/*From /pages/backend/common.js*/     
function BRW_openUrlInBackgroundTab(url){
    chrome.tabs.create({
        url: url,
        active: false
    });
}//BRW_openUrlInBackgroundTab

/*From /pages/backend/common.js*/  
function translate(key) {
    return chrome.i18n.getMessage(key);
}//translate

function BRW_langLoaded(func){
    func.call(true, chrome.i18n.getUILanguage());    
}//BRW_langLoaded


function BRW_getAcceptLanguages(func){
    chrome.i18n.getAcceptLanguages(function(languages){
        func.call(false, languages);
    });
}//BRW_getAcceptLanguages

function BRW_getUILanguage(func){
    func.call(false, chrome.i18n.getUILanguage());
}//function

function BRW_TabsGetCurrentID(func){
    chrome.tabs.getCurrent(function(tab) {
        func.call(false, tab.id);
    });
}//BRW_TabsGetCurrentID

function BRW_urlTunnel(url){
    return url;
}//BRW_urlTunnel

//Universal request function
function BRW_ajax(url, successFunction, errorFunction, param){
    var dataType = 'json';
    if(param && param.xml) dataType = 'xml';
    if(param && param.text) dataType = 'text';
    
    var send = {
        type: "GET",
        url: url,
        contentType: "application/json; charset=utf-8",
        dataType: dataType,
        success: function (data) {
            //console.log(data);
            if(successFunction)
                successFunction.call(true, data);
        },
        error: function (error) {
            //console.log(error);
            if(errorFunction)
                errorFunction.call(true, error);
        }
    };
    
    if(param && param.dataType) send.dataType = param.dataType;
        
    var ajax = $.ajax(send);
    
    return ajax;
}//BRW_ajax

function BRW_json(url, successFunction, errorFunction, param){
    $.getJSON(url,function(e) {
        if(successFunction)
            successFunction(e);
    });
}//BRW_json

//Universal POST function
function BRW_post(url, data, successFunction){
    $.post(url, data, successFunction);
}//BRW_ajax

//Universal getFile function
function BRW_fsGetFile(fs, filePath, successFunction, errorFunction){
    fs.root.getFile(filePath, {}, function(fileEntry) {
        var url = fileEntry.toURL();
        if(successFunction)
            successFunction.call(true, url);
    }, function(error) { // background video not found on local fs and try download
        if(errorFunction)
            errorFunction.call(true, error);
    });
}//BRW_fsGetFile

function BRW_fsRemoveFile(folder, fileName, sFunc, eFunc){
     getFileSystem(function(fs, data) {
          fs.root.getFile(folder+'/'+fileName, {create: false}, function(fileEntry) {
                fileEntry.remove(function() {
                    console.log('File removed. '+folder+'/'+fileName);
                }, function(){//delete error
                    console.log('Can`t delete: '+folder+'/'+fileName);
                });
          }, function(){//cant foud
              //console.log('Can`t found: '+folder+'/'+fileName);
          });
     });
    
}//function

function BRW_setVideoPosterImage(){
    return true;
}


//Load static XML file
function loadStaticXML(fileUrl, callbackSuccess, callbackError) {
    $.ajax({
        type: "GET",
        url: fileUrl,
        dataType: "xml",
        success: function (xml) {
            if(callbackSuccess) 
                callbackSuccess(xml);
        },
        error: function() {
            if(callbackError)
                callbackError();
        }
    });
}//loadStaticXML

function FF_whileLoaded(execFunction, condFunction, obj){
    execFunction.call(); 
}
/*
chrome.tabs.onActivated.addListener(function(){
    BRW_getNetTabPages(function(data){
        chrome.runtime.sendMessage({
            command: "pageBgVideoControl",
            tabs : data.tabs
        });        
    });
});
*/

/*
chrome.tabs.onActivated.addListener(function(){
    chrome.tabs.getCurrent(function(currentTab){
        BRW_getNetTabPages(
            function(data){
                if(data.tabs) for(let key in data.tabs){
                    //console.log(data.tabs[key].id + " vs " + currentTab.id);
                    if(data.tabs[key].id != currentTab.id){//pause
                        chrome.tabs.sendMessage(data.tabs[key].id, {
                            command: "pageBgVideoControl",
                            action : "deactivate"
                        });
                    }else{//play
                        //chrome.runtime.sendMessage({
                        chrome.tabs.sendMessage(data.tabs[key].id, {
                            command: "pageBgVideoControl",
                            action : "activate"
                        });
                    }//else
                }//if for
            },{
                current: currentTab.id
            }
        );
    });
});
*/

function checkH264(){
    var h264 = localStorage.getItem("html5-video-h264") || false;
    if (h264 == true || h264 == "true") return true;
    return false;
}

function mp4ToWebm(src){
    var url = String(src);
    
    if(url.indexOf('flixels.s3.amazonaws.com') > -1 && url.indexOf('.mp4') > -1){
        url = url.replace('.tablet.mp4', '.webm').replace('.hd.mp4', '.webm').replace('.phone.mp4', '.webm');
    }
    
    return url;
}

function html5VideoDetectH264(){
    var v = document.createElement('video');
    if(v.canPlayType && v.canPlayType('video/mp4').replace(/no/, '')) {
       return true;
    }

    return false;
}//function










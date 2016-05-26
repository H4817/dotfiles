/*From /pages/options/js/common.js*/
function PGS_addOptionsListener(){
    
    chrome.extension.onMessage.addListener(function(message) {
        if(typeof (message) != "undefined") {
            if(message.command == "themeSendBackgroundVideoToPage") // download video theme complete
                displayLoadedBackgroundVideoTheme(message);
            else if(message.command == "changeStaticBackgroundToOptionsPage") // change static content
                changeStaticBackgroundToOptionsPage(message);
            else if(message.command == "changeLiveBackgroundToOptionsPage") // change video content resolution
                changeLiveBackgroundToOptionsPage(message);
            else if(message.command == "changeFlixerBackgroundToOptionsPage") // change flixer video content
                changeFlixerBackgroundToOptionsPage(message);
            else if(message.command == "changeBackgroundImageFileProgressToPage") // change video content progress
                changeBackgroundImageFileProgress(message);
            else if(message.command == "changeBackgroundFlixerVideoFileProgressToPage") // change flixer video content progress
                changeBackgroundFlixerVideoFileProgressToPage(message);
            else if(message.command == "videoThemeSendDownloadProgressToPage" || message.command == "changeBackgroundVideoFileProgressToPage") // change video theme progress
                changeBackgroundVideoFileProgress(message);
            else if(message.command == "changeBackgroundImageFileErrorToPage") // change video content error
                changeBackgroundImageFileError(message);
            else if(message.command == "changeBackgroundFlixerVideoFileErrorToPage") // change flixer video content error
                changeBackgroundFlixerVideoFileErrorToPage(message);
            else if(message.command == "videoThemeSendDownloadErrorToPage" || message.command == "changeBackgroundVideoFileErrorToPage") // download video theme error
                changeBackgroundVideoFileError(message);
            else if(message.command == "availableContentDownloadError")
                getAvailableContentError(message);
            else if(message.command == "loadMoreLixerContentEnd")
                displayLoadedFlixerContent(message);
            else if(message.command == "removeOptionsContentFavoriteMark")
                removeContentFavoriteMark(message);
        }
    }); 
}//PGS_addOptionsListener

/*From /pages/newtab/js/page.js*/
function PGS_addNewtabListener(){
    chrome.extension.onMessage.addListener(function(message) {
        if(typeof (message) != "undefined") {
            if(message.command == "tileThumbLoadComplete") // speed dial each tile load complete
                displayLoadedTileThumbImage(message);
            else if(message.command == "tilesThumbsLoadEnd") // speed dial all tiles load end
                displayNotLoadedTilesThumbImages();
            else if(message.command == "themeSendBackgroundToPage") // download image theme complete
                displayLoadedBackgroundImageTheme(message);
            else if(message.command == "sendVideoThemeOfferToPage") { // download video theme offer
                checkPageDisplayVideoThemeOffer(message);
            } else if(message.command == "themeSendBackgroundVideoToPage") // download video theme complete
                displayLoadedBackgroundVideoTheme(message);
            else if(message.command == "videoThemeSendDownloadProgressToPage") // download video theme progress
                displayLoadingVideoThemeProgress(message);
            else if(message.command == "videoThemeSendDownloadErrorToPage") // download video theme error
                displayLoadingVideoThemeError(message);
            else if(message.command == "imageThemeSendDownloadProgressToPage") // download image theme progress
                displayLoadingImageThemeProgress(message);
            else if(message.command == "imageThemeSendDownloadErrorToPage") // download image theme error
                displayLoadingImageThemeError(message);
            else if(message.command == "hideThemeVideoDownloadOffer") // hide download video theme offer when theme change
                hideThemeVideoDownloadOffer(message);
            else if(message.command == "errorLoadGalleryThumb" || message.command == "errorLoadLiveThumb") // error show on load gallery or auto preview thumb problem
                errorLoadGalleryThumb(message);
            else if(message.command == "pageBgVideoControl")
                pageBgVideoControl(message.tabs);
        }
    });
}//PGS_addNewtabListener

/*From /pages/newtab/js/page.js*/
function PGS_getNewTabCurentTab(callback) {
    chrome.tabs.getCurrent(function(tab) {
        newtabPageTabId = tab.id;
        callback();
    });
}//PGS_getNewTabCurentTab

/*From /pages/options/js/settings.js*/
function PGS_getSettingsCurentTab(callback) {
    chrome.tabs.getCurrent(function(tab) {
        settingsTabId = tab.id;
        callback();
    });
}//PGS_getSettingsCurentTab

$(function(){
    chrome.tabs.onActivated.addListener(function(){
        var video = document.getElementById("background");
        
        if(video){
            BRW_getNetTabPages(function(data){
                //console.log(data);
                
                chrome.tabs.getCurrent(function(currentTab){
                    for(let key in data.tabs) if(data.tabs[key].id == currentTab.id){
                        if(data.tabs[key].active){
                            console.log('BG VIDEO: Play');
                            video.play();
                        }else{
                            console.log('BG VIDEO: Pause');
                            video.pause();
                        }//else
                    }//for
                });      
            });
        }//if
    });
});





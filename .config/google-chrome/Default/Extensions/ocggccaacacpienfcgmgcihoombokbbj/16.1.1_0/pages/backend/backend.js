
/**
 * Chrome application backend
 * run once when application start
 */
(function() {    
    /*Moved to browser choiser*/
    BRW_browserbrowserActionOnClicked();

    /**
     * Chrome tab update
     */
    /*chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
        if (changedProps.status != "complete") return;
        chrome.tabs.get(tabId, function(tab) {
            var pattern = new RegExp("(http://|https://)");
            if(typeof(tab) != "undefined" && typeof(tab.url) != "undefined" && pattern.test(tab.url)) {
                analyzeHistory(takePageScreen, getAnalyzeHistoryLength(), {"activeTab" : tab});
            }
        });
    });*/
    
    
    /**
     * Message listener from content scripts
     */
    
    /*Moved to browser choiser*/
    BRW_onMessageAddListener();
})();

    /**
     * Take visit page screen
     * take site page image if site
     * in top of user visits
     *
     * @param mostVisitedURLs Array
     * @param data Object
     */
    function takePageScreen(mostVisitedURLs, data) {
        
        if(typeof(data.activeTab) != "undefined") {
            var tab = data.activeTab;
            var historyLength = mostVisitedURLs.length;
            var maxAnalyzeTilesCount = getAnalyzeLastTilesCount();
            var analyzedLastTiles = 0;
            var isTopTileUrl = false;
            if(historyLength >= getDisplayTilesLength()) {
                for (var i = 0; i < historyLength; i++) {
                    if(analyzedLastTiles > maxAnalyzeTilesCount) break;
                    if(typeof(mostVisitedURLs[i]) != "undefined") {
                        var mv = mostVisitedURLs[i];
                        if(checkTileFormat(mv)) {
                            if(mv.url == tab.url) {
                                isTopTileUrl = true;
                                break;
                            }
                            analyzedLastTiles++;
                        }
                    }
                }
            } else
                isTopTileUrl = true;

            if(isTopTileUrl) {
                var currentUrl = data.activeTab.url;
                setTimeout(function() {
                    chrome.tabs.get(tab.id, function(tabInfo) {
                        if(tabInfo.url == currentUrl &&  tabInfo.active) {
                            chrome.tabs.captureVisibleTab(function (screenShotUrl) {
                                getDb().transaction(function (tx) {
                                    tx.executeSql('DELETE FROM IMAGES WHERE url = ?', [tabInfo.url]);
                                    tx.executeSql('INSERT INTO IMAGES (id, url, image) VALUES (?,?,?)', [new Date().getTime(), tabInfo.url, screenShotUrl]);
                                });
                            });
                        }
                    });
                }, 1000);
            }
        }
    }



    /**
     * Update dial thumb by type
     *
     * @param tiles Array
     */
    function updateDialThumbByType(tiles) {
        
        if(tiles.length == 1) {
            var tile = tiles[0];
            var dialId = tile.dialId;
            if(dialId) {
                BRW_dbTransaction(function (tx) {
                    BRW_dbSelect(
                        {//Param
                            tx : tx,
                            from    :  'DIALS',
                            where   : {
                                'id'   : dialId
                            }
                        },
                        function(results){//Success
                            var imagesResults = results.rows;
                            var imagesResultsLength = imagesResults.length;
                            
                            if(imagesResultsLength) {
                                for (var i = 0; i < imagesResultsLength; i++) {
                                    var dial = imagesResults[i];
                                    if(dial.thumb_type == showDialTextThumb) {
                                        tile.thumbType = showDialTextThumb;
                                        getTextSitesThumbs([tile]);
                                    } else if(dial.thumb_type == showDialGalleryThumb) {
                                        tile.thumbType = showDialGalleryThumb;
                                        getEverhelperSitesThumbs([tile]);
                                    } else if(dial.thumb_type == showDialScreenThumb) {
                                        tile.thumbType = showDialScreenThumb;
                                        getEverhelperOrLiveSitesThumbs([tile]);
                                    } else {
                                        updateDialThumbByDefaultType(tiles);
                                    }
                                }
                            } else {
                                updateDialThumbByDefaultType(tiles);
                            }
                        }       
                    );
                    
                    
                    /*
                    tx.executeSql('SELECT * FROM DIALS WHERE id = ?', [dialId], function (tx, results) {
                        var imagesResults = results.rows;
                        var imagesResultsLength = imagesResults.length;
                        if(imagesResultsLength) {
                            for (var i = 0; i < imagesResultsLength; i++) {
                                var dial = imagesResults[i];
                                if(dial.thumb_type == showDialTextThumb) {
                                    tile.thumbType = showDialTextThumb;
                                    getTextSitesThumbs([tile]);
                                } else if(dial.thumb_type == showDialGalleryThumb) {
                                    tile.thumbType = showDialGalleryThumb;
                                    getEverhelperSitesThumbs([tile]);
                                } else if(dial.thumb_type == showDialScreenThumb) {
                                    tile.thumbType = showDialScreenThumb;
                                    getEverhelperOrLiveSitesThumbs([tile]);
                                } else {
                                    updateDialThumbByDefaultType(tiles);
                                }
                            }
                        } else {
                            updateDialThumbByDefaultType(tiles);
                        }
                    }, null);
                    */
                });
            } else {
                updateDialThumbByDefaultType(tiles);
            }
        } else {
            updateDialThumbByDefaultType(tiles);
        }
    }

    /**
     * Update dial thumb by default type
     *
     * @param tiles Array
     */
    function updateDialThumbByDefaultType(tiles) {
        
        getNewSpeedDialThumbType(function(newDialThumbType) {
            if(newDialThumbType == speedDialThumbTypeText) {
                getTextSitesThumbs(tiles);
            } else if(newDialThumbType == speedDialThumbTypeAutopreviewText) {
                getLiveSitesThumbs(tiles);
            } else if(newDialThumbType == speedDialThumbTypeGalleryText) {
                getEverhelperSitesThumbs(tiles);
            } else if(newDialThumbType == speedDialThumbTypeGaleryAutoprevText) {
                getEverhelperOrLiveSitesThumbs(tiles);
            }
        });
    }

    /**
     * Send updated available themes list
     *
     * @param data String
     */
    function sendUpdatedAvailableThemes(data) {
        currentThemeId(getInstalledThemesData, {sendResponse : data.sendResponse, getCurrentThumb: false, getCurrentTheme: true});
    }

    /**
     * Send updated Flixel themes list
     *
     * @param data String
     */
    function sendUpdatedFlixelThemes(data) {
        
        data.sendResponse({});
    }

    /**
     * Get background new page params
     *
     * @param sendResponse Function
     * @returns Object
     */
    function getBackgroundNewPageParams(sendResponse) {
        
        var result = {
            "currentAppInstalled" : getAppInstalledDate(),
            "currentDownloadImage" : getDownloadImageThemeStatus(),
            "currentDownloadVideo" : getDownloadVideoThemeStatus(),
            "displayTilesCount" : getDisplayTilesCount(),
            "displayVideoTheme" : getDisplayVideoTheme(),
            "displayParallaxVideoTheme" : getDisplayParallaxVideoTheme(),
            "displaySpeedDialPanel" : getDisplaySpeedDialPanel(),
            "visibleTodoPanel" : getVisibleTodoPanel(),
            "displayTodoDialPanel" : getDisplayTodoDialPanel(),
            "displayTodoCoordinates" : getDisplayTodoCoordinates(),
            "displayTodoSize" : getDisplayTodoSize()
        };
        sendResponse(result);
    }

    /**
     * Load background file video
     *
     * @param fs FileSystem
     * @param sendResponse
     * @param defaultResponse Object
     */
    /*Moved to browser choiser*/
    function loadBackgroundVideoFile(fs, sendResponse, defaultResponse) {
         BRW_loadBackgroundVideoFile(fs, sendResponse, defaultResponse);
    }

    /**
     * Load background file image
     *
     * @param fs FileSystem
     * @param sendResponse
     * @param defaultResponse Object
     */
    function loadBackgroundImageFile(fs, sendResponse, defaultResponse) {
        defaultResponse = defaultResponse || {
                "image" : "",
                "parallaxValue" : getBackgroundParallaxValue(),
                "visibleDials" : getVisibleSpeedDialPanel(),
                "displayDials" : getDisplaySpeedDialPanel(),

                "visibleTodoPanel" : getVisibleTodoPanel(),
                "displayTodoDialPanel" : getDisplayTodoDialPanel(),
                "displayTodoCoordinates" : getDisplayTodoCoordinates(),
                "displayTodoSize" : getDisplayTodoSize()
            };
        defaultResponse.enableParallax = getDisplayParallaxVideoTheme();

        var filePath = getBackgroundImageFile();
        if(filePath) {
            BRW_fsGetFile(fs, filePath, 
                function(fileURL){//Success, file found
                    defaultResponse.image = fileURL;
                    sendResponse(defaultResponse);
                },
                function(fileURL){//File NOT found
                    var filePath = getStorageBackgroundImageFile();
                    var resolution = getBackgroundImageFileResolution();
                    var themeId = getThemeIdByFilePath(filePath);
                    if(themeId && resolution) {
                        getFileSystem(changeBackgroundImageFile, {sendResponse: sendResponse, themeId: themeId});
                    } else
                        sendResponse(defaultResponse);
                }         
            );
        } else
            sendResponse(defaultResponse);
    }

    /**
     * Load random background file
     *
     * @param fs FileSystem
     * @param sendResponse Function
     * @param defaultResponse Object
     */
    function loadRandomBackgroundFile(fs, sendResponse, defaultResponse) {
        var currentVideo = getBackgroundVideoFile();
        var currentImage = getBackgroundImageFile();
        var installedThemes = getInstalledThemes();
        var favoriteThemes = getFavoriteThemesObject();
        var favoriteInstalledThemes = [];
        var activeTheme;
        var displayCurrentBackgroundFile = getDisplayCurrentBackgroundFile();
        
        if(getRandomThemesDisplay() == 2){//show all downloaded themes
            favoriteThemes = installedThemes;
        }//if
        
        if(getArrayLength(installedThemes) && getArrayLength(favoriteThemes)) {
            for(var i in installedThemes) {
                var installedTheme = installedThemes[i];
                var isActiveVideoTheme = currentVideo && currentVideo.indexOf(installedTheme['id']) >= 0;
                var isActiveImageTheme = currentImage && currentImage.indexOf(installedTheme['id']) >= 0;
                if(typeof (favoriteThemes[installedTheme['id']]) != "undefined" || isActiveVideoTheme || isActiveImageTheme) {
                    favoriteInstalledThemes.push(installedTheme);
                    if(isActiveVideoTheme || isActiveImageTheme)
                        activeTheme = installedTheme;
                }
            }
        }

        var favoriteInstalledTheme;
        var favoriteInstalledThemeLength = getArrayLength(favoriteInstalledThemes);

        if(favoriteInstalledThemeLength) {
            if(displayCurrentBackgroundFile && activeTheme) {
                favoriteInstalledTheme = activeTheme;
            } else {
                var index = Math.floor(Math.random()*favoriteInstalledThemes.length);
                favoriteInstalledTheme = favoriteInstalledThemes[index];
            }

            if(favoriteInstalledThemeLength > 1) { // skip random repeats
                var lastRandomThemesId = getLastRandomThemesId();
                if(lastRandomThemesId && lastRandomThemesId == favoriteInstalledTheme['id']) {
                    index++;
                    if(index >= favoriteInstalledThemeLength)
                        index = 0;
                    favoriteInstalledTheme = favoriteInstalledThemes[index];
                }
            }
        }

        if(displayCurrentBackgroundFile)
            clearDisplayCurrentBackgroundFile();

        var contentResolution, filePath;
        var isVideoContent = false;
        var isFlixelVideoContent = false;
        var flixelVideoContentAuthor = "";

        if(favoriteInstalledTheme) {
            var bgVideoPath = favoriteInstalledTheme['bgVideoPath'];
            var bgImagePath = favoriteInstalledTheme['bgFilePath'];

            if(getArrayLength(bgVideoPath) && getArrayLength(bgImagePath)) {
                isVideoContent = Math.round(Math.random());
                if(isVideoContent) {
                    isVideoContent = true;
                    if(favoriteInstalledTheme['lastInstallBgVideo'])
                        contentResolution = favoriteInstalledTheme['lastInstallBgVideo']['resolution'];
                    else
                        contentResolution = getArrayFirstKey(favoriteInstalledTheme['bgVideoPath']);

                    if(contentResolution)
                        filePath = getBackgroundFile(favoriteInstalledTheme['id'], favoriteInstalledTheme['bgVideoPath'][contentResolution]);
                    if(favoriteInstalledTheme['author'])
                        flixelVideoContentAuthor = favoriteInstalledTheme['author'];
                    if(favoriteInstalledTheme['isFlixelContent'])
                        isFlixelVideoContent = favoriteInstalledTheme['isFlixelContent'];
                } else {
                    isVideoContent = false;
                    contentResolution = getArrayFirstKey(favoriteInstalledTheme['bgFilePath']);
                    if(contentResolution)
                        filePath = getBackgroundFile(favoriteInstalledTheme['id'], favoriteInstalledTheme['bgFilePath'][contentResolution]);
                }
            } else if(getArrayLength(bgVideoPath)) {
                isVideoContent = true;
                if(favoriteInstalledTheme['lastInstallBgVideo'])
                    contentResolution = favoriteInstalledTheme['lastInstallBgVideo']['resolution'];
                else
                    contentResolution = getArrayFirstKey(favoriteInstalledTheme['bgVideoPath']);

                if(contentResolution)
                    filePath = getBackgroundFile(favoriteInstalledTheme['id'], favoriteInstalledTheme['bgVideoPath'][contentResolution]);
                if(favoriteInstalledTheme['author'])
                    flixelVideoContentAuthor = favoriteInstalledTheme['author'];
                if(favoriteInstalledTheme['isFlixelContent'])
                    isFlixelVideoContent = favoriteInstalledTheme['isFlixelContent'];
            } else if(getArrayLength(bgImagePath)) {
                isVideoContent = false;
                contentResolution = getArrayFirstKey(favoriteInstalledTheme['bgFilePath']);
                if(contentResolution)
                    filePath = getBackgroundFile(favoriteInstalledTheme['id'], favoriteInstalledTheme['bgFilePath'][contentResolution]);
            }
        }

        if(favoriteInstalledTheme && contentResolution && filePath) {
            setLastRandomThemesId(favoriteInstalledTheme['id']);
            defaultResponse = defaultResponse || {
                    "video" : "",
                    "image" : "",
                    "parallaxValue" : getBackgroundParallaxValue(),
                    "visibleDials" : getVisibleSpeedDialPanel(),
                    "displayDials" : getDisplaySpeedDialPanel(),

                    "isFlixelVideoContent" : isFlixelVideoContent,
                    "flixelVideoContentAuthor" : flixelVideoContentAuthor,

                    "visibleTodoPanel" : getVisibleTodoPanel(),
                    "displayTodoDialPanel" : getDisplayTodoDialPanel(),
                    "displayTodoCoordinates" : getDisplayTodoCoordinates(),
                    "displayTodoSize" : getDisplayTodoSize()
                };
            defaultResponse.enableParallax = getDisplayParallaxVideoTheme();

            if(filePath) {
                BRW_fsGetFile(fs, filePath, 
                    function(fileURL){//Success, file found
                        if(isVideoContent)
                            defaultResponse.video = fileURL;
                        else
                            defaultResponse.image = fileURL;
                        sendResponse(defaultResponse);
                    },
                    function(fileURL){//File NOT found
                        sendResponse(defaultResponse);
                    }         
                );
            } else
                sendResponse(defaultResponse);
        } else {
            if(getBackgroundVideoFile() && getDisplayVideoTheme())
                getFileSystem(loadBackgroundVideoFile, sendResponse);
            else
                getFileSystem(loadBackgroundImageFile, sendResponse);
        }
    }


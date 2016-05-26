/**
 * Application options page
 */

    var optionsTabId;

    $(function() {
        BRW_langLoaded(function(){
            displayActiveOptionsTab(0);

            BRW_options_page_prepare();

            getOptionsCurentTab(function() {
                displayTabContentLoader();
                updateAvailableThemesListOnPageLoad();
                
                addThemesSortButtonHandler();
                addDisableImageButtonHandler();
                addDisableVideoButtonHandler();
                addUpdateAvailableThemesHandler();
                addInstallContentButtonHandler();
                addSettingsContentButtonHandler();
                addInstallResolutionLiveBackgroundHandler();
                addRestoreDefaultThemeHandler();
                addSettingsBackgroundTabsButtonHandler();
                addSettingsBackgroundViewButtonHandler();
                addLoadMoreFlixelContentButtonHandler();
                addToggleFavoriteStateButtonHandler();
                addToggleShowThemesRandomStateButtonHandler();
                addRemoveInstalledTheme();

                displaySettingsBackgroundTabs();

                displaySettingsWelcomePage();
                displayWelcomeSettingsPageAlwaysHideStatus();

                displaySettingsFlixelVideoBtn();

                addTooltipsHideFix();
                
                setVisibleElementsBySortType(localStorage.getItem('themes-sort-type') || 2);
            });
        });
    });

    /**
     * Get options current tab
     */

    function getOptionsCurentTab(callback) {
        BRW_TabsGetCurrentID(function(tabID){
            optionsTabId = tabID;
            callback();            
        });
    }

    /**
     * Get available themes
     *
     * @param response Object
     * @param callback Function
     */
    function getAvailableThemes(response, callback) {
        var themesList = {};
        var installedTheme = null;
        var installedThemes = response.installedThemes, i, j;
        var currentContent = {
            "currentImage" : response.currentImage,
            "currentImageResolution" : response.currentImageResolution,
            "currentVideo" : response.currentVideo,
            "currentVideoResolution" : response.currentVideoResolution,
            "currentTheme" : response.currentThemeId,
            "videoContentAvailableResolutions" : response.videoContentAvailableResolutions,
            "flixelContentAvailableResolutions" : response.flixelContentAvailableResolutions
        };

        var availableThemesData = localStorage.getItem("available-themes-data");
        var favoriteThemes = getFavoriteThemesObject();
        if(availableThemesData) {
            themesList["live_backgrounds"] = [];
            themesList["static_backgrounds"] = [];
            themesList["live_themes"] = [];
            
            var availableThemes = JSON.parse(availableThemesData);
            
            for(i in availableThemes) {
                var availableTheme = availableThemes[i];

                availableTheme['installed'] = false;
                availableTheme['hasDownloadedImage'] = false;
                availableTheme['hasDownloadedVideo'] = false;
                for(j in installedThemes) {
                    installedTheme = installedThemes[j];
                    if(availableTheme['id'] == installedTheme['id']) {
                        availableTheme['installed'] = true;
                        availableTheme['hasDownloadedImage'] = (installedTheme.bgFilePath && getArrayLength(installedTheme.bgFilePath)) ? true : false;
                        availableTheme['hasDownloadedVideo'] = (installedTheme.bgVideoPath && getArrayLength(installedTheme.bgVideoPath)) ? true : false;
                        break;
                    }
                }
                availableTheme['favorite'] = checkThemeIsFavorite(availableTheme, favoriteThemes);

                if(availableTheme['contentType'] == liveThemesType && typeof (availableTheme['bgVideoPath']) != "undefined" && typeof (availableTheme['bgFilePath']) != "undefined")
                    themesList["live_themes"].push(availableTheme);

                if((availableTheme['contentType'] == liveBackgroundType || availableTheme['contentType'] == liveThemesType) && typeof (availableTheme['bgVideoPath']) != "undefined")
                    themesList["live_backgrounds"].push(availableTheme);

                if((availableTheme['contentType'] == staticBackgroundType || availableTheme['contentType'] == liveThemesType) && typeof (availableTheme['bgFilePath']) != "undefined")
                    themesList["static_backgrounds"].push(availableTheme);

            }

            var $liveThemes = $("#available-live-themes").html('').attr("data-container-content-type", liveThemesType);
            var $liveBackgrounds = $("#available-video-themes").html('').attr("data-container-content-type", liveBackgroundType);
            var $staticBackgrounds = $("#available-image-themes").html('').attr("data-container-content-type", staticBackgroundType);

            addDefaultThemeToList($liveThemes);
            themesList["live_themes"] = sortByActiveContent(themesList["live_themes"], liveThemesType, currentContent);
            for(i in themesList["live_themes"])
                addAvailableContentToList($liveThemes, themesList["live_themes"][i], liveThemesType, currentContent);

            addClearContentItemToList($liveBackgrounds, liveBackgroundType);
            themesList["live_backgrounds"] = sortByActiveContent(themesList["live_backgrounds"], liveBackgroundType, currentContent);
            for(i in themesList["live_backgrounds"])
                addAvailableContentToList($liveBackgrounds, themesList["live_backgrounds"][i], liveBackgroundType, currentContent);

            addClearContentItemToList($staticBackgrounds, staticBackgroundType);
            themesList["static_backgrounds"] = sortByActiveContent(themesList["static_backgrounds"], staticBackgroundType, currentContent);
            for(i in themesList["static_backgrounds"])
                addAvailableContentToList($staticBackgrounds, themesList["static_backgrounds"][i], staticBackgroundType, currentContent);
        }

        var flixelThemesData = localStorage.getItem("flixel-themes-display-data");
        if(flixelThemesData) {
            themesList["flixel_backgrounds"] = [];
            var flixelThemes = JSON.parse(flixelThemesData);
                flixelThemes = flixelThemes.results;
            
            //console.log(flixelThemes);
            
            for(i in flixelThemes) {
                var flixelTheme = flixelThemes[i];

                flixelTheme['installed'] = false;
                flixelTheme['hasDownloadedImage'] = false;
                flixelTheme['hasDownloadedVideo'] = false;
                flixelTheme['handmade'] = flixelTheme.handmade ? true : false;
                for(j in installedThemes) {
                    installedTheme = installedThemes[j];
                    if(flixelTheme['id'] == installedTheme['id']) {
                        flixelTheme['installed'] = true;
                        flixelTheme['hasDownloadedVideo'] = (installedTheme.bgVideoPath && getArrayLength(installedTheme.bgVideoPath)) ? true : false;
                        break;
                    }
                }
                flixelTheme['favorite'] = checkThemeIsFavorite(flixelTheme, favoriteThemes);

                if(flixelTheme['contentType'] == flixelBackgroundType && typeof (flixelTheme['bgVideoPath']) != "undefined")
                    themesList["flixel_backgrounds"].push(flixelTheme);
            }

            var $flixelBackgrounds = $("#available-flixel-backgrounds").html('').attr("data-container-content-type", flixelBackgroundType);

            addClearContentItemToList($flixelBackgrounds, flixelBackgroundType);
            
            themesList["flixel_backgrounds"] = sortByActiveContent(themesList["flixel_backgrounds"], flixelBackgroundType, currentContent);
            
            for(i in themesList["flixel_backgrounds"])
                addAvailableContentToList($flixelBackgrounds, themesList["flixel_backgrounds"][i], flixelBackgroundType, currentContent);
        }

        if(availableThemesData || flixelThemesData) {
            $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
            if(callback)
                callback(response);
        }
    }

    /**
     * Sort by active content
     *
     * @param themes Array
     * @param contentType String
     * @param currentContent Object
     */
    function sortByActiveContent(themes, contentType, currentContent) {
        
        sortByDownloadedContent(themes, contentType);
        var totalThemes = themes.length;
        for(var i = 0; i < totalThemes; i++) {
            var theme = themes[i];
            var isActiveContent = false;
            if(contentType == liveBackgroundType || contentType == flixelBackgroundType)
                isActiveContent = currentContent.currentVideo && currentContent.currentVideo.indexOf(theme.id) >= 0;
            else if(contentType == staticBackgroundType)
                isActiveContent = currentContent.currentImage && currentContent.currentImage.indexOf(theme.id) >= 0;
            else if(contentType == liveThemesType)
                isActiveContent = theme.id == currentContent.currentTheme;
            if(isActiveContent)
                moveArrayElements(themes, i, 0);
        }
        
        return themes;
    }

    /**
     * Sort by downloaded content
     *
     * @param themes Array
     * @param contentType String
     */
    function sortByDownloadedContent(themes, contentType) {
        var totalThemes = themes.length;
        for(var i = 0; i < totalThemes; i++) {
            var theme = themes[i];
            var isDownloadedContent = false;
            if(contentType == liveBackgroundType || contentType == flixelBackgroundType)
                isDownloadedContent = theme.hasDownloadedVideo;
            else if(contentType == staticBackgroundType)
                isDownloadedContent = theme.hasDownloadedImage;
            else if(contentType == liveThemesType)
                isDownloadedContent = false;
            if(isDownloadedContent)
                moveArrayElements(themes, i, 0);
        }
        return themes;
    }

    /**
     * Add clear content item to list
     *
     * @param $container jQuery
     * @param contentType Int
     */
    function addClearContentItemToList($container, contentType) {
        var $contentContainer = $("<div></div>");
        $contentContainer.addClass("av-content-container");

        var $contentTitle = $("<div></div>");
        $contentTitle.addClass("av-content-title");
        $contentTitle.text(translate("options_tabs_item_disable"));

        var $contentImgContainer = $("<div></div>");
        $contentImgContainer.addClass("av-content-img-container");
        $contentImgContainer.attr("src", extensionGetUrl("/pages/options/img/chrome-disable-content.png"));

        var $contentImg = $("<img>");
        $contentImg.addClass("av-content-img av-restore-default-theme-img");
        $contentImg.attr("src", extensionGetUrl("/pages/options/img/chrome-disable-content.png"));

        var $contentFooter = $("<div></div>");
        $contentFooter.addClass("av-content-footer");
        //$contentFooter.attr("data-toggle", "tooltip");
        //$contentFooter.attr("data-placement", "bottom");
        /*
        var contentFooterTitle = "";
        if(contentType == liveBackgroundType)
            contentFooterTitle = translate("options_tabs_item_buttons_disable_title_live_bg");
        else if(contentType == staticBackgroundType)
            contentFooterTitle = translate("options_tabs_item_buttons_disable_title_static_bg");
        else if(contentType == flixelBackgroundType)
            contentFooterTitle = translate("options_tabs_item_buttons_disable_title_flixel_bg");
        //$contentFooter.attr("title", contentFooterTitle);
        */
        
        var $installButton = $("<a></a>");
        var installButtonText = translate("options_tabs_item_buttons_disable");

        var contentButtonId = "";
        if(contentType == liveBackgroundType)
            contentButtonId = "disable-current-video";
        else if(contentType == staticBackgroundType)
            contentButtonId = "disable-current-image";
        else if(contentType == flixelBackgroundType)
            contentButtonId = "disable-current-flixel";

        $installButton.attr("id", contentButtonId);
        $installButton.addClass("btn").addClass("btn-warning").addClass("av-content-restore");
        $installButton.attr("data-content-type", contentType);

        $installButton.text(installButtonText);
        $contentImgContainer.append($contentImg);
        $contentFooter.append($installButton);
        $contentContainer.append($contentTitle).append($contentImgContainer).append($contentFooter);

        $container.append($contentContainer);
    }

    function addDefaultThemeToList($container) {
        var $contentContainer = $("<div></div>");
        $contentContainer.addClass("av-content-container");

        var $contentTitle = $("<div></div>");
        $contentTitle.addClass("av-content-title");
        $contentTitle.text(translate("options_tabs_item_restore"));

        var $contentImgContainer = $("<div></div>");
        $contentImgContainer.addClass("av-content-img-container");

        var $contentImg = $("<img>");
        $contentImg.addClass("av-content-img av-restore-default-theme-img");
        
        //alert(extensionGetUrl("/pages/options/img/chrome-default-theme.png"));
        $contentImg.attr("src", extensionGetUrl("/pages/options/img/chrome-default-theme.png"));

        var $contentFooter = $("<div></div>");
        $contentFooter.addClass("av-content-footer");
        //$contentFooter.attr("data-toggle", "tooltip");
        //$contentFooter.attr("data-placement", "bottom");
        //$contentFooter.attr("title", translate("options_tabs_item_buttons_restore_title"));

        var $installButton = $("<a></a>");
        var installButtonText = translate("options_tabs_item_buttons_restore");

        $installButton.attr("id", "restore-default-theme");
        $installButton.addClass("btn").addClass("btn-warning").addClass("av-content-restore");
        $installButton.attr("data-content-type", liveThemesType);
        $installButton.attr("data-toggle", "modal");
        $installButton.attr("data-target", "#restore-default-theme-dialog");

        var restoreThemeFileName = "restore-theme-description_";
        var restoreThemeFileExt = ".jpg";
        var restoreThemeShowUrlEn = restoreThemeFileName + "en" + restoreThemeFileExt;
        var restoreThemeShowUrlRu = restoreThemeFileName + "ru" + restoreThemeFileExt;
        var restoreThemeShowLangUrl = translate("page_header_bookmarks_help_img");

        var $restoreThemeModalBody = $("#restore-default-theme-dialog-body");
        var restoreThemeImageUrl = restoreThemeShowUrl;
        if(!restoreThemeShowLangUrl)
            restoreThemeImageUrl += hasRuLanguage ? restoreThemeShowUrlRu : restoreThemeShowUrlEn;
        else
            restoreThemeImageUrl += restoreThemeFileName + restoreThemeShowLangUrl + restoreThemeFileExt;

        var $restoreThemeImage;

        $('#restore-default-theme-dialog').on('show.bs.modal', function (e) {
            if(!$restoreThemeImage) {
                $restoreThemeImage = $("<img>").attr("src", restoreThemeImageUrl).addClass("restore-default-theme-description");
                $restoreThemeImage.attr("id", "restore-default-theme-description");
                $restoreThemeImage.on("load", function() {
                    $("#options-restore-theme-popup-body-load").hide();
                });
                $restoreThemeModalBody.append($restoreThemeImage);
            }
        });

        $installButton.text(installButtonText);
        $contentImgContainer.append($contentImg);
        $contentFooter.append($installButton);
        $contentContainer.append($contentTitle).append($contentImgContainer).append($contentFooter);

        $container.append($contentContainer);
    }

    /**
     * Toggle content favorite state
     */
    function addToggleFavoriteStateButtonHandler() {
        $(document).on("click", ".av-content-favorite-img", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $el = $(this);
            var $contentBlock = $el.closest(".available-themes-block");
            var $itemContainer = $el.closest(".av-content-container");
            var $contentInstall = $itemContainer.find(".av-content-install");
            var $contentImgContainer = $itemContainer.find(".av-content-img-container");
            var contentType = $contentBlock.attr("data-container-content-type");
            var contentId = $contentInstall.attr("data-content-theme");
            if(contentType && contentId) {
                if($el.hasClass("av-content-favorite-img-active")) {
                    var $modalConfirmButton = $("#delete-from-favorite-dialog-confirm");
                    if($modalConfirmButton) {
                        $modalConfirmButton.attr("data-container-content-type", contentType);
                        $modalConfirmButton.attr("data-content-theme", contentId);
                        $modalConfirmButton.on("click", addConfirmRemoveFavoriteHandler);
                        $("#delete-from-favorite-dialog").modal();
                    }
                } else {
                    if(addThemeElementToFavorite(contentType, contentId)) {
                        $el.addClass("av-content-favorite-img-active");
                        $el.css({"display" : "block"});
                        $contentImgContainer.off("mouseenter", showFavoriteImageOnContentHover).off("mouseleave", hideFavoriteImageOnContentHover);
                        $el.attr('data-original-title', translate("options_tabs_item_buttons_favorite_remove")).tooltip('fixTitle').tooltip('show');
                        getFavoriteTabPages(reloadTabPages);
                    }
                }
            }
        });
    }

    /**
     * Remove installed theme
     */
    function addRemoveInstalledTheme() {
        $(document).on("click", ".av-content-img-delete", function(e) {
            e.preventDefault(); e.stopPropagation();
            var $el = $(this);
            
            var $modalConfirmButton = $("#delete-theme-dialog-confirm");
            if($modalConfirmButton) {
                $modalConfirmButton.on("click", function(){
                    var $contentBlock = $el.closest(".available-themes-block");
                    var $itemContainer = $el.closest(".av-content-container");
                    var $contentInstall = $itemContainer.find(".av-content-install");
                    var $contentImgContainer = $itemContainer.find(".av-content-img-container");
                    var contentType = $contentBlock.attr("data-container-content-type");
                    var contentId = $contentInstall.attr("data-content-theme");

                    if(/*contentType && */contentId) {
                        var themes = localStorage.getItem('installed-themes');
                        themes = JSON.parse(themes);

                        if(Object.keys(themes).length > 1){//Delete theme
                            if(themes[contentId]){
                                delete themes[contentId];
                                localStorage.setItem('installed-themes', JSON.stringify(themes));

                                BRW_fsRemoveFile('themes/'+contentId, contentId+'.hd.mp4');
                                BRW_fsRemoveFile('themes/'+contentId, contentId+'.tablet.mp4');
                                BRW_fsRemoveFile('thumbnails/'+contentId, contentId+'poster.png');
                                BRW_fsRemoveFile('thumbnails/'+contentId, contentId+'.thumbnail.jpg');

                                if(true){//reset block status
                                    $el.removeClass('active').removeClass('active-disabled');
                                    $installButton = $itemContainer.find(".av-content-install");

                                    if(contentType == flixelBackgroundType)
                                        var installButtonText = translate("options_tabs_item_buttons_install_flixer");
                                    else
                                        var installButtonText = translate("options_tabs_item_buttons_install");

                                    setInstallButtonClass($installButton, 'btn-danger');

                                    $installButton.text(installButtonText);

                                    $installButton.attr('data-content-installed', false);
                                }//if

                                //getSettingsTabPages(reloadTabPages); getFavoriteTabPages(reloadTabPages);
                            }//if
                        }else{
                            alert('Сan not remove a single loaded theme!');
                        }
                    }//if
                });
                $("#delete-theme-dialog").modal();
            }
        });
    }

    /**
     * Add toggle show themes random state button handler
     */
    function addToggleShowThemesRandomStateButtonHandler() {
        var $el = $(".random-themes-display-label");
            $el.attr("data-toggle", "tooltip");
            $el.attr("data-placement", "left");
            $("#random-themes-display-label-flixel").attr("data-placement", "right");
            $el.attr("title", translate("options_tabs_item_note_random_background_on_options_page"));
        if(getRandomThemesDisplay())
            $el.find("input[type=checkbox]").prop("checked", true);

        $el.on("click", function() {
            var $el = $(this).find("input[type=checkbox]");
            var val = $el.is(':checked');
            if(val) {
                $(".random-themes-display").each(function() {
                    var $item = $(this);
                    if(!$item.is(":checked"))
                        $item.prop("checked", true);
                });
            } else {
                $(".random-themes-display").each(function() {
                    var $item = $(this);
                    if($item.is(":checked"))
                        $item.prop("checked", false);
                });
            }

            BRW_sendMessage({command: "setRandomThemesDisplaySettings", val: val, tab: optionsTabId});
        });
    }

    /**
     * Add confirm remove favorite handler
     *
     * @param e Event
     */
    function addConfirmRemoveFavoriteHandler(e) {
        e.preventDefault();
        e.stopPropagation();

        var $el = $(this);
        var contentType = $el.attr("data-container-content-type");
        var contentId = $el.attr("data-content-theme");
        if(contentType && contentId) {
            var $contentBlock = $(".available-themes-block[data-container-content-type="+ contentType +"]");
            var $contentInstall = $contentBlock.find(".av-content-install[data-content-theme=" + contentId + "]");
            if($contentBlock && $contentInstall) {
                var $contentItem = $contentInstall.closest(".av-content-container");
                var $contentImgContainer = $contentItem.find(".av-content-img-container");
                if($contentItem) {
                    var $removeFavoriteBtn = $contentItem.find(".av-content-favorite-img-active");
                    if($removeFavoriteBtn) {
                        $el.off("click", addConfirmRemoveFavoriteHandler);
                        removeThemeElementFromFavorite(contentType, contentId);
                        $removeFavoriteBtn.removeClass("av-content-favorite-img-active");
                        $removeFavoriteBtn.hide();
                        $contentImgContainer.on("mouseenter", showFavoriteImageOnContentHover).on("mouseleave", hideFavoriteImageOnContentHover);
                        $removeFavoriteBtn.attr('data-original-title',  translate("options_tabs_item_buttons_favorite")).tooltip('fixTitle');
                        $("#delete-from-favorite-dialog").modal('hide');
                        getFavoriteTabPages(reloadTabPages);
                    }
                }
            }
        }
    }

    /**
     * Remove content favorite mark
     *
     * @param response Object
     */
    function removeContentFavoriteMark(response) {
        var contentType = response.contentType;
        var contentId = response.contentId;
        if(contentType && contentId) {
            var $itemsContainer = $(".available-themes-block[data-container-content-type=" + contentType + "]");
            var $items = $itemsContainer.find(".av-content-install[data-content-theme='" + contentId + "']");
            if($items.length) {
                $items.each(function () {
                    var $installButton = $(this);
                    var $itemContainer = $installButton.closest(".av-content-container");
                    var $contentImgContainer = $itemContainer.find(".av-content-img-container");
                    var $removeFavoriteBtn = $itemContainer.find(".av-content-favorite-img");
                    if($removeFavoriteBtn.hasClass("av-content-favorite-img-active")) {
                        $removeFavoriteBtn.removeClass("av-content-favorite-img-active");
                        $("#delete-from-favorite-dialog-confirm").off("click", addConfirmRemoveFavoriteHandler);
                        $removeFavoriteBtn.removeClass("av-content-favorite-img-active");
                        $removeFavoriteBtn.hide();
                        $contentImgContainer.on("mouseenter", showFavoriteImageOnContentHover).on("mouseleave", hideFavoriteImageOnContentHover);
                        $removeFavoriteBtn.attr('data-original-title',  translate("options_tabs_item_buttons_favorite")).tooltip('fixTitle');
                        $("#delete-from-favorite-dialog").modal('hide');
                    }
                });
                $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
            }
        }
    }

    /**
     * Show favorite image on content hover
     *
     * @param e Event
     */
    function showFavoriteImageOnContentHover(e) {
        $(this).find(".av-content-favorite-img").fadeIn(400);
    }

    /**
     * Hide favorite image on content hover
     *
     * @param e Event
     */
    function hideFavoriteImageOnContentHover(e) {
        $(this).find(".av-content-favorite-img").fadeOut(400);
    }

    /**
     * Add available content
     *
     * @param $container jQuery element
     * @param theme Object
     * @param contentType Int
     * @param currentContent Object
     */
    function addAvailableContentToList($container, theme, contentType, currentContent) {//console.log($container, theme, contentType, currentContent);
        var $contentContainer = $("<div></div>");
        $contentContainer.addClass("av-content-container");

        var $contentTitle = $("<div></div>");
        $contentTitle.addClass("av-content-title");

        var $contentImgContainer = $("<div></div>");
        $contentImgContainer.addClass("av-content-img-container");
        if(contentType == flixelBackgroundType)
            $contentImgContainer.addClass("av-content-img-container-dark");

        var $contentImg = $("<img>");
        var contentThumbImage = null;
        $contentImg.addClass("av-content-img");
        $contentImg.on('load', function() {
            var $contentLoader = $(this).parent().find(".av-content-img-loader");
            if($contentLoader)
                $contentLoader.remove();
        });
        if(contentType == flixelBackgroundType)
            $contentImg.addClass("av-content-img-width-auto");

        if(contentType == liveBackgroundType || contentType == staticBackgroundType || contentType == liveThemesType)
            contentThumbImage = getThemeContentThumbImage(theme.id);
        else if(contentType == flixelBackgroundType)
            contentThumbImage = theme.bgFileThumb;

        $contentImg.attr("src", contentThumbImage);

        var $contentFavorite = $("<div></div>");
        $contentFavorite.addClass("av-content-favorite-img");
        if(typeof(theme['favorite']) != "undefined" && theme['favorite']) {
            $contentFavorite.addClass("av-content-favorite-img-active");
            $contentFavorite.attr("title", translate("options_tabs_item_buttons_favorite_remove"));
            $contentFavorite.css({"display" : "block"});
            $contentImgContainer.off("mouseenter", showFavoriteImageOnContentHover).off("mouseleave", hideFavoriteImageOnContentHover);
        } else {
            $contentFavorite.attr("title", translate("options_tabs_item_buttons_favorite"));
            $contentImgContainer.on("mouseenter", showFavoriteImageOnContentHover).on("mouseleave", hideFavoriteImageOnContentHover);
        }
        $contentFavorite.attr("data-toggle", "tooltip");
        $contentFavorite.attr("data-placement", "right");
        $contentImgContainer.append($contentFavorite);
        
        var $removeItem = $("<img>");
        if(contentType == staticBackgroundType || contentType == liveBackgroundType || contentType == flixelBackgroundType) {
            $removeItem.addClass("av-content-img-delete");
            $removeItem.attr("src", extensionGetUrl("/pages/options/css/img/buttons/delete.png"));
            $removeItem.attr("title", translate("options_tabs_item_buttons_control_delete"));
            $removeItem.attr("data-toggle", "tooltip");
            $removeItem.attr("data-placement", "left");
            
            $contentContainer.append($removeItem);
        }


        var $settingsItem = $("<img>");
        if(contentType == staticBackgroundType || contentType == liveBackgroundType || contentType == flixelBackgroundType) {
            $settingsItem.addClass("av-content-img-settings");
            $settingsItem.attr("src", extensionGetUrl("/pages/options/css/img/buttons/settings.png"));
            $settingsItem.attr("title", translate("options_tabs_item_buttons_control_settings"));
            $settingsItem.attr("data-toggle", "tooltip");
            $settingsItem.attr("data-placement", "left");
            $contentContainer.append($settingsItem);
        }
        
        if(contentType == flixelBackgroundType) {
            var $contentLoaderImg = $("<img>");
            $contentLoaderImg.addClass("av-content-img-loader");
            $contentLoaderImg.attr("src", extensionGetUrl("/pages/options/css/img/buttons/popup/loading-small.gif"));
            $contentImgContainer.append($contentLoaderImg);
        }

        var $contentFooter = $("<div></div>");
        $contentFooter.addClass("av-content-footer");

        var $installButton = $("<a></a>");
        var installButtonText = "";
        $installButton.addClass("btn").addClass("av-content-install");

        var $viewItem = $("<a></a>");
        $viewItem.text(translate("options_tabs_item_buttons_view_live_bg"));
        $viewItem.addClass("btn").addClass("btn-warning").addClass("av-content-view");

        var isActiveContent = false;
        var isInstalledContent = false;

        var $contentResolutionsButtons,
            $downloadButton,
            downloadButtonResolution,
            $downloadButtonTextResolution,
            downloadButtonSize,
            $downloadButtonTextSize,
            themeTitleMaxResolution = "";

        
        if(contentType == liveBackgroundType) {
            isActiveContent = currentContent.currentVideo && currentContent.currentVideo.indexOf(theme.id) >= 0;
            isInstalledContent = theme.hasDownloadedVideo;
            $installButton.attr("data-content-type", liveBackgroundType);
            $installButton.attr("data-content-installed", isInstalledContent);
            $installButton.addClass("available-install-video");

            $contentResolutionsButtons = $("<div></div>");
            $contentResolutionsButtons.addClass("av-content-resolution-buttons");
            $contentResolutionsButtons.attr("data-theme", theme.id);
            for(w in currentContent.videoContentAvailableResolutions) {
                $downloadButton = $("<button></button>").addClass("current-theme-download");
                $downloadButton.addClass("btn");
                if(currentContent.currentVideo.indexOf(theme.id) != -1 && currentContent.currentVideoResolution && currentContent.currentVideoResolution == currentContent.videoContentAvailableResolutions[w]) {
                    $downloadButton.addClass("btn-success");
                    $downloadButton.attr("title", getVideoThemeResolutionButtonTitle(currentContent.videoContentAvailableResolutions[w], true));
                    $downloadButton.attr("is-active-resolution", true);
                } else {
                    $downloadButton.addClass("btn-primary");
                    $downloadButton.attr("title", getVideoThemeResolutionButtonTitle(currentContent.videoContentAvailableResolutions[w], false));
                    $downloadButton.attr("is-active-resolution", false);
                }
                $downloadButton.attr("data-toggle", "tooltip");
                $downloadButton.attr("data-content-type", liveBackgroundType);
                $downloadButton.attr("data-resolution", currentContent.videoContentAvailableResolutions[w]);
                $downloadButton.attr("data-theme", theme.id);
                downloadButtonResolution = getVideoThemeResolutionTitle(currentContent.videoContentAvailableResolutions[w]);
                $downloadButtonTextResolution = "<span class='download-resolution'>" + downloadButtonResolution + "</span>";
                downloadButtonSize = getVideoThemeResolutionSize(theme, currentContent.videoContentAvailableResolutions[w]);
                $downloadButtonTextSize = "<span class='download-size'>" + downloadButtonSize + "</span>";
                $downloadButton.html($downloadButtonTextResolution + $downloadButtonTextSize);
                $contentResolutionsButtons.append($downloadButton);
            }
            $contentContainer.append($contentResolutionsButtons);

            if(isInstalledContent) {
                if(isActiveContent) {
                    $contentResolutionsButtons.show();
                    if($viewItem && !$viewItem.hasClass("active"))
                        $viewItem.addClass("active");
                    if($settingsItem && !$settingsItem.hasClass("active"))
                        $settingsItem.addClass("active");
                }
            }

            addBackgroundVideoPreviewPopover(theme, $contentImgContainer);
        } else if(contentType == staticBackgroundType) {
            isActiveContent = currentContent.currentImage && currentContent.currentImage.indexOf(theme.id) >= 0;
            isInstalledContent = theme.hasDownloadedImage;
            $installButton.attr("data-content-type", staticBackgroundType);
            $installButton.attr("data-content-installed", isInstalledContent);
            $installButton.addClass("available-install-static");
            if(isInstalledContent) {
                if(isActiveContent) {
                    if($viewItem && !$viewItem.hasClass("active"))
                        $viewItem.addClass("active");
                    if($settingsItem && !$settingsItem.hasClass("active"))
                        $settingsItem.addClass("active");
                }
            }
        } else if(contentType == liveThemesType) {
            isActiveContent = theme.id == currentContent.currentTheme;
            isInstalledContent = false;
            $installButton.attr("data-content-type", liveThemesType);
            $installButton.attr("target", "_blank");
            $installButton.attr("href", themeSourceInstallUrl + theme.id);
            $installButton.attr("data-content-installed", isInstalledContent);

            $contentResolutionsButtons = $("<div></div>");
            $contentResolutionsButtons.addClass("av-content-resolution-buttons av-content-resolution-buttons-themes");
            $contentResolutionsButtons.attr("data-theme", theme.id);
            for(w in currentContent.videoContentAvailableResolutions) {
                $downloadButton = $("<button></button>").addClass("current-theme-download");
                $downloadButton.addClass("btn");
                if(currentContent.currentVideo.indexOf(theme.id) != -1 && currentContent.currentVideoResolution && currentContent.currentVideoResolution == currentContent.videoContentAvailableResolutions[w]) {
                    $downloadButton.addClass("btn-success");
                    $downloadButton.attr("title", getVideoThemeResolutionButtonTitle(currentContent.videoContentAvailableResolutions[w], true));
                    $downloadButton.attr("is-active-resolution", true);
                } else {
                    $downloadButton.addClass("btn-primary");
                    $downloadButton.attr("title", getVideoThemeResolutionButtonTitle(currentContent.videoContentAvailableResolutions[w], false));
                    $downloadButton.attr("is-active-resolution", false);
                }
                $downloadButton.attr("data-toggle", "tooltip");
                $downloadButton.attr("data-content-type", liveThemesType);
                $downloadButton.attr("data-resolution", currentContent.videoContentAvailableResolutions[w]);
                $downloadButton.attr("data-theme", theme.id);
                downloadButtonResolution = getVideoThemeResolutionTitle(currentContent.videoContentAvailableResolutions[w]);
                $downloadButtonTextResolution = "<span class='download-resolution'>" + downloadButtonResolution + "</span>";
                downloadButtonSize = getVideoThemeResolutionSize(theme, currentContent.videoContentAvailableResolutions[w]);
                $downloadButtonTextSize = "<span class='download-size'>" + downloadButtonSize + "</span>";
                $downloadButton.html($downloadButtonTextResolution + $downloadButtonTextSize);
                $contentResolutionsButtons.append($downloadButton);
            }

            if(isActiveContent)
                $contentResolutionsButtons.css({"display" : "block"});

            $contentContainer.append($contentResolutionsButtons);
        } else if(contentType == flixelBackgroundType) {
            isActiveContent = currentContent.currentVideo && currentContent.currentVideo.indexOf(theme.id) >= 0;
            isInstalledContent = theme.hasDownloadedVideo;
            $installButton.attr("data-content-type", flixelBackgroundType);
            $installButton.attr("data-content-installed", isInstalledContent);
            $installButton.addClass("available-install-flixer-video");

            $contentResolutionsButtons = $("<div></div>");
            $contentResolutionsButtons.addClass("av-content-resolution-buttons").addClass("av-content-resolution-flixel-buttons");
            $contentResolutionsButtons.attr("data-theme", theme.id);
            for (w in currentContent.flixelContentAvailableResolutions) {
                var loopResolution = currentContent.flixelContentAvailableResolutions[w];

                if(typeof (theme.fullHd) == "undefined") {
                    if(loopResolution == 1920 && typeof(theme.bgVideoPath[loopResolution]) == "undefined")
                        continue;
                } else {
                    if(!theme.fullHd && loopResolution == 1920 && typeof(theme.bgVideoPath[loopResolution]) == "undefined")
                        continue;
                }

                themeTitleMaxResolution = "";//(" + getFlixelThemeResolutionTitle(loopResolution, true) + ")" + " ";

                $downloadButton = $("<button></button>").addClass("current-theme-download");
                $downloadButton.addClass("btn");
                if (currentContent.currentVideo.indexOf(theme.id) != -1 && currentContent.currentVideoResolution && currentContent.currentVideoResolution == loopResolution) {
                    $downloadButton.addClass("btn-success");
                    $downloadButton.attr("is-active-resolution", true);
                } else {
                    $downloadButton.addClass("btn-primary");
                    $downloadButton.attr("is-active-resolution", false);
                }
                $downloadButton.attr("data-content-type", flixelBackgroundType);
                $downloadButton.attr("data-resolution", loopResolution);
                $downloadButton.attr("data-theme", theme.id);
                downloadButtonResolution = getFlixelThemeResolutionTitle(loopResolution);
                $downloadButtonTextResolution = "<span class='download-resolution'>" + downloadButtonResolution + "</span>";
                $downloadButton.html($downloadButtonTextResolution);
                $contentResolutionsButtons.append($downloadButton);
            }
            $contentContainer.append($contentResolutionsButtons);

            if(isInstalledContent) {
                if(isActiveContent) {
                    $contentResolutionsButtons.show();
                    if($viewItem && !$viewItem.hasClass("active"))
                        $viewItem.addClass("active");
                    if($settingsItem && !$settingsItem.hasClass("active"))
                        $settingsItem.addClass("active");
                }
            }

            if(typeof (theme.author) != "undefined" && theme.author) {
                var flixelUserChanelUrl = theme.handmade ? theme.author_url : getFlixelUserChanelUrl(theme.author);
                var $contentImgDescription = $("<div></div>");
                    $contentImgDescription.addClass("av-content-img-description");
                    $contentContainer.append($contentImgDescription);
                var $chanelText = $("<a></a>").addClass("av-content-img-description-text");
                    $chanelText.attr("href", flixelUserChanelUrl);
                    $chanelText.attr("target", "_blank");
                    $chanelText.text(translate("options_tabs_item_chanel_description_text_flixel_bg") + " " + theme.author);
                    $contentImgDescription.append($chanelText);

                    $contentImgContainer.hover(function() {
                        var $el = $(this);
                        var $itemDescription = $el.find(".av-content-img-description");
                        var $itemContainer = $el.closest(".av-content-container");
                        if($itemContainer) {
                            var $itemResolutionButtons = $itemContainer.find(".av-content-resolution-buttons");
                            if($itemResolutionButtons && !$itemResolutionButtons.is(":visible"))
                                $itemDescription.fadeIn(400);
                        }
                    }, function() {
                        var $el = $(this);
                        var $itemDescription = $el.find(".av-content-img-description");
                        if($itemDescription.is(":visible"))
                            $itemDescription.fadeOut(400);
                    });
                    $contentImgContainer.append($contentImgDescription);
            }
            addBackgroundVideoPreviewPopover(theme, $contentImgContainer);
        }

        $contentTitle.text(themeTitleMaxResolution + theme.title);

        $installButton.attr("data-content-active", isActiveContent);
        $installButton.attr("data-content-theme", theme.id);

        if(isInstalledContent) {
            $removeItem.addClass("active");
        }
        
        if(isActiveContent) {
            $removeItem.addClass("active-disabled");
            
            $installButton.addClass("btn-primary");
            $installButton.addClass("btn-success");
            if(contentType == liveThemesType)
                installButtonText = translate("options_tabs_item_buttons_active_theme");
            else
                installButtonText = translate("options_tabs_item_buttons_active");
        } else {
            if(isInstalledContent) {
                $installButton.addClass("btn-primary");
                installButtonText = translate("options_tabs_item_buttons_enable");
            } else {
                $installButton.addClass("btn-danger");
                if(contentType == flixelBackgroundType)
                    installButtonText = translate("options_tabs_item_buttons_install_flixer");
                else
                    installButtonText = translate("options_tabs_item_buttons_install");
            }
        }

        $installButton.text(installButtonText);
        $contentImgContainer.append($contentImg);
        $contentFooter.append($installButton);
        if(contentType == staticBackgroundType || contentType == liveBackgroundType || contentType == flixelBackgroundType) {
            $contentFooter.append($viewItem);
        }
        $contentContainer.append($contentTitle).append($contentImgContainer).append($contentFooter);

        $container.append($contentContainer);
    }

    /**
     * Add video preview popover
     *
     * @param theme Object
     * @param $contentContainer jQuery element
     */
    function addBackgroundVideoPreviewPopover(theme, $contentContainer) {
        if(typeof (theme["bgVideoThumb"]) != "undefined" && theme["bgVideoThumb"]) {
            var videoThumbSrc = null;
            if(theme.contentType == liveBackgroundType || theme.contentType == liveThemesType || theme.handmade)
                videoThumbSrc = getThemeContentThumbVideo(theme.id);
            else if(theme.contentType == flixelBackgroundType)
                videoThumbSrc = getFlixelVideoThumb(theme.id);

            var videoPosterSrc = extensionGetUrl("/pages/options/css/img/buttons/popup/circle-loader.gif");
            if(videoThumbSrc) {
                var content = '<video src="' + videoThumbSrc + '" poster="' + videoPosterSrc + '" loop width="320" height="180" class="popover-video-thumb"></video>';
                $contentContainer.popover({
                    "delay" : 750,
                    "html" : true,
                    "title" : theme.title,
                    "trigger" : "hover",
                    "placement" : "auto left",
                    "template" : $("#video-popover-block").html(),
                    "content" : content
                });
                $contentContainer.on("shown.bs.popover", function() {
                    var $player = $contentContainer.parent().find("video");
                    if($player) {
                        var player = $player.get(0);
                        if(player) {
                            player.play();
                        }
                    }
                }).on("hide.bs.popover", function() {
                    var $player = $contentContainer.parent().find("video");
                    if($player) {
                        $player.css({"display" : "none"});
                        var player = $player.get(0);
                        if(player) {
                            player.pause();
                            player.src = "";
                        }
                    }
                });
            }
        }
    }

    /**
     * Display loaded flixer content
     *
     * @param response Object
     */
    function displayLoadedFlixerContent(response) {
        if(typeof(response['newAvailableContentList']) != "undefined") {
            var $flixelBackgrounds = $("#available-flixel-backgrounds");
            var $loadMoreButtonCountainer = $("#load-more-content-container");
            var currentContent = {
                "currentImage" : response.currentImage,
                "currentImageResolution" : response.currentImageResolution,
                "currentVideo" : response.currentVideo,
                "currentVideoResolution" : response.currentVideoResolution,
                "currentTheme" : response.currentThemeId,
                "videoContentAvailableResolutions" : response.videoContentAvailableResolutions,
                "flixelContentAvailableResolutions" : response.flixelContentAvailableResolutions
            };
            var favoriteThemes = getFavoriteThemesObject();

            for(var i in response.newAvailableContentList) {
                var flixelTheme = response.newAvailableContentList[i];

                flixelTheme['installed'] = false;
                flixelTheme['hasDownloadedImage'] = false;
                flixelTheme['hasDownloadedVideo'] = false;
                flixelTheme['favorite'] = checkThemeIsFavorite(flixelTheme, favoriteThemes);

                addAvailableContentToList($flixelBackgrounds, flixelTheme, flixelBackgroundType, currentContent);
            }

            if(getFlixelContentCurrentPage() < getFlixelTotalPagesCount()) {
                if(response.newAvailableContentList.length) {
                    var $icon = $loadMoreButtonCountainer.find(".glyphicon");
                    if($icon && $icon.hasClass("rotating"))
                        $icon.removeClass("rotating");
                    $loadMoreButtonCountainer.on("click", loadMoreFlixelContentButtonHandler);
                }
                else
                    $loadMoreButtonCountainer.hide();
            }
            else
                $loadMoreButtonCountainer.hide();
        }
    }

    /**
     * Download available contents error
     *
     * @param message Object
     */
    function getAvailableContentError(message) {
        $.jGrowl(translate("options_refresh_themes_list_error"), { "life" : 10000 });
    }

    /**
     * Change background image file error
     *
     * @param message Object
     */
    function changeBackgroundImageFileError(message) {
        var currentThemeId = null;
        if(message.currentThemeId)
            currentThemeId = message.currentThemeId;

        $.jGrowl(translate("options_tabs_download_static_bg_error"));
        var $downloadItems = $("#available-image-themes").find(".av-content-install[data-content-downloading='true']");
        if($downloadItems.length) {
            $downloadItems.each(function () {
                var $el = $(this);
                $el.attr('data-content-downloading', false);
                setInstallButtonClass($el, 'btn-danger');
                $el.text(translate("options_tabs_item_buttons_install"));
            });
        }

        if(currentThemeId) {
            var $activeItems = $("#available-image-themes").find(".av-content-install[data-content-theme='" + currentThemeId + "']");
            if($activeItems.length) {
                $activeItems.each(function() {
                    var $el = $(this);
                    if($el.attr('data-content-theme') == currentThemeId) {
                        setInstallButtonClass($el, 'btn-success');
                        var $viewItem = $el.parent().find(".av-content-view");
                        if($viewItem && !$viewItem.hasClass("active"))
                            $viewItem.addClass("active");
                        $el.text(translate("options_tabs_item_buttons_active"));
                    }
                });
            }
        }
    }

    /**
     * Change background flixer file error
     *
     * @param message Object
     */
    function changeBackgroundFlixerVideoFileErrorToPage(message) {
        changeBackgroundVideoContentError(message, flixelBackgroundType);
    }

    /**
     * Change background video file error
     *
     * @param message Object
     */
    function changeBackgroundVideoFileError(message) {
        changeBackgroundVideoContentError(message, liveBackgroundType);
    }

    /**
     * Change background video content error
     *
     * @param message Object
     * @param contentType Int
     */
    function changeBackgroundVideoContentError(message, contentType) {
        var currentVideoThemeId = null;
        var installedThemeId = null;
        if(message.currentThemeId)
            currentVideoThemeId = message.currentThemeId;
        if(message.installedThemeId)
            installedThemeId = message.installedThemeId;

        if(contentType == flixelBackgroundType)
            $.jGrowl(translate("options_tabs_download_flixer_bg_error"));
        else
            $.jGrowl(translate("options_tabs_download_live_bg_error"));

        $("#available-video-themes, #available-flixel-backgrounds, #available-live-themes").each(function() {
            var $downloadItems = $(this).find(".av-content-install[data-content-downloading='true']");
            if($downloadItems.length) {
                $downloadItems.each(function () {
                    var $downloadItem = $(this);
                    var contentType = $downloadItem.attr("data-content-type");

                    $downloadItem.attr('data-content-downloading', false);
                    var $resolutionButtons = $downloadItem.parent().parent().find(".av-content-resolution-buttons");
                    $resolutionButtons.find("button").each(function() {
                        var $button = $(this);
                        if($button.hasClass("btn-success")) {
                            $button.attr("is-active-resolution", false);
                            $button.removeClass("btn-success");
                        }
                        if(!$button.hasClass("btn-primary"))
                            $button.addClass("btn-primary");
                    });

                    if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                        $resolutionButtons.show();
                        setInstallButtonClass($downloadItem, 'btn-danger');
                        $downloadItem.text(translate("options_tabs_item_buttons_install_select_quality"));
                    } else if(contentType == liveThemesType) {
                        var isActive = $downloadItem.attr("data-content-active");
                            isActive = isActive == "true";
                        if(isActive) {
                            setInstallButtonClass($downloadItem, 'btn-success');
                            $downloadItem.text(translate("options_tabs_item_buttons_active_theme"));
                        }
                    }
                });
            }
        });

        if(currentVideoThemeId) {
            $("#available-video-themes, #available-flixel-backgrounds, #available-live-themes").each(function() {
                var $activeItems = null;
                var $activeItemsContainer = $(this);
                if($activeItemsContainer.attr("id") == "available-video-themes")
                    $activeItems = $activeItemsContainer.find(".av-content-install[data-content-theme='" + currentVideoThemeId + "']");
                else if($activeItemsContainer.attr("id") == "available-live-themes" || $activeItemsContainer.attr("id") == "available-flixel-backgrounds")
                    $activeItems = $activeItemsContainer.find(".av-content-install[data-content-theme='" + installedThemeId + "']");
                if($activeItems && $activeItems.length) {
                    $activeItems.each(function() {
                        var $el = $(this);
                        var contentType = $el.attr("data-content-type");
                        var checkContentResolution;

                        if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                            checkContentResolution = message.installedResolution;
                            setInstallButtonClass($el, 'btn-success');
                            var $viewItem = $el.parent().find(".av-content-view");
                            if($viewItem && !$viewItem.hasClass("active"))
                                $viewItem.addClass("active");
                            
                            var $settingsItem = $el.parent().parent().find(".av-content-img-settings");
                            if($settingsItem && !$settingsItem.hasClass("active"))
                                $settingsItem.addClass("active");
                            
                            var $removeItem = $el.parent().parent().find(".av-content-img-delete");
                            if($removeItem){
                                $("active-disabled").removeClass("active-disabled");
                                $removeItem.addClass("active").addClass("active-disabled");                          
                            }
                            
                            $el.text(translate("options_tabs_item_buttons_active"));
                        } else if(contentType == liveThemesType) {
                            checkContentResolution = message.installedThemeResolution;
                            var isActive = $el.attr("data-content-active");
                                isActive = isActive == "true";
                            if(isActive) {
                                setInstallButtonClass($el, 'btn-success');
                                $el.text(translate("options_tabs_item_buttons_active_theme"));
                            }
                        }

                        if(typeof(checkContentResolution) != "undefined" && checkContentResolution) {
                            var $resolutionButtons = $el.parent().parent().find(".av-content-resolution-buttons");
                            $resolutionButtons.find("button").each(function() {
                                var $button = $(this);
                                if($button.attr("data-resolution") == checkContentResolution) {
                                    $button.attr("is-active-resolution", true);
                                    if($button.hasClass("btn-primary"))
                                        $button.removeClass("btn-primary");
                                    if(!$button.hasClass("btn-success"))
                                        $button.addClass("btn-success");
                                }
                            });
                        }
                    });
                }
            });
        }
        $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
    }

    /**
     * Change background image file progress
     *
     * @param message Object
     */
    function changeBackgroundImageFileProgress(message) {
        var $downloadItems = $("#available-image-themes").find(".av-content-install[data-content-downloading='true']");
        if($downloadItems.length) {
            $downloadItems.each(function () {
                $(this).text(translate("options_tabs_item_buttons_download") + " " + message.percentComplete + "%");
            });
        } else {
            if(typeof (message.downloadingFile['themeId']) != "undefined" && message.downloadingFile['themeId']) {
                $downloadItems = $("#available-image-themes").find(".av-content-install[data-content-theme='" + message.downloadingFile.themeId + "']");
                if($downloadItems.length) {
                    $downloadItems.each(function () {
                        var $installButton = $(this);
                        $installButton.text(translate("options_tabs_item_buttons_download") + " " + message.percentComplete + "%");
                        $installButton.attr("data-content-current-click", true);
                        setInstallButtonClass($installButton, "btn-info");
                        var $viewItem = $installButton.parent().find(".av-content-view");
                        if($viewItem && $viewItem.hasClass("active"))
                            $viewItem.removeClass("active");
                        $installButton.attr("data-content-downloading", true);
                    });
                    $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
                }
            }
        }
    }

    /**
     * Change background flixer video file progress
     *
     * @param message Object
     */
    function changeBackgroundFlixerVideoFileProgressToPage(message) {
        changeBackgroundVideoContentProgress(message, flixelBackgroundType);
    }

    /**
     * Change background video file progress
     *
     * @param message Object
     */
    function changeBackgroundVideoFileProgress(message) {
        changeBackgroundVideoContentProgress(message, liveBackgroundType);
    }

    /**
     * Change background video content progress
     *
     * @param message Object
     * @param contentType Int
     */
    function changeBackgroundVideoContentProgress(message, contentType) {
        var $itemsContainer = $("#available-video-themes, #available-flixel-backgrounds, #available-live-themes");
        var $downloadItems = $itemsContainer.find(".av-content-install[data-content-downloading='true']");
        var $activeItems = $itemsContainer.find(".av-content-install[data-content-active='true']");

        if($downloadItems.length) {
            $downloadItems.each(function () {
                var $downloadItem = $(this);
                var contentType = $downloadItem.attr("data-content-type");
                var outputTranslate = contentType == flixelBackgroundType ? translate("options_tabs_item_buttons_download_flixel") : translate("options_tabs_item_buttons_download");
                
                var outputText = outputTranslate + " " + message.percentComplete;// + "%";
                if(String(message.percentComplete).indexOf("M") == -1) outputText += "%" //Hack to display MB instead %
                
                if(contentType == liveBackgroundType || contentType == flixelBackgroundType)
                    $downloadItem.text(outputText);
                else if(contentType == liveThemesType) {
                    var isActive = $downloadItem.attr("data-content-active");
                        isActive = isActive == "true";
                    if(isActive)
                        $downloadItem.text(outputText);
                }
            });
        } else {
            if(typeof (message.downloadingFile['themeId']) != "undefined" && message.downloadingFile['themeId']) {
                if($activeItems.length) {
                    $activeItems.each(function() {
                        var $installButton = $(this);
                        if($installButton.attr("data-content-theme") != message.downloadingFile.themeId) {
                            var contentType = $installButton.attr("data-content-type");
                            if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                                var $downloadContainer = $installButton.parent().parent().find(".av-content-resolution-buttons");
                                if($downloadContainer.is(":visible"))
                                    $downloadContainer.hide();
                            }
                        }
                    });
                }

                $downloadItems = $itemsContainer.find(".av-content-install[data-content-theme='" + message.downloadingFile.themeId + "']");
                if($downloadItems.length) {
                    $downloadItems.each(function () {
                        var $installButton = $(this);
                        var contentType = $installButton.attr("data-content-type");
                        var isActive = $installButton.attr("data-content-active");
                            isActive = isActive == "true";

                        if(contentType == flixelBackgroundType || contentType == liveBackgroundType || (contentType == liveThemesType && isActive)) {
                            var outputTranslate = contentType == flixelBackgroundType ? translate("options_tabs_item_buttons_download_flixel") : translate("options_tabs_item_buttons_download");
                            $installButton.text(outputTranslate + " " + message.percentComplete + "%");
                            $installButton.attr("data-content-current-click", true);
                            setInstallButtonClass($installButton, "btn-info");
                            $installButton.attr("data-content-downloading", true);
                            var $viewItem = $installButton.parent().find(".av-content-view");
                            if($viewItem && $viewItem.hasClass("active"))
                                $viewItem.removeClass("active");
                            var $settingsItem = $installButton.parent().parent().find(".av-content-img-settings");
                            if($settingsItem && $settingsItem.hasClass("active"))
                                $settingsItem.removeClass("active");
                            
                            var $removeItem = $el.parent().parent().find(".av-content-img-delete");
                            if($removeItem){
                                $removeItem.removeClass("active-disabled");                          
                            }
                            
                            var $downloadContainer = $installButton.parent().parent().find(".av-content-resolution-buttons");
                            if(typeof(message.downloadingFile['resolution']) != "undefined") {
                                $downloadContainer.find("button").each(function() {
                                    var $item = $(this);
                                    var itemResolution = $item.attr("data-resolution");
                                    $item.removeClass("btn-success");
                                    if(message.downloadingFile.resolution == itemResolution) {
                                        $item.addClass("btn-success");
                                        $item.attr("is-active-resolution", true);
                                        if(contentType != flixelBackgroundType)
                                            $item.attr("title", getVideoThemeResolutionButtonTitle(itemResolution, true));
                                    } else {
                                        if(!$item.hasClass("btn-primary"))
                                            $item.addClass("btn-primary");
                                        $item.attr("is-active-resolution", false);
                                        if(contentType != flixelBackgroundType)
                                            $item.attr("title", getVideoThemeResolutionButtonTitle(itemResolution, false));
                                    }
                                });
                            }
                            $downloadContainer.show();
                        }
                    });
                    $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
                }
            }
        }
    }

    /**
     * Change static background to options page
     *
     * @param message Object
     */
    function changeStaticBackgroundToOptionsPage(message) {
        clearInstallContentButtons(staticBackgroundType);
        clearInstallContentButtons(liveBackgroundType);
        clearInstallContentButtons(flixelBackgroundType);
        checkDisplayRandomThemesActive();
        var $activeDataContainer = $(".available-themes-block[data-container-content-type=" + liveBackgroundType + "], .available-themes-block[data-container-content-type=" + flixelBackgroundType + "]");
            $activeDataContainer.find(".av-content-resolution-buttons").each(function() { $(this).hide(); });

        var $container = $("#available-image-themes");
        $container.find("a[data-content-theme='" + message.theme.id + "']").each(function() {
            var $el = $(this);
                setInstallButtonClass($el, "btn-success");
                $el.attr("data-content-downloading", false);
                $el.attr("data-content-installed", true);
                $el.attr("data-content-active", true);
                $el.text(translate("options_tabs_item_buttons_active"));

                var $viewItem = $(this).parent().find(".av-content-view");
                if($viewItem && !$viewItem.hasClass("active"))
                    $viewItem.addClass("active");
            
                var $settingsItem = $el.parent().parent().find(".av-content-img-settings");
                if($settingsItem && !$settingsItem.hasClass("active"))
                    $settingsItem.addClass("active");
            
                var $removeItem = $el.parent().parent().find(".av-content-img-delete");
                if($removeItem){
                    $("active-disabled").removeClass("active-disabled");
                    $removeItem.addClass("active").addClass("active-disabled");                          
                }

                $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
        });
    }

    /**
     * Change flixer background to options page
     *
     * @param message Object
     */
    function changeFlixerBackgroundToOptionsPage(message) {
        changeVideoBackgroundToOptionsPage(message, flixelBackgroundType);
    }

    /**
     * Change live background to options page
     *
     * @param message Object
     */
    function changeLiveBackgroundToOptionsPage(message) {
        changeVideoBackgroundToOptionsPage(message, liveBackgroundType);
    }

    /**
     * Change video bacground to options page
     *
     * @param message Object
     * @param contentType Int
     */
    function changeVideoBackgroundToOptionsPage(message, contentType) {
        clearInstallContentButtons(staticBackgroundType);
        clearInstallContentButtons(liveBackgroundType);
        clearInstallContentButtons(flixelBackgroundType);
        checkDisplayRandomThemesActive();

        $("#available-video-themes, #available-flixel-backgrounds").find(".av-content-resolution-buttons").each(function() { $(this).hide(); });

        var $activeDataContainers = $(".available-themes-block[data-container-content-type=" + contentType + "]");
        $activeDataContainers.find(".av-content-resolution-buttons").each(function() { $(this).hide(); });
        $("#available-video-themes, #available-flixel-backgrounds, #available-live-themes").each(function() {
            var $container = $(this);
            var containerId = $container.attr("id");
            $container.find("a[data-content-theme='" + message.videoThemeId + "']").each(function() {
                var $el = $(this);

                setInstallButtonClass($el, "btn-success");
                $el.attr("data-content-downloading", false);
                $el.attr("data-content-installed", true);
                $el.attr("data-content-active", true);

                if(containerId == "available-video-themes" || containerId == "available-flixel-backgrounds") {
                    $el.text(translate("options_tabs_item_buttons_active"));
                    var $viewItem = $(this).parent().find(".av-content-view");
                    if($viewItem && !$viewItem.hasClass("active"))
                        $viewItem.addClass("active");
                    var $settingsItem = $(this).parent().parent().find(".av-content-img-settings");
                    if($settingsItem && !$settingsItem.hasClass("active"))
                        $settingsItem.addClass("active");
                    
                    var $removeItem = $el.parent().parent().find(".av-content-img-delete");
                    if($removeItem){
                        $("active-disabled").removeClass("active-disabled");
                        $removeItem.addClass("active").addClass("active-disabled");                          
                    }
                } else if(containerId == "available-live-themes") {
                    $el.text(translate("options_tabs_item_buttons_active_theme"));
                }

                var $downloadContainer = $el.parent().parent().find(".av-content-resolution-buttons");
                $downloadContainer.find("button").each(function() {
                    var $item = $(this);
                    var itemResolution = $item.attr("data-resolution");
                    $item.removeClass("btn-success");
                    if(message.currentVideoResolution == itemResolution) {
                        $item.addClass("btn-success");
                        $item.attr("is-active-resolution", true);
                        if(contentType == liveBackgroundType)
                            $item.attr("title", getVideoThemeResolutionButtonTitle(itemResolution, true));
                    } else {
                        if(!$item.hasClass("btn-primary"))
                            $item.addClass("btn-primary");
                        $item.attr("is-active-resolution", false);
                        if(contentType == liveBackgroundType)
                            $item.attr("title", getVideoThemeResolutionButtonTitle(itemResolution, false));
                    }
                });

                if(containerId == "available-video-themes" || containerId == "available-flixel-backgrounds") {
                    $downloadContainer.show();
                }

                $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
            });
        });
    }

    /**
     * Set install button class
     *
     * @param $el
     * @param className
     * @returns {*}
     */
    function setInstallButtonClass($el, className) {
        return $el.removeClass("btn-primary")
                  .removeClass("btn-danger")
                  .removeClass("btn-info")
                  .removeClass("btn-success")
                  .addClass(className);
    }

    /**
     * Display loading video theme error
     *
     * @param message Object
     */
    function displayLoadingVideoThemeError(message) {
        var $popup = $("#current-theme-image-container");
        var $loading = $popup.find(".loading");
        var $progress = $(".squaresLoadingProgress");
        var $error = $(".squaresLoadingError");
        if($progress.is(":visible"))
            $progress.hide();
        if(!$loading.is(":visible"))
            $loading.show();
        if(!$error.is(":visible"))
            $error.show();
        $error.find("#squaresLoadingError").text(message.errorMessage);
    }

    /**
     * Display loaded background video theme
     *
     * @param message Object
     */
    function displayLoadedBackgroundVideoTheme(message) {
        var popup = $("#current-theme-image-container");
        var $progress = $(".squaresLoadingProgress");
        var $error = $(".squaresLoadingError");
        var $success = $(".squaresLoadingSuccess");
        popup.find(".loading").hide();
        $progress.find("#squaresLoadingProgress").text("0");
        $error.find("#squaresLoadingError").text("");
        if(!$success.is(":visible"))
            $success.fadeIn(350);
        setTimeout(function() {
            var $success = $(".squaresLoadingSuccess");
            if($success.is(":visible"))
                $success.fadeOut(350);
        }, 2000);
    }

    /**
     * Add install resolution live background handler
     */
    function addInstallResolutionLiveBackgroundHandler() {
        $(document).on("click", ".current-theme-download", function(e) {
            e.preventDefault();
            e.stopPropagation();

            var $el = $(this);
            var isActiveResolution = $el.attr("is-active-resolution");
            isActiveResolution = isActiveResolution == "true";
            if(!isActiveResolution) {
                var themeId = $el.attr("data-theme");
                var resolution = $el.attr("data-resolution");
                var contentType = $el.attr("data-content-type");

                var elements = [];
                var $chainElements = null;

                elements.push($el);
                if(themeId) {
                    var $contentTypeContainer = null;
                    if(contentType == liveThemesType)
                        $contentTypeContainer = $("#available-video-themes");
                    else if(contentType == liveBackgroundType || contentType == flixelBackgroundType)
                        $contentTypeContainer = $("#available-live-themes, #available-flixel-backgrounds");

                    if($contentTypeContainer) {
                        if(contentType == liveThemesType) {
                            $contentTypeContainer.find(".av-content-resolution-buttons").each(function () {
                                var $contentTypeResolutionsEl = $(this);
                                var $contentTypeResolutionsElContentId = $contentTypeResolutionsEl.attr("data-theme");
                                if($contentTypeResolutionsElContentId == themeId) {
                                    if(!$contentTypeResolutionsEl.is(":visible"))
                                        $contentTypeResolutionsEl.show();
                                }  else
                                    $contentTypeResolutionsEl.hide();
                            });
                        }

                        $chainElements = $contentTypeContainer.find(".current-theme-download[data-theme='" + themeId + "']");
                        if($chainElements) {
                            var $chainElement = $chainElements.filter("[data-resolution='" + resolution + "']");
                            if($chainElement) {
                                var $chainInstallBtn = $chainElement.parent().parent().find(".av-content-install");
                                if($chainInstallBtn) {
                                    if(contentType == liveThemesType) {
                                        elements.push($chainElement);
                                    } else if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                                        var chainInstallIsActive = $chainInstallBtn.attr("data-content-active");
                                        chainInstallIsActive = chainInstallIsActive == "true";
                                        if(chainInstallIsActive) {
                                            elements.push($chainElement);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                $.each(elements, function( index, $currentButton ) {
                    var $downloadButtons = $currentButton.parent();
                    $downloadButtons.find("button").each(function() {
                        var $downloadButton = $(this);
                        var eachDownloadButtonResolution = $downloadButton.attr("data-resolution");
                        $downloadButton.removeClass("btn-success");
                        if(!$downloadButton.hasClass("btn-primary"))
                            $downloadButton.addClass("btn-primary");
                        $downloadButton.attr("is-active-resolution", false);
                        if(contentType != flixelBackgroundType)
                            $downloadButton.attr("title", getVideoThemeResolutionButtonTitle(eachDownloadButtonResolution, false));
                    });
                    $currentButton.removeClass("btn-primary").addClass("btn-success");
                    $currentButton.attr("is-active-resolution", true);
                    if(contentType != flixelBackgroundType)
                        $currentButton.attr("title", getVideoThemeResolutionButtonTitle(resolution, true));
                    
                    if(themeId && resolution) {
                        var $installButton = $currentButton.parent().parent().find(".av-content-install");
                        var $viewItem = $installButton.parent().find(".av-content-view");
                        if($viewItem && $viewItem.hasClass("active"))
                            $viewItem.removeClass("active");
                        var $settingsItem = $installButton.parent().parent().find(".av-content-img-settings");
                        if($settingsItem && $settingsItem.hasClass("active"))
                            $settingsItem.removeClass("active");
                        
                        var $removeItem = $el.parent().parent().find(".av-content-img-delete");
                        if($removeItem){
                            $removeItem.removeClass("active-disabled");                          
                        }
                        
                        $installButton.attr("data-content-current-click", true);
                        setInstallButtonClass($installButton, "btn-info");
                        $installButton.attr("data-content-downloading", true);
                        var outputTranslate = contentType == flixelBackgroundType ? translate("options_tabs_item_buttons_download_flixel") : translate("options_tabs_item_buttons_download");
                        $installButton.text(outputTranslate + "...");
                    }
                });

                if(themeId && resolution) {
                    var command = contentType == flixelBackgroundType ? "changeFlixerVideoBackground" : "applyResolutionVideoTheme";
                    //chrome.runtime.sendMessage({"command" : command, "theme" : themeId, "resolution" : resolution});
                    BRW_sendMessage({"command" : command, "theme" : themeId, "resolution" : resolution});
                    
                }
            }
            $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
        });
    }

    /**
     * Get video theme resolution title
     *
     * @param name String
     * @returns {string}
     */
    function getVideoThemeResolutionTitle(name) {
        var result = "";
        switch (name) {
            case "640" : result = "480p";
                break;
            case "1024" : result = "720p";
                break;
            case "1920" : result = "1080p";
                break;
        }
        return result;
    }

    /**
     * Get flixel theme resolution title
     *
     * @param name String
     * @param shortName Bool
     * @returns {string}
     */
    function getFlixelThemeResolutionTitle(name, shortName) {
        var result = "";
        switch (name) {
            case "1280" : result = "HD";
                break;
            case "1920" : result = shortName ? "FHD" : "Full HD";
                break;
        }
        return result;
    }

    /**
     * Get video theme resolution title
     *
     * @param resolution String
     * @param isActive Bool
     * @returns {string}
     */
    function getVideoThemeResolutionButtonTitle(resolution, isActive) {
        var additionalText = "";
        switch (resolution) {
            case "640" : additionalText = translate("options_tabs_item_buttons_active_resolution_480p_live_bg");
                break;
            case "1024" : additionalText = translate("options_tabs_item_buttons_active_resolution_720p_live_bg");
                break;
            case "1920" : additionalText = translate("options_tabs_item_buttons_active_resolution_1080p_live_bg");
                break;
        }
        return additionalText;
    }

    /**
     * Get video theme resolution size
     *
     * @param theme Object
     * @param name String
     * @returns {string}
     */
    function getVideoThemeResolutionSize(theme, name) {
        var result = "";
        var size = 0;
        if(typeof (theme['bgVideoSize']) != "undefined") {
            if(typeof (theme['bgVideoSize'][name]) != "undefined") {
                size = parseInt(theme['bgVideoSize'][name]);
                if(!isNaN(size)) {
                    result = (size / 1024 / 1024).toFixed(2) + "Mb";
                }
            }
        }
        return result;
    }

    /**
     * Add themes sort button handler
     */
    function addThemesSortButtonHandler() {
        var $el = $(".options-settings-themes-sort-item");
        var $item = $el.filter("[data-sort=" + getThemesSortType() + "]");
        
        if($item)
            $item.addClass("active");

        $el.on("click", function() {
            var $el = $(this);
            var val = parseInt($el.attr("data-sort"));
            var currentSort = getThemesSortType();
            if(currentSort != val){
                //setVisibleElementsBySortType(val);
                BRW_sendMessage({command: "setThemesSortType", val: val});
            }//if
        });
    }
    
    function setVisibleElementsBySortType(val){
        switch(parseInt(val)){
            case 2://featured themes
                $('#load-more-content-container').css({display:'none'});
                $('.random-themes-container').css({display:'none'});
            break;
            case 0: case 1://newsest & popular themes
                $('#load-more-content-container').css({display:'block'});
                $('.random-themes-container').css({display:'none'});
                //localStorage.setItem("flixel-themes-current-page", '1');
            break;
            case 3://downloaded themes
                $('#load-more-content-container').css({display:'none'});
                $('.random-themes-container').css({display:'block'});
            break;
        }//switch
    }

    /**
     * Disable image button
     */
    function addDisableImageButtonHandler() {
        $(document).on("click", "#disable-current-image", function() {
            BRW_sendMessage({command: "disableCurrentImage"}, function(response) {
                clearInstallContentButtons(staticBackgroundType);
                $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
            });
        });
    }

    /**
     * Disable video button
     */
    function addDisableVideoButtonHandler() {
        $(document).on("click", "#disable-current-video, #disable-current-flixel", function() {
            
            BRW_sendMessage({command: "disableCurrentVideo"}, function(response) {
                $(".current-theme-download").each(function() {
                    var $el = $(this);
                    var eachElResolution = $el.attr('data-resolution');
                    if($el.hasClass("btn-success"))
                        $el.removeClass("btn-success");
                    if(!$el.hasClass("btn-primary"))
                        $el.addClass("btn-primary");
                    $el.attr("title", getVideoThemeResolutionButtonTitle(eachElResolution, false));
                });
                clearInstallContentButtons(liveBackgroundType);
                clearInstallContentButtons(flixelBackgroundType);
                $(".av-content-resolution-buttons").hide();

                var clockType = parseInt(localStorage.getItem("page-clock-type"));
                if(isNaN(clockType))
                    setClockColorScheme(getClockColorsObject());

                $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
            });
            
        });
    }

    /**
     * Add update available theme handler
     */
    function addUpdateAvailableThemesHandler() {
        $(document).on("click", "#available-themes-update", function(e) {
            e.preventDefault();
            $("#available-themes").find(".tab-content").slideUp(500, function() {
                BRW_sendMessage({command: "updateAvailableThemesList"}, function(response) {
                    getAvailableThemes(response, displayAvailableThemesList);
                });
            });
        });
    }

    /**
     * Display available themes list
     */
    function displayAvailableThemesList() {
        hideTabContentLoader();

        var $moreBackgroundsBtn = $("#load-more-flixel-content");
        $moreBackgroundsBtn.html("<span class='glyphicon glyphicon-globe more-flixel-content-img' aria-hidden='true'></span><span class='more-flixel-content-text'>" + translate("options_tabs_content_flixer_load_button") + "</span>");
        $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');

        $("#available-themes").find(".tab-content").slideDown(500);
    }

    /**
     * Add install content button handler
     */
    function addInstallContentButtonHandler() {
        $(document).on("click", ".av-content-install", function(e) {
            e.preventDefault();
            var $el = $(this);
            var href = $el.attr("href");
            var contentType = $el.attr("data-content-type");
            var contentDownloading = $el.attr("data-content-downloading");
            var contentInstalled = $el.attr("data-content-installed");
            var contentActive = $el.attr("data-content-active");
            var contentTheme = $el.attr("data-content-theme");
                contentActive = contentActive == "true";
                contentDownloading = contentDownloading == "true";
                contentInstalled = contentInstalled == "true";
            var $resolutionButtons;

            var installContentText = translate("options_tabs_item_buttons_install");
            if(contentType == flixelBackgroundType)
                installContentText = translate("options_tabs_item_buttons_install_flixer");

            var selectQualityText = translate("options_tabs_item_buttons_install_select_quality");

            if(contentType == liveThemesType && !contentActive) {
                BRW_sendMessage({command: "openInstallThemeTab", url: href});
            } else if(contentType == liveBackgroundType || contentType == staticBackgroundType || contentType == flixelBackgroundType) {
                if(!contentActive) {
                    if(!contentDownloading) {
                        $el.attr("data-content-current-click", true);
                        if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                            $("#available-video-themes, #available-flixel-backgrounds").find(".av-content-resolution-buttons").hide();
                            $("#available-live-themes").find(".av-content-install[data-content-theme!='" + contentTheme + "']").each(function() {
                                var $resolutionButtons = $(this).parent().parent().find(".av-content-resolution-buttons");
                                $resolutionButtons.find("button").each(function() {
                                    var $button = $(this);
                                    if($button.hasClass("btn-success")) {
                                        $button.attr("is-active-resolution", false);
                                        $button.removeClass("btn-success");
                                    }
                                    if(!$button.hasClass("btn-primary")) {
                                        $button.addClass("btn-primary");
                                    }
                                });
                            });
                            if(contentInstalled) {
                                var command = contentType == liveBackgroundType ? "changeVideoBackground" : "changeFlixerVideoBackground";
                                BRW_sendMessage({command: command, theme: contentTheme});
                                setDownloadingButtonState($el, contentType);
                            } else {
                                $resolutionButtons = $el.parent().parent().find(".av-content-resolution-buttons");
                                $resolutionButtons.show();
                                clearSelectQualityButtonText(installContentText, selectQualityText);
                                $el.text(selectQualityText);
                            }
                        } else if(contentType == staticBackgroundType) {
                            BRW_sendMessage({command: "changeImageBackground", theme: contentTheme});
                            setDownloadingButtonState($el, contentType);
                        }
                    }
                } else {
                    if(contentType == liveBackgroundType || contentType == flixelBackgroundType) {
                        $("#available-video-themes, #available-flixel-backgrounds").find(".av-content-resolution-buttons").hide();
                        var $itemResolutionContainer = $el.parent().parent().find(".av-content-resolution-buttons");
                            $itemResolutionContainer.show();
                        clearSelectQualityButtonText(installContentText, selectQualityText);
                    }
                }
            }
            $('[data-toggle="tooltip"]').tooltip('hide').tooltip('fixTitle');
        });
    }

    /**
     * Add settings button click handler
     */
    function addSettingsContentButtonHandler() {
        $(document).on("click", ".av-content-img-settings", function(e) {
            e.preventDefault();
            openUrlInNewTab(extensionGetUrl("/pages/options/settings.html"));
        });
    }



    /**
     * Clear select quality button text
     *
     * @param installContentText String
     * @param selectQualityText String
     */
    function clearSelectQualityButtonText(installContentText, selectQualityText) {
        $(".av-content-install").each(function() {
            var $installEl = $(this);
            if($installEl.text() == selectQualityText)
                $installEl.text(installContentText);
        });
    }

    /**
     * Set downloading button state
     *
     * @param $el jQuery element
     * @param contentType Int
     */
    function setDownloadingButtonState($el, contentType) {
        if(contentType == liveBackgroundType || contentType == flixelBackgroundType)
            clearInstallContentButtons(contentType);

        setInstallButtonClass($el, "btn-info");
        $(".av-content-install").attr("data-content-downloading", false);
        $el.attr("data-content-downloading", true);
        if(contentType == flixelBackgroundType)
            $el.text(translate("options_tabs_item_buttons_download_flixel") + "...");
        else
            $el.text(translate("options_tabs_item_buttons_download") + "...");
    }

    /**
     * Clear install content buttons
     *
     * @param contentType Int
     */
    function clearInstallContentButtons(contentType) {
        var $activeDataContainer = $(".available-themes-block[data-container-content-type=" + contentType + "]");
        $activeDataContainer.find(".av-content-install").each(function() {
            var text = "";
            var $item = $(this);
                $item.removeClass("btn-success");
            var isInstalled = $item.attr("data-content-installed");
                isInstalled = isInstalled && isInstalled == "true";
            if(isInstalled) {
                text = translate("options_tabs_item_buttons_enable");
                $item.removeClass("btn-danger");
                if(!$item.hasClass("btn-primary"))
                    $item.addClass("btn-primary");
            } else {
                text = translate("options_tabs_item_buttons_install");
                if(contentType == flixelBackgroundType)
                    text = translate("options_tabs_item_buttons_install_flixer");

                $item.removeClass("btn-primary");
                if(!$item.hasClass("btn-danger"))
                    $item.addClass("btn-danger");
            }
            $item.text(text);
        });

        $activeDataContainer.find("a[data-content-downloading='true']").each(function() {
            var $item = $(this);
            $item.attr("data-content-downloading", false);
            $item.removeClass("btn-info");
        });

        $activeDataContainer.find("a[data-content-active='true']").each(function() {
            var $item = $(this);
            $item.attr("data-content-active", false);
            $item.removeClass("btn-success");
            var $viewItem = $item.parent().find(".av-content-view");
            if($viewItem && $viewItem.hasClass("active"))
                $viewItem.removeClass("active");
            var $settingsItem = $item.parent().parent().find(".av-content-img-settings");
            if($settingsItem && $settingsItem.hasClass("active"))
                $settingsItem.removeClass("active");
            
            var $removeItem = $item.parent().parent().find(".av-content-img-delete");
            if($removeItem){
                $removeItem.removeClass("active-disabled");                          
            }
        });

        if(contentType == staticBackgroundType) {
            $activeDataContainer.find(".av-content-img-settings.active").each(function() {
                $(this).removeClass("active");
            });
        }
    }

    /**
     * Display tab content loader
     */
    function displayTabContentLoader() {
        var $el = $("#tab-content-loader");
        var nextUpdate, currentTime = new Date().getTime();
        var currentTab = getSettingsBackgroundTabId();

        if(currentTab == 0) {
            nextUpdate = localStorage.getItem("flixel-themes-data-next-update");
            if(!nextUpdate || nextUpdate < currentTime)
                if(!$el.is(":visible")) $el.show();
        } else if(currentTab == 1) {
            nextUpdate = localStorage.getItem("available-themes-data-next-update");
            if(!nextUpdate || nextUpdate < currentTime)
                if(!$el.is(":visible")) $el.show();
        }
    }

    /**
     * Hide content loader
     */
    function hideTabContentLoader() {
        var $el = $("#tab-content-loader");
        if($el.is(":visible"))
            $el.fadeOut(100);
        else
            $el.hide();
    }

    /**
     * Update available themes list
     */
    function updateAvailableThemesListOnPageLoad() {
        //window.postMessage("Message from content script","*");
        
        BRW_sendMessage({command: "updateAvailableThemesList"}, function(availableThemesResponse){
            BRW_sendMessage({command: "updateFlixelThemesList"}, function(){
                getAvailableThemes(availableThemesResponse, displayAvailableThemesList); 
            }); 
        });
    }

    /**
     * Add restore default handler
     */
    function addRestoreDefaultThemeHandler() {
        $(document).on("click", "#open-chrome-settings-url", function(e) {
            e.preventDefault();
            chrome.tabs.create({ url: 'chrome://settings/' });
        });

        $(document).on("click", "#restore-default-theme-dialog-body", function(e) {
            e.preventDefault();
            openUrlInNewTab($(this).find("#restore-default-theme-description").attr("src"));
        });
    }

    /**
     * Add background view button handler
     */
    function addSettingsBackgroundViewButtonHandler() {
        $(document).on("click", ".av-content-view", function(e) {
            e.preventDefault();
            if(getRandomThemesDisplay())
                setDisplayCurrentBackgroundFile();
                openUrlInNewTab(extensionGetUrl("/pages/newtab/newtab.html"));
        });
    }

    /**
     * Display settings background tabs
     */
    function displaySettingsBackgroundTabs() {
        var $tabButton = $(".settings-background-tab-button[data-settings-tabid=" + getSettingsBackgroundTabId() + "]");
        $tabButton.tab('show');

    }

    /**
     * Add settings background tabs button click handler
     */
    function addSettingsBackgroundTabsButtonHandler() {
        $(document).on("click", ".settings-background-tab-button", function(e) {
            var $el = $(this);
            BRW_sendMessage({command: "changeSettingsBackgroundCurrentTab", tabid: $el.attr("data-settings-tabid")});
        });
    }

    /**
     * Add load more flixel content button handler
     */
    function addLoadMoreFlixelContentButtonHandler() {
        $("#load-more-flixel-content").on("click", loadMoreFlixelContentButtonHandler);
    }

    /**
     * Load more flixer content button handler
     */
    function loadMoreFlixelContentButtonHandler() {
        hideAllPageTooltips();
        if(getShareAppStatus()) {
            loadMoreFlixelContent($(this));
        } else {
            var $popup = $("#share-app-dialog");
            $popup.on('hide.bs.modal', function () {
                if(!getShareAppStatus())
                    BRW_sendMessage({command: "setShareAppStatus"});
                loadMoreFlixelContent($("#load-more-flixel-content"));
                var $shareTopContainer = $("#share42init-top");
                if(!$("#shareTopContainer").is(":visible"))
                    $shareTopContainer.fadeIn();
                if(!getShareGaEventStatus()) {
                    sendToGoogleAnalitic(function() {
                        ga('send', 'event', 'flixel', 'share', '', 0);
                    });
                    setShareGaEventStatus();
                }
            });
            $popup.modal();
        }
    }

    /**
     * Load more flixel content
     *
     * @param $button jQuery element
     */
    function loadMoreFlixelContent($button) {
         $button.off("click", loadMoreFlixelContentButtonHandler);
         
         var $icon = $button.find(".glyphicon");
         if($icon && !$icon.hasClass("rotating"))
         $icon.addClass("rotating");
         BRW_sendMessage({command: "loadMoreFlixelContentBackend"});
    }

    /**
     * Hide tooltip fix
     */
    function addTooltipsHideFix() {
        $(document).on("mouseleave", ".current-theme-download, .av-content-install, .av-content-restore", hideAllPageTooltips);
        $(document).on("mouseleave", ".installed-item-budge, .av-content-view, .load-more-flixel-content", hideAllPageTooltips);
        $(document).on("mouseleave", ".random-themes-display-label", hideAllPageTooltips)
                   .on("focusout"  , ".options-settings-random-themes-enable-notice", hideAllPageTooltips);
    }

    /**
     * Hide page all tooltips
     */
    function hideAllPageTooltips() {
        $('[data-toggle="tooltip"]').tooltip('hide');
    }
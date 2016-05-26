var relaxBtnTimeOut;

/**
 * Get background image
 *
 * @param callback Function
 * @param data Object
 */

/*
$(function(){
    BRW_langLoaded(function(){BRW_getFileSystem(function(){
    });});
});
*/


function getBackgroundImage(callback, data) {
    BRW_langLoaded(function(){BRW_getFileSystem(function(){
        
        BRW_sendMessage({command: "getBackgroundImage"}, function(response) {
            //console.log("Message getBackgroundImage, callback >>>", response);

            if(typeof (response.video) != "undefined" && response.video) {
                updatePageBackgroundVideo(response);
            } else if(typeof (response.image) != "undefined" && response.image) {
                updatePageBackgroundImage(response);
            }

            if(callback) 
                callback(data);

            displayPageHeader(response);//Moved under callback
        });
        
    });});
}

/**
 * Display page footer
 *
 * @param response Object
 */
function displayPageFooter(response) { 
    var $footer = $("#footer");
    var $footerLinksBlock = $footer.find("#footer-links-list-block");

    if(!$footer.is(":visible")) {

        if(!getDisplayTodoDialPanel() && !getDisplaySpeedDialPanel()) {
            $footer.addClass("footer-settings-only");
        } else if(!getDisplaySpeedDialPanel()) {
            $footer.addClass("footer-speed-dial-link-hide");
        } else if(!getDisplayTodoDialPanel()) {
            $footer.addClass("footer-todo-link-hide");
        }

        if(response.displayDials) {
            var $footerVisibleDials = $("<a></a>");
            var footerVisibleDialsText = response.visibleDials ? translate("page_footer_visible_dials_link_off") : translate("page_footer_visible_dials_link_on");
            $footerVisibleDials.attr("id", "footer-visible-dials");
            $footerVisibleDials.addClass("footer-visible-dials");
            $footerVisibleDials.text(footerVisibleDialsText);
            setTimeout(function() {
                $footerVisibleDials.on("click", dialsPanelVisibleChange);
            }, 1500);
            $footerLinksBlock.append($footerVisibleDials);
        }

        getApplicationNewtabRatingModal(function(alreadyCloseModal) { // get rate modal window already show
            if(!alreadyCloseModal) {
                getApplicationRating(function(rating) { // get current application rating
                    if(!rating) {
                        getApplicationRatingShowStartTime(function(showTime) {
                            var currentTime = new Date().getTime();
                            if(currentTime > showTime) {
                                var $footerRateUs = $("<a></a>");
                                $footerRateUs.attr("id", "footer-rate-us");
                                $footerRateUs.addClass("footer-rate-us");
                                $footerRateUs.addClass("footer-settings-link");
                                var $footerRateUsImg = $("<img>");
                                $footerRateUsImg.attr("src", extensionGetUrl("/pages/newtab/css/img/buttons/rate/star.png"));
                                $footerRateUs.html($footerRateUsImg);
                                $footerRateUs.html($footerRateUs.html() + translate("page_footer_rate_us"));
                                $footerRateUs.on("click", rateUsVisibleChange);
                                $footerLinksBlock.append($footerRateUs);
                            }
                        });
                    }
                });
            }
        });

        toggleFooterLinksColor((typeof (response.image) != "undefined" && response.image) ||
            (typeof (response.video) != "undefined" && response.video));

        if(!$footer.is(":visible")) {
            var $toggleFooterLinksBtn = $("#footer-links-display-block");
            var toggleFooterLinksBtnTitle;
            if(getFooterLinksBlockDisplay()) {
                toggleFooterLinksBtnTitle = translate("page_footer_toggle_display_links_title_hide");
                $toggleFooterLinksBtn.attr("data-toggle", "tooltip");
                var $footerLinksListBlock = $("#footer-links-list-block");
                $footerLinksListBlock.addClass("footer-links-list-block-show");
            } else {
                toggleFooterLinksBtnTitle = translate("page_footer_toggle_display_links_title_show");
            }
            $toggleFooterLinksBtn.on("mouseleave", function() {
                $(this).tooltip('hide');
            });
            $toggleFooterLinksBtn.on("focusout", function() {
                $(this).tooltip('hide');
            });
            $toggleFooterLinksBtn.tooltip({"placement" : "top", "title" : toggleFooterLinksBtnTitle});
            $footer.find("#footer-toggle-display-links").on("click", function(e) {
                e.preventDefault();
                var $toggleFooterLinksBtn = $("#footer-links-display-block");
                var $footerLinksListBlock = $("#footer-links-list-block");
                var footerLinksListBlockIsVisible = $footerLinksListBlock.hasClass("footer-links-list-block-show");
                var toggleFooterLinksBtnTitle;
                if(footerLinksListBlockIsVisible) {
                    $footerLinksListBlock.removeClass("footer-links-list-block-show");
                    toggleFooterLinksBtnTitle = translate("page_footer_toggle_display_links_title_show");
                } else {
                    $footerLinksListBlock.addClass("footer-links-list-block-show");
                    toggleFooterLinksBtnTitle = translate("page_footer_toggle_display_links_title_hide");
                }
                $toggleFooterLinksBtn.attr("title", toggleFooterLinksBtnTitle);
                $toggleFooterLinksBtn.tooltip('hide').tooltip('fixTitle');
                BRW_sendMessage({command: "setFooterLinksBlockDisplay", val: !footerLinksListBlockIsVisible, tab: newtabPageTabId});
            });
            $footer.find("#footer-settings-link").on("click", function(e) {
                e.preventDefault();
                var url = extensionGetUrl("/pages/options/settings.html");
                
                var event = window.event || e;//Firefox
                
                if(event.ctrlKey || e.which == 2)//if(window.event.ctrlKey || e.which == 2)
                    openUrlInNewTab(url);
                else
                    openUrlInCurrentTab(url);
            });
            $footer.find("#footer-themes-link").on("click", function(e) {
                e.preventDefault();
                var url = extensionGetUrl("/pages/options/options.html");
               
                var event = window.event || e;//Firefox
                
                if(event.ctrlKey || e.which == 2)//if(window.event.ctrlKey || e.which == 2)
                    openUrlInNewTab(url);
                else
                    openUrlInCurrentTab(url);
            });

            var minBottomPanelOpacity = getBottomPanelOpacity();
            var maxBottomPanelOpacity = getMaxBottomPanelOpacity();
            var toggleOpacitySpeed = 500;
            var displayPageSpeed = 750;

            setTimeout(function() {
                $footer.on("focusin", function(){
                    $(this).animate({"opacity" : maxBottomPanelOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                });
                $footer.on("focusout", function(){
                    if(!$(this).is(":hover"))
                        $(this).animate({"opacity" : minBottomPanelOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                });
                $footer.hover(function(){
                    $(this).animate({"opacity" : maxBottomPanelOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                }, function() {
                    if(!$("#search-input").is(":focus"))
                        $(this).animate({"opacity" : minBottomPanelOpacity}, {"duration" : toggleOpacitySpeed, "queue" : false});
                });

                if(!$footer.is(":hover"))
                    $footer.animate({"opacity" : minBottomPanelOpacity}, 2000);
            }, 3000);

            $footer.css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : maxBottomPanelOpacity}, displayPageSpeed);

        }
    }

    displayPageRelax(response);//displayPageFooterDescription(response);//porting
}

/**
 * Display page relax block
 *
 * @param response Object
 */
function displayPageRelax(response) {
    if(getDisplayRelax()) {
        var $relax = $("#relax");
        var $startRelaxBtn = $relax.find("#relax-start-btn");
        if(!$startRelaxBtn.is(":visible")) {
            var $toggleRelaxBtn = $relax.find("button");
            $startRelaxBtn.attr("title", translate("page_relax_start_title"));
            $startRelaxBtn.attr("data-toggle", "tooltip");
            var $stopRelaxBtn = $relax.find("#relax-done-btn");

            $startRelaxBtn.on("mouseleave", function() {
                $(this).tooltip('hide');
            });
            $startRelaxBtn.on("focusout", function() {
                $(this).tooltip('hide');
            });
            $startRelaxBtn.tooltip({"placement" : "top", "delay": {show: 600}});

            var $relaxItems;
            var $relaxItemsSelector = "#mv-container, #header, #header-weather, #footer-description, #todo-container, #footer, #tou, #sidebar-wrap";
            var displayPageSpeed = 1500;

            $startRelaxBtn.on("click", function(e) {
                e.preventDefault();
                var relaxModeDisableState = getRelaxModalDisable();
                $toggleRelaxBtn.tooltip('hide');

                var $startRelaxBtn = $("#relax-start-btn");
                disableRelaxBtnHoverEffect($toggleRelaxBtn);
                $startRelaxBtn.hide();

                if(relaxModeDisableState) {
                    var $stopRelaxBtn = $("#relax-done-btn");
                    $stopRelaxBtn.stop().css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : 0.75}, {"duration" : 400, "queue" : false});
                    if(relaxBtnTimeOut)
                        clearTimeout(relaxBtnTimeOut);
                    relaxBtnTimeOut = setTimeout(function() {
                        var $stopRelaxBtn = $("#relax-done-btn");
                        if(!$stopRelaxBtn.is(":hover"))
                            $stopRelaxBtn.animate({"opacity" : 0}, {"duration" : 1000, "queue" : false});
                    }, 2000);
                    enableRelaxBtnHoverEffect($stopRelaxBtn);
                }

                $relaxItems = $($relaxItemsSelector);
                $relaxItems.each(function() {
                    var $el = $(this);
                    if(!$el.hasClass("item-relax-mode") && $el.is(":visible"))
                        $el.addClass("item-relax-mode");
                });
                sendToGoogleAnalitic(function() {
                    ga('send', 'event', 'relax', 'click');
                });

                if(relaxModeDisableState) {
                    startRelaxMode();
                } else {
                    var $modal = $('#relax-modal-content');
                    $modal.modal();
                }
            });

            $stopRelaxBtn.on("click", function(e) {
                e.preventDefault();
                $toggleRelaxBtn.tooltip('hide');

                var $startRelaxBtn = $("#relax-start-btn");
                var $stopRelaxBtn = $("#relax-done-btn");

                disableRelaxBtnHoverEffect($toggleRelaxBtn);
                $stopRelaxBtn.hide();
                $startRelaxBtn.stop().css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : 0.75}, {"duration" : 400, "queue" : false});

                if(relaxBtnTimeOut)
                    clearTimeout(relaxBtnTimeOut);
                relaxBtnTimeOut = setTimeout(function() {
                    var $startRelaxBtn = $("#relax-start-btn");
                    if(!$startRelaxBtn.is(":hover"))
                        $startRelaxBtn.animate({"opacity" : 0}, {"duration" : 1000, "queue" : false});
                }, 2000);
                enableRelaxBtnHoverEffect($startRelaxBtn);

                $relaxItems.each(function() {
                    var $el = $(this);
                    if($el.hasClass("item-relax-mode"))
                        $el.removeClass("item-relax-mode");
                });
                stopRelaxMode();
            });

            disableRelaxBtnHoverEffect($toggleRelaxBtn);
            enableRelaxBtnHoverEffect($startRelaxBtn, 3000);

            setTimeout(function() {
                if(!$startRelaxBtn.is(":hover"))
                    $startRelaxBtn.animate({"opacity" : 0}, {"duration" : 2000, "queue" : false});
            }, 3000);

            $startRelaxBtn.css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : 0.75}, displayPageSpeed);
        }
    }
    displayPageFooterDescription(response);
}

/**
 * Relax mode show current button
 */
function relaxModeShowCurrentButton() {
    var $stopRelaxBtn = $("#relax-done-btn");
    $stopRelaxBtn.stop().css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : 0.75}, {"duration" : 400, "queue" : false});
    if(relaxBtnTimeOut)
        clearTimeout(relaxBtnTimeOut);
    relaxBtnTimeOut = setTimeout(function() {
        if(!$stopRelaxBtn.is(":hover"))
            $stopRelaxBtn.animate({"opacity" : 0}, {"duration" : 1000, "queue" : false});
    }, 2000);
}

/**
 * Enable relax buttons hover effect
 *
 * @param $btn jQuery element
 * @param time Number
 */
function enableRelaxBtnHoverEffect($btn, time) {
    setTimeout(function() {
        $btn.off("mouseenter", relaxBtnHoverEffectEnter).on("mouseenter", relaxBtnHoverEffectEnter);
        $btn.off("mouseleave", relaxBtnHoverEffectLeave).on("mouseleave", relaxBtnHoverEffectLeave);
    }, time || 2000);
}

/**
 * Relax buttons hover effect enter
 */
function relaxBtnHoverEffectEnter() {
    $(this).stop().animate({"opacity" : 0.75}, {"duration" : 750, "queue" : false});
}

/**
 * Relax buttons hover effect leave
 */
function relaxBtnHoverEffectLeave() {
    $(this).stop().animate({"opacity" : 0}, {"duration" : 750, "queue" : false});
}

/**
 * Disable relax buttons hover effect
 *
 * @param $btn jQuery element
 */
function disableRelaxBtnHoverEffect($btn) {
    $btn.off('mouseenter', relaxBtnHoverEffectEnter).off("mouseleave", relaxBtnHoverEffectLeave);
}

/**
 * Display page footer description
 *
 * @param response Object
 */
function displayPageFooterDescription(response) { 
    
    
    
    var $footerDescription = $("#footer-description");
    if(!$footerDescription.is(":visible")) {
        toggleTouLinksColor((typeof (response.image) != "undefined" && response.image) ||
            (typeof (response.video) != "undefined" && response.video));
        if (!getWelcomePageState()) {
            $(document).on("click", "#footer-description-close", function () {
                changeWelcomePageState();
                $("#footer-description").fadeOut(750);
            });
            setTimeout(function () {
                $footerDescription.fadeIn(750);
            }, 2500);
        }
    }
    displayTermsOfUse(response);
}

/**
 * Display page dials notice
 *
 * @param response Object
 */
function addPageDialsNoticeCloseHandler(response) { 
    
    
    
    $(document).on("click", "#dials-notification-message-close", function () {
        changeDialsNoticeHideState();
        var $popup = $("#dials-notifications");
        if($popup.is(":visible")) {
            if(displayPopupTimeOut) clearTimeout(displayPopupTimeOut);
            $popup.fadeOut(displayPopupTimeOut);
        }
    });
}

/**
 * Display application terms of use
 *
 * @param response Object
 */
function displayTermsOfUse(response) { 
    
    
    
    var $tou = $("#tou");
    if(!$tou.is(":visible")) {
        setTimeout(function() {
            $tou.fadeIn(750);
        }, 250);
    }
    displayTodoLink(response);
}

/**
 * Toggle footer links color
 *
 * @param lightTheme Bool
 */
function toggleFooterLinksColor(lightTheme) { 
    
    
    var lightThemeClass = "footer-settings-link";
    var darkThemeClass = "footer-settings-link-dark";
    var footerClass = lightTheme ? lightThemeClass : darkThemeClass;
    var $footer = $("#footer");
    var footerLinks = $footer.find("a");
    if(lightTheme) {
        if(!footerLinks.hasClass(lightThemeClass))
            footerLinks.removeClass(darkThemeClass).addClass(lightThemeClass);
    }
    else {
        if(!footerLinks.hasClass(darkThemeClass))
            footerLinks.removeClass(lightThemeClass).addClass(darkThemeClass);
    }
    footerLinks.addClass(footerClass);
}

/**
 * Display page header
 *
 * @param response Object
 */
function displayPageHeader(response) { 
    
    
    
    var $header = $("#header");
    if(!$header.is(":visible")) {
        toggleHeaderLinksColor((typeof (response.image) != "undefined" && response.image) ||
                               (typeof (response.video) != "undefined" && response.video));

        getDisplayAppsLink(function(display) {
            if(display) {
                var $headerApps = $("<a></a>");
                $headerApps.attr("id", "header-settings-link");
                $headerApps.attr("tabindex", "-1");
                $headerApps.addClass("header-apps");
                $headerApps.addClass("header-settings-link");
                $headerApps.attr("href", "chrome://apps/");
                $headerApps.off("click", onOpenAppsPageClick).on("click", onOpenAppsPageClick);

                var $headerAppsImg = $("<img>");
                $headerAppsImg.attr("id", "page-header-links-apps-img");
                $headerAppsImg.attr("src", extensionGetUrl("/pages/newtab/css/img/buttons/background/apps.png"));
                $headerAppsImg.attr("title", translate("page_header_links_apps_img"));

                var $headerAppsText = $("<span></span>");
                $headerAppsText.attr("id", "page-header-links-apps");
                $headerAppsText.text(translate("page_header_links_apps"));

                $headerApps.append($headerAppsImg).append($headerAppsText);
                $header.append($headerApps);
            }
        });

        getBookmarksDisable(function(disable) { // get current application bookmarks disable status
            if (!disable) {
                var $headerBookmarks = $("<a></a>");
                $headerBookmarks.attr("id", "header-bookmarks");
                $headerBookmarks.attr("tabindex", "-1");
                $headerBookmarks.addClass("header-bookmarks");
                $headerBookmarks.addClass("header-settings-link");
                $headerBookmarks.html($headerBookmarks.html() + translate("page_header_bookmarks"));
                $headerBookmarks.on("click", bookmarksVisibleChange);
                $header.append($headerBookmarks);
            }
        });

        setTimeout(function() {
            $header.fadeIn(750);
        }, 250);
    }
    displayPageFooter(response);
}

/**
 * Open applications page click handler
 *
 * @param e Event
 */
function onOpenAppsPageClick(e) { 
    
    
    var url = 'chrome://apps/';
    var event = window.event || e;//Firefox

    if(event.ctrlKey || e.which == 2)//if(window.event.ctrlKey || e.which == 2)
        openUrlInNewTab(url);
    else
        openUrlInCurrentTab(url);
}

/**
 * Toggle header links color
 *
 * @param lightTheme Bool
 */
function toggleHeaderLinksColor(lightTheme) { 
    
    
    var lightThemeClass = "header-settings-link";
    var darkThemeClass = "header-settings-link-dark";
    var headerClass = lightTheme ? lightThemeClass : darkThemeClass;
    var $header = $("#header");
    var $headerLinks = $header.find("a");
    if(lightTheme) {
        if(!$headerLinks.hasClass(lightThemeClass))
            $headerLinks.removeClass(darkThemeClass).addClass(lightThemeClass);
    }
    else {
        if(!$headerLinks.hasClass(darkThemeClass))
            $headerLinks.removeClass(lightThemeClass).addClass(darkThemeClass);
    }
    $headerLinks.addClass(headerClass);
}

/**
 * Toggle terms of use links color
 *
 * @param lightTheme Bool
 */
function toggleTouLinksColor(lightTheme) { 
    
    
    var lightThemeClass = "tou-link";
    var darkThemeClass = "tou-link-dark";
    var headerClass = lightTheme ? lightThemeClass : darkThemeClass;
    var $header = $("#tou");
    var $headerLinks = $header.find("a");
    if(lightTheme) {
        if(!$headerLinks.hasClass(lightThemeClass))
            $headerLinks.removeClass(darkThemeClass).addClass(lightThemeClass);
    }
    else {
        if(!$headerLinks.hasClass(darkThemeClass))
            $headerLinks.removeClass(lightThemeClass).addClass(darkThemeClass);
    }
    $headerLinks.addClass(headerClass);
}

/**
 * Update page background image
 *
 * @param data Object
 */
function updatePageBackgroundVideo(data) {
    var $body = $("body");
    if(!$body.hasClass("dark-background"))
        $body.addClass("dark-background");

    data.video = data.video ? data.video : "";
    var $videoContainer = $("#background-container");
    var $video = $("<video></video>");
    $video.attr("id", "background");
    $video.attr("autoplay", "autoplay");
    $video.attr("loop", "loop");
    $video.attr("src", data.video);
    $video.css({"opacity" : 0});
                                          
    $video.addClass("layer").attr("data-depth", 0.0065 * data.parallaxValue);
    $video.addClass("fill");
    $videoContainer/*.html("")*/.append($video);
    
    if(data.enableParallax) {
        $videoContainer.addClass("parallax");
        if(videoBgParallaxScene)
            videoBgParallaxScene.parallax('updateLayers');
        else
            videoBgParallaxScene = $videoContainer.parallax();
    } else {
        $videoContainer.addClass("static");
    }
    
    /*
    if(localStorage.getItem("firefox-background-video-poster-image")){//Firefox only
        
        fileStorage.getAttachment(
            localStorage.getItem("firefox-background-video-poster-folder"),
            localStorage.getItem("firefox-background-video-poster-image")
        ).then(function(blob){
            var posterURL = URL.createObjectURL(blob);
            
            //$video.attr("poster", posterURL);
            
            $videoContainer.append(
                $("<img/>", {src:posterURL}).addClass("fill").css({
                    'top'       : 0,
                    'left'      : 0,
                    "opacity"   : 0,
                    'width'     : '100%',
                    'z-index'   : '-1000',
                    'position'  : 'fixed',
                    'min-width' : localStorage.getItem("background-video-resolution"),
                })
            );
            
        });
    }//if
*/
    var $poweredLink = $("#powered-link");
    var $createdLink = $("#created-link");
    var $termsLink = $("#terms-link");
    var $privacyLink = $("#privacy-link");
    if(typeof (data['isFlixelVideoContent']) != "undefined" && data['isFlixelVideoContent']) {
        $poweredLink.css({"display" : "inline-block", "opacity" : 0.85});
        if(typeof (data['flixelVideoContentAuthor']) != "undefined" && data['flixelVideoContentAuthor'] != "undefined" && data['flixelVideoContentAuthor']) {
            $createdLink.css({"display" : "inline-block", "opacity" : 0.85});
            $createdLink.text(translate("page_created_link") + " " + data.flixelVideoContentAuthor);
            $createdLink.attr("href", getBackgroundVideoFlixelContentAuthorUrl(data.flixelVideoContentAuthor));
        }
    }
    $termsLink.css({"display" : "inline-block", "opacity" : 0.85});
    $privacyLink.css({"display" : "inline-block", "opacity" : 0.85});
    
    setTimeout(function() {
        var $poweredLink = $("#powered-link");
        var $createdLink = $("#created-link");
        var $termsLink = $("#terms-link");
        var $privacyLink = $("#privacy-link");
        var showTime = 750;
        var opacity = 0.35;
        $poweredLink.animate({ opacity: opacity }, showTime);
        $createdLink.animate({ opacity: opacity }, showTime);
        $termsLink.animate({ opacity: opacity }, showTime);
        $privacyLink.animate({ opacity: opacity }, showTime);
    }, 3500);

    themeVideoShow($video);
}

/**
 * Video show animation
 *
 * @param $video jQuery element
 * @param showTime Int
 */
function themeVideoShow($video, showTime) { 
    showTime = showTime || 300;
    $video.show();
                                           
    videoBackgroundForcePlay(document.getElementById("background"));//firefox
    
    setTimeout(function() {
        //alert('themeVideoShow opacity');
        $video.animate({ opacity: 1 }, showTime);
        $("#background-container img").animate({ opacity: 1 }, showTime);//firefox
        
        recalculateMediaSize();
    }, 200);
}

//firefox forced play stack video
function videoBackgroundForcePlay(video){
    //console.log("Video status: "+video.currentTime+" / "+video.duration);
    
    if(video.currentTime == 0){
        video.play();
        //video.playbackRate = 2;
    }
}

function removeCurrentThemeVideo() { 
    
    
    var $body = $("body");
    if($body.hasClass("dark-background"))
        $body.removeClass("dark-background");

    var $videoContainer = $("#background-container");
    $videoContainer.find("video").each(function() {
        $(this).hide().remove();
    });
}

/**
 * Update page background image
 *
 * @param data Object
 * @param callback Function
 */
function updatePageBackgroundImage(data, callback) { 
    
    
    
    var $body = $("body");
    if(!$body.hasClass("dark-background"))
        $body.addClass("dark-background");

    var $termsLink = $("#terms-link");
    var $privacyLink = $("#privacy-link");
    $termsLink.css({"display" : "inline-block", "opacity" : 0.85});
    $privacyLink.css({"display" : "inline-block", "opacity" : 0.85});
    setTimeout(function() {
        var $termsLink = $("#terms-link");
        var $privacyLink = $("#privacy-link");
        var showTime = 750;
        var opacity = 0.35;
        $termsLink.animate({ opacity: opacity }, showTime);
        $privacyLink.animate({ opacity: opacity }, showTime);
    }, 3500);

    if(data.enableParallax) {
        data.image = data.image ? data.image : "";
        var $imageContainer = $("#background-image-container");
        var $image = $("<img/>");
        $image.attr("id", "background-image");
        $image.attr("src", data.image);
        $image.css({"opacity" : 0});
        $image.addClass("layer").attr("data-depth", 0.0065 * data.parallaxValue);
        $image.addClass("fill");
        $imageContainer.html("").append($image);
        if(data.enableParallax) {
            $imageContainer.addClass("parallax");
            if(imageBgParallaxScene)
                imageBgParallaxScene.parallax('updateLayers');
            else
                imageBgParallaxScene = $imageContainer.parallax();
        } else {
            $imageContainer.addClass("static");
        }
        themeImageShow($image);
    } else {
         data.image = data.image ? data.image + "?d=" + new Date().getTime() : "";
         $(document.documentElement).css({
             "background-image" : "url("+ data.image.replace( "(", "\\(" ).replace( ")", "\\)" ) +")",
             "background-position" : "center center",
             "background-size" : "cover",
             "background-repeat" : "no-repeat",
             "background-attachment" : "fixed"
         });

         $("#squaresLoadingProgress").text(0);
         setTimeout(function() {
         if(typeof (callback) != "undefined")
            callback(data);
         }, 250);
    }

}

/**
 * Image show animation
 *
 * @param $image jQuery element
 * @param showTime Int
 */
function themeImageShow($image, showTime) { 
    
    
    showTime = showTime || 300;
    $image.show(0);
    setTimeout(function() {
        recalculateMediaSize();
        $image.animate({ opacity: 1 }, showTime);
    }, 200);
}

/**
 * Get media scale size
 *
 * @param boxWidth Int
 * @param boxHeight Int
 * @param imgWidth Int
 * @param imgHeight Int
 * @returns {{width: *, height: (number|*)}}
 */
function getMediaScaleSize(boxWidth, boxHeight, imgWidth, imgHeight) {// 
    //
    
    var ratio = imgHeight / imgWidth;
    imgWidth = boxWidth;
    imgHeight = boxWidth * ratio;
    if (imgHeight < boxHeight) {
        imgHeight = boxHeight;
        imgWidth = imgHeight / ratio;
    }
    return {
        "width": imgWidth,
        "height": imgHeight
    };
}

/**
 * Recalculate media size
 */
var consoleRecalculateMediaSize = 0;
function recalculateMediaSize() {
    if(!consoleRecalculateMediaSize++) 
    
    var isParallax = getDisplayParallaxVideoTheme();
    var isVideoTheme = getBackgroundVideoFile() && getDisplayVideoTheme();

    var browserHeight = Math.round($(window).height());
    if(isVideoTheme) {
        if(isParallax)
            browserHeight = parseInt(browserHeight * 1.2);
        else
            browserHeight += 40;
    }

    var browserWidth = Math.round($(window).width());
    if(isVideoTheme) {
        if(isParallax)
            browserWidth = parseInt(browserWidth * 1.2);
        else
            browserWidth += 30;
    }

    var fills = $('.fill');
    fills.each(function () {
        var mediaWidth = $(this).width();
        var mediaHeight = $(this).height();

        if(mediaWidth <= 300 && mediaHeight <= 150) {
            mediaWidth = 1920;
            mediaHeight = 1080;
        }

        var newSize = getMediaScaleSize(browserWidth, browserHeight, mediaWidth, mediaHeight);
        $(this).width(newSize.width).height(newSize.height)
            .css("margin-left", ((browserWidth - newSize.width)/2))
            .css("margin-top", ((browserHeight - newSize.height)/2));
    });
}

/**
 * Change window size handler
 */
$(function() {
    $(window).resize(function() {
        recalculateMediaSize();
    });
});

/**
 * Display loading video theme error
 *
 * @param message Object
 */
function displayLoadingVideoThemeError(message) { 
    
    
    var $popup = $("#popupDownloadVideoThemeOverlay");
    var $buttons = $popup.find(".control-buttons");

    var $progress = $(".squaresLoadingProgress");
    var $error = $(".squaresLoadingError");
    if($progress.is(":visible"))
        $progress.hide();
    if(!$error.is(":visible"))
        $error.show();
    $error.find("#squaresLoadingError").text(message.errorMessage);

    if(!$buttons.is(":visible")) {
        getPageCloseVideoPopupEl().on("click", themeVideoOfferPopupCloseHandler);
        $buttons.slideDown(250);
    }
}

/**
 * Display loading video theme progress
 *
 * @param message Object
 */
function displayLoadingVideoThemeProgress(message) { 
    var $popup = $("#popupDownloadVideoThemeOverlay");

    var $buttons = $popup.find(".control-buttons");
    if($buttons.is(":visible")) {
        getPageCloseVideoPopupEl().off("click", themeVideoOfferPopupCloseHandler);
        $buttons.hide();
    }

    var currentOpacity = $popup.css("opacity");
    if(currentOpacity)
        updateLoadingVideoThemeProgress(message.percentComplete);
}

/**
 * Update loading video theme progress
 *
 * @param progress Int
 */
function updateLoadingVideoThemeProgress(progress) { 
    
    
    var $popup = $("#popupDownloadVideoThemeOverlay");
    var $loading = $popup.find(".loading");
    var $progress = $(".squaresLoadingProgress");
    var $error = $(".squaresLoadingError");
    if($error.is(":visible"))
        $error.hide();
    if(!$loading.is(":visible"))
        $loading.show();
    if(!$progress.is(":visible"))
        $progress.show();

    $progress.find("#squaresLoadingProgress").text(progress);
}

/**
 * Display loaded background video theme
 *
 * @param message Object
 */
function displayLoadedBackgroundVideoTheme(message) { 
    
    
    $("#squaresLoadingProgress").text(100);
    var popup = $("#popupDownloadVideoThemeOverlay");
    var currentOpacity = popup.css("opacity");
    if(currentOpacity)
        themeVideoHidePopup(popup, function(popup) {
            popup.hide();
        });

    if(message.display)
        updatePageBackgroundVideo(message);
}

/**
 * Display loading image theme error
 *
 * @param message Object
 */
function displayLoadingImageThemeError(message) { 
    
    
    var $popup = $("#popupDownloadImageTheme");
    var currentOpacity = $popup.css("opacity");
    if(currentOpacity) {
        var $progress = $(".circleLoadingProgress");
        var $error = $(".circleLoadingError");
        if($progress.is(":visible"))
            $progress.hide();
        if(!$error.is(":visible"))
            $error.show();
        $error.find("#circleLoadingError").text(message.errorMessage);
        setTimeout(function() {
            $popup.fadeOut(500, function() {
                $("#circleLoadingProgress").text(0);
            });
        }, 1500);
    }
}

/**
 * Display loading image theme progress
 *
 * @param message Object
 */
function displayLoadingImageThemeProgress(message) { 
    
    
    var $popup = $("#popupDownloadImageTheme");
    if(!$popup.is(":visible"))
        $popup.show();
    updateLoadingImageThemeProgress(message.percentComplete);
}

/**
 * Update loading image theme progress
 *
 * @param progress Int
 */
function updateLoadingImageThemeProgress(progress) { 
    
    
    var $progress = $(".circleLoadingProgress");
    var $error = $(".circleLoadingError");
    if($error.is(":visible"))
        $error.hide();
    if(!$progress.is(":visible"))
        $progress.show();
    $progress.find("#circleLoadingProgress").text(progress);
}

/**
 * Display loaded background video theme
 *
 * @param message Object
 */
function displayLoadedBackgroundImageTheme(message) { 
    
    
    $("#circleLoadingProgress").text(100);
    var $popup = $("#popupDownloadImageTheme");
    $popup.fadeOut(500, function() {
        $("#circleLoadingProgress").text(0);
    });
    removeCurrentThemeVideo();
    updatePageBackgroundImage(message);
    displayPageHeader(message);
}

/**
 * Hide theme video download offer
 *
 * @param message
 */
function hideThemeVideoDownloadOffer(message) { 
    
    themeVideoOfferPopupCloseHandler();
}
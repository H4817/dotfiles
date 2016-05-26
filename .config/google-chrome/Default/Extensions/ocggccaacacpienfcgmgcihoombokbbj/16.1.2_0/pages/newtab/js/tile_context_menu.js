/**
 * Reload dial thumb
 *
 * @param $el jQuery element
 * @param action String
 * @param thumbType Int
 */
function reloadDialThumb($el, action, thumbType) { 
    if ($el) {
        if ($el.hasClass("mv-settings"))
            $el = $el.closest(".mv-tile");
        $el.blur();
        var dialId = $el.attr("data-dialId");
        var groupId = $el.attr("data-groupId");
        var mvUrl = $el.attr("href");
        var mvTitle = $el.attr("title");
        var mvItem = {
            "url": mvUrl,
            "title": mvTitle,
            "thumbType": thumbType,
            "dialId" : dialId,
            "groupId" : groupId
        };
        BRW_sendMessage({
            "command": action,
            "tile": mvItem
        });
        var $tileBody = $el.find(".mv-thumb");
        if ($tileBody) {
            $tileBody.fadeOut(350, function () {
                var $thumb = $(this);
                $thumb.html('');
                $thumb.addClass("mv-thumb-loading");
                $thumb.removeClass("mv-thumb-image").removeClass("mv-thumb-live");
                var $thumbImg = $("<div></div>");
                var loadingImg = extensionGetUrl("pages/newtab/css/img/buttons/tiles/loading.gif");
                $thumbImg.css({"background": "url('" + loadingImg + "') 50% 50% no-repeat"});
                $thumbImg.addClass("thumbnail").addClass("thumbnail-loading");
                $thumb.append($thumbImg);
                $thumb.fadeIn(350);
            });
        }
    }
}

/**
 * Refresh dial thumb
 *
 * @param $el jQuery element
 * @param action String
 */
function refreshDialThumb($el, action) { 
    if ($el) {
        if ($el.hasClass("mv-settings"))
            $el = $el.closest(".mv-tile");
        $el.blur();
        var mvUrl = $el.attr("href");
        var mvTitle = $el.attr("title");
        var mvDialId = $el.attr("data-dialId");
        var mvItem = {
            "url": mvUrl,
            "title": mvTitle,
            "dialId" : mvDialId
        };
        BRW_sendMessage({
            "command": action,
            "tiles": [mvItem]
        });
        var $tileBody = $el.find(".mv-thumb");
        if ($tileBody) {
            $tileBody.fadeOut(350, function () {
                var $thumb = $(this);
                $thumb.html('');
                $thumb.addClass("mv-thumb-loading");
                $thumb.removeClass("mv-thumb-image").removeClass("mv-thumb-live");
                var loadingImg = extensionGetUrl("pages/newtab/css/img/buttons/tiles/loading.gif");
                var $thumbImg = $("<div></div>");
                $thumbImg.css({"background": "url('" + loadingImg + "') 50% 50% no-repeat"});
                $thumbImg.addClass("thumbnail").addClass("thumbnail-loading");
                $thumb.append($thumbImg);
                $thumb.fadeIn(350);
            });
        }
    }
}

/**
 * Edit dial item
 *
 * @param $el jQuery element
 */
function editDialItem($el) { 
    if($el && $el.hasClass("mv-settings"))
        $el = $el.closest(".mv-tile");
    if ($el) {
        var $link = $el.closest(".mv-tile");
        var groupId = $link.attr("data-groupId");
        var dialId = $link.attr("data-dialId");
        var url = $link.attr("href");
        var title = $link.find(".mv-title").text();
        if(dialId && groupId) {
            var $modal = $("#add-new-dial-dialog");
            var $modalTitle = $modal.find("#add-new-dial-dialog-title");
            var $form = $modal.find("#add-new-dial-form");
            
            if($form) {
                $modalTitle.text(translate("edit_dial_dialog_title"));
                var $url = $("#newDialUrl");
                var $title = $("#newDialTitle");
                var $group = $("#newDialGroup");

                $form.attr("data-edit-dial-groupId", groupId);
                $form.attr("data-edit-dial-dialId", dialId);
                if(!$form.hasClass("edit-dial-dialog"))
                    $form.addClass("edit-dial-dialog");

                $url.val(url);
                $title.val(title);
                $group.val(groupId);

                $modal.modal();
            }
        }
    }
}

/**
 * Copy dial url
 *
 * @param $el jQuery element
 */
function copyDialUrl($el) { 
    if ($el) {
        if ($el.hasClass("mv-settings"))
            $el = $el.closest(".mv-tile");
        $el.blur();
        var $clipboardholder = $("<textarea></textarea>");
        $clipboardholder.css({"width": 0, "height": 0, "opacity": 0});
        $('body').append($clipboardholder);
        $clipboardholder.val($el.attr("href"));
        var clipboardholder = $clipboardholder[0];
        clipboardholder.select();
        document.execCommand("Copy");
        $clipboardholder.remove();
    }
}

/**
 * Hide dial item
 *
 * @param $el jQuery element
 */
function hideDialItem($el) { 
    if ($el) {
        if ($el.hasClass("mv-settings"))
            $el = $el.closest(".mv-tile");
        deleteHistoryItemHandler($el.find(".mv-close"));
    }
}

/**
 * Open dial url
 *
 * @param $el jQuery element
 * @param openType Int
 */
function openDialUrl($el, openType) { 
    if ($el) {
        if ($el.hasClass("mv-settings"))
            $el = $el.closest(".mv-tile");
        $el.blur();
        var mvUrl = $el.attr("href");
        sendToGoogleAnalitic(function () {
            ga('send', 'event', 'dial', 'click');
        });
        BRW_sendMessage({"command": "openContextSelectedDialUrl", "url": mvUrl, "openType": openType});
    }
}

/**
 * Get tile context menu items
 *
 * @param showEditItem Bool
 * @returns {{items: *[]}}
 */
function getTileContextMenuItems(showEditItem) { 
    var alias = showEditItem ? "dialCmRoot" : "tileCmRoot";
    var items = [];
    items.push({
        text: translate("page_dial_context_menu_open_current_thumb"),
        alias: "openCurrentTab",
        action: function (el) {
            openDialUrl($(el), openCurrentTab);
        }
    });
    items.push({
        text: translate("page_dial_context_menu_open_new_thumb"), alias: "openNewTab", action: function (el) {
            openDialUrl($(el), openNewTab);
        }
    });
    items.push({
        text: translate("page_dial_context_menu_open_background_thumb"),
        alias: "openBackgroundTab",
        action: function (el) {
            openDialUrl($(el), openBackgroundTab);
        }
    });
    items.push({type: "splitLine"});
    items.push({
        text: translate("page_dial_context_menu_text_thumb"), alias: "showDialTextThumb", action: function (el) {
            reloadDialThumb($(el), "showDialTextThumb", showDialTextThumb);
        }
    });
    items.push({
        text: translate("page_dial_context_menu_gallery_thumb"),
        alias: "showDialGalleryThumb",
        action: function (el) {
            reloadDialThumb($(el), "showDialGalleryThumb", showDialGalleryThumb);
        }
    });
    items.push({
        text: translate("page_dial_context_menu_screen_thumb"),
        alias: "showDialScreenThumb",
        action: function (el) {
            reloadDialThumb($(el), "showDialScreenThumb", showDialScreenThumb);
        }
    });
    items.push({type: "splitLine"});
    items.push({
            text: translate("page_dial_context_menu_refresh_dial"), alias: "refreshDialThumb", action: function (el) {
            refreshDialThumb($(el), "thumbLoad");
        }
    });
    if(showEditItem) {
        items.push({
            text: translate("page_dial_context_menu_edit_dial"), alias: "editDialData", action: function (el) {
                editDialItem($(el));
            }
        });
    }
    items.push({
        text: translate("page_dial_context_menu_copy_url_dial"), alias: "copyDialUrl", action: function (el) {
            copyDialUrl($(el));
        }
    });
    items.push({type: "splitLine"});
    items.push({
        text: translate("page_dial_context_menu_delete_dial"), alias: "deleteDialData", action: function (el) {
            hideDialItem($(el));
        }
    });
    return {items: items, alias: alias};
}

/**
 * Init dial context menu
 *
 * @param group Object
 * @return jQuery element
 */
function initTilesContextMenu(group) { 
    var showEditItem = group && group.id != GROUP_POPULAR_ID ? true : false;
    var option = getTileContextMenuItems(showEditItem);
    $(".mv-tile").contextmenu(option)
    option['eventName'] = "click";
    $(".mv-settings").contextmenu(option);
    $(".mv-tiles .mv-new-dial").on('contextmenu', function(e) {
        return false;
    });

    var $contextMenu = $("#tileCmRoot, #dialCmRoot");
    $("body").off("mouseleave").on({
        "mouseleave" : function() {
            if($contextMenu.is(":visible"))
                $contextMenu.hide();
            $(".mv-tile").blur();
        }
    });

    return $contextMenu;
}

/**
 * Add context menu to tile element
 *
 * @param $el jQuery element
 * @return jQuery element
 */
function addContextMenuToTileElement($el) { 
    var showEditItem = true;
    var option = getTileContextMenuItems(showEditItem);
    $el.contextmenu(option);
    var $contextMenuContainer = $el.find(".mv-settings");
    if($contextMenuContainer) {
        option['eventName'] = "click";
        $contextMenuContainer.contextmenu(option);
    }
    return $el;
}
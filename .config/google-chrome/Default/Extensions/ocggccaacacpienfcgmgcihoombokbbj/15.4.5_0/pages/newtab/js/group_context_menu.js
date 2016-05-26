/**
 * Hide group item
 *
 * @param $el jQuery element
 */
function hideGroupItem($el) { 
    if($el && $el.hasClass("group-context-menu-container"))
        $el = $el.closest(".sidebar-group-item");
    if ($el) {
        var groupId = $el.attr("data-group");
        if(groupId) {
            BRW_sendMessage({"command": "getGroupDialsCount", "groupId" : groupId, "collectGroups" : collectCurrentDirectoryGroups()}, function(data) {
                if(data && typeof(data.dialsCount) != "undefined") {
                    if(data.dialsCount) {
                        var $modal = $("#delete-group-dialog");
                        var $deleteInput = $modal.find("#deleteGroupId");
                        $deleteInput.val(groupId);
                        $modal.modal();
                    } else
                        deleteGroupConfirm($el);
                }
            });
        }
    }
}

/**
 * Edit group item
 *
 * @param $el jQuery element
 */
function editGroupItem($el) { 
    if($el && $el.hasClass("group-context-menu-container"))
        $el = $el.closest(".sidebar-group-item");
    if ($el) {
        var groupId = $el.attr("data-group");
        var title = $el.find(".sidebar-group-title").text();
        if(title && groupId) {
            var $modal = $("#add-new-group-dialog");
            var $modalTitle = $modal.find("#add-new-group-dialog-title");
            var $form = $modal.find("#add-new-group-form");
            if($form && $modalTitle) {
                $modalTitle.text(translate("rename_group_dialog_title"));
                var $title = $("#newGroupTitle");

                $form.attr("data-edit-groupId", groupId);
                if(!$form.hasClass("edit-group-dialog"))
                    $form.addClass("edit-group-dialog");

                $title.val(title);

                $modal.modal();
            }
        }
    }
}

/**
 * Get group context menu items
 *
 * @param isDefaultGroup Bool
 * @returns {{items: *[]}}
 */
function getContextMenuGroupItems(isDefaultGroup) { 
    var alias = isDefaultGroup ? "defaultGroupCmRoot" : "groupCmRoot";
    var items = [];
    items.push({
        text: translate("page_group_context_menu_rename"), alias: "renameGroup", action: function (el) {
            editGroupItem($(el));
        }
    });
    if(!isDefaultGroup) {
        items.push({type: "splitLine"});
        items.push({
            text: translate("page_group_context_menu_delete"), alias: "deleteGroup", action: function (el) {
                hideGroupItem($(el));
            }
        });
    }
    return {items: items, alias: alias};
}

/**
 * Init group context menu
 */
function initGroupContextMenu() { 
    var option;
    var $items;

    option = getContextMenuGroupItems(false);
    $items = $(".sidebar-group-item").not(".group-is-default, .group-is-popular");
    $items.contextmenu(option);
    option['eventName'] = "click";
    if($items)
        $items.find(".group-context-menu-container").contextmenu(option);

    option = getContextMenuGroupItems(true);
    $items = $(".sidebar-group-item.group-is-default");
    $items.contextmenu(option);
    option['eventName'] = "click";
    if($items)
        $items.find(".group-context-menu-container").contextmenu(option);

    $(".sidebar-group-item.group-is-popular").on('contextmenu', function(e) {
        return false;
    });

    var $contextMenu = $("#groupCmRoot, #defaultGroupCmRoot");
    $("body").off("mouseleave").on({
        "mouseleave" : function() {
            if($contextMenu.is(":visible"))
                $contextMenu.hide();
        }
    });
}

/**
 * Add context menu to group element
 *
 * @param $el jQuery element
 * @return jQuery element
 */
function addContextMenuToGroupElement($el) { 
    var option = getContextMenuGroupItems(false);
    $el.contextmenu(option);
    var $contextMenuContainer = $el.find(".group-context-menu-container");
    if($contextMenuContainer) {
        option['eventName'] = "click";
        $contextMenuContainer.contextmenu(option);
    }
    return $el;
}
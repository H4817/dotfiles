var relaxModeIsActive = false;
var relaxModeBodyClickTimer;
var relaxStartTime;

$(function() {
    $(document).on("click", "#options-relax-popup-close", function(e) {
        e.preventDefault();
        $("#relax-modal-content").modal('hide');
        BRW_sendMessage({command: "setRelaxModalDisable"});
    });

    var $modal = $('#relax-modal-content');
    $modal.on('hide.bs.modal', function() {
        startRelaxMode();
        var $stopRelaxBtn = $("#relax-done-btn");
            $stopRelaxBtn.stop().css({"opacity" : 0, "display" : "inline-block"}).animate({"opacity" : 0.75}, {"duration" : 400, "queue" : false});
            enableRelaxBtnHoverEffect($stopRelaxBtn);
        if(relaxBtnTimeOut)
            clearTimeout(relaxBtnTimeOut);
        relaxBtnTimeOut = setTimeout(function() {
            if(!$stopRelaxBtn.is(":hover"))
                $stopRelaxBtn.animate({"opacity" : 0}, {"duration" : 1000, "queue" : false});
        }, 2000);
    });
});

/**
 * Start relax mode
 */
function startRelaxMode() {
    toggleFullScreen(document.body, true);
    $(document).on("keyup", relaxModeCloseHandler);
    if(relaxModeBodyClickTimer)
        clearTimeout(relaxModeBodyClickTimer);
    relaxModeBodyClickTimer = setTimeout(function() {
        $(document).on("click", relaxModeShowCurrentButton);
    }, 400);
    relaxModeIsActive = true;
    relaxStartTime = new Date().getTime();
}

/**
 * Stop relax mode
 */
function stopRelaxMode() {
    toggleFullScreen(document.body, false);
    $(document).off("keyup", relaxModeCloseHandler);
    if(relaxModeBodyClickTimer)
        clearTimeout(relaxModeBodyClickTimer);
    $(document).off("click", relaxModeShowCurrentButton);
    relaxModeIsActive = false;
    if(relaxStartTime) {
        var relaxTimeDiff = Math.ceil((new Date().getTime() - relaxStartTime) / 1000);
        sendToGoogleAnalitic(function() {
            ga('send', 'event', 'relax', 'interval', 'seconds', relaxTimeDiff);
        });
    }
}

document.addEventListener("mozfullscreenchange", function() {//firefox
    if(document.mozFullScreen != undefined && document.mozFullScreen === false){   
        if(relaxModeIsActive){
            var $stopRelaxBtn = $("#relax-done-btn");
            if($stopRelaxBtn)
                $stopRelaxBtn.trigger("click");
        }
    }
});

/**
 * Relax mode close handler
 *
 * @param e Event
 */
function relaxModeCloseHandler(e) {
    if (e.keyCode == 27 && relaxModeIsActive) {
        var $stopRelaxBtn = $("#relax-done-btn");
        if($stopRelaxBtn)
            $stopRelaxBtn.trigger("click");
    }
}

/**
 * Toggle page FullScreen mode
 *
 * @param elem Node element
 * @param state Bool
 */
function toggleFullScreen(elem, state) {
    if (state) {
        if(checkIsNotFullScreen()) {
            if (elem.requestFullScreen)
                elem.requestFullScreen();
            else if (elem.mozRequestFullScreen)
                elem.mozRequestFullScreen();
            else if (elem.webkitRequestFullScreen)
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if(!checkIsNotFullScreen()) {
            if (document.cancelFullScreen)
                document.cancelFullScreen();
            else if (document.mozCancelFullScreen)
                document.mozCancelFullScreen();
            else if (document.webkitCancelFullScreen)
                document.webkitCancelFullScreen();
        }
    }
}

/**
 * Check now is not FullScreen mode
 *
 * @returns {boolean}
 */
function checkIsNotFullScreen() {
    return (document.fullScreenElement !== undefined && document.fullScreenElement === null) ||
           (document.mozFullScreen !== undefined && !document.mozFullScreen) ||
           (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen);
}
/**
 * Bg add new dial
 *
 * @param dial Object
 * @param collectDials Array
 * @param sendResponse Function
 */
function bgAddNewDial(dial, collectDials, sendResponse) {
    var dials = collectDials;
    
    BRW_dbTransaction(function(tx) {
            var addDate = dial.addDate || new Date().getTime();
            var id = dial.id || generateUniqueId(addDate);
            var url = addUrlHttp(dial.url);
            var title = dial.title;

            var groupId = dial.groupId;
        
            BRW_dbSelect(
                {//Param
                    tx : tx,
                    from    :  'DIALS',
                    maxOf   :  {
                        field : 'orderNum',
                        name  : 'orderNum'      
                    },
                    where   : {
                        'groupId'   : groupId,
                        'is_deleted': 0
                    }
                },
                function(results){//Success
                    var maxOrders = results.rows;
                    var maxOrdersLength = maxOrders.length;

                    var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                        orderNum = parseInt(orderNum);
                    var dial = {
                        "id": id,
                        "groupId": groupId,
                        "url": url,
                        "title": title,
                        "addDate": addDate,
                        "orderNum" : ++orderNum,
                        "image" : null,
                        "bgColor" : null,
                        "textColor" : null,
                        "thumbType" : null,
                        "colorScheme" : null
                    };
                    
                    BRW_dbInsert(
                        { //Param
                            tx : tx,
                            table: 'DIALS',
                            'set': {
                                id      : dial.id,
                                groupId : dial.groupId,
                                url     : dial.url,
                                title   : dial.title,
                                addDate : dial.addDate,
                                orderNum: dial.orderNum,
                                image   : dial.image,
                                bg_color: dial.bgColor,
                                text_color: dial.textColor,
                                thumb_type: dial.thumbType,
                                is_deleted: 0
                            } 
                        }
                    );
                    
                    sendDialResponse(dial.id, sendResponse);
                    bgMoveDialsOrder(dials);
                }       
            );
        
            /*
            tx.executeSql('SELECT MAX(orderNum) AS orderNum FROM DIALS WHERE groupId = ? AND is_deleted = 0', [groupId], function (tx, results) {
                var maxOrders = results.rows;
                var maxOrdersLength = maxOrders.length;
                
                var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                    orderNum = parseInt(orderNum);
                var dial = {
                    "id": id,
                    "groupId": groupId,
                    "url": url,
                    "title": title,
                    "addDate": addDate,
                    "orderNum" : ++orderNum,
                    "image" : null,
                    "bgColor" : null,
                    "textColor" : null,
                    "thumbType" : null,
                    "colorScheme" : null
                };
                tx.executeSql('INSERT INTO DIALS (id, groupId, url, title, addDate, orderNum, image, bg_color, text_color, thumb_type, is_deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [
                    dial.id,
                    dial.groupId,
                    dial.url,
                    dial.title,
                    dial.addDate,
                    dial.orderNum,
                    dial.image,
                    dial.bgColor,
                    dial.textColor,
                    dial.thumbType,
                    0
                ]);
                sendDialResponse(dial.id, sendResponse);
                bgMoveDialsOrder(dials);
            });
            */
        });
}

/**
 * Bg edit new dial
 *
 * @param dial Object
 * @param collectDials Array
 * @param groupChanged Bool
 * @param sendResponse Bool
 */
function bgEditNewDial(dial, collectDials, groupChanged, sendResponse) {
    var dials = collectDials;
    BRW_dbTransaction(function(tx) {
            var id = dial.id;
            var url = addUrlHttp(dial.url);
            var title = dial.title;
            var groupId = dial.groupId;
            if(id && groupId && url && title) {
                
                //tx.executeSql('SELECT * FROM DIALS WHERE id = ? AND is_deleted = 0', [id], function (tx, results) {
                BRW_dbSelect(
                {//Param
                    tx : tx,
                    from    :  'DIALS',
                    where   : {
                        'id'   : id,
                        'is_deleted': 0
                    }
                },
                function(results){    
                    var dialsList = results.rows;
                    
                    if(dialsList.length) {
                        var item, image, bgColor, textColor, thumbType;
                            item = dialsList[0];
                        
                        if(item.url == url) {
                            if(groupChanged) {
                                BRW_dbSelect(
                                    {//Param
                                        tx : tx,
                                        from    :  'DIALS',
                                        maxOf   :  {
                                            field : 'orderNum',
                                            name  : 'orderNum'      
                                        },
                                        where   : {
                                            'groupId'   : groupId,
                                            'is_deleted': 0
                                        }
                                    },
                                    function(results){//Success
                                        var maxOrders = results.rows;
                                        var maxOrdersLength = maxOrders.length;
                                        var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                                            orderNum = parseInt(orderNum);
                                        
                                        BRW_dbUpdate(
                                            { //Param
                                                tx : tx,
                                                table: 'DIALS',
                                                'set': {
                                                    groupId : dial.groupId,
                                                    url     : dial.url,
                                                    title   : dial.title,
                                                    orderNum: (++orderNum)
                                                },
                                                where: {
                                                    key: 'id', val: dial.id
                                                }
                                            }
                                            , function() {
                                                sendDialResponse(dial.id, sendResponse);
                                                dials.splice(dials.indexOf(dial.id), 1);
                                                bgMoveDialsOrder(dials);
                                            }
                                        );
                                        
                                        /*
                                        tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , orderNum = ?  WHERE id = ?', [
                                            dial.groupId,
                                            dial.url,
                                            dial.title,
                                            ++orderNum,
                                            dial.id
                                        ], function() {
                                            sendDialResponse(dial.id, sendResponse);
                                            dials.splice(dials.indexOf(dial.id), 1);
                                            bgMoveDialsOrder(dials);
                                        });
                                        */
                                });
                                
                                
                            } else {
                                BRW_dbUpdate(
                                    { //Param
                                        tx   : tx,
                                        table: 'DIALS',
                                        set  : {
                                            groupId : dial.groupId,
                                            url     : dial.url,
                                            title   : dial.title
                                        },
                                        where: {
                                            key: 'id', val: dial.id
                                        }
                                    }
                                    , function() {
                                        sendDialResponse(dial.id, sendResponse);
                                        bgMoveDialsOrder(dials);
                                    }
                                );
                                
                                /*
                                tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? WHERE id = ?', [
                                    dial.groupId,
                                    dial.url,
                                    dial.title,
                                    dial.id
                                ], function() {
                                    sendDialResponse(dial.id, sendResponse);
                                    bgMoveDialsOrder(dials);
                                });
                                */
                            }
                        } else {
                            image = null;
                            bgColor = null;
                            textColor = null;
                            thumbType = null;

                            if(groupChanged) {
                                //tx.executeSql('SELECT MAX(orderNum) AS orderNum FROM DIALS WHERE groupId = ? AND is_deleted = 0', [groupId], function (tx, results) {
                                BRW_dbSelect(
                                    {//Param
                                        tx : tx,
                                        from    :  'DIALS',
                                        maxOf   :  {
                                            field : 'orderNum',
                                            name  : 'orderNum'      
                                        },
                                        where   : {
                                            'groupId'   : groupId,
                                            'is_deleted': 0
                                        }
                                    },
                                    function(results){//Success                          
                                        var maxOrders = results.rows;
                                        var maxOrdersLength = maxOrders.length;
                                        var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                                            orderNum = parseInt(orderNum);
                                        
                                        BRW_dbUpdate(
                                            { //Param
                                                tx : tx,
                                                table: 'DIALS',
                                                'set': {
                                                    groupId : dial.groupId,
                                                    url     : dial.url,
                                                    title   : dial.title,
                                                    orderNum: (++orderNum),
                                                    image   : image,
                                                    bg_color: bgColor,
                                                    text_color: textColor,
                                                    thumb_type: thumbType
                                                },
                                                where: {
                                                    key: 'id', val: dial.id
                                                }
                                            }
                                            , function() {
                                                sendDialResponse(dial.id, sendResponse);
                                                dials.splice(dials.indexOf(dial.id), 1);
                                                bgMoveDialsOrder(dials);
                                            }
                                        );
                                        
                                        /*
                                        tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , orderNum = ? , image = ? , bg_color = ? , text_color = ? , thumb_type = ? WHERE id = ?', [
                                            dial.groupId,
                                            dial.url,
                                            dial.title,
                                            ++orderNum,
                                            image,
                                            bgColor,
                                            textColor,
                                            thumbType,
                                            dial.id
                                        ], function() {
                                            sendDialResponse(dial.id, sendResponse);
                                            dials.splice(dials.indexOf(dial.id), 1);
                                            bgMoveDialsOrder(dials);
                                        });
                                        */
                                });
                            } else {
                                    BRW_dbUpdate(
                                        { //Param
                                            tx : tx,
                                            table: 'DIALS',
                                            'set': {
                                                groupId : dial.groupId,
                                                url     : dial.url,
                                                title   : dial.title,
                                                image   : image,
                                                bg_color: bgColor,
                                                text_color: textColor,
                                                thumb_type: thumbType
                                            },
                                            where: {
                                                key: 'id', val: dial.id
                                            }
                                        }
                                        , function() {
                                            sendDialResponse(dial.id, sendResponse);
                                            bgMoveDialsOrder(dials);
                                        }
                                    );
                                
                                
                                /*
                                tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , image = ? , bg_color = ? , text_color = ? , thumb_type = ? WHERE id = ?', [
                                    dial.groupId,
                                    dial.url,
                                    dial.title,
                                    image,
                                    bgColor,
                                    textColor,
                                    thumbType,
                                    dial.id
                                ], function() {
                                    sendDialResponse(dial.id, sendResponse);
                                    bgMoveDialsOrder(dials);
                                });
                                */
                            }
                        }
                    }
                });
            }
        });
    /*
    getDb().transaction(function(tx) {
            var id = dial.id;
            var url = addUrlHttp(dial.url);
            var title = dial.title;
            var groupId = dial.groupId;
            if(id && groupId && url && title) {
                tx.executeSql('SELECT * FROM DIALS WHERE id = ? AND is_deleted = 0', [id], function (tx, results) {
                    var dialsList = results.rows;
                    if(dialsList.length) {
                        var item, image, bgColor, textColor, thumbType;
                            item = dialsList[0];

                        if(item.url == url) {
                            if(groupChanged) {
                                tx.executeSql('SELECT MAX(orderNum) AS orderNum FROM DIALS WHERE groupId = ? AND is_deleted = 0', [groupId], function (tx, results) {
                                    var maxOrders = results.rows;
                                    var maxOrdersLength = maxOrders.length;
                                    var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                                        orderNum = parseInt(orderNum);
                                    tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , orderNum = ?  WHERE id = ?', [
                                        dial.groupId,
                                        dial.url,
                                        dial.title,
                                        ++orderNum,
                                        dial.id
                                    ], function() {
                                        sendDialResponse(dial.id, sendResponse);
                                        dials.splice(dials.indexOf(dial.id), 1);
                                        bgMoveDialsOrder(dials);
                                    });
                                });
                            } else {
                                tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? WHERE id = ?', [
                                    dial.groupId,
                                    dial.url,
                                    dial.title,
                                    dial.id
                                ], function() {
                                    sendDialResponse(dial.id, sendResponse);
                                    bgMoveDialsOrder(dials);
                                });
                            }
                        } else {
                            image = null;
                            bgColor = null;
                            textColor = null;
                            thumbType = null;

                            if(groupChanged) {
                                tx.executeSql('SELECT MAX(orderNum) AS orderNum FROM DIALS WHERE groupId = ? AND is_deleted = 0', [groupId], function (tx, results) {
                                    var maxOrders = results.rows;
                                    var maxOrdersLength = maxOrders.length;
                                    var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                                        orderNum = parseInt(orderNum);
                                    tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , orderNum = ? , image = ? , bg_color = ? , text_color = ? , thumb_type = ? WHERE id = ?', [
                                        dial.groupId,
                                        dial.url,
                                        dial.title,
                                        ++orderNum,
                                        image,
                                        bgColor,
                                        textColor,
                                        thumbType,
                                        dial.id
                                    ], function() {
                                        sendDialResponse(dial.id, sendResponse);
                                        dials.splice(dials.indexOf(dial.id), 1);
                                        bgMoveDialsOrder(dials);
                                    });
                                });
                            } else {
                                tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , image = ? , bg_color = ? , text_color = ? , thumb_type = ? WHERE id = ?', [
                                    dial.groupId,
                                    dial.url,
                                    dial.title,
                                    image,
                                    bgColor,
                                    textColor,
                                    thumbType,
                                    dial.id
                                ], function() {
                                    sendDialResponse(dial.id, sendResponse);
                                    bgMoveDialsOrder(dials);
                                });
                            }
                        }
                    }
                });
            }
        });
    */
}

/**
 * Edit dial send response
 *
 * @param dialId
 * @param sendResponse Function
 */
function sendDialResponse(dialId, sendResponse) {
    BRW_dbTransaction(function(tx) {
        
        BRW_dbSelect(
            {//Param
                tx : tx,
                from    :  'DIALS',
                where   : {
                    'id'         : dialId,
                    'is_deleted' : 0
                }
            },
            function(results){//Success
                var dials = results.rows;
                
                if(dials.length) {
                    var item = dials[0];
                    var dial = {
                        "id": item.id,
                        "dialId" : dialId,
                        "groupId": item.groupId,
                        "url": item.url,
                        "title": item.title,
                        "addDate": item.addDate,
                        "orderNum" : item.orderNum,
                        "image" : item.image,
                        "bgColor" : item.bg_color,
                        "textColor" : item.text_color,
                        "thumbType" : item.thumb_type,
                        "colorScheme" : {"backgroundColor" : item.bg_color, "color" : item.text_color}
                    };
                    sendResponse({"dial" : dial});
                }
            }
        );
        
        /*
        tx.executeSql('SELECT * FROM DIALS WHERE id = ? AND is_deleted = 0', [dialId], function (tx, results) {
            var dials = results.rows;
            if(dials.length) {
                var item = dials[0];
                var dial = {
                    "id": item.id,
                    "dialId" : dialId,
                    "groupId": item.groupId,
                    "url": item.url,
                    "title": item.title,
                    "addDate": item.addDate,
                    "orderNum" : item.orderNum,
                    "image" : item.image,
                    "bgColor" : item.bg_color,
                    "textColor" : item.text_color,
                    "thumbType" : item.thumb_type,
                    "colorScheme" : {"backgroundColor" : item.bg_color, "color" : item.text_color}
                };
                sendResponse({"dial" : dial});
            }
        });
        */
    });
}

/**
 * Delete dial by id
 *
 * @param dialId String
 * @param collectDials Array
 * @param sendResponse Function
 */
function bgDeleteDial(dialId, collectDials, sendResponse) {
    if(dialId) {
        var dials = collectDials;
        
        BRW_dbTransaction(function(tx) {
            BRW_dbDelete(
                {//Param
                    tx : tx,
                    table   :  'DIALS',
                    where   : {
                        key : 'is_deleted', val : 1
                    }
                }       
            );
            
            BRW_dbUpdate(
                { //Param
                    tx : tx,
                    table: 'DIALS',
                    'set': {
                        is_deleted: 1
                    },
                    where: {
                        key: 'id', val: dialId
                    }

                }
            );
            
            bgMoveDialsOrder(dials);
            sendResponse({"dialId" : dialId});
        });
        
        /*
        getDb().transaction(function(tx) {
                tx.executeSql('DELETE FROM DIALS WHERE is_deleted = 1');
                tx.executeSql('UPDATE DIALS SET is_deleted = 1 WHERE id = ?', [dialId]);
                bgMoveDialsOrder(dials);
                sendResponse({"dialId" : dialId});
        });
        */
    }
}

/**
 * Restore dial by id
 *
 * @param dialId String
 * @param sendResponse Function
 */
function bgRestoreRemovedDialById(dialId, sendResponse) {
    if(dialId) {
        BRW_dbTransaction(function(tx) {
            BRW_dbUpdate(
                { //Param
                    tx : tx,
                    table: 'DIALS',
                    'set': {
                        is_deleted: 0
                    },
                    where: {
                        key: 'id', val: dialId
                    }

                }
            );
            
            /*
            tx.executeSql('UPDATE DIALS SET is_deleted = 0 WHERE id = ?', [dialId]);
            */
        });
        sendResponse({"dialId" : dialId});
    }
}

/**
 * Move dials order
 *
 * @param collectDials Array
 */
function bgMoveDialsOrder(collectDials) {
    if(collectDials.length) {
        var dials = collectDials;
        BRW_dbTransaction(function (tx) {
                for(var i in dials) {
                    if(dials.hasOwnProperty(i))
                        BRW_dbUpdate(
                            { //Param
                                tx : tx,
                                table: 'DIALS',
                                'set': {
                                    orderNum: parseInt(i)
                                },
                                where: {
                                    key: 'id', val: dials[i]
                                }

                            }
                        );
                        
                        /*
                        tx.executeSql('UPDATE DIALS SET orderNum = ? WHERE id = ?', [parseInt(i), dials[i]]);
                        */
                }
        });
    }
}

/**
 * Find group dials
 *
 * @param groups Array
 * @param sendResponse Function
 */
function bgFindGroupDials(groups, sendResponse) {
    var groupsLength = groups.length;
    var group = groupsLength ? groups[0] : null;
    if(group)
        group.dials = [];
    if(group && group.id == GROUP_POPULAR_ID) {
        sendResponse({"group" : group});
    } else {
        getGroupDials(group, sendResponse);
    }
}

/**
 * Find group dials
 *
 * @param sendResponse Function
 */
function bgFindGroupDialsError(sendResponse) {
    console.log("Get default group error");
    sendResponse({"group" : null});
}

/**
 * Get group dials
 *
 * @param group Object
 * @param sendResponse Function
 */
function getGroupDials(group, sendResponse) {
    BRW_dbTransaction(function (tx) {
        if (group) {
            BRW_dbSelect({ //Param
                    tx : tx,
                    from: 'DIALS',
                    where: {
                        'groupId': group.id,
                        'is_deleted': 0
                    },
                    order: 'orderNum'
                },
                function (results) { //Success
                    var dials = results.rows;
                    for (var i in dials) {
                        if (dials.hasOwnProperty(i))
                            group.dials.push(dials[i]);
                    }
                    //console.log(group);
                    sendResponse({
                        "group": group
                    });
                },
                function () { //Error
                    console.log("Get group " + group.id + " dials error");
                    sendResponse({"group": group});
                }
            );
        } else
            sendResponse({"group": null});

    });
    /*
    getDb().transaction(function (tx) {
            if(group) {
                tx.executeSql('SELECT * FROM DIALS WHERE groupId = ? AND is_deleted = 0 ORDER BY orderNum ASC', [group.id], function (tx, results) {
                    var dials = results.rows;
                    for (var i in dials) {
                        if(dials.hasOwnProperty(i))
                            group.dials.push(dials[i]);
                    }
                    //console.log(group);
                    sendResponse({"group" : group});
                }, function() {
                    console.log("Get group " + group.id + " dials error");
                    sendResponse({"group" : group});
                });
            } else
                sendResponse({"group" : null});
        });
    */
}














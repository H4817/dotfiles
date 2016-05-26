
/*From pages/common.js*/
function BRW_getDb(){
    if(!appDB) {
        appDB = openDatabase('speeddial', '1.0', 'Parallax Speed Dial Background', 100 * 1024 * 1024);
        appDB.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS IMAGES (id unique, url, image, bg_color, text_color, thumb_type)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS TODO_ITEMS (id unique, title, done, item_date, item_order)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS SETTINGS (name, value)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS HOST_BLACKLIST (id unique, host)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS GROUPS (id unique, type, title, addDate, orderNum)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS DIALS (id unique, groupId, url, title, addDate, orderNum, image, bg_color, text_color, thumb_type, is_deleted)');
            createColumnsIfNotExist(tx, "IMAGES", ["bg_color", "text_color", "thumb_type"]);
            installDefaultGroupsIfNotExist();

            //tx.executeSql('DELETE FROM IMAGES');
            //tx.executeSql('DELETE FROM TODO_ITEMS');
            //tx.executeSql('DELETE FROM SETTINGS');
            //tx.executeSql('DELETE FROM HOST_BLACKLIST');
            //tx.executeSql('DELETE FROM GROUPS');
            //tx.executeSql('DELETE FROM DIALS');
        });
        return appDB;
    }else{
        return appDB;
    }//else
}//BRW_getDb
    
/*From /pages/common.js*/       
function BRW_setSettingsValue(key, val, callback){
    getDb().transaction(function (tx) {
        tx.executeSql('SELECT * FROM SETTINGS WHERE name = ?', [key], function (tx, results) {
            if(!results.rows.length)
                tx.executeSql('INSERT INTO SETTINGS (name, value) VALUES (?,?)', [key, val]);
            else
                tx.executeSql('UPDATE SETTINGS SET value = ? WHERE name = ?', [val, key]);

            if(callback)
                callback(val);
        });
    });
}
            

/*From /pages/backend/common.js*/  
function BRW_setDefaultGroup(callback) {
    var addDate = new Date().getTime();
    var id = generateUniqueId(addDate);
    getDb().transaction(function(tx) {
        tx.executeSql('SELECT * FROM GROUPS WHERE type = ?', [GROUP_TYPE_POPULAR], function (tx, results) {
            if(!results.rows.length) {
                tx.executeSql('INSERT INTO GROUPS (id, type, title, addDate, orderNum) VALUES (?,?,?,?,?)', [
                    GROUP_POPULAR_ID.toString(),
                    GROUP_TYPE_POPULAR,
                    GROUP_POPULAR_TITLE,
                    addDate,
                    0
                ]);
            }
            tx.executeSql('SELECT * FROM GROUPS WHERE type = ?', [GROUP_TYPE_DEFAULT], function (tx, results) {
                if(!results.rows.length) {
                    var group = {
                        "id" :  id,
                        "type" : GROUP_TYPE_DEFAULT,
                        "title" : GROUP_DEFAULT_TITLE,
                        "addDate" : addDate,
                        "orderNum" : 1,
                        "dials" : []
                    };

                    tx.executeSql('INSERT INTO GROUPS (id, type, title, addDate, orderNum) VALUES (?,?,?,?,?)', [
                        group.id,
                        group.type,
                        group.title,
                        group.addDate,
                        group.orderNum
                    ], function() {
                        setActiveGroup(group.id, function() {
                            $.ajax({
                                type: "GET",
                                url: "http://everhelper.me/spec/country.php",
                                success : function(data) {
                                    var country = "";
                                    var searchBy = COUNTRY_SEARCH_BY_DEFAULT;
                                    if(data && data.length == 2)
                                        country = data.toUpperCase();
                                    if(!checkCountryIsActual(country)) {
                                        var language = chrome.i18n.getUILanguage();
                                        if(language.length > 1) {
                                            country = language.substr(0, 2).toUpperCase();
                                            if(!checkCountryIsActual(country)) {
                                                country = defaultUserCountry;
                                            } else {
                                                searchBy = COUNTRY_SEARCH_BY_LANGUAGE;
                                            }
                                        }
                                    } else {
                                        searchBy = COUNTRY_SEARCH_BY_SERVICE;
                                    }
                                    callback(group, country, searchBy);
                                },
                                error : function() {
                                    callback(group, defaultUserCountry, COUNTRY_SEARCH_BY_DEFAULT);
                                }
                            });
                        });
                    });
                }
            });
        });
    });
}//BRW_setDefaultGroup

/*From /pages/backend/common.js*/  
function BRW_setDefaultDials(group, country, searchBy) {
    var defaultDials = getDefaultDialsList(country, searchBy);

    getDb().transaction(function(tx) {
        var defaultDialsLength = defaultDials.length;
        for(var i = 0; i < defaultDialsLength; i++) {
            var defaultDial = defaultDials[i];
            var id = group.addDate.toString() + (i + 1).toString();
            var dial = {
                "id": id,
                "groupId": group.id,
                "url": addUrlHttp(defaultDial.url),
                "title": defaultDial.title,
                "addDate": group.addDate,
                "orderNum": parseInt(i),
                "image" : defaultDial.image,
                "thumbType" : showDialGalleryThumb
            };
            tx.executeSql('INSERT INTO DIALS (id, groupId, url, title, addDate, orderNum, image, bg_color, text_color, thumb_type, is_deleted) VALUES (?,?,?,?,?,?,?,?,?,?,?)', [
                dial.id,
                dial.groupId,
                dial.url,
                dial.title,
                dial.addDate,
                dial.orderNum,
                dial.image,
                null,
                null,
                dial.thumbType,
                0
            ]);
            group.dials.push(dial);
        }
    });
}//BRW_setDefaultDials

/*From /pages/backend/common.js*/ 
function BRW_getSettingsValue(key, defaultValue, callback) {
    
    getDb().transaction(function (tx) {
        tx.executeSql('SELECT * FROM SETTINGS WHERE name = ?', [key], function (tx, results) {
            var val;
            var itemsLength = results.rows.length;

            if(itemsLength) {
                for(var i = 0; i < itemsLength; i++)
                    val = results.rows[i].value;
            } else {
                if(typeof (defaultValue) != "undefined") {
                    val = defaultValue;
                    tx.executeSql('INSERT INTO SETTINGS (name, value) VALUES (?,?)', [key, val]);
                }
            }

            if(callback)
                callback(val);
        });
    });
}//BRW_getSettingsValue

/*From /pages/backend/groups.js*/ 
function BRW_bgAddNewGroup(group, collectGroups, sendResponse) {
    var groups = collectGroups;
    
    getDb().transaction(function(tx) {
            var addDate = group.addDate || new Date().getTime();
            var id = group.id || generateUniqueId(addDate);
            var title = group.title;
            tx.executeSql('SELECT MAX(orderNum) AS orderNum FROM GROUPS', [], function (tx, results) {
                var maxOrders = results.rows;
                var maxOrdersLength = maxOrders.length;
                var orderNum = maxOrdersLength && maxOrders[0].orderNum ? parseInt(maxOrders[0].orderNum) : 0;
                    orderNum = parseInt(orderNum);
                var group = {
                    "id": id,
                    "type": GROUP_TYPE_USER,
                    "title": title,
                    "addDate": addDate,
                    "orderNum" : ++orderNum
                };
                tx.executeSql('INSERT INTO GROUPS (id, type, title, addDate, orderNum) VALUES (?,?,?,?,?)', [
                    group.id,
                    group.type,
                    group.title,
                    group.addDate,
                    group.orderNum
                ], function() {
                    setActiveGroup(group.id);
                    sendResponse({"group" : group});
                });
                bgMoveGroupsOrder(groups);
            });
        });
}//BRW_bgAddNewGroup

function BRW_dbTransaction(callback){
   getDb().transaction(function(tx){
       callback.call(true, tx);
   });
}//BRW_dbTransaction

function BRW_dbSelect(obj, successFunction, errorFunction){
    var param = obj, whereArr = [], sql='SELECT';
    
    if(param.maxOf){//Max of item
        sql += ' MAX('+param.maxOf.field+') AS '+param.maxOf.name;
    }else if(param.countAs){//Count of items as key
        sql += ' COUNT(id) AS '+param.countAs;
    }else sql += ' *';

    sql += ' FROM '+param.from;
    
    if(param.where || param.whereIn){
        sql += ' WHERE';
        
        if(param.where){
            for(var w in param.where){
                if(whereArr.length) sql += ' AND';
                whereArr[whereArr.length] = param.where[w];
                sql += ' '+w+' = ?';
            }//for
        }//if
        
        if(param.whereIn){
            sql += ' '+param.whereIn.key + ' IN('+createParams(param.whereIn.arr)+')';
            whereArr = param.whereIn.arr;
        }//if
    }//if
        
    if(param.order) sql += ' ORDER BY '+param.order+' ASC';
    if(param.limit) sql += ' LIMIT '+param.limit;
          
    //console.log(obj, sql);// alert(sql);    

    param.tx.executeSql(sql, whereArr, function (tx, results) {
        //console.log(results.rows);
        if(successFunction) 
                successFunction.call(true, results);
    }, function() {
        if(errorFunction) 
            errorFunction.call();
    });
}//function BRW_dbSelect

function BRW_dbUpdate(obj, successFunction, errorFunction){
    var param = obj, arr=[];
    var sql = 'UPDATE '+param.table+' SET';
    
    for(var i in param.set){
        if(arr.length) sql += ' ,';
        sql += ' ' + i + '=?';
        arr[arr.length] = param.set[i];
    }//for
    
    if(param.where){
        sql += ' WHERE '+param.where.key+'=?';
        arr[arr.length] = param.where.val;
    }//if
    
    param.tx.executeSql(sql, arr, 
        function(){//success
            if(successFunction) 
                successFunction.call();
        }, function(){//error
            if(errorFunction) 
                errorFunction.call();
        }
    );
    
    //tx.executeSql('UPDATE TODO_ITEMS SET title = ? WHERE id = ?', [title, id]);
    //tx.executeSql('UPDATE DIALS SET groupId = ? , url = ? , title = ? , orderNum = ?  WHERE id = ?'
}//function BRW_dbUpdate

function BRW_dbInsert(obj, successFunction, errorFunction){
    var param = obj;
    
    var arr = []; for(var i in param.set) arr[arr.length] = param.set[i];
    var keys = Object.keys(param.set);
    
    var sql = 'INSERT INTO '+param.table+' (';
    sql += keys.join(', ');
    sql += ') VALUES (';
    keys.fill('?')
    sql += keys.join(', ');
    sql += ')';
    
    //console.log(obj, sql, arr);
    
    param.tx.executeSql(sql, arr);
}//function BRW_dbInsert

function BRW_dbDelete(obj, successFunction, errorFunction){
    var param = obj, arr=[];
    
    var sql = 'DELETE FROM '+param.table;
    
    if(param.where){
        sql += ' WHERE '+param.where.key+'=?';
        arr[0] = param.where.val;
    }//if
    
    //console.log(obj, sql, arr);
    
    param.tx.executeSql(sql, arr);
}//function BRW_dbDelete


























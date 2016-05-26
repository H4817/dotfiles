/*From /pages/common.js*/
function BRW_getDb(){
    if(appDB) return appDB;
    
    appDB = new Dexie('speeddial');

    appDB.version(1).stores({
        'IMAGES'        : '++id, url, image, bg_color, text_color, thumb_type',
        'TODO_ITEMS'    : '++id, title, done, item_date, item_order',
        'SETTINGS'      : 'name, value',
        'HOST_BLACKLIST': '++id, host',
        'GROUPS'        : '++id, type, title, addDate, orderNum',
        'DIALS'         : '++id, groupId, url, title, addDate, orderNum, image, bg_color, text_color, thumb_type, is_deleted'
    });
    
    appDB.open().then(function(){
        if(!localStorage.getItem('defaultGroupsInstalled')){
            localStorage.setItem('defaultGroupsInstalled', true);
            
            installDefaultGroupsIfNotExist();
        }//if
    });
    
    appDB.on("error", function(e) { 
        //console.log ("Dexie warning: ", (e.stack || e)); 
    });
    
    return appDB;
}//BRW_getDb

/*From /pages/backend/common.js*/  
function BRW_setDefaultGroup(callback) {
    if(localStorage.getItem('defaultGroupsInstalled')) return false;
    
    var addDate = new Date().getTime();
    var id = generateUniqueId(addDate);
    
    getDb().GROUPS.where('type').equals(GROUP_TYPE_POPULAR).count(function(count) {
        if(!count){
            getDb().GROUPS.add({
                    id      : GROUP_POPULAR_ID.toString(),
                    type    : GROUP_TYPE_POPULAR,
                    title   : GROUP_POPULAR_TITLE,
                    addDate : addDate,
                    orderNum: 0
            });
        }//if
                                                                 
        getDb().GROUPS.where('type').equals(GROUP_TYPE_DEFAULT).count(function(count2) {
            if(!count2){
                    var group = {
                        "id" :  id,
                        "type" : GROUP_TYPE_DEFAULT,
                        "title" : GROUP_DEFAULT_TITLE,
                        "addDate" : addDate,
                        "orderNum" : 1,
                        "dials" : []
                    };
                
                    getDb().GROUPS.add(group)
                    .then(function(status){
                        //console.log(status);
                        
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
                                        
                                        var language = localStorage.getItem("browserLocation");//var language = chrome.i18n.getUILanguage();
                                        
                                        if(language != null && language.length > 1) {
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
                        
                    })
                    .catch(function(error){console.log("!!! BRW_setDefaultGroup ERROR !!!")});
            }//if
        });
    });
}//BRW_setDefaultGroup


/*From /pages/backend/common.js*/  
function BRW_setDefaultDials(group, country, searchBy) {
    var defaultDials = getDefaultDialsList(country, searchBy);
    
    //console.log("BRW_setDefaultDials - ok");
    //console.log(defaultDials);
    
    getDb().transaction('rw', getDb().DIALS, function () {
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
                "thumbType" : showDialGalleryThumb,
                "bg_color"  : null,
                "text_color": null,
                "is_deleted": 0
            };
            
            
            getDb().DIALS.add(dial).then(function(status){  });
            
            group.dials.push(dial);//????
        }
        
        //console.log(group);
        
    });
}//BRW_setDefaultDials




/*From /pages/common.js*/   
function BRW_setSettingsValue(key, val, callback){
    //console.log("BRW_setSettingsValue - ok ("+key+" -> "+val+")");
    getDb().SETTINGS.where('name').equals(key).count(function(count) {
        //console.log("BRW_setSettingsValue / ("+key+" -> "+val+") COUNT: "+count);
        
        if(!count) 
            getDb().SETTINGS.add({name: key, value: val});
        else    
            getDb().SETTINGS.update(key, { value:val });
        
        if(callback)
                callback(val);
    });
}//function

/*From /pages/backend/common.js*/ 
function BRW_getSettingsValue(key, defaultValue, callback) {
    var key = String(key);
    
    //console.log("DATEBASE BRW_getSettingsValue ("+key+", "+defaultValue+")");
    
    getDb().transaction('rw', getDb().SETTINGS, getDb().GROUPS, getDb().DIALS, function () {
        getDb().SETTINGS.get(key).then(function(data) {
            var val;
            
            //console.log(data);
            
            if(data != undefined){//Succes
                val = data.value;
                //alert("FOUND ("+key+", "+val+")");
                //console.log("DATEBASE FOUND ("+key+", "+val+")");
            }else{//Can't found
                if(typeof (defaultValue) != "undefined") {
                    val = defaultValue;
                    
                    getDb().SETTINGS.add({name: key, value: val});
                }//if
                
                //console.log("DATEBASE ADD ("+key+", "+val+")");
            }//else
            
            if(callback)
                callback(val);
            
        })
        .catch(function(err){
            console.log('BRW_getSettingsValue ERR:', err);
        });
        
    });
}//BRW_getSettingsValue

/*From /pages/backend/groups.js*/ 
function BRW_bgAddNewGroup(group, collectGroups, sendResponse) {
    var groups = collectGroups;
    
    getDb().transaction('rw', getDb().SETTINGS, getDb().GROUPS, getDb().DIALS, function () {
            var addDate = group.addDate || new Date().getTime();
            var id = group.id || generateUniqueId(addDate);
            var title = group.title;
        
            var maxVal = 0;
            
            getDb().GROUPS.each(function(item){
                 maxVal = Math.max(maxVal, parseInt(item.orderNum));
            }).then(function(){
                 
                var group = {
                    "id": id,
                    "type": GROUP_TYPE_USER,
                    "title": title,
                    "addDate": addDate,
                    "orderNum" : (1 + parseInt(maxVal))
                };
                
                //console.log("NEW GROUP: ", group);
                 
                getDb().GROUPS.add(group)
                    .then(function(){
                        setActiveGroup(group.id);
                        sendResponse({"group" : group});
                    })
                    .catch(function(err){
                        console.log("[error] BRW_bgAddNewGroup: can't ADD new group", err);
                    })
                
                    bgMoveGroupsOrder(groups);
             }).catch(function(){
                 //console.log("[error] BRW_bgAddNewGroup: can't")
             });
        });
}//BRW_bgAddNewGroup


function BRW_dbTransaction(callback){
   //getDb().transaction('rw', getDb().SETTINGS, getDb().GROUPS, getDb().DIALS, getDb().IMAGES, getDb().TODO_ITEMS, getDb().HOST_BLACKLIST, function () {
       callback.call(true, true);
   //});
}//BRW_dbTransaction


//Universql SELECT function
function BRW_dbSelect(obj, successFunction, errorFunction){
    //getDb().transaction('rw', getDb()[param.from], function () {
        var table, arr, param = obj, results;

        
        getDb().table(param.from).orderBy((param.order ? param.order : ':id')).toArray(function(arr){
            var results={rows:[]};
            
            for(var c in arr){
                if(param.where){
                    var cont = false;
                    for(var w in param.where) if(typeof arr[c][w] == "undefined" || arr[c][w] != param.where[w]) cont = true;
                    if(cont) continue;
                }//if
                
                if(param.whereIn) {
                    var cont = true;
                    for(var w in param.whereIn['arr']) if(arr[c][param.whereIn['key']] == param.whereIn['arr'][w]) cont = false;
                    if(cont) continue;
                }
                
                results.rows[results.rows.length] = arr[c]; //ADD
                
                if(param.limit && c == (param.limit - 1)) break;
            }//for
            
            if(param.countAs){//Count of items as key
                var count = results.rows.length;
                
                for(var r in results.rows){
                    results.rows[r][param.countAs] = count;
                }
            }
            
           if(param.maxOf){//Max of item
                var maxVal = 0;
                for(var r in results.rows) maxVal = Math.max(maxVal, parseInt(results.rows[r][param.maxOf.field])); //get MAX
                for(var r in results.rows) results.rows[r][param.maxOf.name] = maxVal; //set MAX
            }
            
            //console.log("BRW_dbSelect ANSWER (obj, full, results) : ", obj, arr, results);
            
            if(successFunction) 
                successFunction.call(true, results);
            
        }).catch(function(error){
            console.error("BRW_dbSelect (ERROR): ", error, param);
            
            if(errorFunction) 
                errorFunction.call();
        });

    //});
}//BRW_dbSelect

function BRW_dbUpdate(obj, successFunction, errorFunction){
    //getDb().transaction('rw', getDb()[param.from], function () {
        var param = obj;
        
        getDb()[param.table].where(param.where.key).equals(param.where.val).modify(param.set)
        .then(function(data){
            //console.log("BRW_dbUpdate (SUCCESS): ", data, param);
            if(successFunction) successFunction.call(true, data);
        })
        .catch(function(error){
            console.error("BRW_dbUpdate (ERROR): ", error, param);
            if(errorFunction) errorFunction.call();
        });
    //});
}//BRW_dbUpdate

function BRW_dbInsert(obj, successFunction, errorFunction){
    //getDb().transaction('rw', getDb()[param.from], function () {
        var param = obj;
        
        getDb()[param.table].add(param.set)
        .then(function(data){
            //console.log("BRW_dbInsert (SUCCESS): ", data, param);
            if(successFunction) successFunction.call(true, data);
        })
        .catch(function(error){
            console.error("BRW_dbInsert (ERROR): ", error, param);
            if(errorFunction) errorFunction.call();
        });
    //});
}//BRW_dbInsert

function BRW_dbDelete(obj, successFunction, errorFunction){
    //getDb().transaction('rw', getDb()[param.from], function () {
        var param = obj;
        
        getDb()[param.table].where(param.where.key).equals(param.where.val).delete()
        .then(function(data){
            //console.log("BRW_dbDelete (SUCCESS): ", data, param);
            if(successFunction) successFunction.call(true, data);
        })
        .catch(function(error){
            console.error("BRW_dbDelete (ERROR): ", error, param);
            if(errorFunction) errorFunction.call(true, error);
        });
    //});
}//BRW_dbDelete





//db.friends.where("shoeSize").aboveOrEqual(47).modify({isBigfoot: 1});


































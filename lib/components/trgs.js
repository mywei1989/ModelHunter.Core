var dConfig = require('../../config.json');
var fs = require('fs');

var ini = require('../utils/ini');
var csv = require('../utils/csv');
var redis = require('redis');
var actioncommon = require('../modules/actioncommon');
var redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();


var collectionObjList = []; 
var pageIndex = 0;
module.exports.create = function(trgFile){
  var trgFilePath = trgFile;
  collectionObjList = actioncommon.getCollectionObjList(trgFilePath);
  ee.emit('ActionTop100');
}

ee.on('ActionTop100',function(){
  var collectionObjListTop100 = collectionObjList.slice(pageIndex*100,pageIndex*100+100);
  var saveTRGPromiseList = collectionObjListTop100.map(function(collectionObj,index){
    return new Promise(function(resolve,reject){
      collectionObj.count = collectionObj.fileInfo.length;
        redisClient.set('section|'+collectionObj.infoName+'|'+collectionObj.sectionName,JSON.stringify(collectionObj),function(err,res){
        if(!err){
          console.log('保存:'+'section|'+collectionObj.infoName+'|'+collectionObj.sectionName+'成功!');
          resolve();
        }else{
          console.log(err);
          reject();
        }
      });
    });
  });
  Promise.all(saveTRGPromiseList).then(function(){
    saveTRGPromiseList = null;
    pageIndex = pageIndex + 1;
    if(collectionObjListTop100.length < 100){
      ee.emit('ActionEnd');
    }else{
      ee.emit('ActionTop100');
    }
    
  });
});

ee.on('ActionEnd',function(){
  process.exit();
});




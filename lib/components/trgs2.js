var dConfig = require('../../config.json');
var fs = require('fs');

var ini = require('../utils/ini');
var csv = require('../utils/csv');
var redis = require('redis');
//var actioncommon = require('../modules/actioncommon');
var actioncommon = require('../modules/actioncommon2');
var redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);

var EventEmitter = require('events').EventEmitter;
var ee = new EventEmitter();


var collectionObjList = []; 
var pageIndex = 0;
module.exports.create = function(trgFile){
  var trgFilePath = trgFile;

  collectionObjList = actioncommon.getCollectionObjList(trgFilePath);
  
  var wstream = fs.createWriteStream('i:/test.txt');
  collectionObjList.forEach(function(collectionObj,index){
    for(var index = 0;index<collectionObj.fileInfo.length;index ++){
      // if(index%100 === 0 ){
      //   console.log(index)
      // }
      wstream.write(`set '${collectionObj.infoName}:${collectionObj.fileInfo[index].subFolder}${collectionObj.fileInfo[index].fileName}' 0\n`);
    }
  });
  console.log(1111)
  wstream.end();

  process.exit();

  //ee.emit('ActionTop100');
}

ee.on('ActionTop100',function(){
  var collectionObjListTop100 = collectionObjList.slice(pageIndex*100,pageIndex*100+100);
  var saveTRGPromiseList = collectionObjListTop100.map(function(collectionObj,index){
    return new Promise(function(resolve,reject){
      collectionObj.count = collectionObj.fileInfo.length;
      
      // var writeTemp = '';
      // for(var index = 0;index<collectionObj.fileInfo.length;index ++){
      //   writeTemp += `set ${collectionObj.infoName}:${collectionObj.fileInfo[index].subFolder}${collectionObj.fileInfo[index].fileName} 0\n`;
      // }
      
      var wstream = fs.createWriteStream('i:/test.txt');
      
      for(var index = 0;index<collectionObj.fileInfo.length;index ++){
        if(index%100 === 0 ){
          console.log(index)
        }
        wstream.write(`set '${collectionObj.infoName}:${collectionObj.fileInfo[index].subFolder}${collectionObj.fileInfo[index].fileName}' 0\n`);
      }
      wstream.end();
      
      //   redisClient.set('section|'+collectionObj.infoName+'|'+collectionObj.sectionName,JSON.stringify(collectionObj),function(err,res){
      //   if(!err){
      //     console.log('保存:'+'section|'+collectionObj.infoName+'|'+collectionObj.sectionName+'成功!');
      //     resolve();
      //   }else{
      //     console.log(err);
      //     reject();
      //   }
      // });
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




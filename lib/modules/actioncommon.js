'use strict'
const dConfig = require('../../config.json');
const fs = require('fs');
const redis = require('redis');
const redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);
const ini = require('../utils/ini');
const csv = require('../utils/csv');

//获取最终保存的对象
exports.getCollectionObjList = function(trgFile){
  console.log('0.读取TRG文件:'+trgFile);
  let trgStr = fs.readFileSync(trgFile,'utf-8');
  console.log('1.转化TRG文件:'+trgFile);
  let trgObj = this.formatTRGObj(trgStr);
  console.log('2.分析TRG文件:'+trgFile);
  let collectionObjList = this.parseTRGObj2CollectionObj(trgObj);

  return this.readFileInfo(collectionObjList);
}

//trg文件内容转换成对象
exports.formatTRGObj = function(trgStr){
  let trgObj = ini.parse(trgStr);
  return trgObj;
}

//trg对象转换成collection对象
exports.parseTRGObj2CollectionObj = function(trgObj){
  var collectionObjList = [];
  try{
    if(trgObj.hasOwnProperty('INFO')){

      for(var p in trgObj){
        if(p){
          if(p !== 'INFO'){
            if(trgObj[p].csv){
              let collectionObj = {};
              collectionObj.infoName = trgObj['INFO'].name;
              collectionObj.sectionName = p;
              collectionObj.csvPath = trgObj[p].csv.replace(/\"/g,'');      //csv地址
              collectionObj.reportPath = trgObj[p].rep.replace(/\"/g,'');   //report地址
              collectionObj.sectionPath = trgObj[p].path.replace(/\"/g,''); //保存目录
              collectionObjList.push(collectionObj);
            }
          }
        }
      }
      return collectionObjList;
    }else{
      return [];
    }
  }catch(e){
    console.log(e);
    return [];
  }
}

//读取collection对象内的所有文件
exports.readFileInfo = function(collectionObjList){
  console.log('readFileInfo');
  for(var index = 0;index<collectionObjList.length;index++){
    console.log('3.读取csv文件:'+collectionObjList[index].csvPath);
    collectionObjList[index].fileInfo = csv.readSync(collectionObjList[index].csvPath);
    if(collectionObjList[index].fileInfo.length>0){
      console.log('3.读取csv文件成功:'+collectionObjList[index].csvPath);
    }
  }
  return collectionObjList;
}

//保存至redis
exports.saveRedis = function(key,value){
  console.log('保存:'+key);
  redisClient.set(key,value);
  console.log('保存:'+key+'成功!!!!!!!');
}




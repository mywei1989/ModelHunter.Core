'use strict'
var heapdump = require('heapdump');
const dConfig = require('../../config.json');
const fs = require('fs');
const ini = require('../utils/ini');
const csv = require('../utils/csv');
const redis = require('redis');
const actioncommon = require('../modules/actioncommon');
const redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);
const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();

let trgFilesList = [];

exports.init = function(){
  let createPromise = new Promise(function(resolve,reject){
    fs.readdir(dConfig.triggersPath,function(err,files){
      if(!err){

        resolve(files);
      }else{
        reject(err);
      }
    });
  });
  createPromise.then(function(trgFiles){
    trgFilesList = trgFiles;
    ee.emit('TRGListPop');
  });
}

exports.create = function(trgFile){
  let trgFilePath = dConfig.triggersPath+trgFile;

  console.log(trgFilePath);
  let collectionObjList = actioncommon.getCollectionObjList(trgFilePath);
  let saveTRGPromiseList = collectionObjList.map(function(collectionObj,index){
    return new Promise(function(resolve,reject){
      collectionObj.count = collectionObj.fileInfo.length;
      
      redisClient.set('section_'+collectionObj.sectionName,JSON.stringify(collectionObj),function(err,res){
        if(!err){
          console.log('保存:'+collectionObj.sectionName+'成功!');
          resolve();
        }else{
          reject();
        }
      });
    });
  });
  Promise.all(saveTRGPromiseList).then(function(){
    saveTRGPromiseList = null;
    //ee.emit('TRGListPop');
  });
}

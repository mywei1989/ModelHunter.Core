var dConfig = require('../../config.json');
var Q = require('q');
var fs = require('fs');
var ini = require('../utils/ini');

exports.init = function(){
  var createPromise = new Promise(function(resolve,reject){
    fs.readdir(dConfig.triggersPath,function(err,files){
      if(!err){
        resolve(files);
      }else{
        reject(err);
      }
    });
  });
  createPromise.then(function(trgFiles){
    var iniPromiseArray = [];
    //var collectionObjList = [];
    trgFiles.forEach(function(trgFile,index){
      var readTRGPromise = new Promise(function(resolve,reject){
        fs.readFile(dConfig.triggersPath+trgFile,'utf-8',function(err,trgStr){
          if(!err){
            resolve(trgStr);    
          }else{
            console.log('reject err!!!')
            reject(err);
          }
        });
      });
      readTRGPromise.then(function(trgStr){
        var collectionObjList = [];
        var trgObj = ini.parse(trgStr);
        //判断 TRG文件内是否包含INFO 
        if(trgObj.hasOwnProperty('INFO')){

          var collectionObj = {};
          collectionObj.infoName = trgObj['INFO'].name;
          //遍历TRG文件内 非INFO的 section
          Object.keys(trgObj).filter(function(value){
          return value !== 'INFO' && value.toLowerCase();
          }).forEach(function(section,index){
            if(trgObj[section].csv){
              collectionObj.sectionName = section;
              collectionObj.csvPath = trgObj[section].csv;      //csv地址
              collectionObj.reportPath = trgObj[section].rep;   //report地址
              collectionObj.sectionPath = trgObj[section].path; //保存目录
              collectionObjList.push(collectionObj);
            }
          });
          resolve(collectionObjList);
        }else{
          resolve([]);            
        }
      });

      iniPromiseArray.push(readTRGPromise);
    });
    Promise.all(iniPromiseArray).then(function(collectionObjListAll){
      console.log('Promise.all');
      console.log(collectionObjListAll[2]);
    });

  }).catch(function(err){
    console.log(err)
  });
}

/*exports.init = function(){
  var createPrimise = Q.nfcall(fs.readdir,dConfig.triggersPath).then(function(files){
    files.forEach(function(file,index){
      if(index === 0){
        var a = new Promise(function(resolve,reject){

        })
        var iniPrimise = Q.nfcall(fs.readFile,dConfig.triggersPath+file,'utf-8');
        iniPrimise.then(function(str){
          var trgObj = ini.parse(str);
        });
      }
      
    });
  },function(err){
    console.log(err);
  }).then().done(function(){
    console.log('create completd!!!!!');
  });
}
*/
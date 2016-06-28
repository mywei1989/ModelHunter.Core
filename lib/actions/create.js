var dConfig = require('../../config.json');
var Q = require('q');
var fs = require('fs');
var ini = require('../utils/ini');
var csv = require('../utils/csv');

function ReadTRGFile(trgFile){
  return new Promise(function(resolve,reject){
    fs.readFile(dConfig.triggersPath+trgFile,'utf-8',function(err,trgStr){
      err ? reject(err) : resolve(trgStr); 
    });
  });
}

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
    var readTRGPromiseList = trgFiles.map(function(trgFile){
      return new Promise(function(resolve,reject){
        fs.readFile(dConfig.triggersPath+trgFile,'utf-8',function(err,trgStr){
          err ? reject(err) : resolve(trgStr); 
        });
      });
    });

    return Promise.all(readTRGPromiseList);
  }).then(function(trgStrs){
    var formatTRGObjPromiseList = trgStrs.map(function(trgStr){
      return new Promise(function(resolve,reject){
        var collectionObjList = [];
        var trgObj = ini.parse(trgStr);
        //判断 TRG文件内是否包含INFO 
        if(trgObj.hasOwnProperty('INFO')){
          var collectionObj = {};
          collectionObj.infoName = trgObj['INFO'].name;
          //遍历TRG文件内 非INFO的 section
          Object.keys(trgObj).filter(function(value){
            return value !== 'INFO'
          }).forEach(function(section,index){
            if(trgObj[section].csv){
              collectionObj.sectionName = section;
              collectionObj.csvPath = trgObj[section].csv.replace(/\"/g,'');      //csv地址
              collectionObj.reportPath = trgObj[section].rep.replace(/\"/g,'');   //report地址
              collectionObj.sectionPath = trgObj[section].path.replace(/\"/g,''); //保存目录
              collectionObjList.push(collectionObj);
            }
          });
        }
        resolve(collectionObjList);
      });
    });
    return Promise.all(formatTRGObjPromiseList);
  }).then(function(infoObjList){
    var infoObjs = [];
    infoObjList.forEach(function(infoObj){
      infoObjs = infoObjs.concat(infoObj);
    });

    var readCSVPromiseList = infoObjs.map(function(infoObj){
      //return csv.read(infoObj.csv);
      console.log(infoObj.csvPath)
    });

    //return Promise.all(readCSVPromiseList)
  }).then(function(r){

  });

  /*var collectionObjList = [];
  createPromise.then(function (trgFiles){
    var readTRGPromiseList = [];
    trgFiles.forEach(function(trgFile,index){
      var readTRGPromise = new Promise(function(resolve,reject){
        fs.readFile(dConfig.triggersPath+trgFile,'utf-8',function(err,trgStr){
          if(!err){
            resolve(trgStr);    
          }else{
            console.log('reject err!!!');
            reject(err);
          }
        });
      });
      readTRGPromise.then(function(trgStr){
        var trgObj = ini.parse(trgStr);
        //判断 TRG文件内是否包含INFO 
        if(trgObj.hasOwnProperty('INFO')){
          var collectionObj = {};
          collectionObj.infoName = trgObj['INFO'].name;
          //遍历TRG文件内 非INFO的 section
          Object.keys(trgObj).filter(function(value){
            return value !== 'INFO'
          }).forEach(function(section,index){
            if(trgObj[section].csv){
              collectionObj.sectionName = section;
              collectionObj.csvPath = trgObj[section].csv.replace(/\"/g,'');      //csv地址
              collectionObj.reportPath = trgObj[section].rep.replace(/\"/g,'');   //report地址
              collectionObj.sectionPath = trgObj[section].path.replace(/\"/g,''); //保存目录
              collectionObjList.push(collectionObj);
            }
          });

          return collectionObjList;
        }
      });
      readTRGPromiseList.push(readTRGPromise);
    });
    return Promise.all(readTRGPromiseList);
  });

  createPromise.then(function(r){
    console.log(r)
  });*/


};

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
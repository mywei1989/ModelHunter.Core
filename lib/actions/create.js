var dConfig = require('../../config.json');
var Q = require('q');
var fs = require('fs');
var ini = require('../utils/ini');
var csv = require('../utils/csv');
var redis = require('redis');
var redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);


exports.init = function(){
  var createPromise = new Promise(function(resolve,reject){
    //console.log('0.开始读取TRG文件列表...');
    fs.readdir(dConfig.triggersPath,function(err,files){
      if(!err){
        resolve(files);
      }else{
        reject(err);
      }
    });
  });

  createPromise.then(function(trgFiles){
    console.log('0.读取TRG文件列表成功...');
    console.log('1.开始分析TRG文件...');
    var readTRGPromiseList = trgFiles.map(function(trgFile,index){
      var trgFilePath = dConfig.triggersPath+trgFile;
      console.log('1-'+index+'.开始分析TRG文件:'+trgFilePath);
      return new Promise(function(resolve,reject){
        fs.readFile(trgFilePath,'utf-8',function(err,trgStr){
          if(err){
            console.log('1-'+index+'.分析TRG文件:'+trgFilePath+'失败...');
            reject(err);
          }else{
            console.log('1-'+index+'.分析TRG文件:'+trgFilePath+'成功...');
            resolve(trgStr); 
          }
        });
      }).catch(function(err){
        console.log(err);
      });
    });
    return Promise.all(readTRGPromiseList);
  }).then(function(trgStrs){
    console.log('1.分析TRG文件成功...');
    console.log('2.开始转换TRG文件...');
    var formatTRGObjPromiseList = trgStrs.filter(function(value){
      return !!value;
    }).map(function(trgStr,index){
      return new Promise(function(resolve,reject){
        var collectionObjList = [];
        try{
          var trgObj = ini.parse(trgStr);
          //判断 TRG文件内是否包含INFO 
          if(trgObj.hasOwnProperty('INFO')){
            //遍历TRG文件内 非INFO的 section
            Object.keys(trgObj).filter(function(value){
              return value !== 'INFO'
            }).forEach(function(section,index){
              if(trgObj[section].csv){
                var collectionObj = {};
                collectionObj.infoName = trgObj['INFO'].name;
                collectionObj.sectionName = section;
                collectionObj.csvPath = trgObj[section].csv.replace(/\"/g,'');      //csv地址
                collectionObj.reportPath = trgObj[section].rep.replace(/\"/g,'');   //report地址
                collectionObj.sectionPath = trgObj[section].path.replace(/\"/g,''); //保存目录
                collectionObjList.push(collectionObj);
              }
            });
          }
          console.log('2.转换TRG文件'+index+'成功...');
          resolve(collectionObjList);
        }catch(e){
          console.log('2.转换TRG文件'+index+'失败...');
          reject(e);
        }
      }).catch(function(err){
        console.log(err);
      });
    });
    return Promise.all(formatTRGObjPromiseList);
  }).then(function(infoObjList){
    console.log('2.转换TRG文件成功...');
    console.log('3.开始整合所有TRG分析结果...');
    var infoObjs = [];
    infoObjList.forEach(function(infoObj){
      infoObjs = infoObjs.concat(infoObj);
    });

    for(var i=0;i<infoObjs.length;i++){
      console.log('4-'+i+'.开始读取csv文件'+infoObjs[i].csvPath);
      infoObjs[i].fileInfo = csv.readSync(infoObjs[i].csvPath);
    }

    return infoObjs;

    /*var readCSVPromiseList = infoObjs.map(function(infoObj,index){
      console.log('4-'+index+'.开始读取csv文件'+infoObj.csvPath);
      if(infoObj.csvPath.indexOf('ALS-Classic-Jana-Shoot-')>0){
        console.log(infoObj)
      }
      return csv.read(infoObj.csvPath,infoObj).catch(function(err){
        console.log('4.读取csv文件'+infoObj.csvPath+'失败...');
        console.log(err);
      });
    });

    return Promise.all(readCSVPromiseList);*/
    
  }).then(function(collectionObjList){
    console.log('4.读取所有csv文件成功...');
    console.log('5.开始保存...');

    var redisPromiseList = collectionObjList.map(function(collectionObj,index){
      return new Promise(function(resolve,reject){
        redisClient.set(collectionObj.sectionName,JSON.stringify(collectionObj),function(err,res){
          if(err){
            console.log('5-'+index+'.'+collectionObj.sectionName+'保存失败...');
            reject(err);
          }else{
            console.log('5-'+index+'.'+collectionObj.sectionName+'保存成功...');
            resolve(res);
          }
        });
      });
    });    
    return Promise.all(redisPromiseList);
  }).then(function(redisResult){
    console.log('5.保存完毕...')
    process.exit();
  });

};

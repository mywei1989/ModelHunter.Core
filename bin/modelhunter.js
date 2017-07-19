var child_process = require('child_process');
var fs = require('fs');
var os = require('os');
var program = require('commander');
var path = require('path');

var dConfig = require('../config.json');



const EventEmitter = require('events').EventEmitter;
const ee = new EventEmitter();

var config = require('../config.json');


var DEFAULT_TRG_PATH = config.triggersPath;

var CUR_DIR = process.cwd();
var DEFAULT_GAME_SERVER_DIR = CUR_DIR;

// program.command('start')
//   .description('start the application')
//   .option('-d, --directory, <directory>', 'triggers path', DEFAULT_TRG_PATH)
//   .action(function(opts) {
//     start(opts);
//   });

program.command('create')
  .description('start create')
  .option('-d, --directory, <directory>', 'triggers path', DEFAULT_TRG_PATH)
  .action(function(opts) {
    create(opts);
  });

program.command('read')
  .description('start create')
  .action(function(opts) {
    read(opts);
  });



// program.command('update')
//   .description('start update triggers')
//   .option('-d, --directory, <directory>', 'triggers path', DEFAULT_TRG_PATH)
//   .action(function(opts) {
//     create(opts);
//   });

program.parse(process.argv);


function read(){
  
}



var trgFilesList = [];
var workers = [];
function create(opts){
  var numWorkers = require('os').cpus().length;
  /*for(var i = 0;i<numWorkers;i++){
    workers.push()
  }*/

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
    trgFilesList = trgFiles;
    // for(var i=0;i<4;i++){
    //  ee.emit('TRGListPop');
    // }

    ee.emit('TRGListPop');
    //console.log(trgFilesList)
  });
}

ee.on('TRGListPop',function(){
  if(trgFilesList.length>0){
    ee.emit('TRGHandle',trgFilesList.pop());
  }else{
    ee.emit('TRGHandleEnd');
  }
});

ee.on('TRGHandle',function(trgFile){
  var absScript = path.resolve(process.cwd()+'/lib/', 'modelhunter.js');

  if(trgFile){
    // spawn
    var child = child_process.spawn(process.argv[0],[absScript,'create','--path=' + dConfig.triggersPath + trgFile]);
    child.stdout.on('data', function(data){
      console.log(`${data}`);
    });
    child.stdout.on('end', function(){
      fs.appendFileSync(dConfig.logsPath+'end.log',dConfig.triggersPath + trgFile+'\n');
    });
    child.on('error', function(err){
      //console.log('Failed to start child process.');
      fs.appendFileSync(dConfig.logsPath+'error.log',dConfig.triggersPath + trgFile+'\n');
      ee.emit('TRGListPop');
    });
    child.on('close',function(code){
      //console.log('处理完成:'+dConfig.triggersPath + trgFile);
      fs.appendFileSync(dConfig.logsPath+'close.log',dConfig.triggersPath + trgFile+'\n');
      ee.emit('TRGListPop');
    });


    //fork
    // var child = child_process.fork(absScript,['create','--path=' + dConfig.triggersPath + trgFile]);
    // /*child.on('message',function(m){
    //   console.log('message:'+ m);
    // });*/
    // child.on('close',function(code){
    //   ee.emit('TRGListPop');
    // });

    // child.on('error',function(err){
    //   console.log('err:'+err);
    // });
    // //child.send(dConfig.triggersPath + trgFile);
  }
  
});

ee.on('TRGHandleEnd',function(trgFile){
  console.log('create complate!!!!!');
});



/*ee.on('TRGHandle',function(trgFile){
  console.log(trgFile);
  var trgFilePath = dConfig.triggersPath+trgFile;
  var collectionObjList = actioncommon.getCollectionObjList(trgFilePath);
  var saveTRGPromiseList = collectionObjList.map(function(collectionObj,index){
    return new Promise(function(resolve,reject){
      collectionObj.count = collectionObj.fileInfo.length;
    
      redisClient.get('section_'+collectionObj.sectionName,function(err,reply){
        if(!err && reply){
          var collectionObjOld = JSON.parse(reply);
          if(collectionObj.count !== collectionObjOld.count){
            redisClient.set('section_'+collectionObj.sectionName,JSON.stringify(collectionObj),function(err,res){
              if(!err){
                console.log('保存:'+collectionObj.sectionName+'成功!');
                resolve();
              }else{
                reject();
              }
            });
          }else{
            console.log(collectionObj.sectionName+'一致');
            resolve();
          }
        }else{
          console.log(err);
          reject();
        }
      });
    });
  });
  Promise.all(saveTRGPromiseList).then(function(){
    saveTRGPromiseList = null;
    ee.emit('TRGListPop');
  });
});

ee.on('TRGHandleEnd',function(){
  console.log('完成!!!!!!!!!!!!!!!!!');
  process.exit();
});*/

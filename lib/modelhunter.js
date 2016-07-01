var fs = require('fs');
var ModelHunter = require('./core');

var dConfig = require('../config.json');
var redis = require('redis');
var redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);
var csv = require('./utils/csv');

var actionType = process.argv[2];

if(actionType){
  switch(actionType){
    case 'create':
      return ModelHunter.action.create.init();
    break;
  }
}else{
  console.log('create:创建数据库\nupdate:更新数据库');
  
  /*var aa = csv.read2('G:/pscU/@pscU/@CSV/Asian Websites - The Black Alley/Pictures DVD 01-25/TheBlackAlley-Pictures-DVD01(Final)_11947.csv');
  aa.then(function(r){
    console.log(r);
    process.exit();
  })*/
 
  /*var aaa= ModelHunter.util.csv.read();
  aaa.then(function(x){
    console.log(x[1]);
  });*/

  //ModelHunter.action.create.init();
  /*var aaa = ModelHunter.util.ini.parse(fs.readFileSync('D:/mIRC/PhotoServe/Triggers/TBA.TRG', 'utf-8'));
  console.log(aaa);*/

  /*redisClient.get('LSDVD1',function(err,reply){
      console.log(reply.toString())
  });*/

  var aa = csv.read2('G:/pscU/@pscU/@CSV/ALS Scan - Pics/ALS Scan/ALS-Classic-Jana-Shoot-#2-DVD1(Final)_1889.csv');
  aa.then(function(r){
    console.log(r[11]);
  });
}

module.exports = ModelHunter;
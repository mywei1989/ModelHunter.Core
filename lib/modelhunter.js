var fs = require('fs');
var ModelHunter = require('./core');

var actionType = process.argv[2];

if(actionType){
  switch(actionType){
    case 'create':
      ModelHunter.action.create.init();
    break;
  }
}else{
  console.log('create:创建数据库\nupdate:更新数据库');
  /*var aaa= ModelHunter.util.csv.read();
  aaa.then(function(x){
    console.log(x[1]);
  });*/

  ModelHunter.action.create.init();
  /*var aaa = ModelHunter.util.ini.parse(fs.readFileSync('D:/mIRC/PhotoServe/Triggers/TBA.TRG', 'utf-8'));
  console.log(aaa);*/
}

module.exports = ModelHunter;
var fs = require('fs');
var program = require('commander');
var trgs = require('./components/trgs2');
var hunter = require('./components/hunter');

var ModelHunter = module.exports = {};

/*process.on('message',function(m){
  console.log('chilid Listen:', m);
});*/

program.command('create')
  .description('create')
  .option('-p, --path, <file>', 'triggers path', '')
  .action(function(opts) {
    if(opts.path.length>0){
      console.log(opts.path);
      trgs.create(opts.path);
    }
  });

program.command('read')
  .description('create')
  .option('-n, --name, <modelname>', 'modelname', '')
  .action(function(opts) {
    if(opts.name.length>0){
      //console.log(opts.path);

      hunter.read(opts.name)

    }
  });

program.parse(process.argv);

/*var trgFile = process.argv[2];
console.log(trgFile);*/



/*const ModelHunter = require('./core');

const dConfig = require('../config.json');
const redis = require('redis');
const redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);
const csv = require('./utils/csv');
const stream = require('stream');

const actionType = process.argv[2];

if(actionType){
  switch(actionType){
    case 'create':
      return ModelHunter.action.create.init();
    break;
    case 'update':
      return ModelHunter.action.update.init();
  }
}else{
  console.log('create:创建数据库\nupdate:更新数据库');
  process.exit();
}

module.exports = ModelHunter;*/
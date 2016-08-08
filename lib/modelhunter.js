const ModelHunter = require('./core');

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

module.exports = ModelHunter;
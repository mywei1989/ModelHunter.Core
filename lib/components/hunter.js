var dConfig = require('../../config.json');
var fs = require('fs');
var redis = require('redis');
var redisClient = redis.createClient(dConfig.redisPort,dConfig.redisHost);

module.exports.read = function(modelName){
  //console.log(modelName);
  // redisClient.get("section|Asian Websites - The Black Alley|TBADVD15", function(err, reply) {
  //   // reply is null when the key is missing 
  //   fs.appendFileSync(dConfig.logsPath+'read2.log',reply+'\n');
  //   process.exit(0)
  // });

  redisClient.multi()
    .keys("section|Asian Websites - The Black Alley|TBADVD1*", function (err, replies) {
        // NOTE: code in this callback is NOT atomic 
        // this only happens after the the .exec call finishes. 
        redisClient.mget(replies);
    })
    .dbsize()
    .exec(function (err, replies) {
        //console.log("MULTI got " + replies.length + " replies");
        replies.forEach(function (reply, index) {
            //console.log("Reply " + index + ": " + reply.toString());
            fs.appendFileSync(dConfig.logsPath+'read2.log',"Reply " + index + ": " + reply.toString()+'\n');
            process.exit(0)
        });
    });
  
}

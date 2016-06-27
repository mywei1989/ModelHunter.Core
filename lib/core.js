var fs = require('fs');
var util =  require('./util');

var ModelHunter = { 
  //util:util,
  action:require('./action'),
};

//var config = ModelHunter.util.int.parse(fs.readFileSync('D:/mIRC/PhotoServe/Triggers/TBA.TRG', 'utf-8'));

/*ModelHunter.csv.generate({seed: 1, columns: 2, length: 20}, function(err, data){
  
  ModelHunter.csv.parse(data, function(err, data){

    ModelHunter.csv.transform(data, function(data){
      return data.map(function(value){return value.toUpperCase()});
    }, function(err, data){
      ModelHunter.csv.stringify(data, function(err, data){
        //process.stdout.write(data);
        console.log(data);
      });
    });
  });
});*/

/*var testStr = fs.readFileSync('G:/pscU/@pscU/@CSV/Fine Art Erotica - Lizzie Secret/Lizzie Secret Pictures/LizzieSecret-DVD023(Final)_1468.csv', 'utf-8');
var testStr2 = fs.readFileSync('G:/pscU/@pscU/@CSV/Fine Art Erotica - Lizzie Secret/Lizzie Secret Pictures/LizzieSecret-DVD022(Final)_1171.csv', 'utf-8');

ModelHunter.csv.parse(testStr,{strict:true},function(err,data){
  console.log(data)
});*/

//var testStr3 = '001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
//  正则匹配 以 \ *** \ 拆分
//console.log(testStr3.split(/\,\\.+\\\,/));
//  正则匹配 \ \之间的内容   \2011-08-01 - Lizzie Ryan - Sunny, Cloudy\
//console.log(testStr3.match(/\\.+\\/).toString());


//console.log(process.env);
module.exports = ModelHunter;
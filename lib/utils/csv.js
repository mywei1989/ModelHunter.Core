var fs = require('fs');
var Q = require('q');
var readline = require('readline');

exports.isExits = function(){

};

exports.read = function(csvPath,infoObj){
  var readCSVPromise = new Promise(function(resolve,reject){

    var fileInfoArray = [];
    //console.log(csvPath);
    var rd = readline.createInterface({
      input:fs.createReadStream(csvPath),
      output:process.stdout,
      terminal:false
    });

    rd.on('line',function(line){
      var fileInfo = {};
      //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
      //'001.jpg,4249977,49eea91b',''
      var tempSplit1 = line.split(/\,\\.+\\\,/g);
      //'001.jpg,4249977,49eea91b'
      //'001.jpg','4249977','49eea91b'
      var tempSplit2 = tempSplit1[0].split(',');

      var subFolderTemp = line.match(/\\.+\\/g);
      var subFolder = subFolderTemp?subFolderTemp.toString():'\\';

      fileInfo.fileName = tempSplit2[0];
      fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
      fileInfo.CRC32 = tempSplit2[2];
      fileInfo.remark = tempSplit1[1];
      fileInfo.subFolder = subFolder;
      fileInfo.status = 0;
      fileInfoArray.push(fileInfo);
    });
    rd.on('close',function(){
      infoObj.fileInfo = fileInfoArray;
      resolve(infoObj);
    });
    rd.on('error',function(err){
      reject(err);
    })
  });
  return readCSVPromise;
};

exports.readSync = function(csvPath){
  var csvString = fs.readFileSync(csvPath,'utf8');
  var lines = csvString.split(/\r*\n/g);
  var fileInfoArray = [];
  lines.forEach(function(line,index){
    if(line){
      var fileInfo = {};
      //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
      //'001.jpg,4249977,49eea91b',''
      var tempSplit1 = line.split(/\,\\.+\\\,/g);
      //'001.jpg,4249977,49eea91b'
      //'001.jpg','4249977','49eea91b'
      var tempSplit2 = tempSplit1[0].split(',');
      var subFolderTemp = line.match(/\\.+\\/g);
      var subFolder = subFolderTemp?subFolderTemp.toString():'\\';
      fileInfo.fileName = tempSplit2[0];
      fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
      fileInfo.CRC32 = tempSplit2[2];
      fileInfo.remark = tempSplit1[1];
      fileInfo.subFolder = subFolder;
      fileInfo.status = 0;
      fileInfoArray.push(fileInfo);
    }
  });
  return fileInfoArray;
}

/*exports.readSync = function(csvPath){
  var fileInfoArray = [];
  //console.log(csvPath);
  var rd = readline.createInterface({
    input:fs.createReadStream(csvPath),
    output:process.stdout,
    terminal:false
  });
  rd.on('line',function(line){
    var fileInfo = {};
    //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
    //'001.jpg,4249977,49eea91b',''
    var tempSplit1 = line.split(/\,\\.+\\\,/g);
    //'001.jpg,4249977,49eea91b'
    //'001.jpg','4249977','49eea91b'
    var tempSplit2 = tempSplit1[0].split(',');
    var subFolderTemp = line.match(/\\.+\\/g);
    var subFolder = subFolderTemp?subFolderTemp.toString():'\\';
    fileInfo.fileName = tempSplit2[0];
    fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
    fileInfo.CRC32 = tempSplit2[2];
    fileInfo.remark = tempSplit1[1];
    fileInfo.subFolder = subFolder;
    fileInfo.status = 0;
    fileInfoArray.push(fileInfo);
  });
  rd.on('close',function(){
    console.log(111111111)
    console.log(fileInfoArray);
    return fileInfoArray;
  });
  rd.on('error',function(err){
    //console.log(err);
  });
};



exports.read2 = function(csvPath){
  var readCSVPromise = new Promise(function(resolve,reject){
    var fileInfoArray = [];
    //console.log(csvPath);
    var rd = readline.createInterface({
      input:fs.createReadStream(csvPath),
      output:process.stdout,
      terminal:false
    });

    rd.on('line',function(line){
      var fileInfo = {};
      //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
      //'001.jpg,4249977,49eea91b',''
      var tempSplit1 = line.split(/\,\\.+\\\,/g);
      //'001.jpg,4249977,49eea91b'
      //'001.jpg','4249977','49eea91b'
      var tempSplit2 = tempSplit1[0].split(',');
      var subFolder = line.match(/\\.+\\/g).toString();

      fileInfo.fileName = tempSplit2[0];
      fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
      fileInfo.CRC32 = tempSplit2[2];
      fileInfo.remark = tempSplit1[1];
      fileInfo.subFolder = subFolder;
      fileInfo.status = 0;
      fileInfoArray.push(fileInfo);
    });
    rd.on('close',function(){
      fileInfoArray;
      resolve(fileInfoArray);
    });
  });
  return readCSVPromise;
};*/

/*exports.read = function(csvPath){
  var deferred = Q.defer();
  var fileInfoArray = [];
  var rd = readline.createInterface({
    input:fs.createReadStream('G:/pscU/@pscU/@CSV/Asian Websites - The Black Alley/Pictures DVD 01-25/TheBlackAlley-Pictures-DVD01(Final)_11947.csv'),
    output:process.stdout,
    terminal:false
  });

  rd.on('line',function(line){
    var fileInfo = {};
    //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
    //'001.jpg,4249977,49eea91b',''
    var tempSplit1 = line.split(/\,\\.+\\\,/g);
    //'001.jpg,4249977,49eea91b'
    //'001.jpg','4249977','49eea91b'
    var tempSplit2 = tempSplit1[0].split(',');
    var subFolder = line.match(/\\.+\\/g);

    fileInfo.fileName = tempSplit2[0];
    fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
    fileInfo.CRC32 = tempSplit2[2];
    fileInfo.remark = tempSplit1[1];
    fileInfo.subFolder = subFolder;
    fileInfo.status = 0;
    fileInfoArray.push(fileInfo);
  });
  rd.on('close',function(){
    deferred.resolve(fileInfoArray);
  });

  return deferred.promise;
};*/

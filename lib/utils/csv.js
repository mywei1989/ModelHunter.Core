var fs = require('fs');
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
  var lines = csvString.split(/[\r\n]+/g);
  var fileInfoArray = [];

  for(var index = 0;index<lines.length;index++){
    try{
      if(lines[index]){
        var fileInfo = {};
        //'001.jpg,4249977,49eea91b,\\2011-08-01 - Lizzie Ryan - Sunny, Cloudy\\,';
        //'001.jpg,4249977,49eea91b',''
        var tempSplit1 = lines[index].split(/\,\\.+\\\,/g);
        //'001.jpg,4249977,49eea91b'
        //'001.jpg','4249977','49eea91b'
        var tempSplit2 = tempSplit1[0].split(',');
        var subFolderTemp = lines[index].match(/\\.+\\/g);
        var subFolder = subFolderTemp?subFolderTemp.toString():'\\';
        fileInfo.fileName = tempSplit2[0];
        fileInfo.size = parseInt(tempSplit2[1])?parseInt(tempSplit2[1]):0;
        fileInfo.CRC32 = tempSplit2[2];
        fileInfo.remark = tempSplit1[1];
        fileInfo.subFolder = subFolder;
        fileInfo.status = 0;
        fileInfoArray.push(fileInfo);
      }
    }catch(e){ 
      //console.log(e);
      continue;
    }
  }
  return fileInfoArray;
}

exports.readSync2 = function(csvPath){
  var csvString = fs.readFileSync(csvPath,'utf8');
  var lines = csvString.split(/[\r\n]+/g);
  var fileInfoArray = [];

  for(var index = 0;index<lines.length;index++){
    try{
      if(lines[index]){
        var fileInfo = {};
        var tempSplit1 = lines[index].split(/\,\\.+\\\,/g);
        var tempSplit2 = tempSplit1[0].split(',');
        var subFolderTemp = lines[index].match(/\\.+\\/g);
        var subFolder = subFolderTemp?subFolderTemp.toString():'\\';
        fileInfo.fileName = tempSplit2[0];
        fileInfo.subFolder = subFolder;
        fileInfo.status = 0;
        fileInfoArray.push(fileInfo);
      }
    }catch(e){ 
      //console.log(e);
      continue;
    }
  }
  
  return fileInfoArray;
}


//Asian Websites - The Black Alley\\Videos\\ASIA The Black Alley Videos DVD39\\Aeko Jung - Behind Scence Video 01\\aeko-jung-04h.avi


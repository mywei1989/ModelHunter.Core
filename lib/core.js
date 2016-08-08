'use strict'
const fs = require('fs');
const util =  require('./util');

/*var ModelHunter = { 
  //util:util,
  action:require('./action'),
};*/

class ModelHunter {
  constructor() {
  }
}
ModelHunter.action = require('./action');

module.exports = ModelHunter;
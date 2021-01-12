'use strict'
const { groupEnd } = require('console');
const fs = require('fs');

function getAllJsonStorage(){
  let rawdata = fs.readFileSync('db.json');
  return JSON.parse(rawdata);
}

function addJsonStorage(dados) {
  let data = getAllJsonStorage();

  data.push(dados);
  data = JSON.stringify(data);
  fs.writeFileSync('db.json', data);
}

function deleteJsonStorage(id) {

}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
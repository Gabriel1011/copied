'use strict'
const { groupEnd } = require('console');
const fs = require('fs');

function getAllJsonStorage(){
  let rawdata = fs.readFileSync('db.json');
  return JSON.parse(rawdata);
}

function addJsonStorage(item) {
  let data = getAllJsonStorage();

  data.push(item);
  salvarElementos(data);
}

function deleteJsonStorage(item) {
  let data = getAllJsonStorage();
  data = data.filter((value, index, arr)=> {
    return value.texto != item.texto;
  })

  salvarElementos(data);
}

function salvarElementos(data){
  data = JSON.stringify(data);
  fs.writeFileSync('db.json', data);
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
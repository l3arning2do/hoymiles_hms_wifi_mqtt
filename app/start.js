const config = require("./config");
const express = require('express');
const hoymilesWifi = require('./hoymilesWifi.js');
const mqttTools = require('./mqttTools.js');
const cron = require('node-cron');

let dtuList = [];
const app = express();
const PORT = 3157;
const hoymiles = new hoymilesWifi(config.hosts);
const mqtt = new mqttTools();
let mqttEnabled = mqtt.Enable;
// start retrive of elements
hoymiles.getDTUDatas('get-real-data-new').then((datas) => {
  if (config.mqtt.enable) mqtt.connect();
  //dtuList = Object.assign({}, ...datas.data);
  dtuList = datas.data;

  app.set('view engine', 'ejs');
  app.set('views', './views');


  app.get('/', (req, res) => {
      res.render('index', { dtuList , mqttEnabled});
  });

  app.listen(PORT, () => {
    console.log(`Serveur Node.js en écoute sur ${PORT}`);
  });

  cron.schedule(config.cron, () => {
    hoymiles.getDTUDatas('get-real-data-new').then(datas => {
      // dtuList = Object.assign({}, ...datas.data);
      dtuList = datas.data;
      if (mqtt.Enable){
        mqtt.publish(datas)
      }
      
    })
  });



})









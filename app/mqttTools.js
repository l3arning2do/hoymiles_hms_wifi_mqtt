const config = require("./config");
const mqtt = require('mqtt');

class mqttTools {
    constructor(debug=false) {
        this.Enable = config.mqtt.enable;
        this.Debug = debug;
        this.mqttClient = null;
    }

    connect() {
        return new Promise((resolv,reject) => {
            this.mqttClient = mqtt.connect(config.mqtt.host, {
                username: config.mqtt.username,
                password: config.mqtt.password
            });
    
            this.mqttClient.on('connect', () => {
                console.log('✅ Connecté au broker MQTT');
                resolv(true)
            });
            
            this.mqttClient.on('error', (err) => {
                console.error('❌ Erreur MQTT:', err);
                mqttClient.end();
                reject(false)
            });
        })
    }

    publish(datas) {
        if (this.Enable) {
            let globalDatas = datas.data
            globalDatas.forEach(dtuObj => {
                const dtuName = Object.keys(dtuObj)[0];
                const dtuData = dtuObj[dtuName];
            
                // 1. root infos
                const { sgsData, pvData, ...infosRacines } = dtuData;
                this.mqttClient.publish(`${config.mqtt.topic}/${dtuName}`, JSON.stringify(infosRacines), { retain: false });
            
                // 2. sgsData
                if (Array.isArray(sgsData)) {
                    this.mqttClient.publish(`${config.mqtt.topic}/${dtuName}/sgsData`, JSON.stringify(sgsData), { retain: false });
                }
            
                // 3. pvData
                if (Array.isArray(pvData)) {
                    for(let i=0;i<pvData.length;i++) {
                        this.mqttClient.publish(`${config.mqtt.topic}/${dtuName}/pvData/${i}`, JSON.stringify(pvData[i]), { retain: false });
                    }
                    
                }
            });
            // 4. add a sum of DTU production cluster
            this.mqttClient.publish(`${config.mqtt.topic}/acPowerTotal`, JSON.stringify({"acPowerTotal":datas.acPowerTotal}), { retain: false });
            console.log(`📤 Données publiées sur le topic "${config.mqtt.topic}"`);
        }
    }
}

module.exports = mqttTools;

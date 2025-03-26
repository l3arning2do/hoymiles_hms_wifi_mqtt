module.exports = {
	"hosts":[
		// HMS WiFi IP address list
		{"name":"DTU1", "url":"192.168.1.XXX"}, // replace with your HMS IP address
		{"name":"DTU2", "url":"192.168.1.XXX"},
		{"name":"DTU3", "url":"192.168.1.XXX"}
	],
	"mqtt":{
		"enable": true, // enable/disable mqtt injection
		"host": "mqtt://192.168.1.XXX", // replace with your MQTT host
		"username": "XXX", // MQTT username
		"password": "XXX", // MQTT password
		"topic": "hms" // MQTT topic
	},
	"cron" : '* 6-22 * * *' // MQTT injection frequency,  6 to 20  every minute

}

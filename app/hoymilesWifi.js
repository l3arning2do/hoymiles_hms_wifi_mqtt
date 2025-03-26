const { exec } = require('child_process');
const fs = require('fs');
class hoymilesWifi {

    constructor(hosts, debug=false) {
        this.Hosts = hosts;
        this.Debug = debug;
        this.dryMode = false; // testing mod without true call on the DTUs, use sample instead
    }

    getDTUDatas(command,forceHost=null) {
        let hostsList = this.Hosts,
            calls = [];

        return new Promise ((resolv) => {
            if (this.dryMode) {
                let replies = JSON.parse(fs.readFileSync('./dtu_data.json', 'utf8'));
                resolv({data: replies, acPowerTotal: 3000});
            }
            else {
                if (forceHost!=null) hostsList = [{"name":"forceHost", "url":forceHost}];
                for(let i=0; i < hostsList.length; i++) {
                    calls.push(this.call(hostsList[i],command));
                }
                Promise.all(calls).then(replies => {
                    let acPower = 0;
                    for (let i =0; i< replies.length; i++)  {
                        if (replies[i] && replies[i]['DTU'+(i+1)] && replies[i]['DTU'+(i+1)].dtuPower)
                            acPower += parseInt(replies[i]['DTU'+(i+1)].dtuPower);
                    }
                    resolv({data: replies, acPowerTotal: acPower/10});
                });
            }
        })


    }

    call(host, command) {
        return new Promise ((resolv,reject) => {
	    try {
		if (this.Debug) console.log('calling :', `hoymiles-wifi --host ${host.url} --as-json ${command}`); 
		exec(`hoymiles-wifi --host ${host.url} --as-json ${command}`, (error, stdout, stderr) => {
		    if (error && this.Debug) {
			console.error(`Erreur : ${error.message}`);
		    	reject(error.message)
		    }
		    if (stderr && this.Debug) {
			console.error(`Stderr : ${stderr}`);
			reject(stderr)
		    }
		    let jsonOutput = JSON.parse(stdout);
		    resolv({[host.name]: jsonOutput});
		})
	    }
	    catch (e) {
		reject(e)
            }
        })
    }
}
module.exports = hoymilesWifi;


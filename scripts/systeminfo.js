const os = require('os');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)


async function getProcessesList() {
    const commandResult = await exec('ps aux')
    let output = commandResult.stdout;
    let outArray = []
    output = output.split('\n');
    output.shift();
    for (let item of output) {
        let splittedItem = item.split(/(\s+)/);
        let processInfo = {}
        processInfo.PID = splittedItem[2];
        processInfo.userName = splittedItem[0];
        processInfo.cpuLoad = splittedItem[4] + "%";
        processInfo.memoryLoad = splittedItem[6] + "%";
        processInfo.command = splittedItem[20]
        outArray.push(processInfo);
    }
    return outArray;
} 


async function getSystemInfo() {
    var systemData = {}
    systemData.freeMemory = os.freemem();
    systemData.hostName = os.hostname();
    systemData.cpus = os.cpus().map((object) => {
        return {
            model: object.model,
            speed: object.speed,
        }
    });
    systemData.averageLoad =  os.loadavg();    
    systemData.processesList = await getProcessesList();
    return systemData;
}

module.exports = getSystemInfo;


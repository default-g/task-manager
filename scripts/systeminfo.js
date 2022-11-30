const os = require('os');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)
const si = require('systeminformation');


async function getProcessesList() {
    let processList = await (await si.processes()).list;
    let processListMapped = [];
    for (let process of processList) {
        mappedProcess = {}
        mappedProcess.PID = process.pid;
        mappedProcess.userName = process.user;
        mappedProcess.cpuLoad = process.cpu + '%';
        mappedProcess.memoryLoad = process.mem + '%';
        mappedProcess.command = process.command;
        processListMapped.push(mappedProcess);
    }
    return processListMapped;
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


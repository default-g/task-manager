
const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const echoSocketUrl = socketProtocol + '//' + window.location.hostname + ":8999" + '/echo'
const socket = new WebSocket(echoSocketUrl);

socket.onopen = () => {
    socket.send('Connection established!');
};

socket.onmessage = message => {
    let fetchedData = JSON.parse(message.data);
    console.log(fetchedData);
    let processList = fetchedData.processesList;
    $('tbody').empty();
    for (let process of processList) {
        let row = '<tr>';
        row += '<td>' + process.PID + '</td>';
        row += '<td>' + process.userName + '</td>';
        row += '<td>' + process.cpuLoad + '</td>';
        row += '<td>' + process.memoryLoad + '</td>';
        row += '<td>' + process.command + '</td>';
        $('tbody').append(row);
    }

    let memory = fetchedData.freeMemory;
    let cpus = fetchedData.cpus;
    $('.sys').empty();
    let generateRow = (fieldName, value) => {
        let row = '<div class="row alert alert-dark">';
        row += '<div class="col">' + fieldName + '</div>';
        row += '<div class="col">' +  value + '</div>';
        row += '</div>';
        return row;
    }
    const cpuModel = fetchedData.cpus[0].model;
    const freeMemory = fetchedData.freeMemory;
    const hostname = fetchedData.hostName; 
    $('.sys').append(generateRow('HOSTNAME', hostname));
    let i = 0;
    for (let cpu of fetchedData.cpus) {
        $('.sys').append(generateRow('CPU MODEL' + (i), cpu.model));
        $('.sys').append(generateRow('CPU SPEED' + (i), cpu.speed));
        i++;
    }
    $('.sys').append(generateRow('FREE MEMORY', freeMemory));
}

$('#system-info').hide();

$('.nav-link').on('click', function(e) {
    $('.tab').hide();
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    let tabId = $(this).data('tab');
    $('#' + tabId).show();
});
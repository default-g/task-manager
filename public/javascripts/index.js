
const socketProtocol = (window.location.protocol === 'https:' ? 'wss:' : 'ws:')
const echoSocketUrl = socketProtocol + '//' + window.location.hostname + ":8999" + '/echo'
const socket = new WebSocket(echoSocketUrl);

socket.onopen = () => {
    socket.send('Connection established!');
};

socket.onmessage = message => {
    let fetchedData = JSON.parse(message.data);
    let processList = fetchedData.processesList;
    $('tbody').empty();
    for (let process of processList) {
        let row = '<tr>';
        row += '<td>' + process.PID + '</td>';
        row += '<td>' + process.userName + '</td>';
        row += '<td>' + process.cpuLoad + '</td>';
        row += '<td>' + process.memoryLoad + '</td>';
        row += '<td>' + process.command + '</td>';
        // row += '</tr>';
        $('tbody').append(row);
    }

}
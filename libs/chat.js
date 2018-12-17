module.exports = function(server) {
    var io = require('socket.io')(server);

    io.on('connection', function(socket){

        socket.on('chat message', function(msg){
            io.emit('chat message', msg);
        });

        socket.on('set-login', function(login) {
            socket.login = login;
            console.log(socket.login);
        });
    });



    return io;

};
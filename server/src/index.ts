import WebSocket from 'ws';


const wsServer = new WebSocket.Server({
    port: Number(process.env.PORT) || 8080,
    // server: ... An http server will automatically be created on the above port for us.
})

wsServer.on('connection', (_socket, _req) => {
    // remember client or something
})


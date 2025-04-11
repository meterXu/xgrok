const WebSocket = require('ws')
import AuthModel from '../oauth/password/Model.js'
export default class WS {
    constructor() {
        this.ws = null
    }

    init(server) {
        // 创建实例
        this.ws = new WebSocket.Server({ server,path: '/websockets'});
        this.ws.on('connection', async (ws, request) => {
            try {
                if(!(request.url.includes('/websockets'))){
                    return ws.close();
                }
                if(!request.headers['sec-websocket-protocol']){
                    return ws.close()
                }
                const protocols = request.headers['sec-websocket-protocol'].split(', ')
                const auth = new AuthModel({
                    headers:{
                        Authorization:protocols[0]+' '+protocols[1],
                        'x-access-token':protocols[2],
                        'x-access-time':protocols[3]
                    }
                })
                const token = await auth.getAccessToken(process.env.NODE_ENV==='development'?protocols[2]:protocols[1])
                if(!token){
                    return ws.close();
                }
                ws.userId = token.user.id
                const obj = {'type':'connection',"message":`连接成功，当前在线${this.ws._server._connections}个连接`,"retCode": 200}
                ws.send(JSON.stringify(obj))
            } catch (error) {
                console.log('websocket connection error',error)
                return ws.close();
            }
        });
    }

    sendToClient(Data) {
        if(this.ws){
            this.ws.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN && client.userId === Data.userId) {
                    client.send(JSON.stringify(Data));
                }
            });
        }
    }
}
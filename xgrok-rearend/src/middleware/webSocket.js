import {UserType as token} from "../utils/enum";

const WebSocket = require('ws')
import AuthModel from '../oauth/password/Model.js'
export default class WS {
    constructor() {
        this.ws = null
        this.clients = new Map()
    }

    init(server) {
        // 创建实例
        this.ws = new WebSocket.Server({ server,path: '/websockets'});
        this.ws.on('connection', async (_ws, request) => {
            try {
                if(!(request.url.includes('/websockets'))){
                    return _ws.close();
                }
                if(!request.headers['sec-websocket-protocol']){
                    return _ws.close()
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
                    return _ws.close();
                }
                if(this.clients.has(token.user.id)){
                    const existingClient = await this.clients.get(token.user.id)
                    existingClient.close();
                }
                _ws.userId = token.user.id;
                this.clients.set(_ws.userId, _ws);
                _ws.on('close', () => {
                    this.clients.delete(token.user.id)// 移除关闭的连接
                    console.log(`Connection closed for user ${token.user.id}`);
                })
                _ws.send(JSON.stringify({'type':'connection',"message":`连接成功，当前在线${this.clients.size}个连接`,"retCode": 200}))
            } catch (error) {
                console.log('websocket connection error',error)
                return _ws.close();
            }
        });
    }

    sendToClient(data) {
        const client = this.clients.get(data.userId)
        if(client&&client.readyState===WebSocket.OPEN){
            client.send(JSON.stringify(data))
        }
    }
}

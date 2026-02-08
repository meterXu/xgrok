import OAuthTokensService from "../service/oauthTokensService";
import {getQueryVariable} from "../utils";
import md5 from 'js-md5'
import {notifyType} from "../utils/enum";

const WebSocket = require('ws')
export default class WS {
    constructor() {
        this.ws = null
        this.clients = new Map()
        if (!this.OAuthTokensService) {
            this.OAuthTokensService = new OAuthTokensService()
        }
    }

    init(server) {
        // 创建实例
        this.ws = new WebSocket.Server({server, path: '/websockets'});
        this.ws.on('connection', async (_ws, request) => {
            try {
                if (!(request.url.includes('/websockets'))) {
                    return _ws.close();
                }
                if (!request.headers['sec-websocket-protocol']) {
                    return _ws.close()
                }
                const protocols = request.headers['sec-websocket-protocol'].split(', ')
                let token = getQueryVariable(request.url, 'token')
                let clientId = getQueryVariable(request.url, 'clientId')
                token = await this.OAuthTokensService.detailToken(token);
                if (!token || protocols[0] !== 'isaacxu') {
                    return _ws.close();
                }
                const uuid = md5(token.user_id + clientId + protocols[1]) // 同一个账号多个设备不同使用方式视为不同的连接
                if (this.clients.has(uuid)) {
                    const existingClient = await this.clients.get(uuid)
                    existingClient.close();
                }
                _ws.uuid = uuid
                // 同一个账号在不同设备上相同方式登录，user_id和client_id是一样的
                _ws.userId = token.user_id
                _ws.client_id = token.client_id
                this.clients.set(_ws.uuid, _ws);
                _ws.on('close', () => {
                    this.clients.delete(uuid)// 移除关闭的连接
                    console.log(`Connection closed for user[${token.user_id}],device[${clientId}]`);
                })
                _ws.send(JSON.stringify({
                    'type': 'connection',
                    "message": `连接成功，当前在线${this.clients.size}个连接`,
                    "retCode": 200
                }))
            } catch (error) {
                console.log('websocket connection error', error)
                return _ws.close();
            }
        });
    }

    sendToClient(data, type = notifyType.user) {
        switch (type) {
            case notifyType.user: {
                this.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client.userId === data.userId) {
                        client.send(JSON.stringify(data))
                    }
                })
            }
                break;
            case notifyType.userApp: {
                this.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client.userId === data.userId && client.client_id === data.client_id) {
                        client.send(JSON.stringify(data))
                    }
                })
            }
                break;
            case notifyType.device: {
                const client = this.clients.get(data.uuid)
                if (client && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data))
                }
            }
                break;
            case notifyType.all: {
                this.clients.forEach((client) => {
                    if (client && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(data))
                    }
                })
            }
        }
    }

    checkWsIsOnline(data, type = notifyType.user) {
        let res = false
        switch (type) {
            case notifyType.user: {
                global.webSocket.ws.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client.userId === data.userId) {
                        res = true
                    }
                })
            }
                break
            case notifyType.userApp: {
                global.webSocket.ws.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN && client.userId === data.userId && client.client_id === client.client_id) {
                        res = true
                    }
                })
            }
                break
            case notifyType.device: {
                const client = this.clients.get(data.uuid)
                if (client && client.readyState === WebSocket.OPEN) {
                    res = true
                }
            }
                break
            case notifyType.all: {
                global.webSocket.ws.clients.forEach((client) => {
                    if (client.readyState === WebSocket.OPEN) {
                        res = true
                    }
                })
            }
                break
        }
        return res
    }
}

import moment from "moment";
import {isDelete, payStatus, serviceType, status} from "./enum.js";
import {AlipaySdk} from "alipay-sdk";
import config from "../config.js";
import fs from "fs";
import path from "path";
import net from "net";
import http from "http";

const os = require('os');

export function randomNumber() {
    const random = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }
    if (arguments.length === 1) {
        let [length] = arguments
        let nums = [...Array(length).keys()].map((i) => (i > 0 ? random(0, 9) : random(1, 9)))
        return parseInt(nums.join(''))
    } else if (arguments.length >= 2) {
        let [min, max] = arguments
        return random(min, max)
    } else {
        return Number.NaN
    }
}

export function randomString(length = 1, chats = '0123456789qwertyuioplkjhgfdsazxcvbnm') {
    let str = ''
    for (let i = 0; i < length; i++) {
        let num = randomNumber(0, chats.length - 1)
        str += chats[num]
    }
    return str
}

export function randomUUID(isFull = false) {
    const chats = isFull ? undefined : '0123456789abcdef'
    return randomString(32, chats)
}

export function isNullOrUndefined(value) {
    return value === undefined || value === null
}

export function isEmpty(value) {
    return isNullOrUndefined(value)||value === ''
}

export function aliPayPaymentToSys(trade_status) {
    switch (trade_status) {
        case 'WAIT_BUYER_PAY': {
            return payStatus.unPayment
        }
        case 'TRADE_CLOSED': {
            return payStatus.paymentClose
        }
        case 'TRADE_SUCCESS': {
            return payStatus.paymentSuccess
        }
        case 'TRADE_FINISHED': {
            return payStatus.paymentFinished
        }
        default: {
            return payStatus.unPayment
        }
    }
}

export function sysPayToText(_payStatus) {
    switch (_payStatus) {
        case payStatus.unPayment: {
            return '未付款'
        }
        case payStatus.paymentClose: {
            return '付款关闭'
        }
        case payStatus.paymentSuccess: {
            return '付款成功'
        }
        case payStatus.paymentFinished: {
            return '付款完成'
        }
        default: {
            return '未付款'
        }
    }
}

export function isSysPaySuccess(pay_status) {
    return pay_status === payStatus.paymentSuccess || pay_status === payStatus.paymentFinished
}

export function getAlipaySdk() {
    return new AlipaySdk({
        // 设置应用 ID
        appId: config.alipay_appId,
        // 设置应用私钥
        privateKey: fs.readFileSync(path.join(__dirname, `../keys/${process.env.NODE_ENV}/alipayApp/private-key.pem`), 'ascii'),
        // 设置支付宝公钥
        alipayPublicKey: fs.readFileSync(path.join(__dirname, `../keys/${process.env.NODE_ENV}/alipayPublicKey/alipayPublicKey_RSA2.crt`), 'ascii'),
        // 设置网关
        gateway: config.alipay_gateway,
    });
}

export function isEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email)
}

/**
 * 检查服务器端口监听情况
 * @param domain 域名
 * @param port 地址
 * @param type 类型
 * @returns Promise true被占用，false未占用
 */
export function checkServerOnline(domain, port, type) {
    return new Promise((resolve, reject) => {
        if (type === serviceType.tcp) {
            const socket = new net.Socket();
            socket.setTimeout(3000); // 设置超时时间，根据需要调整
            socket.once('connect', () => {
                console.log(`端口 ${port} 在 ${domain} 连接成功。`);
                // 设置一个延迟来检查连接状态
                setTimeout(() => {
                    socket.write('PING', (err) => {
                        if (err) {
                            console.log(`端口 ${port} 在 ${domain} 上被连接，但被远程关闭。`);
                            resolve(false); // 远程关闭，视为未被占用
                        } else {
                            console.log(`端口 ${port} 在 ${domain} 上正常开启。`);
                            resolve(true); // 正常连接且可响应
                        }
                        socket.destroy();
                    });
                }, 1000);
            });
            socket.once('timeout', () => {
                console.log(`连接到 ${domain}:${port} 超时。`);
                resolve(false)
                socket.destroy();
            });
            socket.once('error', (err) => {
                if (err.code === 'ECONNREFUSED') {
                    resolve(false)
                } else {
                    resolve(true)
                    console.log(`在检查端口时发生错误: ${err.message}`);
                }
            });
            socket.connect(port, domain);
        } else {
            resolve(false);//todo 视为未被占用
        }
    })
}

export function checkUrl(name, domain, port, timeout = 3000) {
    const url = `http://${name}.${domain}:${port}/`
    return new Promise((resolve) => {
        http.get(url, (res) => {
            if (res.statusCode === 200) {
                resolve(true); // 可访问
            } else {
                resolve(false); // 不可访问
            }
        }).on('error', () => {
            resolve(false); // 请求错误
        });
        setTimeout(() => {
            resolve(false)
        }, timeout);
    });
}

export function getPaySuccessEmail(alipayNotifyModel) {
    return {
        subject: "感谢订阅 xgrok - 订单信息",
        html: `
<p>亲爱的用户，你好</p>
<p>你的付款方式：支付宝</p>
<br/>
<p>订单编号： ${alipayNotifyModel.out_trade_no}</p>
<p>应付金额： ￥${alipayNotifyModel.total_amount}CNY</p>
<p>付款时间： ${new moment(alipayNotifyModel.gmt_create).format('yyyy-MM-DD')}</p>
<p>付款状态： ${sysPayToText(aliPayPaymentToSys(alipayNotifyModel.trade_status))}</p>
<br/>
<p>订单内容</p>
<p>${alipayNotifyModel.subject}，￥${alipayNotifyModel.total_amount}CNY</p>
<p>------------------------------------------------------</p>
<p>小计: ￥${alipayNotifyModel.total_amount}CNY</p>
<p>总计: ￥${alipayNotifyModel.total_amount}CNY</p>
<p>------------------------------------------------------</p>`
    }
}

export function getPayRefundEmail(refundModel) {
    return {
        subject: "欢迎再次订阅 xgrok - 订单退款",
        html: `
<p>亲爱的用户，你好</p>
<p>已成功为你进行了退款</p>
<br/>
<p>------------------------------------------------------</p>
<p>订单编号： ${refundModel.out_trade_no}</p>
<p>商品名称： ${refundModel.subject}</p>
<p>实付金额： ￥${refundModel.total_amount}CNY</p>
<br/>
<p>退款金额： ￥${refundModel.refund_amount}CNY</p>
<p>退款时间： ${new moment(refundModel.refund_time).format('yyyy-MM-DD')}</p>
<p>退款原因： ￥${refundModel.refund_reason}</p>
<p>------------------------------------------------------</p>`
    }
}

export function getSubjectName(name, pay_num) {
    return pay_num > 1 ? `xgrok-${name}×${pay_num}` :
        `xgrok-${name}`
}

export function initLog() {
    let _log = console.log
    console.log = function () {
        _log(`${new Date()} ${[...arguments].join(' ')}`)
    }
}

/**
 * model转sql的where，支持全匹配和模糊查询
 * @param model
 * @param prefix
 */
export function modelToWhere(model, prefix="") {
    const modelPros = Object.entries(model);
    return modelPros.filter(c=> !isEmpty(c[1])).map(([key, value]) => {
        if (typeof value === 'string') {
            return `${prefix}${key} = '${value}'`
        } else if (typeof value === 'number') {
            return `${prefix}${key} = ${value}`
        } else if (typeof value === 'boolean') {
            return `${prefix}${key} = ${value?1:0}`
        } else if (typeof value === 'object' && value.contains) {
            return `${prefix}${key} like '%${value.contains}%'`
        } else {
            return null
        }
    }).filter(c=>c).join(' and ')
}

export function getQueryVariable(url,name) {
    const urlSection = url.split('?');
    const query = urlSection.length >= 2 ? urlSection[1] : null;
    if (query) {
        let vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            if (pair[0] === name) {
                return decodeURIComponent(pair[1]);
            }
        }
    }
    return null;
}

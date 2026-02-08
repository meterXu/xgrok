export const isDelete={
    true:1,
    false:0
}

export const status={
    enable:1,
    disable:0
}

export const isPermissions ={
    true:1,
    false:0
}

export const UserType ={
    admin:1,
    user:2
}

export const VIPType ={
    no:{
        text:'免费计划',
        value:0
    },
    vip:{
        text:'付费计划',
        value:1
    }
}

export const tunnelType = {
    web:1,
    service:2
}

//1:tcp,2:udp
export const serviceType = {
    tcp:1,
    udp:2
}

export const planType = {
    free:0,
    month:1,
    quarter:2,
    year:3
}

export const payStatus = {
    unPayment:0, // 未交易
    paymentSuccess:1, //交易成成功
    paymentClose:2, //交易失败,交易关闭
    paymentRefund:3, // 退款
    paymentFinished:4 // 交易完成
}

export const notifyStatus={
    yes:1,
    no:0
}

export const roleId={
    普通用户:'44c0a18278ccedea22e6ed095f7782a0'
}

export const roleType={
    普通用户:2,
    管理员:1
}

export const isOnline={
    online:1,
    offline:0
}

export const isNotify={
    no:0,
    yes:1
}

export const notifyType={
    //指定用户
    user:0,
    //指定用户应用类型
    userApp:1,
    //指定设备
    device:2,
    // 所有连接
    all:3
}

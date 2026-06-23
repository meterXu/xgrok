const tunnelType = {
    web:1,
    service:2
}

//1:tcp,2:udp
const serviceType = {
    tcp:1,
    udp:2,
    stcp_server:3,
    stcp_client:4
}

const httpType={
    http:1,
    https:2
}

const hostType = {
    remote:1,
    local:0
}

const serverType={
    ngrok:1,
    frp:2
}
module.exports={tunnelType,serviceType,httpType,hostType,serverType}

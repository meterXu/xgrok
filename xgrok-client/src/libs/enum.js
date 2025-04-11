const tunnelType = {
    web:1,
    service:2
}

//1:tcp,2:udp
const serviceType = {
    tcp:1,
    udp:2
}

const httpType={
    http:0,
    https:1
}

const hostType = {
    remote:1,
    local:0
}

module.exports={tunnelType,serviceType,httpType,hostType}
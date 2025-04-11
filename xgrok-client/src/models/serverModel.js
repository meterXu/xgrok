class ServerModel {
    constructor(body) {
        
        this.id = body.id
        
        this.name = body.name
        
        this.domain = body.domain

        this.port = body.port
        
        this.has_ssl = body.has_ssl
        
        this.ssl_expired_time = body.ssl_expired_time
        
        this.up_speed = body.up_speed
        
        this.down_speed = body.down_speed
        
        this.sort = body.sort
        
        this.creator = body.creator
        
        this.editor = body.editor
        
        this.created_time = body.created_time
        
        this.modified_time = body.modified_time
        
        this.status = body.status
        
        this.is_delete = body.is_delete
        
    }
}
module.exports = ServerModel
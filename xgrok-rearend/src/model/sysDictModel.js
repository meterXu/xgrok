import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class SysDictModel {
    constructor(body) {
        
        this.id = body.id
        
        this.key = body.key
        
        this.code = body.code
        
        this.chn_value = body.chn_value
        
        this.eng_value = body.eng_value
        
        this.sort = body.sort
        
        this.creator = body.creator
        
        this.editor = body.editor
        
        this.created_time = body.created_time
        
        this.modified_time = body.modified_time
        
        this.status = body.status
        
        this.is_delete = body.is_delete
        
    }

    
    @swaggerProperty({ type: "string",description:"",nullable:false}) id
    
    @swaggerProperty({ type: "string",description:"",nullable:false}) key
    
    @swaggerProperty({ type: "string",description:"",nullable:false}) code
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) chn_value
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) eng_value
    
    @swaggerProperty({ type: "number",description:"",nullable:true}) sort
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) creator
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) editor
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) created_time
    
    @swaggerProperty({ type: "string",description:"",nullable:true}) modified_time
    
    @swaggerProperty({ type: "number",description:"",nullable:true}) status
    
    @swaggerProperty({ type: "number",description:"",nullable:true}) is_delete
    
}
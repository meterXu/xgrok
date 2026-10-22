import {swaggerClass, swaggerProperty} from "koa-swagger-decorator";

@swaggerClass()
export default class CouponModel {
  constructor(body) {
    /** generate by CodeGirl */
    this.id = body.id
    this.name = body.name
    this.discount = body.discount
    this.code = body.code
    this.start_time = body.start_time
    this.end_time = body.end_time
    this.type = body.type
    this.sort = body.sort
    this.creator = body.creator
    this.editor = body.editor
    this.created_time = body.created_time
    this.modified_time = body.modified_time
    this.status = body.status
    this.is_delete = body.is_delete
  }

  /** generate by CodeGirl */
  @swaggerProperty({type: "string", description: "", nullable: true}) id
  @swaggerProperty({type: "string", description: "", nullable: true}) name
  @swaggerProperty({type: "number", description: "", nullable: false}) discount
  @swaggerProperty({type: "string", description: "", nullable: true}) code
  @swaggerProperty({type: "number", description: "", nullable: false}) start_time
  @swaggerProperty({type: "number", description: "", nullable: true}) end_time
  @swaggerProperty({type: "number", description: "", nullable: true}) type
  @swaggerProperty({type: "number", description: "", nullable: true}) sort
  @swaggerProperty({type: "string", description: "", nullable: true}) creator
  @swaggerProperty({type: "string", description: "", nullable: true}) editor
  @swaggerProperty({type: "number", description: "", nullable: true}) created_time
  @swaggerProperty({type: "number", description: "", nullable: true}) modified_time
  @swaggerProperty({type: "number", description: "", nullable: true, default: 1}) status
  @swaggerProperty({type: "number", description: "", nullable: true, default: 0}) is_delete
}

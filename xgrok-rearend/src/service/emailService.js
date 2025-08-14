import {randomUUID} from "../utils/index.js";
import {isDelete} from "../utils/enum.js";
const nodemailer = require('nodemailer');
const { Resend }= require('resend');

const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();
import config from '../config.js'
export default class EmailService {
    constructor() {
    }

    async queryEmail(pagination, orderBy, emailModel) {
        return await prisma.$transaction([prisma.ng_email.count({where: emailModel}), prisma.ng_email.findMany({
            where: emailModel,
            orderBy: orderBy,
            skip: (pagination.pageNumber - 1) * pagination.pageSize,
            take: pagination.pageSize
        })])
    }

    async detailEmail(emailModel) {
        return await prisma.ng_email.findUnique({where: {id: emailModel.id}})
    }

    async sendEmail(email,subject,html){
        return new Promise(async (resolve, reject)=>{
            if(process.env.NODE_ENV!=='development'){
                const resend = new Resend(config.resend);
                const { data, error } = await resend.emails.send({
                    from: config.send_mail_from,
                    to: email,
                    subject: subject,
                    html: html
                });
                if(error){
                    console.log('Error sending email: ', error);
                    reject(error)
                }else{
                    console.log(`The email was successfully sent to ${email}`);
                    resolve(data)
                }
            }else{
                resolve()
            }
        })
    }

    async addEmail(emailModel) {
        let res = await prisma.ng_email.create({
            data: {
                /** generate by CodeGirl */
                id: emailModel.id || randomUUID(),
                email: emailModel.email,
                code: emailModel.code,
                sort: emailModel.sort,
                creator: emailModel.creator,
                editor: emailModel.editor,
                expire_time:emailModel.expire_time,
                created_time: emailModel.created_time||new Date().valueOf(),
                modified_time: emailModel.modified_time,
                status: emailModel.status,
                is_delete: emailModel.is_delete,
            }
        })
        return res
    }

    async editEmail(emailModel) {
        emailModel.modified_time = emailModel.modified_time||new Date().valueOf()
        let res = await prisma.ng_email.update({where: {id: emailModel.id}, data: emailModel});
        return res
    }

    async delEmail(id) {
        const res = await prisma.ng_email.update({data: {is_delete: isDelete.true,}, where: {id: id}})
        return res
    }
}

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

    async sendEmail2(email,subject,html){
       return new Promise((resolve, reject)=>{
           // 创建SMTP服务器的连接配置
           const transporter = nodemailer.createTransport({
               host: 'smtp.126.com', // SMTP服务器地址
               port: 25, // SMTP端口，对于TLS通常是587
               secure: false, // 对于465端口使用true，对于其他端口使用false
               auth: {
                   user: config.send_mail_user, // 你的邮箱地址
                   pass: config.send_mail_password // 你的邮箱密码
               },
               timeout: 60000
           });
           // 设置邮件内容
           const mailOptions = {
               from: config.send_mail_from, // 发件人地址
               to: email, // 收件人地址，多个收件人可以使用逗号分隔
               subject: subject, // 邮件主题
               html: html  // 邮件HTML内容
           };
           // 发送邮件
           transporter.sendMail(mailOptions, (error, info) => {
               if (error) {
                   console.log('Error sending email: ', error);
                   reject(error)
               } else {
                   console.log('Email sent: ', info.response);
                   resolve(info.response)
               }
           });
       })
    }

    async sendEmail(email,subject,html){
        return new Promise(async (resolve, reject)=>{
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
                created_time: emailModel.created_time,
                modified_time: emailModel.modified_time,
                status: emailModel.status,
                is_delete: emailModel.is_delete,
            }
        })
        return res
    }

    async editEmail(emailModel) {
        let res = await prisma.ng_email.update({where: {id: emailModel.id}, data: emailModel});
        return res
    }

    async delEmail(id) {
        const res = await prisma.ng_email.update({data: {is_delete: isDelete.true,}, where: {id: id}})
        return res
    }
}
const { Resend }= require('resend');

async function main(){
    const to = ''
    const resend = new Resend('');
    const { data, error } = await resend.emails.send({
        from: 'xgrok <xgrok@xdog.icu>',
        to: to,
        subject: '内容安全风险通知',
        html: `尊敬的 ${to}:<br/>` +
            '<br/>' +
            '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的网站/服务疑似存在违法不良或侵权欺诈类违规内容，您的账号已封停24小时，违规隧道已删除。如再次发现违规内容，根据服务协议，xgrok将对您的账号进行关停，且不再进行二次通知。如果您对本通知的内容存在疑问，请回复本邮件 。<br/>' +
            '<br/>' +
            '相关地址信息：http://xgrok.xdo.icu:18034/<br/>' +
            '<br/>'
    });
}
main();
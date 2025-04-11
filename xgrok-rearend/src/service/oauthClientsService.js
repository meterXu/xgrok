import OAuthClientsModel from "../model/oauthClientsModel.js";
import config from "../config.js";
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

export default class OAuthClientsService {
    constructor() {
    }

    async queryOAuthClients(query) {
        const oAuthClientsModel = new OAuthClientsModel(query)
        let res = await prisma.OAuthClients.findFirst({
            where: oAuthClientsModel,
            select:{
                id:true,
                client_id:true,
                client_secret:true
            }
        })
        if(res){res.grants = config.grants}
        return res
    }
}

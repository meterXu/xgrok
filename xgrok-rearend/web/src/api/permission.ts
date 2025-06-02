const _permission:PermissionType[] = [
    {
        "path":'/',
        "meta":{
            "title":'系统管理'
        },
        children:[
            {
                "path":'/dashboard',
                "meta":{
                    "title":'首页'
                }
            },
            {
                "path":'/user',
                "meta":{
                    "title":'用户管理'
                }
            },
            {
                "path":'/order',
                "meta":{
                    "title":'订单管理'
                }
            },
            {
                "path":'/server',
                "meta":{
                    "title":'服务管理'
                }
            }
        ]
    }
]

export default _permission;
const preset_env_conf= process.env.NODE_ENV==='development'?{
    "targets": {
        "node": "current"
    }
}:{
    "targets": {
        "node": "current"
    },
    "modules":false
}
export default {
    "presets": [
        ["@babel/preset-env",preset_env_conf]
    ],
    "plugins": [
        ["@babel/plugin-transform-runtime"],
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/proposal-class-properties"],
        ["@babel/plugin-proposal-private-methods"]
    ]
}

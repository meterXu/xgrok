export default {
    "plugins": {
        "autoprefixer": {},
        "postcss-pxtorem":{
            "rootValue": 4,
            "unitPrecision": 5,
            "propList": ["*"],
            "selectorBlackList": [],
            "replace": true,
            "mediaQuery": false,
            "minPixelValue": 0
        }
    }
}
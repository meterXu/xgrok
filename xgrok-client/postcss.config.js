module.exports = {
    plugins: {
        autoprefixer: {},
        'postcss-pxtorem':{
            rootValue: 14,
            unitPrecision: 5,
            propList: ['*'],
            selectorBlackList: [],
            replace: true,
            mediaQuery: false,
            minPixelValue: 0,
            exclude: /node_modules/i
        }
    }
}
module.exports = (pagesJson, loader) => {
    // 需要将loader传入作为初始化，v0.0.6之后只需要初始化一次
    const hotRequire = require('uni-pages-hot-modules')(loader);

    return {
        "easycom": {
            "^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
        },
        "pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
            ...hotRequire('./router/routerPages')
        ],
        "subPackages": [
            ...hotRequire('./router/routerSubPackages')
        ],
        "globalStyle": {
            "navigationBarTextStyle": "black",
            "navigationBarTitleText": "uni-app",
            "navigationBarBackgroundColor": "#ffffff",
            "backgroundColor": "#ffffff"
        },
        "tabBar": {
            "color": "#999",
            "selectedColor": "#09f",
            "borderStyle": "black",
            "backgroundColor": "#fff",
            "list": [{
                "pagePath": "pages/home/home",
                "iconPath": "static/images/home/home-icon.png",
                "selectedIconPath": "static/images/home/home-active-icon.png",
                "text": "内置组件"
            }]
        }
    }
}
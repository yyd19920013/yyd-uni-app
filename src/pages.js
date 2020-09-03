module.exports = (pagesJson, loader) => {
    // 需要将loader传入作为初始化，v0.0.6之后只需要初始化一次
    const copyJson = (json) => {
        return json ? JSON.parse(JSON.stringify(json)) : json;
    };
    const hotRequire = require('uni-pages-hot-modules')(loader);
    const pages = copyJson(hotRequire('./router/routerPages'));
    const subPackages = copyJson(hotRequire('./router/routerSubPackages'));

    return {
        "easycom": {
            "^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
        },
        "pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
            ...pages
        ],
        "subPackages": [
            ...subPackages
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
                    "iconPath": "static/images/tabBar/home-icon.png",
                    "selectedIconPath": "static/images/tabBar/home-active-icon.png",
                    "text": "首页"
                },
                {
                    "pagePath": "pages/user/user",
                    "iconPath": "static/images/tabBar/user-icon.png",
                    "selectedIconPath": "static/images/tabBar/user-active-icon.png",
                    "text": "我的"
                },
            ]
        }
    }
}
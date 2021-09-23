module.exports = (pagesJson, loader) => {
    //需要将loader传入作为初始化，v0.0.6之后只需要初始化一次
    //不支持条件编译，需要自己通过process.env.UNI_PLATFORM来判断，自定义环境的需要自己添加env变量来判断使用
    //uni-pages-hot-modules引入模块必须输入全的文件名包括后缀，否则将不会进行热重载
    const hotRequire = require('uni-pages-hot-modules')(loader);
    const pages = hotRequire('./router/routerPages.js');
    const subPackages = hotRequire('./router/routerSubPackages.js');

    return {
        "easycom": {
            "^u-(.*)": "@/uview-ui/components/u-$1/u-$1.vue"
        },
        "pages": [ //pages数组中第一项表示应用启动页，参考：https://uniapp.dcloud.io/collocation/pages
            ...pages,
        ],
        "subPackages": [
            ...subPackages,
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
                    "iconPath": "static/tabBar/home-icon.png",
                    "selectedIconPath": "static/tabBar/home-active-icon.png",
                    "text": "首页"
                },
                {
                    "pagePath": "pages/user/user",
                    "iconPath": "static/tabBar/user-icon.png",
                    "selectedIconPath": "static/tabBar/user-active-icon.png",
                    "text": "我的"
                },
            ]
        }
    }
}
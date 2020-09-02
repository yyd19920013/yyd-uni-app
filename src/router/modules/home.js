const home = [{
        //注意：path必须跟pages.json中的地址对应，最前面别忘了加'/'哦
        path: '/pages/home/home',
        aliasPath: '/', //对于h5端你必须在首页加上aliasPath并设置为/
        name: 'home',
        meta: {
            title: '首页',
        },
    },
    {
        path: '/pages/test/test',
        name: 'test',
        meta: {
            title: '测试',
        },
    },
]

export default home
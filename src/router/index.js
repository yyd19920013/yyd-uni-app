const routerPages = require('./routerPages');
const subPackages = require('./routerSubPackages');
let routerSubPackages = [];
for (let item of subPackages) {
    let { root = '', pages } = item;

    pages = pages.map((item) => {
        let { path } = item;

        item.path = root + '/' + item.path;
        return item;
    });
    routerSubPackages = [].concat(routerSubPackages, pages);
}
const modules = [
    ...routerPages,
    ...routerSubPackages,
];
const routes = modules.map((item, index) => {
    let { path = '', style = {} } = item;
    let { navigationBarTitleText: title = '' } = style;
    path = '/' + path;
    let arr = path.split('/');
    let name = arr[arr.length - 1].toUpperCase();
    let res = {
        path,
        name,
        meta: {
            title,
        },
    };

    if (index == 0) res.aliasPath = '/'; //对于h5端你必须在首页加上aliasPath并设置为/
    return res;
});

console.log('全部路由', routerPages, subPackages, modules, routes);
export default routes;
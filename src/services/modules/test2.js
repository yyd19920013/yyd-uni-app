import services from 'services';

//axios请求示例
export const testAxios2 = (params, success) => {
    return services.API({
        url: '/myBackground/ports/article.php',
        params,
        success,
    });
};
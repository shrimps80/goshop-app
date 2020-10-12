import {apiBaseUrl} from './config.js';
import * as common from './common.js'

// 登录路由
const methodsToken = [
    'cart/index',
    'member/info',
];

const request = (url, method, data, returnCode = false) => {
    let header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    // 判断token是否存在
    if (methodsToken.indexOf(url) >= 0) {
        // 获取用户token
        let userToken = common.get("user_token");
        if (!userToken) {
            common.toLogin()
            return
        }
        header.token = userToken
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiBaseUrl + url,
            method: method,
            data: data,
            header: header,
            success(request) {
                if (returnCode) {
                    resolve(request.data)
                    return
                }

                if (request.code < 0) {
                    common.msg(request.data.message)
                    return
                }

                resolve(request.data.data)
            },
            fail(error) {
                reject(error)
            },
            complete(req) {
                // 加载完成
                if (req.statusCode == 401) {
                    // 强制登录
                    common.msg(req.data.message)
                    common.toLogin()
                    return
                }
            }
        })
    })
}

Promise.prototype.finally = function (callback) {
    let Promise = this.constructor;
    return this.then(
        function (value) {
            Promise.resolve(callback()).then(
                function () {
                    return value;
                }
            );
        },
        function (reason) {
            Promise.resolve(callback()).then(
                function () {
                    throw reason;
                }
            );
        }
    );
}

// 用户登录 - 手机密码登录
export const login = (data) => request('common/mobile-login', 'post', data, true);

// 用户详情
export const info = () => request('member/info', 'get');

// 获取分类列表
export const categoryList = () => request('category/index', 'get');

// 获取购物车列表
export const cartList = () => request('cart/index', 'get');
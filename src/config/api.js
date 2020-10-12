import {apiBaseUrl} from './config.js';
import * as common from './common.js'

const request = (url, method, data) => {
    let header = {
        'Content-Type': 'application/x-www-form-urlencoded'
    };
    return new Promise((resolve, reject) => {
        uni.request({
            url: apiBaseUrl + url,
            method: method,
            data: data,
            header: header,
            success(request) {
                if (request.data.code < 0) {
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
                    common.msg("请登录")
                    uni.navigateTo({
                        url: '/pages/public/login'
                    })
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


// 获取分类列表
export const categoryList = () => request('category/index', 'get');

// 获取购物车列表
export const cartList = () => request('cart/index', 'get');
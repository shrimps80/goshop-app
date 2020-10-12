import {apiBaseUrl} from './config.js';

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
                resolve(request.data)
            },
            fail(error) {
                reject(error)
            },
            complete(aaa) {
                // 加载完成
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


export const categoryList = () => request('category/index', 'get');
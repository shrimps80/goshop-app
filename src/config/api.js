import {apiBaseUrl} from './config.js';
import * as common from './common.js'

// 登录路由
const methodsToken = [
    'cart/index',
    'cart/add',
    'cart/delete',
    'cart/checked',

    'member/info',

    'address/index',
    'address/detail',
    'address/add',
    'address/edit',

    'order/index',
    'order/info',
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
                if (request.data.code < 0) {
                    common.msg(request.data.message)
                    return
                }

                resolve(request.data.data)
            },
            fail(error) {
                // reject(error)
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

// 获取省市区
export const getAreaList = () => request('common/get-area-list', 'get');

// 用户登录 - 手机密码登录
export const login = (data) => request('common/mobile-login', 'post', data, true);

// 用户详情
export const info = () => request('member/info', 'get');

// 获取用户收货地址
export const addressList = () => request('address/index', 'get');
// 根据收货地址id获取详情
export const addressDetail = (data) => request('address/detail', 'get', data);
// 新增收货地址
export const addressAdd = (data) => request('address/add', 'post', data);
// 编辑收货地址
export const addressEdit = (data) => request('address/edit', 'post', data);

// 获取用户订单
export const orderList = (data) => request('order/index', 'get', data);

// 根据订单id获取订单详情
export const orderInfo = (data) => request('order/info', 'get', data);

// 获取分类列表
export const categoryList = () => request('category/index', 'get');

// 获取商品列表
export const productList = (data) => request('product/index', 'get', data);

// 根据商品id获取商品详情
export const productDetail = (data) => request('product/detail', 'get', data);

// 获取购物车列表
export const cartList = () => request('cart/index', 'get');
export const addCart = (data) => request('cart/add', 'post', data);
export const delCart = (data) => request('cart/delete', 'post', data);
export const checkedCart = (data) => request('cart/checked', 'post', data);
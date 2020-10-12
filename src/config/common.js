const msg = (title, duration = 1500, mask = false, icon = 'none') => {
    //统一提示方便全局修改
    if (Boolean(title) === false) {
        return;
    }
    uni.showToast({
        title,
        duration,
        mask,
        icon
    });
}

const set = (key, value, sync = true) => {
    try {
        if (sync) {
            return uni.setStorageSync(key, value);
        } else {
            uni.setStorage({
                key: key,
                data: value
            });
        }
    } catch (e) {

    }
}

const get = (key, sync = true) => {
    try {
        if (sync) {
            return uni.getStorageSync(key);
        } else {
            let data = '';
            uni.getStorage({
                key: key,
                success: function (res) {
                    data = res.data;
                }
            });
            return data;
        }
    } catch (e) {
        return false;
    }
}

const toLogin = () => {
    uni.navigateTo({
        url: '/pages/public/login',
    });
}

export {
    msg,
    set,
    get,
    toLogin
}
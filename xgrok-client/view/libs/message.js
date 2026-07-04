import {ElNotification,ElMessageBox,ElMessage} from "element-plus";
let globalMessageBox = null;
let globalElNotification = null;

export function showNotification(type, message, title) {
    if(!globalElNotification){
        globalElNotification = ElNotification({
            type: type,
            title,
            message,
            position: 'bottom-right',
            duration: 800,
            onClose:()=>{
                globalElNotification = null
            }
        })
    }
}

export const message = {
    success: ElMessage.success,
    warning: ElMessage.warning,
    error: ElMessage.error,
    primary: ElMessage.primary,
    info:ElMessage.info
}

export function confirm(confirmText, title, options){
    if (!globalMessageBox) {
        return new Promise((resolve, reject) => {
            let _options = Object.assign({
                beforeClose: (action, instance, done) => {
                    globalMessageBox=null
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        resolve({done, instance});
                    } else {
                        instance.confirmButtonLoading = false;
                        reject(done)
                        done();
                    }
                }
            }, options)
            globalMessageBox = ElMessageBox.confirm(confirmText, title, dealWithOption(_options)).catch((err) => {
                reject(err);
            });
        })
    } else {
        return Promise.reject();
    }
}

export function alert(text, title, options) {
    if (!globalMessageBox) {
        globalMessageBox = ElMessageBox.alert(text, title, dealWithOption(options));
    }
}

export function prompt(text, title, options) {
    if (!globalMessageBox) {
        globalMessageBox = ElMessageBox.prompt(text, title, dealWithOption(options))
        return globalMessageBox
    }
}

function dealWithOption(options) {
    let callback = (action, instance, done) => {
        globalMessageBox = null
        instance.confirmButtonLoading = false;
    };
    let _options = Object.assign({
        customClass: 'my-messageBox',
        confirmButtonText: '确定',
        center: true,
        showClose:false
    }, options)
    if (_options.callback) {
        let _callback = _options.callback
        _options.callback = function (action, instance, done) {
            try {
                _callback(action, instance)
            } finally {
                callback(action, instance, done)
            }
        };
    } else {
        _options.callback = function (action, instance, done) {
            callback(action, instance, done)
        };
    }
    return _options
}

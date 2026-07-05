import {NotificationTypeEnum} from "@/libs/enum";
import {ElNotification,ElMessageBox,ElMessage} from "element-plus";
let globalMessageBox: any = null;

export function showNotification(type: NotificationTypeEnum, message: string, title?: string | undefined) {
    ElNotification({
        type: type,
        title,
        message,
        position: 'bottom-right'
    })
}

export const message = {
    success: ElMessage.success,
    warning: ElMessage.warning,
    error: ElMessage.error,
    primary: ElMessage.primary,
    info:ElMessage.info
}

export function confirm(confirmText: String, title: string, options: { [key: string]: any }={}): Promise<{
    done: () => void,
    instance: any
}> {
    if (!globalMessageBox) {
        return new Promise((resolve, reject) => {
            let _options = Object.assign({
                beforeClose: (action: string, instance: any, done: () => {}) => {
                    if (action === 'confirm') {
                        instance.confirmButtonLoading = true;
                        resolve({done, instance});
                    } else {
                        reject(done)
                        done();
                    }
                }
            }, options)
            // @ts-ignore
            globalMessageBox = ElMessageBox.confirm(confirmText, title, dealWithOption(_options)).catch((err: any) => {
                reject(err);
            });
        })
    } else {
        return Promise.reject();
    }
}

export function alert(text: string, title: string, options: { [key: string]: any } = {}) {
    if (!globalMessageBox) {
        globalMessageBox = ElMessageBox.alert(text, title, dealWithOption(options));
    }
}

export function prompt(text: string, title: string, options: { [key: string]: any } = {}) {
    if (!globalMessageBox) {
        globalMessageBox = ElMessageBox.prompt(text, title, dealWithOption(options))
        return globalMessageBox
    }
}

function dealWithOption(options: { [key: string]: any } = {}) {
    let callback = (action: string, instance: any, done: () => {}) => {
        globalMessageBox = null
        instance.confirmButtonLoading = false;
    };
    let _options = Object.assign({
        customClass: 'visual-messagebox',
        confirmButtonText: '确定',
    }, options)
    if (_options.callback) {
        let _callback = _options.callback
        _options.callback = function (action: string, instance: any, done: () => {}) {
            try {
                _callback(action, instance)
            } finally {
                callback(action, instance, done)
            }
        };
    } else {
        _options.callback = function (action: string, instance: any, done: () => {}) {
            callback(action, instance, done)
        };
    }
    return _options
}

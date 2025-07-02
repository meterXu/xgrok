import type {NotificationTypeEnum} from "../enum";
import {ElMessage, ElNotification,ElMessageBox} from 'element-plus';
import dayjs from "dayjs";
import type {ShallowReactive} from "vue";

export function showNotification(type: NotificationTypeEnum, message: string, title?: string | undefined) {
    ElNotification({
        type: type,
        title,
        message,
        position: 'bottom-right'
    })
}

export function useFormatDateTime(dateTime?: string): string | null {
    return dateTime ? dayjs(dateTime).format('YYYY-MM-DD HH:mm:ss') : null
}

export function mappingDic(promiseArray: Promise<ResultType<any>>[], dest: ShallowReactive<DictItemType[]>[]): Promise<any> {
    return new Promise(async (resolve, reject) => {
        try {
            let ress = await Promise.all(promiseArray)
            ress.forEach((res, index) => {
                if (res.success && res.data) {
                    dest[index].splice(0, dest[index].length, ...res.data.records)
                }
            })
            resolve(dest)
        } catch (e) {
            reject(e)
        }
    })
}

export function useFormatDic(dicData?: DictItemType[], code?: string): string {
    if (dicData && code) {
        return dicData.find(c => c.code === code)?.chn_value || ''
    } else {
        return ''
    }
}

export function EnumToArray(enumObj: object): DictItemType[] {
    return Object.entries(enumObj).map(([key, value]) => {
        return {
            key: key,
            code: value,
        } as DictItemType
    });
}

export function resetObj(obj: { [key: string]: any }, defaultValue?: { [key: string]: any }): void {
    Object.keys(obj).forEach(key => {
        if (obj[key] instanceof Array) {
            obj[key] = []
        } else {
            obj[key] = null
        }
    })
    Object.assign(obj, defaultValue)
}

export function useDel(res: ApiResType<any>): Promise<any> {
    if (res.success) {
        showNotification(NotificationTypeEnum.error, '删除成功')
        return Promise.resolve(res)
    } else {
        showNotification(NotificationTypeEnum.error,res.msg || '删除失败')
        return Promise.reject(new Error(res.msg || '删除失败'))
    }
}

export function useBatchDelConfirm(selectedValues: string[], options: {
    [key: string]: any
} = {}, callback: () => Promise<ApiResType<any>>): Promise<ApiResType<any>> {
    return new Promise((resolve, reject) => {
        useBatchAction(selectedValues, '确认删除', '请选择需要删除的数据！', '确定要删除所选的数据吗？', options)
            .then(({done, instance}) => {
                if (callback) {
                    callback().then(res => {
                        if (res.success) {
                            resolve(res)
                            done()
                        }
                    }).finally(() => {
                        instance.confirmButtonLoading = false
                    })
                } else {
                    done()
                    reject(new Error('没有定义callback'))
                }
            }).catch(() => {
        })
    })
}

export function useBatchAction(selectedValues: string[] | number[], title: string, noSelectedText: string, confirmText: string, options: {
    [key: string]: any
}): Promise<{ done: () => void, instance: any }> {
    if (selectedValues.length === 0) {
        showNotification(NotificationTypeEnum.warning,noSelectedText);
        return Promise.reject(noSelectedText);
    } else {
        return ElMessageBox.confirm(confirmText, title, options)
    }
}

export function useSaveOrUpdate(res: ApiResType<any>, id?: string): Promise<any> {
    if (res.success) {
        showNotification(NotificationTypeEnum.success,id ? '更新成功' : '新增成功')
        return Promise.resolve(res)
    } else {
        showNotification(NotificationTypeEnum.error,res.msg || (id ? '更新失败' : '新增失败'))
        return Promise.reject(new Error(res.msg || (id ? '更新失败' : '新增失败')))
    }
}
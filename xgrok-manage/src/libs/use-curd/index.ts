import {reactive, ref, shallowReactive, shallowRef} from "vue";
import {useFixed} from "@/libs/utils";

export function useDialogVisible(){
    return ref(false)
}

export function useDialogType(){
    return ref('add')
}

export function useTableData(){
    return shallowReactive([])
}

export function useClearObjEmptyStrPro(obj:Object){
    Object.entries(obj).map(c=>{
        // @ts-ignore
        obj[c[0]]=clearEmptyStr(c[1])
    })
    return obj
}

export function clearEmptyStr(str:string){
    return str===''?null:str
}

export function usePage(pageSize=20):PaginationType{
    const isFixed = useFixed()
    return reactive({
        pageNumber:1,
        pageSize:pageSize,
        pageSizes:[10,20,50,100],
        total:0,
        layout:isFixed.value?'total, sizes, prev, pager, next, jumper':'total,prev, pager, next'
    })
}

export function useGetIndexMethod(index:number) {
    return index+1
}

export function useQuery<T>(queryAction:Function, params:any, queryCallback:Function){
    queryAction.call(null,params).then((res:ResultType<PaginationDataType<T>>)=>queryCallback.call(null,res))
}

export function useQueryCallback<T>(res:ResultType<PaginationDataType<T>>,tableData:any[],page:PaginationType){
    if(res.success){
        tableData.splice(0,tableData.length)
        if(res.data){
            tableData.push(...res.data?.records)
            page.total = res.data?.total
            page.pageNumber = res.data?.pagination.pageNumber
            page.pageSize = res.data?.pagination.pageSize
        }
    }
}

export function useGetQueryParam(page:PaginationType,searchForm:object,orderBy:string){
    return Object.assign({
        pageNumber: page.pageNumber,
        pageSize: page.pageSize,
    },useClearObjEmptyStrPro(searchForm),orderBy)
}

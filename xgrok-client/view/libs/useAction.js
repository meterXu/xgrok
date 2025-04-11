import {computed, reactive} from "vue";

export function useGetValidateRes(form){
    const obj={}
    Object.keys(form).forEach(key=>{
        obj[key]={value:null,valid:!!form[key]}
    })
    return reactive(obj)
}

export function useGetErrorMsg(validateRes){
    return computed(()=>{
        return Object.entries(validateRes).map(c=>{
            return c[1].value
        }).filter(c=>c)
    })
}

export function useGetDisabled(validateRes){
    return computed(()=>{
        return Object.entries(validateRes).some(c=>c[1].valid===false)
    })
}

export function onFormValidate(validateRes,validObj){
    validateRes[validObj.prop].valid = validObj.valid
    validateRes[validObj.prop].value = validObj.value
}

export function useGetTermsOfServiceUrl(){
    return window.project.variable.website+'termsOfService.html'
}
export function usePrivacyAgreementUrl(){
    return window.project.variable.website+'privacyAgreement.html'
}
export default class AssetsService {
    constructor() {
    }
    queryAssets(pagination,orderBy,assetsQuery){
        return Promise.resolve([2,[1,2]])
    }

    detailAssets(AssetsModel) {
        return Promise.resolve({
            text:1
        })
    }
}

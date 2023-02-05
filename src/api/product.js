// 商品管理相关的所有请求接口
import request from '@/utils/request'

// 查询品牌列表接口
const reqBrandList = ({ page, limit }) => request({ method: 'get', url: `/admin/product/baseTrademark/${page}/${limit}` })
// 添加或修改品牌接口
const reqAddOrUpdateBrand = (data) => {
  if (data.id) {
    return request({ method: 'put', url: '/admin/product/baseTrademark/update', data })
  } else {
    return request({ method: 'post', url: '/admin/product/baseTrademark/save', data })
  }
}
// 删除品牌接口
const reqDeleteBrand = (id) => request({ method: 'delete', url: `/admin/product/baseTrademark/remove/${id}` })

// 商品属性一级分类接口
const reqCategory1 = () => request({ method: 'get', url: '/admin/product/getCategory1' })
// 商品属性二级分类接口
const reqCategory2 = (category1Id) => request({ method: 'get', url: `/admin/product/getCategory2/${category1Id}` })
// 商品属性三级分类接口
const reqCategory3 = (category2Id) => request({ method: 'get', url: `/admin/product/getCategory3/${category2Id}` })
// 商品属性列表接口
const reqAttrList = ({category1Id, category2Id, category3Id}) => request({method: 'get', url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`})
// 添加或修改商品属性接口
const reqAddOrUpdateAttr = (data) => request({method: 'post', url: '/admin/product/saveAttrInfo', data})
// 删除商品属性接口
const reqDeleteAttr = (attrId) => request({method:'delete', url: `/admin/product/deleteAttr/${attrId}`})

// 获取Spu商品列表接口
const reqSpuList = ({page, limit, category3Id}) => request({method: 'get', url: `/admin/product/${page}/${limit}`, params: {category3Id}})
// 获取Spu信息接口
const reqSpuById = (spuId) => request({method: 'get', url: `/admin/product/getSpuById/${spuId}`})
// 获取品牌信息接口
const reqTrademarkList = () => request({method: 'get', url: '/admin/product/baseTrademark/getTrademarkList'})
// 获取spu图片信息接口
const reqSpuImageList = (spuId) => request({method: 'get', url: `/admin/product/spuImageList/${spuId}`})
// 获取Spu销售属性列表
const reqSpuSaleAttrList = (spuId) => request({method: 'get', url: `/admin/product/spuSaleAttrList/${spuId}`})
// 获取平台全部销售属性 —— 一共有三个
const reqBaseSaleAttrList = () => request({method: 'get', url: '/admin/product/baseSaleAttrList'})
// 添加/修改Spu接口
const reqsaveSpuInfo = (data) => {
    if(data.id){
        return request({method: 'post', url: '/admin/product/updateSpuInfo', data})
    }else{
        return request({method: 'post', url: '/admin/product/saveSpuInfo', data})
    }
}
// 删除Spu接口
const reqDeleteSpu = (spuId) => request({method: 'delete', url: `/admin/product/deleteSpu/${spuId}`})

// 添加sku接口
const reqSaveSkuInfo = (data) => request({method: 'post', url: '/admin/product/saveSkuInfo', data})
// 获取spu的sku列表接口
const reqSkuInfo = (spuId) => request({method: 'get', url: `/admin/product/findBySpuId/${spuId}`})
// 获取全部sku列表接口
const reqSkuList = ({page, limit}) => request({method: 'get', url: `/admin/product/list/${page}/${limit}`})
// sku商品上架接口
const reqOnSale = (skuId) => request({method: 'get', url: `/admin/product/onSale/${skuId}`})
// sku商品下架接口
const reqCancelSale = (skuId) => request({method: 'get', url: `/admin/product/cancelSale/${skuId}`})
// 获取Sku信息接口
const reqSkuById = (skuId) => request({method: 'get', url: `/admin/product/getSkuById/${skuId}`})
// 删除Sku接口
const reqDeleteSku = (skuId) => request({method:'delete', url: `/admin/product/deleteSku/${skuId}`})

export {
  reqBrandList,
  reqAddOrUpdateBrand,
  reqDeleteBrand,
  reqCategory1,
  reqCategory2,
  reqCategory3,
  reqAttrList,
  reqAddOrUpdateAttr,
  reqDeleteAttr,
  reqSpuList,
  reqSpuById,
  reqTrademarkList,
  reqSpuImageList,
  reqBaseSaleAttrList,
  reqsaveSpuInfo,
  reqDeleteSpu,
  reqSpuSaleAttrList,
  reqSaveSkuInfo,
  reqSkuInfo,
  reqSkuList,
  reqOnSale,
  reqCancelSale,
  reqSkuById,
  reqDeleteSku
}

<template>
    <el-form ref="ruleForm" :model="form" label-width="120px">
        <el-form-item label="SPU名称">
            <span>{{ spuName }}</span>
        </el-form-item>
        <el-form-item label="SKU名称">
            <el-input v-model="form.skuName" placeholder="请输入SKU名称"></el-input>
        </el-form-item>
        <el-form-item label="价格（元）">
            <el-input v-model.number="form.price" placeholder="价格（元）"></el-input>
        </el-form-item>
        <el-form-item label="重量（千克）">
            <el-input v-model.number="form.weight" placeholder="重量（千克）"></el-input>
        </el-form-item>
        <el-form-item label="规格描述">
            <el-input type="textarea" v-model="form.skuDesc" :rows="4" placeholder="请输入规格描述"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <div style="display:inline-block;margin-bottom: 10px;" v-for="attrInfo of attrInfoList" :key="attrInfo.id">
                <span style="display:inline-block;width:100px;text-align: right;margin-right: 10px;">{{
                    attrInfo.attrName
                }}</span>
                <el-select v-model="attrInfo.attrIdAndValueId" placeholder="请选择">
                    <el-option v-for="attrValue of attrInfo.attrValueList" :key="attrValue.id"
                        :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`">
                    </el-option>
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="销售属性">
            <div style="display:inline-block;margin-bottom: 10px;" v-for="spuSaleAttr of spuSaleAttrList"
                :key="spuSaleAttr.id">
                <span style="display:inline-block;width:100px;text-align: right;margin-right: 10px;">{{
                    spuSaleAttr.saleAttrName
                }}</span>
                <el-select v-model="spuSaleAttr.saleIdAndValueId" placeholder="请选择">
                    <el-option v-for="spuSaleAttrValue of spuSaleAttr.spuSaleAttrValueList" :key="spuSaleAttrValue.id"
                        :label="spuSaleAttrValue.saleAttrValueName"
                        :value="`${spuSaleAttrValue.baseSaleAttrId}:${spuSaleAttrValue.id}`">
                    </el-option>
                </el-select>
            </div>
        </el-form-item>
        <el-form-item label="图片列表">
            <el-table :data="spuImageList" tooltip-effect="dark" @selection-change="handleSelectionChange" border
                size="mini" style="width: 100%">
                <el-table-column type="selection" align="center" width="60">
                </el-table-column>
                <el-table-column label="图片">
                    <template slot-scope="{row}">
                        <img :src="row.imgUrl" style="width:100px" />
                    </template>
                </el-table-column>
                <el-table-column prop="imgName" label="名称">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="{row}">
                        <el-button type="primary" v-if="row.isDefault == 0"
                            @click="setDefaultImageHandler(row)">设为默认</el-button>
                        <el-tag v-else type="success">默认图片</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="commitSkuForm">保存</el-button>
            <el-button @click="cancelSkuForm">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { reqSpuSaleAttrList, reqSpuImageList, reqAttrList, reqSaveSkuInfo } from '@/api/product'
export default {
    name: 'SkuForm',
    data() {
        return {
            // form表单
            form: {
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                skuName: "",
                price: 0,
                weight: 0,
                skuDesc: "",
                skuDefaultImg: "",
                skuAttrValueList: [],
                skuSaleAttrValueList: [],
                skuImageList: []
            },
            spuName: '',
            multipleSelection: [],      //table表格中选中的图片
            attrInfoList: [],
            spuSaleAttrList: [],
            spuImageList: [],
        }
    },
    methods: {
        // 初始化请求数据
        initFormData(row, categoryId) {
            this.getAttrList(categoryId)
            this.getSpuSaleAttrList(row.id)
            this.getSpuImageList(row.id)
            this.form.spuId = row.id
            this.spuName = row.spuName
            this.form.category3Id = categoryId.category3Id
            this.form.tmId = row.tmId
        },
        // 请求商品属性信息
        async getAttrList(categoryId) {
            const result = await reqAttrList(categoryId)
            if (result.code === 200) {
                this.attrInfoList = result.data
            }
        },
        // 请求平台属性信息
        async getSpuSaleAttrList(spuId) {
            const result = await reqSpuSaleAttrList(spuId)
            if (result.code === 200) {
                this.spuSaleAttrList = result.data
            }
        },
        // 请求商品图片信息
        async getSpuImageList(spuId) {
            const result = await reqSpuImageList(spuId)
            if (result.code === 200) {
                // 添加一个服务器需要的isDefault字段
                result.data.forEach(item => {
                    item.isDefault = 0
                });
                this.spuImageList = result.data
            }
        },
        // table
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 设置默认图片按钮点击事件
        setDefaultImageHandler(row) {
            this.spuImageList.forEach(item => {
                item.isDefault = 0
            })
            row.isDefault = 1
            this.form.skuDefaultImg = row.imgUrl
        },
        // 取消Sku表单添加
        cancelSkuForm() {
            // 自定义事件回调
            this.$emit('changeScene', 0)
            // 清空页面数据
            this.form = {
                category3Id: 0,
                spuId: 0,
                tmId: 0,
                skuName: "",
                price: 0,
                weight: 0,
                skuDesc: "",
                skuDefaultImg: "",
                skuAttrValueList: [],
                skuSaleAttrValueList: [],
                skuImageList: []
            }
            this.spuName = ''
            this.multipleSelection = []      //table表格中选中的图片
            this.attrInfoList = []
            this.spuSaleAttrList = []
            this.spuImageList = []
        },
        // 提交Sku表单
        commitSkuForm() {
            // 整理数据
            this.attrInfoList.forEach(item => {
                if (item.attrIdAndValueId) {
                    const [attrId, valueId] = item.attrIdAndValueId.split(':')
                    this.form.skuAttrValueList.push({
                        attrId,
                        valueId
                    })
                }
            })
            this.spuSaleAttrList.forEach(item => {
                if (item.saleIdAndValueId) {
                    const [saleAttrId, saleAttrValueId] = item.saleIdAndValueId.split(':')
                    this.form.skuSaleAttrValueList.push({
                        saleAttrId,
                        saleAttrValueId
                    })
                }
            })
            this.multipleSelection.forEach(item => {
                const { id, imgName, imgUrl, isDefault } = item
                this.form.skuImageList.push({
                    spuImgId: id,
                    imgName,
                    imgUrl,
                    isDefault
                })
            })
            // 发起请求
            this.saveSkuForm()
        },
        // 发起提交请求
        async saveSkuForm() {
            const result = await reqSaveSkuInfo(this.form)
            if (result.code === 200) {
                this.$message({
                    type: 'success',
                    message: '恭喜你，Sku添加成功！'
                })
                this.cancelSkuForm() //保存成功，退出页面，清空数据
            } else {
                this.$message.error('抱歉，请稍后重试！')
            }
        }
    }
}
</script>

<style>

</style>
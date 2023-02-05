<template>
    <div>
        <el-form ref="ruleForm" :model="spuForm" :rules="rules" label-width="80px">
            <el-form-item label="SPU名称" prop="spuName">
                <el-input v-model.trim="spuForm.spuName" placeholder="请输入SPU名称"></el-input>
            </el-form-item>
            <el-form-item label="品牌" prop="tmId">
                <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
                    <el-option v-for="trademark of trademarkList" :key="trademark.id" :value="trademark.id"
                        :label="trademark.tmName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="SPU描述" prop="description">
                <el-input type="textarea" v-model.trim="spuForm.description" :rows="4" placeholder="请输入描述内容"></el-input>
            </el-form-item>
            <el-form-item label="SPU图片">
                <el-upload action="/dev-api/admin/product/fileUpload" list-type="picture-card" :file-list="imageList"
                    :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-success="handleSuccess">
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="销售属性">
                <el-select v-model="attrIdAndName" :placeholder='"还有" + saleAttrList.length + "个属性未选择"'>
                    <el-option v-for="baseSaleAttr of saleAttrList" :key="baseSaleAttr.id"
                        :value="`${baseSaleAttr.id}:${baseSaleAttr.name}`" :label="baseSaleAttr.name"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndName" @click="addAttrHandler"
                    style="margin-left:10px">添加销售属性</el-button>
                <el-table :data="spuForm.spuSaleAttrList" border style="width: 100%;margin-top:10px" size="mini">
                    <el-table-column type="index" label="序号" align="center" width="80">
                    </el-table-column>
                    <el-table-column prop="saleAttrName" label="属性名" width="150">
                    </el-table-column>
                    <el-table-column prop="spuSaleAttrValueList" label="属性值名称列表">
                        <template slot-scope="{row}">
                            <el-tag v-for="spuSaleAttrValue of row.spuSaleAttrValueList" :key="spuSaleAttrValue.id"
                                closable @close="handleClose(row.spuSaleAttrValueList, spuSaleAttrValue)" size="medium"
                                style="margin-right:10px">{{
                                    spuSaleAttrValue.saleAttrValueName
                                }}</el-tag>
                            <el-input class="input-new-tag" v-if="row.inputVisible" v-model.trim="row.inputValue"
                                ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(row)"
                                @blur="handleInputConfirm(row)">
                            </el-input>
                            <el-button v-else class="button-new-tag" size="mini" @click="showInput(row)">添加</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" width="150">
                        <template slot-scope="{row}">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="deleteAttrHandler(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="commitSpuFormHandler('ruleForm')">保存</el-button>
                <el-button @click="cancelSpuFormHandler">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reqSpuById, reqTrademarkList, reqSpuImageList, reqBaseSaleAttrList, reqsaveSpuInfo } from '@/api/product'
export default {
    name: 'SpuForm',
    data() {
        return {
            // 表单
            spuForm: {
                category3Id: 0,
                id: undefined,
                spuName: "",
                description: "",
                tmId: '',
                spuImageList: [],
                spuSaleAttrList: [],
            },
            // 收集spuId
            spuId: undefined,
            // 收集属性id和属性名
            attrIdAndName: '',
            // 收集图片列表
            imageList: [],
            // spu信息
            spuInfo: {},
            // 品牌列表
            trademarkList: [],
            // 全部平台属性列表
            baseSaleAttrList: [],
            // 照片墙
            dialogImageUrl: '',
            dialogVisible: false,
            // tag
            inputVisible: false,
            inputValue: '',
            // 表单校验规则
            rules: {
                spuName: [
                    { required: true, message: '请输入SPU名称', trigger: 'blur' },
                    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述信息', trigger: 'blur' },
                ],
                tmId: [
                    { required: true, message: '请选择品牌', trigger: 'blur' },
                ]
            }
        }
    },
    computed: {
        // 筛选后的平台属性列表
        saleAttrList() {
            return this.baseSaleAttrList.filter(item => {
                return this.spuForm.spuSaleAttrList.every(item1 => {
                    return item.id != item1.baseSaleAttrId
                })
            })
        }
    },
    methods: {
        // 修改spu表单时初始化表单数据
        initFormData(row, category3Id) {
            if (row.id) {
                this.getSpuInfo(row.id)
                this.getTrademarkList()
                this.getSpuImageList(row.id)
                this.getBaseSaleAttrList()
                this.spuId = row.id
            } else {
                this.getTrademarkList()
                this.getBaseSaleAttrList()
            }
            this.spuForm.category3Id = category3Id
        },
        // 获取Spu信息
        async getSpuInfo(spuId) {
            const result = await reqSpuById(spuId)
            if (result.code === 200) {
                this.spuInfo = result.data
                this.spuForm.id = result.data.id
                this.spuForm.spuName = result.data.spuName
                this.spuForm.description = result.data.description
                this.spuForm.tmId = result.data.tmId
                this.spuForm.spuSaleAttrList = result.data.spuSaleAttrList
            }
        },
        // 获取品牌列表
        async getTrademarkList() {
            const result = await reqTrademarkList()
            if (result.code === 200) {
                this.trademarkList = result.data
            }
        },
        // 获取spu图片列表
        async getSpuImageList(spuId) {
            const result = await reqSpuImageList(spuId)
            if (result.code === 200) {
                // 添加上照片墙需要的字段
                result.data.forEach(item => {
                    item.name = item.imgName
                    item.url = item.imgUrl
                });
                this.imageList = result.data
            }
        },
        // 获取全部平台属性列表信息
        async getBaseSaleAttrList() {
            const result = await reqBaseSaleAttrList()
            if (result.code === 200) {
                this.baseSaleAttrList = result.data
            }
        },
        // 照片墙事件
        handleRemove(_, fileList) {
            this.imageList = fileList
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleSuccess(response, _, fileList) {
            if (response.code === 200) {
                this.imageList = fileList
            }
        },
        // tag标签事件
        handleClose(row, tag) {
            row.splice(row.indexOf(tag), 1);
        },
        showInput(row) {
            this.$set(row, 'inputVisible', true)
            this.$set(row, 'inputValue', '')
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleInputConfirm(row) {
            if (row.inputValue.trim()) {
                const newAttrValue = { baseSaleAttrId: row.baseSaleAttrId, saleAttrValueName: row.inputValue, saleAttrName: row.saleAttrName, spuId: this.spuId, isChecked: null }
                row.spuSaleAttrValueList.push(newAttrValue)
            }
            row.inputVisible = false;
            row.inputValue = '';
        },
        // 添加属性按钮点击事件
        addAttrHandler() {
            const [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(':')
            let newSaleAttr = { baseSaleAttrId, saleAttrName, spuSaleAttrValueList: [], spuId: this.spuId }
            this.spuForm.spuSaleAttrList.push(newSaleAttr)
            this.attrIdAndName = ''
        },
        // 删除属性按钮点击事件baseSaleAttrId
        deleteAttrHandler(row) {
            this.spuForm.spuSaleAttrList = this.spuForm.spuSaleAttrList.filter(item => {
                return item.baseSaleAttrId != row.baseSaleAttrId
            })
        },
        // 通知父组件关闭spu表单，并清空form表单数据
        deleteData() {
            //通知父组件关闭Spu表单
            this.$emit('changeScene', 0)
            // 清空form表单中的数据
            this.spuForm = {
                category3Id: 0,
                id: undefined,
                spuName: "",
                description: "",
                tmId: '',
                spuImageList: [],
                spuSaleAttrList: [],
            }
            this.spuId = undefined
            this.attrIdAndName = ''
            this.imageList = []
        },
        // 取消spu表单事件
        cancelSpuFormHandler() {
            this.$message('SPU修改已取消');
            this.deleteData()
        },
        // 保存spu表单按钮点击事件
        commitSpuFormHandler(formName) {
            // 表单校验是否通过
            this.$refs[formName].validate((valid) => {
                if (valid) {    //通过
                    // 整理图片列表
                    let spuImageList = []
                    this.imageList.forEach(item => {
                        if (item.id) {
                            spuImageList.push({ imgName: item.imgName, imgUrl: item.imgUrl, spuId: item.spuId })
                        } else {
                            spuImageList.push({ imgName: item.name, imgUrl: item.response.data, spuId: this.spuId })
                        }
                    })
                    this.spuForm.spuImageList = spuImageList
                    // 删除属性列表中的多余字段
                    this.spuForm.spuSaleAttrList.forEach(item => {
                        delete item.inputVisible
                        delete item.inputValue
                    })
                    // 当属性值列表为空时，删除该属性
                    this.spuForm.spuSaleAttrList = this.spuForm.spuSaleAttrList.filter(item => {
                        return item.spuSaleAttrValueList.length
                    })
                    // 发送保存请求
                    this.saveSpuInfo()
                } else {        //不通过
                    this.$message.warning('表单校验不通过，请按规则填写！')
                    return false;
                }
            });
        },
        // 发送保存请求
        async saveSpuInfo() {
            const result = await reqsaveSpuInfo(this.spuForm)
            if (result.code === 200) {
                if (this.spuForm.id) {
                    this.$message({
                        message: '恭喜你，修改SPU成功！',
                        type: 'success'
                    });
                } else {
                    this.$message({
                        message: '恭喜你，添加SPU成功！',
                        type: 'success'
                    });
                }
                this.deleteData()
            } else {
                this.$message.error('抱歉，请稍后重试！');
            }
        }
    }
}
</script>

<style>
.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
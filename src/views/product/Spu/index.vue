<template>
    <div>
        <!-- 三级联动菜单 -->
        <el-card style="margin: 20px 0">
            <ThreeLevelLinkage @getCategoryId="getCategoryId" :scene="scene"></ThreeLevelLinkage>
        </el-card>
        <!-- 表格/添加修改表单 -->
        <el-card style="margin: 20px 0">
            <!-- 表格 -->
            <div v-show="scene === 0">
                <el-button type="primary" icon="el-icon-plus" :disabled="!categoryId.category3Id"
                    @click="addOrAmendSpuHandler({})">添加SPU</el-button>
                <el-table :data="records" border style="width: 100%; margin:10px 0">
                    <el-table-column type="index" align="center" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="spuName" label="spu名称">
                    </el-table-column>
                    <el-table-column prop="description" label="spu描述">
                    </el-table-column>
                    <el-table-column prop="name" label="操作">
                        <template slot-scope="{row}">
                            <el-button type="success" icon="el-icon-plus" size="mini" title="添加SKU"
                                @click="addSkuForm(row)"></el-button>
                            <el-button type="warning" icon="el-icon-edit" size="mini" title="修改SPU"
                                @click="addOrAmendSpuHandler(row)"></el-button>
                            <el-button type="info" icon="el-icon-warning-outline" size="mini" title="查看当前SPU全部SKU列表"
                                @click="skuInfoListHandler(row)"></el-button>
                            <el-popconfirm title="确认删除该属性吗？" style="margin-left:10px" @onConfirm="deleteSpuHandler(row)"
                                @onCancel="$message('已取消删除')">
                                <el-button type="danger" icon="el-icon-delete" size="mini" title="删除SPU"
                                    slot="reference"></el-button>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageInfo.page" :page-sizes="[3, 5, 10]" :page-size="pageInfo.limit"
                    layout="prev, pager, next, jumper, ->, sizes, total" :total="total" align="center">
                </el-pagination>
            </div>
            <!-- 添加/修改spu表单 -->
            <div v-show="scene === 1">
                <SpuForm ref="spuForm" @changeScene="changeScene"></SpuForm>
            </div>
            <!-- 添加sku表单 -->
            <div v-show="scene === 2">
                <SkuForm ref="skuForm" @changeScene="changeScene"></SkuForm>
            </div>
        </el-card>
        <!-- 显示sku列表的dialog -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogTableVisible" @closed="closeDialogHandler">
            <el-table :data="skuInfoList" v-loading="loading">
                <el-table-column property="skuName" label="名称"></el-table-column>
                <el-table-column property="price" label="价格（元）" align="center" width="120"></el-table-column>
                <el-table-column property="weight" label="重量（千克）" align="center" width="120"></el-table-column>
                <el-table-column property="skuDefaultImg" label="默认图片">
                    <template slot-scope="{row}">
                        <img :src="row.skuDefaultImg" style="width: 100px" />
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>

<script>
import { reqSpuList, reqDeleteSpu, reqSkuInfo } from '@/api/product'
import SpuForm from './children/SpuForm.vue'
import SkuForm from './children/SkuForm.vue'
export default {
    name: 'Spu',
    components: {
        SpuForm,
        SkuForm
    },
    data() {
        return {
            categoryId: {},     //三级菜单id
            pageInfo: {         //分页数据
                page: 1,
                limit: 5
            },
            total: 0,          //数据总条数
            records: [],       //spu列表数据
            scene: 0,         //控制要显示的操作区（0：展示spu列表；1：添加修改spu；2：添加sku）
            dialogTableVisible: false,  //dialog显示控制
            dialogTitle: '',
            skuInfoList: [],
            loading: true,
        }
    },
    methods: {
        // 三级菜单改变时触发
        getCategoryId(categoryId) {
            this.categoryId = categoryId    //获取三级菜单id
            // 如果有三级id，就发送spu列表请求
            if (categoryId.category3Id) {
                this.getSpuList()
            } else {
                this.records = [],
                    this.total = 0
            }
        },
        // 请求Spu列表
        async getSpuList() {
            const result = await reqSpuList({ ...this.pageInfo, category3Id: this.categoryId.category3Id })
            if (result.code === 200) {
                this.records = result.data.records
                this.total = result.data.total
            }
        },
        // 分页器
        handleSizeChange(val) {     //每页显示页数改变时触发
            this.pageInfo.limit = val
            this.getSpuList()
        },
        handleCurrentChange(val) {  //当前页改变时触发
            this.pageInfo.page = val
            this.getSpuList()
        },
        // 添加或修改Spu表单点击事件
        addOrAmendSpuHandler(row) {
            this.scene = 1
            if (row.id) {     //修改时
                this.$refs.spuForm.initFormData(row, this.categoryId.category3Id)
            } else {      //添加时
                this.$refs.spuForm.initFormData({}, this.categoryId.category3Id)
            }
        },
        // 添加Sku表单点击事件
        addSkuForm(row) {
            this.scene = 2
            // 直接通过ref获取到子组件，调用子组件中的方法
            this.$refs.skuForm.initFormData(row, this.categoryId)
        },
        // 自定义事件：改变scene
        changeScene(index) {
            this.scene = index
            this.getSpuList()
        },
        // 删除Spu按钮点击事件
        async deleteSpuHandler(row) {
            // 删除指定的Spu
            const result = await reqDeleteSpu(row.id)
            if (result.code === 200) {
                this.$message.success('你已成功删除 ' + row.spuName)
                this.getSpuList()   //重新获取页面数据
            }
        },
        // 查看当前spu全部sku列表点击事件
        async skuInfoListHandler(row) {
            this.dialogTitle = row.spuName + ' 的Sku列表'
            this.dialogTableVisible = true
            // 发送获取该spu的sku列表请求
            const result = await reqSkuInfo(row.id)
            if(result.code === 200){
                this.skuInfoList = result.data
                this.loading = false
            }
        },
        // 关闭dialog时的回调函数
        closeDialogHandler(){
            // 清空数据
            this.dialogTitle = ''
            this.skuInfoList = []
            this.loading = true
        }
    }
}
</script>

<style>

</style>

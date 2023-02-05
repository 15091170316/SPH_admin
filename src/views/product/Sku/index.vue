<template>
    <div>
        <!-- table表格 -->
        <el-table :data="skuList" border style="width: 100%;margin-top:20px">
            <el-table-column type="index" label="序号" align="center" width="70">
            </el-table-column>
            <el-table-column prop="skuName" label="名称">
            </el-table-column>
            <el-table-column prop="skuDesc" label="描述">
            </el-table-column>
            <el-table-column prop="skuDefaultImg" label="默认图片" align="center" width="150px">
                <template slot-scope="{row}">
                    <img :src="row.skuDefaultImg" style="width:100px" />
                </template>
            </el-table-column>
            <el-table-column prop="weight" label="重量（KG）" align="center">
            </el-table-column>
            <el-table-column prop="price" label="价格（元）" align="center">
            </el-table-column>
            <el-table-column label="操作" align="center" min-width="230">
                <template slot-scope="{row}">
                    <el-button type="success" icon="el-icon-download" size="mini" title="下架" v-if="row.isSale != 0"
                        @click="upOrDownHandler(row, 0)"></el-button>
                    <el-button type="primary" icon="el-icon-upload2" size="mini" title="上架" v-else
                        @click="upOrDownHandler(row, 1)"></el-button>
                    <el-button type="warning" icon="el-icon-edit" size="mini" title="修改Sku"
                        @click="updateSkuHandler(row)"></el-button>
                    <el-button type="info" icon="el-icon-warning-outline" size="mini" title="查看详情"
                        @click="getSkuInfoHandler(row)"></el-button>
                    <el-popconfirm :title="`确认删除 ${row.skuName}？`" @onConfirm="deleteSkuHandler(row)"
                        style="margin-left:10px">
                        <el-button type="danger" icon="el-icon-delete" size="mini" title="删除Sku"
                            slot="reference"></el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="pageInfo.page" :page-sizes="[5, 10, 20]" :page-size="pageInfo.limit"
            layout="prev, pager, next, jumper, ->, sizes, total" :total="total" align="center" style="margin: 20px 0">
        </el-pagination>
        <!-- 抽屉(显示sku详细信息) -->
        <el-drawer title="详情信息" :visible.sync="drawer" size="50%" @closed="closeDrawerHandler">
            <div class="drawer-content">
                <div class="drawer-item">
                    <h3>名称</h3>
                    <p class="item-right">{{ skuInfo.skuName }}</p>
                </div>
                <div class="drawer-item">
                    <h3>描述</h3>
                    <p class="item-right">{{ skuInfo.skuDesc }}</p>
                </div>
                <div class="drawer-item">
                    <h3>价格</h3>
                    <p class="item-right">{{ skuInfo.price }}</p>
                </div>
                <div class="drawer-item">
                    <h3>平台属性</h3>
                    <div class="item-right">
                        <el-tag type="success" v-for="skuAttrValue of skuInfo.skuAttrValueList" :key="skuAttrValue.id"
                            style="margin:8px">{{ skuAttrValue.valueName.trim() }}</el-tag>
                    </div>
                </div>
                <div class="drawer-item">
                    <h3>销售属性</h3>
                    <div class="item-right">
                        <el-tag type="primary" v-for="skuSaleAttrValue of skuInfo.skuSaleAttrValueList"
                            :key="skuSaleAttrValue.id" style="margin:8px">{{
                                skuSaleAttrValue.saleAttrValueName.trim()
                            }}</el-tag>
                    </div>
                </div>
                <div class="drawer-item">
                    <h3>商品图片</h3>
                    <div class="item-right">
                        <div class="carousel-box">
                            <el-carousel height="300px">
                                <el-carousel-item v-for="skuImage of skuInfo.skuImageList" :key="skuImage.id">
                                    <img :src="skuImage.imgUrl" style="height:100%;width:100%" />
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer>
        <!-- dialog（修改sku信息） -->
        <el-dialog title="修改Sku" :visible.sync="dialogVisible" width="40%" :close-on-click-modal="false"
            :close-on-press-escape="false" :show-close="false">
            <span>敬请期待</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { reqSkuList, reqOnSale, reqCancelSale, reqSkuById, reqDeleteSku } from '@/api/product'
export default {
    name: 'Sku',
    data() {
        return {
            skuList: [],
            pageInfo: {
                page: 1,
                limit: 10
            },
            total: 0,
            drawer: false,
            skuInfo: {},
            dialogVisible: false
        }
    },
    methods: {
        // 请求sku列表数据
        async getSkuList() {
            const result = await reqSkuList(this.pageInfo)
            if (result.code === 200) {
                this.skuList = result.data.records
                this.total = result.data.total
            }
        },
        // 分页器
        handleSizeChange(val) {
            this.pageInfo.limit = val
            this.getSkuList()
        },
        handleCurrentChange(val) {
            this.pageInfo.page = val
            this.getSkuList()
        },
        // sku的上下架按钮点击事件
        async upOrDownHandler(row, status) {
            if (status == 0) {    //下架
                const result = await reqCancelSale(row.id)
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: row.skuName + " 下架成功！`"
                    })
                    this.getSkuList()
                } else {
                    this.$message.error(row.skuName + " 下架失败，请稍后重试！`")
                }
            } else {      //上架
                const result = await reqOnSale(row.id)
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: row.skuName + " 上架成功！`"
                    })
                    this.getSkuList()
                } else {
                    this.$message.error(row.skuName + " 上架失败，请稍后重试！`")
                }
            }
        },
        // 查看sku详情按钮点击事件
        async getSkuInfoHandler(row) {
            this.drawer = true
            const result = await reqSkuById(row.id)
            if (result.code === 200) {
                this.skuInfo = result.data
            }
        },
        // 关闭抽屉的回调事件
        closeDrawerHandler() {
            this.skuInfo = {}
        },
        // 删除sku
        async deleteSkuHandler(row) {
            const result = await reqDeleteSku(row.id)
            if (result.code === 200) {
                this.getSkuList()
                this.$message.success('恭喜你，删除成功！')
            } else {
                this.$message.error('删除失败，请稍后重试！')
            }
        },
        // 修改sku按钮点击事件
        updateSkuHandler(row) {
            console.log(row);
            this.dialogVisible = true
        },
    },
    mounted() {
        // 请求sku列表数据
        this.getSkuList()
    }
}
</script>

<style lang="scss">
.drawer-content {
    padding: 0 20px;

    .drawer-item {
        overflow: hidden;
        margin: 20px 0;

        h3 {
            float: left;
            display: block;
            width: 18%;
            text-align: right;
            margin: 0;
        }

        .item-right {
            float: left;
            width: 75%;
            margin: 0 10px;
            line-height: 25px;

            .carousel-box {
                width: 300px;
                border: 1px #ccc solid
            }
        }
    }
}

// 修改轮播图样式
.el-carousel__button {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background: rgb(126, 126, 126);
}
</style>

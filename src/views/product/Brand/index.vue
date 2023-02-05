<template>
    <div class="content-box">
        <!-- 头部 -->
        <div class="header-box">
            <el-button type="primary" icon="el-icon-plus" @click="openDialogHandler({})">添加</el-button>
        </div>
        <!-- table -->
        <div class="table-box">
            <el-table :data="brandList" border style="width: 100%">
                <el-table-column type="index" label="序号" width="80" align="center">
                </el-table-column>
                <el-table-column prop="tmName" label="品牌名称">
                </el-table-column>
                <el-table-column prop="logoUrl" label="品牌LOGO">
                    <template slot-scope="{ row }">
                        <img :src="row.logoUrl" style="width:80px;height:80px">
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="warning" icon="el-icon-edit" size="small"
                            @click="openDialogHandler(scope.row)">修改</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="small"
                            @click="deleteHandler(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页器 -->
        <div class="footer-box">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageInfo.page" :page-sizes="[3, 5, 10]" :page-size="pageInfo.limit"
                layout="prev, pager, next, jumper, ->, sizes, total" :total="total" style="text-align:center">
            </el-pagination>
        </div>
        <!-- dialog -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form" :rules="rules" ref="ruleForm" style="width:80%">
                <el-form-item label="商品品牌" :label-width="formLabelWidth" prop="tmName">
                    <el-input v-model="form.tmName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="商品LOGO" :label-width="formLabelWidth" prop="logoUrl">
                    <el-upload class="avatar-uploader" action="/dev-api/admin/product/fileUpload"
                        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                        <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2Mb</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addBrandHandler">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { reqBrandList, reqAddOrUpdateBrand, reqDeleteBrand } from '@/api/product'
export default {
    name: 'Brand',
    data() {
        return {
            pageInfo: {
                page: 1,
                limit: 5
            },
            total: 0,
            brandList: [],
            dialogFormVisible: false,
            dialogTitle: '添加商品品牌',
            form: {
                tmName: '',
                logoUrl: ''
            },
            formLabelWidth: '120px',
            // 表单验证
            rules: {
                tmName: [
                    { required: true, message: '请输入商品品牌', trigger: 'blur' },
                    { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
                ],
                logoUrl: [
                    { required: true, message: '请上传品牌图片' }
                ]
            }
        }
    },
    methods: {
        // 异步请求商品品牌数据函数
        async getBrandList() {
            const result = await reqBrandList(this.pageInfo)
            if (result.code === 200) {
                this.brandList = result.data.records
                this.total = result.data.total
            }
        },
        // currentPage 改变时会触发
        handleCurrentChange(current) {
            this.pageInfo.page = current
            this.getBrandList()
        },
        // pageSize 改变时会触发
        handleSizeChange(size) {
            this.pageInfo.limit = size
            this.getBrandList()
        },
        // 打开dialog,区分add和update
        openDialogHandler(row) {
            this.dialogFormVisible = true
            // 区分
            if (row.id) {
                this.dialogTitle = '修改商品品牌'
                this.form = { ...row }
            } else {
                this.dialogTitle = '添加商品品牌'
                this.form = {
                    tmName: '',
                    logoUrl: ''
                }
            }
        },
        // upload
        // 文件上传成功时的钩子
        handleAvatarSuccess(res) {
            this.form.logoUrl = res.data
        },
        // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        // 上传或更改品牌信息按钮
        addBrandHandler() {
            // form表单验证
            this.$refs.ruleForm.validate(async (valid) => {
                if (valid) {
                    // form表单验证通过，发送请求
                    const result = await reqAddOrUpdateBrand({ ...this.form })
                    if (result.code === 200) {
                        this.dialogFormVisible = false
                        this.$message({
                            message: this.form.id ? '恭喜你，修改成功！' : '恭喜你，添加成功！',
                            type: 'success'
                        })
                        this.getBrandList()
                    } else {
                        this.$message.error({
                            message: this.form.id ? '抱歉，修改失败！' : '恭喜你，添加失败！',
                            type: 'error'
                        })
                    }
                } else {
                    // form表单验证不通过
                    console.log('error submit!!')
                    return false
                }
            })
        },
        // 删除商品品牌按钮事件
        deleteHandler(row) {
            this.$confirm(`确认删除${row.tmName}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 确认删除
                const result = await reqDeleteBrand(row.id)
                if (result.code === 200) {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    })
                    this.getBrandList()
                } else {
                    this.$message.error('删除失败，请稍后重试！')
                }
            }).catch(() => {
                // 取消删除
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    },
    mounted() {
        // 获取商品品牌信息
        this.getBrandList()
    }
}
</script>

<style lang="scss">
.header-box,
.table-box,
.footer-box {
    margin: 20px 0;
}

.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

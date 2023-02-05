<template>
    <div>
        <!-- 三级联动 -->
        <el-card class="box-card">
            <ThreeLevelLinkage @getCategoryId="getCategoryId" :scene="0"></ThreeLevelLinkage>
        </el-card>
        <!-- 属性列表/添加修改属性 -->
        <el-card class="box-card">
            <!-- 属性列表 -->
            <div v-show="showtable">
                <el-button type="primary" icon="el-icon-plus" style="margin-bottom:10px" @click="addAttrHandler({})"
                    :disabled="!categoryId.category3Id">添加属性</el-button>
                <el-table :data="attrlist" border style="width: 100%" size="small">
                    <el-table-column type="index" label="序号" width="80" align="center">
                    </el-table-column>
                    <el-table-column prop="attrName" label="属性名称" width="150">
                    </el-table-column>
                    <el-table-column prop="attrValueList" label="属性值列表">
                        <template slot-scope="{row}">
                            <el-tag type="success" v-for="attrValue of row.attrValueList" :key="attrValue.id"
                                style="margin-right:10px">{{ attrValue.valueName }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150">
                        <template slot-scope="{row}">
                            <el-button type="warning" icon="el-icon-edit" size="mini"
                                @click="addAttrHandler(row)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="deleteAttrHandler(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 添加修改属性 -->
            <div v-show="!showtable">
                <el-form ref="form" :model="arrtInfo" label-width="60px">
                    <el-form-item label="属性名">
                        <el-input v-model="arrtInfo.attrName" style="width:200px" placeholder="请输入属性名"></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="el-icon-plus" :disabled="!arrtInfo.attrName"
                    @click="addAttrValueHandler">添加属性值</el-button>
                <el-table :data="arrtInfo.attrValueList" border style="width: 100%;margin: 20px 0" size="small">
                    <el-table-column type="index" align="center" label="序号" width="80">
                    </el-table-column>
                    <el-table-column prop="valueName" label="属性值名称">
                        <template slot-scope="{row}">
                            <el-input v-model="row.valueName" ref="attrValueInput" placeholder="请输入属性值" size="mini"
                                style="border:none" @focus="$event.target.style = 'border:1px skyblue solid'"
                                @blur="$event.target.style = 'border:none'"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="{row}">
                            <el-button type="danger" icon="el-icon-delete" size="mini"
                                @click="deleteAttrValueHandler(row)"></el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div>
                    <el-button type="primary" :disabled="!arrtInfo.attrValueList.length"
                        @click="commitAttrHandler">保存</el-button>
                    <el-button @click="cancelAttrHandler">取消</el-button>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script>
import { reqAttrList, reqAddOrUpdateAttr, reqDeleteAttr } from '@/api/product'
export default {
    name: 'Attr',
    data() {
        return {
            // 商品属性列表
            attrlist: [],
            // 控制显示内容（表格/添加修改）
            showtable: true,
            // 收集传递过来的菜单id
            categoryId: {},
            // 准备所有要添加修改属性的请求数据
            arrtInfo: {
                attrName: "",
                attrValueList: [],
                categoryId: undefined,  //3级菜单id
                categoryLevel: 3,
            },
        }
    },
    methods: {
        // 获取子组件传递过来的三级id，直接发送属性列表请求
        getCategoryId(categoryId) {
            // 收集菜单id
            this.categoryId = categoryId
            // 当有三级菜单id时，才发送属性列表请求
            if (categoryId.category3Id) {
                this.getAttrList()
            } else {
                // 没有就直接置空表格
                this.attrlist = []
            }
            // 三级联动改变时显示表格
            this.showtable = true
        },
        // 获取属性列表请求
        async getAttrList() {
            const result = await reqAttrList(this.categoryId)
            if (result.code === 200) {
                this.attrlist = result.data
            }
        },
        // 删除属性
        deleteAttrHandler(row) {
            this.$confirm(`确认删除${row.attrName}属性?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const result = await reqDeleteAttr(row.id)
                if (result.code === 200) {
                    this.$message({
                        message: '恭喜你，添加成功！',
                        type: 'success'
                    })
                    this.getAttrList()   //重新获取属性列表
                } else {
                    this.$message.error('删除失败，请稍后重试！')
                }
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 添加/修改属性
        addAttrHandler(row) {
            // row.attrName存在就是修改属性，不存在就是添加属性
            if (row.attrName) {
                // 修改前初始化表单
                this.arrtInfo = {
                    attrName: row.attrName,
                    attrValueList: _.cloneDeep(row.attrValueList),  //深拷贝
                    categoryId: row.categoryId,  //3级菜单id
                    categoryLevel: row.categoryLevel,
                    id: row.id
                }
            } else {
                // 添加前置空表单
                this.arrtInfo = {
                    attrName: "",
                    attrValueList: [],
                    categoryId: undefined,  //3级菜单id
                    categoryLevel: 3,
                }
            }

            this.showtable = false
        },
        // 添加属性值
        addAttrValueHandler() {
            this.arrtInfo.attrValueList.push({
                attrId: undefined,
                valueName: ""
            })
            // 添加新属性值是自动聚焦
            this.$nextTick(() => {
                this.$refs.attrValueInput.focus()
            })
        },
        // 删除属性值
        deleteAttrValueHandler(row) {
            let s = new Set(this.arrtInfo.attrValueList)
            s.delete(row)
            this.arrtInfo.attrValueList = [...s]
        },
        // 取消属性修改与新增
        cancelAttrHandler() {
            this.showtable = true
        },
        // 提交属性修改与新增
        async commitAttrHandler() {
            // 当输入的属性值有空的，不允许提交
            const flag = this.arrtInfo.attrValueList.some(item => {
                if (item.valueName.trim() === '') {
                    return true
                }
            })
            // true表示有为空的，不能提交
            if (flag) {
                this.$message({
                        message: '不能提交为空的属性值！',
                        type: 'warning'
                    })
            } else {
                // 收集三级id
                this.arrtInfo.categoryId = this.categoryId.category3Id
                // 清除新增属性中的空格
                this.arrtInfo.attrName = this.arrtInfo.attrName.trim()
                this.arrtInfo.attrValueList.filter(item => {
                    item.valueName = item.valueName.trim()
                })
                // 发送添加属性请求
                const result = await reqAddOrUpdateAttr(this.arrtInfo)
                if (result.code === 200) {
                    this.$message({
                        message: '恭喜你，添加成功！',
                        type: 'success'
                    })
                    this.showtable = true
                    this.getAttrList()   //重新获取属性列表
                } else {
                    this.$message({
                        message: '添加失败，请稍后重试！',
                        type: 'error'
                    })
                }
            }
        }
    }
}
</script>

<style lang="scss">
.box-card {
    width: 100%;
    margin: 10px 0;
}
</style>

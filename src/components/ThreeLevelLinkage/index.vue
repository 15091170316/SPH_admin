<template>
    <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="一级分类">
                <el-select v-model="formInline.category1Id" placeholder="请选择" @change="change1Handler" :disabled="scene!=0">
                    <el-option :label="item.name" :value="item.id" v-for="item of attrLinkageList.list1"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="formInline.category2Id" placeholder="请选择" @change="change2Handler" :disabled="scene!=0">
                    <el-option :label="item.name" :value="item.id" v-for="item of attrLinkageList.list2"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="formInline.category3Id" placeholder="请选择" @change="change3Handler" :disabled="scene!=0">
                    <el-option :label="item.name" :value="item.id" v-for="item of attrLinkageList.list3"
                        :key="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reqCategory1, reqCategory2, reqCategory3 } from '@/api/product'
export default {
    name: 'ThreeLevelLinkage',
    data() {
        return {
            // 请求的三级联动菜单数据
            attrLinkageList: {
                list1: [],
                list2: [],
                list3: []
            },
            // select选择的三级联动菜单数值
            formInline: {
                category1Id: '',
                category2Id: '',
                category3Id: ''
            }
        }
    },
    props: ['scene'],
    methods: {
        // 请求一级菜单数据
        async getCategory1() {
            const result = await reqCategory1()
            if (result.code === 200) {
                this.attrLinkageList.list1 = result.data
                this.attrLinkageList.list2 = []
                this.attrLinkageList.list3 = []
            }
        },
        // 一级菜单改变，请求二级菜单数据，并传递所有id给父组件（当未选完所有三级菜单时，可以置空父组件的属性表格）
        async change1Handler() {
            const result = await reqCategory2(this.formInline.category1Id)
            if (result.code === 200) {
                this.attrLinkageList.list2 = result.data
                this.attrLinkageList.list3 = []
            }
            this.formInline.category2Id = ''
            this.formInline.category3Id = ''
            this.$emit('getCategoryId', this.formInline)
        },
        // 二级菜单改变，请求三级菜单数据，并传递所有id给父组件（当未选完所有三级菜单时，可以置空父组件的属性表格）
        async change2Handler() {
            const result = await reqCategory3(this.formInline.category2Id)
            if (result.code === 200) {
                this.attrLinkageList.list3 = result.data
            }
            this.formInline.category3Id = ''
            this.$emit('getCategoryId', this.formInline)
        },
        // 三级菜单改变，，并传递所有id给父组件（此时选完了所有三级id，就会发送获取属性列表请求）
        async change3Handler() {
            this.$emit('getCategoryId', this.formInline)
        }
    },
    mounted() {
        // 获取一级菜单数据
        this.getCategory1()
    }
}
</script>

<style>

</style>
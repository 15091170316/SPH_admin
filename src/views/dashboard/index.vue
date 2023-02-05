<template>
    <div class="dash-page">
        <!-- 顶部四小块 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <SmallCard title="总销售额" :count="`￥${chartsList.salesTotal}`">
                    <template v-slot:charts>
                        <div class="card-charts">
                            <span>月同比 {{chartsList.salesGrowthLastMonth}}%</span>
                            <svg v-if="chartsList.salesGrowthLastMonth>0" t="1675348699974" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3911" width="16" height="16">
                                <path d="M935.936 749.3632H86.4256l424.7552-471.2448L935.936 749.3632z m0 0" p-id="3912"
                                    fill="#d81e06"></path>
                            </svg>
                            <svg v-else t="1675348629820" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2114" width="16" height="16">
                                <path
                                    d="M511.997952 755.974268l365.02634-487.950584L146.975708 268.023684 511.997952 755.974268"
                                    p-id="2115" fill="#1afa29"></path>
                            </svg>
                            <span style="margin-left:15px">日同比 {{chartsList.salesGrowthLastDay}}%</span>
                            <svg v-if="chartsList.salesGrowthLastDay>0" t="1675348699974" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3911" width="16" height="16">
                                <path d="M935.936 749.3632H86.4256l424.7552-471.2448L935.936 749.3632z m0 0" p-id="3912"
                                    fill="#d81e06"></path>
                            </svg>
                            <svg v-else t="1675348629820" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2114" width="16" height="16">
                                <path
                                    d="M511.997952 755.974268l365.02634-487.950584L146.975708 268.023684 511.997952 755.974268"
                                    p-id="2115" fill="#1afa29"></path>
                            </svg>
                        </div>
                    </template>
                    <template v-slot:footer>
                        <div class="card-footer">
                            <span>日销售额 ￥{{ chartsList.salesToday }}</span>
                        </div>
                    </template>
                </SmallCard>
            </el-col>
            <el-col :span="6">
                <SmallCard title="访问量" :count=chartsList.visitTotal>
                    <template v-slot:charts>
                        <div class="card-charts">
                            <LineCharts></LineCharts>
                        </div>
                    </template>
                    <template v-slot:footer>
                        <div class="card-footer">
                            <span>日访问量 {{chartsList.visitToday}}</span>
                        </div>
                    </template>
                </SmallCard>
            </el-col>
            <el-col :span="6">
                <SmallCard title="支付笔数" :count=chartsList.payTotal>
                    <template v-slot:charts>
                        <div class="card-charts">
                            <RectCharts></RectCharts>
                        </div>
                    </template>
                    <template v-slot:footer>
                        <div class="card-footer">
                            <span>转换率 {{chartsList.payRate}}%</span>
                        </div>
                    </template>
                </SmallCard>
            </el-col>
            <el-col :span="6">
                <SmallCard title="运营活动效果" :count="`${chartsList.activityRate}%`">
                    <template v-slot:charts>
                        <div class="card-charts">
                            <SingleRectCharts :rate="chartsList.activityRate"></SingleRectCharts>
                        </div>
                    </template>
                    <template v-slot:footer>
                        <div class="card-footer">
                            <span>月同比 {{chartsList.activityGrowthLastMonth}}%</span>
                            <svg v-if="chartsList.activityGrowthLastMonth>0" t="1675348699974" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3911" width="16" height="16">
                                <path d="M935.936 749.3632H86.4256l424.7552-471.2448L935.936 749.3632z m0 0" p-id="3912"
                                    fill="#d81e06"></path>
                            </svg>
                            <svg v-else t="1675348629820" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2114" width="16" height="16">
                                <path
                                    d="M511.997952 755.974268l365.02634-487.950584L146.975708 268.023684 511.997952 755.974268"
                                    p-id="2115" fill="#1afa29"></path>
                            </svg>
                            <span style="margin-left:15px">日同比 {{chartsList.activityGrowthLastDay}}%</span>
                            <svg v-if="chartsList.activityGrowthLastDay>0" t="1675348699974" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="3911" width="16" height="16">
                                <path d="M935.936 749.3632H86.4256l424.7552-471.2448L935.936 749.3632z m0 0" p-id="3912"
                                    fill="#d81e06"></path>
                            </svg>
                            <svg v-else t="1675348629820" class="icon" viewBox="0 0 1024 1024" version="1.1"
                                xmlns="http://www.w3.org/2000/svg" p-id="2114" width="16" height="16">
                                <path
                                    d="M511.997952 755.974268l365.02634-487.950584L146.975708 268.023684 511.997952 755.974268"
                                    p-id="2115" fill="#1afa29"></path>
                            </svg>
                        </div>
                    </template>
                </SmallCard>
            </el-col>
        </el-row>
        <!-- 中间布局 -->
        <div>
            <BigCard></BigCard>
        </div>
        <!-- 底部布局 -->
        <div class="footer">
            <el-row :gutter="20">
                <!-- 左 -->
                <el-col :span="12">
                    <MudiumCard title="线上热门搜索">
                        <!-- 头部菜单插槽 -->
                        <template v-slot:headerMenu>
                            <el-dropdown>
                                <span class="el-dropdown-link">···</span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item>黄金糕</el-dropdown-item>
                                    <el-dropdown-item>狮子头</el-dropdown-item>
                                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                        <!-- 主要内容插槽 -->
                        <template v-slot:main>
                            <div>
                                <el-row :gutter="30" style="margin-top:20px">
                                    <el-col :span="12">
                                        <MediumLineCharts title="搜索用户数" :number="userNumber" rate="-18.3" :list="userList"></MediumLineCharts>
                                    </el-col>
                                    <el-col :span="12">
                                        <MediumLineCharts title="人均搜索次数" :number="averageCount" rate="1.2" :list="countList"></MediumLineCharts>
                                    </el-col>
                                </el-row>
                                <el-table :data="chartsList.searchWord" style="width: 100%;margin:20px 0" max-height="250px" border >
                                    <el-table-column type="index" label="排名" width="70px" align="center">
                                    </el-table-column>
                                    <el-table-column prop="word" label="搜索关键字">
                                    </el-table-column>
                                    <el-table-column prop="user" label="用户数" sortable>
                                    </el-table-column>
                                    <el-table-column prop="count" label="搜索次数" sortable>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </template>
                    </MudiumCard>
                </el-col>
                <!-- 右 -->
                <el-col :span="12">
                    <MudiumCard title="销售额类别占比">
                        <!-- 头部菜单插槽 -->
                        <template v-slot:headerMenu>
                            <el-radio-group v-model="radioMenu" size="small">
                                <el-radio-button label="全部渠道"></el-radio-button>
                                <el-radio-button label="线上"></el-radio-button>
                                <el-radio-button label="门店"></el-radio-button>
                            </el-radio-group>
                        </template>
                        <!-- 主要内容插槽 -->
                        <template v-slot:main>
                            <MediumPieCharts :pieData="pieData"></MediumPieCharts>
                        </template>
                    </MudiumCard>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import SmallCard from './SmallCard'
import LineCharts from './SmallCard/LineCharts'
import RectCharts from './SmallCard/RectCharts'
import SingleRectCharts from './SmallCard/SingleRectCharts'
import BigCard from './BigCard'
import MudiumCard from './MediumCard'
import MediumLineCharts from './MediumCard/MediumLineCharts'
import MediumPieCharts from './MediumCard/MediumPieCharts'
import {mapState, mapActions} from 'vuex'
export default {
    name: 'Dashboard',
    components: {
        SmallCard,
        LineCharts,
        RectCharts,
        SingleRectCharts,
        BigCard,
        MudiumCard,
        MediumLineCharts,
        MediumPieCharts
    },
    data() {
        return {
            radioMenu: '全部渠道',
        }
    },
    computed:{
        ...mapState('home', ['chartsList']),
        // 搜索用户数
        userNumber(){
            let arr = this.chartsList.searchWord || []
            let num = 0
            arr.forEach(item => {
                num += parseInt(item.user)
            });
            return num
        },
        // 总搜索数
        searchCount(){
            let arr = this.chartsList.searchWord || []
            let num = 0
            arr.forEach(item => {
                num += parseInt(item.count)
            });
            return num
        },
        // 人均搜索数
        averageCount(){
            return (this.searchCount / this.userNumber).toFixed(2)
        },
        // 搜索用户数数组
        userList(){
            let userList = []
            let arr = this.chartsList.searchWord || []
            arr.forEach(item => {
                userList.push(item.user)
            });
            return userList
        },
        // 搜索次数数组
        countList(){
            let countList = []
            let arr = this.chartsList.searchWord || []
            arr.forEach(item => {
                countList.push(item.count)
            });
            return countList
        },
        // 饼图数据
        pieData(){
            let obj = this.chartsList.saleRank || {}
            let online = obj.online || {}
            let shop = obj.shop || {}
            let onlineName = online.name || []
            let shopName = shop.name || []
            let pieData = []
            if(this.radioMenu == '线上'){
                onlineName.forEach((item,index) => {
                    let data = {}
                    data.name = item
                    data.value = online.value[index]
                    pieData.push(data)
                });
            }else if(this.radioMenu == '门店'){
                shopName.forEach((item,index) => {
                    let data = {}
                    data.name = item
                    data.value = shop.value[index]
                    pieData.push(data)
                });
            }else{
                onlineName.forEach((item,index) => {
                    let data = {}
                    data.name = item
                    data.value = online.value[index] + shop.value[index]
                    pieData.push(data)
                });
            }
            return pieData
        }
    },
    methods:{
        ...mapActions('home', ['getMockData'])
    },
    mounted(){
        // 发起mock请求
        this.getMockData()
    }

}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    color: rgb(138, 138, 138);
}

.el-icon-arrow-down {
    font-size: 12px;
}

.dash-page {
    margin-top: 20px;

    .card-charts {
        width: 100%;
        height: 60px;
        display: flex;
        align-items: center;
    }

    .card-footer {
        font-size: 18px;
    }
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.footer {
    margin: 20px 0;
}
</style>

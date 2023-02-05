<template>
    <el-card class="card-content">
        <!-- tabs切换栏 -->
        <el-tabs v-model="tabValue" @tab-click="handleClick">
            <el-tab-pane label="销售额" name="sale"></el-tab-pane>
            <el-tab-pane label="访问量" name="visits"></el-tab-pane>
        </el-tabs>
        <!-- 日期选择 -->
        <div class="date-box">
            <div class="select-data-box">
                <span @click="setDay">今日</span>
                <span @click="setWeek">本周</span>
                <span @click="setMonth">本月</span>
                <span @click="setYear">本年</span>
            </div>
            <div class="data-picker-box">
                <el-date-picker v-model="dateValue" type="daterange" range-separator="-" start-placeholder="开始日期"
                    end-placeholder="结束日期" size="small" style="max-width:280px">
                </el-date-picker>
            </div>
        </div>
        <!-- 图表与排行 -->
        <el-row>
            <el-col :span="18">
                <div class="charts" ref="charts"></div>
            </el-col>
            <el-col :span="6">
                <div class="right-box">
                    <span>门店{{ title }}排行</span>
                    <el-table :data="saleTable" style="width: 100%" :show-header="false">
                        <el-table-column type="index" align="center">
                            <template slot-scope="{$index}">
                                <div class="table-circle"
                                    :style="{ backgroundColor: $index < 3 ? '#cea05e' : '', color: $index < 3 ? '#fff' : '#000' }">
                                    {{
                                    $index+ 1 }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" align="center">
                        </el-table-column>
                        <el-table-column prop="money" align="center">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
    name: 'BigCard',
    data() {
        return {
            tabValue: 'sale',
            dateValue: ['', ''],
            saleTable: [{ name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }, { name: '肯德基', sale: 321425 }],
            myCharts: '',
        }
    },
    computed: {
        // 计算要显示的标题
        title() {
            return this.tabValue == 'sale' ? '销售额' : '访问量'
        },
        ...mapState('home', ['chartsList'])
    },
    watch: {
        // 监视tabs的变化，更新echarts
        tabValue(newValue) {
            // 修改echarts数据
            this.myCharts.setOption({
                title: {
                    text: this.title + '趋势'
                },
                xAxis: {
                    data: newValue == 'sale' ? this.chartsList.orderFullYearAxis : this.chartsList.userFullYearAxis,
                },
                series: [
                    {
                        data: newValue == 'sale' ? this.chartsList.orderFullYear : this.chartsList.userFullYear,
                    },
                ],
            })
            // 修改排行数据
            this.saleTable = newValue == 'sale' ? this.chartsList.orderRank : this.chartsList.userRank
        },
        chartsList: {
            deep: true,
            handler() {
                // 初始化图表
                this.myCharts.setOption({
                    xAxis: {
                        data: this.chartsList.orderFullYearAxis,
                    },
                    series: [
                        {
                            data: this.chartsList.orderFullYear,
                        },
                    ],
                })
                // 初始化排行数据
                this.saleTable = this.chartsList.orderRank
            }
        }
    },
    methods: {
        // 日期选择器
        handleClick(tab, event) {
            // console.log(tab, event);
        },
        // 初始化echarts
        setCharts() {
            this.myCharts = echarts.init(this.$refs.charts)
            this.myCharts.setOption({
                title: {
                    text: '销售额趋势'
                },
                xAxis: {
                    type: 'category',
                    data: [],
                    axisTick: {
                        alignWithLabel: true
                    }
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        data: [],
                        barMaxWidth: '50%',
                    },
                ],
                grid: {
                    top: '50px',
                    bottom: '50px',
                    left: '80px',
                    right: '50px',

                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow',
                    }
                },
            })
            this.listeningCharts()
        },
        // 监听页面变化，重新渲染echarts
        listeningCharts() {
            window.addEventListener('resize', () => {
                this.myCharts.resize()
            })
        },
        // 获取四种日期的选择
        // 本天
        setDay() {
            let start = dayjs().format('YYYY-MM-DD')
            let end = dayjs().format('YYYY-MM-DD')
            this.dateValue = [start, end]
        },
        // 本周
        setWeek() {
            let start = dayjs().day(1).format('YYYY-MM-DD')
            let end = dayjs().day(7).format('YYYY-MM-DD')
            this.dateValue = [start, end]
        },
        // 本月
        setMonth() {
            let start = dayjs().startOf('month').format('YYYY-MM-DD')
            let end = dayjs().endOf('month').format('YYYY-MM-DD')
            this.dateValue = [start, end]
        },
        // 本年
        setYear() {
            let start = dayjs().startOf('year').format('YYYY-MM-DD')
            let end = dayjs().endOf('year').format('YYYY-MM-DD')
            this.dateValue = [start, end]
        },
    },
    mounted() {
        this.setCharts()
    }

}
</script>

<style lang="scss">
.el-tabs__item {
    font-size: 20px;
}

.card-content {
    position: relative;
}

.date-box {
    display: flex;
    align-items: center;
    position: absolute;
    right: 20px;
    top: 15px;

    .select-data-box {
        margin-right: 20px;

        span {
            margin: 10px;
        }
    }
}

.charts {
    width: 100%;
    height: 500px;
    margin-top: 20px;
}

.right-box {
    height: 460px;
    overflow: hidden;
    margin-top: 25px;
    margin-left: 20px;

    span {
        font-size: 18px;
        font-weight: bold;
        color: rgb(80, 80, 80);
        margin-bottom: 10px;
    }

    .table-circle {
        width: 30px;
        height: 30px;
        line-height: 30px;
        align-items: center;
        border-radius: 50%;
    }
}

.right-box .el-table {
    font-size: 18px;
}

.right-box .el-table td,
.right-box .el-table th.is-leaf {
    border: none;
}

.right-box .el-table--border::after,
.right-box .el-table--group::after,
.right-box .el-table::before {
    position: relative;
}
</style>
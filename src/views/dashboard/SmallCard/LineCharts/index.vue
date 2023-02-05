<template>
    <div class="charts" ref="echarts"></div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
    name: 'LineCharts',
    computed: {
        ...mapState('home', ['chartsList'])
    },
    watch: {
        chartsList: {
            deep: true,
            handler(newValue) {
                this.myCharts.setOption({
                    series: [{
                        data: newValue.visitTrend
                    }]
                })
            }
        }
    },
    methods: {
        setCharts() {
            this.myCharts = echarts.init(this.$refs.echarts)
            this.myCharts.setOption({
                xAxis: {
                    type: 'category',
                    show: false,
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [{
                    type: 'line',
                    data: [],
                    smooth: true,
                    showSymbol: false,
                    lineStyle: {
                        color: '#a891ed'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#9480d1' // 0% 处的颜色
                            }, {
                                offset: 1, color: '#fff' // 100% 处的颜色
                            }],
                            global: false // 缺省为 false
                        }
                    }
                }],
                grid: {
                    top: 0,
                    bottom: 0,
                    left: -10,
                    right: -10
                }
            })
            // 监听窗口发生变化时，重新加载图表
            this.listeningCharts()
        },
        listeningCharts() {
            window.addEventListener('resize', () => {
                this.myCharts.resize()
            })
        }
    },
    mounted() {
        // 配置echarts
        this.setCharts()
    }
}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>
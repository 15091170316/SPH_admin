<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
import { mapState } from 'vuex'
export default {
    name: 'RectCharts',
    computed:{
        ...mapState('home', ['chartsList'])
    },
    watch:{
        chartsList:{
            deep:true,
            handler(){
                this.myCharts.setOption({
                    series:[{
                        data: this.chartsList.payTrend
                    }]
                })
            }
        }
    },
    methods: {
        setCharts() {
            this.myCharts = echarts.init(this.$refs.charts)
            this.myCharts.setOption({
                xAxis: {
                    type: 'category',
                    show: false
                },
                yAxis: {
                    type: 'value',
                    show: false
                },
                series: [{
                    type: 'bar',
                    data: [],
                    itemStyle: {
                        color: '#5271cb'
                    },

                }],
                grid: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0
                },
                tooltip: {
                    show: true,
                    formatter: '{c}'
                }
            })
            this.listeningCharts()
        },
        listeningCharts() {
            window.addEventListener('resize', () => {
                this.myCharts.resize()
            })
        }
    },
    mounted() {
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
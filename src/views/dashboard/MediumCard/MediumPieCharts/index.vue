<template>
    <div class="charts-pie" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'MediumPieCharts',
    props: ['pieData'],
    watch: {
        pieData: {
            deep: true,
            handler() {
                this.myCharts.setOption({
                    series: [{
                        data: this.pieData
                    }]
                })
            }
        }
    },
    methods: {
        setCharts() {
            this.myCharts = echarts.init(this.$refs.charts)
            this.myCharts.setOption({
                title: {
                    text: '家用电器',
                    subtext: '',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        fontSize: 28
                    },
                    subtextStyle: {
                        fontSize: 22
                    }
                },
                tooltip: {
                    trigger: 'item'
                },
                legend: {
                    top: '5%',
                    left: 'center'
                },
                series: [
                    {
                        name: '销售额类别占比',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        avoidLabelOverlap: false,
                        itemStyle: {
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: {
                            show: true,
                            position: 'outside',
                            formatter: '{b}：{c}',
                            fontSize: 16,
                        },
                        labelLine: {
                            show: true,
                        },
                        data: []
                    }
                ],
            })
            // echarts的鼠标触摸事件
            this.myCharts.on('mousemove', (params) => {
                const { name, value } = params.data
                this.myCharts.setOption({
                    title: {
                        text: name,
                        subtext: value,
                    },
                })
            });
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
.charts-pie {
    width: 100%;
    height: 500px;
    padding-top: 20px;
}
</style>
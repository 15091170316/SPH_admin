<template>
    <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'SingleRectCharts',
    props: ['rate'],
    watch: {
        rate(newValue) {
            this.myCharts.setOption({
                series: [{
                    data: [newValue]
                }]
            })
        }
    },
    mounted() {
        this.setCharts()
    },
    methods: {
        setCharts() {
            this.myCharts = echarts.init(this.$refs.charts)
            this.myCharts.setOption({
                xAxis: {
                    type: 'value',
                    show: false,
                    max: 100,
                    min: 0
                },
                yAxis: {
                    type: 'category',
                    show: false
                },
                series: [{
                    type: 'bar',
                    data: [],
                    barWidth: 20,
                    itemStyle: {
                        color: '#98bf2e',
                        width: '20px'
                    },
                    showBackground: true,
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '|',
                        textStyle: {
                            color: '#98bf2e',
                            fontSize: '22px'
                        }
                    }
                }],
                grid: {
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tooltip: {
                    show: true,
                    formatter: '{c}%'
                }
            })
            this.listeningCharts()
        },
        listeningCharts() {
            window.addEventListener('resize', () => {
                this.myCharts.resize()
            })
        }
    }

}
</script>

<style scoped>
.charts {
    width: 100%;
    height: 100%;
}
</style>
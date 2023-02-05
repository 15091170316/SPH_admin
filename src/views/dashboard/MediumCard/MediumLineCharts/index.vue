<template>
    <div>
        <div class="header">
            <span>{{title}}</span>
            <svg t="1675347066848" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2745" width="16" height="16">
                <path
                    d="M512 0a512 512 0 1 0 0 1024A512 512 0 0 0 512 0z m0 896A384 384 0 0 1 512 128a384 384 0 0 1 0 768z m29.696-194.88c-11.136 10.112-24.96 17.344-31.488 15.36-6.08-1.792-9.536-7.424-8.384-13.056l89.344-248c7.424-31.488-12.736-60.16-55.424-63.872-44.8 0-110.976 40.128-151.232 90.944 0 6.08-1.344 21.12 0.128 30.208l53.632-54.208c11.008-10.176 23.808-17.344 30.336-15.424 6.592 1.92 10.112 8.384 8 14.464l-88.704 246.848c-10.176 28.864 9.152 57.152 56.192 63.616 68.928 0 109.888-39.168 150.208-89.984 0-6.08 2.368-22.08 0.96-31.104l-53.568 54.208zM575.744 192c-35.584 0-64.448 25.728-64.448 63.808 0 37.952 28.864 63.744 64.448 63.744 35.648 0 64.448-25.728 64.448-63.744 0-38.08-28.8-63.808-64.448-63.808z"
                    p-id="2746" fill="#bfbfbf"></path>
            </svg>
        </div>
        <div class="count">
            <h3>{{ number }}</h3>
            <span>{{rate}}</span>
            <svg v-if="rate>0" t="1675348699974" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="3911" width="16" height="16">
                <path d="M935.936 749.3632H86.4256l424.7552-471.2448L935.936 749.3632z m0 0" p-id="3912" fill="#d81e06">
                </path>
            </svg>
            <svg v-else t="1675348629820" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                p-id="2114" width="16" height="16">
                <path d="M511.997952 755.974268l365.02634-487.950584L146.975708 268.023684 511.997952 755.974268"
                    p-id="2115" fill="#1afa29"></path>
            </svg>
        </div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
    name: 'MediumLineCharts',
    props: ['title', 'number', 'rate', 'list'],
    watch:{
        list(){
            this.myCharts.setOption({
                series:[{
                    data: this.list
                }]
            })
        }
    },
    methods: {
        setCharts() {
            this.myCharts = echarts.init(this.$refs.charts)
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
                        color: '#6d94e5'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: '#abb7ed' // 0% 处的颜色
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
                    left: -25,
                    right: -25
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

<style lang="scss" scoped>
.header {
    padding-top: 20px;

    span {
        font-size: 18px;
        color: rgb(112, 112, 112);
        margin-right: 10px;
    }
}

.count {
    display: flex;
    align-items: center;

    h3 {
        font-size: 30px;
        margin: 20px 30px 20px 0;
    }

    span {
        font-size: 18px;
        color: rgb(148, 148, 148);
        margin-right: 5px;
    }
}

.charts {
    width: 100%;
    height: 60px;
}
</style>
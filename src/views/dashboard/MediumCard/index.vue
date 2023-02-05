<template>
    <el-card>
        <div class="header">
            <span>{{title}}</span>
            <slot name="headerMenu"></slot>
        </div>
        <div class="main">
            <slot name="main"></slot>
        </div>
    </el-card>
</template>

<script>
export default {
    name: 'MediumCard',
    props: ['title']
}
</script>

<style lang="scss" scoped>

.header {
    border-bottom: 1px rgb(226, 226, 226) solid;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
        display: inline-block;
        padding: 15px 0;
        font-size: 20px;
    }
}
</style>
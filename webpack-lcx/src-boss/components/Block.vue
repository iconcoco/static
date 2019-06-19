<template>
    <div  class="table-container">
        <div class="admin-tab-title">{{title}}</div>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props:['title']
}
</script>

<style lang="scss" scoped>
.table-container{
    position: relative;
}
</style>
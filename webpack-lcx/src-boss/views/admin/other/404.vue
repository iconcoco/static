<template>
    <div class="error-container">
        <div class="error404">
            <h2><span>404</span>  <i class="el-icon-info"></i>  Oops! Page not found.</h2>
        </div>
    </div>
</template>

<style lang="scss" scoped>

    .error-container{
        height: 100%;
        background-color: #fff;
        padding-top: 60px;
    }
    .error404{
        width: 600px;
        margin: 0 auto;
        h2{
            font-size: 25px;
            vertical-align: middle;
            font-weight: normal;
            text-align: center;
            span,i{
                color: #f39c12;
            }
            span{
                font-size: 80px;
                vertical-align: middle;
                margin-right: 50px;
            }
        }
    }
</style>


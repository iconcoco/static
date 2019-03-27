<template>
    <div class="fadeIn">
        <div class="all-app-container">
            <ul class="clearfix">
                <li class="active">
                    <span class="icon">
                        <i></i>
                    </span>
                    <div class="icon-text">
                        <h3><span>自动提现</span> <span class="new">NEW</span></h3>
                        <p>资金入账，自动提现</p>
                        <a href="javascript:;" class="cares-button-primary" @click="eventRouterTo">立即设置</a>
                    </div>
                </li>
                <li class="not-allowed">
                    <span class="icon">
                        <i class="i-2"></i>
                    </span>
                     <div class="icon-text">
                        <h3><span>锁汇助手</span></h3>
                        <p>锁定汇率，收入增值</p>
                        <p>敬请期待</p>
                    </div>
                </li>
                <li class="not-allowed">
                    <span class="icon">
                        <i class="i-3"></i>
                    </span>
                     <div class="icon-text">
                         <h3><span>其他</span></h3>
                        <p>更多应用，敬请期待</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

export default {
    methods:{
        eventRouterTo(){
            this.$router.push({name:'AutoPay'})
        }
    }
}
</script>


<style lang="scss" scoped>

.all-app-container{
    min-height: 500px;
}
ul{
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    li{
        // float: left;
        width: 277px;
        height: 138px;
        border: 1px solid #e5e5e5;
        transition: all .3s;
        // margin-right: 30px;
        margin-bottom: 20px;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        // &:nth-child(3n){
        //     margin-right: 0;
        // }
        &.active{
            &:hover{
                box-shadow: 0 0 10px rgba(0,0,0,.2);
            }
        }
        &.not-allowed{
            background-color: #f1f1f1;
            cursor: not-allowed;
        }

        .icon{
            display: inline-block;
            width: 37%;
            height: 100%;
            line-height:138px; 
             vertical-align: middle;
             text-align: center;
             i{
                 display: inline-block;
                 width: 59px;
                 height:59px;
                 background: url('./../../../../images/carepay/css_sprites.png') no-repeat;
                 background-position: -8px -89px;
                 vertical-align: middle;
                 &.i-2{
                     background-position: -10px -10px;
                 }
                 &.i-3{
                     background-position: -90px -9px;
                 }
             }
        }
        .icon-text{
            display: inline-block;
            width: 60%;
            // float: right;
            height: 88px;
            vertical-align: middle;
            color: #666;
            background-color: transparent;
            h3{
                font-size: 16px;
                font-weight: 400;
                margin-bottom: 15px;
                color: #444;
                span{
                    vertical-align: middle;
                }
                span.new{
                    display: inline-block;
                    width: 36px;
                    height: 18px;
                    border-radius: 9px;
                    color: #fff;
                    text-align: center;
                    background-color: red;
                    font-size: 12px;
                    margin-left: 5px;
                    line-height: 18px;
                }
            }
            p{
                font-size: 14px;
                margin-bottom: 15px;
            }
        }
    }
}
</style>

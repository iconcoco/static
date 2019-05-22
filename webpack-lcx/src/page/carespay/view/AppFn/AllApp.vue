<template>
    <div class="fadeIn">
        <div class="all-app-container">
            <ul class="clearfix">

                <li class="active" @click="eventRouterTo('FastArrival')">
                    <span class="icon">
                        <i class="i-4"></i>
                    </span>
                    <div class="icon-text">
                        <h3><span>闪提宝</span> <span class="new">NEW</span></h3>
                        <p>资金周转，快人一步</p>
                    </div>
                </li>
                <li class="active" @click="eventRouterTo('AutoPay')">
                    <span class="icon">
                        <i></i>
                    </span>
                    <div class="icon-text">
                        <h3><span>自动提现</span></h3>
                        <p>资金入账，自动提现</p>
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
        eventRouterTo(name){
            this.$router.push({name})
        }
    }
}


</script>


<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';

.all-app-container{
    min-height: 500px;
}
ul{
    padding-top: 20px;
    // display: flex;
    // justify-content: space-between;
    // flex-wrap: wrap;
    li{
        width: 277px;
        height: 138px;
        transition: all .3s;
        margin: 0 40px;
        margin-bottom: 40px;
        background-color: #fff;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 5px 0px rgba(0,0,0,.08);
        position: relative;
        float: left;

        &::before{
            content: "";
            position: absolute;
            width: 3px;
            height: 100%;
            left: 0;
            top: 0;
            background-color: $--color-primary-one;
        }
        &.active{
            cursor: pointer;
            &:hover{
                box-shadow: 0 0 10px rgba(0,0,0,.2);
            }
        }
        &.not-allowed{
            background-color: #f5f5f5;
            cursor: not-allowed;

            &::before{
                background-color: #ccc;
            }
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
                 margin-top: -30px;
                 &.i-2{
                     background-position: -10px -10px;
                 }
                 &.i-3{
                     background-position: -90px -9px;
                 }
                 &.i-4{
                     height: 63px;
                     background-position: -90px -89px;
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
                color: #333;
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
                color: #999;
            }

            a{
                margin-top: 10px;
            }
        }
    }
}
</style>

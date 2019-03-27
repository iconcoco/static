<template>
    <div class="wechat_share_container">
        <h2> 
            <span>
                <img src="../../../../../images/weChat/s_logo.png" alt="">
            </span> 
        </h2>
        <div class="code_container">
            <h1>CaresPAY代言人活动</h1>
            <div class="code_pic">
                <img src="./../../../../../images/weChat/code.png" alt="">
                <p>  <span>长按关注，立即参与</span> </p>
            </div>
            <div class="scan_code">
                <img src="./../../../../../images/weChat/point.png" alt="">
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
    @function size($px){
        @return ($px/100)*1rem;
    }

    $carespayColor:#f7b52c;

    .wechat_share_container{
        background-color: #f39b31;
        height: 100%;
        padding-top: size(95);
        line-height: size(50);
        font-weight: normal;
        h2{
            color: #fff;
            font-size: size(35);
            text-align: center;
            margin-bottom: size(60);
            >span{
                display: inline-block;
                width: size(374);
                height: size(51);
                vertical-align: middle;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
        }
    }

    .code_container{
        width: size(600);
        // height: size(900);
        margin: 0 auto;
        border-radius: size(8);
        overflow: hidden;
        h1{
            height: size(120);
            background-color: #f8f1e9;
            color: #333;
            font-size: size(36);
            line-height: size(120);
            text-align: center;
            font-weight: 500;
        }
        .code_pic{
            height: size(609);
            background-color: #fff;
            text-align: center;
            line-height: size(609);
            position: relative;
            img{
                width: size(424);
                height: size(422);
                vertical-align: middle;
            }
            &::after,
            &::before
            {
                content: "";
                width: size(38);
                height: size(38);
                border-radius: 50%;
                background-color: #f39b31;
                position: absolute;
                bottom: size(-19);
            }
            &::after{
                left: size(-19);
            }
            &::before{
                right: size(-19);
            }
            p{
                height: size(30);
                width: size(500);
                position: absolute;
                bottom: size(-15);
                left: 50%;
                margin-left: size(-250);
                z-index: 200;
                line-height: size(30);
                span{
                    display: inline-block;
                    height: 100%;
                    font-size: size(30);
                    color: #333;
                    padding: 0 size(20);
                    vertical-align: top;
                    background-color: #fff;
                    position: relative;
                    z-index: 22;
                }
                &::before{
                    content: "";
                    position: absolute;
                    width: 100%;
                    left: 0;
                    top: 50%;
                    height:  size(2);
                    background-color:#e5e5e5;
                }
            }
        }
        .scan_code{
            height: size(174);
            background-color: #fff;
            line-height: size(174);
            text-align: center;
            img{
                width: size(83);
                height: size(82);
            }
        }
    }

</style>

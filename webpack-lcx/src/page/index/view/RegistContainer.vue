<template>
<transition name="fade">
    <div class="regist-content">

        <div class="regist-banner progress">
            <ul class="clearfix" :class="activeClass">
                <li class="one">
                    <i></i>
                    <span>{{processData.begin}}</span>
                </li>
                <li class="two">
                     <i></i>
                     <span>{{processData.ing}}</span>
                </li>
                <li class="three">
                   <i></i>
                   <span>{{processData.done}}</span>
                </li>
            </ul>
        </div>

        <div class="regist-form regist-banner">
            <!-- 子路由 -->
            <router-view  @processData="bindProcessData"  @process="bindProcessClass">

            </router-view>
        </div>
    </div>
</transition>
</template>

<script>
    export default{
        data(){
            return{
                activeClass:'',
                processData:{
                    begin:"开始注册",
                    ing:"完成一半了",
                    done:"大功告成！",
                }
            }
        },
        created() {
            
        },
        methods:{
            bindProcessClass(cls){
                this.activeClass = cls;
            },
            bindProcessData(obj){
                Object.assign(this.processData,obj);
            }
        }
    }
</script>

<style lang="scss">
    @import './../../../css/common/theme.scss';

    @function percen($a, $b) {
            @return ($a/$b)*100%;
    }
    .regist-banner{
        width: 430px;
        margin: 0 auto;
    }

    //进度条
    .progress{
        display: none;
        ul{
            margin-top:48px;
            li{
                float: left;
                position: relative;
                height:3px;
                border:1px solid #f15a24;
                // border-color: pink;
                i{
                    // content:"";
                    position:absolute;
                    width:10px;
                    height:10px;
                    z-index: 5;
                    border-radius:50%;
                    top:-5px;
                    border:1px solid #f15a24;
                }
                span{
                    position: absolute;
                    top:10px;
                    font-size:12px;
                    color:#666;
                    right:-20px;
                }
            }
            .one{
                width:percen(72,472);
                 background-color:#f15a24;
                i{
                    right:-4px;
                    background-color:#f15a24;
                }

                 &::after{
                    content:"";
                    position:absolute;
                    width:8px;
                    height:5px;
                    top:-1px;
                    right:5px;
                    background-color:#f4f5f9;
                }
                 &::before{
                    content:"";
                    position:absolute;
                    width:8px;
                    height:5px;
                    top:-1px;
                    left:3px;
                    background-color:#f4f5f9;
                }
            }
            .two{
                width:percen(171,472);
                i{
                    right:-4px;
                    background-color:#f4f5f9;
                }
                span{
                     right:-28px;
                }
            }
            .three{
                width:percen(229,472);
                i{
                    right:percen(120,472);
                     background-color:#f4f5f9;
                }

                span{
                     right:31px;
                }

                 &::after{
                    content:"";
                    position:absolute;
                    width:8px;
                    height:3px;
                    top:-1px;
                    right:3px;
                    border-left:1px solid #f15a24;
                    border-right:1px solid #f15a24;
                    background-color:#f4f5f9;
                }
                 &::before{
                    content:"";
                    position:absolute;
                    width:8px;
                    height:3px;
                    top:-1px;
                    right:percen(108,472);
                    border-left:1px solid #f15a24;
                    border-right:1px solid #f15a24;
                    background-color:#f4f5f9;
                }
            }
        }
        .center{
            .two{
                background-color: #f15a24;
                i{
                    right:-4px;
                    background-color:#f15a24;
                }
            }
        }
        .done{
             .two{
                background-color: #f15a24;
                i{
                    background-color:#f15a24;
                }
            }
            .three{
                background-color: #f15a24;
                i{
                    background-color:#f15a24;
                }
            }
        }
    }

    .regist-success{
         display: inline-block;
         font-size: 100px;
         margin-bottom: 40px;
         color: $--color-primary-success;
    }
    

    .regist-form{
        background-color: #fff;
        margin: 48px auto;
        padding: 0 40px;
        border-radius: 8px;
        h2{
            font-size: 24px;
            color: #333;
            text-align: center;
            font-weight: normal;
            height: 118px;
            line-height: 118px;
        }
        // 2.0 版本优化的提示
        .el-form-item{
            position: relative;
            min-height: 30px;

            a,span{
                position: absolute;
                right:10px;
                top:0px;
                font-size:12px;
                color: #aaa;
            }

            &.channel-bar{
                .el-form-item__label{
                    width: 120px;
                }
                 .el-form-item__content{
                    padding-left: 130px;
                }
            }

             .el-form-item__label{
                width:95px;
                line-height: 30px;
                text-align: left;
            }
             .el-input{
                    width: 100%;
                }
            .el-form-item__content{
                width: 100%;
                line-height: 30px;
                position: absolute;
                >i{
                    display: inline-block;
                     height:20px;
                    width:20px;
                    position: absolute;
                    top:0;
                    right: 10px;
                    line-height:32px;
                    text-align:center;
                    z-index: 5;
                    color:#aaa;
                }
                .i-c-eye{
                   
                    top: 5px;
                    background:url('../../../images/login/u105.svg') no-repeat center center;
                    background-size: 100% 100%;
                    cursor: pointer;
                }
                .i-o-eye{
                    top: 5px;
                    background:url('../../../images/login/u106.svg') no-repeat center center;
                    background-size: 100% 100%;
                    cursor: pointer;
                }

            }

        }
        
        .line{
            padding-bottom: 30px;
            margin-bottom: 30px;
        }
        .el-button{
            width: 100%;
            border-radius: 10px;
        }
        .el-select{
            width: 100%;
            border-radius: 10px;
        }
        p{
            padding: 20px 0;
            font-size: 12px;
            color: #666;
            text-align: center;
        }

        .success-icon{
            width: 100px;
            height: 100px;
        }
        
    }

    @media screen and (max-width:768px) {
        //小屏幕的时候
        .regist-banner{
            width: 320px;
        }
         .regist-form{
            padding: 0 10px;
        }
    }
</style>



<template>
    <div class="box-container">
        <!-- 海报页面 -->
        <div  v-if="!toFill" class="spoken_ac_gb">
            <div class="spoken_ac_guide">
                <div class="spoken_ac_top">
                    <img src="./../../../../../images/weChat/haibao.jpg" alt="">
                </div>
                
                <div class="spoken_ac_btn" @click="bingToGetPic" href="javascript:;">点击获取专属海报</div>

                <p>活动最终解释权归CaresPAY所有</p>
            </div>
        </div>
        <!-- 填充手机页面 -->
        <form  v-else class="spoken_ac_fillphone">
            <div class="form-item">
                <span>手机号码</span>
                <div class="item">
                    <el-input type="tel" maxlength="11" v-model="form.phoneNo" placeholder="请输入11位手机号码"></el-input>
                </div>
            </div>
            <div class="form-item">
                <span>验证码</span>
                <div class="item">
                    <el-input type="tel" maxlength="6" v-model="form.code" placeholder="请输入验证码"></el-input>
                    <a :class="{active:checkPhone && flag}" @click="bindToGetcode" href="javascript:;">{{btnTxt}}</a>
                </div>
            </div>
            <span @click="bindPhoneAndGetPic" class="button" :class="{active:checkCode && checkPhone}">生成代言人专属二维码</span>
        </form>
    </div>
</template>

<script>

    // import Verification from './../../../../../js/verification.js';

    import {
        spokesmanGetInfo,
        spokesmanBindCode,
        spokesmanBindPhone
        } from '../../../uitls/api.js';

    export default{
        data(){
            return{
                toFill:false,
                form:{
                    phoneNo:'',
                    code:'',
                },
                flag:true,
                btnTxt:'获取验证码'
            }
        },
        computed:{
            checkPhone(){
                return  /^1[3-9][0-9]{9}$/.test(this.form.phoneNo);
            },
            checkCode(){
                return  /^[0-9]{6}$/.test(this.form.code);
            },
        },
        methods:{
            //发送验证码
            bindToGetcode(){
                if(!this.flag) return;
                let t = 60;
                this.flag = false;
                this.checkPhone && spokesmanBindCode({phoneNo:this.form.phoneNo}).then(res=>{
                    if(res.code==0){
                        let _this = this;
                        let timer = setInterval(()=>{
                            t--;
                            _this.btnTxt = `${t}s`
                            if(t==0){
                                _this.flag = true;
                                _this.btnTxt = `获取验证码`;
                                clearInterval(timer);
                            }
                        },1000);
                    }else{
                         _this.flag = true;
                        alert(res.msg);
                    }
                })
            },
            //获取海报
            bingToGetPic(){
               
                spokesmanGetInfo().then(res=>{
                    if(res.code==0){
                            res.data ? this.$router.push({name:"spokesImg"}) :this.toFill = true;
                    }else{
                         alert(res.msg);
                    }
                });
            },
            bindPhoneAndGetPic(){

               this.checkCode && spokesmanBindPhone({
                   phone:this.form.phoneNo,
                   code:this.form.code
               }).then(res=>{
                   if(res.code==0){
                       this.$router.push({name:"spokesImg"});
                   }else{
                       alert(res.msg);
                   }
                });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @function size($px){
        @return ($px/100)*1rem;
    }

    $carespayColor:#f7b52c;

    .box-container{
        height: 100%;
    }

    .spoken_ac_gb{
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        .spoken_ac_top{
            height: size(708);
            img{
                height: 100%;
                width: 100%;
                vertical-align: top;
            }
        }
        .spoken_ac_guide{
            position: absolute;
            width: size(520);
            height: size(900);
            background-color: #fff;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            overflow: hidden;
        }
        .spoken_ac_btn{
            // display: block;
            margin: 0 auto;
            margin-top: size(-10);
            height: size(88);
            line-height: size(88);
            text-align: center;

            width: size(380);
            background-color: $carespayColor;
            border-radius: size(44);
            color: #fff;
            font-size: size(36);
           
            vertical-align: top;
            position: relative;
            z-index: 10;
        }
        p{
            font-size: size(14);
            color: #aaa;
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: size(28);
        }
    }


    .spoken_ac_fillphone{
        background-color: #fff;
        height: 100%;
        padding: size(60) size(75) 0;
        .form-item{
            // position: relative;
            >span{
                // position: absolute;
                font-size: size(32);
                line-height: size(40);
                height: size(40);
                color: #333;
                vertical-align: middle;
            }
            .item{
                position: relative;
                 vertical-align: top;
                 height: size(80);
                 margin-top: size(-20);
                .el-input{
                    vertical-align: top;
                    border: none;
                    
                    width: 100%;
                    height: size(80);
                }
                >a{
                    position: absolute;
                    right: size(10);
                    top: 0;
                    display: inline-block;
                    width: size(228);
                    height:  size(64);
                    line-height: size(68);
                    text-align: center;

                    border-radius: size(32);
                    font-size: size(24);
                    color: #fff;
                    background-color: #aaa;
                   
                    &.active{
                        background-color: $carespayColor;
                    }
                }
            }
        }
        .button{
            display: inline-block;
            width: 100%;
            height: size(88);
            line-height: size(94);
            text-align: center;
             font-size: size(30);
            color: #fff;

            border-radius: size(44);
            background-color: #aaa;
            
            
            &.active{
                background-color: $carespayColor;
            }
        }
    }

    

</style>

<style lang="scss">
 @function size($px){
        @return ($px/100)*1rem;
    }
        .spoken_ac_fillphone{
            .form-item{
                .item{
                    .el-input{
                        .el-input__inner{
                            background-color: transparent;
                            border-radius: 0;
                            border:none;
                            border-bottom: size(1) solid #ccc ;
                        }
                    }
                }
            }
        }

</style>



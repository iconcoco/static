<template>
    <div class="share_container" v-if="show">
        <div class="share_img">
            <img :src="imgSrc" alt="分享图片">
            <!-- <img src="../../../../../images/weChat/xxxx.png" alt=""> -->
            <p>长按图片保存，分享好友或朋友圈</p>
        </div>
    </div>
</template>

<script>

  import {
        spokesmanGetImg,
        wxcongfig,
        spokesmanValid
        } from '../../../uitls/api.js';
    export default{
        data(){
            return{
                imgSrc:"",
                show:false
            }
        },
        created() {

            spokesmanValid().then(res=>{
                if(res.code==0){

                       res.data ? wx.closeWindow() : (this.imgSrc = spokesmanGetImg,this.show = true);

                }else{
                    alert(res.msg)
                }
            });

        },
        methods:{
            
        }
    }
</script>

<style lang="scss" scoped>

     @function size($px){
        @return ($px/100)*1rem;
    }

    $carespayColor:#f7b52c;
   

    .share_container{
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
        .share_img{
            position: absolute;
            width: size(562);
            height: size(1018);
            top: 48%;
            left: 50%;
            transform: translate(-50%,-50%);
            text-align: center;
            background-color: #fff;
             font-size: size(30);
            img{
                width: 100%;
                height: 100%;
            }
            p{
                display: inline-block;
                position: absolute;
                text-align: center;
                width:  100%;
                height:  size(88);
                left: 0;
                // margin-left: size(-190);
                bottom: size(-80);
                color: #fff;
                // background-color: $carespayColor;
                line-height: size(88);
                font-size: size(30);
                border-radius: size(44);
            }
        }

    }
</style>



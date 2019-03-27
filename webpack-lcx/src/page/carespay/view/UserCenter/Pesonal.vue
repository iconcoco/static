<template>
 <transition name="fade">
    <div class="pesonal-container">
        <!--账号中心左栏列表-->
        <div class=" pesonal-list">
            <ul>
                <router-link to="/Pesonal/accountcenter">
                    <li @click="isshow(0)" :class="{active:isactive ==0}">
                        <span>账号中心</span>
                    </li>
                </router-link>
                
                <router-link to="/Pesonal/realname?isactive=1">
                    <li v-if="isRealname" @click="isshow(1)" :class="{active:isactive ==1}">
                        <span>实名认证</span>
                    </li>
                </router-link>

                <!-- <router-link to="/Pesonal/invitationfriend?isactive=2">
                    <li class="clearBorder" @click="isshow(2)" :class="{active:isactive ==2}">
                        <span>邀请朋友</span>
                    </li>
                </router-link> -->

                <router-link to="/Pesonal/Coupon?isactive=3">
                    <li class="clearBorder" @click="isshow(3)" :class="{active:isactive ==3}">
                        <span>我的优惠券</span>
                    </li>
                </router-link>
            </ul>
        </div>
       
        <!--账号中心右栏信息-->
        <div class=" pesonal-info">
            <!--试图容器-->
            <router-view></router-view>
        </div>

       
    </div>
 </transition>
</template>

<script>

    import {queryPersonInfo} from '../../utils/localbase.js';

    export default {
        data(){
            return{
                //定义默认状态显示用户编号栏
                isactive:0,
                isRealname:false
            }
        },
        created() {
            this.isactive = this.$route.query.isactive || 0;

             queryPersonInfo().then(res=>{
                    res ?
                    (
                        this.isRealname = true
                    ):
                    (
                        this.isRealname = false
                    );
                })
        },
        methods:{
            //定义切换tab方法
            isshow(val){
                this.isactive = val;
            }
        },
        watch:{
            $route(n){
                 this.isactive = n.query.isactive || 0;
            }
        },
        computed:{
        }
       
    }
</script>

<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    .pesonal-container{
        position: relative;
        .pesonal-list{
            width: 290px;
            min-height: 100%;
            position: absolute;
        }
        .pesonal-info{
            min-height: 100%;
            margin-left: 300px;
            padding: 0;
        }
    }
 
    //左边列表
    .pesonal-list{
        ul{
            li{
                height: 80px;
                line-height: 80px;
                text-align: center;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                color: #666;
                font-size: 16px;
                &.active{
                    color:$--color-primary-one;
                }
            }
        }
    }

   
</style>


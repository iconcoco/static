<template>
    <div class="query-container">
        <!-- 推荐0 -->
        <template v-if="form.tjUserCount == 0">
            <div class="rec-0">
                <p>恭喜您加入CaresPAY代言人计划，推荐好友注册CaresPAY,领取现金红包，还有神秘大奖等你来收，还在等什么？立刻开始推荐吧！</p>
            </div>
        </template>
        <!-- 有效 -->
        <template v-else>
            <div class="eff">
                <h3>亲爱的用户，您的代言人活动结果详情如下</h3>
                <div>
                    <p>成功推荐注册CaresPAY账号人数 <b>{{form.tjUserCount}}</b> </p>
                    <p>有效推荐人数 <b>{{form.yxUserCount}}</b> </p>
                    <!-- 邮箱推荐人 0<x<5 -->
                    <p class="tip" v-if="form.yxUserCount<5"><span>继续加油，有效推荐人数达5人，您还将额外获得888元现金红包。</span></p>
                    <!-- 邮箱推荐人 5<x<15 -->
                    <p class="tip" v-else-if="form.yxUserCount<15"><span>继续加油，有效推荐人数达15人，您还将额外获得2888元现金红包。</span></p>
                </div>
            </div>
        </template>

         <button @click="bindToShareLink" class="share-link"> <span></span> 点击分享</button>

        <div class="handle clearfix">
            <button :class="{disabled:form.yxUserCount==0}" @click="bindToWithdraw" class="receive">领取现金奖励</button>
            <button :class="{disabled:form.yxUserCount==0}" @click="bindToRecord" class="record">查看提现记录</button>
        </div>
    </div>
</template>

<script>
    import { spokesmanGetReward,spokesmanGetInfo } from '../../../uitls/api.js';

    export default{
        data(){
            return{
                form:{
                    tjUserCount:'',
                    yxUserCount:'',
                },
                pageData:{}
            }
        },
        created(){
            spokesmanGetInfo().then(res=>{
                if(res.code==0){
                    res.data ? query() :this.$router.push({name:"spokes"});
                }else{
                    alert(res.msg);
                }
            })

            let _this = this;
            let query = function(){
                spokesmanGetReward().then(res=>{
                    if(res.code == 0){
                        _this.form.tjUserCount = res.data.tjUserCount;
                        _this.form.yxUserCount = res.data.yxUserCount;

                        _this.pageData = res.data;
                    }else{
                        alert(res.msg);
                    }
                });
            }
           
        },
        methods:{
            //分享链接
            bindToShareLink(){
                this.$router.push({name:"spokes"});
            },
            //领取奖金
            bindToWithdraw(){
                if(!this.form.yxUserCount) return;
                this.$router.push({name:'spokesWithdraw',params:this.pageData});
            },
            //提现记录
            bindToRecord(){
                if(!this.form.yxUserCount) return;
                 this.$router.push({name:'spokesRecord'})
            }
        }
    }
</script>
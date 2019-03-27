<template>
    <div class="ebay_auth_container banner">
        <div> <span class="el-icon-loading cares-color"></span> 授权中，请稍后...</div>
    </div>
</template>

<script>
    import domain from '../../../js/domain.js'
    import {
        getEbayToken
    } from '../../../js/api.js'
    // ebay授权的回调页面
    export default {
        created(){

            //?result=0 ebay认证的结果，成功还是失败了
            let QUERY = this.$route.query;
            if(QUERY.result==0){
                dueR({isSuccess:0});
            }else{
                // 失败
                dueR({isSuccess:1});
            }

            //请求后台获取;1. 客户编号  2. 页面跳转(1.注册添加店铺；2.后台添加店铺)  3. 后台token认证结果;
            let _this = this;
            function dueR(params){

                getEbayToken(params).then(res=>{
                    // console.log(res);
                    getEbayToken(params).then(res=>{
                    // console.log(res);
                        if(res.code==0){
                            //1. 判断授权成功还是失败
                            //成功
                            location.href = `${domain.carespay}/#/addshop?platformCode=EBAY&result=1`
                        }else{
                            // location.href = `${domain.carespay}/#/addshop?platformCode=EBAY&result=${res.static}`;
                            _this.$Message.error(res.msg);
                            location.href = `${domain.carespay}/#/addshop?platformCode=EBAY&result=0`
                        }
                    
                    });
                
                });
                
                
             }
        }
    }
</script>

<style lang="scss" scoped>
    .ebay_auth_container{
        text-align: center;
        padding: 20px;
        margin-top: 20px;
        margin-bottom: 20px;
        background-color: #fff;
        >div{
            height: 30px;
            width: 400px;
            margin: 0 auto;
            font-size: 14px;
            background-color: #f1f1f1;
            line-height: 30px;
            span{
                font-size: 20px;
            }
        }
    }
</style>


<template>
    <div>
         <header class="cares-login-header">
            <div class="banner">
                <a class="cares-logo" href="javascript:;"></a>
                 <router-link id="toBackLogin" class="toBackLogin fr" to="/login">返回首页</router-link>
                 <a class="toBackLogin help fr" target="_blank" href="http://www.carespay.com/help_center.html">帮助中心</a>
            </div>
        </header>

        <router-view class="login-main-content"></router-view>

         <div class="fixInTheRight">
            <span class="phone-icon"></span>
            <div class="code-container">
                <p>客户服务</p>
                <p class="cares-color">400-887-0201</p>
                <span class="cares-wechatCode"></span>             
            </div>
        </div>

        <footer class="cares-login-footer">
            <ul class="clearfix about">
                <li><a target="_blank" href="https://www.carespay.com/about_us.html">关于</a></li>
                <li><a target="_blank" href="https://www.carespay.com/help_center.html">帮助</a></li>
                <li><a target="_blank" :href="`${DOMIAN.login}/#/serviceAgreement`">服务协议</a></li>
                <li><a target="_blank" :href="`${DOMIAN.login}/#/privacyAgreement`">隐私政策</a></li>
                
                <li>
                    <el-tooltip class="item" effect="dark" content="在线时间：周一至周五09:30~18:30" placement="right">
                        <a target="_blank" href="http://wpa.qq.com/msgrd?v=3&uin=1361257395&site=qq&menu=yes">联系</a>
                    </el-tooltip>
                </li>
            </ul>
            <!-- <p class="copyright">Copyright © 2048 CaresPAY | Design: <a target="_blank" href="https://www.carespay.com/">carespay.com</a> </p> -->
            <p class="copyright">Copyright © 2018-2019 <a target="_blank" href="https://www.carespay.com/">www.carespay.com</a>. All Rights Reserved. 粤ICP备17132886号-2. 粤公网安备44030502002447号</p>
        </footer>

    </div>
</template>

<script>
import DOMIAN from '../../js/domain.js';

import { getUrlQueryParams } from './../../js/common.js';

export default {
    data(){
        return{
            DOMIAN:DOMIAN
        }
    },
    created(){
        //2019-1-31 雨果网跳转链接不成功做特殊处理
       if(getUrlQueryParams("target").trim().toUpperCase()=='REGIST'){
           this.$router.push({ name:'Regist',
           query:{
               source:parseInt(getUrlQueryParams("source"))
           } })
       }
    },
    mounted(){
        let IsIE = '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style;
        if (IsIE) {
           window.addEventListener('hashchange', () => {
               let currentPath = window.location.hash.slice(1)
               if (this.$route.path !== currentPath) {
                   this.$router.push(currentPath)
               }
           }, false)
        }
    }
}
</script>


<style lang="scss" scoped>

    .cares-login-header{
        border-bottom: 1px solid #f5f5f5;
    }
      @media screen and (max-width:370px) {
          .toBackLogin.help{
              height: 30px;
              line-height: 30px;
              vertical-align: top;
              margin-top: -30px;
          }
    }
</style>



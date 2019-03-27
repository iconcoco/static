<template>
    <div class="real-name-container fadeIn">
        <h2 class="banner-module-title">
            实名认证
            <span v-if="personInfo && personInfo.status==1" class="ING"><i class="el-icon-time"></i>  待审核</span>
            <span v-if="personInfo && personInfo.status==2" class="yes"><i class="el-icon-circle-check-outline"></i>  已认证</span>
            <span v-if="personInfo && personInfo.status==3" class="no"><i class="el-icon-circle-close-outline"></i>  认证失败</span>
        </h2>

        <component 
        v-if="ING"
        :is="which_component"
        INCOM="R_NAME"
        :data="personInfo"
        ></component>
    </div>
</template>

<script>
import { 
        queryProvinceList,              //省份
        queryCityData ,                 //城市
        queryPersonInfo ,               //实名认证信息
} from '../../utils/localbase.js';

//2018-11-28  实名认证的组件

import AuthenticationPersonal from '../StoreManage/AuthenticationPersonal.vue';         //大陆个人
import AuthenticationCompany from '../StoreManage/AuthenticationCompany.vue';         //大陆个人

export default {
    data(){
        return{
            which_component:'',
            personInfo:null,


            ING:false
        }
    },
    created(){
        queryPersonInfo().then(res=>{

            this.which_component= res.type==1 ? 'AuthenticationPersonal':'AuthenticationCompany';
            this.personInfo = res;

            this.ING = true;
            // res.status == 1 && 
        });
    },
    components:{
        AuthenticationPersonal,
        AuthenticationCompany,
    }
}
</script>

<style lang="scss" scoped>
    .real-name-container{
        padding: 0 20px;
    }

    .banner-module-title{
        span{
            margin-left: 20px;
            font-size: 12px;
            vertical-align: middle;
            i{
                font-size: 16px;
                vertical-align: middle;
            }
        }
    }

</style>

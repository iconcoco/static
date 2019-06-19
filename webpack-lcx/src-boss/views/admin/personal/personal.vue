<template>
    <div class="fadeIn">
        <Block title="个人中心" v-if="!Edit" class="fadeIn">
            <!--  -->
            <ul>
                <li> <span>角色：</span> {{INFO.roleName}}</li>
                <li v-if="INFO.roleCode=='sales'"> <span>销售识别码：</span> {{INFO.source}}</li>
                <li v-if="INFO.roleCode=='sales'"> <span>专属注册链接：</span> {{INFO.saleRegisterUrl}}</li>
                <li v-if="INFO.roleCode=='sales'"> 
                    <span>注册二维码：</span> 
                    <a class="primary" target="_blank" :href="`${download}?fileId=${INFO.saleQrcode}`"><i class="fa fa-cloud-download"></i> 下载二维码</a>
                </li>
                <li> <span>真实姓名：</span> {{INFO.userName}}</li>
                <li> <span>用户名：</span> {{INFO.userCode}}</li>
                <li> <span>手机号：</span> {{INFO.phone}}</li>
                <li> <span>邮箱：</span> {{INFO.email}}</li>
            </ul>
            <p>
                <el-button type="primary" @click="bindModify({status:true},'info')">修改资料</el-button>
                <el-button type="primary" plain @click="bindModify({status:true},'phone')">修改密码</el-button>
            </p>
        </Block>

        <div v-else>
            <component
                :is='componentId'
                @changeStatus="bindModify"
                :modifyType='modifyType'
                :data="INFO"
            ></component>
        </div>

    </div>
</template>

<script>
import Modify from './modify.vue';
import { queryUserDetail,download} from '../../../utils/axios/api.js';

import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            Edit:false,
            componentId:'modify',
            modifyType:'',
            download:download,

            INFO:{
                roleName:'',
                source:'',
                saleRegisterUrl:'',
                saleQrcode:'',
                userName:'',
                userCode:'',
                phone:'',
                email:'',
            },
        }
    },
    components:{
        Modify
    },
    methods:{
        __LOADING(){
           this.loadingQuery();
        },
        loadingQuery(){
            queryUserDetail().then(res=>{
                if(res.code==0){
                    this.INFO = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        bindModify(params,type){
            this.Edit = params.status;
            type && (this.modifyType = type);
            params.reflesh && this.loadingQuery();
        },
        
    }
}
</script>


<style lang="scss" scoped>
    ul{
        li{
            height: 40px;
            line-height: 40px;
            span{
                display: inline-block;
                font-size: 12px;
                min-width: 100px;
            }
        }
        padding-bottom: 20px;
    }
</style>

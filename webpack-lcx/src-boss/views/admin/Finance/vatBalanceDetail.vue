<template>
    <div class="fadeIn">
        <div class="table-container">
            <h5>状态：<span class="primary">{{fineValName(PAGEDATA.status,STATUS,'status','code')}}</span> </h5>
            <div class="block">
                <h5>入账信息</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{PAGEDATA.customerNo}}</li>
                    <li><span>客户名称：</span>{{PAGEDATA.customerName}}</li>
                    <li><span>入账类型：</span>VAT服务费</li>
                    <li><span>入账时间：</span>{{PAGEDATA.completeTime}}</li>
                    <li><span>打款银行账号：</span>{{PAGEDATA.bankAccount}}</li>
                    <li><span>打款银行户名：</span>{{PAGEDATA.bankHolder}}</li>
                    <li><span>付款凭证：</span>
                        <a class="primary" v-if="PAGEDATA.payReceipt" target="_blank" :href="`${download}?fileId=${PAGEDATA.payReceipt}`"><i class="fa fa-cloud-download"></i> 下载付款凭证</a>
                    </li>
                </ul>
            </div>

            <div class="block" v-if="[3].includes(PAGEDATA.status)">
                <h5>{{fineValName(PAGEDATA.status,STATUS,'status','code')}}原因</h5>
                <ul class="failReason">
                    <li> <i class="point no"></i> {{PAGEDATA.remark}}</li>
                </ul>
            </div>

            <div class="block"  style="padding-bottom:10px;" v-if="PAGEDATA.status==1">
                <h5 >操作 
                    <el-upload
                        :show-file-list='false'
                        name='upFile'   
                        :action="actionsUpload"
                        :on-success="bindUploadSuccess"
                        :on-error="bindUploadError"
                        style="display:inline-block;"
                        >
                        <ElTooltip content="审核通过，上传付款凭证" placement="top-end">
                            <el-button type="primary">入账审核通过</el-button>
                        </ElTooltip>
                    </el-upload>
                    <el-button type="primary" @click="changeModel(true,'unNormalModel')" plain>入账审核异常</el-button> 
                </h5>
            </div>

            <div class="block">
                <h5>备注</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary" @click="changeModel(true,'RemarkModel')">新增备注</el-button></p>
                <ul class="remark">
                     <li v-for="(item,index) in remarkList" :key="index">
                        <p>#{{index+1}} <i>{{item.operatorName}}</i> 于 {{formatTimer(item.createdTime)}}</p>
                        <p class="content">{{item.remark}}</p>
                    </li>
                </ul>
            </div>

        </div>

        <AdminModel title="备注" 
            v-model="RemarkModel.flag"
            :confirm="RemarkModelConfirm"
        >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="RemarkModel.value">
            </el-input>
        </AdminModel>

        <AdminModel title="异常原因" 
            v-model="unNormalModel.flag"
            :confirm="unNormalModelConfirm"
        >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="unNormalModel.value">
            </el-input>
        </AdminModel>
    </div>
</template>

<script>
import {
    vatrecordGetOrderById,
    vatrecordSaveRemark,
    vatrecordGetRemark,
    upload,
    download,
    vatrecordUpdateOrderStatus
} from './../../../utils/axios/api.js';

import AdminModel from './../../../components/adminModal.vue';
import { formatTimer } from '../../../utils/common.js';
export default {
    data(){
        return{
             actionsUpload:upload,
            download:download,
            PAGEDATA:{},

            remarkList:[],

            RemarkModel:{
                flag:false,
                value:'',
            },
            unNormalModel:{
                flag:false,
                value:'',
            },

            STATUS:[
                {code:1,status:'待审核'},
                {code:2,status:'审核成功'},
                {code:3,status:'审核失败'},
            ]
        }
    },
    created(){
       
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.vatBalanceDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"vatBalance"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
             let ID = OBJ.id;
            this.queryPageData(ID);
        };
    },
    methods:{
        updataStatus(params,fn){
            vatrecordUpdateOrderStatus(params).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.queryPageData(this.PAGEDATA.id);
                    fn && typeof fn == 'function' && fn();
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryPageData(id){
            vatrecordGetOrderById({id}).then(res=>{
                if(res.code==0){
                    this.PAGEDATA = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
            //查询备注列表
            this.queryRemarkList(id);
        },
        changeModel(bol,target){
            this[target].flag = bol
        },
        queryRemarkList(id){
            vatrecordGetRemark({
                type:'5',
                id
            }).then(res=>{
                if(res.code==0){
                    this.remarkList = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        RemarkModelConfirm(){
            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注内容！`);
            
            vatrecordSaveRemark({
                type:'5',
                id:this.PAGEDATA.id,
                remark:this.RemarkModel.value
            }).then(res=>{
                if(res.code==0){
                    this.changeModel(false,'RemarkModel');
                    this.queryRemarkList(this.PAGEDATA.id);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        unNormalModelConfirm(){
            if(!this.unNormalModel.value) return this.$message.warning(`请输入异常原因！`);
            let _this = this;
            this.updataStatus({
                id:this.PAGEDATA.id,
                status:3,
                remark:this.unNormalModel.value
            },function(){
                _this.changeModel(false,'unNormalModel');
            });
        },
        bindUploadSuccess(res){
            if(res.code==0){
                //入账审核通过
                this.updataStatus({
                    id:this.PAGEDATA.id,
                    status:2,
                    payReceipt:res.data.uuid,
                });
            }else{
                this.$message.error(res.msg);
            }
        },
        bindUploadError(){},
        formatTimer(code){
            return formatTimer(code);
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },
    },
    components:{
        AdminModel
    },
    destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='vatBalanceDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'vatBalanceDetail',
                     data:this._data
                 });
            }
        });
    }
    
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.block{
    padding-top: 10px;
    border-bottom: 1px solid #e5e5e5;
}

.textarea{
    margin: 20px 0;
}

h5{
      font-size: 14px;
      color: #333;
  }

  
.remark{
        padding: 15px 0;
        li{
            font-size: 14px;   
            p{
                color: #666;
                padding: 5px 0;
            }
            .content{
                color: #333;
            }
            i{
                color: $--color-primary;
            }
        }
}

.item-container{
    padding: 20px 0;
    li{
        display: inline-block;
        margin-right: 40px;
        color: #666;
        min-width: 20%;
        // max-width: 20%;
        line-height: 30px;
        span{
            color: #333;
        }
    }  
}

.failReason{
    background-color: #f1f1f1;
    margin: 10px 0;
    li{
        padding: 5px 0;
        color: $--color-danger;
    }
}
</style>

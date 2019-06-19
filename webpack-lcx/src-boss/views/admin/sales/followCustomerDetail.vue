<template>
    <div class="fadeIn follow-detail-container">
        <div class="block-left">
            <Block title="客户跟进记录" >
                <el-button type="primary" @click="bindToChangeStatus('addRecordModal')" class="handle-button">添加跟进记录</el-button>
                <ul class="customer-follow-record step-process">
                    <li v-for="(item,index) in recordList" :key="index">
                        <p>{{formatTimer(item.createdTime,true)}}</p>
                        <div>
                            <span></span>
                            <p>{{item.content}}</p>
                        </div>
                    </li>
                </ul>
            </Block>
        </div>
       <div class="block-right">
            <Block title="客户信息">
                <el-button type="warning" class="handle-button" @click="switchEdit">编辑修改</el-button>
                <el-form :model="form" class="admin-form-inline" :inline="true">
                    <div class="block">
                        <h4 class="primary">基本信息</h4>
                        <el-form-item label="姓名：">
                            <el-input v-if="isEdit" v-model="form.name" placeholder="请输入客户姓名"></el-input>
                            <span v-else>{{Status.name}}</span>
                        </el-form-item>

                        <el-form-item label="手机：">
                            <el-input  v-if="isEdit" v-model="form.phone" placeholder="请输入客户手机"></el-input>
                            <span v-else>{{Status.phone}}</span>
                        </el-form-item>

                        <el-form-item label="微信号：">
                            <el-input  v-if="isEdit"  v-model="form.wechatNo" placeholder="请输入客户微信号"></el-input>
                            <span v-else>{{Status.wechatNo}}</span>
                        </el-form-item>

                        <el-form-item label="职位：">
                            <el-input v-if="isEdit"  v-model="form.place" placeholder="请输入客户职位"></el-input>
                            <span v-else>{{Status.place}}</span>
                        </el-form-item>
                    </div>

                    <div class="block">
                        <h4 class="primary">公司信息</h4>
                        <el-form-item label="公司名称：">
                            <el-input v-if="isEdit"  v-model="form.company" placeholder="请输入公司名称"></el-input>
                            <span v-else>{{Status.company}}</span>
                        </el-form-item>

                        <el-form-item label="经营范围：">
                            <el-input v-if="isEdit" v-model="form.businessScope" placeholder="请输入经营范围"></el-input>
                            <span v-else>{{Status.businessScope}}</span>
                        </el-form-item>

                        <el-form-item label="月交易额度：">
                            <el-select v-if="isEdit" v-model="form.amountScope" placeholder="请选择月交易额">
                                <el-option v-for="(item,index) in salesVolume" :key="index"
                                    :label="item.saleName"
                                    :value="item.saleCode"
                                ></el-option>
                            </el-select>
                             <span v-else>{{amountScopeName(Status.amountScope)}}</span>
                        </el-form-item>
                         <br/>
                        <el-form-item label="经营渠道：" class="widthAuto">
                           <el-checkbox-group v-if="isEdit" v-model="form.businessChannel">
                                <el-checkbox v-for="(item,index) in channelData" :key="index" 
                                :label="`${item.key}`">{{item.value}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else>{{Status.businessChannelDesc}}</span>
                        </el-form-item>
                         <br/>
                        <el-form-item label="现有收款方式：" class="widthAuto">
                             <el-checkbox-group v-if="isEdit" v-model="form.payType">
                                <el-checkbox v-for="(item,index) in payTypelData" :key="index" 
                                :label="`${item.key}`">{{item.value}}</el-checkbox>
                            </el-checkbox-group>
                            <span v-else>{{Status.payTypeDesc}}</span>
                        </el-form-item>
                    </div>

                    <div class="block">
                        <h4 class="primary">跟进信息</h4>
                        <el-form-item label="客户状态：">
                            <el-select v-if="isEdit" v-model="form.status" placeholder="请选择客户状态">
                                <el-option v-for="(item,index) in customerStatusData"
                                    :key="index"
                                    :value="`${item.key}`"
                                    :label="item.value"
                                ></el-option>
                            </el-select>
                            <span v-else>{{customerStatusName(Status.status)}}</span>
                        </el-form-item>

                        <el-form-item label="录入时间：">
                            <span>{{formatTimer(Status.createdTime,true)}}</span>
                        </el-form-item>

                        <el-form-item label="最后跟进时间：">
                            <span>{{formatTimer(Status.lastFollowTime,true)}}</span>
                        </el-form-item>

                        <br/>
                        <el-form-item label="备注：" class="widthAuto remark">
                            <el-input
                                v-if="isEdit"
                                type="textarea"
                                :autosize="{ minRows: 4, maxRows: 8}"
                                placeholder="请输入内容"
                                v-model="form.remark">
                            </el-input>
                             <span v-else>{{Status.remark}}</span>
                        </el-form-item>
                    </div>

                    <div class="block" v-if="!isEdit && logList.length">
                        <h4 class="primary">操作日志 
                            <i 
                            class="arrow-point"
                            :class="logListActive ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"
                            @click="()=>{ this.logListActive = !this.logListActive }"></i>
                        </h4>
                        <ul class="step-process log-list-ul" :class="{active:logListActive}">
                            <li v-for="(item,index) in logList" :key="index">
                                <p>{{formatTimer(item.createdTime,true)}}</p>
                                <div>
                                    <span></span>
                                    <p>
                                        {{item.operatorName}}将{{item.preContent}}修改为{{item.content}}
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>
                
                    <div class="btn" v-if="isEdit">
                        <el-button type="danger" @click="switchEdit" plain>取消</el-button>
                        <el-button type="primary" @click="bindToSave">保存</el-button>
                    </div>
                </el-form>
            </Block>
       </div>

       <!-- 添加跟进记录的弹窗 -->
        <AdminModal
            v-model="addRecordModal"
            :confirm="()=>{ return this.bindConfirmAddRecord(0) }"
            title="新增跟进记录"
        >
            <div class="addRecord-txt">
                <el-input
                    type="textarea"
                    :autosize="{ minRows: 4, maxRows: 8}"
                    placeholder="请输入内容"
                    v-model="addRecordForm">
                </el-input>
            </div>
        </AdminModal>

        <!-- 客户状态修改为“已注册”时的验证弹窗 -->
        <AdminModal
            v-model="registPhoneModal"
            :confirm="()=>{ return this.bindConfirmAddRecord(1) }"
            :cancel="bindcancelAddRecord"
            title="已注册验证"
        >
            <div class="addRecord-txt regist-phone">
                <span>注册手机号：</span>
                <el-input v-model="RegistPhone" placeholder="请输入客户注册手机号"></el-input>
            </div>
        </AdminModal>
    </div>
</template>

<script>


import { 
    AddsaleRecord,
    saleLogList,
    saleRecordList,
    checkRegistered,
    updateCustomer,
    getDictionary
} from './../../../utils/axios/api.js';

import { 
    salesVolume,
    queryCustomerStatus
} from './../../../ext/localBase.js';

import { formatTimer } from '../../../utils/common.js';

import AdminModal from './../../../components/adminModal.vue';
export default {
    data(){
        return{
            form:{
                id:'',
                name:'',
                company:'',
                businessScope:'',
                amountScope:'',
                businessChannel:[],
                payType:[],
                phone:'',
                preDistrUser:'',
                distrUser:'',
                place:'',
                wechatNo:'',
                remark:'',
                status:'',
                createdTime:'',
                lastDistrTime:'',
            },
            Status:{
                status:'',
            },
            ING:false,

            AddrecordForm:{
                customerId:"",
                page:1,
                size:30
            },
            addRecordForm:"",
            RegistPhone:"",
            addRecordModal:false,
            registPhoneModal:false,
            isEdit:false,
            

            channelData:[],
            payTypelData:[],
            customerStatusData:[],
            salesVolume:salesVolume,
            logList:[],
            recordList:[],

            logListActive:true,
        }
    },
    created(){
         //请求当前外键的审核字段和结果
        let OBJ = this.$route.params;
        let m = this.$store.state.Memory.followCustomerDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"followUpCustomer"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            //销售负责人
            let params = OBJ.data;
            let not = ['businessChannel','payType'];
            for (const key in this.form) {
                if(not.indexOf(key)<0){
                    this.form[key] = params[key] ? String(params[key]) : '';
                }else{
                    this.form[key] = params[key] ?
                    params[key].split(",") : [];
                }
            };
            this.Status = params;

            Promise.all([
                getDictionary({type:3}),
                getDictionary({type:4}),
                queryCustomerStatus(),
                saleLogList({
                    customerId:params.id,
                    page:1,
                    size:10
                }),
            ]).then(([a,b,c,d])=>{
                a.code==0 &&( this.channelData=a.data );
                b.code==0 &&( this.payTypelData=b.data );
                this.customerStatusData = c ;
                d.code==0 && (this.logList = d.data );
            });

            this.queryRecordList(this.AddrecordForm);

        };

    },
    watch:{
        "form.status"(n){
            if(this.Status.status==1) return;
            this.registPhoneModal = n==1;
        }
    },
    methods:{
        queryRecordList(params){
            params.customerId = this.Status.id;
            saleRecordList(params).then(res=>{
                if(res.code==0){ this.recordList = res.data }
            })
        },
        bindConfirmAddRecord(index){

            //验证手机号码是否已经注册
            if(index == 1){
                if(this.ING) return;
                this.ING = true;

                checkRegistered({
                    id:this.form.id,
                    phone:this.RegistPhone
                }).then(res=>{
                    this.ING = false;
                    if(res.code == 0){
                        this.$message.success('修改成功!');
                        this.registPhoneModal = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }

            //添加跟进记录
            if(index == 0){
                if(!this.addRecordForm) return this.$message.warning('请输入内容');

                if(this.ING) return;
                this.ING = true;

                AddsaleRecord({
                    customerId:this.form.id,
                    content:this.addRecordForm
                }).then(res=>{
                    this.ING = false;
                    if(res.code == 0){
                        this.$message.success('添加成功!');
                        this.addRecordModal = false;
                        this.queryRecordList(this.AddrecordForm);
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            } 
        },
        bindcancelAddRecord(){
            this.form.status = String(this.Status.status);
        },
        bindToChangeStatus(key){
            this[key] = true;
        },
        switchEdit(){
            this.isEdit = !this.isEdit;
        },
        bindToSave(){
            let must = ["name","company","place","phone","wechatNo"];

            for (let index = 0; index < must.length; index++) {
                const name = must[index];
                if(!this.form[name]){
                    let msg = null;
                    switch(name){
                        case 'name':{ msg='请输入客户姓名' }break;
                        case 'company':{ msg='请输入公司名称' }break;
                        case 'place':{ msg='请输入客户职位' }break;
                        case 'phone':{ msg='请输入客户手机号码' }break;
                        case 'wechatNo':{ msg='请输入客户微信号' }break;
                    }
                    return this.$message.warning(msg);
                }
            };

            let data = Object.assign({},this.form);
            data.businessChannel = data.businessChannel.join(",");
            data.payType = data.payType.join(",");
            
            delete data.createdTime ;
            delete data.lastDistrTime;

            if(this.ING) return;
            this.ING = true;

            updateCustomer(data).then(res=>{
                this.ING = false;

                if(res.code==0){
                    this.$message.success(`修改成功!`);
                    this.$router.push({
                        name:"Reflesh",
                        params:{ name:'followUpCustomer' }
                    });

                    let tabArr = this.$store.state.TabList;
                    tabArr.forEach((item,index)=>{
                        if(item.name==`followCustomerDetail`){
                           tabArr.splice(index,1);
                        }
                    });
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        formatTimer(code,bol){
            return formatTimer(Number(code),bol);
        },
        amountScopeName(code){
            let str = null
            this.salesVolume.forEach(item=>{
                item.saleCode == code && (str = item.saleName)
            });
            return str;
        },
        customerStatusName(code){
            let str = null;
            this.customerStatusData.forEach(item=>{
                item.key == code && (str = item.value)
            });
            return str;
        },
    },
    components:{
        AdminModal
    },
     destroyed() {
        let tabArr = this.$store.state.TabList;

        tabArr.forEach(item=>{
              if(item.name==`followCustomerDetail`){
                  return this.$store.commit('setModelRecordData',{
                        key:'followCustomerDetail',
                        data:{
                            form:this.form,
                            Status:this.Status,
                            ING:this.ING,
                            AddrecordForm:this.AddrecordForm,
                            addRecordForm:this.addRecordForm,
                            RegistPhone:this.RegistPhone,
                            addRecordModal:this.addRecordModal,
                            registPhoneModal:this.registPhoneModal,
                            isEdit:this.isEdit,
                            channelData:this.channelData,
                            payTypelData:this.payTypelData,
                            customerStatusData:this.customerStatusData,
                            salesVolume:this.salesVolume,
                            logList:this.logList,
                            recordList:this.recordList,
                            logListActive:this.logListActive,
                        }
                    });
              };
        });

    },
}
</script>


<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.customer-follow-record{
    width: 350px;
    padding-top: 20px;
}

.step-process{
 li{
        position: relative;
        >p{
            position: absolute;
            width: 100px;
            height: 100%;
            top: 0;
            border-right: 1px solid #e5e5e5;
            padding-bottom: 20px;
            vertical-align: top;
        }
        div{
            position: relative;
            padding-left: 120px;
            padding-bottom: 20px;
            span{
                position: absolute;
                width: 8px;
                height: 8px;
                background-color: $--color-primary;
                border-radius: 50%;
                left: 95px;
                margin-top: 5px;
            }
            p{
                background-color: #f1f1f1;
            }
        }
    }
}

.handle-button{
    position: relative;
    z-index: 2;
    float: right;
    margin-top: -35px;
}

.follow-detail-container{
    position: relative;
    .block-left{
        position: absolute;
        height: 100%;
        overflow-y: auto;
        padding-bottom: 20px;
        >div{
            height: 100%;
        }
    }
    .block-right{
        padding-left: 400px;
    }
}

.block{
    border-bottom: 1px solid #e5e5e5;
    h4{
        font-size: 14px;
        color: #333;
        padding: 15px 0;
    }
    .el-checkbox{
        margin-left: 0px;
        margin-right: 10px;
    }
    .el-textarea{
        width: 600px;
    }
    span{
        vertical-align: middle;
        color: #333;
    }
}

.btn{
    text-align: center;
    margin-top: 20px;
    padding-bottom: 20px;
    .el-button{
        width: 80px;
    }
}

.addRecord-txt{
    padding: 20px 0px;
  
}
.regist-phone{
    text-align: center;
    .el-input{
        display: inline-block;
        width: 50%;
    }
}

.arrow-point{
    margin-left: 20px;
    cursor: pointer;
    font-size: 16px;
}

.log-list-ul{
    // height: 0px;
    overflow: hidden;
    transition: all .5s;
    &.active{
        height: 0px;
    }
}
</style>

<style lang="scss">
.follow-detail-container{
    .admin-form-inline{
         .widthAuto{
            .el-form-item__content{
                max-width: 600px;
            }
        }
    }
}
</style>


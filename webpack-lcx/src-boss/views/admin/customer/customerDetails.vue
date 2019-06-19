<template>
    <div class="fadeIn">
        <div class="table-container">
             <div class="admin-tab-title">客户信息</div>
            <ul class="cus_info">
                <li><span>客户名称：</span>{{customerInfo.name}}</li>
                <li><span>客户类型：</span>
                    <i v-if="customerInfo.type==1">个人客户</i>
                    <i v-if="customerInfo.type==2">企业客户</i>
                </li>
                <li><span>客户状态：</span>{{fineValName(customerInfo.status,custemerStatus,'name','status')}}</li>
                <li><span>客户ID：</span>{{customerInfo.customerNo}}</li>
                <li><span>注册手机：</span>{{customerInfo.phoneNo}}</li>
                <li><span>绑定邮箱：</span>{{customerInfo.email}}</li>
                <!-- <li><span>KYC资料：</span>xxxx</li> -->
                <li><span>注册时间：</span>{{customerInfo.createdTime}}</li>
                <li><span>流失时间：</span>{{customerInfo.loseTime}}</li>
                <li><span>客户来源：</span>{{source(customerInfo.source)}}
                <li><span>客户等级：</span>{{fineValName(customerInfo.vipStatus,custemerVIP,'name','status')}}
                    <a @click="bindShowCumType('VIP')" href="javascript:;" class="primary">点击修改客户类型</a>
                </li>
                <li><span>费率：</span>{{customerInfo.rate}}</li>
                <li><span>销售负责人：</span>{{fineValName(customerInfo.salers,sales,'userName','source')}}
                    <a @click="bindShowCumType('sales')" href="javascript:;" class="primary">点击修改销售负责人</a>
                </li>
            </ul>
        </div>

        <div class="table-container">
             <div class="admin-tab-title">绑定店铺信息</div>
            <el-table :data="table" border >
                <el-table-column label="序号">
                    <template slot-scope="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="name" label="店铺名称"></el-table-column>
                <el-table-column prop="platformName" label="店铺所属平台"></el-table-column>
                <el-table-column prop="nationalCode" label="店铺所属国家">
                     <template slot-scope="scope">
                        {{fineValName(scope.row.nationalCode,NationCode,'nation','code')}}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="productCategories" label="经营类目"></el-table-column> -->
                <el-table-column label="店铺状态">
                    <template slot-scope="scope">
                        {{fineValName(scope.row.status,storeStatus,'status','code')}}
                    </template>
                </el-table-column>
                <el-table-column prop="currency" label="入账币种"></el-table-column>
                <el-table-column prop="sumAccount" label="累计入账"></el-table-column>
                <el-table-column width="154" prop="createTime" label="绑定店铺时间"></el-table-column>
                <el-table-column width="154" label="店铺流失时间">
                     <template slot-scope="scope">
                        <span v-if="scope.row.wastageTime">{{scope.row.wastageTime}}</span>
                        <span v-else>--</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a class="primary" @click="bindToStoreDe(scope.row.storeId,scope.row.nationalCode)" href="javascript:;">查看详情</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <AdminModel
            title="修改客户类型"
            confirmTxt="确认"
            v-model="model.VIP" 
            :confirm="vipModalConfirm"
            class="customer-details-adminModal"
        >
             <el-form :inline="true" :model="tableForm">
                <el-form-item label="客户等级：">
                    <el-select v-model="tableForm.status" placeholder="请选择客户等级">
                         <el-option
                             v-for="(item,index) in custemerVIP"
                             :key="index"
                             :label="item.name"
                             :value="item.status">
                         </el-option>
                     </el-select>
                </el-form-item>
            </el-form>
        
        </AdminModel>

        <AdminModel
            title="修改销售负责人"
            confirmTxt="确认"
            v-model="model.sales" 
            :confirm="saleModalConfirm"
            class="customer-details-adminModal"
        >
             <el-form :inline="true" :model="tableForm">
                <el-form-item label="销售负责人：">
                    <el-select v-model="tableForm.source" placeholder="请选择销售负责人">
                         <el-option
                             v-for="(item,index) in sales"
                             :key="index"
                             :label="item.userName"
                            :value="item.source"
                             >
                         </el-option>
                     </el-select>
                </el-form-item>
            </el-form>
        
        </AdminModel>
    </div>
</template>

<script>
    import {
        custemerSource,
        custemerVIP,
        custemerStatus,
        NationCode,
        queryAllSalesData,
        storeStatus
        } from '../../../ext/localBase.js';
    import {
        customerInfo,
        storeInfo,
        updateCustomerVipStatus,
        updateCustomerSource
    } from '../../../utils/axios/api.js';

    import AdminModel from '../../../components/adminModal.vue';

    export default {
        data(){
            return {
                customerInfo:{
                    applicationId:"",
                    cashAmount:"",
                    createdTime:"",
                    customerNo:"",
                    email:"",
                    enId:"",
                    id:"",
                    loseTime:"",
                    name:"",
                    phoneNo:"",
                    rate:"",
                    salers:"",
                    source:"",
                    status:"",
                    stores:"",
                    type:"",
                    vipStatus:"",
                },
                table:[],
                sales:[],
                custemerVIP:custemerVIP,
                custemerStatus:custemerStatus,
                NationCode:NationCode,
                model:{
                    sales:false,
                    VIP:false
                },
                tableForm:{
                    status:"",
                    source:""
                },
                custemerSource:{},
                storeStatus:storeStatus,
            }
        },
        created(){
            let customerNo = this.$route.params.customerNo;
            let level = this.$route.params.level;
            let m = this.$store.state.Memory.customerDetails;

            if(!customerNo && !m) return this.$router.push({name:"customerInfo"});
            
            if(!customerNo){
                Object.assign(this,m);
            }else{
                //销售负责人
                custemerSource().then(res=>{ this.custemerSource = res });
                queryAllSalesData().then(res=>{ this.sales = res; });
                this.loadingQuery(customerNo,level);
            };

            
        },
        methods:{
            loadingQuery(customerNo,level){
                Promise.all([
                    customerInfo({
                        pageNum:'1',
                        pageSize:'10',
                        customerNo
                    }),
                    storeInfo({
                        pageNum:'1',
                        pageSize:'10',
                        customerNo,
                        level
                    })
                ]).then(resp=>{
                    resp.map((res,index)=>{
                        if(res.code==0){
                           switch(index){
                               case 0:
                               {
                                    this.customerInfo = res.data[0]
                               }
                               break;
                               case 1:
                               {
                                   this.table = res.data;
                               }
                               break;
                           }
                        }else{
                            this.$message.error(res.msg);
                        }
                    });
                })
            },
            bindToStoreDe(storeId,nationalCode){
                 this.$router.push({
                    name:"storeDetails",
                    params:{
                        storeId,
                        storeCountry:nationalCode
                    }
                });
            },
            //修改客户登记确认
            vipModalConfirm(){
                if(!this.tableForm.status) return this.$message.warning('请选择客户等级');
                if(this.tableForm.status == this.customerInfo.vipStatus) return this.$message.warning('等级未作出改变');
                updateCustomerVipStatus({
                    customerNo:this.customerInfo.customerNo,
                    status:this.tableForm.status
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success('修改成功！');
                        this.model.VIP = false;
                        this.customerInfo.vipStatus = this.tableForm.status;
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //修改销售负责人确认
            saleModalConfirm(){
                if(!this.tableForm.source) return this.$message.warning('请选择销售负责人');
                if(this.tableForm.source == this.customerInfo.salers) return this.$message.warning('销售负责人未作出更改');

                updateCustomerSource({
                    customerNo:this.customerInfo.customerNo,
                    source:this.tableForm.source
                }).then(res=>{
                     if(res.code==0){
                        this.$message.success('修改成功！');
                        this.model.sales = false;
                        this.customerInfo.salers = this.tableForm.source;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            bindShowCumType(name){
                this.model[name] = true;
            },



            fineValName(code,LIST,NAME,itemCode){
                let I = LIST.find(item=>{
                    return item[itemCode]==code;
                });
                if(I){
                    return I[NAME];
                }
            },

            // 编码回显
            source(source){
                return this.custemerSource[source]
            },
        },
        components:{
            AdminModel
        },
        destroyed() {
             let tabArr = this.$store.state.TabList;

             tabArr.forEach(item=>{
                  if(item.name==`customerDetails`){
                      return this.$store.commit('setModelRecordData',{
                            key:'customerDetails',
                            data:{
                                customerInfo:this.customerInfo,
                                table:this.table,
                                sales:this.sales,
                                custemerVIP:this.custemerVIP,
                                model:this.model,
                                tableForm:this.tableForm,
                                custemerSource:this.custemerSource,
                            }
                        });
                  };
             });

        },
        
    }
</script>

<style lang="scss" scoped>
    ul.cus_info{
        li{
            height: 50px;
            line-height: 50px;
            padding-left: 100px;
            color: #333;
            >span{
                display: inline-block;
                width: 150px;
                text-align: right;
                margin-right: 10px;
                color: #999;
            }
        }
    }
</style>

<style lang="scss">
.customer-details-adminModal{
    form{
        text-align:center;
        margin-top:22px;
        .el-select,.el-input{
            width:163px;
        }
    }
    .setRate{
        text-align:left;
        margin-top:10px;
        .el-form-item{
            margin-bottom:10px;
        }
        .el-form-item__label{
            width:120px;
        }
        p{
            color: #d1d1d1;
            font-size: 12px;
            margin-top: -13px;
            padding-left: 10px;
        }
    }
}
</style>


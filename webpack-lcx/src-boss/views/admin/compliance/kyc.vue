<template>
 <transition name="fade">
    <div class="kycDetaile">
        <ul class="admin-tab clearfix">
            <!-- 1 -->
            <li :class="{active:activeLi==1}" @click="bindKYCtabChange(1)">申请人信息</li>
            <!-- 2 -->
            <li v-if="KYC_ID.enterpriseId" :class="{active:activeLi==2}" @click="bindKYCtabChange(2)">企业信息</li>
            <!-- 3 -->
            <li v-if="KYC_ID.enterpriseId" :class="{active:activeLi==3}" @click="bindKYCtabChange(3)">受益人信息</li>
            <!-- 4 -->
            <li :class="{active:activeLi==4}" @click="bindKYCtabChange(4)">店铺信息</li>

            <li :class="{active:activeLi==11}" @click="bindKYCtabChange(1,10)">申请人风险</li>

            <li v-if="KYC_ID.enterpriseId" :class="{active:activeLi==22}" @click="bindKYCtabChange(2,10)">企业风险</li>

            <li v-if="KYC_ID.enterpriseId" :class="{active:activeLi==33}" @click="bindKYCtabChange(3,10)">受益人风险</li>

            <li :class="{active:activeLi==44}" @click="bindKYCtabChange(4,10)">店铺风险</li>
        </ul>
        <div class="store-tab" v-if="activeLi==4 && ['EU','YD','AE'].indexOf(KYC_ID.platformCode)>-1">
        <!-- <div class="store-tab" v-if="activeLi==4"> -->
            <a @click="bindStoreInfo(1)" :class="{active:PlamtA=='1'}" href="javascript:;">店铺信息</a>
            <a @click="bindStoreInfo(2)" v-if="KYC_ID.platformAppId" :class="{active:PlamtA=='2'}" href="javascript:;">店铺申请人信息</a>
            <a @click="bindStoreInfo(3)" v-if="KYC_ID.platformEnId" :class="{active:PlamtA=='3'}" href="javascript:;">店铺企业信息</a>
            <a @click="bindStoreInfo(4)" :class="{active:PlamtA=='4'}" href="javascript:;">店铺收益人信息</a>

            <!-- <el-button class="fr" v-if="KYC_ID.nationalCode=='GB'" type="warning">修改店铺KYC状态</el-button> -->
            <div class="fr"  v-if="KYC_ID.nationalCode=='GB'">
                <span style="font-size:18px">店铺审核总状态：</span>
                <span style="font-size:14px;margin-right:10px;" class="waiting" v-if="KYC_ID.otherStatus==0">海外银行待审核</span>
                <span style="font-size:14px;margin-right:10px;" class="ing" v-if="KYC_ID.otherStatus==1">海外银行审核中</span>
                <span style="font-size:14px;margin-right:10px;" class="yes" v-if="KYC_ID.otherStatus==2">海外银行审核通过</span>
                <span style="font-size:14px;margin-right:10px;" class="no" v-if="KYC_ID.otherStatus==3">海外银行审核失败</span>
                <el-button @click='bindToShowModel' type="warning">修改店铺KYC状态</el-button>
            </div>

        </div>
        <!-- 申请人的信息 -->
        <div class="table-container">
            <holderTable v-if="activeLi==3 || activeLi==33 || (activeLi==4&&PlamtA==4)" 
                :id="id" 
                :type="activeLi" 
                :subType='PlamtA'
                :risk="risk" 
                :nation="KYC_ID.nationalCode"
                :URL="activeLi==4 && ['EU','YD','AE'].indexOf(KYC_ID.platformCode)>-1" 
                :params='EU_COMPONENT_PARAMS' 
                @transParams='bindGetParams'
                :data="holderTabelData">
            </holderTable>

            <kycForm v-else 
                :type="activeLi" 
                :subType='PlamtA'
                :URL="activeLi==4 && ['EU','YD','AE'].indexOf(KYC_ID.platformCode)>-1" 
                :params='EU_COMPONENT_PARAMS' 
                :id="id" 
                :nation="KYC_ID.nationalCode"
                @transParams='bindGetParams'
                :data="kycFormData">
            </kycForm>
        </div>

        
            <AdminModel
                title="修改店铺KYC状态"
                confirmTxt="确认"
                v-model="showModel" 
                :confirm="bindRateConfirm"
                class="customer-details-adminModal"
            >
               <el-form :model="modleForm" :inline="true">
                    <el-form-item label="店铺KYC状态">
                        <el-select v-model="modleForm.EU_STORE_STATUS" placeholder="请选择审核状态">
                        <!-- <el-option label="海外银行待审核" value="0"></el-option> -->
                        <el-option label="海外银行审核中" value="1"></el-option>
                        <el-option label="海外银行审核通过" value="2"></el-option>
                        <el-option label="海外银行审核失败" value="3"></el-option>
                        </el-select>
                    </el-form-item>
               </el-form>
            </AdminModel>

    </div>
</transition>
</template>

<script>
    import { 
        saveStoreAllAuditInfo,
        queryKycAuditInfo,
        queryRiskInfo,
        queryShareholderList,
        queryShareholderListByPlatform,
        saveStoreOtherAuditInfo,
        queryKycIndexList
    } from '../../../utils/axios/api.js'

    import kycForm from './components/kycForm.vue';
    import holderTable from './components/holderTable.vue';

    import AdminModel from './../../../components/adminModal.vue';


    export default{
        data(){
            return{
                kycFormData:{
                    auditInfoList:[],
                    totalStatus:1
                },
                holderTabelData:[],
                showModel:false,
                KYC_ID:{
                    userId:'',
                    enterpriseId:'',
                    storeNo:'',

                    platformAppId:'',       //店铺申请人信息
                    platformCode:'',        
                    platformEnId:'',        //店铺企业信息ID
                    customerNo:'',
                    storeId:'',
                    nationalCode:'',
                    otherStatus:'',
                },             ////{userId: 11, enterpriseId: null, storeNo: 1}
                activeLi:1,
                risk:false,
                id:null,
                modleForm:{
                    EU_STORE_STATUS:''
                },

                PlamtA:"1",    //2018-12-3   欧洲站
                EU_COMPONENT_PARAMS:'', // 欧洲站 向组件传递的参数
            }
        },
        created() {
            //请求当前外键的审核字段和结果
            let OBJ = this.$route.params;
            let m = this.$store.state.Memory.KYCdetail;

            if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"kycList"});
            
            if(!Object.keys(OBJ).length){
                Object.assign(this,m);
            }else{
                //销售负责人
                this.KYC_ID = OBJ;
                this.id = OBJ.userId;
                this.EU_COMPONENT_PARAMS = `${OBJ.customerNo},${OBJ.storeId},${OBJ.storeNo},${OBJ.currency || ''}`;
                this.loadingData({bizType:1,id:OBJ.userId});
            };
        },
        methods:{
            loadingData(params,isRisk){

                 if(!params.id) return this.$message.warning(`缺少ID`);

                 params.bizType == 4 && (params.bizType += ",6,8,9");
                 params.bizType == 2 && (params.bizType += ",7");

                if(isRisk){
                    // 风险平级的请求
                    queryRiskInfo({
                        bizType:params.bizType,
                        foreignId:params.id 
                    }).then(res=>{
                        if(res.code==0){

                            let obj = {
                                auditInfoList:[],
                                totalStatus:'',
                            };

                            obj.auditInfoList = res.data.riskInfoList;
                            obj.totalStatus = res.data.totalStatus;

                            this.kycFormData = obj;
                        }else{
                            this.$message.error(res.msg);
                        }
                    })
                }else{
                    //非风险评级的请求
                    queryKycAuditInfo({
                        bizType:params.bizType,
                        foreignId:params.id 
                    }).then(res=>{
                        if(res.code==0){
                            this.kycFormData = res.data;
                        }else{
                            this.$message.error(res.msg);
                        }
                    });  
                }

               
            },
            bindKYCtabChange(bizType,per){

                //清空掉之前的数据
                this.holderTabelData =  [];
                this.kycFormData = {
                    auditInfoList :[],
                    totalStatus:this.kycFormData.totalStatus
                };

                let id = null,
                    foreignId = this.KYC_ID;

                    switch(bizType){
                        case 1:
                        case 3:
                        {  //申请人 || 受益人(股东)
                            id = foreignId.userId
                        }
                        break;
                        case 2:
                        {   //企业
                            id = foreignId.enterpriseId
                        }
                        break;
                        case 4:
                        {   //店铺
                            id = foreignId.storeNo;
                            this.PlamtA = 1;
                        }
                        break;
                    }

                    if(!id) return this.$message.error(`暂无信息`);

                     //切换tab
                    per ? (
                        this.activeLi = bizType*per+bizType,
                        this.risk = true
                    ) : ( 
                        this.activeLi = bizType,
                        this.risk = false
                    );

                 if(bizType==3){
                        //受益人信息
                    queryShareholderList({applicantId:id}).then(res=>{
                        res.code==0 ?
                        (this.holderTabelData = res.data || []):
                        (this.$message.error(res.msg));
                    });
                 }else{
                     per ?( this.loadingData({bizType:bizType,id},per) ):( this.loadingData({bizType:bizType,id}) )

                 }
                
            },
            bindStoreInfo(index){

                //清空掉之前的数据
                this.holderTabelData =  [];
                this.kycFormData = {
                    auditInfoList :[],
                    totalStatus:this.kycFormData.totalStatus
                };
               

                let f = {
                        bizType:this.activeLi,
                        id:''
                    };
                switch(Number(index)){
                    case 1:
                    { 
                        f.id = this.KYC_ID.storeNo;
                    }
                    break;
                    case 2:
                    { //申请人
                        f.id = this.KYC_ID.platformAppId ; 
                        f.bizType = 1; 
                    }break;
                    case 3:
                    { //企业
                        f.id = this.KYC_ID.platformEnId; 
                        f.bizType = 2; 
                    }
                    break;
                    case 4:{    //店铺收益人信息审核 
                        let fd = {
                            customerNo:this.KYC_ID.customerNo,
                            storeId:this.KYC_ID.storeId,
                        };

                        queryShareholderListByPlatform(fd).then(res=>{
                            if(res.code==0){
                                this.holderTabelData = res.data || [];
                            }else{
                                this.$message.error(res.msg);
                            }
                        });
                    }
                    break;
                };

                 this.PlamtA = index;

                index != 4 && this.loadingData(f)
            },
            bindToShowModel(){
                this.showModel = true;
            },
            bindRateConfirm(){
                if(!this.modleForm.EU_STORE_STATUS) return this.$message.warning('请选择修改状态') ;

                saveStoreOtherAuditInfo({
                    id:this.KYC_ID.storeNo,
                    status:this.modleForm.EU_STORE_STATUS
                }).then(res=>{
                    if(res.code==0){
                        this.$message.success('修改成功!');
                        this.KYC_ID.otherStatus = this.modleForm.EU_STORE_STATUS;
                        this.showModel = false;
                    }else{
                        this.$message.error(res.msg);
                    }
                });

            },
            bindGetParams(params){
                //子组件传递过来的参数
                this.KYC_ID.otherStatus = params.ENSTATUS;
            }
        },
        components:{
            kycForm,
            holderTable,
            AdminModel,
        },
        destroyed() {
             let tabArr = this.$store.state.TabList;

             tabArr.forEach(item=>{
                  if(item.name==`KYCdetail`){
                      return this.$store.commit('setModelRecordData',{
                            key:'KYCdetail',
                            data:{
                                kycFormData:this.kycFormData,
                                holderTabelData:this.holderTabelData,
                                KYC_ID:this.KYC_ID,
                                activeLi:this.activeLi,
                                risk:this.risk,
                                id:this.id,
                                PlamtA:this.PlamtA,
                                EU_COMPONENT_PARAMS:this.EU_COMPONENT_PARAMS,
                                showModel:this.showModel,
                                modleForm:this.modleForm,
                            }
                        });
                  };
             });

        },
    }
</script>

<style lang="scss">
    @import '../../../css/element-variables.scss';

    .store-tab{
        height:50px;
        line-height: 60px;
        background-color: #fff;
        padding: 0 20px;
        a{
            display: inline-block;
            padding: 0px 20px;
            margin-right: 5px;
            height: 32px;
            line-height: 32px;
            border-radius: 4px;
            color: $--color-primary;
            &.active{
                background-color: $--color-primary;
                color: #fff;
            }
        }

        .el-button{
            margin-top: 10px;
        }
    }
</style>


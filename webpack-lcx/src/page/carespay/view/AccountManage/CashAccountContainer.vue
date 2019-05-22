<template>
 <transition name="fade">
    <div class="cashAccount-container" v-show="!LOADING">
        <div class=" bankList">
            <h2 class="banner-module-title">我的提现账户</h2>
            <ul>
                <li @click="bindShowChild(-1)" class="add" :class="{active:activeLi==-1}">
                   <i class="el-icon-plus"></i> 
                   <span>添加提现账户</span>
                </li>

                <li v-for="(item,index) in accountList" :key="index" @click="bindShowChild(index,item.status,item.id)" :class="{active:activeLi==item.id}">
                    <div>
                        <span class="bank-logo"></span>
                        <div class="inner">
                            <h3>{{item.bankName}}</h3>
                            <p> 
                                <span>{{item.currency}}</span>
                                <span class="center">{{item.holderType==1?'个人':'公司'}}</span>
                                <span v-if="item.status==2" class="yes">审核通过</span>
                                <span v-if="item.status==1 || !item.status" class="ING">正在审核</span>
                                <span v-if="item.status==3" class="no">审核失败</span>
                            </p>
                        </div>
                    </div>
                    <p>{{item.bankNumber}}</p>
                    <p>{{item.accountName}}</p>
                </li>
            </ul>
        </div>
        
        <div class=" bankInfo">
            <component 
            :is="which_component_show"  
            :id="bankId"  
            @switchConponet="bindCheckPageChange" 
            :status="component_status"
            :holder="holderType"               
            ></component>  
        </div>



        <el-popover class="caras-reminder" v-model="onlyOne">
            <div class="popover-content">
                <div class="reminder-header">
                    <h2>温馨提示</h2>
                    <i class="warning-icon"></i>
                </div>
                <p>您当前只有一个人民币（CNY）提现账户</p>
                <p>请先添加其他人民币（CNY）提现账户，审</p>
                <p>核通过后即可删除该账户。</p>
                <p class="pop-button">
                    <span @click="bindPopcancel" class="cares-button-primary">知道了</span>
                </p>
            </div>
        </el-popover>

        <AuthenticationWarning 
            v-model="authentyWarning"
            @exit="canIleaveNow"
            txt="您的提现账户资料待完善，为了不影响您的提现和CaresPAY其他服务，请您继续完善信息！"
            paint="right"
            >
        </AuthenticationWarning>
    </div>
 </transition>
</template>

<script>

    import { 
        removeAccount,                  //删除提现账户
        } from '../../../../js/api.js';

    import {
        queryAccountModleData
    } from '../../utils/localbase.js';

    import {hideNumberCode} from '../../../../js/common.js';


    import AddCashAccount from './AddCashAccount.vue';
    import EditCashAccount from './AddCashAccount.vue';
    import CheckBankcardInfo from './CheckBankcardInfo.vue';

    import AuthenticationWarning from './../Other/AuthenticationWarning.vue';

    export default {
        data(){
            return{
                onlyOne:false,                               //提示只有一个银行账户的模态框
                holderType:'2',                             //编辑提现账户，判断是 2 对公账户还是 1 个人账户
                activeLi:'-1',
                accountList:[],                             //账号列表
                bankId:``,                                  //当前展示银行卡详情的Id
                component_status:false,                     //是否显示编辑账号按钮 --- 布尔值
                which_component_show:"AddCashAccount"       //动态变化组件
                // which_component_show:"EditCashAccount"       //动态变化组件

                ,LOADING:false,

                authentyWarning:false,              //温馨提示
                ISDONE:false,              //是否完成
                NextTo:null,              //是否完成
            }
        },
        created() {
            let query = this.$route.query;

            if( query.id && query.type ){
                // completeType 对公还是对私 //1. 认证个人    2. 认证公司
                //type 选取哪个页面展示
                switch(query.type){
                    case "1": //添加银行卡账号
                    { this.which_component_show = "AddCashAccount"  }
                    break;  
                    case "2": //编辑页面
                    { this.which_component_show = "EditCashAccount" ; }
                    break;
                    case "3": //查看页面
                    { this.which_component_show = "CheckBankcardInfo" }
                    break;
                    default : //默认添加页面
                    { this.which_component_show = "AddCashAccount"  }
                }
                //id
                this.bankId = query.id || ``;
                this.activeLi = query.id || `-1`;
            }else{
                this.LOADING = true,this.loadingQuery();
            };
        },
        methods:{
            //银行卡卡号显示隐藏中间部分
            bankcodeFormat(n){
                return hideNumberCode(n)
            },
            //加载模块的请求;
            loadingQuery(){
                let _this = this;
                queryAccountModleData().then(res=>{
                    this.accountList = res;

                    (res instanceof Array) && (function(res){
                        for(let i=0;i<res.length;i++){
                            let item = res[i];
                            if(item.status==3){
                                return _this.bindShowChild(0,item.status,item.id)
                            }
                        };
                    })(res);

                    //加载结束
                    this.LOADING = false;
                });
            },
            //切换右边显示的内容
            bindShowChild(val,status,id){
              this.activeLi = id || `-1`;
              //展示哪一个子组件
              switch(val){
                  case -1:{
                    this.which_component_show = "AddCashAccount";
                    this.bankId = null;
                  }
                  break;
                default:{
                   this.which_component_show = "CheckBankcardInfo",     
                   this.component_status = (status==3);
                //    this.component_status = true;
                   this.bankId = id;
                  }
                break;

              }
            },
            //提示只有一个模态框的确认按钮
            bindPopcancel(){
                this.onlyOne = false;
            },
            //子组装件传递过来的参数
            bindCheckPageChange(params){  //params={ hoderType , switch }
                switch(params.switch.toUpperCase()){
                    //1.跳到编辑页面模块
                    case 'EDIT':
                    {
                        this.which_component_show = "EditCashAccount";
                        this.holderType = params.holderType;
                    }
                    break;
                    //2.请求重新加载银行卡列表
                    case 'LOADING':
                    {
                        //1.先清掉缓存
                        this.$store.commit('saveModleData',{
                            key:'WITHDRAWMODLE',
                            data:null
                        });
                        //2.再重新请求
                        this.loadingQuery(); 
                        //3.回显的状态
                        if(params.holderType && params.holderType.toUpperCase()=='MODIFY'){
                            //3.1 修改银行卡的回显
                            //3.1.2 清掉当前修改银行卡缓存的信息
                            this.$store.commit('bankInfoDataCache',{
                                key:this.bankId,
                                data:null
                            });
                            // this.which_component_show = "CheckBankcardInfo"
                            location.hash = '/cashaccount';
                        }

                        this.activeLi='-1',
                        this.which_component_show = "AddCashAccount"
                        
                        
                    }
                    break;
                    //3.删除银行卡账户
                    case 'DELETE':
                    {
                         queryAccountModleData().then(res=>{
                            let bankList = res;
                            let deleArr = 0;

                                bankList.forEach(item=>{
                                    if(!(item.status==1)){
                                        deleArr++
                                    }
                                });

                                // console.log(deleArr);
                                
                                deleArr == 1 ?
                                // 2. 只有一张 弹出提示
                                (this.onlyOne = true):
                                // 3. 请求删除
                                (
                                    this.$confirm('确定要删除该提现账户吗？','提示').then(()=>{
                                        removeAccount({ id:this.bankId }).then(res=>{
                                            res.code==0?
                                            (   //1. 提示
                                                this.$Message.success(`删除成功`),
                                                //2. 清缓存
                                                this.$store.commit('saveModleData',{
                                                    key:'WITHDRAWMODLE',
                                                    data:null}),
                                                //3. 重新加载
                                                this.loadingQuery()
                                            ):
                                            (this.$Message.error(res.msg));
                                        })
                                }).catch(()=>{})
                            );

                        });

                    }
                    break;
                    //是否已经完成修改或编辑
                    case 'FILLDONE':
                    {
                        this.ISDONE = params.value;
                    }
                    break;
                }
            },
            canIleaveNow(bol){
                bol && (
                    this.ISDONE=true,
                    this.$router.push({
                        name:this.NextTo.name,
                        query:this.NextTo.query,
                        params:this.NextTo.params
                    })
                );
            }
        },
        beforeRouteLeave(to,from,next){

            queryAccountModleData().then(data=>{

                if(this.ISDONE || data.length>0){
                    next();
                }else{
                    this.authentyWarning = true;
                    this.NextTo = to;
                    next(false);
                };

            });
        },
        components:{
            AddCashAccount,
            EditCashAccount,
            CheckBankcardInfo,
            AuthenticationWarning
        }
    }
</script>

<style lang="scss" scoped>

@import './../../../../css/common/theme.scss';

    .cashAccount-container{
        min-height: 500px;
        position: relative;
        .bankList{
            width: 290px;
            min-height: 100%;
            max-height: 100%;
            position: absolute;
            overflow-y: auto;
        }
        .bankInfo{
            height: 100%;
            margin-left: 300px;
        }
    }

    .bankList{
        ul{
            padding-top: 25px;
            li{
                height: 108px;
                border: 1px solid #999;
                border-radius: 10px;
                margin-bottom: 16px;
                padding: 16px 0 16px 29px;
                color: #999;
                cursor: pointer;
                &.active{
                    border-color: $--color-primary-two;
                    background:url('../../../../images/carepay/band_select.png') no-repeat right bottom;
                    background-size: 22px 22px;
                     >div>span.bank-logo{
                        // background-image: url('../../../images/carepay/bank_logo_active.png') 
                        background: url('../../../../images/carepay/bank_logo_active.jpg') no-repeat center center;
                     }
                }
                >p{
                    font-size: 12px;
                    line-height: 20px;
                    color: #999;
                }
                >div{
                    margin-bottom: 5px;
                    >span.bank-logo{
                        display: inline-block;
                        width: 34px;
                        height: 34px;
                        background: url('../../../../images/carepay/bank_logo.png') no-repeat center center;
                        vertical-align: middle;
                    }
                    .inner{
                        display: inline-block;
                        vertical-align: middle;
                        h3{
                            font-size: 14px;
                            font-weight: normal;
                        }
                        span{
                            font-size: 12px;
                            color: #999;
                            margin-right: 2px;
                            &.center{
                                display: inline-block;
                                padding: 0 5px;
                                border-left: 1px solid #999;
                                border-right: 1px solid #999;
                            }

                        }
                        .ok {
                            color: green;
                        }

                        .no {
                            color: red;
                        }

                        .ing {
                            color: #f15a24;
                        }
                    }
                }
            }
            //添加新的提现账户
            .add{
                // line-height: 108px;
                display: flex;
                align-items: center;
                text-align: center;
                color: #666;
                a,span{
                    color: #666;
                     font-size: 16px;
                     vertical-align:middle;
                }
                i{
                    color: #666;
                    font-size: 23px;
                    vertical-align:middle;
                    margin-right: 20px;
                }
            }
        }
    }

       //温馨提示
    .caras-reminder .el-popover{
       .popover-content{
             width: 472px;
            height: 440px;
            overflow: hidden;
       }
        p{
            line-height: 30px;
        }
    }

</style>


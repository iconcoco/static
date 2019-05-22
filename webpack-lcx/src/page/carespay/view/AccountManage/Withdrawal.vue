<template>
    <div>
        <!--  -->
        <div v-show="!LOADING && !selectDone" class="withdraw-container">
            <div v-if="CURRENCYARRAY.length" class="current-tab-type ">
                    <!-- 提现的币种： -->
                    <span>选择提现币种：</span>
                    <label 
                        v-for="(item,index) in CURRENCYARRAY" :key="index" 
                        :class="{active:currency==item}" 
                        :for="`CU_${item}`">
                        <template v-if="item=='USD'">美元</template>
                        <template v-if="item=='EUR'">欧元</template>
                        <template v-if="item=='GBP'">英镑</template>
                    </label>

                    <input 
                        v-for="(item,index) in CURRENCYARRAY" :key="`ipt_`+index" 
                        type="radio" 
                        :value="item" 
                        v-model="currency" 
                        :id="`CU_${item}`">

            </div>

            <div v-else class="fadeIn  empty">
                <img src="../../../../images/carepay/empty.png" alt="暂无内容">
                <p>您还没有可以提现的店铺，赶紧<a class="cares-color" @click="changRouter" href="javascript:;">去添加个收款店铺</a>吧~</p>
            </div>

            <div v-for="(code,outIndex) in PlatAll" :key="outIndex" class=" cash-shop-container fadeIn">
                <h3 v-if="code=='BM'" class="amazon-logo"></h3>
                <h3 v-if="code=='WISH'" class="wish-logo"></h3>
                <h3 v-if="code=='AE'" class="AE-logo"></h3>
                <h3 v-if="code=='EBAY'" class="ebay-logo"></h3>
                <CTable>
                    <table>
                            <thead>
                                <tr>
                                    <th>
                                        <el-checkbox v-if="TABLEDATA(code,'withdrawArr').length" v-model="platCheckAll[code]" @change="bindHandleCheckAllChange(code)"></el-checkbox>
                                        <span v-else class="un"></span>
                                    </th>
                                    <th>店铺名称</th>
                                    <th class="per10">国家</th>
                                    <th  class="per20">可提现金额</th>
                                    <th class="per20">提现账户</th>
                                    <th class="per25">需要提现金额</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="empty" v-if="TABLEDATA(code,'withdrawArr').length==0">
                                    <td colspan="6">暂无可提现的店铺</td>
                                </tr>
                                <!-- 可以提现的商铺 -->
                                <tr v-for="(item,index) in TABLEDATA(code,'withdrawArr')" :key="index">
                                    <td>
                                        <el-checkbox :label="item.id" name="select" v-model="checkbox"></el-checkbox>
                                    </td>
                                    <td>{{item.storeName}}<span title="闪提宝店铺"  v-if="item.isFlashWithdraw==1" class="flash-icon"></span></td>
                                    <td>
                                        <span v-for="(code,iiindex) in item.national.split('/')" :key="iiindex">{{nationName(code)}}<i v-if="iiindex != item.national.split('/').length-1">/</i> </span>
                                    </td>
                                    <td>{{farmat(item.balance)}}</td>
                                    <td> 
                                        <el-select v-model="cashAccount[item.id]" placeholder="选择提现账号">
                                            <template v-if="item.channelType=='C'">
                                                <el-option v-for="(listItem,index) in holdInfoList" :key="index"
                                                    :label="`${listItem.bankName}  ${farmatBankCode(listItem.bankNumber)}`"
                                                    :value="listItem.id"
                                                ></el-option>
                                            </template>
                                            <template v-else>
                                                <el-option v-for="(listItem,index) in holdInfoList" :key="index"
                                                    v-if="item.channelType==listItem.channelType"
                                                    :label="`${listItem.bankName}  ${farmatBankCode(listItem.bankNumber)}`"
                                                    :value="listItem.id"
                                                ></el-option>
                                            </template>
                                        </el-select>
                                    </td>
                                    <td>
                                        <div class="el-fix-input">
                                            <el-input  type="text" 
                                            placeholder="输入金额或点击全部提现"
                                            @input="bindInputChange(item.id,item.balance)" 
                                            :maxlength="String(item.balance).length"  v-model="cashCount[item.id]"></el-input>

                                            <a href="javascript:;" 
                                            @click="bindPutoutAllMoney(item.id,code)" 
                                            class="cares-color fix-txt">全部提现</a>
                                        </div>
                                    </td>
                                </tr>
                                <!-- 不可提现的的 -->
                                <tr v-if="TABLEDATA(code,'unwithdrawArr').length>0 && flag[code]" 
                                    :class="{fadeIn: TABLEDATA(code,'unwithdrawArr').length>0 && flag[code]}"
                                    v-for="(uitem,uindex) in TABLEDATA(code,'unwithdrawArr')" :key="`${uindex}tt`" class="unavailable">
                                    <td><span class="un"></span></td>
                                    <td>{{uitem.storeName}}<span v-if="uitem.isFlashWithdraw==1" title="闪提宝店铺"  class="flash-icon"></span></td>
                                    <td>
                                        <span v-for="(code,uuindex) in uitem.national.split('/')" :key="uuindex">{{nationName(code)}}<i v-if="uuindex != uitem.national.split('/').length-1">/</i> </span>
                                    </td>
                                    <td class="ING">
                                        <span v-if="uitem.type==3">店铺资料待完善</span>
                                        <span  v-if="uitem.type==2">店铺审核中，预计1-2天</span>
                                    </td>
                                    <td><el-select disabled value="" placeholder="选择提现账号"></el-select></td>
                                    <td>
                                        <div class="el-fix-input">
                                            <el-input disabled   type="text" ></el-input>
                                            <span class="fix-txt ING">全部提现</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                    </table>
                </CTable>
                <p v-if="TABLEDATA(code,'unwithdrawArr').length>0">
                        <span @click="bindShowUnavailabelShop(code)" class="cares-color">
                            <template v-if="!flag[code]">
                                展开查看不可提现的店铺 <i class="down"></i>
                            </template>
                            <template v-else>
                                收起不可提现的店铺 <i class="up"></i>
                            </template>
                        </span>
                </p>
            </div>

            <!-- 底部提现菜单汇总 -->
            <div v-show="CURRENCYARRAY.length" class="banner cash-shop-count">
                <ul class="fl count-left">
                    <li>
                        <el-checkbox  v-model="checkAll" @change="bindHandleCheckAllChange" label="全选"></el-checkbox>
                    </li>
                    <li>
                        <a @click="bindResetAllData" href="javascript:;">重置</a>
                    </li>
                    <li>
                        当前费率
                        <div class="withdraw-standardrate">
                            <h4>提现费率</h4>
                            <p v-for="(value,key,index) in STANDARDRATE" :key="index">
                                <span v-if="['BM','YD','EU'].indexOf(key)>-1" class="amazon-logo"></span>
                                <span v-if="key=='EBAY'" class="ebay-logo"></span>
                                <span v-if="key=='WISH'" class="wish-logo"></span>
                                <span v-if="key=='AE'" class="AE-logo"></span>

                                <span v-if='key=="BM"'>北美站</span>
                                <span v-if='key=="YD"'>印度站</span>
                                <span v-if='key=="EU"'>欧洲站</span>

                                <span class="plat">{{((value)*100).toFixed(2)}}%</span>
                            </p>
                        </div>
                    </li>
                </ul>
                <ul class="fr count-right">
                    <li>
                        <p>选中的店铺</p>
                        <span class="cares-color">{{checkbox.length}}</span>
                    </li>
                    <li>
                        <p>{{text}}提现总额（{{currency||'USD'}}）
                            <el-tooltip effect="dark" :content="`提现最低金额 50 ${text}`" placement="top-end">
                                    <span class="el-icon-question"></span>
                                </el-tooltip>
                            </p>
                        <span class="cares-color">{{farmat(cashTotal)}}</span>
                    </li>
                    <li>
                        <p>汇率
                            <el-tooltip effect="dark" content="此汇率为合作银行实时汇率，仅供参考； 实际汇率以实时交割汇率为准" placement="top-end">
                                    <span class="el-icon-question"></span>
                                </el-tooltip>
                        </p>
                        <span class="cares-color">{{exchangeRate}}</span>
                    </li>
                    <li class="btn">
                        <a href="javascript:;" @click="bindPutForwayCash" :class="cashTotal>=50 ?'cares-button-primary':'cares-button-info'">
                        <!-- <a href="javascript:;" @click="bindPutForwayCash" :class="cashTotal>=0 ?'cares-button-primary':'cares-button-info'"> -->
                            <span v-if="cashTotal<50">最低 50 {{text}}提现</span>
                            下一步
                        </a >
                        <!-- <button @click="bindPutForwayCash" :class="{warning:cashTotal>0}"  class=" cares-button-bg">提现</button> -->
                    </li>
                </ul>
            </div>

        </div>
        <!-- 确认页面 -->
        <WithdrawConfirm 
            v-show="selectDone" 
            :data="withdrawList"
            :RateData="withdrawRateData"
            @transParams="getChildrenParams"
        ></WithdrawConfirm>
    </div>
</template>

<script>

    import { 
        Pricemoney,
        hideNumberCode
    } from '../../../../js/common.js';

    import { 
        queryWithdrawStoreList,
        queryExchangeRateByCurrency,
        previewWithdraw
    } from '../../../../js/api.js';

    import { 
        NationCode,
        queryCashModleData,
        queryCustomerInfo,
        queryAccountModleData
    } from '../../utils/localbase.js';

    import VERIFYCATION from '../../../../js/verification.js';

    import WithdrawConfirm from './WithdrawalConfirm.vue';
    import CTable from './../../../../components/CTable.vue';

    export default {
        data(){
            return {
                //tab 币种选择
                currency:"",
                CURRENCYARRAY:[],//提现币种的选择
                
                flag :{                 //是否要展开查看不可提现店铺
                    BM:false,
                    EBAY:false,
                    WISH:false,
                    AE:false
                },                      //是否展开不可提现店铺
                platCheckAll:{          //全选
                    BM:false,
                    EBAY:false,
                    WISH:false,
                    AE:false
                },
                BM_withdrawArr:[],         //可提现的商铺--北美站 名字最好不好乱改，可改变的部分是前面的平台编码 xx_withdrawArr
                BM_unwithdrawArr:[],       //不可提现的店铺--北美站

                EBAY_withdrawArr:[],         //可提现的商铺--ebay
                EBAY_unwithdrawArr:[],       //不可提现的店铺--ebay

                AE_withdrawArr:[],
                AE_unwithdrawArr:[],

                WISH_withdrawArr:[],
                WISH_unwithdrawArr:[],



                ALL_STOREID:[],             //所有的可提现商铺的ID
                checkbox:[],            //选中的input   选中的店铺
                checkAll:false,         //是否全选
                cashCount:{},               //提现店铺对应的钱  { id:100 }
                cashAccount:{},             //提现店铺对应的提现账户 { id:26 }
                ALLStoreList:[],        //所有店铺数据 不分平台
                PlatAll:[],             //当前有的平台分类

                selectDone:false,        //是否完成选择提现，然后显示确认提现信息页面
                withdrawList:[],
                withdrawRateData:{},

                
                holdInfoList:[],       //银行账号

                text:'',                //当前提现的币种CN
                exchangeRate:'',        //实时汇率
                STANDARDRATE:'',        //费率


                LOADING:false,
                
            }
        },
        created() {

            this.LOADING=true;
            this.loadingQuery({},true)
            //2019-3-11 增加提现费率
            queryCustomerInfo().then(res=>{
                this.STANDARDRATE = res.standardRate
            });
            //提现银行卡
            queryAccountModleData().then(res=>{
                res.forEach(account=>{
                    account.status==2 && this.holdInfoList.push(account);
                });
            });

        },
        watch:{
            checkbox(newdata){
                if(!newdata.length){
                    this.checkAll = false;
                    for (const key in this.platCheckAll) {
                        this.platCheckAll[key] = false;
                    }
                    return;
                }
                let _this = this;

                this.checkAll = this.ALL_STOREID.every(item=>{
                    return (_this.checkbox.indexOf(item) > -1);
                });

                //1. 选中的将金额都全部提现
                newdata.forEach(id=>{
                    _this.ALLStoreList.forEach(item=>{
                        if(item.id == id){
                            !_this.cashCount[id] && (_this.cashCount[id] = item.balance);
                        }
                    });
                });

                //2. 各个平台的全选是否满足
                for (const key in this.platCheckAll) {
                    this.platCheckAll[key] = this.TABLEDATA(key,'withdrawArr').every(item=>{
                        return _this.checkbox.includes(item.id)
                    });
                };
            },

            currency(n,o){
                //1.查询实时汇率
                queryExchangeRateByCurrency({sourceCurrency:n}).then(res=>{
                    if(res.code==0){
                        this.exchangeRate = res.data.buyExchangeRate;//实时汇率
                    }else{
                        this.$Message.error(res.msg);
                    }
                });
                //2. 单位显示
                 switch(n){
                    case 'USD':{ this.text='美元' }break;
                    case 'EUR':{ this.text='欧元' }break;
                    case 'GBP':{ this.text='英镑' }break;
                };

                if(!o) return;
                this.reset();
                this.loadingQuery({currency:n});
            }
        },
        computed:{
            //计算总额
            cashTotal(){
               let total = 0;
                this.checkbox.forEach(id=>{
                    total+= Number(this.cashCount[id]);
                });
                return total;
            },
        },
        methods:{
            loadingQuery(params,isAll){
                
               !isAll && queryWithdrawStoreList(params).then(res=>{
                   this.LOADING = false;
                   if(res.code==0){
                       this.ALLStoreList = res.data;
                       sorePlat(this.ALLStoreList);
                   }
                });

                //2018-12-18 流程优化 选择默认的币种 展示默认的试图
                isAll && queryWithdrawStoreList().then(res=>{
                    this.LOADING = false;
                   if(res.code==0) {
                       let STORE_DF = [];
                        //1. 分类

                        this.currency = this.$route.params.currency || null;
                        res.data.forEach((item,index)=>{
                            //选择默认的币种
                            index == 0 && !this.currency && (this.currency = item.currency);
                            item.currency==this.currency && STORE_DF.push(item);
                            //所有提现币种
                            this.CURRENCYARRAY.indexOf(item.currency)<0 && this.CURRENCYARRAY.push(item.currency);
                        });

                        //2. 选择当前默认展示的店铺的
                        this.ALLStoreList = STORE_DF;
                        //3. 分类
                        sorePlat(this.ALLStoreList);

                   }
                });


                let _this = this;
                //将当前体现币种的对应店铺分平台板块展示
                function sorePlat(data){
                    let PALL = [];
                    let Pname;
                    data.forEach(item=>{
                        //1. 确认平台
                        Pname = item.platformCode;
                        if(['EU','YD'].indexOf(item.platformCode)>-1){Pname = 'BM'; };

                        //2. 区分可以提现的店铺
                         item.type==1 ? (
                            //1. 添加可提现的店铺
                            _this.TABLEDATA(Pname,'withdrawArr').push(item),
                            //2. 可提现的所有店铺的ID
                            _this.ALL_STOREID.push(item.id),

                            _this.$set(_this.cashCount,item.id,''),
                            _this.$set(_this.cashAccount,item.id,'')
                            
                        ): (
                            _this.TABLEDATA(Pname,'unwithdrawArr').push(item)
                        );
                        //3. 统计所有平台
                         PALL.indexOf(Pname) < 0 && PALL.push(Pname);
                    });

                    //赋值所有平台
                   _this.PlatAll = PALL;
                }
            },
            reset(){
                //1. 清空当前数据
                this.PlatAll.forEach(code=>{
                    this.TABLEDATA(code,'withdrawArr',[]) ;
                    this.TABLEDATA(code,'unwithdrawArr',[]) ;
                });

                for (const key in this.flag) {
                    this.flag[key] = false;
                };

                this.ALL_STOREID = [];
                this.checkbox = [];
                this.ALLStoreList = [];
                this.cashCount = {};
                this.cashAccount = {};
                this.checkAll = false;

                this.PlatAll=[];

            },
            //全选按钮
            bindHandleCheckAllChange(plat){

                if(typeof(plat)=='string'){
                    /**平台的全选**/
                    
                    //全选还是删除
                    this.platCheckAll[plat] ? 
                    (
                        // console.log(`把${plat}的全部选上`), 全选
                        this.TABLEDATA(plat,'withdrawArr').forEach(item=>{
                            //当前没有选中的就把它puhs进去选中
                            !(this.checkbox.includes(item.id) ) && this.checkbox.push(item.id);
                        })

                    ):(
                        //  console.log(`把${plat}的全部删除`)
                         this.TABLEDATA(plat,'withdrawArr').forEach(item=>{
                            //当前有选中的就把它删除掉
                             let index = this.checkbox.indexOf(item.id);
                            if(index>-1) {
                                this.checkbox.splice(index,1);
                            };
                        })
                    );


                }else{
                    /***提现的全选 */
                    this.checkAll ? (this.checkbox = this.ALL_STOREID) : (this.checkbox = [] );
                }
            },
            // 查看不可提现的店铺
            bindShowUnavailabelShop(plat){
                this.flag[plat] = !(this.flag[plat]);
            },
            //重置所有数据
            bindResetAllData(){
                //1.重置清空选择的店铺
                this.checkbox = [];
                //2.重置输入的金额和提现的银行账号
                for (const key in this.cashCount) {
                    this.cashAccount[key] = "";
                    this.cashCount[key] = "";
                }

            },
            //关闭申请提现输入验证码
            bindCloseApplay(){
                this.applayFlag = false;
                this.form.verifyCode = ``;
            },
            //提现按钮
            bindPutForwayCash(){

                //1. 是否已经选择体现店铺
                if(!this.checkbox.length){ return this.$Message.warning(`您还未选择任何可提现的店铺`) };

                //2. 提现的店铺是否已经选择提现账户
                let flag = true;
                this.checkbox.forEach(id=>{
                    if(!this.cashAccount[id]) { return flag=false };
                });

                if(!flag){ return this.$Message.warning(`请选择提现账户`) };
                
                //3. 体现金额是否超过50
                if(flag && this.cashTotal>=50){
                // if(flag && this.cashTotal>=0){

                    //1. 遍历获取提现的店铺ID和金额
                    let SOTRE_SELECT = [];

                    this.checkbox.forEach(id=>{
                        this.ALLStoreList.forEach(item=>{
                            if( item.id == id){
                                SOTRE_SELECT.push({
                                    storeId:item.storeId,
                                    holdInfoId:this.cashAccount[id],
                                    withdrawAmount:this.cashCount[id],
                                });
                            };
                        });
                    });

                    //跳转之前的请求
                    previewWithdraw({
                        withdraws:JSON.stringify(SOTRE_SELECT)  //提现的数据
                    }).then(res=>{
                        if(res.code==0){
                            this.withdrawList = SOTRE_SELECT;
                            this.withdrawRateData = res.data;
                            this.selectDone = true;
                        }else{
                            this.$Message.error(res.msg);
                        }
                    });
                }else{
                    this.$Message.warning(`提现最低金额50${this.text}`);
                }
            },
            getChildrenParams(bol){
                this.selectDone = bol;
            },
            //全部提现
            bindPutoutAllMoney(id,plat){
                
                if(this.checkbox.indexOf(id)<0) this.checkbox.push(id);
                //
                this.TABLEDATA(plat,'withdrawArr').forEach(item=>{
                    if( item.id == id){
                        this.cashCount[id] = item.balance;
                    }
                });

            },
            farmat(num){
                return Pricemoney(num);
            },
            farmatBankCode(num){
                return hideNumberCode(num);
            },
            //取值存值
            TABLEDATA(code,dataType,data){

                if(data){
                    this[`${code}_${dataType}`] = data;
                }else{
                    return this[`${code}_${dataType}`];
                }
            },
            //输入框数量变化
            bindInputChange(id,count){
                //输入就选择 this.cashCount[id]>=50 &&
                this.checkbox.indexOf(id)<0 &&  this.checkbox.push(id);
                //1. 假如输入大于总额
                if(this.cashCount[id]>parseInt(count)){
                    this.cashCount[id] = count;
                }
                //2. 如果输入的没有或者为0 取消选择
                
                if(!Number(this.cashCount[id])){
                    let index = this.checkbox.indexOf(id);
                    this.checkbox.splice(index,1);
                };
            },

            nationName(code){
                let n;
                NationCode.forEach(item=>{
                    if(item.code == code){ n = item.nation };
                });
                return n;
            },

            changRouter(){ this.$router.push({name:'AddShop'}) }
        },
        components:{
            WithdrawConfirm,
            CTable
        }
    }
</script>




<style lang="scss" scoped>
@import './../../../../css/common/theme.scss';
    $primary:$--color-primary-two;

    .withdraw-container{
        padding-left: 0px;
        padding-right: 0;
        padding-bottom: 70px;
        background-color: transparent;
    }

    .cash-shop-container{
        padding: 30px 38px 10px;
         margin-bottom:10px;
        >h3{
            margin-bottom: 22px;
        }
        table{
             .un{
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 1px solid #dbdbdb;
                border-radius: 2px;
            }
            .el-fix-input{
                width: 240px;
            }
            .el-input{
                width: 100%;
            }
            .fix-txt{
                top: 8px;
            }
        }
        .unavailable{
            transition: all .5s;
            background-color: #F8F8F8;
        }
        p{
            font-size: 14px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            span{
                cursor: pointer;
                i{
                    display: inline-block;
                    margin-left: 3px;
                    width: 0px;
                    height: 0px;
                    border-left: 6px solid transparent;
                    border-right: 7px solid transparent;
                }
                .up{
                    border-bottom: 10px solid $--color-primary-one;
                }
                .down{
                    border-top: 10px solid  $--color-primary-one;
                }
            }
        }
    }



    .cash-shop-count{
        padding: 0 38px;
        position: fixed;
        height: 78px;
        bottom: 0;
        z-index: 2;
        width: 100%;
        // border-radius: 8px 8px 0 0;
        box-shadow:0 0 5px 2px rgba(0,0,0,.1);
        ul{
            color: #666;
            font-size: 14px;
        }
        ul.count-left{
            li{
                float: left;
                height: 78px;
                line-height: 78px;
                margin-right: 20px;
                position: relative;
                .input-checkbox{
                    margin-bottom: -2px;
                    margin-right: 5px;
                }
                a{
                    color: #666;
                    &:hover{
                        color:  $--color-primary-one;
                    }
                }

                &:hover{
                    .withdraw-standardrate{
                         visibility: visible;
                        opacity: 1;
                    }
                }

                .withdraw-standardrate{
                    position: absolute;
                    bottom: 100%;
                    width:260px;
                    box-shadow: 0 0 20px 0  rgba(0,0,0,0.1);
                    text-align: center;
                    line-height: 24px;
                    padding: 20px;
                    border-radius: 8px;
                    // display: none;
                    transition: all .5s;
                    visibility: hidden;
                    opacity: 0;
                    
                    &::after{
                        content: "";
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        top: 100%;
                        margin-top: -4px;
                        left: 20px;
                        background-color: #fff;
                        
                        box-shadow: 5px 5px 8px 0  rgba(0,0,0,0.1);
                        transform: rotate(45deg);
                    }
                    p{
                        text-align: left;
                        margin-top:15px;
                    }
                    h4{
                        font-weight: normal;
                    }
                    .plat{
                        float: right;
                    }
                }
            }   
        }
        ul.count-right{
            li{
                float: left;
                margin-left: 55px;
                p{
                    color: #666;
                    margin-top: 16px;
                    span{
                        font-size: 14px;
                    }
                }
                span{
                    font-size: 22px;
                }
               
                button{
                    width: 138px;
                    height: 38px;
                    line-height: 38px;
                }
            }
             .btn{
                    line-height: 78px;
                    .cares-button-primary,
                    .cares-button-info{
                        height: 36px;
                        line-height: 36px;
                        border-radius: 18px;
                        width: 120px;
                        position: relative;
                        &:hover{
                            span{
                                display: block;
                            }
                        }
                        span{
                            position: absolute;
                            width: 160px;
                            height: 30px;
                             bottom: 100%;
                            left: 50%;
                            margin-left: -80px;
                            margin-bottom: 10px;
                            background-color: rgba(0,0,0,.9);
                            text-align: center;
                            line-height: 30px;
                            font-size: 12px;
                            color: #fff;
                            border-radius: 6px;
                            // box-shadow: 0 0px 10px 0 rgba(0,0,0,.1);
                            display: none;
                            &::after{
                                content: '';
                                position: absolute;
                                top: 100%;
                                left: 50%;
                                width: 0;
                                height: 0px;
                                border-top:4px solid rgba(0,0,0,.9);
                                border-right:4px solid transparent;
                                border-bottom:4px solid transparent;
                                border-left:4px solid transparent;
                                margin-left: -3px;
                            }
                        }
                    }
            }
        }
    }


    .current-tab-type{
        margin-bottom: 10px;
        padding: 10px 20px;
        min-height: 52px;
        input{
            display: none;
        }
        span{
            color: #666;
        }
        label{
            display: inline-block;
            height: 30px;
            line-height: 30px;
            padding: 0 15px;
            color: #666;
            font-size: 14px;
            border:1px solid #fff;
            border-radius: 15px;
            vertical-align: middle;
            cursor: pointer;
            margin-right: 10px;
            &.active{
                // color: $primary;
                color: #333;
                border-color: $primary;
                 box-shadow: 0 3px 8px $--color-primary-two-hover;
            }
        }
    }
    

    .empty{
        text-align: center;
        padding:150px 30px;
        min-height: 300px;
        img{
             width: 200px;
        }

        p{
            font-size: 14px;
            color: #aaa;
            margin-top: 20px;
        }
    }

</style>

<style lang="scss">
    .cash-shop-container{
        //修改element的样式
        .el-checkbox__label{
            display: none;
        }
    }
</style>



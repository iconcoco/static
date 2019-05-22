<template>
    <div class="fadeIn">

        <Step
        :active="step"
        :Data="stepData"
        ></Step>
         
        <h2 class="banner-module-title">
            VAT报税
             <a href="javascript:;" class="fr fontnormal cares-color"  @click="jumpToDetails('ReportList')">返回报税列表</a>

             <p class="status-box">
                <span>审核状态：</span>
                
                <span v-if="[0,1,2].includes(ChildrenData.status)" class="ING">{{fineValName(ChildrenData.status,PSTATUS,'name','status')}}</span>
                <span v-if="
                    [3,5,6,7,8,10].includes(ChildrenData.status) ||
                    ['GB','DE','PL','CZ'].includes(ChildrenData.countryCode) &&  [9].includes(ChildrenData.status) ||
                    ['FR','IT','ES'].includes(ChildrenData.countryCode) &&  [13,16].includes(ChildrenData.status)
                " class="ing">{{fineValName(ChildrenData.status,PSTATUS,'name','status')}}</span>
                <span v-if="[11].includes(ChildrenData.status)" class="yes">{{fineValName(ChildrenData.status,PSTATUS,'name','status')}}</span>
                <span v-if="
                    ['FR','IT','ES'].includes(ChildrenData.countryCode) &&  [4,14,9,15,12].includes(ChildrenData.status)||
                    ['GB','DE','PL','CZ'].includes(ChildrenData.countryCode) &&  [4,13,12].includes(ChildrenData.status)
                " class="no">{{fineValName(ChildrenData.status,PSTATUS,'name','status')}}</span>

                <ElTooltip 
                    v-if="[1,2].includes(ChildrenData.status)" 
                    content="报税金额结果将于3~5个工作日内计算完毕" 
                    placement="top-start">
                    <i class="el-icon-info cares-color fs16"></i>
                </ElTooltip>
                <ElTooltip 
                    v-if="
                        ['DE','GB','PL','CZ'].includes(ChildrenData.countryCode) && [4,13].includes(ChildrenData.status)
                    " 
                    content="1~2个工作日内将会有CaresPAY的专业客户人员线下跟进，请留意！" 
                    placement="top-start">
                    <i class="el-icon-info cares-color fs16"></i>
                </ElTooltip>
                <!-- 审核异常原因 -->
                <span v-if="ChildrenData.status==12">（CaresPAY工作人员将在1-2个工作日内与您取得联系，详情请咨询 400-887-0201）</span>
            </p>
           
        </h2>
        
        <div class="refuse-reason"
            v-if="
                ['DE','GB','PL','CZ'].includes(ChildrenData.countryCode) && [4,12,13].includes(ChildrenData.status) ||
                ['FR','IT','ES'].includes(ChildrenData.countryCode) && [4,14,9,15,12].includes(ChildrenData.status)
            "
        >
            <p>{{fineValName(ChildrenData.status,PSTATUS,'name','status')}}原因：</p>
            <ul>
                <li>
                    <i class="point no"></i> {{ChildrenData.failReason}}
                </li>
            </ul>
        </div>

        <component 
        :is="componentId" 
        :DATA="ChildrenData" 
        @reflesh="lodingQueryData(ID)" 
        class="vatReportDetailBox">
        </component>
    </div>
</template>

<script>
import StepOne from './_step_uploadData.vue';
import StepTwo from './_step_calculateTax.vue';
import StepThird from './_step_confirmTax.vue';
import { STATUS_PART1,STATUS_PART2 } from './var.js';
import Step from './../../../../../components/step.vue';

import { 
    findDeclarationModelList 
} from './../../../../../js/api.js';

export default {
    data(){
        return {
            step:1,
            stepData:['','','',''],

            componentId:'',
            PSTATUS:[],

            ChildrenData:{}
        }
    },
    props:["ID"],
    created(){
        if(!this.ID) return this.$emit('jumpPage',{
             toPage:'ReportList',
        });
        this.lodingQueryData(this.ID)
    },
    methods:{
        lodingQueryData(id){
            findDeclarationModelList({
                id,
                pageNum:1,
                pageSize:10,
            }).then(res=>{
                if(res.code==0){
                    this.ChildrenData = res.data.list[0];
                    this.initPage(this.ChildrenData);
                }else{
                    this.$Message.error(res.msg);
                }
            });
        },

        jumpToDetails(name){
            this.$emit('jumpPage',{
                toPage:name
            })
        },

        initPage(DATA){
            if(['GB','DE','CZ','PL'].includes(DATA.countryCode)){
                this.PSTATUS = STATUS_PART1;
                this.stepData = ['上传销售数据','税金计算','确认税金','发送付款通知单+上传支付回执'];
                switch(Number(DATA.status)){
                    case 0 : 
                    case 12 : 
                    {
                        this.step = 1;
                    } break;
                    case 1 : 
                    case 2 : 
                    {
                        this.step = 2;
                    } break;
                    case 3 : 
                    case 4 : 
                    case 13 : 
                    {
                        this.step = 3;
                    } break;
                    case 5 : 
                    case 6 : 
                    case 7 : 
                    case 8 : 
                    case 10 : 
                    case 11 : 
                    {
                        this.step = 4;
                    } break;
                };

            }else{
                this.PSTATUS = STATUS_PART2;
                //法国、意大利、西班牙
                this.stepData = ['上传销售数据','税金计算','确认&&缴纳税金','申报税局'];
                switch(Number(DATA.status)){
                    case 0 : 
                    case 12 : 
                    {
                        this.step = 1;
                    } break;
                    case 1 : 
                    case 2 : 
                    {
                        this.step = 2;
                    } break;
                    case 3 : 
                    case 4 : 
                    case 14 : 
                    case 5 : 
                    case 6 : 
                    case 7 : 
                    case 9 : 
                    case 15 : 
                    case 16 : 
                    {
                        this.step = 3;
                    } break;
                    case 8 : 
                    case 13 : 
                    case 11 : 
                    case 10 : 
                    {
                        this.step = 4;
                    } break;
                };
            };

            this.switchStep();
        },

        switchStep(){
            switch(Number(this.step)){
                case 1:{
                    this.componentId = 'StepOne';
                }break;
                case 2:{
                    this.componentId = 'StepTwo';
                }break;
                case 3:{
                    this.componentId = 'StepThird';
                }break;
                case 4:{
                    this.componentId = 'StepThird';
                }break;
            }
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
        StepThird,
        StepOne,
        StepTwo,
        Step
    },
}
</script>


<style lang="scss" scoped>
@import './../../../../../css/common/theme.scss';

   //审核失败
.refuse-reason{
    margin-top: 10px;
    padding: 10px;
    font-size: 12px;
    background-color: #F2F8FC;
    >p{
        line-height: 30px;
    }
    .point{
        margin-top: -3px;
    }
}

.banner-module-title{
    height: auto;
    line-height: normal;
    font-weight:bold;
    padding: 20px 0;
    font-size: 18px;
    p{
        margin-top: 5px;
        font-size: 14px;
        font-weight: normal;
    }

      .fontnormal{
        font-weight: normal;
        font-size: 16px;
    }
}

.fs16{
    font-size: 16px;
}
</style>


<style lang="scss">
.vatReportDetailBox{
    padding-bottom:20px;
    .title{
        padding: 20px 0;
    }

    form{
        padding-bottom: 20px;
    }

    .form-item{
        margin-bottom: 20px;
        &.line{
            padding:20px 0;
            border-top: 1px solid #f1f1f1;
            border-bottom: 1px solid #f1f1f1;
        }
        .item{
            vertical-align: top;
            .el-checkbox{
                margin-right: 0;
            }
            >p{
                line-height: 30px;
                font-size: 12px;
                margin-bottom: 20px;
            }
        }
    }

    .uploadBox{
        padding: 20px 0;
        li{
            float: left;
        }
    }
}
</style>

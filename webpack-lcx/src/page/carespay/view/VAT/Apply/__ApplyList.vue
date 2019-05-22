<template>
    <div class="fadeIn vatApplyList" v-show="LOADING">
         <h2 class="banner-module-title">
             VAT注册列表
            <a href="javascript:;" class="fr cares-color fontnormal" @click="jumpToAplly(true)">申请注册</a>
         </h2>
         <template v-if="isApply">
            <el-form :model="form" :inline="true">
                <ul class="select-type">
                    <li v-for="(item,index) in STATUS" :key="index"
                        :class="{active:item.status===form.status}"
                        @click="()=>{ if(item.count===0) return ;form.status = item.status; LOADINGQUERY();}"
                    >{{item.name}} <span>{{item.count}}</span></li>
                </ul>
                <el-form-item label="选择时间：" class="dataPicker">
                    <el-date-picker
                        type="datetimerange"
                        v-model="FormTime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        >
                    </el-date-picker>
                </el-form-item>

                <a class="cares-button-primary" @click="bindToSubmit" href="javascript:;">查询</a>
                <a class="cares-button-primary pain" @click="reset" href="javascript:;">重置</a>
            </el-form>
            <CTable>
                <table>
                    <thead>
                        <tr>
                            <th>公司名</th>
                            <th>申报国家</th>
                            <th>增值税/商品和服务税登记号</th>
                            <th>申请时间</th>
                            <th>税号生效时间</th>
                            <th>状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="!table.length" class="empty">
                                <td colspan="6">暂无数据</td>
                        </tr>
                        <tr v-else v-for="(item,index) in table" :key="index">
                            <td>{{item.dutyCompany}}</td>
                            <td>{{fineValName(item.declaredCountry,AllNationCode,'nation','code')}}</td>
                            <td>{{item.dutyServiceNumber}}</td>
                            <td>{{formatTimer(item.createdTime)}}</td>
                            <td>{{formatTimer(item.dutyEffectTime)}}</td>
                            <td>
                                <span v-if="[0,4].includes(item.status)" class="ING">{{fineValName(item.status,STATUS,'name','status')}}</span>
                                <span v-if="[8,3].includes(item.status)" class="ing">{{fineValName(item.status,STATUS,'name','status')}}</span>
                                <span v-if="[1].includes(item.status)" class="yes">{{fineValName(item.status,STATUS,'name','status')}}</span>
                                <span v-if="[2,5].includes(item.status)" class="no">{{fineValName(item.status,STATUS,'name','status')}}</span>
                            </td>
                            <td>
                                <a href="javascript:;" class="cares-color" @click="jumpToAplly(false,item.status,item.id)">查看详情</a>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </CTable>

            <Pagination
                :page='form.pageNum'
                :pageSize='form.pageSize'
                :count='form.count'
                :countSize='form.countSize'
                :chosefallback='bindChosePage'
            ></Pagination>
        </template>

        <div v-else class="null">
            <img src="./../../../../../images/carepay/vat/null.png" alt="空">
            <p>暂无VAT税号申请记录</p>
            <br/>
            <span class="cares-button-primary" @click="jumpToAplly(true)">立即申请VAT税号</span>
        </div>
    </div>
</template>

<script>
import CTable from './../../../../../components/CTable.vue';
import {NationCode} from './../../../utils/localbase.js';
import { vatrecordGetList,vatrecordGetStatistics } from './../../../../../js/api.js';
import { formatTimer } from './../../../../../js/common.js';
export default {
    data(){
        let AllNationCode = NationCode.concat([
            {
                nation:'波兰',
                code:'PL',
                platformCode:'EU',
            },
            {
                nation:'捷克',
                code:'CZ',
                platformCode:'EU',
            },
        ]);

        return {
            isApply:false,
            form:{
                startTime:'',
                endTime:'',

                status:'',

                pageNum:1,
                pageSize:10,
                count:1,
                countSize:100,
            },
            FormTime:null,

            table:[],

            STATUS:[],
            AllNationCode:AllNationCode,
            LOADING:false
        }
    },
    components:{
        CTable
    },
    created(){
        this.LOADINGQUERY();
        this.LOADINGSTATUS();
    },
    methods:{
        LOADINGSTATUS(){
            vatrecordGetStatistics().then(res=>{
                //完成请求
                this.LOADING = true;
                if(res.code==0){
                    let names = ['审核中','申请成功','申请异常','待支付','支付中','支付失败','申请中'];
                    this.STATUS = res.data.map(item=>{
                        item['name'] = names[item.status == 8 ? 6 : item.status ]
                        return item;
                    });
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        LOADINGQUERY(){
            vatrecordGetList(this.form).then(res=>{
                if(res.code==0){
                    this.table = res.data.list;
                    this.form.count = res.page.total;
                    this.form.countSize = res.page.totalSize;

                    this.isApply = res.data.totalSize > 0;

                    //完成请求
                }else{
                    this.$Message.error(res.msg);
                }
            })
        },
        reset(){
            this.FormTime = null;
        },
        bindToSubmit(){
             (this.form.startTime =this.FormTime ? this.FormTime[0] : ''),
             (this.form.endTime = this.FormTime ? this.FormTime[1] : '');

             this.LOADINGQUERY();
        },
        bindChosePage(per,size){
            this.form.pageNum = per;
            this.form.pageSize = size;

            this.LOADINGQUERY();
        },
        jumpToAplly(isApply,status,id){
            //PayVatService
            let PD = this.table.find(item=>{
                return item.id == id
            });

            this.$emit('jumpPage',{
                page: status == 3 ? 'PayVatService' : 'applyDetails',
                isApply,
                status,
                data:PD
            });
        },
        fineValName(code,LIST,NAME,itemCode){
            let I = LIST.find(item=>{
                return item[itemCode]==code;
            });
            if(I){
                return I[NAME];
            }
        },

        formatTimer(code){
            return formatTimer(code);
        }
    }
}

</script>

<style lang="scss" scoped>
@import './../../../../../css/common/theme.scss';

.select-type{
    padding: 20px 0;
    li{
        display: inline-block;
        padding: 0 15px;
        height: 34px;
        line-height: 34px;
        font-size: 14px;
        border: 1px solid #EBEBEB;
        border-radius: 17px;
        cursor: pointer;
        margin-right: 10px;
        transition: all .2s;
        span{
            margin-left: 5px;
        }

        &.active{
            border-color: $--color-primary-two;
            color: $--color-primary-two;
        }

        &:hover{
             color: $--color-primary-two;
         }
    }
}

table{
    margin-bottom: 20px;
}

form{
    border-bottom: 1px solid #F1F1F1;
    margin-bottom: 20px;

    .cares-button-primary{
        min-width: 80px;
        margin-right: 10px;
    }
   
}

.vatApplyList{
    min-height:400px;
}

.banner-module-title{
    font-weight: bold;
    .fontnormal{
        font-weight: normal;
        font-size: 16px;
    }
}
    
</style>


<style lang="scss">
    .vatApplyList{
        // min-height:400px;
        .dataPicker {
            .el-form-item__content,
            .el-input__inner {
                height: 32px;
                line-height: 32px;
                i,span{
                    line-height:25px;
                }
            }
        }
    }


</style>

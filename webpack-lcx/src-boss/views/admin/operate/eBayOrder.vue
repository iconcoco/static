<template>
    <div class="fadeIn">
        <div class="table-container">
            <el-form class="admin-form-inline ebayOrder-form subAccount-form" :inline="true" :model="form">

                <el-form-item label="设置状态：">
                    <el-select v-model="form.optionStatus" placeholder="请选择状态">
                      <el-option label="未设置" value="0"></el-option>
                      <el-option label="已设置" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="店铺名：">
                    <el-input v-model="form.storeName" placeholder="请输入店铺名"></el-input>
                </el-form-item>

                <el-form-item class="data" label="操作时间：">
                    <el-date-picker
                         value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.startOptionTime"
                        type="datetime"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                    <span>~</span>
                     <el-date-picker
                      value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="form.endOptionTime"
                        type="datetime"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>
        <div class="table-container">
            <div class="admin-tab-title">eBay订单列表</div>

            <el-table class="ebayOrder-table" :data="table" border >
               <el-table-column prop="storeName" label="店铺名"></el-table-column>
               <el-table-column width="100" label="PayPal账单">
                   <template slot-scope="scope">
                       <a class="primary" v-if="scope.row.paypalBill" target="_blank" :href="`${download}?fileId=${scope.row.paypalBill}`"> <span class="fa fa-cloud-download"></span> 点击下载</a>
                   </template>
               </el-table-column>

               <el-table-column width="290" prop="" label="eBay订单">
                   <template slot-scope="scope">
                       <template v-if="scope.row.orderFileStatus == 0">
                           <span>起始时间：</span>
                            <el-date-picker
                                value-format="yyyy-MM-dd HH:mm:ss"
                                v-model="table[scope.$index].startOrderTime"
                                type="datetime"
                                placeholder="起始时间">
                            </el-date-picker>
                       </template>
                       
                       <a v-if="scope.row.orderFileStatus==0" @click="bindToDownEbayOrder(scope.row.storeId)" class="primary" href="javascript:;"> <span class="fa fa-gears"></span> 生成</a>
                       <a v-if="scope.row.orderFileStatus==1" class="ing" href="javascript:;"> <span class="fa fa-spinner fa-spin"></span> 生成中</a>
                       <template v-if="scope.row.orderFileStatus==2">
                           <a style="margin-right:20px;" class="primary" :href="`${download}?fileId=${scope.row.orderFileId}`"> <span class="fa fa-cloud-download"></span> 下载</a>
                           <a class="primary" href="javascript:;"  @click="bindToReDown(scope.row.storeId)"><span class="fa fa-refresh"></span> 重新生成</a>
                       </template>
                       
                   </template>
               </el-table-column>

               <el-table-column width="190" label="设置计算起始订单号">
                   <template slot-scope="scope">
                       <span v-if="scope.row.optionStatus == 1">{{table[scope.$index].startOrderId}}</span>
                       <el-input v-else v-model="table[scope.$index].startOrderId" placeholder="设置计算起始订单号"></el-input>
                   </template>
               </el-table-column>
               <el-table-column width="100" prop="optionUserName" label="操作人"></el-table-column>
               <el-table-column label="操作时间">
                   <template slot-scope="scope">
                       {{forMat(scope.row.optionTime)}}
                   </template>
               </el-table-column>
               <el-table-column prop="remark" label="备注">
                   <template slot-scope="scope">
                       <span v-if="scope.row.optionStatus == 1">{{table[scope.$index].remark}}</span>
                        <el-input v-else v-model="table[scope.$index].remark" placeholder="请输入备注"></el-input>
                   </template>
               </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span v-if="scope.row.optionStatus == 1">已操作</span>
                        <el-button v-else @click="bintToSetRemark(scope.row.storeId)" type="primary">确认操作</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination 
                :page="form.pageNumber"
                :pageSize="form.pageSize"
                :count="form.totalSize"
                :chosefallback="pageChange"
            ></Pagination>
        </div>
    </div>
</template>

<script>

    import {
        queryEbayStoreList,
        download,
        updateStartOrderId,
        updateDownStatus
    } from './../../../utils/axios/api.js'

    import {formatTimer} from './../../../utils/common.js'

    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                download:download,
                form:{
                    storeName:"",
                    optionStatus:"",
                    startOptionTime:"",
                    endOptionTime:"",

                    pageNumber:"1",
                    pageSize:"10",
                    totalSize:"1"
                },
                table:[]
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery(this.form);
            },
            loadingQuery(params){
                let data = Object.assign({},params) ;
                data.pageNumber = (params.pageNumber-1);
                queryEbayStoreList(data).then(res=>{
                   if(res.code==0){
                       let resData =  res.data;

                       this.table = resData.list;
                       this.form.totalSize = resData.totalSize
                   }else{
                       this.$message.error(res.msg);
                   }
                })
            },
            reset(){
                this. form = {
                    storeName:"",
                    optionStatus:"",
                    startOptionTime:"",
                    endOptionTime:"",

                    pageNumber:"1",
                    pageSize:"10",
                    totalSize:"1"
                };
            },
            bindToSubmit(){
                this.loadingQuery(this.form);
            },
             pageChange(n,pageSize){
                this.form.pageNumber = n;
                this.form.pageSize = pageSize;
                this.loadingQuery(this.form);
            },
            forMat(time){
                return formatTimer(time);
            },
            //重新生成下载
            bindToReDown(storeId){
                 this.table.map(item=>{
                    if(item.storeId==storeId) return item.orderFileStatus = 0;
                });
            },
            //操作确认
            bintToSetRemark(storeId){
                let store = null;
                //1. 找需要提交的内容
                this.table.map(item=>{
                    if(item.storeId==storeId) return store = item;
                });

                if(!store.startOrderId) return this.$message.warning(`请先设置计算起始订单号`);

                //2. 提示
                this.$confirm("确认设置？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'primary'
                }).then(()=>{
                    
                    updateStartOrderId({
                        storeId:store.storeId,
                        startOrderId:store.startOrderId,
                        remark:store.remark,
                    }).then(res=>{
                       if(res.code==0){
                           this.$router.push({
                               name:"Reflesh",
                               params:{
                                    name:"eBayOrder"
                               }
                           });
                       }else{
                           this.$message.error(res.msg);
                       }
                    });
                }).catch(()=>{
                    console.log(`算了吧取消`);
                })
            },
            //下载ebay订单
            bindToDownEbayOrder(storeId){
                let store = null;

                this.table.map(item=>{
                    if(item.storeId==storeId) return store = item;
                });

                if(!store.startOrderTime) return this.$message.warning(`请选择起始时间`);

                updateDownStatus({
                    storeId:store.storeId,
                    startOrderTime:store.startOrderTime
                }).then(res=>{
                    if(res.code==0){
                        this.$router.push({
                            name:"Reflesh",
                            params:{
                                 name:"eBayOrder"
                            }
                        });
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }
        }   
    }
</script>

<style lang="scss">
.ebayOrder-table{
    .el-input{
        width:100%;
        .el-input__inner{
            background-color: #fff;
        }
    }
}

.ebayOrder-form .data .el-date-editor.el-input{
    width: 185px;
}
</style>


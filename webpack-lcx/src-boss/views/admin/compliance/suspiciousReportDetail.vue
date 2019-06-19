<template>
    <div class="fadeIn">
        <div class="table-container">
            <div class="block">
                <h5># 案例基本信息</h5>
                <p class="fr" style="margin-top: -30px;">
                    <span @click="()=>{ if(caseInfo.status==4) return; return changeModel(true,4);}" :class="{active:caseInfo.status==4}" class="statusButton success">Close</span>
                    <span @click="()=>{ if(caseInfo.status==2) return; return changeModel(true,2);}" :class="{active:caseInfo.status==2}" class="statusButton warning">Escalate</span>
                    <span @click="()=>{ if(caseInfo.status==3) return; return changeModel(true,3);}" :class="{active:caseInfo.status==3}" class="statusButton error">SAR</span>
                </p>
                <ul class="item-container">
                    <li><span>Case ID：</span>{{caseInfo.caseNo}}</li>
                    <li><span>创建时间：</span>{{formatDate(caseInfo.createTime)}}</li>
                    <li><span>最后修改：</span>{{formatDate(caseInfo.updateTime)}}</li>
                    <li><span>状态：</span>
                        <template v-if="caseInfo.status==1"><i class="point ING"></i> Pending</template>
                        <template v-if="caseInfo.status==2"><i class="point warning"></i> Escalated</template>
                        <template v-if="caseInfo.status==3"><i class="point no"></i> SAR</template>
                        <template v-if="caseInfo.status==4"><i class="point yes"></i> Closed</template>
                    </li>
                </ul>
            </div>

            <div class="block">
                <h5># 案例详情</h5>
                <ul class="item-container">
                    <li><span>客户ID：</span>{{caseInfo.customerNo}}</li>
                    <li><span>店铺ID：</span>{{caseInfo.storeId}}</li>
                    <li><span>触发源：</span>
                         <template v-if="caseInfo.source==1">订单监控</template>
                         <template v-if="caseInfo.source==0">人工创建</template>
                    </li>
                    <!-- split("\n") -->
                    <li><span>触发原因：</span>
                        <template v-for="(item,index) in caseInfo.reason.split('\n')" v-if="item">
                            {{index+1}}.{{item}}
                        </template>
                    </li>
                </ul>
            </div>

            <div class="block">
                <h5># 文档存管</h5>
                <p  class="fl" style="margin-left:100px;margin-top: -25px;"><el-button type="primary" @click="()=>{ return changeUploadModel(true); }">上传</el-button></p>
                <el-table :data="table" border >
                    <ElTableColumn prop="fileType" label="文档类型">
                        <template slot-scope="scope">
                            <span v-if="scope.row.fileType==1">订单存档</span>
                            <span v-if="scope.row.fileType==2">调查报告</span>
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="fileName" label="文件名称"></ElTableColumn>
                    <ElTableColumn prop="createTime" label="操作时间">
                        <template slot-scope="scope">
                            {{formatDate(scope.row.createTime)}}
                        </template>
                    </ElTableColumn>
                    <ElTableColumn prop="operationUser" label="操作人"></ElTableColumn>
                    <ElTableColumn label="操作">
                        <template slot-scope="scope">
                            <a class="primary" target="_blank" :href="`${download}?fileId=${scope.row.fileValue}`"><span class="fa fa-cloud-download"></span> 下载</a>
                            <a style="margin-left:20px;" class="no" href="javascript:;"  @click="bindDeleteFile(scope.row.fileValue,scope.row.id)">删除</a>
                        </template>
                    </ElTableColumn>
                </el-table>
            </div>

            <div class="block">
                <h5># 备注</h5>
                <p  class="fr" style="margin-top: -18px;"><el-button type="primary" @click="changeModel(true,0)">新增备注</el-button></p>
                <ul class="remark">
                    <li v-for="(item,index) in remarkTable" :key="index">
                        <p>#{{index+1}} <i>{{item.operationUser}}</i> 于 {{formatDate(item.createTime)}}</p>
                        <p class="content">{{item.remark}}</p>
                    </li>
                </ul>
            </div>

        </div>

        <AdminModel title="备注" v-model="RemarkModel.flag"
            :confirm="modelConfirm"
        >
            <el-input
                class="textarea"
                type="textarea"
                :rows="6"
                placeholder="请输入内容"
                v-model="RemarkModel.value">
            </el-input>
        </AdminModel>
        
        <AdminModel title="上传文档"
            v-model="uploadModel.flag"
            :confirm="uploadModelConfirm"
        >
            <ul class="upload-ul">
                <li>
                    <span>文档类型：</span>
                    <el-radio v-model="uploadModel.uploadType" label="1">订单存档</el-radio>
                    <el-radio v-model="uploadModel.uploadType" label="2">调查报告</el-radio>
                </li>
                <li>
                    <span>上传文档：</span>
                     <el-upload
                        name='upFile'   
                        :show-file-list='false'
                        :action="actionsUpload"
                        :before-upload="beforeUpload"
                        :on-success="bindUploadSuccess"
                        :on-error="bindUploadError"
                        :disabled="uploadModel.ING"
                        style="display:inline-block;"
                        >
                        <el-button v-if="!uploadModel.ING" type="primary">上传文件</el-button>
                        <el-button v-else type="primary"><span class="fa fa-spinner fa-spin"></span> 正在上传</el-button>
                    </el-upload>
                    <label class="uploadFileName" v-if="!uploadModel.ING" :title="uploadModel.fileName">{{uploadModel.fileName}}</label>
                </li>
            </ul>
        </AdminModel>
    </div>
</template>

<script>
import {
    download,
    deleteSuspectFile,
    suspectFileList,
    suspectUploadFile,
    upload,
    querySuspectMangeDto,
    getRecordList,
    updateNewRemark,
    updateSuspectStatus,
} from '../../../utils/axios/api.js';
import { formatTimer } from '../../../utils/common.js';

import AdminModel from './../../../components/adminModal.vue';

export default {
    data(){
        
        return{
            actionsUpload:upload,
            caseInfo:{
                reason:'',
                status:1,
            },
            //文档存管
            table:[],

            remarkTable:[],

            uploadModel:{
                flag:false,
                uploadType:"1",
                fileValue:'',
                fileName:'',
                ING:false
            },

            download:download,

            RemarkModel:{
                flag:false,
                value:'',
                status:0,
            },

        }
    },
    created(){
         let OBJ = this.$route.params;
        let m = this.$store.state.Memory.suspiciousReportDetail;

        if(!Object.keys(OBJ).length && !m) return this.$router.push({name:"suspiciousReport"});
        
        if(!Object.keys(OBJ).length){
            Object.assign(this,m);
        }else{
            let id = OBJ.id;
            this.queryCaseInfo(id);
        };

    },
    methods:{
        queryCaseInfo(id){
            querySuspectMangeDto({
                id:id,
                pageNumber:1,
                pageSize:10,
            }).then(res=>{
                if(res.code==0){
                    this.caseInfo = res.data.content[0];
                    this.queryRemarkList(this.caseInfo.caseNo);
                    this.queryFileList(this.caseInfo.caseNo);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //更改订单状态
        updateReportStatus(status){
            if(this.caseInfo.status == status) return;
            updateSuspectStatus({
                status,
                id:this.caseInfo.id,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`修改成功！`);
                    this.queryCaseInfo(this.caseInfo.id);
                    this.queryRemarkList(this.caseInfo.caseNo);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //获取备注列表
        queryRemarkList(caseNo){
            getRecordList({caseNo}).then(res=>{
                if(res.code==0){
                    this.remarkTable = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        queryFileList(caseNo){
            suspectFileList({caseNo}).then(res=>{
                if(res.code==0){
                    this.table = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        //确认添加备注
        modelConfirm(){

            if(!this.RemarkModel.value) return this.$message.warning(`请输入备注!`);

            updateNewRemark({
                caseNo:this.caseInfo.caseNo,
                remark:this.RemarkModel.value
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`添加成功！`);
                    this.RemarkModel.value = "";
                    this.queryRemarkList(this.caseInfo.caseNo);
                    if(this.RemarkModel.status != 0){
                        this.updateReportStatus(this.RemarkModel.status);
                    };
                     this.changeModel(false,0);
                }else{
                    this.$message.error(res.msg);
                }
            });

           
        },
        //删除文件
        bindDeleteFile(fileValue,id){

            deleteSuspectFile({
                fileValue,
                // caseNo:this.caseInfo.caseNo
                id,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`删除成功！`);
                    this.queryFileList(this.caseInfo.caseNo);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        bindUploadSuccess(res){
            this.uploadModel.ING = false;
            if(res.code==0){
                this.uploadModel.fileValue = res.data.uuid;
             }else{
                this.$message.error(res.msg);
             }
        },
        bindUploadError(){
            this.uploadModel.ING = false;
            this.uploadModel.fileName = "";
        },
        beforeUpload(file){
            this.uploadModel.ING = true;
            this.uploadModel.fileName = file.name
        },

        //确认上传
        uploadModelConfirm(){
            if(!this.uploadModel.fileValue) return this.$message.warning(`请上传文件！`);
            suspectUploadFile({
                fileType:this.uploadModel.uploadType,
                fileValue:this.uploadModel.fileValue,
                fileName:this.uploadModel.fileName,
                caseNo:this.caseInfo.caseNo,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`上传成功！`);
                    this.changeUploadModel(false);
                    //清空已经上传的
                    this.uploadModel.fileValue = "";
                    this.uploadModel.fileName = "";
                    //重新请求列表
                    this.queryFileList(this.caseInfo.caseNo);
                }else{
                    this.$message.error(res.msg);
                }
            });
        },

        changeModel(bol,status){
            this.RemarkModel.flag = bol;
            this.RemarkModel.status = status;
        },

        changeUploadModel(bol){
            this.uploadModel.flag = bol
        },


        formatDate(value){
            return formatTimer(value)
        }
    },
    components:{
        AdminModel
    },
     destroyed(){
        let tabArr = this.$store.state.TabList;
        tabArr.forEach(item=>{
            if(item.name=='suspiciousReportDetail'){
                return  this.$store.commit('setModelRecordData',{
                     key:'suspiciousReportDetail',
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
    h5{
        font-size: 14px;
        color: #333;
    }
    .item-container{
        padding: 20px 0;
        li{
            display: inline-block;
            margin-right: 40px;
            color: #666;
            min-width: 20%;
            max-width: 20%;
            span{
                color: #333;
            }
        }  
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
}


.statusButton{
    display: inline-block;
    padding:0 10px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #e5e5e5;
    border-radius: 15px;
    cursor: pointer;
    &.success{
        &:hover{
            color: $--color-success;
        }
        &.active{
            color: #fff;
            background-color: $--color-success;
            border: none;
        }
    }
    &.warning{
        &:hover{
            color: $--color-warning;
        }
        &.active{
            color: #fff;
            background-color: $--color-warning;
            border: none;
        }
    }
    &.error{
        &:hover{
            color: $--color-danger;
        }
         &.active{
            color: #fff;
            background-color:  $--color-danger;
            border: none;
        }
    }
}
.textarea{
    margin: 20px 0;
}

.upload-ul{
    margin: 20px 0;
    li{
        height: 40px;
        line-height: 40px;
        >span{
            display: inline-block;
            width: 90px;
            text-align: right;
            color: #999;
        }
    }
}

.uploadFileName{
    width: 170px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: top;
}
</style>

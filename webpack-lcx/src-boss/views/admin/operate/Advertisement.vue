<template>
    <div class="fadeIn">
         <div class="table-container">
            <el-form class="admin-form-inline" :inline="true" :model="form">

                <el-form-item label="起始时间" name="startTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" name="endTime">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="form.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="广告名称">
                    <el-input v-model="form.advertisementName" placeholder="请输入广告名称"></el-input>
                </el-form-item>

                 <el-form-item label="广告状态">
                    <el-select v-model="form.status" placeholder="请选择广告状态">
                        <el-option label="全部"  value=""></el-option>
                        <el-option label="待上线"  value="0"></el-option>
                        <el-option label="已上线"  value="1"></el-option>
                        <el-option label="已下线"  value="2"></el-option>
                        </el-select>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
                <el-button @click="bindToShowModal" type="success">新增广告</el-button>

            </el-form>
        </div>

        <div class="table-container">
            <div class="admin-tab-title">广告管理列表</div>

            <el-table :data="table" border >
              <el-table-column prop="startTime" width="150" label="活动起始时间">
                <template slot-scope="scope">
                    {{formatTimer(scope.row.startTime)}}
                </template>
              </el-table-column>
              <el-table-column prop="endTime" width="150" label="活动结束时间">
                  <template slot-scope="scope">
                    {{formatTimer(scope.row.endTime)}}
                </template>
              </el-table-column>
                <el-table-column prop="advertisementName" label="活动名称"></el-table-column>
                <el-table-column prop="advertisementImg" label="活动图片"  width="100">
                    <template slot-scope="scope">
                        <img preview="1" v-if="scope.row.advertisementImg" style="height:40px;vertical-align: middle;" :src="`/file/download?fileId=`+scope.row.advertisementImg" />
                    </template>
                </el-table-column>
                <el-table-column prop="advertisementUrl" label="活动链接"></el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==0" class="ing">待上线</span>
                        <span v-if="scope.row.status==1" class="yes">已上线</span>
                        <span v-if="scope.row.status==2" class="no">已下线</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="bindToChangeAdStatus(scope.row.advertisementNo,1)" v-if="scope.row.status==2 || scope.row.status==0" type="primary">上线</el-button>
                        <el-button @click="bindToChangeAdStatus(scope.row.advertisementNo,2)" v-if="scope.row.status==1 || scope.row.status==0" type="danger">下线</el-button>
                        <el-button @click="bindToModifyAD(scope.row.advertisementNo)" type="warning">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            
             <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>
        </div>

         <AdminModel
            :title="modelType==1 ? '新增广告':'编辑广告'"
            confirmTxt="确认"
            v-model="isShow" 
            :confirm="bindRateConfirm"
            class="hk-bank-arrival-model"
        >
             <el-form class="admin-form-inline" :model="modelForm" :inline="true">

                <el-form-item label="展示模块">
                    <el-select v-model="modelForm.displayArea" placeholder="请选择展示模块">
                        <el-option v-for="(item,index) in AdSortArr" :key="index"
                            :label="item.name"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                </el-form-item>

                 <el-form-item label="广告名称">
                    <el-input v-model="modelForm.advertisementName" placeholder="请输入广告名称"></el-input>
                </el-form-item>

                <el-form-item label="广告图片">
                    <img v-if="modelForm.advertisementImg" style="height:40px;vertical-align: middle;" :src="`/file/download?fileId=`+modelForm.advertisementImg" />
                    <el-upload
                        :show-file-list='false'
                        name='upFile'   
                        :action="actionsUpload"
                        :data="uploadData"
                        :on-success="bindUploadSuccess"
                        :on-error="bindUploadError"
                        style="display:inline-block;"
                        >
                        <el-button type="success">上传</el-button>
                    </el-upload>
                    <p v-if="modelForm.displayArea && modelForm.displayArea==0" class="no" style="height:20px;line-height:20px;font-size:12px;">请上传300*184大小的图片</p>
                </el-form-item>

                <el-form-item label="广告链接">
                    <el-input v-model="modelForm.advertisementUrl" placeholder="请输入广告名称"></el-input>
                </el-form-item>

                <el-form-item label="起始时间">
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="modelForm.startTime"
                        type="date"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                     <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="modelForm.endTime"
                        type="date"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </el-form-item>

            </el-form>
         </AdminModel>
    </div>
</template>

<script>
import AdminModel from '../../../components/adminModal.vue';

   import {
    updateAdvertisement,
    advertisementUpdateStatus,
    queryAdvertisementInfoList,
    saveAdvertisement,
    upload,
    } from '../../../utils/axios/api.js';

    import { formatTimer } from '../../../utils/common.js';

    import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return{
           form:{
               startTime:'',
               endTime:'',
               advertisementName:'',
               status:'',

               page:'1',
               size:'10',
               totalPages:'',
           }, 
           table:[],
           isShow:false,
            actionsUpload:upload,

            modelType:1,
            editNo:"",
            modelForm:{
               displayArea:'0',
               advertisementName:'',
               advertisementImg:'',
               advertisementUrl:'',
               startTime:'',
               endTime:'',
            },
            AdSortArr:[
                {code:'0',name:'商户后台首页Banner'},
                {code:'2',name:'商户后台登录页'},
                {code:'3',name:'商户后台每页底部'},
                {code:'1',name:'其他 '},
            ],
            uploadData:{
                fileType:8
            }
        }
    },
    components:{
        AdminModel
    },
    methods:{
        __LOADING(){
             this.loadingQuery(this.form)
        },
        loadingQuery(params){
            queryAdvertisementInfoList(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        reset(){
             let n = ["page","size","totalPages"];
            //选择的数据变成空字符
            for (const key in this.form) {
                if (n.indexOf(key)<0) {
                    this.form[key]="";
                }
            };
        },
        bindFormSubmit(){
            this.form.page = "1";

            this.loadingQuery(this.form);
        },
        bindToShowModal(){
            this.modelType = 1;
            for (const key in this.modelForm) {
                this.modelForm[key] = "";
            }
            this.isShow = true;
        },
        pageChange(n,size){
            this.form.page = n;
            this.form.pageSize = size;
            this.loadingQuery(this.form);
        },
        bindRateConfirm(){
            
             for (const key in this.modelForm) {
                if (!this.modelForm[key]) {
                    let msg ='';
                    key == 'displayArea' && (msg = '请选择展示模块');
                    key == 'advertisementName' && (msg = '请输入广告名称');
                    key == 'advertisementImg' && (msg = '请上传广告图片');
                    key == 'advertisementUrl' && (msg = '请输入广告链接');
                    key == 'startTime' && (msg = '请选择起始时间');
                    key == 'endTime' && (msg = '请选择结束时间');

                    return this.$message.warning(msg);
                }
            };

            //添加  
            this.modelType ==1 && saveAdvertisement(this.modelForm).then(res=>{
                if(res.code==0){
                    //1. 提示
                    this.$message.success(`创建成功!`);
                    //2. 隐藏框
                    this.isShow = false;
                    //3. 刷新列表
                    this.loadingQuery(this.form);
                }else{
                    this.$message.error(res.msg);
                }
            });

            //修改
            this.modelType ==0 && (
                
                updateAdvertisement(Object.assign({advertisementNo:this.editNo},this.modelForm)).then(res=>{
                    if(res.code==0){
                        //1. 提示
                        this.$message.success(`修改成功!`);
                        //2. 隐藏框
                        this.isShow = false;
                        //3. 刷新列表
                        this.loadingQuery(this.form);
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            );
        },
        bindUploadSuccess(res){
             if(res.code==0){
                    this.modelForm.advertisementImg = res.data.uuid;
                }else{
                    this.$message.error(res.msg);
                }
        },
        bindUploadError(){},
        bindToModifyAD(advertisementNo){
            this.modelType = 0;
            this.editNo = advertisementNo;
            this.table.map(item=>{
                if(item.advertisementNo == advertisementNo){
                    for (const key in this.modelForm) {
                        if(key == 'startTime' || key == 'endTime'){
                           this.modelForm[key] = formatTimer(item[key]);
                        }else{
                            this.modelForm[key] = String(item[key]);
                        }
                    }
                        this.isShow = true;
                };
            });
        },
        bindToChangeAdStatus(advertisementNo,status){
            advertisementUpdateStatus({
                advertisementNo,
                status,
            }).then(res=>{
                if(res.code==0){
                    this.$message.success(`修改成功!`);
                    this.loadingQuery(this.form);
                }else{
                    this.$message.error(res.code);
                }
            });
        },
         formatTimer(code){
            return formatTimer(code);
        }
    },
}
</script>

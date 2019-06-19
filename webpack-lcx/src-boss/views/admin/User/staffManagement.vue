<template>
    <div class="fadeIn">
       <div class="table-container">
            <el-form :inline="true" :model="form">

                 <el-form-item label="手机号码：">
                    <el-input name="phone" v-model="form.phone" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                 <el-form-item label="真实姓名：">
                    <el-input v-model="form.userName" placeholder="请输入客户名称"></el-input>
                </el-form-item>

                 <el-form-item label="角色：">
                    <el-select v-model="form.roleId" placeholder="请选择客户类型">
                       <el-option
                             v-for="(item,index) in roleData"
                             :key="index"
                             :label="item.roleName"
                             :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>


                <el-form-item label="状态：">
                    <el-select v-model="form.status" placeholder="请选择客户状态">
                         <el-option
                             v-for="(item,index) in roleStatus"
                             :key="index"
                             :label="item.status"
                             :value="item.code">
                         </el-option>
                    </el-select>
                </el-form-item>

                <el-button @click="bindToSubmit" type="primary" plain>查询</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form>
        </div>

        <Block
            title="员工列表"
        >
            <el-button type="primary" @click="bindChangeModalStatus('add')">新增员工</el-button>
            <el-table :data="table" border >
                <el-table-column prop="userCode" label="用户名"></el-table-column>
                <el-table-column prop="userName" label="真实姓名"></el-table-column>
                <el-table-column prop="phone" label="手机号码"></el-table-column>
                <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
                <el-table-column prop="roleName" label="角色"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.status==1" class="waiting">{{statusName(scope.row.status)}}</span>
                        <span v-if="scope.row.status==2" class="yes">{{statusName(scope.row.status)}}</span>
                        <span v-if="scope.row.status==3" class="no">{{statusName(scope.row.status)}}</span>
                        <span v-if="scope.row.status==4" class="ing">{{statusName(scope.row.status)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createdTime" label="添加时间" width="150">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.createdTime)}}
                    </template>
                </el-table-column>
                <el-table-column prop="" label="最后修改时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a href="javascript:;" class="primary" @click="bindChangeModalStatus('modify',scope.row.id)">修改</a>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>

        </Block>

        <AdminModal
            title="新增用户"
            v-model="modalFlag"
            :confirm="bindModalConfirm"
            class="staffManagement-adminModal"
        >
            <el-form :inline="true" :model="modalForm">
                <el-form-item label="用户名" name="userCode">
                    <el-input name="userCode" v-model="modalForm.userCode" @blur="bindIptblur('userCode')" placeholder="字母和数字组成，字母开头"></el-input>
                </el-form-item>

                <el-form-item label="真实姓名" name="userName">
                    <el-input v-model="modalForm.userName" name="userName" @blur="bindIptblur('userName')" placeholder="请输入真实姓名"></el-input>
                </el-form-item>

                <el-form-item label="手机号码" name="phone">
                    <el-input v-model="modalForm.phone" name="phone" @blur="bindIptblur('phone')" placeholder="请输入手机号码"></el-input>
                </el-form-item>

                <el-form-item label="邮箱" name="email">
                    <el-input v-model="modalForm.email" name="email" @blur="bindIptblur('email')" placeholder="请输入邮箱"></el-input>
                </el-form-item>

                <el-form-item label="角色" name='PROVINCECODE'>
                    <el-select v-model="modalForm.roleId" @blur="bindIptblur('roleId')" name='PROVINCECODE' placeholder="请选择角色">
                        <el-option
                             v-for="(item,index) in roleData"
                             :key="index"
                             :label="item.roleName"
                             :value="`${item.id}`">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态：" v-if="modalIsEdit" name='CITYCODE' >
                    <el-select v-model="modalForm.status" placeholder="请选择客户状态" name='CITYCODE' @blur="bindIptblur('status')">
                         <el-option
                             v-for="(item,index) in roleStatus"
                             :key="index"
                             :label="item.status"
                             :value="`${item.code}`">
                         </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
        </AdminModal>
    </div>
</template>

<script>
import AdminModal from './../../../components/adminModal.vue';
import { 
    queryUserList,
    queryRoleAll,
    addUser,
    updateUser
 } from '../../../utils/axios/api.js';
 import { formatTimer,removeClass } from '../../../utils/common.js';
 import VERIFICATION from '../../../utils/verfication.js';

 import mixin from '../../../ext/mixin.js';


export default {
    mixins:[mixin()],
    data(){
        return{
            form:{

                phone:'',
                userName:'',
                roleId:'',
                status:'',

                page:'1', 
                size:'10', 
                totalPages:'1'
            },
            modalForm:{
                userCode:'',    //用户名
                userName:'',    //真实名字
                phone:'',       //手机号码
                email:'',       //邮箱
                roleId:'',      //角色
                status:'1',
            },
            table:[],
            modalFlag:false,
            modalIsEdit:false,

            roleData:[],    //角色
            roleStatus:[
                {code:1,status:'未激活'},
                {code:2,status:'在职'},
                {code:3,status:'锁定'},
                {code:4,status:'离职'},
            ]
        }
    },
    watch:{
        modalFlag(){
            let nodes = document.querySelectorAll('.is-error');
            for(let i=0;i<nodes.length;i++){
                 removeClass(nodes[i],'is-error');
                 nodes[i].querySelector('.el-form-item__error').remove();
            }
        }
    },
    methods:{
        __LOADING(){
            this.loadingQuery(this.form),
            queryRoleAll().then(res=>{
                if(res.code==0){
                    this.roleData = res.data
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        loadingQuery(params){
            queryUserList(params).then(res=>{
                if(res.code==0){
                    this.table = res.data.content;
                    this.form.totalPages = res.data.totalPages;
                }else{
                    this.$message.error(res.msg);
                }
            })
        },
        bindToSubmit(){
            this.form.page = 1;
            this.loadingQuery(this.form);
        },
        reset(){
            let n = ['page','size','totalPages'];
            for (const key in this.form) {
                if(n.indexOf(key)<0){
                    this.form[key] = "";
                }
            }
        },
        bindModalConfirm(){
            let flag = true;
            for (const key in this.modalForm) {
                if(!this.bindIptblur(key)) flag = false;
            };

            if(!flag) return;

            if(this.modalIsEdit){
                updateUser(this.modalForm).then(res=>{
                    if(res.code==0){
                        this.modalFlag = false;
                        this.$message.success('修改成功！');
                        this.bindToSubmit();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }else{
                //添加
                addUser(this.modalForm).then(res=>{
                    if(res.code==0){
                         this.modalFlag = false;
                        this.$message.success('添加成功！');
                        this.bindToSubmit();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }
        },
        bindChangeModalStatus(type,id){
            this.modalFlag = true;
            
           switch(type){
               case 'add':
               {
                   this.modalIsEdit = false;
                   for (const key in this.modalForm) {
                       key != 'status' && (this.modalForm[key] = '');
                    };
               }
               break;
               case 'modify':
               {
                   this.modalIsEdit = true;
                   this.table.forEach(item=>{
                       if(item.id == id){
                           for (const key in this.modalForm) {
                               this.modalForm[key] = String(item[key]);
                           };
                       };
                   });
               }
               break;
           }
        },
         //点击页码
        pageChange(n,pageSize){
            this.form.page = n;
            this.form.size = pageSize;
            this.loadingQuery(this.form)
        },
        formatTime(code){
            return formatTimer(code);
        },
        statusName(code){
            let str= null;
            this.roleStatus.forEach(item=>{
                if(item.code==code){
                    str = item.status
                }
            });
            return str;
        },
        bindIptblur(name){

            let key = null,
                msg = null;

            switch(name){
                case 'roleId':
                {
                    key = 'PROVINCECODE';
                    msg = '请选择角色';
                }
                break;
                case 'status':
                {
                    key = 'CITYCODE';
                    msg = '请选择用户状态';
                }
                break;
                default :{
                    key = name
                }
            };

            return VERIFICATION(key,this.modalForm[name],msg);
        },
    },
    components:{
        AdminModal
    }
}
</script>

<style lang="scss">
.staffManagement-adminModal{
    .modal-container{
        margin-top: -220px;
    }
   form{
        padding-top: 20px;
   }
    .el-input,.el-select{
        width: 200px;
    }
    .el-form-item__label{
        min-width: 80px;

    }
}
</style>


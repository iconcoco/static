<template>
 <transition name="fade">
    <div>
        <div class="table-container">
             <el-form class="admin-form-inline" :inline="true" :model="form">

                 <el-form-item label="角色名称" name="roleName">
                    <el-input name="roleName" v-model="form.roleName" placeholder="请输入角色名称"></el-input>
                </el-form-item>

                 <el-form-item label="角色编号" name="roleCode">
                    <el-input name="roleCode" v-model="form.roleCode" placeholder="请输入角色编号"></el-input>
                </el-form-item>

                <el-button @click="bindFormSubmit" type="primary">查询</el-button>

            </el-form>

             <el-button type="primary" @click="bindAddRole" >添加角色</el-button>

            <el-table :data="table" border >
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleCode" label="角色编号"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column label="创建时间" width="150">
                    <template slot-scope="scope">
                        {{f(scope.row.createTime)}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="bindUpdataRole(scope.row.id,scope.$index)" type="primary" >编辑</el-button>
                        <el-button @click="bindGotoSetAuth(scope.row.id,scope.row.roleName)" type="primary" plain>设置权限</el-button>
                    </template>
                </el-table-column>
            </el-table>

             <Pagination 
                :page="form.page"
                :pageSize="form.size"
                :count="form.totalPages"
                :chosefallback="pageChange"
            ></Pagination>

            <!-- 添加角色 -->
            <AdminModel
                :title="modal.title"
                confirmTxt="确认"
                v-model="addForm.isShow" 
                :confirm="adminModalConfirm"
                class="role-adminModal"
               >
               <el-form :model="addForm">
                    <el-form-item label="角色名称">
                        <el-input v-model="addForm.roleName" placeholder="请输入角色名称"></el-input>
                    </el-form-item>

                    <el-form-item label="角色编号">
                        <el-input v-model="addForm.roleCode" placeholder="请输入角色编号"></el-input>
                    </el-form-item>

                    <el-form-item label="备注">
                        <el-input v-model="addForm.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
               </AdminModel>
        </div>
    </div>
</transition>
</template>

<script>
    import {queryRoleList,addRole,updateRole} from '../../../utils/axios/api.js';
    import { formatTimer } from '../../../utils/common.js'


    import AdminModel from '../../../components/adminModal.vue';
    import mixin from '../../../ext/mixin.js';

    export default {
        mixins:[mixin()],
        data(){
            return{
                form:{
                    roleCode:'', 
                    roleName:'', 
                    page:'1',
                    size:'10',
                    totalPages:'1'
                },
                table:[],
                addForm:{
                    isShow:false,
                    id:'',
                    roleName:'',
                    // roleCode:'',
                    remark:'',
                },
                modal:{
                    type:1,     //1.添加  2. 修改   
                    title:'添加角色'  
                },               
            }
        },
        methods:{
            __LOADING(){
               this.loadingQuery(this.form); 
            },
            loadingQuery(params){

                queryRoleList(params).then(res=>{
                    if(res.code==0){
                        this.table = res.data.content;
                        this.form.totalPages = res.data.totalPages;
                    }else{
                        this.$message.error(res.msg);
                    }
                })
            },
            resetAddform(){
                 this.addForm.isShow = false,
                 this.addForm.roleName = '',
                 this.addForm.id = '',
                 this.addForm.roleCode = '',
                 this.addForm.remark = '';
            },
            //页码选择
           pageChange(n,pageSize){
               this.form.page = n;
               this.form.size = pageSize;
               this.loadingQuery(this.form);
           }, 
           //查询按钮
           bindFormSubmit(){
              this.loadingQuery(this.form); 
           },
           //添加角色
           bindAddRole(){
                //清空有回显的数据
                this.resetAddform();
                //添加角色的模态框
                this.addForm.isShow = true;
                this.modal.type = 1;
                this.modal.title = `添加角色`;
           },
           //更新角色
           bindUpdataRole(id,index){
                this.addForm.isShow = true;
                this.modal.type = 2;
                this.modal.title = `编辑角色`;

                //编辑的角色ID
                this.addForm.id = id;

                let o = this.table[index];
                    //修改回显的内容
                    this.addForm.roleName = o.roleName ,
                    this.addForm.remark = o.remark ;
                    this.addForm.roleCode = o.roleCode ;
           },
           //添加/修改角色确认按钮
           adminModalConfirm(){

               if(!this.addForm.roleName.trim()) return this.$message.warning('请输入角色名称');

               if(!this.addForm.roleCode.trim()) return this.$message.warning('请输入角色编号');

                //1. 添加角色
              (this.modal.type == 1) && addRole(this.addForm).then(res=>{
                   if(res.code==0){
                        this.$message.success(`添加成功！`);
                        this.resetAddform();
                        this.loadingQuery(this.form);
                   }else{
                       this.$message.error(res.msg);
                   }
               });
                //2. 修改
              (this.modal.type == 2) && updateRole(this.addForm).then(res=>{
                   if(res.code==0){
                        this.$message.success(`修改成功！`);
                        this.resetAddform();
                        this.loadingQuery(this.form);
                   }else{
                       this.$message.error(res.msg);
                   }
               });

           },
            //配置角色权限
           bindGotoSetAuth(ID,name){
               this.$router.push({
                   name:'AuthTree',
                   params:{
                       roleId:ID,
                       roleName:name
                    }
               })
           },
           f(t){
               return formatTimer(t);
           }
        },
        components:{
            AdminModel
        }
    }
</script>

<style lang="scss">
     .role-adminModal{
        .content{
            padding-top: 20px;
        }
        .modal-container{
            margin-top: -150px;
        }
    }
</style>


<style lang="scss" scoped>
    .role-adminModal{
        .el-input{
            width: 290px;
            float: right;
            margin-top: 5px;
        }
    }
</style>


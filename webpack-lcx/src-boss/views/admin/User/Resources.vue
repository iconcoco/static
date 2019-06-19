<template>
 <transition name="fade">
    <div>
       <div class="table-container">

           <el-button type="primary" @click="bindShowModal">添加菜单资源</el-button>
           <el-button type="danger" @click="reset">清空选择</el-button>
           <table class="resource-table">
               <thead>
                   <tr>
                       <th class="per30">菜单名称</th>
                       <th class="per20">图标</th>
                       <th class="per20">类型</th>
                       <th>操作</th>
                   </tr>
               </thead>
               <tbody>
                   <tr v-if="!table.length">
                       <td colspan="6">暂无查询结果</td>
                   </tr>
                   <template  v-for="(item,ooindx) in table">
                       <tr :key="`oo-${ooindx}`">
                           <td class="text-left">
                               <i v-if="item.childList.length" @click="bindMenuSlider(`second-${item.id}`,'id',$event)" class="fa fa-plus-square"></i>
                               <el-radio :label="item.id"  @change="bindMenuChange()" v-model="form.parentId">{{item.authDesc}}</el-radio>
                           </td>
                           <td> <i class="fa" :class="item.icon"></i></td>
                           <td> <span class="no">目录</span> </td>
                           <td>
                               <el-button @click="bindEditResource(0,item.id,1)"  type="primary" plain>编辑</el-button>
                               <el-button @click="bindDeleteResource(item.id)"  type="danger">删除</el-button>
                            </td>
                       </tr>
                       <template v-for="(second,ssindex) in item.childList">
                           <tr :key="`oo-${ooindx}-ss-${ssindex}`" :data-id="`second-${item.id}`"  class="second-menu active">
                                <td class="text-left-2"> 
                                    <i v-if="second.childList.length" @click="bindMenuSlider(`last-${second.id}`,'tr',$event)" class="fa fa-minus-square"></i>
                                    <el-radio :label="second.id"  @change="bindMenuChange(second.id)" v-model="form.id"> {{second.authDesc}} </el-radio> 
                                </td>
                                <td>--</td>
                                <td> <span class="yes">菜单</span>  </td>
                                <td>
                                    <el-button @click="bindEditResource(item.id,second.id,2)"  type="primary" plain>编辑</el-button>
                                    <el-button @click="bindDeleteResource(second.id)"  type="danger">删除</el-button>
                                </td>
                            </tr>
                            <tr  :data-id="`second-${item.id}`" :data-tr="`last-${second.id}`"  class="last-menu active" v-for="(last,llindex) in second.childList" :key="`oo-${ooindx}-ss-${ssindex}-ll-${llindex}`">
                                <td  class="text-left-3">{{last.authDesc}}</td>
                                <td>--</td>
                                <td> <span class="ing">按钮</span>  </td>
                                <td>
                                    <el-button @click="bindEditResource(second.id,last.id,3)"  type="primary" plain>编辑</el-button>
                                    <el-button @click="bindDeleteResource(last.id)"  type="danger">删除</el-button>
                                </td>
                            </tr>
                       </template>
                   </template>
               </tbody>
           </table>

            <AdminModal
                :title="modal.title"
                confirmTxt="确认"
                v-model="form.isShow"
                :confirm="adminModalConfirm"
                class="role-adminModal"
            >

                <el-form :model="form">
                    <!-- <el-form-item label="资源类型">
                        <el-radio v-model="form.authType" label="1">目录</el-radio>
                        <el-radio v-model="form.authType" label="2">菜单</el-radio>
                        <el-radio v-model="form.authType" label="3">按钮</el-radio>
                    </el-form-item> -->

                    <el-form-item v-if="modal.addSwitch==1" label="目录图标">
                        <el-input v-model="form.icon" placeholder="icon"></el-input>
                    </el-form-item>

                    <el-form-item v-if="modal.addSwitch!=1" label="上层资源">
                        <el-input v-model="form.parentName" disabled></el-input>
                    </el-form-item>

                    <template>
                        <el-form-item v-if="modal.addSwitch==1" label="目录名称">
                            <el-input v-model="form.authDesc" placeholder="authDesc"></el-input>
                        </el-form-item>
                        
                        <el-form-item v-if="modal.addSwitch==2" label="菜单名称">
                            <el-input v-model="form.authDesc" placeholder="authDesc"></el-input>
                        </el-form-item>

                        <el-form-item v-if="modal.addSwitch==3" label="按钮名称">
                            <el-input v-model="form.authDesc" placeholder="authDesc"></el-input>
                        </el-form-item>
                    </template>

                    <el-form-item v-if="modal.addSwitch!=3" label="组件名">
                        <el-input v-model="form.authName" placeholder="authName"></el-input>
                    </el-form-item>

                    <template>
                        <el-form-item v-if="modal.addSwitch==1" label="目录编号">
                            <el-input v-model="form.authCode" placeholder="authCode"></el-input>
                        </el-form-item>

                        <el-form-item v-if="modal.addSwitch==2" label="菜单编号">
                            <el-input v-model="form.authCode" placeholder="authCode"></el-input>
                        </el-form-item>

                        <el-form-item v-if="modal.addSwitch==3" label="按钮编号">
                            <el-input v-model="form.authCode" placeholder="authCode"></el-input>
                        </el-form-item>
                    </template>
                   
                </el-form>

            </AdminModal>
           
       </div>
    </div>
</transition>
</template>

<script>
    import $ from 'jquery';

    import { loadAllAuthTree,addAuth,updateAuth,delAuth } from '../../../utils/axios/api.js';

    import AdminModal from '../../../components/adminModal.vue';

    import mixin from '../../../ext/mixin.js';


    function findAuthDesc(arr,id){
       let authDesc = null,
            flag = false;
        (function fillter(arr,id){
            if(!arr || !arr.length || flag) return
            arr.forEach(ele => {

                if(ele.id == id){
                    flag = true;
                    return authDesc = ele;
                }

                fillter(ele.childList,id);
            });
        })(arr,id);

        return authDesc
    }

    export default {
        mixins:[mixin()],
        data(){
            return{
                table:[],
                form:{
                    isShow:false,
                    parentName:'',

                    id:'',
                    parentId:`0`,
                    authType:'1',
                    icon:'',
                    authDesc:'',
                    authName:'',
                    authCode:'',
                },
                modal:{
                    type:1,     //1.添加  2. 修改   
                    title:'添加资源',
                    addSwitch: 1,   //1.目录  2.菜单   3.按钮
                },  
            }
        },
        methods:{
            __LOADING(){
                this.loadingQuery();
            },
            loadingQuery(){
                 loadAllAuthTree().then(res=>{
                    if(res.code==0){
                        this.table = res.data.childList;
                    }else{
                        this.$message.error(res.msg);
                    }
                });  
            },
            reset(){
                this.form = {
                    isShow:false,
                    parentName:'',

                    parentId:0,
                    authType:'1',
                    id:'',
                    icon:'',
                    authDesc:'',
                    authName:'',
                    authCode:'',
                }
            },
            bindMenuChange(n){
                if(!n){
                     this.form.id='';
                }else{
                    this.form.parentId = n;
                }
            },
            //展示模态框
            bindShowModal(){
                this.modal.type = 1;
                this.modal.title = `添加资源`;

                if(this.form.parentId==0){
                    //目录
                    this.form.authType = '1';
                    this.modal.addSwitch = '1';
                }else if(this.form.parentId!=0 && !this.form.id){
                    //菜单
                    this.form.authType = '2';
                    this.modal.addSwitch = '2';
                    this.form.parentName = findAuthDesc(this.table,this.form.parentId).authDesc;
                }else{
                    // 按钮
                    this.form.authType = '3';
                    this.modal.addSwitch = '3';
                    this.form.parentName = findAuthDesc(this.table,this.form.id).authDesc;
                }

                this.form.isShow = true;
            },
            //编辑资源
            bindEditResource(parentId,id,type){
                this.modal.type = 2;
                this.modal.title = `编辑资源`;
                this.modal.addSwitch = type;

                //编辑对象的ID
                this.form.id = id;
                this.form.parentId = parentId;
                
                //回显的内容
                parentId!=0 && (this.form.parentName  = findAuthDesc(this.table,parentId).authName) ;
                this.form.icon  = findAuthDesc(this.table,id).icon ;
                this.form.authDesc  = findAuthDesc(this.table,id).authDesc ;
                this.form.authName  = findAuthDesc(this.table,id).authName ;
                this.form.authCode  = findAuthDesc(this.table,id).authCode ;

                this.form.isShow = true;
            },
            //删除资源
            bindDeleteResource(id){
                this.$confirm('是否继续执行删除资源的操作?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    
                    delAuth({authId:id}).then(res=>{
                        if(res.code==0){
                            this.$message.success(`已删除！`);
                            this.loadingQuery();
                        }else{
                            this.$message.error(res.msg);
                        }
                    });

                }).catch(() => {});
                
            },
            //确认添加/编辑资源按钮
            adminModalConfirm(){
                //添加
               (this.modal.type == 1) && addAuth(this.form).then(res=>{
                    if(res.code==0){
                        this.$message.success(`添加成功！`);
                        this.form.isShow = false;
                        this.reset();
                        this.loadingQuery();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
                // 修改
               (this.modal.type == 2) && updateAuth(this.form).then(res=>{
                    if(res.code==0){
                        this.$message.success(`修改成功！`);
                        this.form.isShow = false;
                        this.reset();
                        this.loadingQuery();
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            },
            //展示下面的子菜单
            bindMenuSlider(id,type,event){
                let self = $(event.target);
                let dom = $(`tbody tr[data-${type}=${id}]`);

                let bol = true;
                for(let i =0; i<dom.length; i++){
                    if(!$(dom[i]).hasClass('active')){
                         bol = false;
                    }
                }
                
                if(bol){
                    self.removeClass('fa-plus-square').addClass('fa-minus-square')
                    dom.removeClass('active').show();
                }else{
                    self.removeClass('fa-minus-square').addClass('fa-plus-square')
                    dom.addClass('active').hide();
                }
            }
        },
        watch:{
            AdminModalFlag(n){
                if(!n) this.reset();
            }
        },
        computed:{
            AdminModalFlag(){
                return this.form.isShow;
            }
        },
        components:{
            AdminModal
        }
    }
</script>

<style lang="scss" scoped>
    .resource-table{
       
        th,td{
            &.text-left{
                padding-left: 10px;
                text-align: left; 
                i{
                    font-size: 16px;
                    cursor: pointer;
                }  
            }
            &.text-left-2{
                padding-left: 50px;
                text-align: left;  
                i{
                    font-size: 16px;
                }   
            }
            &.text-left-3{
                padding-left: 100px;
                text-align: left;   
            }
            i{
                font-size: 24px;
            }
        }
        tr{
            td.text-left{
                text-align:left;
            }
        }

        .second-menu,
        .last-menu{
            display: none;
        }
    }

    .role-adminModal{
        .el-input{
            width: 270px;
            float:right;
            margin-top: 5px;
        }
    }
</style>

<style lang="scss">
     .role-adminModal{
        .modal-container{
            padding: 20px;
        }
        .el-form-item{
            margin-right: 0;
        }
     }
</style>




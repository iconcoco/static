<template>
    <Block :title="`${modifyType=='info'?'修改资料':'修改密码'}`" class="fadeIn">
        <el-form :model="form" :inline="true" class="person-modify-form" v-if="modifyType=='info'">
           <el-form-item label="真实姓名：" name="userName">
                <el-input v-model="form.userName" name="userName" @blur="bindIptblur('userName')" placeholder="请输入真实姓名"></el-input>
            </el-form-item>
            <!-- <br/>
             <el-form-item label="用户名：" name="userCode">
                <el-input v-model="form.userCode" name="userCode" placeholder="请输入用户名"></el-input>
            </el-form-item> -->
            <br/>
             <el-form-item label="手机号码：" name="phone">
                <el-input  v-model="form.phone" name="phone" @blur="bindIptblur('phone')" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <br/>
             <el-form-item label="邮箱：" name="email">
                <el-input  v-model="form.email" name="email" @blur="bindIptblur('email')" placeholder="请输入邮箱地址"></el-input>
            </el-form-item>
            <br/>

        </el-form>

        <el-form :model="phoneForm" :inline="true" class="person-modify-form" v-if="modifyType=='phone'">
           <el-form-item label="原密码：" name="oldPassword">
                <el-input v-model="phoneForm.oldPassword" name="oldPassword" @blur="bindIptblur('oldPassword')" placeholder="请输入原密码"></el-input>
            </el-form-item>
            <br/>
             <el-form-item label="新密码：" name="password">
                <el-input type="password" v-model="phoneForm.newPassword" name="password" @blur="bindIptblur('newPassword')" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <br/>
             <el-form-item label="确认新密码：" name="confirmpsw">
                <el-input type="password"  v-model="phoneForm.confirmpsw" name="confirmpsw" @blur="bindIptblur('confirmpsw')" placeholder="请输入确认密码"></el-input>
            </el-form-item>
            <br/>
            
        </el-form>

        <el-button @click="bindToSubmit" type="primary">修改</el-button>
        <el-button @click="bindReturn" type="primary" plain>返回</el-button>
    </Block>
</template>

<script>
import VERIFICATION from '../../../utils/verfication.js';
import { updateSelfInfo,updateSelfPwd} from '../../../utils/axios/api.js';

export default {
    props:['modifyType','data'],
    data(){
        return {
            form:{
                userName:'',
                phone:'',
                email:'',
            },
            phoneForm:{
                oldPassword:'',
                newPassword:'',
                confirmpsw:'',
            },
        }
    },
    created(){
        for (const key in this.form) {
            this.form[key] = this.data[key];
        }
    },
    methods:{
        bindToSubmit(){
            let f = this.modifyType=='info' ? this.form : this.phoneForm;
            let flag = true;

            for (const key in f) {
                if(!this.bindIptblur(key)) flag = false;
            }

            if(!flag) return;

            let FN = this.modifyType=='info' ? updateSelfInfo : updateSelfPwd;

            FN(f).then(res=>{
                if(res.code==0){
                    this.$message.success(`修改成功！`);

                    this.$emit('changeStatus',{
                        status:false,
                        reflesh:true
                    });
                    
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        bindReturn(){
            this.$emit('changeStatus',false)
        },
        bindIptblur(name){
            let f = this.modifyType=='info' ? this.form : this.phoneForm;
            let key = null;
            key = name=='newPassword' ? 'password': name;
            return VERIFICATION(key,f[name]);
        },
    }
}
</script>

<style lang="scss">
.person-modify-form{
    .el-form-item__label{
        min-width: 100px;
        text-align: right;
    }
}

</style>

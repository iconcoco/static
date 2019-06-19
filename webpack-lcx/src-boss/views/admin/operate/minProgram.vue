<template>
    <div class="fadeIn">
        <Block
            title="抽奖小程序"
        >

            <el-form :model="form" :inline="true">
                <el-form-item label="手机号码：">
                    <el-input v-model="form.userInfo" placeholder="请输入客户ID"></el-input>
                </el-form-item>

                <el-form-item label="是否CaresPAY客户：">
                    <el-select v-model="form.caresPayUser" placeholder="请选择客户类型">
                        <el-option value="" label="全部"></el-option>
                        <el-option value="N" label="否"></el-option>
                        <el-option value="Y" label="是"></el-option>
                    </el-select>
                </el-form-item>

                <el-button type="primary" @click="bindSearch">查询</el-button>
                <el-button type="primary" plain @click="reset">重置</el-button>

                <p>
                    <el-button type="danger" @click="bindCloseActivity" plain>关闭抽奖</el-button>
                </p>
            </el-form>

            <el-table :data="table" border>
                <el-table-column label="手机号码" prop="userInfo"></el-table-column>
                <el-table-column label="奖项名称" prop="prizeName"></el-table-column>
                <el-table-column label="中奖时间" prop="receiveTime">
                    <template slot-scope="scope">{{format(scope.row.receiveTime)}}</template>
                </el-table-column>
                <el-table-column label="是否CaresPAY客户" prop="caresPayUser"></el-table-column>
            </el-table>
        </Block>
    </div>
</template>

<script>
import {queryRecordList,closeActivity} from './../../../utils/axios/api.js';

import { formatTimer } from '../../../utils/common.js';

 import mixin from '../../../ext/mixin.js';

export default {
    mixins:[mixin()],
    data(){
        return {
            form:{
                userInfo:'',
                caresPayUser:'',
            },
            tableData:[],
            table:[],
        }
    },
    methods:{
        __LOADING(){
            this.LoadingQuery();
        },
        reset(){
            for (const key in this.form) {
                this.form[key] = "";
            }
        },
        bindSearch(){
            this.table = [];

            if(!this.form.userInfo && !this.form.caresPayUser){
                this.table = this.tableData 
            }else{

                let Arr = [];

                this.tableData.forEach(item=>{
                    if(this.form.userInfo && this.form.caresPayUser){
                        (item.userInfo == this.form.userInfo && item.caresPayUser == this.form.caresPayUser ) && (Arr.push(item));
                    }else{
                        this.form.userInfo && (this.form.userInfo == item.userInfo) && (Arr.push(item));
                        this.form.caresPayUser && (this.form.caresPayUser == item.caresPayUser) && (Arr.push(item));
                    }
                });

                this.table = Arr;
            };
            
        },
        LoadingQuery(){
            queryRecordList().then(res=>{
                if(res.code==0){
                    this.tableData = res.data;
                    this.table = res.data;
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        
        bindCloseActivity(){
            this.$confirm('是否确认关闭抽奖？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                //关闭活动
                closeActivity().then(res=>{
                    if(res.code==0){
                         this.$message.success('修改成功!');
                    }else{
                        this.$message.error(res.msg);
                    }
                });
            }).catch(() => {});
        },
        format(code){
            return formatTimer(code);
        }
    },
}
</script>

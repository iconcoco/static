<template>
    <div class="fadeIn">
        <Block title="新增客户信息">
            <el-form :model="form" class="admin-form-inline" :inline="true">
                <div class="block">
                    <h4 class="primary">基本信息</h4>
                    <el-form-item label="姓名：">
                        <el-input v-model="form.name" placeholder="请输入客户姓名"></el-input>
                    </el-form-item>

                    <el-form-item label="手机：">
                        <el-input v-model="form.phone" placeholder="请输入客户手机"></el-input>
                    </el-form-item>

                    <el-form-item label="微信号：">
                        <el-input v-model="form.wechatNo" placeholder="请输入客户微信号"></el-input>
                    </el-form-item>

                    <el-form-item label="职位：">
                        <el-input v-model="form.place" placeholder="请输入客户职位"></el-input>
                    </el-form-item>
                </div>

                <div class="block">
                    <h4 class="primary">公司信息</h4>
                     <el-form-item label="公司名称：">
                        <el-input v-model="form.company" placeholder="请输入公司名称"></el-input>
                    </el-form-item>

                     <el-form-item label="经营范围：">
                        <el-input v-model="form.businessScope" placeholder="请输入经营范围"></el-input>
                        <!-- <el-select v-model="form.businessScope" placeholder="请选择月交易额">
                            <el-option v-for="(item,index) in category" :key="index"
                                :label="item.productName"
                                :value="item.productName"
                            ></el-option>
                        </el-select> -->
                    </el-form-item>
                    
                     <el-form-item label="月交易额度：">
                        <el-select v-model="form.amountScope" placeholder="请选择月交易额">
                            <el-option v-for="(item,index) in salesVolume" :key="index"
                                :label="item.saleName"
                                :value="item.saleCode"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                        <!-- businessChannel -->
                     <el-form-item label="经营渠道：" class="widthAuto">
                        <el-checkbox-group v-model="form.businessChannel">
                            <el-checkbox v-for="(item,index) in channelData" :key="index" 
                            :label="item.key">{{item.value}}</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <br/>
                    <!-- payType -->
                     <el-form-item label="现有收款方式：" class="widthAuto">
                         <el-checkbox-group v-model="form.payType">
                            <el-checkbox v-for="(item,index) in payTypelData" :key="index" 
                            :label="item.key">{{item.value}}</el-checkbox>
                         </el-checkbox-group>
                    </el-form-item>
                </div>

                <div class="block">
                    <h4 class="primary">跟进信息</h4>
                    <el-form-item label="客户状态：">
                        <el-select v-model="form.status" placeholder="请选择客户状态">
                            <el-option v-for="(item,index) in customerStatusData"
                                :key="index"
                                :value="item.key"
                                :label="item.value"
                                v-if="item.key != 1"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="跟进记录：" class="widthAuto">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8}"
                            placeholder="请输入内容"
                            v-model="form.content">
                        </el-input>
                    </el-form-item>
                    <br/>
                    <el-form-item label="备注：" class="widthAuto remark">
                        <el-input
                            type="textarea"
                            :autosize="{ minRows: 4, maxRows: 8}"
                            placeholder="请输入内容"
                            v-model="form.remark">
                        </el-input>
                    </el-form-item>
                </div>
              
                <div class="btn">
                    <el-button type="danger" plain @click="cancel">取消</el-button>
                    <el-button type="primary" @click="bindToSaveData">保存</el-button>
                </div>
            </el-form>
        </Block>
    </div>
</template>

<script>

import { 
    addCustomer,
    getDictionary
} from './../../../utils/axios/api.js';

import { 
    salesVolume,
    category,
    queryCustomerStatus
} from './../../../ext/localBase.js';



export default {
    data(){
        return{
            form:{
                name:'',
                phone:'',
                wechatNo:'',
                place:'',
                company:'',
                businessScope:'',
                amountScope:'',
                businessChannel:[],
                payType:[],
                status:'',
                remark:'',
                content:'',
            },

            ING:false,

            salesVolume:salesVolume,
            category:category,
            channelData:[],
            payTypelData:[],
            customerStatusData:[],
        }
    },
    created(){
        
        Promise.all([
            getDictionary({type:3}),
            getDictionary({type:4}),
            queryCustomerStatus(),
        ]).then(([a,b,c])=>{
            a.code==0 &&( this.channelData=a.data );
            b.code==0 &&( this.payTypelData=b.data );
            this.customerStatusData = c ;
        });
    },
    methods:{
        cancel(){
            history.back(-1);
        },
        bindToSaveData(){
            let must = ["name","phone"]
            // "place","company","wechatNo"];

            for (let index = 0; index < must.length; index++) {
                const name = must[index];
                if(!this.form[name]){
                    let msg = null;
                    switch(name){
                        case 'name':{ msg='请输入客户姓名' }break;
                        // case 'company':{ msg='请输入公司名称' }break;
                        // case 'place':{ msg='请输入客户职位' }break;
                        case 'phone':{ msg='请输入客户手机号码' }break;
                        // case 'wechatNo':{ msg='请输入客户微信号' }break;
                    }
                    return this.$message.warning(msg);
                }
            };

            let data = Object.assign({},this.form);
            data.businessChannel = data.businessChannel.join(",");
            data.payType = data.payType.join(",");

            if(this.ING) return;
            this.ING = true;

           addCustomer(data).then(res=>{
               this.ING = false;

               if(res.code==0){
                    this.$message.success(`添加成功!`);
                    this.$router.push({
                        name:"Reflesh",
                        params:{ name:'followUpCustomer' }
                    });
               }else{
                   this.$message.error(res.msg);
               }
           });
        }
    }
}
</script>


<style lang="scss" scoped>
.block{
    border-bottom: 1px solid #e5e5e5;
    h4{
        font-size: 14px;
        color: #333;
        padding: 15px 0;
    }
    .el-checkbox{
        margin-left: 0px;
        margin-right: 10px;
    }
    .el-textarea{
        width: 800px;
    }
}

.btn{
    text-align: center;
    margin-top: 20px;
    padding-bottom: 20px;
    .el-button{
        width: 80px;
    }
}
</style>

<style lang="scss">
    .admin-form-inline .remark .el-form-item__label{
        width:82px;
    }
</style>

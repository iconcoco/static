<template>
    <div class="fadeIn">
        <Block title="新增待申报记录">
            <table class="var-report-add">
                <thead>
                    <tr>
                        <th>VAT号码</th>
                        <th class="per20">公司名称</th>
                        <th>申报月份</th>
                        <th>申报截止时间</th>
                        <th>申报状态</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="!declarations.length">
                        <td colspan="6">点击下方按钮添加一条记录</td>
                    </tr>
                    <tr v-for="(item,index) in declarations" :key="index">
                        <td>
                            <el-input @blur="inputOnBlur('taxNo',index)" v-model="item.taxNo" placeholder="请输入VAT号码"></el-input>
                        </td>
                        <td>
                            {{item.companyName}}
                        </td>
                        <td>
                            <el-date-picker
                            :clearable="false"
                            v-model="item.startTime"
                            type="month"
                            value-format="yyyy-MM-dd"
                            placeholder="起始月份">
                            </el-date-picker>
                                至
                            <el-date-picker
                            :clearable="false"
                            v-model="item.endTime"
                            type="month"
                            value-format="yyyy-MM-dd"
                            placeholder="结束月份">
                            </el-date-picker>
                        </td>
                        <td>
                            <el-date-picker
                            :clearable="false"
                            v-model="item.deadlineTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            placeholder="选择申报截止时间">
                            </el-date-picker>
                        </td>
                        <td>
                            申报数据待上传
                        </td>
                        <td>
                            <ElButton type="danger" @click="deleteOne(index)">
                                <!-- <span class="el-icon-minus"></span> -->
                                Del
                            </ElButton>
                        </td>
                    </tr>
                </tbody>
             </table>
            <p class="addOne">
                <ElButton type="primary" @click="addonetoreport">
                    <span class="el-icon-plus"></span>
                </ElButton>
            </p>
            <p class="addOne">
                <ElButton type="primary" @click="bindToApply">提交保存</ElButton>
                <ElButton type="danger" @click="cancle">取消</ElButton>
            </p>
        </Block>
    </div>
</template>

<script>
import { 
    findByCustomerAndNumer,
    declarationApply
 } from './../../../utils/axios/api.js';
export default {
    data(){
        return{
            declarations:[
                {
                    companyName:'',
                    taxNo:'',
                    customerNo:'',
                    recordId:'',
                    startTime:'',
                    endTime:'',
                    countryCode:'',
                    deadlineTime:'',
                }
            ],
        }
    },
    methods:{
        bindToApply(){
            if(!this.declarations.length) return ;

            for (let index = 0; index < this.declarations.length; index++) {
                const ITEM = this.declarations[index];
                for (const key in ITEM) {
                    let must = ['taxNo','startTime','endTime','deadlineTime'];
                    if(must.includes(key)){
                        let msg;
                        switch(key){
                            case 'taxNo':{ msg='请输入VAT号码'; }break;
                            case 'startTime':{ msg='请选择起始月份'; }break;
                            case 'endTime':{ msg='请选择结束月份'; }break;
                            case 'deadlineTime':{ msg='请选择申报截止时间'; }break;
                        }
                        if(!ITEM[key]) return this.$message.warning(msg);
                    }
                }
            };

            declarationApply(this.declarations).then(res=>{
                if(res.code==0){
                    this.$message.success(`添加成功！`);
                    this.$router.push({name:'vatReporting'});
                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        inputOnBlur(attr,index){
            let number = this.declarations[index][attr];

            if(!number) return this.$message.warning('不能为空')

            findByCustomerAndNumer({number}).then(res=>{
                if(res.code==0){

                    this.declarations[index].customerNo = res.data ? res.data.customerNo : "";
                    this.declarations[index].recordId = res.data ? res.data.id : "";
                    this.declarations[index].companyName = res.data ? res.data.dutyCompany : "";
                    this.declarations[index].countryCode = res.data ? res.data.declaredCountry : "";
                    this.declarations[index].taxNo = res.data ? number : "";

                    !res.data &&  this.$message.warning('系统匹配无此VAT号码，请确认后重试')

                }else{
                    this.$message.error(res.msg);
                }
            });
        },
        addonetoreport(){
            this.declarations.push({
                companyName:'',
                taxNo:'',
                customerNo:'',
                recordId:'',
                startTime:'',
                endTime:'',
                countryCode:'',
                deadlineTime:'',
            })
        },
        deleteOne(val){
            this.declarations.splice(val,1);
        },
        cancle(){
            if(!this.declarations.length) return this.$router.push({name:'vatReporting'});

            this.$confirm('确定是否取消保存','提示').then(()=>{
                this.$router.push({name:'vatReporting'});
            }).catch(()=>{})
        }
    }
}
</script>

<style lang="scss" scoped>
@import './../../../css/element-variables.scss';
.addOne{
    text-align: center;
    margin-bottom: 10px;
}
table{
    td{
        padding: 0 10px;
    }
}
</style>

<style lang="scss">
.var-report-add{
    .el-date-editor.el-date-editor--month{
        width:120px;
    }
}
</style>

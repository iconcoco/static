<template>
 <transition name="fade">
    <div>
        <div class="table-container">

            <h2>渠道选择</h2>

            <el-form :model="form">
              <el-form-item label="A类渠道：">
                    <el-tooltip effect="dark" content="指以 人民币 提现到 中国大陆地区银行账户 的渠道" placement="top-start">
                        <span class="el-icon-question"></span>
                    </el-tooltip>

                    <el-select v-model="form.aChannelCode" placeholder="请选择">
                        <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                    <el-button type="primary" @click="bindChangeChannel('aChannelCode')">修改</el-button>
              </el-form-item>

              <el-form-item label="B类渠道：">
                    <el-tooltip effect="dark" content="指以 人民币或外币 提现到 中国大陆地区银行账户 的渠道" placement="top-start">
                        <span class="el-icon-question"></span>
                    </el-tooltip>

                    <el-select v-model="form.bChannelCode" placeholder="请选择">
                        <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                    <el-button type="primary" @click="bindChangeChannel('bChannelCode')">修改</el-button>
              </el-form-item>

              <el-form-item label="C类渠道：">
                   <el-tooltip effect="dark" content="指以 本币 提现到 香港地区的银行账户 的渠道" placement="top-start">
                        <span class="el-icon-question"></span>
                    </el-tooltip>

                    <el-select v-model="form.cChannelCode" placeholder="请选择">
                        <el-option v-for="(item,index) in  ChannelArr" :key="index"
                            :label="item.channelName"
                            :value="item.channelCode"
                        ></el-option>
                    </el-select>
                    <el-button type="primary" @click="bindChangeChannel('cChannelCode')">修改</el-button>
              </el-form-item>
            </el-form>
        </div>
    </div>
 </transition>
</template>

<script>

  import { queryChannel } from '../../../ext/localBase.js';
  import { switchChannel } from '../../../utils/axios/api.js'

    export default{
        data(){
            return{
                form:{
                    aChannelCode:'',
                    bChannelCode:'',
                    cChannelCode:'',
                },
                ChannelArr:[]
            }
        },
        created(){
            queryChannel().then(res=>{
                this.ChannelArr = res;
            });
        },
        methods:{
            bindChangeChannel(name){

                if(!this.form[name]) return this.$message.warning(`请选择渠道`);

                let ajaxData = {
                     opt:'switch'
                };

                ajaxData[name] = this.form[name];
                //请求切换
                switchChannel(ajaxData).then(res=>{
                    if(res.code==0){ 
                        this.$message.success(`修改成功！`) 
                    }else{
                        this.$message.success(res.msg);
                    }
                }); 
            }
        }
    }
</script>

<style lang="scss" scoped>
    h2{
        width: 500px;
        margin: 0 auto;
        font-size: 24px;
        margin-bottom: 20px;
        color: #666;
    }
    form{
        width: 500px;
        margin: 0 auto;
          .el-form-item  span{
                position: absolute;
                left: -20px;
                top: 12px;
                color: #fbb03b;
            }
    }
</style>


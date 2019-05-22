<template>
    <div class="fadeIn">
        <div>
            <h2 class="banner-module-title">申请注册VAT税号</h2>
            <ul class="vat-apply-step">
                <li>
                    <img src="./../../../../images/carepay/vat/step1.png" alt="vat">
                    <p><span>申请注册</span></p>
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/vatArrow.png" alt="箭头">
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/step2.png" alt="vat">
                    <p><span>支付服务费</span></p>
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/vatArrow.png" alt="箭头">
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/step3.png" alt="vat">
                    <p><span>资料审核</span></p>
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/vatArrow.png" alt="箭头">
                </li>
                <li>
                    <img src="./../../../../images/carepay/vat/step4.png" alt="vat">
                    <p><span>收到VAT税号</span></p>
                </li>
            </ul>
            <h3  class="cares-color">您的一站式税务解决方案</h3>
            <div class="vat-plan">
                <ul>
                    <li>VAT服务由CaresPAY推出的欧洲VAT税务一站式解决方案。</li>
                    <li>通过CaresPAY VAT服务，您无需提供繁琐的资料，CaresPAY为您提供从税号申请，合规报税，店铺余额缴纳VAT税费的全流程服务，助您更高效的完成欧洲税务事宜。</li>
                </ul>
            </div>
             <h3  class="cares-color">CaresPAY VAT，助力您的税务合规</h3>
             <ul class="vat-compliance">
                 <li>
                     <img src="./../../../../images/carepay/vat/compliance1.png" alt="合规">
                     <h5>更安全</h5>
                     <p>国际高标准合规保障安全</p>
                 </li>
                 <li>
                     <img src="./../../../../images/carepay/vat/compliance2.png" alt="合规">
                     <h5>更贴心</h5>
                     <p>专业客服全程跟进</p>
                 </li>
                 <li>
                     <img src="./../../../../images/carepay/vat/compliance3.png" alt="合规">
                     <h5>更便捷</h5>
                     <p>注册、报税、缴税全流程一站式解决</p>
                 </li>
             </ul>
            <p class="btn-block">
                <span class="cares-button-primary" @click="jumpToComponent('VATapply')">立即申请</span>
            </p>
        </div>

        <div class="QA-block">
            <h3 class="cares-color">常见问题</h3>
            <div class="clearfix">
                <ul class="fl">
                    <li>
                        <p> <span class="QA"></span> 什么是VAT？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>VAT全称Value Added Tax， 也就是增值税，是欧盟国家普遍使用的售后增值税。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>为什么要注册VAT税号？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>2016年9月1日, 英国税务局规定amazon和eBay卖家必须要征收VAT，否则amazon和eBay平台可能会移除卖家销售权，影响到店铺正常运营。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>怎样提交注册资料？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>申请注册页面，提交注册资料即可。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>为什么需要支付服务费？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>您的注册和报税申请，将由专业的第三方机构进行办理，并提供专属服务人员全程为您提供帮助，所以需要支付一定的服务费。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>注册VAT税号需要哪些资料？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>
                            <dl>
                                <dt>1.公司信息</dt>
                                <dd>公司中文名称</dd>
                                <dd>机构性质（个体经营合营公司或是有限公司）</dd>
                                <dd>公司英文名称</dd>
                                <dd>公司或者个体经营注册地址(中文)</dd>
                                <dd>公司或者个体经营注册地址(英文)</dd>
                                <dd>申请人联系电话</dd>
                                <dd>申请人电子邮件</dd>
                                <dd>公司成立日期</dd>
                                <dd>开始营业日期(以第一单销售为准)</dd>
                                <dd>公司(个人)店铺主要经营范围</dd>
                                <dd>主要销售平台</dd>
                                <dd>未来12个月销售额</dd>
                                <dd>已注册的其他国家VAT</dd>
                                <dd>是否有中国自发货仓储</dd>
                                <dd>是否使用自己公司VAT号码清关</dd>
                                <dd>是否目前需要申请低税率</dd>
                                <dd>低税率起始时间 *</dd>
                                <dd>您希望VAT的注册时间</dd>
                            </dl>

                            <dl>
                                <dt>2.法人信息</dt>
                                <dd>法人/个人代表中文名</dd>
                                <dd>法人/个人代表拼音名</dd>
                                <dd>法人/个人代表出生日期</dd>
                                <dd>法人/个人身份证号码</dd>
                            </dl>

                            <dl>
                                <dt>3.所需要提供的PDF文件</dt>
                                <dd>个体或公司法人身份证签名复印件</dd>
                                <dd>个体或公司营业执照签名复印件</dd>
                                <dd>有效法人地址证明复印件请提供含法人名字和地址的银行流水单/税单/水电煤气单任意一份</dd>
                                <dd>销售平台后台截图</dd>
                                <dd>法人任意两项签名复印件  (护照、户口本(本人页)、驾驶证、结婚证、未婚证、出生证明、房产证、房屋租赁合同)</dd>
                                <dd>HMRC 64-8 表格签字</dd>
                            </dl>

                            <dl>
                                <dt>4.其他提示</dt>
                                <dd>在注册过程中，英国税务局可能会要求提供额外的资料文件。提交额外资料文件可能会延长申请时间。但是我们会随时为你更新进度。</dd>
                                <dd>请确认注册公司名称,需要与注册平台如果亚马逊，eBay平台使用的公司名称一致。</dd>
                            </dl>
                        </div>
                    </li>
                </ul>
                <ul class="fr">
                    <li>
                        <p><span class="QA"></span>注册VAT税号需要多久时间？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>根据不同国家税务局处理时效不同，一般在全部资料提交后2-6周。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>报税的申报周期是多少？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>不同国家的申报周期不同，英国vat申报周期为三个月，德国vat申报周期为一年13次。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>申报税率是多少？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>每个国家有不同税率标准：目前英国分为20%、5%、0%；德国19%；法国20%。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>注册后没有销售额，是否需要申报？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>申请注册VAT下来后，即便没销售额，也需要每季度定期做税务申报。</div>
                    </li>
                    <li>
                        <p><span class="QA"></span>申报后，可以不缴税吗？ <i class="el-icon-arrow-down cares-color"></i></p>
                        <div>若申报后需要缴纳一定税费，请务必在规定时间内交税完毕，若延迟交税，会计算延期利息， HMRC将出示法庭信件通知，后果严重的会对该纳税人进行起诉。</div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>


<script>

import $ from 'jquery';

const DOMEVENT = {
    init:function(){
        this.events.QA();
    },
    events:{
        QA:function(){
            $('.QA-block li p').click(function(){

                !$(this).hasClass('active') ?(
                    $(this).addClass('active').siblings('div').slideDown(300)
                ):(
                    $(this).removeClass('active').siblings('div').slideUp(300)
                )
            });
        }
    }
}

export default {
    mounted(){
        DOMEVENT.init();
    },
    methods:{
        jumpToComponent(name){
            this.$router.push({name})
        }
    }
}
</script>

<style lang="scss" scoped>
.vat-apply-step{
    height: 194px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    li{
        flex: 1;
        text-align: center;
        color: #333;
    }
}

.vat-compliance{
    height: 190px;
    display:flex;
    justify-content: space-around;
    align-items: center;
    li{
        flex: 1;
        text-align: center;
        color: #333;
        h5{
            font-size: 24px;
            margin: 13px 0;
        }
        p{
            font-size: 16px;
        }
    }
}

.vat-plan{
    height: 480px;
    background: url(./../../../../images/carepay/vat/vatPlan.png) no-repeat center center;
    ul{
        width: 680px;
        padding: 40px 0 0 100px;
        li{
            margin-bottom: 20px;
            line-height: 24px;
            font-size: 15px;
            color: #333;
        }
    }
}

.btn-block{
    height: 136px;
    line-height: 136px;
    text-align: center;
    .cares-button-primary{
        min-width:150px;
        height:40px;
        border-radius: 20px;
        line-height:40px;
        font-size: 16px;
    }
}

h3{
    line-height: 110px;
    text-align: center;
    font-size: 24px;
    letter-spacing: 1px;
}

.QA-block{
    margin-top: 10px;
    padding-bottom: 20px;
    ul{
        width: 50%;
        padding:0 10px;
        li{
            font-size: 14px;
            margin-bottom: 15px;
            >div{
                background-color: #FDF0E5;
                font-size: 12px;
                color: #999;
                line-height: 20px;
                margin: 10px 0;
                padding: 10px;
                display: none;
            }
        }
        p{
            cursor: pointer;
            &:hover{
                color: #000;
                font-weight: bold;
            }
            >i{
                float: right;
                margin: 7px;
                font-weight: bold;
                transition: all .3s;
            }
            &.active{
                i{
                    transform: rotate(180deg);
                }
            }
        }
    }

    .QA{
        display: inline-block;
        width: 34px;
        height: 28px;
        background: url(./../../../../images/carepay/vat/QA.png) no-repeat center center;
        vertical-align: middle;
        margin-right: 10px;
    }

    dl{
        margin-bottom: 20px;
    }
}
</style>

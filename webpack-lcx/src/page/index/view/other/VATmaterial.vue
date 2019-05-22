<template>
    <div class="vat-container">
        <div class="content">
            <p class="handle-btn">
                <!-- <span>下载文档</span> -->
                <a :href="DOMAIN.carespay" class="cares-color">返回CaresPAY</a>
            </p>
            <h2 class="banner-module-title">
                VAT注册资料清单
                <span class="cares-logo fr"></span>
            </h2>
            <p class="second-title">
                <template v-if="NT=='GB'">
                    UK Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='DE'">
                    DE Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='FR'">
                    FR Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='IT'">
                    IT Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='ES'">
                    ES Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='CZ'">
                    CZ Registration requirement (EU & Non EU Business)
                </template>
                <template v-if="NT=='PL'">
                    PL Registration requirement (EU & Non EU Business)
                </template>
            </p>
            <p class="second-title">
                <template v-if="NT=='GB'">
                    英国VAT登记所需资料清单
                </template>
                <template v-if="NT=='DE'">
                    德国VAT登记所需资料清单
                </template>
                <template v-if="NT=='FR'">
                    法国VAT登记所需资料清单
                </template>
                <template v-if="NT=='IT'">
                    意大利VAT登记所需资料清单
                </template>
                <template v-if="NT=='ES'">
                    西班牙VAT登记所需资料清单
                </template>
                <template v-if="NT=='CZ'">
                    捷克VAT登记所需资料清单
                </template>
                <template v-if="NT=='PL'">
                    波兰VAT登记所需资料清单
                </template>
            </p>

            <div class="instructions">
                 <template v-if="NT=='GB'">
                    <p>【填表前重要说明，请务必关注】</p>
                    <p>1.填写内容须中英文对照，并确保提供信息准确无误</p>
                    <p>2.英国税局税号申请完成后，申请人会收到相应邮件通知，如需用此VAT税号发货，一定要确保此税号对应的EORI号已经生效。只有EORI号生效，才可以发货，否则货物到达目的国后将因没有有效的EORI号而无法清关！</p>
                    <p>英国EORI号格式：GB+税号+000，EORI号是否生效查询网址：http://ec.europa.eu/taxation_customs/dds2/eos/eori_validation.jsp?Lang=en</p>
                    <p>3 请真实准确的填写如下信息，如因信息有误造成的损失及费用，由客户自行承担。</p>
                </template>
                 <template v-if="['DE','FR','IT','ES','CZ','PL'].includes(NT)">
                    <p>【填表前重要说明，请务必关注】</p>
                    <p>1.公司名称和公司地址必须与亚马逊后台保持一致</p>
                    <p>2.填写内容须中英文对照，并确保提供信息准确无误</p>
                    <p>3 请真实准确的填写如下信息，如因信息有误造成的损失及费用，由客户自行承担。</p>
                </template>
            </div>

            <dl>
                <dt>1.公司基本信息</dt>
                 <template v-if="NT=='GB'">
                    <dd>1.1 公司名称 （必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.2 营业地址 （必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.3 公司统一社会信用代码（营业执照上的信用代码）</dd>
                    <dd>1.4 公司成立日期（营业执照上的日期,按如下格式填写:日/月/年. 如:01/09/2018）</dd>
                    <dd>1.5 在英销售商品名称 （中英文，按实际描述，可参考销售平台类似名称填写）</dd>
                    <dd>1.6 预计未来一年的销售总额（英镑 ）（按预计填写，通常几万到几十万均合理，不影响未来实际销售金额. 如:10000）</dd>
                    <dd>1.7 店铺信息链接（可从销售平台导出，导出方法可以资料收集人员索取）</dd>
                 </template>
                 <template v-if="NT=='DE'">
                     <dd>1.1 公司类型（个体经营、合营公司、有限公司，三选一） </dd>
                     <dd>1.2 公司名称（中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                     <dd>1.3 营业地址（中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制，为了加快申请效率，请做以下修改：1.邮编写在城市，或是省份的前面 ；2.CN 改为 VR China"）</dd>
                     <dd>1.4 公司电话</dd>
                     <dd>1.5 公司的电子邮件</dd>
                     <dd>1.6 公司成立时间</dd>
                     <dd>1.7 公司注册资本____RMB</dd>
                     <dd>1.8 店铺信息链接（可从销售平台导出，导出方法可以资料收集人员索取）</dd>
                     <dd>1.9 德国站点店铺名字</dd>
                     <dd>1.10 销售的物品名称、所属品类  </dd>
                     <dd>1.11 在德国或是其他欧盟国家（包括英国）有仓储吗？有的话，请列出仓储地点 </dd>
                     <dd>1.12 是否其他欧盟国家（包括英国）发到德国的订单年销售额超过10万欧元 </dd>
                     <dd>1.13 在VAT注册后一年后的预估销售额_________欧元，第二年预估销售额__________欧元</dd>
                     <dd>1.14 是否有欧盟国家（包括英国）VAT号码，有的话请列出</dd>
                     <dd>1.15 EORI number欧盟经济运营商注册识别号（进口号）（必填）</dd>
                     <dd class="txtIndent">1. 如果已经获得EORI号，或者正在申请其他国家EORI号码，则填写：No need to apply for EORI number 不需要申请EORI号码</dd>
                     <dd class="txtIndent">2. 如需申请EORI号码，请填写：需要申请EORI号码" </dd>
                 </template>
                 <template v-if="['FR','CZ','PL'].includes(NT)">
                     <dd>1.1 公司名称/Name of the company（中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                     <dd>1.2 公司类型/Type of Company: i.e. Ltd, partnership</dd>
                     <dd>1.3 经营模式/Type of business：i.e. Amazon or eBay</dd>
                     <dd>1.4 商品类型/Type of products：</dd>
                     <dd>1.5 公司经营地址/Business address (中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制): </dd>
                     <dd>1.6 公司注册日期/Date of incorporation:</dd>
                     <dd>1.7 营业执照号码/Company registration No.:</dd>
                     <dd>1.8 公司银行名称，账号名字，银行账号，IBAN, SWIFT, 银行地址，银行账户授权（如果账户名称不一样 ）</dd>
                     <dd class="txtIndent">Bank name: </dd>
                     <dd class="txtIndent">Account name:  </dd>
                     <dd class="txtIndent">Account number: </dd>
                     <dd class="txtIndent">IBAN number:  </dd>
                     <dd class="txtIndent">BIC/ SWIFT: </dd>
                     <dd class="txtIndent">Bank Address: </dd>
                     <dd>1.9 法国站点亚马逊店铺链接/ French VAT registration require Amazon shop link：</dd>
                     <dd>1.10 在VAT注册后一年后的预估销售额_________欧元，第二年预估销售额_________欧元。</dd>
                     <dd>1.11 是否有欧盟国家（包括英国）VAT号码，有的话请列出</dd>
                     <dd>1.12 EORI number欧盟经济运营商注册识别号（进口号）（必填）</dd>
                     <dd class="txtIndent">1. 如果已经获得EORI号，或者正在申请其他国家EORI号码，则填写：No need to apply for EORI number 不需要申请EORI号码</dd>
                     <dd class="txtIndent">2. 如需申请EORI号码，请填写：需要申请EORI号码" </dd>
                 </template>
                 <template v-if="NT=='IT'">
                    <dd>1.1 公司名称/Name of the company （中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.2 营业地址/Address of The Company （中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.3 公司业务简述/Brief business activity description</dd>
                    <dd>1.4 店铺信息链接/Shop Link（可从销售平台导出，导出方法可以资料收集人员索取）</dd>
                    <dd>1.5 意大利站点店铺名字</dd>
                    <dd>1.6 销售的物品名称、所属品类</dd>
                    <dd>1.7 在VAT注册后一年后的预估销售额_______欧元，第二年预估销售额_______欧元</dd>
                    <dd>1.8 是否有欧盟国家（包括英国）VAT号码，有的话请列出</dd>
                    <dd>1.9 EORI number欧盟经济运营商注册识别号（进口号）（必填）</dd>
                     <dd class="txtIndent">1. 如果已经获得EORI号，或者正在申请其他国家EORI号码，则填写：No need to apply for EORI number 不需要申请EORI号码</dd>
                     <dd class="txtIndent">2. 如需申请EORI号码，请填写：需要申请EORI号码" </dd>
                 </template>
                 <template v-if="NT=='ES'">
                    <dd>1.1 公司名称/Name of the company （中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.2 营业地址/Address of The Company （中文+英文，英文地址必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.3 公司注册号/Company number identification （必须与亚马逊后台保持一致，请直接在亚马逊后台复制）</dd>
                    <dd>1.4 公司业务简述 /Brief business activity description：eg:利用互联网销售平台（Amazon,eBay…etc) 销售各种产品/Use (Amazon,eBay…etc) selling platform to sell all kinds of product.</dd>
                    <dd>1.5 店铺信息链接/Shop Link（可从销售平台导出，导出方法可以资料收集人员索取）</dd>
                    <dd>1.6 销售的物品名称、所属品类</dd>
                    <dd >1.7 西班牙本地银行账户信息</dd>
                    <dd class="txtIndent">如有，请填写账户持有人名称，开户银行，银行账号，货币，银行地址及邮编</dd>
                    <dd class="txtIndent">如有，请填写"无"</dd>
                    <dd>1.8 货物进口及配送流程（例如货物从哪国运送到哪国？是否经过其他欧盟国家？）/Flow of goods  (From where ... To where ... ) </dd>
                    <dd>1.9 是否使用西班牙任何仓库（包括亚马逊和其他仓库）？</dd>
                    <dd class="txtIndent">如有使用，请填写仓库类型（eg. Amazon warehouse)</dd>
                    <dd class="txtIndent">如未使用，请填写否</dd>
                    <dd>1.10 是否有开泛欧？</dd>
                    <dd class="txtIndent">请如实填写</dd>
                    <dd>1.11 在VAT注册后一年后的预估销售额________欧元，第二年预估销售额________欧元</dd>
                    <dd>1.12 是否有欧盟国家（包括英国）VAT号码，有的话请列出</dd>
                    <dd>1.13 EORI number欧盟经济运营商注册识别号（进口号）（必填）</dd>
                    <dd class="txtIndent">1. 如果已经获得EORI号，或者正在申请其他国家EORI号码，则填写：No need to apply for EORI number 不需要申请EORI号码</dd>
                     <dd class="txtIndent">2. 如需申请EORI号码，请填写：需要申请EORI号码" </dd>
                 </template>
            </dl>

            <dl>
                <dt>2.公司法人信息</dt>
                <template v-if="NT=='GB'">
                    <dd>2.1 法人姓名（写法人拼音名,名在前，姓在后,名和姓中间加一个空格.）：如:Feng Gao</dd>
                    <dd>2.2 法人出生日期 ( 按如下格式填写:日/月/年. 如:01/09/2018) </dd>
                    <dd>2.3 法人当前居住地址（ 实际现住地址的拼音）：如:Shenzhenshi Longhuaqu Longchengjiedao Longpingxilu Xiwudasha 2 Dong Yidanyuan 2 A</dd>
                    <dd>2.4 法人联系邮箱 ( 请填写有效的邮箱，后期会接收到英国税局相关重要邮件，请您特别关注此邮箱，收到邮件请与我们联系) </dd>
                    <dd>2.5 法人联系电话：( 请填写有效的电话 )</dd>
                </template>
                <template v-if="NT=='DE'">
                    <dd class="instructions">
                        <p>股东不只是一个人的情况下，请在下面添加补充上股东的名字、出生时间、电话、邮箱、身份证地址。如果股东是公司的话，请提供公司名、公司地址、成立时间、经营内容、信用代码。</p>
                    </dd>
                    <dd>2.1 法人姓名（写法人拼音名,名在前，姓在后,名和姓中间加一个空格.）：如:Feng Gao</dd>
                    <dd>2.2 法人当前居住地址（ 实际现住地址的拼音，请加上邮编）：如:Shenzhenshi Longhuaqu Longchengjiedao Longpingxilu Xiwudasha 2 Dong Yidanyuan 2 A</dd>
                    <dd>2.3 法人联系邮箱 ( 请填写有效的邮箱，后期会接收到德国税局相关重要邮件，请您特别关注此邮箱，收到邮件请与我们联系)</dd>
                    <dd>2.4 法人联系电话：( 请填写有效的电话 ) </dd>
                </template>
                <template v-if="['FR','CZ','PL'].includes(NT)">
                    <dd class="instructions">
                        <p>股东不只是一个人的情况下，请在下面添加补充上股东的名字、出生时间、电话、邮箱、身份证地址、掌股份额。</p>
                    </dd>
                    <dd>2.1 法人姓名</dd>
                    <dd>2.2 法人出生日期</dd>
                    <dd>2.3 法人护照或身份证号码</dd>
                    <dd>2.4 法人当前居住地址及地址证明（租房合同 、房屋贷款明细 、信用卡账单、煤气水费账单、房产证任选其一即可）</dd>
                    <dd>2.5 法人联系邮箱 ( 请填写有效的邮箱，后期会接收到法国税局相关重要邮件，请您特别关注此邮箱，收到邮件请与我们联系) </dd>
                    <dd>2.6 法人联系电话：( 请填写有效的电话 ) </dd>
                </template>
                <template v-if="NT=='IT'">
                    <dd>2.1 法人姓名/Name of legal rapresentative</dd>
                    <dd>2.2 法人出生国家和日期/Country and date of birth</dd>
                    <dd>2.3 法人身份证地址/Address on Id card（拼音）:Shenzhenshi Longhuaqu Longchengjiedao Longpingxilu Xiwudasha 2 Dong Yidanyuan 2A</dd>
                </template>
                <template v-if="NT=='ES'">
                    <dd>2.1 公司法人姓名/Name of the legal representative :</dd>
                    <dd>2.2 法人出生日期/Date of birth : </dd>
                    <dd>2.3 法人出生地/Place of birth :</dd>
                    <dd>2.4 婚姻状况/Marital status :</dd>
                    <dd>2.5 护照或者身份证号码/Passport NO. / ID NO :</dd>
                    <dd>2.6 法人身份证地址/Address ：</dd>
                </template>
            </dl>

            <dl>
                <dt>3.VAT生效日期</dt>
                <dd class="instructions" v-if="NT=='GB'">
                    <p>【VAT生效日期说明】</p>
                    <p>1.老账号，请正确填写第一个FBA/海外仓销售订单产生的时间，新账号，填写预计开始产生FBA销售日期，为税号生效日期，需从此日期开始申报缴税。</p>
                    <p>2.英国税号注册下来，需要等到税号生效日期，税号生效之后，才可以绑定亚马逊后台，否则无法绑定。</p>
                    <p>3.如因客户原因填写有误，可能导致额外需修改税号信息的服务费或罚金，将全权由客户自行承担责任。</p>
                </dd>
                <dd class="instructions" v-if="NT=='DE'">
                    <p>【VAT生效日期说明】</p>
                    <p>重要提示：税法规定税号生效日期将决定从何时开始申报缴纳税金！</p>
                    <p>1. 老账号，请正确填写第一个FBA/海外仓销售订单产生的时间，新账号，填写预计开始产生FBA销售日期，为税号生效日期，需从此日期开始申报缴税。</p>
                    <p>2. 德国有2个税号，第一个税号格式16/673/*****，第二个税号DE*********，第二个DE税号，才可以绑定后台。</p>
                    <p>3. 如因客户原因填写有误，可能导致额外需修改税号信息的服务费或罚金，将全权由客户自行承担责任。</p>
                    <p>4. 税号下来之后，需要等到税号生效日期，税号生效之后，才可以绑定后台，否则无法绑定。</p>
                </dd>
                <dd class="instructions" v-if="['FR','CZ','PL'].includes(NT)">
                    <p>【VAT生效日期说明】</p>
                    <p>重要提示：税法规定税号生效日期将决定从何时开始申报缴纳税金！</p>
                    <p>1. 老账号，请正确填写第一个FBA/海外仓销售订单产生的时间，新账号，填写预计开始产生FBA销售日期，为税号生效日期，需从此日期开始申报缴税。</p>
                    <p>2. 如因客户原因填写有误，可能导致额外需修改税号信息的服务费或罚金，将全权由客户自行承担责任。</p>
                    <p>3. 税号下来之后，需要等到税号生效日期，税号生效之后，才可以绑定后台，否则无法绑定。</p>
                </dd>
                <dd class="instructions" v-if="NT=='IT'">
                    <p>【VAT生效日期说明】</p>
                    <p>建议填写：目前意大利暂未强制要求补缴，客户可选择如实填写税号生效日期（即第一个FBA/海外仓销售订单产生的时间）或填写预估的税号申请成功时间。</p>
                    <p>1.若如实填写生效日期则从填写的税号生效日期开始进行追溯补缴，追溯补缴需额外支付补缴申报费，此费用未包括在税号套餐里面，价格请单独跟对接的销售确认；</p>
                    <p>2.若老账号填写预估生效时间，则可以等到税局查税时进行补缴税金，但这样可能因为未如实填写生效日期产生额外的罚金或连同账号冻结等风险，风险由客户自行承担。</p>
                    <p>3.税号下来，需要等到税号生效日期，税号生效之后，才可以绑定后台，否则无法绑定。</p>
                    <p>4.如因客户原因填写有误，可能导致额外需修改税号信息的服务费或罚金，将全权由客户自行承担责任。</p>
                </dd>
                <dd class="instructions" v-if="NT=='ES'">
                    <p>【VAT生效日期说明】</p>
                    <p>建议填写：此处按税法要求需填写第一单FBA发货日期，且税局要求从生效日期开始缴税。因目前税局并未强制要求补税，您可以选择填写生效日期在未来半个月左右。（以后若税局要求补税，您需要再补缴以往所欠税金。同时您可能存在期间进项无法抵扣或缴纳额外费用或滞纳金的风险。）请自行决定。</p>
                    <p>如果税号生效日期写成未来的，无需提供销售截图。</p>
                    <p>如因客户原因填写有误，可能导致额外需修改税号信息的服务费或罚金，将全权由客户自行承担责任。</p>
                </dd>
                <dd>3.1 VAT生效日期: 如:01/09/2018</dd>
            </dl>

            <dl>
                <dt>4.EORI号码</dt>
                <dd class="instructions">
                    <p>【EORI号码说明】</p>
                    <p>1.EORI号码：欧盟经济运营商注册识别号（进口号）；</p>
                    <p>2.如果已经获得EORI号，或者正在申请其他国家EORI号码，则填写：不需要申请EORI号码；</p>
                    <p>3.如需申请EORI号码，请填写： 需要申请EORI号码"。</p>
                </dd>
                <dd>4.1 是否需要申请EORI号码</dd>
            </dl>

            <dl v-if="NT=='GB'">
                <dt>5.申报方式</dt>
                <dd class="instructions">
                    <p>【申报方式说明】</p>
                    <p>1年销售额15万英镑以下建议低税率申报. 申报方式分为 ① 标准税率 STN 税率20%   ② 低税率 FRS 税率7.5% )申报方式二选一</p>
                </dd>
                <dd>5.1  选择申报方式：① 标准税率 STN 税率20%   ② 低税率 FRS 税率7.5%，申报方式二选一</dd>
            </dl>

            <dl>
                <template v-if="NT=='GB'">
                    <dt>6.证明文件</dt>
                    <dd class="instructions">
                        <p>所提供证明文件的扫描件或照片要求如下 ( 无水印、高清版本、保证完整、证件均未过期)</p>
                    </dd>
                    <dd>6.1 必须文件：公司营业执照、法人护照或身份证 (正反面)</dd>
                    <dd>6.2 另需以下法人文件任选两种：</dd>
                    <dd>出生证明/户口本（本人页）、结婚证、离婚证、工作证明、租房合同（带身份证编号）、房屋贷款明细、房产证</dd>
                </template>
                <template v-if="NT=='ES'">
                    <dt>5.证明文件</dt>
                    <dd class="instructions">
                        <p>所提供证明文件的扫描件或照片要求如下 ( 无水印、高清版本、保证完整、证件均未过期)</p>
                    </dd>
                    <dd>5.1 大陆公司需提供：营业执照的扫描件/照片</dd>
                    <dd>5.2 香港公司需提供：商业登记证BR、公司注册证明书CI、法团成立表格NNC1的扫描件</dd>
                    <dd>5.3 海牙认证/公证要求（我司可以完成翻译和海牙认证，费用请与客户经理确认）</dd>
                    <dd class="txtIndent">大陆公司：1. 营业执照：翻译成西班牙语后，加盖翻译章，做海牙国际认证</dd>
                    <dd class="txtIndent">香港公司：1.NNC1：国际公证；2.BR：国际公证；3.CR：西班牙语翻译并海牙认证</dd>
                    <dd>5.4 公司法人的护照或身份证：扫描件/照片</dd>
                    <dd class="txtIndent">如果提供护照，仅需扫描件/照片；如提供身份证，则需翻译（强烈建议提供护照，可以加快申请效率）</dd>
                    <dd>5.5 代理授权书（需要进行海牙认证）：扫描件/照片</dd>
                </template>
                <template v-if="['DE','FR','IT','CZ','PL'].includes(NT)">
                    <dt>5.证明文件</dt>
                    <dd class="instructions">
                        <p>所提供证明文件的扫描件或照片要求如下 ( 无水印、高清版本、保证完整、证件均未过期)</p>
                    </dd>
                    <dd>5.1 大陆公司需提供：营业执照的扫描件/照片</dd>
                    <dd>5.2 香港公司需提供：商业登记证和公司注册证明书的扫描件/照片</dd>
                    <dd>5.3 公司法人的护照或身份证：扫描件/照片</dd>
                    <dd> 如果提供护照，仅需扫描件/照片；如提供身份证，则需翻译（翻译由我们安排）（强烈建议提供护照，可以加快申请效率）"</dd>
                    <dd>5.4 代理授权书：扫描件/照片</dd>
                </template>
            </dl>

            <dl v-if="NT=='GB'">
                <dt>7.VAT申请抽查资料</dt>
                <dd class="instructions">
                    <p>VAT申请抽查资料　抽查资料仅在遇到HMRC抽查时，应HMRC的要求提供</p>
                </dd>
                <dd>7.1 采购发票  </dd>
                <dd>7.2 调查问卷  </dd>
                <dd>7.3 EBAY/AMAZON账户信息  </dd>
                <dd>7.4 收款记录   </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import domain from './../../../../js/domain.js';
export default {
    data(){
        return {
            NT:'',
            DOMAIN:domain
        }
    },
    created(){
        this.NT = this.$route.params.code || 'GB'
    }
}
</script>

<style lang="scss" scoped>
.vat-container{
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.5);
    overflow-y: scroll;
    z-index: 200;
    .content{
        background-color: #fff;
        position: absolute;
        width: 70%;
        left: 50%;
        top: 100px;
        transform: translateX(-50%);
        color: #333;
        padding:0 20px 20px;

        .banner-module-title{
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            letter-spacing: 1px;
            color: #333;
            margin-bottom: 20px;
            .cares-logo{
                margin-top: 17px;
                position: absolute;
                right: 20px;
            }
        }

        .handle-btn{
            position: absolute;
            margin-top: -40px;
            right: 0;
            a,span{
                display: inline-block;
                cursor: pointer;
                padding: 0 20px;
                height: 32px;
                line-height: 32px;
                border-radius: 16px;
                font-size: 16px;
                text-align: center;
                background-color: #fff;
                margin-left: 20px;
            }
        }
    }
}

.second-title{
    line-height: 34px;
    text-align: center;
}

.instructions{
    background-color: #FDF0E5;
    color: #ED6C00;
    padding: 10px;
    line-height: 24px;
    font-size: 12px;
}
.txtIndent{
    text-indent: 2em;
}

dl{
    margin-top: 20px;
    line-height: 30px;
    dt{
        font-size: 16px;
        font-weight: bold;
    }
    dd{
        font-size: 14px;
    }
}

</style>

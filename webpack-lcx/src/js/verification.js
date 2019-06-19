import { Message } from 'element-ui';
import $ from 'jquery';

/**
 * 验证表单格式的类
 */

class Verify {

    constructor() {
        //用到的正则规则
        this.Exp = {
            "O_NUM": /^\d+$/,                                                       //只能是数字
            "TEL": /^1[3-9][0-9]{9}$/,                                              //手机号码
            // "MAIL": /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(com|cn)$/,  //邮箱正则
            "MAIL": /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/,  //邮箱正则
            "ID_CART":/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,//身份证正则
            "PSW":/^[a-zA-Z0-9\x21-\x7e]{6,20}$/,//密码校验：6-20位，必须数字，字母，特殊字符两两组合
            'VER_CODE':/^[0-9]{6}$/,        //验证码验证6位数字
            'IMG_VER_CODE':/^[0-9a-zA-Z]{4}$/,    //图片验证码验证6位数字
            'LINK':/^[http,https]+:\/\/[^\s]+/i,   //链接[a-zA-z]+://[^\s]*
            // 'LINK':/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,   //链接[a-zA-z]+://[^\s]*
        };
    }

    /**
     * 向外暴露的验证方法
     * @param {*} name 表单的name
     * @param {*} val 需要验证的值
     * @param {*} fn 2018-11-8 香港实名认证增加丰富性
     * Author:Lcx
     * 641616451@qq
     */
    verifycation(name, val, fn) {

        if (!name) return console.warn("Verification.js: 缺少第一个参数：name字段");
        if (val === undefined) return console.warn(`Verification.js: 缺少第二个参数：${name} 需要验证的值`);

        this.NAME = name;
        this.VALUE = String(val) || '';
        this.FN =  fn;


        this.flag = true;   //是否正确
        this.msg = ``;      //提示的消息

        //验证的处理对应函数
        const Rule = {
            "USERNAME":             this.T_USERNAME.bind(this),      //用户名
            "OLDPASSWORD":          this.T_PASSWORD.bind(this),       //账号中心修改密码-》原密码校验
            "PASSWORD":             this.T_PASSWORD.bind(this),      //密码
            "CONFIRMPSW":           this.T_CONPASSWORD.bind(this),     //确认密码
            "VERIFYCODE":           this.T_VERCODE.bind(this),         //验证码
            "PHONECODE":            this.T_VERCODE.bind(this),          //账号中心修改邮箱-》手机验证码
            "IMGVERIFYCODE":        this.T_IMGVERCODE.bind(this),       //图片验证码
            "PHONENO":              this.T_PHONENO.bind(this),          //手机号码
            "REFERRER":             this.T_PHONENO.bind(this),       //推荐人的手机号码
            "EMAIL":                this.T_EMAIL.bind(this),     
            "EBAYEMAIL":            this.T_EMAIL.bind(this),     
            "PAYPALEMAIL":            this.T_EMAIL.bind(this),     

            "STORENAME":            this.T_EMPTY.bind(this),            //添加店铺名称
            "PRODUCTCATEGORIES":    this.T_EMPTY.bind(this),            //添加店铺销售类目
            "EXPECTEDSALE":         this.T_EMPTY.bind(this),            //添加店铺销售年销量
            "CHANNELCODE":          this.T_EMPTY.bind(this),            //添加币种与账号
            "ACCOUNTNAME":          this.T_EMPTY.bind(this),         //提现账户中心提现账号名称
            "BANKCODE":             this.T_EMPTY.bind(this),         //提现账户中心银行code
            "BANKNAME":             this.T_EMPTY.bind(this),         //提现账户中心银行code
            "SWIFTCODE":            this.T_EMPTY.bind(this),         //提现账户中心支行code
            "CONTACTNAME":          this.T_EMPTY.bind(this),         //提现账户中心联系人
            "BRANCHADDR":           this.T_EMPTY.bind(this),         //账号提现中心支行详细地址
            "PAYPALBILL":           this.T_EMPTY.bind(this),            //paypalBill
            "CURRENCY":             this.T_EMPTY.bind(this),            //币种
            "NATION":               this.T_EMPTY.bind(this),            //国家
            "TAXBUREAUACCOUNTNAME":               this.T_EMPTY.bind(this),            //国家
            "TAXBUREAUBIC":               this.T_EMPTY.bind(this),            //国家
            "TAXBUREAUBANKNAME":               this.T_EMPTY.bind(this),            //国家
            "TAXBUREAUROUTING":               this.T_EMPTY.bind(this),            //国家

            "COUNTRYCODE":               this.T_EMPTY.bind(this),            //国家
            "PAYPALACCOUNT":        this.T_EMPTY.bind(this),            //paypal账号
            "PAYPALNAME":           this.T_EMPTY.bind(this),               //paypal账户名

            "BANKNUMBER":           this.T_BANKNUMBER.bind(this),         //提现账户中心银行卡号
            "TAXBUREAUACCOUNT":           this.T_BANKNUMBER.bind(this),         //提现账户中心银行卡号
            "ACCESSKEY":            this.T_ACCESSKEY.bind(this),            //修改店铺访问编码
            "SELLERID":             this.T_SELLERID.bind(this),            //修改店铺卖家编号
            "SECRETKEY":            this.T_SECRETKEY.bind(this),            //修改店铺密钥
            "AUTHTOKEN":            this.T_TOKEN.bind(this),            //修改店铺密钥authToken
            "EBAYSTORELINK":        this.T_LINKS.bind(this),            //ebay店铺链接

            /**2018-11-8 增加的香港户口身份证添加页面**/
            "HKBIZCERTIFICATION":           this.T_EMPTY.bind(this),           //商户登记证
            "HKREGISTERCERTIFICATION":      this.T_EMPTY.bind(this),           //商户登记证
            "HKTABLECERTIFICATION":         this.T_EMPTY.bind(this),           //商户登记证
           
            "CARDFRONTID":          this.T_EMPTY.bind(this),            //身份证正面
            "CARDANOTHERID":        this.T_EMPTY.bind(this),            //身份证反面
            "HANDHELDID":           this.T_EMPTY.bind(this),            //身份证 手持
            "BLICENCEID":           this.T_EMPTY.bind(this),            //营业执照
            "SHAREPROPORTION":      this.T_EMPTY.bind(this),            //营业执照
            "PROVINCECODE":         this.T_EMPTY.bind(this),         //省份选择
            "CITYCODE":             this.T_EMPTY.bind(this),         //城市选择
            "RESIDENTIALADDRESS":   this.T_EMPTY.bind(this),         //详细地址
            "ADDRESS":              this.T_EMPTY.bind(this),         //详细地址
            "BRANCHPROVINCECODE":   this.T_EMPTY.bind(this),         //提现账户中心支行省份选择
            "BRANCHCITYCODE":       this.T_EMPTY.bind(this),         //提现账户中心城市选择
            "ETSYACCOUNT":       this.T_EMPTY.bind(this),         //提现账户中心城市选择

            "FRONTAMOUNT":          this.T_TAXMONEY.bind(this),         //缴税
            "REFERENCENO":          this.T_EMPTY.bind(this),         //缴税
            "TAXNO":          this.T_EMPTY.bind(this),         //缴税
        };  

        //返回验证结果  布尔值
        if (Rule[this.NAME.toUpperCase()]) {
            return (Rule[this.NAME.toUpperCase()])();
        } else {
            console.warn(`Verification.js: 还未定义name:${this.NAME}的验证函数`);
        }

    }

    /**
     * 错误提示页面处理的函数
     * Message方法依赖于  element-ui vue
     * @param {*} name 表单的name
     * @param {*} msg 提示的msg
     * Author:Lcx
     * 641616451@qq
     */
    view_ErrorDueFn(name, msg) {

        //2018-11-9 完善股东的资料，直接强提示;
        if(this.FN=='HOLDER') return Message.error(msg);

        //2.0 版本优化的试图提示更新
        let iptcontainer = $(`div[name="${ name }"]`).eq(0);
        let inputDom = $(`input[name="${ name }"]`);
        let e_contarner = $(`div[name="${ name }"] .el-form-item__content`);
        //如果没有相应的dom节点 就做顶部提示
        if(!inputDom.length||!iptcontainer.length) return Message.error(msg);

        iptcontainer.addClass('is-error');

        let error_dom = document.createElement('div');
        error_dom.className = 'el-form-item__error';
        error_dom.innerHTML =  msg;

        //先移除后添加
        e_contarner.find('.el-form-item__error') && e_contarner.find('.el-form-item__error').remove();
        e_contarner.append(error_dom);

        //输入框点击事件
        $(inputDom).on("focus",function(){
            iptcontainer.removeClass('is-error');
            iptcontainer.find('.el-form-item__error').remove();
        });

    }

    /**
     * 对外返回函数验证的结果
     * @param {*} bol 
     * @param {*} msg 
     * Author：Lcx
     * 641616451@qq
     */
    Result(bol, msg) {
        !bol && this.view_ErrorDueFn(this.NAME, msg);
        return bol;
    }

    /**
     * 确认密码
     */
    T_CONPASSWORD(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '密码不能为空'
        }

        let dom = document.querySelector(`input[name="password"]`);

        if(dom && (dom.value.trim() != this.VALUE)){
            this.flag = false;
            this.msg = '两次输入密码不一致';
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 1.验证用户名邮箱
     * Author：Lcx
     * 641616451@qq
     */
    T_USERNAME() {
        let D = this.Exp["O_NUM"];

        if (D.test(this.VALUE)) {
            //数字  验证是否是电话号码
            !this.Exp["TEL"].test(this.VALUE) && (this.flag = false, this.msg = `请输入正确的手机号码`);

        } else {
            //非数字  验证是否是邮箱地址
            !this.Exp["MAIL"].test(this.VALUE) && (this.flag = false, this.msg = `请输入正确的手机号码或邮箱地址`);
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 2.验证手机号码
     * Author：Lcx
     * 641616451@qq
     */
    T_PHONENO() {
        !this.Exp["TEL"].test(this.VALUE) && (this.flag = false, this.msg = `请输入正确的手机号码`);
        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 3.验证登录邮箱地址
     * Author:Lcx
     * 641616451@qq
     */
    T_EMAIL() {
        !this.Exp["MAIL"].test(this.VALUE) && (this.flag = false, this.msg = `请输入正确的邮箱地址`);
        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 4. 验证不能为空
     * Author:Lcx
     * 641616451@qq
     */
    T_EMPTY() {

        if (!this.VALUE.trim()) {
            this.flag = false;
            switch (this.NAME.toUpperCase()) {
                case 'REFERENCENO':
                    {
                        this.msg = `请输入参考号`;
                    }
                    break;
                case 'TAXNO':
                    {
                        this.msg = `请输入增值税注册号`;
                    }
                    break;
                // case 'FRONTAMOUNT':
                //     {
                //         this.msg = `请输入缴税金额`;
                //     }
                //     break;
                case 'COUNTRYCODE':
                    {
                        this.msg = `请选择税局机构`;
                    }
                    break;
                case 'TAXBUREAUACCOUNTNAME':
                    {
                        this.msg = `请填写账户名称`;
                    }
                    break;
                case 'TAXBUREAUBIC':
                    {
                        this.msg = `请填写银行BIC号`;
                    }
                    break;
                case 'TAXBUREAUBANKNAME':
                    {
                        this.msg = `请填写银行名称`;
                    }
                    break;
                case 'TAXBUREAUROUTING':
                    {
                        this.msg = `请填写路由号`;
                    }
                    break;
                case 'HKBIZCERTIFICATION':
                    {
                        this.msg = `请上传商户登记证`;
                    }
                    break;
                case 'HKREGISTERCERTIFICATION':
                    {
                        this.msg = `请上传公司注册证书`;
                    }
                    break;
                case 'HKTABLECERTIFICATION':
                    {
                        this.msg = `请上传发团成立表格`;
                    }
                    break;
                case 'STORENAME':
                    {
                        this.msg = `请输入店铺名称`;
                    }
                    break;
                case 'CARDFRONTID':
                    {
                        let str = '';

                        if(this.FN == 'HK'){
                            str = '请上传董事证件正面照';
                        }else if(this.FN == 'HOLDER'){
                            str = '您有股东证件正面照待完善';
                        } else{
                            str = '请上传身份证正面照';
                        }

                         this.msg = str;
                    }
                    break;
                case 'CARDANOTHERID':
                    {
                        let str = '';

                        if(this.FN == 'HK'){
                            str = '请上传董事证件反面照';
                        }else if(this.FN == 'HOLDER'){
                            str = '您有股东证件反面照待完善';
                        } else{
                            str = '请上传身份证反面照';
                        }

                         this.msg = str;
                    }
                    break;
                case 'HANDHELDID':
                    {
                        this.msg = `请上传手持身份证照`;
                    }
                    break;
                case 'SHAREPROPORTION':
                    {
                        this.msg = `请完善股东的占股比例`;
                    }
                    break;
                case 'BLICENCEID':
                    {
                        this.msg = `请上传公司的营业执照`;
                    }
                    break;
                case 'PRODUCTCATEGORIES':
                    {
                        this.msg = `请选择销售类目`;
                    }
                    break;
                case 'EXPECTEDSALE':
                    {
                        this.msg = `请选择预计年销量`;
                    }
                    break;
                case 'BRANCHPROVINCECODE':
                case 'PROVINCECODE':
                    {
                        this.msg = (this.FN =="HOLDER"? "您有股东省份待完善":"请选择省份" );
                    }
                    break;
                case 'BRANCHCITYCODE':
                case 'CITYCODE':
                    {
                        this.msg = (this.FN =="HOLDER"? "您有股东城市待完善":"请选择城市" );
                    }
                    break;
                case 'BRANCHADDR': 
                case 'ADDRESS': 
                case 'RESIDENTIALADDRESS': 
                    {
                        this.msg = (this.FN == "HOLDER"? "您有股东详细地址待完善":"请填写详细地址" );
                    }
                    break;
                case 'BANKNAME':
                case 'BANKCODE':
                    {
                        this.msg = '请输入银行名称';
                    }
                    break;
                case 'SWIFTCODE':
                    {
                        this.msg = '请输入支行名称';
                    }
                    break;
                case 'CONTACTNAME':
                    {
                        this.msg = '请填写联系人';
                    }
                    break;
                case 'ACCOUNTNAME':
                    {
                        this.msg = '请填写提现账号名称';
                    }
                    break;
                case 'PAYPALBILL':
                    {
                        this.msg = '请上传paypal账单';
                    }
                    break;
                case 'CURRENCY':
                    {
                        this.msg = '请选择币种';
                    }
                    break;
                case 'CHANNELCODE':
                    {
                        this.msg = '请选择提现币种与账号';
                    }
                    break;
                case 'NATION':
                    {
                        this.msg = '请选择店铺所在国家';
                    }
                    break;
                case 'PAYPALACCOUNT':
                    {
                        this.msg = '请填写店铺绑定的PayPal账号';
                    }
                    break;
                case 'PAYPALNAME':
                    {
                        this.msg = '请填写PayPal账户姓名';
                    }
                    break;
                case 'ETSYACCOUNT':
                    {
                        this.msg = '请填写账户名';
                    }
                    break;
            }
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 5. 验证身份证号码
     * Author:Lcx
     * 641616451@qq
     */
    T_IDCARD(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '身份证号码不能为空'
        }

        if(!(this.Exp["ID_CART"].test(this.VALUE))){
            this.flag = false;
            this.msg = '请输入正确的身份证号码';
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 6. 验证密码
     * Author:DNX
     * 1124215161@qq
     */
    T_PASSWORD(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '密码不能为空'
        }

        if(!(this.Exp["PSW"].test(this.VALUE))){
            this.flag = false;
            this.msg = '请输入正确的密码';
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 7. 手机验证码校验
     * Author:DNX
     * 1124215161@qq
     */
    T_VERCODE(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '验证码不能为空'
        }

        if(!(this.Exp["VER_CODE"].test(this.VALUE))){
            this.flag = false;
            this.msg = '请输入6位数验证码';
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    T_IMGVERCODE(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '验证码不能为空'
        }

        if(!(this.Exp["IMG_VER_CODE"].test(this.VALUE))){
            this.flag = false;
            this.msg = '请输入4位图片验证码';
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 8. 卖家编号校验
     * Author:Lcx
     * 641616451@qq
     */
    T_SELLERID(){
        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '请输入卖家编号'
        }

        if(this.VALUE.trim().length<8){
            this.flag = false;
            this.msg = '卖家编号长度不能低于8位'
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

     /**
     * 9. 访问键校验
     * Author:Lcx
     * 641616451@qq
     */
    T_ACCESSKEY(){

        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '请输入访问键编码'
        }

        if(this.VALUE.trim().length<15){
            this.flag = false;
            this.msg = '访问键编码长度不能低于15位'
        }

        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     * 10. 密钥校验
     * Author:Lcx
     * 641616451@qq
     */
    T_SECRETKEY(){

        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '请输入密钥'
        }

        if(this.VALUE.trim().length<25){
            this.flag = false;
            this.msg = '密钥长度不能低于25位'
        }

        //返回验证结果
        return this.Result(this.flag, this.msg); 
    }

    /**
     * 2018-10-24取消3个key变成MWS Auth Token
     */
    T_TOKEN(){

        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '请输入MWS Auth Token'
        }

        // if(this.VALUE.trim().length<25){
        //     this.flag = false;
        //     this.msg = '密钥长度不能低于25位'
        // }

        //返回验证结果
        return this.Result(this.flag, this.msg); 
    }

    /**
     * 11. 银行卡号校验
     * Author:Lcx
     * 641616451@qq
     */
    T_BANKNUMBER(){

        if(!(this.Exp["O_NUM"].test(this.VALUE))){
            this.flag = false;
            this.msg = '银行卡号只能为数字'
        }

        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '银行卡号不能为空'
        }

        if(this.VALUE.trim().length<8){
            this.flag = false;
            this.msg = '银行卡号长度不能低于8位'
        }

        //返回验证结果
        return this.Result(this.flag, this.msg); 
    }
    /**
     * 12. 链接校验
     * Author:Lcx
     * 641616451@qq
     */
    T_LINKS(){

        if(!(this.Exp["LINK"].test(this.VALUE))){
            this.flag = false;
            this.msg = '链接不正确，可能缺少http://或者链接不完整'
        }

        if(!(this.VALUE.trim())){
            this.flag = false;
            this.msg = '请填写店铺链接'
        }


        //返回验证结果
        return this.Result(this.flag, this.msg); 
    }

    T_TAXMONEY(){

        if(!(this.VALUE.trim())){
            this.flag = false;
            this.msg = '请输入金额'
        }

        if((this.VALUE.trim()) > this.FN){
            this.flag = false;
            this.msg = '账户资金不足，无法代理缴费，请预留足额店铺资金后，再申请代缴费'
        }

        //返回验证结果
        return this.Result(this.flag, this.msg); 
    }


}

const caresVerify = new Verify();

export default caresVerify.verifycation.bind(caresVerify);
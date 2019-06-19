import { Message } from 'element-ui';

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
            'VER_CODE':/^[0-9]{6}$/,//验证码验证6位数字
            'Z-I':/^[a-z]+$/i,//只能字母跟英文
        };
    }

    /**
     * 向外暴露的验证方法
     * @param {*} name 表单的name
     * @param {*} val 需要验证的值
     * Author:Lcx
     * 641616451@qq
     */
    verifycation(name, val ,emptyMsg) {

        if (!name) return console.warn("Verification.js: 缺少第一个参数：name字段");
        if (val === undefined) return console.warn("Verification.js: 缺少第二个参数：需要验证的值");

        this.NAME = name;
        this.VALUE = val;

        this.flag = true;   //是否正确
        this.msg = ``;      //提示的消息
        this.EPmsg = emptyMsg;      //空验证时候的消息

        //验证的处理对应函数
        const Rule = {
            "USERNAME":             this.T_USERNAME.bind(this),      //用户名
            "USERMAIL":             this.T_USERMAIL.bind(this),      //用户名或者邮箱
            "USERCODE":             this.T_USERCODE.bind(this),      //账号名
            "PHONE":                this.T_PHONENO.bind(this),       //手机号码

            "OLDPASSWORD":             this.T_PASSWORD.bind(this),      //原密码密码
            "PASSWORD":             this.T_PASSWORD.bind(this),      //密码

            "CONFIRMPSW":           this.T_CONPASSWORD.bind(this),     //确认密码
            "EMAIL":                this.T_EMAIL.bind(this),         //邮箱地址
            "VERIFYCODE":           this.T_VERCODE.bind(this),         //验证码



            "PROVINCECODE":         this.T_EMPTY.bind(this),         //省份选择
            "CITYCODE":             this.T_EMPTY.bind(this),         //城市选择
            "ADDRESS":              this.T_EMPTY.bind(this),         //详细地址
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
     * 样式效果依赖于  element-ui的form布局
     * @param {*} name 表单的name
     * @param {*} msg 提示的msg
     * Author:Lcx
     * time:2018/7/27
     * 641616451@qq
     */
    view_ErrorDueFn(name, msg) {
        let iptcontainer = document.querySelector(`div[name="${ name }"]`);
        let inputDom = document.querySelector(`input[name="${ name }"]`);
        let e_contarner = document.querySelector(`div[name="${ name }"] .el-form-item__content`);
        //如果没有相应的dom节点 就做顶部提示
        if(!inputDom||!iptcontainer) return Message.error(msg);

        iptcontainer.classList.add('is-error');

        let error_dom = document.createElement('div');
        error_dom.className = 'el-form-item__error';
        error_dom.innerHTML =  msg;

        //先移除后添加
        e_contarner.querySelector('.el-form-item__error') && e_contarner.querySelector('.el-form-item__error').remove();
        e_contarner.appendChild(error_dom);

        //输入框点击事件
        inputDom.addEventListener('focus', function() {
            iptcontainer.classList.remove('is-error');
            e_contarner.querySelector('.el-form-item__error') && e_contarner.querySelector('.el-form-item__error').remove();
        }, false)
    }

    /**
     * 对外返回函数验证的结果
     * @param {*} bol 
     * @param {*} msg 
     * Author：Lcx
     * 641616451@qq
     */
    Result(bol, msg) {

        if (!bol) {
            this.view_ErrorDueFn(this.NAME, msg);
            return false;
        } else {
            return true
        }
    }

    /**
     * 1.验证用户名邮箱
     * Author：Lcx
     * 641616451@qq
     */
    T_USERNAME() {

        if(!this.VALUE.trim()){
            this.flag = false;
            this.msg = '真实姓名不能为空'
        }
        //返回验证结果
        return this.Result(this.flag, this.msg);
    }

    /**
     *  手机号码或邮箱地址
     *  Author: Lcx
     */
    T_USERMAIL(){
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
     * 1.验证账户名
     * Author：Lcx
     * 641616451@qq
     */
    T_USERCODE() {

        if(this.VALUE.trim().length<4){
            this.flag = false;
            this.msg = '账号长度至少4位'
        }

        if(!this.Exp["Z-I"].test(this.VALUE)){
            this.flag = false;
            this.msg = '账号只能是英文字母组成'
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
            this.msg = this.EPmsg;
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
     * 6. 确认新密码
     * Author:DNX
     * 1124215161@qq
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

}

const caresVerify = new Verify();

export default caresVerify.verifycation.bind(caresVerify);
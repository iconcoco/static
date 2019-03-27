import Vue from 'vue';
import VueRouter from 'vue-router';
import { Popover,Input, Radio, Checkbox, Select, Option, Button, Message, 
    Form,
    Upload,
    Tooltip,
    FormItem, } from 'element-ui';

//注册路由
Vue.use(VueRouter);

Vue.prototype.$Message = Message;

//按需注册element-ui
Vue.component(Popover.name, Popover);
Vue.component(Input.name, Input);
Vue.component(Radio.name, Radio);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Button.name, Button);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Upload.name, Upload);
Vue.component(Tooltip.name, Tooltip);

// 引入路由
import routes from './uitls/route';

// 引入主题骨架
import App from './App.vue';
// import App from './ca/App.vue';

//引入应用的样式
import '../../css/carespay/cares-element.scss'; //element-ui 样式变更
import '../../css/common/caresapp.scss'; //登录页
import '../../css/login/login.scss'; //登录页

new Vue({
    el: '#App',
    router: new VueRouter({ routes }),
    render: h => h(App)
});

import Vue from 'vue';
import './../../js/lib/fadeSwiper.js';

import {
    TimePicker,
    Upload,
    DatePicker,
    Input, 
    Radio,
    Checkbox, 
    Select, 
    Option, 
    Form, 
    FormItem, 
    Button, 
    Popover, 
    Table, 
    // Pagination, 
    Message,
    MessageBox,
    Tooltip,
    CheckboxGroup,
    Cascader
} from 'element-ui';

//一、VUE的扩展
//1. 注册依赖
import  router  from './utils/routerInter.js';                                     //引入前端路由
import  store  from './utils/store.js';

Vue.prototype.$Message = Message
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;

//2. 全局注册组件
Vue.component(Upload.name, Upload);
Vue.component(Input.name, Input);
Vue.component(Radio.name, Radio);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);
Vue.component(Form.name, Form);
Vue.component(FormItem.name, FormItem);
Vue.component(Button.name, Button);
Vue.component(Popover.name, Popover);
Vue.component(Table.name, Table);
Vue.component(TimePicker.name,TimePicker);
Vue.component(DatePicker.name,DatePicker)
Vue.component(Tooltip.name,Tooltip)
Vue.component(CheckboxGroup.name,CheckboxGroup)
Vue.component(Cascader.name,Cascader)

import PaginationDetaile from '../../components/pagination.vue'; //分页组件
Vue.component('Pagination', PaginationDetaile);    


import App from './App.vue';                                            //引入主体框架视图


//二、实例的扩展管理


//三、应用的全局样式
import '../../css/carespay/cares-element.scss';                         //element-ui 样式变更
import '../../css/common/caresapp.scss';


//四、创建实例
new Vue({
    el: "#App",
    router,
    store, //状态管理仓库注入实例中
    render: h => {
        return h(App);
    }
});



import Vue from 'vue';
import VueRouter from 'vue-router';
import { Input, Radio, Checkbox, Option, Select} from 'element-ui';

//注册路由
Vue.use(VueRouter);

Vue.component(Input.name, Input);
Vue.component(Radio.name, Radio);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Select.name, Select);
Vue.component(Option.name, Option);


// 引入路由
import routes from './uitls/route';

// 引入主题骨架
import App from './App.vue';


import './../../css/carespay/cares-element.scss';
import './../../css/weChat/weChat.scss';

new Vue({
    el: '#App',
    router: new VueRouter({ routes }),
    render: h => h(App)
});

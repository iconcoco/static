import Vue from 'vue';
import Vuex from 'vuex';


Vue.use(Vuex);

import stores from './store.js';

export default new Vuex.Store(stores);;
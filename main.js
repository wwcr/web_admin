import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import iView from 'iview';
import 'iview/dist/styles/iview.css';
import VueHtml5Editor from 'vue-html5-editor'


Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(iView);
Vue.use(VueResource);
Vue.use(VueHtml5Editor);

//NProgress.configure({ showSpinner: false });

Vue.http.options.emulateJSON = true;
Vue.config.productionTip = false;
Vue.http.options.xhr = {withCredentials: true};
Vue.prototype.gogo = function ($url = '') {
    location.href = '#/' + $url;
};
import units from './tools/units'
Vue.prototype.http = function (cont,data,cb,$type=false) {
    if($type){
        $host = units.damin(cont);
    }else{
        $host = units.domin(cont);
    }
    this.$http.post($host, units.params(data)).then(function (res) {
        cb&&cb(res.data);
    });
};
const router = new VueRouter({
    routes
})

router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        sessionStorage.removeItem('user');
    }
    let user = JSON.parse(sessionStorage.getItem('user'));
    if (!user && to.path != '/login') {
        next({path: '/login'})
    } else {
        next()
    }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');


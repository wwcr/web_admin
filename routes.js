import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'
import FocusGraph from './template/banner/FocusGraph'
import bannerAdd from './template/banner/add'

//文章分类
import articleCate from './template/article/cate.vue'
import AddArticle from './template/article/add.vue'
import ArticleList from './template/article/list.vue'
import userList from './template/user/list.vue'
import findcar from './template/findcar/list.vue'
import OrderList from './template/order/list.vue'
import Transaction from './template/transaction/list.vue'
import Terprise from './template/user/terprise.vue'
import ServerAdd from './template/cardata/add.vue'
import ServerList from './template/cardata/list.vue'
import exorder from './template/exorder/listd.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '焦点图管理',
        iconCls: 'fa fa-save',
        children: [
            {path: '/banner/focusgraph', component: FocusGraph, name: '焦点图列表'},
            {path: '/banner/add', component: bannerAdd, name: '新增焦点图'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '文章管理',
        iconCls: 'fa fa-coffee',//图标样式class
        children: [
            {path: '/main', component: Main, name: '主页', hidden: true},
            {path: '/article/list', component: ArticleList, name: '文章列表'},
            {path: '/article/cate', component: articleCate, name: '文章分类'},
            {path: '/article/add', component: AddArticle, name: '新增文章'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-user-o',
        children: [
            {path: '/user/list', component: userList, name: '用户列表'},
            // { path: '/user/add', component: userAdd, name: '新增用户' },
            {path: '/user/terprise', component: Terprise, name: '企业认证'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '消息管理',
        iconCls: 'fa fa-envelope',
        children: [
            {
                path: '/message/list',
                name: '消息列表',
                component: function (resolve) {
                    require(['./template/message/index.vue'], resolve)
                }
            },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '服务管理',
        iconCls: 'fa fa-address-card',
        children: [
            {path: '/findcar/list', component: findcar, name: '寻车服务'},
            {
                path: '/findcar/index',
                name: '车辆看护',
                component: function (resolve) {
                    require(['./template/exorder/index.vue'], resolve)
                }
            }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '执行管理',
        iconCls: 'fa fa-bell-slash',
        children: [
            {path: '/exorder/list', component: exorder, name: '执行订单'},
            {path: '/exorder/index', component: exorder, name: '执行管理'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa fa-check-square-o',
        children: [
            {
                path: '/order/exorder',
                name: '抢单管理',
                component: function (resolve) {
                    require(['./template/order/exorder.vue'], resolve)
                }
            },
            {path: '/order/list', component: OrderList, name: '订单列表'},
            {path: '/order/transaction', component: Transaction, name: '交易记录'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '数据管理',
        iconCls: 'fa fa-globe',
        children: [
            {path: '/server/list', component: ServerList, name: '数据列表'},
            {path: '/server/add', component: ServerAdd, name: '新增数据'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '车辆数据',
        iconCls: 'fa fa-car',
        children: [
            {path: '/cardata/list', component: ServerList, name: '数据列表'},
            {path: '/cardata/add', component: ServerAdd, name: '新增数据'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-cog',
        leaf: true,//只有一个节点
        children: [
            {path: '/page6', component: Page6, name: '系统设置'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '报表管理',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/echarts', component: echarts, name: '图表测试'}
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    }
];
export default routes;
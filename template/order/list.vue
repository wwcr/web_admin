<template>
    <section class="pd10">
        <div class="h10"></div>
        <!--工具条-->
        <el-button type="primary" icon="search" @click="orderlist(0)">
            车辆看护
        </el-button>
        <el-button type="success" @click="orderlist(1)">
            寻车服务
        </el-button>
        <el-button type="warning" @click="orderlist(2)">
            执行订单
        </el-button>
        <!--列表-->
        <div class="h10"></div>
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column type="index" width="60">
            </el-table-column>
            <el-table-column label="用户" width="100" sortable>
                <template scope="scope">
                    <el-button size="small">
                        <a target="_blank" :href="'#/user/list?uid='+scope.row.user_id">
                            {{scope.row.user_nickname}}
                        </a>
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="user_mobile" label="手机号" width="150" sortable>
            </el-table-column>
            <el-table-column prop="order_number" label="订单号" width="180" sortable>
            </el-table-column>
            <el-table-column label="订单类型" width="120" sortable>
                <template scope="scope">
                    <el-button type="success" size="small" v-if="scope.row.order_type == 1">车辆看护</el-button>
                    <el-button type="info" size="small" v-if="scope.row.order_type == 2">寻车服务</el-button>
                    <el-button type="danger" size="small" v-if="scope.row.order_type == 3">执行订单</el-button>
                </template>
            </el-table-column>
            <el-table-column label="订单生成时间" width="180" sortable>
                <template scope="scope">
                    {{maketime(scope.row.order_time)}}
                </template>
            </el-table-column>
            <el-table-column label="支付状态" width="120" sortable>
                <template scope="scope">
                    <el-button size="small" v-if="scope.row.pay_status == -2">退款</el-button>
                    <el-button size="small" v-if="scope.row.pay_status == -1">支付失败</el-button>
                    <el-button size="small" v-if="scope.row.pay_status == 1">待支付</el-button>
                    <el-button type="info" size="small" v-if="scope.row.pay_status == 2">支付成功</el-button>
                    <el-button size="small" v-if="scope.row.pay_status == 3">已完成</el-button>
                </template>
            </el-table-column>
            <el-table-column label="支付金额" width="120" sortable>
                <template scope="scope">
                    <el-button size="small">
                        {{scope.row.order_price/100}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="支付方式" width="120" sortable>
                <template scope="scope">
                    <el-button size="small" v-if="scope.row.pay_type == 0">微信</el-button>
                    <el-button size="small" v-if="scope.row.pay_type == 1">支付宝</el-button>
                    <el-button size="small" v-if="scope.row.pay_type == 2">银行卡</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <a target="_blank" href="#/order/list">
                <el-button type="info" v-if="order">返回列表</el-button>
            </a>
            <el-pagination
                    layout="prev, pager, next"
                    @current-change="handleCurrentChange"
                    :page-size="11"
                    :total="total"
                    style="float:right;">
            </el-pagination>
        </el-col>
        <!--编辑界面-->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>
        <!--新增界面-->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="addForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
        <div class="alert">
            <Modal
                    v-model="alertOpen.model"
                    :title="alertOpen.title"
                    @on-ok="alertOpener">
                <div v-html="alertOpen.html"></div>
            </Modal>
        </div>
    </section>
</template>

<script>
    import util from '../../common/js/util'
    import took from '../../tools/units'
    //import NProgress from 'nprogress'
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import units from '../../tools/units'
    export default {
        data() {
            return {
                filters: {
                    name: ''
                },
                users: [],
                total: 0,
                page: 1,
                listLoading: false,
                sels: [],//列表选中列
                editFormVisible: false,//编辑界面是否显示
                editLoading: false,
                editFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //编辑界面数据
                editForm: {
                    id: 0,
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
                addFormRules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ]
                },
                //新增界面数据
                addForm: {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                },
                alertOpen:{
                    model:false,
                    title:'消息',
                    html:''
                },
                order:''
            }
        },
        methods: {
            usertype:function (x) {
                if(x.user_type == 1){
                    return '资金方';
                }else if (x.user_type == 2) {
                    return '执行方';
                }else{
                    return '两者都有';
                }
            },
            alertOpenStart:function (type,data) {
                this.alertOpen.model = true;
               if(type == 1){
                   this.alertOpen.title = '查看摘要';
                   this.alertOpen.html = data.art_desc;
               }else{
                   this.alertOpen.title = '查看图片';
                   this.alertOpen.html = '<img width="250" src='+data.art_thumb+'>';
               }
            },
            alertOpener:function () {

            },
            orderlist:function () {

            },
            maketime:function (t) {
                return took.maketimegs(t)
            },
            //性别显示转换
            formatSex: function (row, column) {
                return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
            },
            handleCurrentChange(val) {
                this.page = val;
                this.getUsers();
            },
            //获取用户列表
            getUsers() {
                this.$http.post(units.host('order'),{
                    switch:'list',
                    order:this.order,
                    page:this.page++
                }).then( function (res) {
                    this.users = res.data.info.data;
                    this.total = res.data.info.total;
                })
            },
            //删除
            handleDel: function (index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { id: row.id };
                    removeUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            },
            //显示编辑界面
            handleEdit: function (index, row) {
               location.href = '#/user/add?id='+row.user_id
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                this.addForm = {
                    name: '',
                    sex: -1,
                    age: 0,
                    birth: '',
                    addr: ''
                };
            },
            //编辑
            editSubmit: function () {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.editForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            editUser(para).then((res) => {
                                this.editLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['editForm'].resetFields();
                                this.editFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            //新增
            addSubmit: function () {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addLoading = true;
                            //NProgress.start();
                            let para = Object.assign({}, this.addForm);
                            para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
                            addUser(para).then((res) => {
                                this.addLoading = false;
                                //NProgress.done();
                                this.$message({
                                    message: '提交成功',
                                    type: 'success'
                                });
                                this.$refs['addForm'].resetFields();
                                this.addFormVisible = false;
                                this.getUsers();
                            });
                        });
                    }
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            //批量删除
            batchRemove: function () {
                var ids = this.sels.map(item => item.id).toString();
                this.$confirm('确认删除选中记录吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    //NProgress.start();
                    let para = { ids: ids };
                    batchRemoveUser(para).then((res) => {
                        this.listLoading = false;
                        //NProgress.done();
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getUsers();
                    });
                }).catch(() => {

                });
            }
        },
        mounted() {
            this.order = this.$route.query.order;
            this.getUsers();
        }
    }

</script>

<style scoped>

</style>
<template>
    <section class="pd10">
        <div class="h10"></div>
        <div class="top">
            <div class="left10"></div>
            <el-button type="primary" icon="search" @click="dialogFormVisible =! dialogFormVisible">
                新增群发
            </el-button>
        </div>
        <div class="h10"></div>
        <!--列表-->
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-table-column prop="from_uid" label="发件管理员ID" width="150" sortable>
            </el-table-column>
            <el-table-column prop="from_username" label="发件昵称" width="150" sortable>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="220" sortable>
            </el-table-column>
            <el-table-column prop="content" label="内容" width="350" sortable>
            </el-table-column>
            <el-table-column label="发送时间" width="180" sortable>
                <template scope="scope">
                    {{maketime(scope.row.date)}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template scope="scope">
                    <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Form -->
        <el-dialog title="新增消息" :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <el-input v-model="form.content"></el-input>
                </el-form-item>
                <el-form-item label="发送状态">
                    <el-select v-model="form.from_deleted" placeholder="请选择发送状态">
                        <el-option label="现在发送" value="1"></el-option>
                        <el-option label="稍后发送" value="0"></el-option>
                        <el-option label="暂不发送" value="-1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发送人昵称">
                    <el-input v-model="form.from_username"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">立即创建</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>
<script>
    import util from '../../common/js/util'
    import took from '../../tools/units'
    import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
    import units from '../../tools/units'
    export default {
        data() {
            return {
                uid:'',
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
                addFormVisible: false,//新增界面是否显示
                addLoading: false,
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
                dialogFormVisible:false,
                form: {
                    title: '',
                    content: '',
                    from_deleted: '',
                    from_username: '',
                }
            }
        },
        methods: {
            onSubmit() {
                let that = this;
                this.http('message/create',this.form,function (res) {
                    if(res.code > 0){
                        that.$message('发送成功');
                        that.dialogFormVisible = false;
                    }else{
                        that.$message(res.msg);
                    }
                });
            },
            maketime:function (t) {
                return took.maketimegs(t)
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
                let that = this;
                this.$http.post(units.domin('message/listd'),{
                    page:this.page++,
                    admin:1
                }).then( function (res) {
                    let t = res.data.info.data;
                    for(let x in t){
                        that.users.push(t[x]);
                    }
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
                    this.listLoading = false;
                    //NProgress.done();
                    this.$message({
                        message: '删除失败',
                        type: 'error'
                    });
                }).catch(() => {

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
            this.uid = this.$route.query.uid;
            this.getUsers();
        }
    }
</script>
<style scoped></style>
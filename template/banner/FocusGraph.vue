<template>
    <div class="focus-graph-page">
        <div v-if='!focusFlag'>
            <div class="add-focus-button">
                <el-button type="primary" @click.native='addFocusImg'>添加焦点图</el-button>
            </div>
            <!--列表-->
            <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="index" width="60">
                </el-table-column>
                <el-table-column prop="title" label="名称" min-width="80" sortable>
                </el-table-column>
                <el-table-column prop="banner" label="图片" width="800" sortable>
                    <template slot-scope="scope">
                        <img  :src="'http://h5.wwcrpt.com'+scope.row.banner" alt="" style="width: 150px;height: 70px">
                        <!-- <img src="../../assets/user.png" class="image">{{scope.row}} -->
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="150">
                    <template scope="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!--工具条-->
            <el-col :span="24" class="toolbar">
                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                <el-pagination
                        layout="prev, pager, next"
                        @current-change="handleCurrentChange"
                        :page-size="11" :total="total"
                        style="float:right;">
                </el-pagination>
            </el-col>
        </div>
        <!-- 添加焦点图 -->
        <div class="alert-box" v-if='focusFlag'>
            <span @click="close">X</span>
            <table class="focus-table">
                <tr>
                    <td class="table-name">焦点图名称</td>
                    <td><input type="text" v-model="form.imgName"></td>
                    <td></td>
                </tr>
                <tr>
                    <td class="table-name">图片</td>
                    <td><input type="text" v-model="form.imgUrl"></td>
                    <td>
                        <el-upload
                            class="upload-demo"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :limit="3"
                            :on-exceed="handleExceed"
                            :show-file-list = 'false'
                            :on-change = 'change'
                            :file-list="fileList">
                            <el-button type="primary" size='mini'>上传图片</el-button>
                        </el-upload>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td><el-button type="primary" size='small' @click.native='save'>保存</el-button></td>
                    <td></td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser } from '../../api/api';
import units from '../../tools/units'
export default {
    name: 'FocusGraph',
    data() {
        return {
            fileList: [{name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}, {name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'}],
            focusFlag: false,
            form: {
                imgName: '',
                imgUrl: ''
            },
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
            }
        }
    },
    methods: {
        addFocusImg () {//添加焦点图
            this.focusFlag = true
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getUsers();
        },
        //获取用户列表
        getUsers() {
            this.$http.post(units.damin('action/get_banner'),{
                page:this.page++
            }).then( function (res) {
                console.log(res)
                this.users = res.body;
                //this.total = res.data.info.total;
            })
            // this.$http.post(units.host('upload_banner', 'toolure'),{
            //     type: '1',  //1添加   2修改
            //     title: '小猪佩奇式笨蛋',
            //     page:this.page++
            // }).then( function (res) {
            //     // this.users = res.data.info.data;
            //     // this.total = res.data.info.total;
            //     console.log(res)
            // })
        },
        //删除
        handleDel: function (index, row) {
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => {
                this.listLoading = true;
                //NProgress.start();
                let para = { id: row.id };
                this.$http.post(units.damin('action/delete_banner'),para).then( function (res) {
                    console.log(res)
                    if(res.body > 0) {
                        this.$message('删除成功');
                        this.listLoading = false;
                        this.getUsers();
                    } else {
                         this.$message('删除失败');
                    }
                })
            }).catch(() => {

            });
        },
        //显示编辑界面
        handleEdit: function (index, row) {
            location.href = '#/banner/add?id='+row.id
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
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeRemove(file, fileList) {
            return this.$confirm(`确定移除 ${ file.name }？`);
        },
        change (par) {
            console.log(par)
            this.form.imgUrl = par.name
        },
        save() {//保存
            let that = this;
            for(let i in that.form){
                if(!that.form[i]){
                    alert('请输入完整信息')
                    return false;
                }
            }
            this.focusFlag = false
        },
        close () { //关闭
            this.focusFlag = false
        }
    },
    mounted() {
        this.getUsers();
        console.log('mounted')
    }
}
</script>

<style scoped lang='scss'>
    .add-focus-button{
        margin: 1rem;
    }
    .focus-table{
        width: 400px;
        height:200px;
        border-radius: 10px;
        margin: 100px auto;
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255,255,255,1);
        z-index: 9999;
        .table-name{
            text-align: right;
        }
    }
    .focus-graph-page{
        position: relative;
    }
    .alert-box{
        position: absolute;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        span{
            position: absolute;
            right:0;
            font-size: 30px;
            cursor: pointer;
        }
    }
</style>

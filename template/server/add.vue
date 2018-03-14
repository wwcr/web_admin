<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit" style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="服务标题">
            <el-input type="input" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
            <el-select v-model="form.cate" placeholder="请选择服务">
                <el-option label="找车服务" value="1"></el-option>
                <el-option label="车辆看护" value="2"></el-option>
            </el-select>
            <el-button icon="search">新增服务</el-button>
        </el-form-item>
        <el-form-item label="服务介绍">
            <el-input type="textarea" :rows="15"  v-model="form.content"></el-input>
            <vue-html5-editor :content="form.content" :height="300" v-if="false"></vue-html5-editor>
        </el-form-item>
        <el-form-item style="text-align:center">
            <el-button type="primary" @click="SendArticle">{{sendBtn}}</el-button>
            <el-button @click.native.prevent>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import units from '../../tools/units'
    export default {
        data() {
            return {
                form: {
                    name: '',
                    content:'',
                    editId:'',
                    sw:'add',
                    cate:''
                },
                sendBtn:'新增服务',
                catedata:[
                    {
                        "product_id": 1,
                        "product_name": "找车服务",
                        "product_addtime": "2017-07-28 11:05:27",
                        "soft": 0
                    },
                    {
                        "product_id": 2,
                        "product_name": "车辆看护",
                        "product_addtime": "2017-07-28 11:05:27",
                        "soft": 0
                    }
                ]
            }
        },
        watch:{
          'content':function () {
              console.log(this.content);
          }  
        },
        methods: {
            editData:function () {
                let  that = this;
                that.$http.post(units.host('getArticle'),{
                    sw:'once',
                    id:that.form.editId
                }).then( function (res) {
                    that.article = res.data.info;
                    that.form.name = this.article.art_title;
                    that.form.index = this.article.art_index == 1 ? true : false;
                    that.form.thumb = this.article.art_thumb;
                    that.form.desc = this.article.art_desc;
                    that.form.content = this.article.art_content;
                    that.form.cate = this.article.art_cate;
                    that.imageUrl = this.article.art_thumb;
                })
            },
            onSubmit() {
                console.log('submit!');
            },
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.form.thumb = res.info;
                console.log(this.form.thumb);
            },
            saveAddcate(){
                this.modal_loading = true;
                this.$http.post(units.host('server'),this.form).then( function (res) {
                    if(res.data.code > 0){
                        this.modal_loading = false;
                        this.$Message.success('新增成功');
                        this.getcate();
                    }else{
                        this.$Message.error('新增失败');
                        this.modal_loading = false;
                    }
                })
            },
            SendArticle:function () {
                this.saveAddcate()
            }
        },
        created:function () {
            this.form.editId = this.$route.query.id;
            if(this.form.editId){
                this.editData();
                this.sendBtn = '编辑文章';
            }
        }
    }

</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
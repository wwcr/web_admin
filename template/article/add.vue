<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit"
             style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="文章标题">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="选择分类">
            <el-select v-model="form.cate" placeholder="请选择文章分类">
                <el-option v-for="x in catedata" :label="x.cate_name" :value="x.cate_id"></el-option>
            </el-select>
            <el-button icon="search" @click="addcate">新增分类</el-button>
            <div class="add">
                <Modal v-model="addcateOpen" width="460">
                    <p slot="header" style="text-align:center">
                        <span>新增分类</span>
                    </p>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="分类名称">
                            <el-input v-model="cate.name"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form ref="form" :model="form" label-width="80px">
                        <el-form-item label="分类排序">
                            <el-input-number v-model="cate.number" :min="1" :max="10"></el-input-number>
                        </el-form-item>
                    </el-form>
                    <el-form-item label="是否可用">
                        <el-switch on-text="" off-text="" v-model="cate.okay"></el-switch>
                    </el-form-item>
                    <div slot="footer">
                        <Button type="info" size="large" long :loading="modal_loading" @click="saveAddcate">保存</Button>
                    </div>
                </Modal>
            </div>
        </el-form-item>
        <el-form-item label="封面设置">
            <el-upload
                    class="avatar-uploader"
                    :action="actionUrl"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                <img v-if="imageUrl" :src="imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="首页推荐">
            <el-switch on-text="" off-text="" v-model="form.index"></el-switch>
        </el-form-item>
        <el-form-item label="文章摘要">
            <el-input type="textarea" v-model="form.desc"></el-input>
        </el-form-item>
        <el-form-item label="文章正文" v-show="!addcateOpen">
            <div id="editorElem" style="text-align:left"></div>
        </el-form-item>
        <el-form-item style="text-align:center">
            <el-button type="primary" @click="SendArticle">{{sendBtn}}</el-button>
            <el-button @click.native.prevent>取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import units from '../../tools/units'
    import E from 'wangeditor'
    export default {
        data() {
            return {
                form: {
                    name: '',
                    index: '',
                    thumb: '',
                    desc: '',
                    content: '文章默认的内容',
                    cate: '',
                    editId: '',
                },
                cate: {
                    number: 1,
                    name: '',
                    okay: ''
                },
                imageUrl: '',
                addcateOpen: false,
                modal_loading: false,
                catedata: {},
                actionUrl: units.doname('tool/?act=upload'),
                article: {},
                sendBtn: '发布文章',
                editorContent: '',
                editor:{}
            }
        },
        watch: {
            'content': function () {
                console.log(this.content);
            },
            'editorContent': function () {
                this.form.content = this.editorContent;
            }
        },
        methods: {
            editData: function () {
                let that = this;
                that.$http.post(units.host('getArticle'), {
                    switch: 'once',
                    id: that.form.editId
                }).then(function (res) {
                    that.article = res.data.info;
                    that.form.name = this.article.art_title;
                    that.form.index = this.article.art_index == 1 ? true : false;
                    that.form.thumb = this.article.art_thumb;
                    that.form.desc = this.article.art_desc;
                    that.form.content = this.article.art_content;
                    that.form.cate = this.article.art_cate;
                    that.imageUrl = this.article.art_thumb;
                    that.editorContent =  this.article.art_content;
                    this.editor.txt.html(this.article.art_content);
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
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG) {
                    this.$message.error('上传图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
            getcate: function () {
                this.$http.post(units.host('getcate'), {}).then(function (res) {
                    this.catedata = res.data.info;
                })
            },
            addcate: function () {
                this.addcateOpen = !this.addcateOpen;
            },
            saveAddcate(){
                this.modal_loading = true;
                this.$http.post(units.host('addcate'), this.cate).then(function (res) {
                    if (res.data.code > 0) {
                        this.modal_loading = false;
                        this.addcateOpen = false;
                        this.$Message.success('新增成功');
                        this.getcate();
                    } else {
                        this.$Message.error('新增失败');
                        this.modal_loading = false;
                    }
                })
            },
            SendArticle: function () {
                if (!this.form.name) {
                    this.$message('请检查文章标题');
                    return false;
                }
                if (this.form.content.length <= 10) {
                    this.$message('文章内容不能少于10个字哦');
                    return false;
                }
                this.$http.post(units.host('addArticle'), this.form).then(function (res) {
                    if (res.data.code > 0) {
                        this.$message(res.data.info);
                        setTimeout(function () {
                            location.href = '#/article/list';
                        }, 3000)
                    } else {
                        this.$message(res.data.info);
                    }
                })
            }
        },
        created: function () {
            this.getcate();
            this.form.editId = this.$route.query.id;
            if (this.form.editId) {
                this.editData();
                this.sendBtn = '编辑文章';
            }
        },
        mounted() {
            var editor = new E('#editorElem');
            editor.customConfig.showLinkImg = true;
            editor.customConfig.uploadImgServer = units.doname('tool/?act=upload');
            editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            editor.customConfig.uploadFileName = 'file'
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {},
                success: function (xhr, editor, result) {},
                fail: function (xhr, editor, result) {},
                error: function (xhr, editor) {},
                timeout: function (xhr, editor) {},
                customInsert: function (insertImg, result, editor) {
                    var url = result.info;
                    insertImg('http://h5.wwcrpt.com'+url);
                }
            };
            editor.customConfig.onchange = (html) => {
                this.editorContent = html
            };
            editor.create()
            this.editor = editor;
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
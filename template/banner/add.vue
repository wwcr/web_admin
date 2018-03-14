<template>
    <el-form ref="form" :model="form" label-width="80px" @submit.prevent="onSubmit"
             style="margin:20px;width:60%;min-width:600px;">
        <el-form-item label="标题">
            <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="封面">
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
        <el-form-item label="正文" v-show="!addcateOpen">
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
                    // index: '',
                    thumb: '',
                    // desc: '',
                    content: '默认的内容',
                    // cate: '',
                    // editId: '',
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
                sendBtn: '添加',
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
            getEditData () {
                let {
                   editId
                } = this.form
                this.$http.post(units.damin('action/edit_banner'),{
                    id: editId
                }).then( function (res) {
                    this.article = res.body[0];
                    this.form.name = this.article.title;
                    this.form.thumb = this.article.banner;
                    this.form.content = this.article.content;
                    this.imageUrl = 'http://h5.wwcrpt.com'+this.article.banner;
                    this.editorContent =  this.article.content;
                    this.editor.txt.html(this.article.content);
                })
            },
            addcate: function () {
                this.addcateOpen = !this.addcateOpen;
            }, 
            SendArticle: function () {//新增焦点图
                let {
                   editId,
                   name ,
                   thumb ,
                   content
                } = this.form
                if (!this.form.name) {
                    this.$message('请检查焦点图标题');
                    return false;
                }
                if (this.form.content.length <= 10) {
                    this.$message('内容不能少于10个字哦');
                    return false;
                }
                if (this.form.editId) {
                    this.$http.post(units.damin('action/update_banner'),{
                        id: editId,
                        title: name,
                        banner: thumb,
                        content
                    }).then( function (res) {
                        if(res.body.length >0){
                            this.$message('编辑成功');
                            setTimeout(function () {
                                location.href = '#/banner/focusgraph';
                            }, 3000)
                        } else {
                            this.$message('编辑失败');
                        }
                    })
                }else {
                    this.$http.post(units.damin('action/add_banner'), this.form).then(function (res) {
                        if (res.body > 0) {
                            this.$message('添加成功');
                            setTimeout(function () {
                                location.href = '#/banner/focusgraph';
                            }, 3000)
                        } else {
                            this.$message('添加失败');
                        }
                    })
                }
            }
        },
        created: function () {
            this.form.editId = this.$route.query.id;
            if (this.form.editId) {
                this.getEditData()
                this.sendBtn = '重新编辑';
            }
        },
        mounted() {
            var editor = new E('#editorElem');
            editor.customConfig.showLinkImg = true;
            editor.customConfig.uploadImgServer = units.doname('tool/?act=upload');
            editor.customConfig.uploadImgMaxSize = 3 * 1024 * 1024;
            editor.customConfig.uploadFileName = 'file'
            editor.customConfig.uploadImgHooks = {
                before: function (xhr, editor, files) {
                    console.log('before')
                },
                success: function (xhr, editor, result) {
                    console.log('success')
                },
                fail: function (xhr, editor, result) {
                    console.log('fail')
                },
                error: function (xhr, editor) {
                    console.log('error')
                },
                timeout: function (xhr, editor) {
                    console.log('timeout')
                },
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
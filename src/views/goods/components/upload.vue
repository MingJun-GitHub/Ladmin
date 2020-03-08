<template>
    <div>
        <div class="demo-upload-list" v-for="(item,index) in uploadList" :key="index">
            <template v-if="item.status === 'finished'">
                <img :src="item.url" width="120" height="120">
                <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click="handleView(item.name)"></Icon>
                    <Icon type="ios-trash-outline" @click="handleRemove(item)"></Icon>
                </div>
            </template>
            <template v-else>
                <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
            </template>
        </div>
        <!-- {{defaultList}} -->
         <!-- :default-file-list="defaultList"  -->
        <Upload ref="upload" :show-upload-list="false"  :default-file-list="defaultList" :headers="headers"  :on-success="handleSuccess"
            :format="['jpg','jpeg','png']" :max-size="2048" :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize" :before-upload="handleBeforeUpload" multiple type="drag" name="imagefile"
            :action="url" style="display: inline-block;width:58px;">
            <div style="width: 58px;height:58px;line-height: 58px;">
                <Icon type="camera" size="20"></Icon>
            </div>
        </Upload>
        <Row>
            {{tips}}
        </Row>
    </div>
</template>

<script>
    export default {
        // 建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传10张
        props: {
            tips: String,
            length: {
                default: 10,
                type: Number,
            },
            defaultList: {}
        },
        data() {
            return {
                headers: {
                    token: this.$cookie.get('token') 
                },
                url: '/apiadmin/resource/qiniuUpload',
                uploadList: [],
                // defaultList: [
                //     {
                //         'name': 'a42bdcc1178e62b4694c830f028db5c0',
                //         'url': 'https://img.suxianfood.com/20200226222404620'
                //     },
                //     {
                //         'name': 'bc7521e033abdd1e92222d733590f104',
                //         'url': 'https://img.suxianfood.com/20200226222408932'
                //     }
                // ]
            }
        },
        methods: {
            // 商品上传图片
            handleView(name) {},
            handleRemove(file) {
                // 从 upload 实例删除数据
                const fileList = this.$refs.upload.fileList
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
                this.$emit('success', this.$refs.upload.fileList)
            },
            handleSuccess(res, file, fileList) {
                file.url = res.data.imgurl
                file.name = res.data.imgurl
                // this.uploadList = fileList
                // console.log('this.uploadLIst', this.uploadList)
                this.$emit('success', fileList)
                // this.$forceUpdate()
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: '文件格式不正确',
                    desc: '文件 ' + file.name + ' 格式不正确，请上传 jpg 或 png 格式的图片。'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 2M。'
                });
            },
            handleBeforeUpload() {

                const check = this.uploadList.length < this.length
                if (!check) {
                    this.$Notice.warning({
                        title: `最多只能上传 ${this.length} 张图片`
                    });
                }
                return check
            },
            handleUploadList() {
                this.uploadList = this.$refs.upload.fileList
                 this.$forceUpdate()
                console.log('this.$refs.upload.fileList', this.$refs.upload)
            }
        },
        mounted() {
            this.$nextTick(() => {
                this.uploadList = this.$refs.upload.fileList
            })
            // this.$forceUpdate()
        }
    }
</script>

<style lang="less" scoped>
    .demo-upload-list {
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
        margin-right: 4px;
    }

    .demo-upload-list img {
        width: 100%;
        height: 100%;
    }

    .demo-upload-list-cover {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, .6);
    }

    .demo-upload-list:hover .demo-upload-list-cover {
        display: block;
    }

    .demo-upload-list-cover i {
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
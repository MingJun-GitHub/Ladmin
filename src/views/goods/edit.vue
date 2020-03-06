<template>
    <div class="goods_edit">
        <Form ref="goodsForm" :model="goods" label-position="right" :label-width="120" style="max-width:50%;">
            <Card style="max-width:80%;">
                <p slot="title">{{isEdit?'编辑':'新增'}}商品</p>
                <FormItem label="商品类型">
                    <RadioGroup v-model="goods.productType">
                        <Radio :label="0" :checked.sync="goods.productType==0">实物商品（物流发货）</Radio>
                        <Radio :label="1" :checked.sync="goods.productType==1">虚拟商品（无需物流）</Radio>
                        <Radio :label="2" :checked.sync="goods.productType==2">生鲜果蔬商品（物流发货或同城送）</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem label="商品名">
                    <Input v-model="goods.title" placeholder="请输入商品名" />
                </FormItem>

                <FormItem label="商品描述/卖点">
                    <Input v-model="goods.productDescription" :maxlength="150" show-word-limit type="textarea"
                        placeholder="请输入商品卖点" style="width: 100%" />
                </FormItem>

                <FormItem label="商品图">
                    <uploads ref="upload" @success="getThumbDetails" :defaultList="thumbsDetails" :length="10"
                        tips="建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传10张" />
                </FormItem>

                <FormItem label="商品分组">
                    <Select v-model="goods.productGroupNameId">
                        <Option v-for="(item,index) in productGroupNameList" :value="item.id" :key="index"
                            :checked.sync="goods.productGroupNameId==item.id">
                            {{item.productGroupName}}</Option>
                    </Select>
                </FormItem>

                <FormItem label="商品详情图">
                    <uploads ref="upload2" @success="getProductDetails" :defaultList="productDetails" :length="15"
                        tips="建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张" />
                </FormItem>
            </Card>
            <Card style="margin-top:20px;">
                <p slot="title">价格库存</p>
                <FormItem label="价格">
                    <Input v-model="goods.price" style="max-width:30%;" placeholder="请输入价格" type="number" />
                </FormItem>
                <FormItem label="划线价">
                    <Input v-model="goods.deletePrice" style="max-width:30%;" placeholder="请输入价格" type="number" />
                </FormItem>
                <FormItem label="库存">
                    <Input v-model="goods.stockNum" style="max-width:30%;" placeholder="请输入价格" />
                </FormItem>
                <FormItem label="商品规格">
                    <Button type="success" @click="addSkuName">添加商品规格</Button>
                    <Dropdown @on-click="getDropItem" trigger="click">
                        <Button type="primary">
                            选择商品规格
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>

                        <DropdownMenu slot="list">
                            <DropdownItem :name="index" v-for="(item,index) in skuNameList" :key="index"
                                :disabled="item.disabled">{{item.skuKeyName}}</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Row v-if="selectSku.length">
                        <Col span="24">
                        <div class="sku_val" v-for="(item,index) in selectSku" :key="index" style="maring-top: 20px;">
                            <div>{{item.skuKeyName}} <Button type="primary" size="small"
                                    @click="addSkuSubName(index, item.skuNameId)">添加规格值</Button><Button type="primary"
                                    size="small" @click="deleteSkuTag(index)">删除</Button></div>
                            <div style="maring-top: 10px;">
                                <Tag v-for="(item2, index2) in item.subList" :key="index2" closable
                                    @on-close="deleteSkuName(index, index2)">
                                    {{item2.skuValue}}</Tag>
                            </div>
                        </div>
                        </Col>
                    </Row>
                    <Row v-if="allSkuComList.length" style="boder:1px solid #cfcfcf;">
                        <Col span="24">
                        <div class="sku_item" v-for="(item,index) in allSkuComList" :key="index"
                            style="maring-top: 20px;">
                            <div class="cname">组合（{{index+1}}）：<span v-for="(item2, index2) in item.list"
                                    :key="index2">{{item2.skuValue}}&nbsp;&nbsp;&nbsp;&nbsp;</span></div>
                            <Input v-model="item.price" :maxlength="100" show-word-limit type="number" placeholder="价格"
                                style="width:100px" required />
                            <Input v-model="item.costPrice" :maxlength="100" show-word-limit type="number"
                                placeholder="划线价" style="width: 100px" required />
                            <Input v-model="item.stockNum" :maxlength="100" show-word-limit type="number"
                                placeholder="库存" style="width: 100px" required />
                        </div>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="addGoods">{{productId?'编辑保存': '新增商品'}}</Button>
                </FormItem>
            </Card>
        </Form>
    </div>
</template>

<script>
    import _ from 'lodash'
    import uploads from './components/upload'
    export default {
        name: '',
        data() {
            return {
                border: 0,
                goods: {
                    title: '', // 商品名
                    categoryType: 0, // 商品分类
                    deletePrice: 0, // 划线价
                    price: 0, // 价格 （单位分）
                    productDescription: "",
                    productGroupNameId: 0, // 商品组分类id
                    productStatus: 0, // 商品状态
                    productType: 0, // 商品类型
                    stockNum: 0, // 库存
                    // thumb: "", 
                    // 商品封面图
                    thumbsDetails: [],
                    // 商品详情图
                    productDetails: []
                },
                productId: '',
                productGroupNameList: [],
                skuName: '', // 规格名
                defaultList: [],
                thumbsDetails: [],
                productDetails: [],
                uploadList: [],
                skuNameList: [], // 
                skuValue: '',
                productGroupList: [],
                selectSku: [],
                skuSpec: [], // 选中规格名
                allSkuList: [], // 选中所有规格列表
                allSkuComList: [], // 所有规格什列表组合
                saveSkuList: [],
                isEdit: false
            }
        },
        components: {
            uploads,
        },
        watch: {
            selectSku: {
                handler(val, oldval) {
                    // console.log('val--<', val)
                    var allSkuList = []
                    var skuSpec = []
                    val.map((item, index) => {
                        skuSpec.push({
                            productId: this.productId,
                            skuNameId: item.skuNameId,
                            skuName: item.skuKeyName,
                            ks: `s${index+1}`
                        })
                        allSkuList.push(item.subList)
                    })
                    this.skuSpec = skuSpec
                    this.allSkuList = allSkuList || []
                    this.allSkuComList = this.dealData(allSkuList)

                    if (this.productId && this.saveSkuList.length) {
                        this.allSkuComList.map((item, index) => {
                            item.stockNum = this.saveSkuList[index].stockNum
                            item.costPrice = this.saveSkuList[index].costPrice
                            item.price = this.saveSkuList[index].price
                        })
                        this.saveSkuList = [] // 处理完删除
                    }

                    console.log('处理数据', this.allSkuComList)
                },
                deep: true //对象内部的属性监听，也叫深度监听
            }
        },
        async mounted() {
            console.log('this.router', this.$route)
            this.productId = this.$route.params.id || ''
            this.isEdit = !!this.productId
            this.getAllSkuName() // 列出商品规格
            await this.getProductGroupNameId()
            this.productId && await this.getProductInfo()
        },
        methods: {
            // 获取商品信息
            async getProductInfo() {
                const res = await this.$axios.get(`/apiadmin/product/findProductInfoById/${this.productId}`)
                console.log('res', res)
                if (res.code == 0 && res.data.data) {
                    this.goods = res.data.data
                    this.goods.productGroupNameId = Number(this.goods.productGroupId)
                    this.goods.productType = Number(this.goods.productType)
                    await this.AllImage()
                    this.getProductSkuInfo()

                }
            },
            async AllImage() {
                const res = await this.$axios.get(
                    `/apiadmin/product/findProductDetailByProductId/${this.productId}`)
                this.thumbsDetails = res.data.thumbsDetails.map(item => {
                    return {
                        name: item.imgurl,
                        url: item.imgurl
                    }
                })
                this.productDetails = res.data.productDetails.map(item => {
                    return {
                        name: item.imgurl,
                        url: item.imgurl
                    }
                })
                this.goods.thumbsDetails = _.cloneDeep(this.thumbsDetails)
                this.goods.productDetails = _.cloneDeep(this.productDetails)
                this.foraceUpdate()
            },
            async getProductSkuInfo() {
                const res = await this.$axios.get(`/apiadmin/product/findSkuInfoByProductId/${this.productId}`)
                if (res.code == 0) {
                    res.data.skuInfoProductVos.map((item, index) => {
                        item.skuGroupValues.map(item2 => {
                            item2[`s${index+1}`] = item2.id
                        })
                        item.subList = item.skuGroupValues
                    })
                    this.selectSku = res.data.skuInfoProductVos
                    this.saveSkuList = res.data.skuGroups
                }
            },
            foraceUpdate() {
                this.$forceUpdate()
                setTimeout(() => {
                    this.$refs.upload2.handleUploadList()
                    this.$refs.upload.handleUploadList()
                }, 10)

            },
            getThumbDetails(data) {
                // var getUrl = []
                // data.map(item => {
                //     getUrl.push({
                //         imgType: 1,
                //         imgurl: item.url,
                //         status: item.status
                //     })
                // })
                this.goods.thumbsDetails = data
            },
            getProductDetails(data) {
                // var getUrl = []
                // data.map(item => {
                //     getUrl.push({
                //         imgType: 2,
                //         imgurl: item.url,
                //         status: item.status
                //     })
                // })
                this.goods.productDetails = data
                // console.log('gods', this.goods.productDetails)
            },
            dealData(allSkuList) {
                if (!allSkuList.length) {
                    return []
                }
                var saveData = this.cartesianData(...allSkuList)
                var saveObj = []
                saveData.map(item => {
                    let obj = _.cloneDeep(item)
                    obj = obj.reduce((pre, next) => {
                        return Object.assign(pre, next)
                    })
                    delete obj.id
                    delete obj.name
                    saveObj.push(Object.assign({
                        list: item,
                        stockNum: '',
                        price: '',
                        productId: '',
                        costPrice: '',
                        s1: 0,
                        s2: 0,
                        s3: 0
                    }, obj))
                })
                return saveObj
            },
            cartesianData() {
                return Array.prototype.reduce.call(arguments, (a, b) => {
                    var ret = []
                    a.forEach((a, index) => {
                        b.forEach((b, index2) => {
                            ret.push(a.concat([b]))
                        })
                    })
                    return ret
                }, [
                    []
                ])
            },
            // 获取商品分组信息
            async getProductGroupNameId() {
                const res = await this.$axios.get('/apiadmin/productGroupName/listProductGroupName')
                if (res.code == 0) {
                    res.data.map(item => {
                        item.id = Number(item.id)
                    })
                    this.productGroupNameList = res.data
                    if (!this.productId) {
                        this.goods.productGroupNameId = res.data[0].id
                    }
                }
                console.log('商品分组信息', res)
            },
            // 列出商品规格
            async getAllSkuName() {
                const res = await this.$axios.get('/apiadmin/skuname/listAllSkuName')
                res.data.map(item => {
                    item.disabled = false
                    item.subList = []
                })
                this.skuNameList = res.data // 所有sku
            },

            async getDropItem(e) {
                console.log('e', e, this.selectSku)
                if (this.selectSku.length >= 3) {
                    this.$Message.error({
                        background: true,
                        content: '不能设置超过3个规格名'
                    })
                    return
                }
                var hasSelect = false
                for(let i =0; i<this.selectSku.length; i++) {
                    if (this.selectSku[i].skuKeyName == this.skuNameList[e].skuKeyName) {
                        hasSelect = true
                        break
                    } else {
                        hasSelect = false
                    }
                }
                if (hasSelect) {
                    this.$Message.error({
                        content: '已经选择过了，请不要重复选'
                    })
                    return
                }
                this.skuNameList[e].disabled = false
                this.skuNameList[e].skuNameId = this.skuNameList[e].id
                this.selectSku.push(this.skuNameList[e])
            },
            // 添加一个规格名
            addSkuName() {
                this.skuName = null
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.skuName,
                                autofocus: true,
                                placeholder: '请输入商品规格名'
                            },
                            on: {
                                input: (val) => {
                                    this.skuName = val
                                    console.log('this.skuname', this.skuName)
                                }
                            }
                        })
                    },
                    onOk: async () => {
                        if (!this.skuName) {
                            this.$Message.error({
                                content: '请输入规格值'
                            })
                            return
                        }
                        const res = await this.$axios.post('/apiadmin/skuname/addSkuName', {
                            previewImgUrl: '',
                            skuKeyName: this.skuName,
                        })
                        res.code == 0 ? this.$Message.success({
                            content: '添加成功'
                        }) : this.$Message.success({
                            content: '添加失败'
                        })
                        await this.getAllSkuName()
                        for (let i =0; i < this.skuNameList.length; i++) {
                            if (res.data.id == this.skuNameList[i].id) {
                                this.getDropItem(i)
                                break
                            }
                        }
                    }
                })
            },
            // 添加规格值
            addSkuSubName(index, skuNameId) {
                this.$Modal.confirm({
                    render: (h) => {
                        return h('Input', {
                            props: {
                                value: this.skuValue,
                                autofocus: true,
                                placeholder: '请输入规格值'
                            },
                            on: {
                                input: (val) => {
                                    this.skuValue = val
                                }
                            }
                        })
                    },
                    onOk: async () => {
                        var hasRepeat = false
                        for (let i = 0; i < this.selectSku[index].subList.length; i++) {
                            if (this.selectSku[index].subList[i].name == this.skuValue) {
                                hasRepeat = true
                                break
                            } else {
                                hasRepeat = false
                            }
                        }
                        if (hasRepeat) {
                            this.$Message.error({
                                background: true,
                                content: '不能添加重复规格值'
                            })
                            this.skuValue = ''
                            return
                        }
                        await this.addOneSku(index, skuNameId, this.skuValue)
                        this.skuValue = ''
                    },
                    onCancel: async () => {
                        this.skuValue = ''
                    }
                })
            },
            deleteSkuName(index, index2) {
                this.selectSku[index].subList.splice(index2, 1) // 删除
            },
            deleteSkuTag(index) {
                this.selectSku.splice(index, 1)
            },
            // 添加一个sku
            async addOneSku(index, skuNameId, skuValue) {
                const res = await this.$axios.post('/apiadmin/skuGroupValue/addSkuGroupValue', {
                    skuNameId,
                    skuValue
                })
                this.selectSku[index].subList.push({
                    id: res.data.id,
                    skuValue,
                    [`s${index+1}`]: res.data.id
                })
            },
            checkInput() {
                if (this.goods.title == "") {
                    this.$Message.error({
                        content: '请输入商品名'
                    })
                    return
                }
                if (this.goods.thumbsDetails.length <= 0) {
                    this.$Message.error({
                        content: '请上传商品图'
                    })
                    return
                }
                if (this.goods.productDetails.length <= 0) {
                    this.$Message.error({
                        content: '请上传商品详情图'
                    })
                    return
                }
                if (this.goods.price == '') {
                    this.$Message.error({
                        content: '请输入价格'
                    })
                    return
                }
                if (this.goods.deletePrice == '') {
                    this.$Message.error({
                        content: '请输入划线价格'
                    })
                    return
                }
                if (this.goods.stockNum == '') {
                    this.$Message.error({
                        content: '请输入商品库存'
                    })
                    return
                }
                return true
            },
            // 添加商品
            async addGoods() {
                if (!this.checkInput()) {
                    return
                }
                let productDetails = []
                this.goods.productDetails.map(item => {
                    productDetails.push({
                        imgType: 2,
                        imgurl: item.imgurl || item.url,
                    })
                })
                let thumbsDetails = []
                this.goods.thumbsDetails.map(item => {
                    thumbsDetails.push({
                        imgType: 1,
                        imgurl: item.imgurl || item.url
                    })
                })
                var params = _.cloneDeep(this.goods)
                params = Object.assign(params, {thumbsDetails, productDetails})
                console.log('params--<', params)
                const posturl = this.productId ? `/apiadmin/product/updateProductInfo` :
                    `/apiadmin/product/addProductInfo`
                const res = await this.$axios.post(posturl, params)

                this.productId = this.productId || res.data.id
                this.skuSpec.map(item => {
                    item.productId = this.productId
                })
                this.allSkuComList.map(item => {
                    delete item.list
                    item.productId = this.productId
                })

                const res2 = await this.$axios.post('/apiadmin/productSku/addProductSku', this.skuSpec)
                console.log('添加商品与规格关联', res)
                const res3 = await this.$axios.post('/apiadmin/skugroup/addSkuGroups', this.allSkuComList)
                this.$Message.success({
                    content: this.isEdit ? '编辑商品成功' : '新建商品成功'
                })
                setTimeout(() => {
                    this.$router.replace('/goods')
                    // this.$router.back()
                }, 1500)
            }
        }
    }
</script>

<style lang="less">
    .sku_val {
        margin: 12px 0;
    }

    .sku_item {
        display: flex;
        justify-content: space-around;
        align-items: center;
        border: 1px solid #cfcfcf;
        padding: 10px;
        margin-top: 12px;

        .cname {
            width: 160px;

        }

        input {
            margin-left: 12px;
        }
    }
</style>
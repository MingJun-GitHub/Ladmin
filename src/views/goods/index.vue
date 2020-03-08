<template>
    <div class="goods_list">
        <div class="goods_list__search" style="max-width: 100%;">
            <Card :bordered="true" style="width: 55%;">
                <p slot="title">搜索筛选</p>
                <!--:rules=""-->
                <Form style="max-width: 60%;" ref="goodsSearch" :model="searchData" label-position="right"
                    :label-width="70" inline>
                    <FormItem label="商品名称">
                        <Input v-model="searchData.title" />
                    </FormItem>
                    <!-- <FormItem label="商品分类">
                        <Select v-model="searchData.index">
                            <Option v-for="item in goodsType" :value="item" :key="item"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="商品类型">
                        <Select v-model="searchData.index">
                            <Option v-for="item in goodsType" :value="item" :key="item"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="价格">
                        <Row :gutter="16">
                            <Col span="10">
                            <Input v-model="searchData.keywords" type="number">
                            <span slot="append">元</span>
                            </Input>
                            </Col>
                            <Col span="2">——</Col>
                            <Col span="10">
                            <Input v-model="searchData.keywords" type="number">
                            <span slot="append">元</span>
                            </Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="销量">
                        <Row :gutter="16">
                            <Col span="10">
                            <Input v-model="searchData.keywords" type="number">
                            </Input>
                            </Col>
                            <Col span="2">——</Col>
                            <Col span="10">
                            <Input v-model="searchData.keywords" type="number">
                            </Input>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="库存扣减方式">
                        <Select v-model="searchData.index">
                            <Option v-for="item in goodsType" :value="item" :key="item"></Option>
                        </Select>
                    </FormItem>
                    <FormItem label="商品状态">
                        <Select v-model="searchData.index">
                            <Option v-for="item in goodsType" :value="item" :key="item"></Option>
                        </Select>
                    </FormItem> -->
                    <FormItem label="" :label-width="10">
                        <Button type="primary" class="search_btn" @click="goSearch">查询</Button>
                        <Button type="primary" class="search_btn" @click="resetSearch">重置查询条件</Button>
                        <Button type="primary" class="search_btn" @click="goGoods('')">发布商品</Button>
                    </FormItem>
                </Form>
            </Card>
        </div>
        <div class="goods_list__item" style="margin-top: 20px; max-width: 86%;" >
            <Card :bordered="true">
                <p slot="title">商品列表</p>
                    <!-- <Checkbox :checked.sync="single">当前页全选</Checkbox> -->
                    <!-- <Button>上架</Button>  -->
                    <!-- <Button>下架</Button> -->
                    <!-- <Button>删除</Button> -->
                
                <Table border ref="selection" :columns="columns" :data="goodsList">
                    <template slot-scope="{ row, index }" slot="thumbs">
                        <img :src="row.thumb" width="100" height="auto" />
                    </template>
                    <template slot-scope="{ row, index }" slot="options">
                        <Button type="primary" size="small" @click="goGoods(row.id)">编辑</Button>
                        <!-- <Button type="error" size="small" @click="deleteGoods(row.id)">删除</Button> -->
                        <Button type="warning" size="small" @click="downGoods(row.id)">下架</Button>
                    </template></Table>
                <Row class="pages">
                    <Col :span="24">
                    <Page :total="total" :page-size="searchData.pageSize" class="pages_bar" size="small" show-total
                        @on-change="setPage" />
                    </Col>
                </Row>
            </Card>
        </div>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                columns: [
                    /*
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    */
                    {
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '商品名',
                        key: 'title'
                    },
                    {
                        title: '图片',
                        slot: 'thumbs'
                    },
                    {
                        title: '价格',
                        key: 'price'
                    },
                    {
                        title: '库存',
                        key: 'stockNum'
                    },
                    // {
                    //     title: '销量',
                    //     key: 'sale'
                    // },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作',
                        slot: 'options'
                    },
                ],
                total: 0,
                goodsList: [],
                single: false,
                goodsType: ['全部', '分类1', '分类2'],
                searchData: {
                    pageNo: 1,
                    pageSize: 15,
                    title: ''
                    // productStatus: '',
                    // productGroupId: '',
                    // categoryType: ''
                }
            }
        },
        methods: {
            async goSearchList() {
                const res = await this.$axios.get(
                    '/apiadmin/product/listProductPage', {
                        params: this.searchData
                    })
                this.goodsList = res.data.records
                this.total = Number(res.data.total || 0)
                this.$forceUpdate()
            },
            goSearch() {
                this.searchData.pageNo = 1
                this.goSearchList()
            },
            resetSearch() {
                this.searchData = {
                    pageNo: 1,
                    pageSize: 15,
                    title: ''
                }
                this.goSearchList()
            },
            goGoods(id) {
                this.$router.push({
                    path: `/goods/edit/${id}`
                })
            },
            setPage(index) {
                this.searchData.pageNo = index
                this.goSearchList()
            },
            async deleteGoods(id) {
                this.$Modal.confirm({
                    content: '确定要删除嘛？',
                    onOk: async () => {
                        const res = await this.$axios.get(`/apiadmin/product/delete/${id}`)
                        if (res.code == 0 && res.data) {
                            this.$Message.success({
                                content: '删除成功'
                            })
                        }
                        await this.goSearchList()
                    }
                })
            },
            downGoods(id) {
                this.$Modal.confirm({
                    content: '确定要下架商品嘛？',
                    onOk: async () => {
                        const res = await this.$axios.get(`/apiadmin/product/downProductInfoById//${id}`)
                        if (res.code == 0 && res.data) {
                            this.$Message.success({
                                content: '下架成功'
                            })
                        }
                        await this.goSearchList()
                    }
                })
            }
        },
        async mounted() {
            // console.log('this-router', this.$route)
            await this.goSearchList()
        }
    }
</script>
<style lang="less" scoped>
    .pages {
        margin: 20px auto 0;
        display: flex;
        flex: 1;
        justify-content: flex-end;
        align-items: center;

        &_bar {
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }
    .search_btn{
            margin-right: 12px;
        }
</style>
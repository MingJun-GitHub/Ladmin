<template>
    <div class="setup">
        <Card :bordered="true" style="width: 80%;">
            <p slot="title">订单筛选</p>
            <!--:rules=""-->
            <Form style="max-width: 100%;" ref="goodsSearch" :model="searchData" label-position="right"
                :label-width="100" inline>
                <FormItem label="订单号">
                    <Input v-model="searchData.orderId" type="text" />
                </FormItem>
                <FormItem label="买家名称（真实名称）" :label-width="140">
                    <Input v-model="searchData.customerName" type="text" />
                </FormItem>
                <FormItem label="买家电话">
                    <Input v-model="searchData.customerPhone" type="text" />
                </FormItem>
                <FormItem label="开始时间">
                    <DatePicker type="date" placeholder="选择开始时间" style="width: 200px" @on-change="setStartTime">
                    </DatePicker>
                </FormItem>
                <FormItem label="结束时间">
                    <DatePicker type="date" placeholder="选择结束时间" style="width: 200px" @on-change="setEndTime">
                    </DatePicker>
                </FormItem>
                <FormItem label="商品名称">
                    <Input v-model="searchData.productName" type="text" />
                </FormItem>
                <FormItem label="配送类型">
                    <Select v-model="searchData.deliverType" style="width:200px">
                        <Option v-for="item in deliverType" :value="item.value" :key="item.value"
                            :ckecked="item.value ==searchData.deliverType">{{ item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="订单状态">
                    <Select v-model="searchData.orderStatus" style="width:200px">
                        <Option v-for="item in orderStatus" :value="item.value" :key="item.value"
                            :ckecked="item.value ==searchData.orderStatus">{{ item.label }}</Option>
                    </Select>

                </FormItem>
                <FormItem label="支付类型">
                    <Select v-model="searchData.payType" style="width:200px">
                        <Option v-for="item in payType" :value="item.value" :key="item.value"
                            :ckecked="item.value ==searchData.payType">{{ item.label }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="" :label-width="20">
                    <Button type="primary" style="margin-right: 15px;" @click="goSearch">查询</Button>
                    <Button type="primary" @click="resetParams">重置查询条件</Button>
                </FormItem>
            </Form>
        </Card>
        <div style="margin-top: 20px;max-width: 80%;">
            <Card :bordered="true">
                <Table border ref="selection" :columns="columns" :data="orderList">
                    <!--slot-scope="{ row, index }"-->
                    <template slot-scope="{ row, index }" slot="orderDetails">
                        <div class="goods" v-for="(item,idx) in row.orderDetails" :key="idx">
                            <div class="pic"><img :src="item.thumb" width="80" height="auto"></div>
                            <div class="info">
                                <div class="title">{{item.productName}}</div>
                                <div class="desc">{{jsonParse(item.skuMsg)}}</div>
                                <div class="num">{{item.productQuantity}}</div>
                            </div>
                        </div>
                    </template>
                    <template slot-scope="{ row, index }" slot="receiveAddress">
                        {{row.receiveAddress?'': '暂无'}}
                    </template>
                    <template slot-scope="{ row, index }" slot="orderStatus">
                        {{orderStatus[row.orderStatus-1].label|| '其它'}}
                    </template>
                    <template slot-scope="{ row, index }" slot="options">
                        <Button type="primary" size="small" @click="goOrderDetails(row,index)">查看详情</Button>&nbsp;
                        <Button type="primary" size="small" @click="setDeliver(row,index)">发货</Button>
                    </template></Table>
                </Table>
                <Row class="pages">
                    <Col :span="24">
                    <Page :total="total" :page-size="searchData.pageSize" class="pages_bar" size="small" show-total
                        @on-change="setPage" />
                    </Col>
                </Row>
            </Card>
        </div>
        <Modal v-model="showModel" title="温馨提示" @on-ok="deliverGoods" @on-cancel="showModel=false">
            <Form style="max-width: 90%;" label-position="right" :label-width="90">
                <FormItem label="订单号">
                    <Input v-model="orderId" :disabled="true" type="text" />
                </FormItem>
                <FormItem label="快递信息">
                    <Input v-model="expressNO" type="textarea" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    var searchData = {
        orderId: '',
        customerName: '',
        customerPhone: '',
        beginDate: '',
        endDate: '',
        productName: '',
        deliverType: '',
        orderStatus: 1, // null 全部 0 待付款,1待发货，2已发货，3已完成，4已关闭，5退款中，6已退款,8付款中
        payType: 1, // 1微信 2。货到付款
        pageSize: 20,
        pageNo: 1
    }
    export default {
        name: '',
        data() {
            return {
                showModel: false,
                orderId: '',
                expressNO: '',
                payType: [{
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '微信支付'
                    },
                    {
                        value: 2,
                        label: '货到付款'
                    }
                ],
                // 1、查询 0,待付款,''全部订单
                // /orderDetail/findPage
                // 2、查询1待发货，2已发货，3已完成，4已关闭，5退款中，6已退款
                // /snapshotorder/findPage
                orderStatus: [{
                        value: 1,
                        label: '待发货'
                    },
                    {
                        value: 2,
                        label: '已发货'
                    },
                    {
                        value: 3,
                        label: '已完成'
                    }, {
                        value: 4,
                        label: '已关闭'
                    }, {
                        value: 5,
                        label: '退款中'
                    }, {
                        value: 6,
                        label: '已退款'
                    }
                ],
                orderName: [0, '待发货', '已发货', '已完成', '已关闭', '退款中', '已退款'],
                orderType: [{
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '普通订单'
                    },
                    {
                        value: 1,
                        label: '代付订单'
                    }
                ],
                deliverType: [{
                        value: '',
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '同城配送'
                    },
                    {
                        value: 1,
                        label: '快递发货'
                    }
                ],
                searchData,
                columns: [{
                        title: '订单号',
                        key: 'orderId'
                    },
                    {
                        title: '购买商品',
                        slot: 'orderDetails'
                    },
                    {
                        title: '单位（元）/数量',
                        key: 'orderId'
                    },
                    {
                        title: '买家/收货人',
                        slot: 'receiveAddress'
                    },
                    {
                        title: '配送方式',
                        key: 'expressName'
                    },
                    {
                        title: '实付金额',
                        key: 'totalMoney'
                    },
                    {
                        title: '订单状态',
                        slot: 'orderStatus'
                    },
                    {
                        title: '操作',
                        slot: 'options'
                    },
                ],
                total: 0,
                orderList: [],
                wechatStatus: false,
                cashStatus: false
            }
        },
        methods: {
            jsonParse(str) {
                return JSON.parse(str).skuSelectStr
            },
            setStartTime(e) {
                this.searchData.beginDate
            },
            setEndTime(e) {
                this.searchData.endDate
            },
            changeWechatStatus() {
                this.wechatStatus = !this.wechatStatus
            },
            changeCashStatus() {
                this.cashStatus = !this.cashStatus
            },
            async getOrderList() {

                const res = await this.$axios.get('/apiadmin/orderDetail/findPage', {
                    params: Object.assign({}, this.searchData, {
                        payType: this.searchData.payType == -1 ? '' : this.searchData.payType,
                        payType: this.searchData.deliverType == -1 ? '' : this.searchData
                            .deliverType
                    })
                })
                res.data.records.map(item => {
                    item.receiveAddress = item.receiveAddress ? JSON.parse(item.receiveAddress) : null
                })
                this.orderList = res.data.records || []
                this.total = Number(res.data.total || 0)
            },
            goSearch() {
                this.searchData.pageNo = 1
                this.getOrderList()
            },
            resetParams() {
                this.searchData = searchData
                this.getOrderList()
            },
            setDeliver(row, index) {
                this.showModel = true
                this.orderId = row.orderId
                this.expressNO = null
            },
            async deliverGoods(row, index) {
                // /orderDetail/deliverGoods
                const res = await this.$axios.post('/apiadmin/orderDetail/deliverGoods', {
                    orderId: this.orderId,
                    expressNO: this.expressNO
                })
                console.log('res, res', res)
            },
            setPage(index) {
                this.searchData.pageNo = index
                this.getOrderList()
            },
            goOrderDetails(row) {
                this.$router.push({
                    path: `/order/details/${row.orderId}`
                })
            }
        },
        mounted() {
            this.getOrderList()
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

    .goods {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        white-space: nowrap;
        flex-wrap: nowrap;
        padding: 10px;
        border: 1px solid #cfcfcf;
        background: #efefef;
        margin: 10px;
        width: 100%;

        .info {
            margin-left: 10px;
            white-space: nowrap;
        }
    }
</style>
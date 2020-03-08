<template>
    <div class="setup" style="max-width:65%;">
        <!-- 1. 待发货
        2. 已发货
        3. 已完成
        4. 已关闭
        5. 退款中
        6. 已退款 -->
        <Card :bordered="true">
            <p slot="title">订单状态</p>
            <Steps :current="1" v-if="orderInfo.orderStatus==1">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="商家未发货"></Step>
            </Steps>

            <Steps :current="2" v-if="orderInfo.orderStatus==2">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="卖家已发货"></Step>
            </Steps>

            <Steps :current="3" v-if="orderInfo.orderStatus==3">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="卖家已发货"></Step>
                <template v-if="orderInfo.orderStatus==3">
                    <Step title="交易完成"></Step>
                </template>
            </Steps>

            <Steps :current="2" v-if="orderInfo.orderStatus==4">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="订单关闭"></Step>
            </Steps>

            <Steps :current="2" v-if="orderInfo.orderStatus==5">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="退款中"></Step>
            </Steps>

            <Steps :current="2" v-if="orderInfo.orderStatus==6">
                <Step title="买家下单" :content="'下单时间-'+orderInfo.createTime"></Step>
                <Step title="买家已付款" :content="orderInfo.payType==0?'微信支付':'货到付款'"></Step>
                <Step title="已退款"></Step>
            </Steps>
        </Card>
        <div style="margin-top: 20px;">
            <Card :bordered="true">
                <div class="order">
                    <div class="order_info">
                        <h4>订单详情</h4>
                        <div>
                            <label>订单编号：</label>
                            <span>{{orderInfo.orderId}}</span>
                        </div>

                        <div>
                            <label>支付方式：</label>
                            <img v-if="orderInfo.payType==0" width="100" src="../../assets/images/wechat_pay.png">
                            <img v-else width="90" src="../../assets/images/cash_pay.png">
                        </div>

                        <div>
                            <label>下单时间：</label>
                            <span>{{orderInfo.createTime}}</span>
                        </div>
                        <div>
                            <label>配送方式：</label>
                            <span>{{orderInfo.expressName}}</span>
                        </div>
                        <div>
                            <label>收件人：</label>
                            <span> {{address.receiver}} </span>
                        </div>
                        <div>
                            <label>联系方式：</label>
                            <span> {{address.phone}} </span>

                        </div>
                        <div>
                            <label>收件地址：</label>
                            <span>{{address.provice}}/{{address.city}}/{{address.area}}
                                <br />{{address.addressName+address.addressDetail}}
                            </span>
                        </div>
                        <div>
                            <label>买家留言：</label>
                            <span>{{orderInfo.mark || '暂无备注信息'}}</span>
                        </div>
                        <div>
                            <label>订单金额：</label>
                            <span style="color:red;">{{orderInfo.totalMoney}}
                            </span>
                        </div>
                    </div>
                    <div class="order_status">
                        <h4>订单状态: <Button type="primary" size="small">{{status[orderInfo.orderStatus]}}</Button></h4>
                        <p class="status" v-if="orderInfo.orderStatus==1">买家已经下单成功，请尽快发货，否则买家有权申请退款。</p>
                        <p class="status" v-if="orderInfo.orderStatus==2">发货成功，快递单号为:{{orderInfo.expressNo}}</p>
                        <div v-if="orderInfo.orderStatus==1"><Button type="success" @click="showModel=true">点击发货</Button>&nbsp; &nbsp; <Button
                                type="warning" v-if="false">点击发货</Button>
                        </div>
                        <div class="tips">
                            <h4>提醒：</h4>
                            <p>如果无法发货，请及时联系并说明情况后进行退款;</p>
                            <p>买家申请退款后，须征得买家同意后再发货，否则买家有权拒收货物;</p>
                        </div>
                    </div>

                </div>
                <div class="order_goods">
                    <h4>下单商品</h4>
                    <Table border ref="selection" :columns="columns" :data="orderDetailProduct">
                        <template slot-scope="{ row }" slot="thumb">
                            <div class="thumb"><img :src="row.thumb"></div>
                        </template>
                    </Table>
                </div>
            </Card>
        </div>
        <Modal v-model="showModel" title="发货" @on-ok="deliverGoods" @on-cancel="showModel=false">
            <Form style="max-width: 90%;" ref="goodsSearch" label-position="right" :label-width="90">
                <FormItem label="订单号">
                    <Input v-model="orderId" :disabled="true" />
                </FormItem>
                <FormItem label="快递信息">
                    <Input v-model="expressNo" type="textarea" placeholder="快递单号" :maxlength="40" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    import qs from 'qs'
    export default {
        name: '',
        data() {
            return {
                orderId: '',
                orderInfo: '',
                expressNo: '',
                showModel: false,
                address: '',
                status: ['', '买家已付款，等待商家发货', '商家已发货'],
                orderDetailProduct: [],
                columns: [{
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '商品名',
                        key: 'productName'
                    },
                    {
                        title: '商品图',
                        slot: 'thumb'
                    },
                    {
                        title: '规格',
                        key: 'skuMsg'
                    },
                    {
                        title: '数量（件）',
                        key: 'productQuantity'
                    },
                    {
                        title: '金额',
                        key: 'price'
                    }
                ]
            }
        },
        computed: {
            current() {
                return
            }
        },
        methods: {
            async getOrderInfo() {
                const res = await this.$axios.get(`/apiadmin/orderDetail/findOrderDetailById/${this.orderId}`)
                this.orderInfo = res.data.orderProduct
                this.orderDetailProduct = res.data.orderDetailProduct
                this.orderDetailProduct.map(item => {
                    item.skuMsg = JSON.parse(item.skuMsg).skuSelectStr
                })
                this.address = JSON.parse(this.orderInfo.receiveAddress)
            },
            async deliverGoods() {
                if (!this.expressNo) {
                    this.$Message.error({
                        content: '请填写快递单号'
                    })
                    return
                }
                var params = {
                    orderId: this.orderId,
                    expressNO: this.expressNo
                }
                const res = await this.$axios({
                    url: '/apiadmin/orderDetail/deliverGoods',
                    method: 'post',
                    data: qs.stringify(params),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                if (res.code == 0) {
                    this.$Message.success({
                        content: '订单发货成功'
                    })
                    this.getOrderInfo()
                } else {
                    this.$Message.error({
                        content: '订单发货失败'
                    })
                }
            }
        },
        mounted() {
            this.orderId = this.$route.params.id || ''
            this.getOrderInfo()
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

    .order {
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        border-bottom: 1px solid #cfcfcf;
        padding-bottom: 20px;
        margin-bottom: 30px;

        &_info {
            padding-right: 60px;
            border-right: 1px dotted #cfcfcf;
            width: 400px;

            h4 {
                margin-bottom: 23px;
            }

            div {
                margin-bottom: 20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                label {
                    width: 80px;
                }
            }
        }

        &_status {
            padding-left: 60px;

            h4 {
                margin-bottom: 23px;
            }

            div {
                margin-bottom: 20px;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: nowrap;
                white-space: nowrap;

                label {
                    width: 70px;
                    display: block;
                }

            }

            .status {
                color: tomato;
                margin-bottom: 10px;
            }

            .tips {
                margin-top: 250px;
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;

                h4 {
                    margin-bottom: 10px;
                    color: salmon;
                }
            }
        }

        &_goods {

            // padding-left: 60px;
            h4 {
                margin-bottom: 23px;
            }

            .thumb {
                width: 80px;
                height: 80px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                justify-content: center;
                align-items: center;

                img {
                    width: 100%;
                }
            }
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

        .info {
            margin-left: 10px;
            white-space: nowrap;
        }
    }
</style>
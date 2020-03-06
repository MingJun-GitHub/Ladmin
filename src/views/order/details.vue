<template>
    <div class="setup">
        <Card :bordered="true" style="width: 80%;">
            <p slot="title">订单状态</p>
            <Steps :current="1">
                <Step title="买家下单" content="买家下单"></Step>
                <Step title="买家付款" content=""></Step>
                <Step title="卖家发货" content="这里是该步骤的描述信息"></Step>
                <Step title="交易完成" content="这里是该步骤的描述信息"></Step>
            </Steps>
        </Card>
        <div style="margin-top: 20px;max-width: 80%;">
            <Card :bordered="true">
                <div class="order">
                <div class="order_info">
                    <h4>订单详情</h4>
                    <div>
                        <label for="">订单编号</label>
                        <span>{{orderInfo.orderId}}</span>
                    </div>

                    <div>
                        <label for="">支付方式</label>
                        <span>{{orderInfo.payType==1?'微信安全支付': '货到付款'}}</span>
                    </div>
                    <div>
                        <label for="">下单时间</label>
                        <span>{{orderInfo.create_time}}</span>
                    </div>
                    <div>
                        <label for="">配送方式</label>
                        <span>当日送达</span>
                    </div>
                    <div>
                        <label for="">收货信息</label>
                        <span>北京市</span>
                    </div>
                    <div>
                        <label for="">买家留言</label>
                        <span></span>
                    </div>
                </div>
                <div class="order_status">
                    <h4>订单状态: 买家已付款，等待商家发货</h4>
                    <Button type="">发货</Button>
                    <div class="tips">
                        <h3>提醒：</h3>
                        <p>如果无法发货，请及时联系并说明情况后进行退款;</p>
                        <p>买家申请退款后，须征得买家同意后再发货，否则买家有权拒收货物;</p>
                    </div>
                </div>
                </div>
            </Card>
        </div>
        <Modal v-model="showModel" title="温馨提示" @on-ok="showModel=true" @on-cancel="showModel=false">
            <Form style="max-width: 90%;" ref="goodsSearch" label-position="right" :label-width="90">
                <FormItem label="用户手机号">
                    <Input v-model="orderId" type="text" />
                </FormItem>
                <FormItem label="内容">
                    <Input v-model="msg" type="textarea" />
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                orderId: '',
                orderInfo: '',
                msg:'',
                showModel: false
            }
        },
        methods: {
            async getOrderInfo() {
                const res = await this.$axios.get(`/apiadmin/orderDetail/findOrderDetailById/${this.orderId}`)
                this.orderInfo = res.data
            }
        },
        mounted() {
            this.orderId = '428684792360337408' //  this.$route.query.id || ''
            console.log('this.$route', this.$route)
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
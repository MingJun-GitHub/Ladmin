<template>
    <div class="setup">
        <!-- <Breadcrumb :style="{margin: '24px 0'}">
            <BreadcrumbItem>设置</BreadcrumbItem>
            <BreadcrumbItem>支付方式</BreadcrumbItem>
        </Breadcrumb> -->
        <Card :bordered="true" style="max-width: 60%;">
            <p slot="title">支付设置</p>
            <div class="setup_pay">
                <div class="setup_pay__pic"><img src="../../assets/images/wechat_pay.png"></div>
                <div class="setup_pay__info">
                    <h3>微信支付</h3>
                    <p>资金结算到店铺余额，结算扣除0.6%交易手续费（微信收取）（仅支持境内使用，支付宝无法使用微信支付）</p>
                </div>
                <div class="setup_pay_status">
                    <Switch v-model="wechatStatus" @on-change="changeWechatStatus" />
                </div>
            </div>
            <div class="setup_pay">
                <div class="setup_pay__pic"><img style="width:120px;" src="../../assets/images/cash_pay.png"></div>
                <div class="setup_pay__info">
                    <h3>货到付款</h3>
                    <p>启用货到付款后，请自行安排合作快递完成收款各结算</p>
                </div>
                <div class="setup_pay_status">
                    <Switch v-model="cashStatus" @on-change="changeCashStatus" />
                </div>
            </div>
        </Card>
    </div>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                wechatStatus: true,
                cashStatus: true
            }
        },
        methods: {
            changeWechatStatus() {
                this.wechatStatus = !this.wechatStatus
            },
            changeCashStatus() {
                this.cashStatus = !this.cashStatus
            },
            // 动态保存
            asyncStatus() {}
        }
    }
</script>

<style lang="less" scoped>
    .setup {
        max-width: 80%;

        &_pay {
            display: flex;
            // flex-direction: row;
            align-items: center;
            margin-bottom: 20px;

            &__pic {
                width: 150px;
                height: auto;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 20px;

                img {
                    width: 100%;
                    height: auto;
                }
            }

            &__info {
                width: 65%;
                margin-right: 20px;
            }
        }
    }
</style>
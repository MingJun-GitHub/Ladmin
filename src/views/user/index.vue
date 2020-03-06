<template>
    <div class="setup">
        <Card :bordered="true" style="width: 60%;">
            <p slot="title">客户筛选</p>
            <!--:rules=""-->
            <Form style="max-width: 100%;" :model="searchData" label-position="right" :label-width="80" inline>
                <FormItem label="手机号">
                    <Input v-model="searchData.phone" type="text" />
                </FormItem>
                <FormItem label="微信昵称">
                    <Input v-model="searchData.nickName" type="text" />
                </FormItem>
                <FormItem label="" :label-width="20">
                    <Button type="primary" style="margin-right: 15px;" @click="goSearch">查询</Button>
                    <Button type="primary" @click="resetParams">重置查询条件</Button>
                </FormItem>
            </Form>
        </Card>
        <div style="margin-top: 20px;max-width: 60%;">
            <Card :bordered="true">
                <Table border ref="selection" :columns="columns" :data="userList">
                    <!--slot-scope="{ row, index }"-->
                    <template slot-scope="{ row, index }" slot="headers">
                        <img :src="row.userLogo" width="80" />
                    </template>
                    <template slot-scope="{ row, index }" slot="options">
                        <Button type="primary" size="small" @click="goMsg(row, index)">发短信</Button>
                        <!-- <Button type="error" size="small">删除</Button>
                        <Button type="warning" size="small">下架</Button> -->
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
        <Modal v-model="showMsg" title="温馨提示" @on-ok="postMsg" @on-cancel="showMsg=false">
            <Form style="max-width: 90%;" ref="goodsSearch" label-position="right" :label-width="90">
                <FormItem label="用户手机号">
                    <Input v-model="phone" type="text" />
                </FormItem>
                <FormItem label="简讯内容">
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
                phone: null,
                msg: null,
                showMsg: false,
                searchData: {
                    pageSize: 20,
                    pageNo: 1,
                    phone: '',
                    nickName: '',
                    country: '',
                    province: '',
                    city: ''
                },
                columns: [{
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '手机号',
                        key: 'phone'
                    },
                    {
                        title: '微信号/昵称',
                        key: 'nickName'
                    },
                    {
                        title: '头像',
                        slot: 'headers'
                    },
                    {
                        title: '注册时间',
                        key: 'createTime'
                    },
                    {
                        title: '操作',
                        slot: 'options'
                    }
                ],
                total: 0,
                userList: []
            }
        },
        methods: {
            resetParams() {
                this.searchData = {
                    pageSize: 20,
                    pageNo: 1,
                    phone: '',
                    nickName: '',
                    country: '',
                    province: '',
                    city: ''
                }
                this.getUserList()
            },
            async getUserList() {
                const res = await this.$axios.get('/apiadmin/userinfo/listUserInfoPage', {
                    params: this.searchData
                })
                res.data.records.map(item => {
                    item.receiveAddress = item.receiveAddress ? JSON.parse(item.receiveAddress) : null
                })
                this.userList = res.data.records || []
                this.total = Number(res.data.total || 0)
            },
            goSearch() {
                this.searchData.pageNo = 1
                this.getUserList()
            },
            setPage(index) {
                this.searchData.pageNo = index
                this.getUserList()
            },
            goMsg(row, index) {
                this.showMsg = true
                this.phone = row.phone
                this.msg = null
            },
            postMsg() {
                // 发送成功---<
                this.$Message.success({
                    content: '发送成功'
                })
                this.showMsg = false
            }
        },
        async created() {
            await this.checkLogin()
        },
        mounted() {
            this.getUserList()
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
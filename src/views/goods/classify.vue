<template>
    <div class="goods_classify">
        <Card style="max-width: 60%;">
            <p slot="title">
                商品分组
                <!-- <Row>
                    
                    <Col span="6">
                      <Input search enter-button="快速搜索" v-model="searchData.title" placeholder="请输入" @on-search="goSearch" />
                    </Col>
                    
                    <Col span="3" offset="15">
                    <Button type="primary" @click="createGroup">新建商品分组</Button>
                    </Col>
                </Row> -->
            </p>
            <Table border ref="selection" :columns="columns" :data="groupTypeList">
                <!--slot-scope="{ row, index }"-->
                <!-- <template slot-scope="{ row, index }" slot="options">
                    <Button type="primary" size="small" @click="goEdit(row,index)">编辑</Button>
                    <Button type="error" size="small" @click="goDelete(row, index)">删除</Button>
                </template> -->
            </Table>
            <Row class="pages">
                <Col :span="24">
                <Page :total="groupTypeList.length" class="pages_bar" size="small" show-total />
             </Col>
            </Row>
        </Card>
        <Modal v-model="showModel" title="温馨提示"  @on-ok="postMsg" @on-cancel="showModel=false">
            <Form style="max-width: 90%;" ref="goodsSearch" label-position="right"
                :label-width="90">
                <FormItem label="输入分组名">
                    <Input v-model="groupName" type="text" />
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
                showModel: false,
                searchData: {
                    title: ''
                },
                groupName: '',
                columns: [{
                        title: '序号',
                        key: 'id'
                    },
                    {
                        title: '分组名',
                        key: 'productGroupName'
                    },
                    {
                        title: '创建时间',
                        key: 'createTime'
                    },
                    // {
                    //     title: '操作',
                    //     slot: 'options'
                    // },
                ],
                groupTypeList: [],
            }
        },
        methods: {
            async getGroupType() {
                const res = await this.$axios.get('/apiadmin/productGroupName/listProductGroupName')
                if(res.code ==0) {
                    this.groupTypeList = res.data
                }
            },
            goEdit(row,index) {
                this.groupName = row.productGroupName
                this.showModel = true
            },
            goDelete(row,index) {
            },
            createGroup() {
                this.groupName = null
                this.showModel= true
            },
            postMsg() {
                
            },
            goSearch() {
                this.getGroupType()
            }
        },
        mounted() {

            this.getGroupType()

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
</style>
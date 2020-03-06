<style scoped>
    .index {
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        text-align: center;
    }
    .index .ivu-row-flex {
        height: 100%;
    }
</style>
<template>
    <div class="index">
        <Row type="flex" justify="center" align="middle">
            <Col span="24">
                <!-- <h1>
                    <img src="https://raw.githubusercontent.com/iview/iview/master/assets/logo.png">
                </h1> -->
                <h2>
                    <p>目录导航</p>
                  
                </h2>
                <h3>
                     <router-link to="/goods">商品列表</router-link>、
                   <router-link to="/order">订单列表</router-link>、
                   <router-link to="/user">会员列表</router-link>
                </h3>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        async created() {
            await this.checkLogin()
        }
    }
</script>
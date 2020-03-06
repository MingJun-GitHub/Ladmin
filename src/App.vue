<style lang="less" scoped>
    .layout {
        border: 1px solid #d7dde4;
        // background: #f5f7f9;
        background: #000;
        position: relative;
        border-radius: 4px;
        // overflow: hidden;
        height: 100vh;
    }

    .layout-logo {
        // width: 100px;
        height: 30px;
        // background: #f8f8f8;
        color: #fff;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: -30px;
        line-height: 30px;
        font-size: 30px;
    }

    .layout-nav {
        width: 420px;
        margin: 0 auto;
        margin-right: 20px;
    }
</style>
<template>
    <div class="layout">
        <Layout style="height: 100vh;">
            <template v-if="isLogin">
                <Header>
                    <Menu mode="horizontal" theme="dark" active-name="1">
                        <div class="layout-logo">冷链食品管理</div>
                    </Menu>
                </Header>
                <Layout>
                    <Sider hide-trigger :style="{background: '#fff'}">
                        <layout_menu />
                    </Sider>
                    <Layout :style="{padding: '0 24px 24px'}">
                        <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">
                            <router-view></router-view>
                        </Content>
                    </Layout>
                </Layout>
            </template>
            <router-view v-else />
        </Layout>
    </div>
</template>
<script>
    import layout_menu from './components/layout_menu/index.vue'
    export default {
        components: {
            layout_menu
        }
    };
</script>
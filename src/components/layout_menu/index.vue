<template>
    <Menu :active-name="actName" theme="light" width="auto" :open-names="['1']">
        <MenuItem name="1" @click.native="goRouter('/')">
        <Icon type="ios-home" />概览
        </MenuItem>
        <MenuGroup name="2" title="商品">
            <MenuItem name="2-1" @click.native="goRouter('/goods')">
            <Icon type="md-barcode" />商品管理</MenuItem>
            <MenuItem name="2-2" @click.native="goRouter('/goods/edit')">
            <Icon type="ios-add-circle" />发布商品</MenuItem>
            <MenuItem name="2-3" @click.native="goRouter('/goods/classify')">
            <Icon type="md-albums" />商品分组</MenuItem>
        </MenuGroup>
        <MenuGroup name="3" title="订单">
            <MenuItem name="3-1" @click.native="goRouter('/order')">
            <Icon type="md-reorder" />订单列表</MenuItem>
        </MenuGroup>
        <MenuGroup name="4" title="会员">
            <MenuItem name="4-1" @click.native="goRouter('/user')">
            <Icon type="ios-people" />会员列表</MenuItem>
        </MenuGroup>
        <MenuGroup name="5" title="设置">
            <MenuItem name="5-1" @click.native="goRouter('/setup')">
            <Icon type="ios-settings" />支付方式</MenuItem>
        </MenuGroup>
    </Menu>
</template>

<script>
    export default {
        name: '',
        data() {
            return {
                actName: 1
            }
        },
        methods: {
            goRouter(path = '/') {
                if (path === this.$route.fullPath) {
                    return
                }
                this.$router.push({
                    path
                })
            }
        },
        mounted() {
            if (this.$route.fullPath.indexOf('/setup')) {
                this.actName = '5'
            }
        }
    }
</script>

<style lang="less" scoped>

</style>
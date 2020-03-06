export default {
    data() {
        return {
            isLogin: this.$cookie.get('token')
        }
    },
    methods: {
        async checkLogin() {
            try {
                const res = await this.$axios.get('/apiadmin/productGroupName/listProductGroupName')
                this.isLogin = res.code ==0 && res.data && res.msg=='success'
                if (!this.isLogin) {
                    this.clearAccessToken()
                }
            } catch (e) {
            }
        },
        // 随便访问一个接口
        clearAccessToken() {
            this.$axios.cookie.remove('token')
            this.$router.replace('/login')
            this.isLogin = false
        }   
    }
}
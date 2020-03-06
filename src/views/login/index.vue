<template>
    <div class="login_layout">

        <div class="login_layout__box">
            <div class="login_layout__title">
                冷链食品管理系统
            </div>
            <Form ref="formValidate" :model="formData" label-position="top" :rules="ruleValidate">
                <FormItem label="用户名" prop="username">
                    <Input v-model="formData.username" />
                </FormItem>
                <FormItem label="密码" prop="password">
                    <Input type="password" v-model="formData.password" />
                </FormItem>
                <FormItem label="">
                    <Button type="success" long @click="handleSubmit('formValidate')" :loading="loading">登录</Button>
                </FormItem>
                <FormItem label="">
                    <Button type="primary" long @click="handleReset('formValidate')">重置</Button>
                </FormItem>
            </Form>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                formData: {
                    username: '',
                    password: ''
                },
                loading: false,
                ruleValidate: {
                    username: {
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    },
                    password: [{
                            required: true,
                            message: '请输入密码',
                            trigger: 'blur'
                        },
                        {
                            type: 'string',
                            max: 20,
                            min: 5,
                            message: '密码长度5~20位数',
                            trigger: 'blur'
                        }
                    ]
                }
            }
        },
        methods: {
            handleSubmit(name = 'formValidate') {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        this.loading = true
                        const res = await this.$axios.post('/apiadmin/login/adminlogin', this.formData)
                        this.loading = false
                        if (res.code == 0 && res.data.token) {
                            this.$cookie.set('token', res.data.token, {
                                expires: 30
                            })
                            this.$Message.success('登录成功')
                            setTimeout(() => {
                                window.location.reload()
                            }, 1500)
                        } else {
                            this.$Message.error('登录失败，请重新输入帐号密码');
                        }
                    } else {
                        this.$Message.error('请输入完整的用户名与密码');
                    }
                })
            },
            handleReset(name = 'formValidate') {
                this.$refs[name].resetFields()
            }
        }
    }
</script>
<style lang="less" scoped>
    .login_layout {
        width: 100%;
        height: 100vh;
        background: #f8f8f9;
        margin: 0 auto;
        position: relative;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        &__title{
            margin-bottom: 20px;
            font-size: 28px;
            color: #2a2a2a;
            text-align: center;
        }
        &__box {
            width: 350px;
            padding: 20px 10px 0;
            border-radius: 4px;
            height: auto;
            background: #fff;
            margin: 0 auto;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            top: 12%;
        }
    }
</style>
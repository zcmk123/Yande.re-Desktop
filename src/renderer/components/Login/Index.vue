<template>
    <div>
        <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link login__container">
                <el-avatar size="medium" :src="avatarImg"></el-avatar>
                <span class="login__name" :title="displayName">{{ loginState && displayName ? displayName : $t('header.login') }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="toLogin"><i class="el-icon-user"></i>{{ !loginState ? $t('header.login') : $t('header.edit_account') }}</el-dropdown-item>
                <el-dropdown-item v-if="loginState" command="toMain"><i class="el-icon-house"></i>{{ $t('header.home_page') }}</el-dropdown-item>
                <el-dropdown-item v-if="loginState" command="toMyFavorite"><i class="el-icon-star-off"></i>{{ $t('header.my_favorite') }}</el-dropdown-item>
                <el-dropdown-item v-if="loginState" command="logout"><i class="login__loginout-icon el-icon-download"></i>{{ $t('header.logout') }}</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

        <!-- 登录弹窗 -->
        <el-dialog
        :title="$t('header.login')"
        :visible.sync="loginDialogVisible"
        v-loading="loginForm.loginLoading"
        width="30%">
            <el-form ref="loginForm" :model="loginForm" label-width="100px">
                <el-form-item :label="$t('header.login_form.login_name')" prop="loginName" :rules="{ required: true, message: $t('header.login_form.name_empty_tips') }">
                    <el-input v-model="loginForm.loginName" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item :label="$t('header.login_form.login_pass')" prop="loginPass" :rules="{ required: true, message: $t('header.login_form.pass_empty_tips') }">
                    <el-input v-model="loginForm.loginPass" type="password" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loginDialogVisible = false">{{ $t('cancel') }}</el-button>
                <el-button type="primary" @click="login">{{ $t('confirm') }}</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<style scoped>
    .login__container {
        display: flex;
        flex-wrap: nowrap;
        cursor: pointer;
    }

    .login__name {
        margin-left: 5px;
        flex-grow: 1;
        flex-basis: 0;
        align-self: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .login__loginout-icon {
        transform: rotate3d(0, 0, 1, -90deg);
    }
</style>

<script>
    const DEFAULT_AVATAR = 'static/default-avatar.png'

    const crypto = require('crypto') //sha1加密，构造密码hash用
    import cookie from '@/util/cookie.js'
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                displayName: '',
                avatarImg: DEFAULT_AVATAR,

                loginForm: {
                    loginLoading: false,
                    loginName: '',
                    loginPass: ''
                },

                loginDialogVisible: false
            }
        },
        created () {
            const _this = this;
            
            // 初始化
            Promise.all([cookie.getCookie('login'), cookie.getCookie('password_hash'), cookie.getCookie('login_pass'), cookie.getCookie('user_id')])
                .then((resp) => {
                    
                    let [ loginName, passWordHash, loginPass, userId ] = resp

                    if (loginName.length && passWordHash.length && userId.length) {
                        _this.loginForm.loginName = _this.displayName = loginName[0].value
                        _this.loginForm.loginPass = loginPass[0].value
                        _this.avatarImg = `https://yande.re/data/avatars/${userId[0].value}.jpg`

                        _this.$store.dispatch('setLoginInfo', {
                            loginState: true,
                            loginName: loginName[0].value,
                            loginPass: loginPass[0].value,
                            passHash: passWordHash[0].value
                        })
                    }

                })

        },
        computed: {
            ...mapState({
                loginState: state => state.Login.loginState
            })
        },
        methods: {
            handleCommand (command) {
                this[command]();
            },
            toMain () {
                this.$router.replace('main')
            },
            toMyFavorite () {
                this.$router.replace('MyFavorite')
            },
            toLogin () {
                this.loginDialogVisible = true
            },
            // 绑定账号
            login () {
                const _this = this,
                    loginForm = _this.loginForm

                this.$refs['loginForm'].validate(async (valid) => {
                    if (valid) {
                        _this.loginForm.loginLoading = true
                        await cookie.setCookie('login', loginForm.loginName)
                        await cookie.setCookie('login_pass', loginForm.loginPass)
                        const cryptedPass = _this.cryptPass(loginForm.loginPass)
                        await cookie.setCookie('password_hash', cryptedPass)
                        const userId = await _this.getUserId(loginForm.loginName)
                        await cookie.setCookie('user_id', userId+'')

                        _this.displayName = loginForm.loginName

                        _this.avatarImg = `https://yande.re/data/avatars/${userId}.jpg`

                        _this.loginForm.loginLoading = false

                        _this.$store.dispatch('setLoginInfo', {
                            loginState: true,
                            loginName: loginForm.loginName,
                            loginPass: loginForm.loginPass,
                            passHash: cryptedPass
                        })

                        _this.loginDialogVisible = false

                    }
                })
            },
            // 注销登录
            logout () {
                this.$confirm(this.$t('header.logout_confirm_tips'))
                .then(() => {
                    this.loginForm.loginName = this.loginForm.loginPass = ''
                    cookie.clearCookies()
                    this.$store.dispatch('resetLoginInfo')
                    this.avatarImg = DEFAULT_AVATAR
                    this.$message.success(this.$t('header.logout_tips'))
                    this.$router.replace('/')
                })

            },
            getUserId (loginName) {
                return axios({
					method: 'get',
                    url: 'https://yande.re/user.json',
                    params: {
                        name: loginName
                    }
                }).then((resp) => {
                    return Promise.resolve(resp.data[0].id)
                })
            },
            // sha1加密密码
            cryptPass (passWord) {
                return crypto.createHash('sha1').update(`choujin-steiner--${passWord}--`).digest('hex')
            }
        }
    }
</script>
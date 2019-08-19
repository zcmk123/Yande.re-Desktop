import _ from 'lodash'

const defaultState = {
    loginState: false,
    loginName: '',
    loginPass: '',
    passHash: ''
}

export default {
    state: _.clone(defaultState),

    mutations: {
        setLoginInfo (state, info) {
            state = Object.assign(state, info)
        },
        resetLoginInfo (state) {
            state = Object.assign(state, _.clone(defaultState))
        }
    },
    
    actions: {
        setLoginInfo ({ commit }, info) {
            commit('setLoginInfo', info)
        },
        resetLoginInfo ({ commit }) {
            commit('resetLoginInfo')
        }
    }
}
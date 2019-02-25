import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    token: "",
    userInfo: {},
    shopInfo:{},
}

const mutations={
    setToken(state, token) {
        state.token = token;
    },
    setUserInfo(state, data) {
        state.userInfo = data;
    },
    setshopInfo(state, data) {
        state.shopInfo = data;
    }
}

export default new Vuex.Store({
    state,
    mutations
})
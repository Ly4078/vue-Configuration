import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

const state = {
    token: "",
    userInfo: {},
    shopInfo:{},
    clientHeight:"",
    mainHeight:"",
    tableHeight:""
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
    },
    setClientHeight(state, height) {
        state.clientHeight = height;
    },
    setMainHeight(state, height){
        state.mainHeight = height;
    },
    setTableHeight(state,height){
        state.tableHeight = height;
    }
}

export default new Vuex.Store({
    state,
    mutations
})
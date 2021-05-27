import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
	// 保存数据及状态， 刷新页面，重新读取存储的登录信息
	state: sessionStorage.getItem("web-user") ? JSON.parse(sessionStorage.getItem("web-user")) : {
		user: {
			name: ""
		}
	},
	// 唯一修改数据的入口，同步处理，用于 commit
	mutations: {
		updateUser(state, user) {
			state.user = user;
			sessionStorage.setItem("web-user", JSON.stringify(state));
		}
	},
	// 异步处理，用于 dispatch
	actions: {
		asyncUpdateUser({
			commit
		}, user) {
			commit("updateUser", user);
		}
	},
	modules: {},
	// 计算属性
	getters: {
		getUser(state) {
			return state.user;
		},
		getUserName(state) {
			return state.user.name;
		}
	}
})

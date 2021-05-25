import Vue from 'vue'
//import Vuex from 'vuex'
import Vuex from './kvuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		//状态或者数据
		counter: 0
	},
	mutations: {
		//commit 触发
		//更改状态
		add(state) {
			state.counter++
			console.log("[store] commit add ", state.counter);
		}
	},
	actions: {
		//dispatch 触发
		//异步操作
		add({
			commit
		}) {
			setTimeout(() => {
				console.log("[store] dispatch add ");
				commit('add')
			}, 1000);
		}
	},
	modules: {},
	getters: {
		doubleCounter(state){
			return state.counter *2;
		}
	}
})

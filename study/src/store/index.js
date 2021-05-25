import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		counter: 0
	},
	mutations: {
		//commit 触发
		add(state) {
			state.counter++
			console.log("[store] commit add ", state.counter);
		}
	},
	actions: {
		//dispatch 触发
		add({
			commit
		}) {
			setTimeout(() => {
				console.log("[store] dispatch add ");
				commit('add')
			}, 1000);
		}
	},
	modules: {}
})

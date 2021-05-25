//局部保存 Vue 对象
let Vue

//定义对象
class Store {
	constructor(arg) {
		//定义响应式属性
		// this.state = new Vue({
		// 	data: arg.state
		// })

		//包装一层，避免外部意外设置
		this._vm = new Vue({
			data: {
				$$store: arg.state
			}
		})

		//私有属性
		this._mutations = arg.mutations
		this._actions = arg.actions

		//解决对象绑定 this 问题
		this.dispatch = this.dispatch.bind(this)
		this.commit = this.commit.bind(this)
	}

	get state() {
		return this._vm._data.$$store;
	}

	set state(v) {
		console.error("cannot set state");
	}

	commit(type) {
		const entry = this._mutations[type]
		if (!entry) {
			console.error("unknow mutation ", type)
		}
		entry(this.state)
	}

	dispatch(type) {
		const entry = this._actions[type]
		if (!entry) {
			console.error("unknow action ", type)
		}
		entry(this)
	}
}

//for  Vue.use 调用
function install(_Vue) {
	Vue = _Vue;

	Vue.mixin({
		//延迟调用，在 store 对象创建好，被挂载到 Vue 选项后执行	
		beforeCreate() {
			//以便后期可以直接 $store 使用
			if (this.$options.store) {
				Vue.prototype.$store = this.$options.store;
			}
		}

	});
}
export default {
	Store,
	install
};

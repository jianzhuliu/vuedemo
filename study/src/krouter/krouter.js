//局部定义一个 Vue 对象，避免加载 Vue 库，插件在 install 时，注入 Vue 对象
let Vue;

//定义一个对象
class VueRouter {
	//构造函数
	constructor(arg) {
		//保存传递的参数项
		this.$options = arg;

		//构造一个响应式属性，以便切换 hash 后，可以重新 render 
		const initial = window.location.hash.slice(1) || '/';
		Vue.util.defineReactive(this, "current", initial)

		//监听浏览器 hashchange 事件
		window.addEventListener("hashchange", () => {
			console.log("[VueRouter] hashchange ", window.location.hash);
			this.current = window.location.hash.slice(1);
			console.log("[VueRouter] hashchange current ", this.current);
		})
	}

}

//必须实现一个 install 方法， Vue.use() 时调用
VueRouter.install = function(_Vue) {
	console.log("[VueRouter] install")
	Vue = _Vue;

	//全局混入的目的是延迟执行以下逻辑，待 router 创建完毕并传递到 Vue对象中时才执行
	Vue.mixin({
		beforeCreate() {
			if (this.$options.router) {
				Vue.prototype.$router = this.$options.router;
			}
		}
	})

	//实现组件  <router-link to="/">Home</router-link>
	Vue.component("router-link", {
		props: {
			to: {
				type: String,
				required: true
			}
		},
		render(h) {
			//<a href="url">content</a>
			console.log("[VueRouter] router-link ", window.location.hash)
			return h(
				'a', {
					// 属性配置
					attrs: {
						href: "#" + this.to
					}
				},
				this.$slots.default
			);
		}
	});

	//实现组件 <router-view/>
	Vue.component("router-view", {
		render(h) {
			// <div></div>
			//获取当前 hash ,并查找到路由表中对应的 component
			let component
			const route = this.$router.$options.routes.find(
				(route) => route.path === this.$router.current
			);

			component = route && route.component
			return h(component);
		}
	});
};

export default VueRouter;

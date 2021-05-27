import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home'

Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/login',
		name: 'Login',
		component: () => import('../views/Login.vue')
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: "*",
		name: "NotFound",
		component: () => import('../views/NotFound.vue')
	}
]

const router = new VueRouter({
	// mode: 'history',
	mode: 'hash',
	base: process.env.BASE_URL,
	routes
})

//路由监听
router.beforeEach((to, from, next) => {
	let hasLogin = sessionStorage.getItem("hasLogin");
	let toPath = to.path;
	console.log(to.path, hasLogin);

	if (toPath == '/logout') {
		// 退出登录，
		sessionStorage.clear();

		next({
			path: '/login'
		});
	} else if (toPath == '/login') {
		// 已经登录过的，再次访问登录，跳转至首页
		if (hasLogin) {
			next({
				path: '/'
			})
		}
	} else if (hasLogin == null) {
		// 未登录，则跳转至登录界面
		next({
			path: '/login'
		})
	}

	next();
})

export default router

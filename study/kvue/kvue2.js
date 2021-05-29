//响应式处理
function defineReactive(obj, key, val) {
	// console.log("[defineReactive] start", key, val, typeof val)

	//值是个对象时，需要再次处理
	observe(val)

	//每个 key 对应一个 Dep 对象
	const dep = new Dep()

	Object.defineProperty(obj, key, {
		set(newVal) {
			if (newVal != val) {
				// console.log(`[defineReactive] [set>-] key=${key},oldVal=`, val, ",newVal=", newVal)
				//如果新值是对象，需要重新处理响应式
				observe(newVal)
				val = newVal

				//通知 watcher 更新
				dep.notify()
			}
		},
		get() {
			// console.log(`[defineReactive] [get<-] key=${key},val=`, val)
			//添加 watcher
			Dep.watcher && dep.addWatcher(Dep.watcher)
			return val
		}
	})
}

//监听每个 key ,并设置响应式
function observe(obj) {
	//非对象或者为空，不处理
	if (typeof obj !== "object" || obj === null) {
		return
	}

	new Observe(obj)
}

//根据传入的值不同，做相应的响应式处理,区分数组还是对象
class Observe {
	constructor(target) {
		if (Array.isArray(target)) {
			//数组 @todo
		} else {
			//处理响应式
			this.walk(target)
		}
	}
	walk(obj) {
		Object.keys(obj).forEach(key => {
			defineReactive(obj, key, obj[key])
		})
	}
}

//代理，以便可以直接访问 data 内属性
function Proxy(kvue) {
	//将 data 内部每个key,代理为自己的属性,并处理响应式
	Object.keys(kvue.$data).forEach(key => {
		Object.defineProperty(kvue, key, {
			get() {
				return kvue.$data[key];
			},
			set(v) {
				kvue.$data[key] = v;
			}
		})
	})
}

//更新视图，当数据变更时
class Watcher {
	constructor(kvue, fn) {
		this.$kvue = kvue;
		this.getter = fn;

		this.get();
	}

	get() {
		//创建 Watcher 时，自动添加到 Dep 中
		//定义变量，标识自己
		Dep.watcher = this;

		this.getter.call(this.$kvue);

		//处理完毕，置空
		Dep.watcher = null;
	}

	//当数据变更时调用
	update() {
		this.get();
	}
}

//管理 Watcher，更新触发操作
class Dep {
	constructor() {
		this.watchers = new Set();
	}

	//添加 Watcher
	addWatcher(watcher) {
		this.watchers.add(watcher);
	}

	//通知更新
	notify() {
		this.watchers.forEach(watcher => watcher.update())
	}
}

// 数据响应式，模板引擎，渲染
class Kvue {
	constructor(options) {
		this.$options = options
		this.$data = options.data

		//1、数据响应式
		observe(this.$data)

		//代理
		Proxy(this)

		//如果定义了选择器，则自动调用 $mount
		if (options.el) {
			this.$mount(options.el);
		}
	}

	$mount(el) {
		//保存 root
		this.$el = document.querySelector(el);


		//更新函数
		const updateComponent = () => {
			//获取渲染函数
			const { render } = this.$options;

			// //获取新节点内容
			// const el = render.call(this);

			// //获取父元素
			// const parent = this.$el.parentElement;

			// //插入新节点
			// parent.insertBefore(el, this.$el.nextSibling);

			// //删除老节点
			// parent.removeChild(this.$el);

			// //保存新节点
			// this.$el = el;

			//获取新节点
			const vnode = render.call(this, this.$createElement);

			//vnode => dom
			this._update(vnode)

		};

		//创建全局 Watcher，传递更新函数 
		new Watcher(this, updateComponent);
	}

	//创建虚拟dom
	$createElement(tag, props, children) {
		return { tag, props, children };
	}

	//vnode => dom
	_update(vnode) {
		const prevVnode = this._vnode

		if (!prevVnode) {
			//init 
			this.__patch__(this.$el, vnode);
		} else {
			//update 
			this.__patch__(prevVnode, vnode);
		}
	}

	__patch__(oldVnode, vnode) {
		if (oldVnode.nodeType) {
			//dom 
			const parent = oldVnode.parentElement;
			const refElm = oldVnode.nextSibling;

			//创建 dom 树
			const el = this.createElm(vnode);

			parent.insertBefore(el, refElm);
			parent.removeChild(oldVnode);
			this._vnode = vnode;

		} else {
			//update
			const el = oldVnode.el

			//节点相同才处理
			if (oldVnode.tag == vnode.tag) {
				//props
				const oldProps = oldVnode.props || {}
				const newProps = vnode.props || {}

				//新增
				for (const key in newProps) {
					const oldValue = oldProps[key];
					const newValue = newProps[key];
					if (newValue !== oldVnode) {
						el.setAttribute(key, newValue);
					}
				}

				//删除
				for (const key in oldProps) {
					if (!(key in newProps)) {
						el.removeAttribute(key);
					}
				}

				//chhildren
				const oldChild = oldVnode.children;
				const newChild = vnode.children;

				if (typeof newChild === 'string') {
					//text
					if (typeof oldChild === 'string') {
						if (oldChild !== newChild) {
							//都是文本，且不相同
							el.textContent = newChild;
						}
					} else {
						//直接替换为文本
						el.textContent = newChild;
					}

				} else {
					if (typeof oldChild === 'string') {
						el.innerHTML = ""
						//重新渲染
						newChild.forEach(child => this.createElm(child));
					} else {
						//update 
						this.updateChildren(el, oldChild, newChild);
					}
				}
			}

			vnode.el = el;
		}
	}

	//根据虚拟node 创建 dom
	createElm(vnode) {
		const el = document.createElement(vnode.tag);
		//props 
		if (vnode.props) {
			for (const key in vnode.props) {
				const value = vnode.props[key];
				el.setAttribute(key, value);
			}
		}
		//children
		if (vnode.children) {
			if (typeof vnode.children === 'string') {
				//text
				el.textContent = vnode.children;
			} else {
				//递归
				vnode.children.forEach(childVnode => {
					const child = this.createElm(childVnode);
					el.appendChild(child);
				})
			}
		}

		//存储一下
		vnode.el = el;

		return el;
	}

	//处理子节点
	updateChildren(parentElm, oldChild, newChild) {
		const len = Math.min(oldChild.length, newChild.length);

		for (let index = 0; index < len; index++) {
			this.__patch__(oldChild[index], newChild[index]);
		}

		// 新增
		if (newChild.length > oldChild.length) {
			newChild.slice(len).forEach(child => {
				const el = this.createElm(chhild);
				parentElm.appendChild(el);
			})
		}

		// 删除
		if (newChild.length < oldChild.length) {
			oldChild.slice(len).forEach(child => {
				const el = this.createElm(chhild);
				parentElm.removeChild(el);
			})
		}
	}
}

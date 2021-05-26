//响应式处理
function defineReactive(obj, key, val) {
	console.log("[defineReactive] start", key, val, typeof val)

	//值是个对象时，需要再次处理
	observe(val)

	//每个 key 对应一个 Dep 对象
	const dep = new Dep()

	Object.defineProperty(obj, key, {
		set(newVal) {
			if (newVal != val) {
				console.log(`[defineReactive] [set>-] key=${key},oldVal=`, val, ",newVal=", newVal)
				//如果新值是对象，需要重新处理响应式
				observe(newVal)
				val = newVal

				//通知 watcher 更新
				dep.notify()
			}
		},
		get() {
			console.log(`[defineReactive] [get<-] key=${key},val=`, val)
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

//编译模板
class Compile {
	constructor(kvue, el) {
		this.$kvue = kvue;
		this.$el = document.querySelector(el);

		//dom 对象存在时才处理
		if (this.$el) {
			this.compile(this.$el)
		}
	}

	//会涉及递归调用
	compile(el) {
		//遍历所有子节点
		const childNodes = el.childNodes

		Array.from(childNodes).forEach(node => {
			// console.log(node)
			if (this.isElement(node)) {
				//元素
				this.compileElement(node);

			} else if (this.isInter(node)) {
				//文本 
				this.compileText(node);
			}

			//如果还有子节点
			if (node.childNodes && node.childNodes.length > 0) {
				this.compile(node);
			}
		})
	}

	//是否元素
	isElement(node) {
		return node.nodeType == 1;
	}

	//是否插值文本
	isInter(node) {
		return node.nodeType == 3 && /\{\{(.*)\}\}/.test(node.textContent);
	}

	//解析文本 {{counter}}
	compileText(node) {
		console.log("[compileText] 文本", node.textContent, RegExp.$1);
		this.update(node, RegExp.$1, "text");
	}

	//解析元素 k-
	compileElement(node) {
		console.log("[compileElement] 元素", node, node.attributes)
		let nodeAttrs = node.attributes
		Array.from(nodeAttrs).forEach(attr => {
			let attrName = attr.name;
			let exp = attr.value;
			if (this.isDirective(attrName)) {
				console.log("[compileElement] 指令", attrName, exp)
				let dir = attrName.substring(2);
				//存在对应指令方法，直接调用
				this[dir] && this[dir](node, exp);
			} else if (this.isEvent(attrName)) {
				let eventName = attrName.substring(1);
				this.eventHandler(node, exp, eventName);
			}
		})
	}

	//是否为我们设置的指令格式 k- 开头
	isDirective(attrName) {
		return attrName.startsWith("k-")
		// return attrName.indexOf("k-") == 0;
	}

	//是否为事件 @click="double"
	isEvent(attrName) {
		return attrName.startsWith("@");
	}

	// k-text="counter"
	text(node, exp) {
		this.update(node, exp, "text");
	}

	// k-html="msg"
	html(node, exp) {
		this.update(node, exp, "html");
	}

	//统一管理指令渲染,有公用的部分，且可以做统一监控
	update(node, exp, directive) {
		//获取对应指令更新方法，并执行
		const updateFn = this[directive + "Updater"]

		if (updateFn) {
			updateFn(node, this.$kvue[exp])

			//创建一个 watcher
			new Watcher(this.$kvue, exp, function(value) {
				updateFn(node, value)
			})
		}
	}

	//文本渲染
	textUpdater(node, value) {
		node.textContent = value;
	}

	//html渲染
	htmlUpdater(node, value) {
		node.innerHTML = value;
	}

	//事件处理
	eventHandler(node, exp, eventName) {
		const fn = this.$kvue.$options.methods && this.$kvue.$options.methods[exp]
		if (fn) {
			node.addEventListener(eventName, fn.bind(this.$kvue))
		}
	}

	//k-model="msg"
	model(node, exp) {
		//1、渲染视图
		this.update(node, exp, "model");

		//2、监听事件
		node.addEventListener("input", e=> this.$kvue[exp] = e.target.value);
	}

	modelUpdater(node, value) {
		node.value = value;
	}
}

//更新视图，当数据变更时
class Watcher {
	constructor(kvue, key, updateFn) {
		this.$kvue = kvue
		this.$key = key
		this.$updateFn = updateFn

		//创建 Watcher 时，自动添加到 Dep 中
		//定义变量，标识自己
		Dep.watcher = this
		//手动执行获取数据，以便添加自己到 Dep 中
		this.$kvue[this.$key]
		//处理完毕，置空
		Dep.watcher = null
	}

	//当数据变更时调用，统一由 Dep管理触发
	update() {
		this.$updateFn.call(this.$kvue, this.$kvue[this.$key]);
	}
}

//管理 Watcher，更新触发操作
class Dep {
	constructor() {
		this.watchers = []
	}

	//添加 Watcher
	addWatcher(watcher) {
		this.watchers.push(watcher)
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

		//2、模板引擎及渲染
		new Compile(this, this.$options.el)
	}
}

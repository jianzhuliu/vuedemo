//响应式处理
function defineReactive(obj, key, val) {
	console.log("[defineReactive] start", key, val, typeof val)

	//值是个对象时，需要再次遍历
	observe(val)

	Object.defineProperty(obj, key, {
		set(newVal) {
			if (newVal != val) {
				console.log(`[defineReactive] [set>-] key=${key},oldVal=`,val, ",newVal=",newVal)
				//如果新值是对象，需要重新处理响应式
				observe(newVal)
				val = newVal
			}
		},
		get() {
			console.log(`[defineReactive] [get<-] key=${key},val=`,val)
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

	Object.keys(obj).forEach(key => {
		defineReactive(obj, key, obj[key])
	})

}

const obj = {
	name: "jianzhu",
	title: "header",
	data: {
		title: "content"
	}
}

observe(obj)

console.log("[main] ================ obj.name ============")
obj.name
obj.name = "bob"
obj.name

console.log("[main] ================ obj.data ============")
obj.data.title
obj.data = {
	title: "new"
}
obj.data.title

console.log("[main] ================ obj.msg ============")
obj.msg = "message"
obj.msg

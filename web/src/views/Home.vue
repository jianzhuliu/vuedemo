<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<div v-if="this.$store.getters.getUserName">
			<p>欢迎 {{this.$store.getters.getUserName}}</p>
			<router-link to="/about">关于</router-link> |
			<router-link to="/logout">退出</router-link>
		</div>
		<div v-else>还没有登录</div>

		<div>{{joke}}</div>
	</div>
</template>

<script>
	export default {
		name: 'Home',
		data() {
			return {
				joke: ""
			}
		},
		beforeRouteEnter: (to, from, next) => {
			// 进入之前
			next(vm => {
				vm.getJoke();
			});
		},
		methods: {
			getJoke() {
				// 获取一个笑话
				var that = this;
				this.axios.get("https://autumnfish.cn/api/joke")
					.then(function(response) {
						console.log(response.data);
						that.joke = response.data;
					})
					.catch(function(error) {
						that.$message({
							message: error,
							type: "warning"
						})
					})
			}
		}
	}
</script>

<style scoped="true">
	.home {
		text-align: center;
	}
</style>

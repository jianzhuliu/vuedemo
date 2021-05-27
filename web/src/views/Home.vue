<template>
	<div class="home">
		<img alt="Vue logo" src="../assets/logo.png">
		<div v-if="this.$store.getters.getUserName">
			<p>欢迎 {{this.$store.getters.getUserName}}</p>
			<router-link to="/logout">退出</router-link>
		</div>
		<div v-else>还没有登录</div>
	</div>
</template>

<script>
	export default {
		name: 'Home',
	}
</script>

<style scoped="true">
	.home {
		text-align: center;
	}
</style>

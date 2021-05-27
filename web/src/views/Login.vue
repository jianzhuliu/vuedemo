<template>
	<div>
		<!-- 绑定到数据  user， 添加校验规则 rules -->
		<el-form ref='login-form' :model='user' :rules='rules' class='login-box'>
			<h3 class="login-title">欢迎登录</h3>
			<!-- 添加 prop 用于匹配校验规则 -->
			<el-form-item label="账号" prop="name">
				<el-input type="text" v-model="user.name" placeholder="请输入账号"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="passwd">
				<el-input type="text" v-model="user.passwd" placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-button @click="onSubmit">提交</el-button>

		</el-form>
	</div>
</template>

<script>
	export default {
		name: "Login",
		data() {
			return {
				user: {
					name: "",
					passwd: ""
				},
				rules: {
					name: [{
						required: true,
						message: "请输入账号",
						trigger: "blur"
					}],
					passwd: [{
						required: true,
						message: "请输入密码",
						trigger: "blur"
					}],
				}
			}
		},
		methods: {
			onSubmit() {
				this.$refs['login-form'].validate((valid) => {
					if (valid) {
						sessionStorage.setItem("hasLogin", "true");
						this.$store.dispatch("asyncUpdateUser", {name:this.user.name});
						this.$router.push('/');
					} else {
						this.$message({
							message: "请输入账号或者密码",
							type: "warning"
						});
						return false;
					}
				});
			}
		}
	}
</script>

<style scoped="true">
	.login-box{
		width: 300px;
		margin: 120px auto;
		border: 1px solid #DCDFE6;
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0 0 30px #DCDFE6;
	}
	
	.login-title{
		text-align: center;
	}
</style>
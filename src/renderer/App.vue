<template>
	<div id="app">
		<el-container class="h100p">

			<el-header>
			<el-row class="header">
				<el-col class="header__title"><router-link to="/" tag="span">YandeDesktop By DoubleBird</router-link></el-col>
				<Login />
			</el-row>
			</el-header>

			<el-main>
				<router-view></router-view>
			</el-main>

		</el-container>
	</div>
</template>

<script>
	import Login from '@/components/Login'
	
	export default {
		name: 'YandeDesktop',
		components: { Login }
	}
</script>

<style>
	/* CSS */
	html, body, div, ul, li, h1, h2, h3, h4, h5, h6, p, dl, dt, dd, ol, form, input, textarea, th, td, select {
		margin: 0;
		padding: 0;
	}

	*{ box-sizing: border-box; }

	html, body, #app {
		height: 100%;
	}

	body {
		font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	}

	.h100p {
		height: 100%;
	}

	/* headerCSS */
	.header {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.header__title {
		line-height: 60px;
		cursor: pointer;
		user-select: none;
	}
</style>

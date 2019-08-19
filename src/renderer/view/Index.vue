<template>
	<PictureList :post-list="postList" :load-more="loadMore" :loading="loading" />
</template>

<style scoped>

</style>

<script>
	import PictureList from '@/components/PictureList'
	import Login from '@/components/Login'
	
	export default {
		data () {
			return {
				postList: [],
				page: 1,
				limit: 40,
				loading: false
			}
		},
		created () {
			this.loadData(this.page, this.limit);
		},
		methods: {
			loadMore () {
				this.loadData(this.page, this.limit);
			},
			loadData (page = 1, limit = 40) {
				const _this = this;
				_this.loading = true;

				return axios({
					method: 'get',
					url: 'https://yande.re/post.json',
					params: {
						page: page,
						limit: limit
					}
				})
				.then(resp => {

					_this.postList = _this.postList.concat(resp.data)
					_this.page++

					_this.loading = false
				})
				.catch(resp => {
					_this.loading = false
					_this.$message.error('加载数据失败');
				})
			}
		},
		components: { Login, PictureList }
	}
</script>
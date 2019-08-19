<template>
    <div>
        <el-row class="main" :gutter="10" v-loading="loading" element-loading-text="拼命加载中...">
            <el-col :span="4" v-for="(o, i) in postList" :key="o.id"
            style="margin-bottom:25px;">
            <el-card :body-style="{ padding: '0px' }">
                <img :src="o.preview_url" class="image" @click="previewImg(i)"/>
                <div style="padding: 14px;">
                    <time class="time">{{ new Date(o.created_at * 1000).toDateString() }}</time>
                    <div class="bottom clearfix">
                    <span style="font-size: 13px;">ID: {{ o.id }}</span>
                    <el-button v-if="loginState" type="text" class="button" @click="vote(o, i)">{{ o.favorite ? '取消收藏' : '添加收藏' }}</el-button>
                </div>
                </div>
            </el-card>
            </el-col>

            <el-col v-if="!!loadMore">
                <span class="main__loadmore-btn" @click="loadMore">
                    <span v-show="!loading">加载更多...</span>
                    <span v-show="loading">加载中...<i class="el-icon-loading"></i></span>
                </span>
            </el-col>
	    </el-row>

    	<!-- 预览器 -->
        <viewer id="viewer"
        :images="previewList"
        :options="previewOptions"
        @inited="previewInit"
        ref="viewer"
        style="display: none;">
            <img v-for="ele in previewList" :src="ele.sample_url" :key="ele.id">
        </viewer>

        <el-backtop target=".el-main"></el-backtop>
    </div>
</template>

<style scoped>
	.main {
		display: flex;
		flex-flow: row wrap;
		align-content: flex-start;
		width: 100%;
		height: 100%;
	}

	.main__loadmore-btn {
		display: table-cell;
		padding: 15px 0;
		text-align: center;
		width: 1%;
		cursor: pointer;
	}

	.main__loadmore-btn:hover {
		background: #cccccc80
	}

	.time {
		font-size: 13px;
		color: #999;
	}

	.bottom {
		margin-top: 13px;
		line-height: 12px;
	}

	.button {
		padding: 0;
		float: right;
	}

	.image {
		width: 100%;
		display: block;
		cursor: pointer;
	}

	.clearfix:before,
	.clearfix:after {
		display: table;
		content: "";
	}

	.clearfix:after {
		clear: both;
	}
</style>

<script>
	import qs from 'Qs'

	import 'viewerjs/dist/viewer.css'
    import Viewer from 'v-viewer/src/component.vue'
	import { mapState } from 'vuex'
    
    export default {
        name: 'PictureList',
        data () {
            return {
				previewList: [], // 预览列表
				previeShow: false,
				previewOptions: {
					hidden () {
						this.previeShow = false
					}
				}
            }
        },
        props: {
            postList: {
                type: Array,
                default: [],
                required: true
            },
            loading: {
                type: Boolean,
                default: false
            },
            loadMore: {
                type: Function,
                default: null
            }
        },
        computed: {
			...mapState({
				loginState: state => state.Login.loginState,
				loginName: state => state.Login.loginName,
				passHash: state => state.Login.passHash
			})
		},
        methods: {
            previewInit () {
				if (this.previeShow) {
					this.$refs.viewer.$viewer.show()
				}
			},
			// 图片预览
			previewImg (index) {
				this.previewList = this.postList.slice(index, index + 1)

				this.previeShow = true
            },
            // 收藏post
			vote (post, index) {
				const _this = this;

				return axios({
					method: 'post',
					url: `https://yande.re/post/vote.json?login=${_this.loginName}&password_hash=${_this.passHash}`,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data: qs.stringify({
						id: post.id,
						score: post.favorite ? 2 : 3
					})
				})
				.then(resp => {
					if (!post.favorite) {
						_this.$message.success('收藏成功')
						post.favorite = true
					} else {
						_this.$message.success('取消收藏成功')
						post.favorite = false
					}
					_this.$set(_this.postList, index, _.clone(post))
				})
				.catch(resp => {
					_this.$message.error('收藏、取消收藏失败')
				})

			}
        },
        components: { Viewer }
    }
</script>
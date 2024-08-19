<template>
	<view class="query-content">
		<view class="query-top-container">
			<view v-if="isQueryRead">
				<selectView :value='readTag.label' hint='请选择' textSize="12px" @clickSelect="showPick('readState')" />
			</view>
			<view class="query-search-box">
				<i class="iconfont query-search-icon iconzl--sousuo" v-if="!isQueryRead"></i>
				<view class="query-search-content">
					<input style="flex: 1;" :placeholder="hint" :placeholder-class="isQueryRead?'placeholder-style-small':'placeholder-style'"
					 v-model="fuzzyParam" />
				</view>
			</view>
			<view class="query-export-css" @click="markRead" v-if="isQueryRead&&readTag.value=='false'">
				<text>一键已读</text>
			</view>
			<view class="query-more-css" @click="showMore">
				<text>更多</text>
			</view>
		</view>
		<view v-if="isControlMore?isControlShow:isMore" style="margin-top: 4px;border-top: 1px solid #efefef;">
			<view class="more-container">
				<view class="select-view" v-if="isQueryTitle">
					<selectView :value='titleObj.label' hint='业务类型' @clickSelect="showPick('title')" />
				</view>
				<view class="select-view" v-if="isQueryTitle&&isQueryNode">
					<selectView :value='nodeObj.label' hint='审批进度' @clickSelect="showPick('node')" />
				</view>
				<view class="select-view" v-if='isQueryState'>
					<selectView :value='stateObj.label' hint='审批状态' @clickSelect="showPick('state')" />
				</view>
			</view>
			<view class="more-container" v-if="isQueryTime">
				<view class="select-view">
					<selectView :value='startDate' hint='开始时间' @clickSelect="showPick('startDate')" />
				</view>
				<view class="select-view">
					<selectView :value='endDate' hint='结束时间' @clickSelect="showPick('endDate')" />
				</view>
			</view>
			<view class="query-condition-btn">
				<view class="query-clear query-btn-all" @click="reset">重置</view>
				<view class="query-confirm query-btn-all" @click="query">查询</view>
			</view>
		</view>
		<w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
		<w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirm" :disabledAfter="true" ref="date"
		 themeColor="#E60000" />
	</view>
</template>

<script>
	import selectView from '@/components/common/common-ui/selector-view.vue';
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	var timer;
	export default {
		components: {
			selectView,
			wPicker,
		},
		props: {
			hint: {
				type: String,
				default: '模糊搜索'
			},
			//是否显示一键已读
			isQueryRead: {
				type: Boolean,
				default: false
			},
			isQueryTitle: {
				type: Boolean,
				default: true
			},
			//是否筛选审批节点
			isQueryNode: {
				type: Boolean,
				default: true
			},
			//是否显示审批状态
			isQueryState: {
				type: Boolean,
				default: false
			},
			isQueryTime: {
				type: Boolean,
				default: true
			},
			//是否外部控制显示更多
			isControlMore: {
				type: Boolean,
				default: false
			},
			isControlShow: {
				type: Boolean,
				default: true
			}
		},
		watch: {
			fuzzyParam(val) {
				if (timer) {
					clearTimeout(timer);
				}
				timer = setTimeout(() => {
					this.setData()
				}, 500);

			}
		},
		data() {
			return {
				selectList: [],
				titleList: [],
				nodeList: [],
				stateList: [],
				fuzzyParam: '',
				isMore: false,
				nodeObj: {},
				titleObj: {},
				stateObj: {},
				picktype: '',
				startDate: '',
				endDate: '',
				acceptDate: '',
				readList: [{
						label: "已读",
						value: 'true'
					},
					{
						label: "未读",
						value: 'false'
					}
				],
				readTag: {
					label: "未读",
					value: "false"
				},
			}
		},
		created() {
			this.loadProcessTypes();
			this.loadStateTypes();
			this.isMore = this.isControlShow
			uni.$on('notify-query-change',obj=>{
				this.fuzzyParam = '';
				this.nodeObj = {};
				this.titleObj = {};
				this.stateObj = {};
				this.readTag = {
					label: "未读",
					value: "false"
				};
				this.startDate = ""
				this.endDate = ""
			})
		},
		methods: {
			showMore() {
				this.isMore = !this.isMore
				this.$emit('setMore', this.isMore)
			},
			//重置
			reset() {
				this.fuzzyParam = '';
				this.nodeObj = {};
				this.titleObj = {};
				this.stateObj = {};
				this.readTag = {
					label: "未读",
					value: "false"
				};
				this.startDate = ""
				this.endDate = ""
				this.$emit('reset')
			},
			//查询
			query() {
				this.isMore = false
				this.$emit('setMore', this.isMore)
				this.setData()
			},
			setData() {
				this.$emit('query', {
					fuzzyParam: this.fuzzyParam,
					nodeObj: this.nodeObj,
					titleObj: this.titleObj,
					stateObj: this.stateObj,
					startDate: this.startDate,
					endDate: this.endDate,
					readTag: this.readTag
				})
			},
			//一件已读
			markRead() {
				this.$emit('markRead')
			},
			loadProcessTypes() {
				let param = {
					current: 1,
					size: 999,
					latest: true
				}
				this.$network
					.getData(this.$url.BUSINESS_PROCESS, 'GET', param)
					.then(result => {
						this.titleList = result.records ? result.records.map(o => {
							return {
								value: o.processKey,
								label: o.name,
								procDefId: o.procDefId
							}
						}) : []
					})
					.catch(err => {

					});
			},
			getProcessNode(procDefId) {
				let urlstr = this.$url.PROCESS_NODE.replace(/xxx/, 'contractapi');
				let param = {
					id: procDefId
				};
				this.$network
					.getData(urlstr, 'GET', param)
					.then(result => {
						this.nodeList = result ? result.filter(o => {
							return o.title
						}) : [];
						this.nodeList = this.nodeList.map(o => {
							return {
								label: o.title,
								value: o.id
							}
						})
					})
					.catch(err => {
						uni.showToast({
							icon: 'none',
							title: err.detail[0] ? err.detail[0] : err.message
						});
					});
			},
			//流程审批状态
			loadStateTypes() {
				this.$network
					.loadUserType('business_state')
					.then(result => {
						this.stateList = result;
					})
					.catch(err => {});
			},
			showPick(type) {
				this.picktype = type
				switch (type) {
					case 'startDate':
					case 'endDate':
						this.$refs.date.show();
						break;
					case 'node':
						this.selectList = this.nodeList
						this.$refs.selector.show();
						break;
					case 'title':
						this.selectList = this.titleList
						this.$refs.selector.show();
						break;
					case 'state':
						this.selectList = this.stateList
						this.$refs.selector.show();
						break;
					case 'readState':
						this.selectList = this.readList
						this.$refs.selector.show();
						break;
					default:
						break;
				}

			},
			onConfirm(val) {
				switch (this.picktype) {
					case 'node':
						this.nodeObj = val.checkArr;
						break;
					case 'title':
						this.titleObj = val.checkArr;
						this.nodeObj = {};
						this.getProcessNode(this.titleObj.procDefId)
						break;
					case 'state':
						this.stateObj = val.checkArr;
						break;
					case 'startDate':
						this.startDate = val.result;
						break;
					case 'endDate':
						this.endDate = val.result;
						break;
					case 'readState':
						this.readTag = val.checkArr;
						break;
					default:
						break;
				}
			},

		}

	}
</script>

<style lang="scss" scoped>
	.query-content {
		background-color: #FFFFFF;
		padding: 4px 8px;
		display: flex;
		flex-direction: column;
	}

	//第一行
	.query-top-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
		background-color: #fff;
		width: 100%;
	}

	.query-search-box {
		background: #F7F7F7;
		height: 35px;
		flex: 1;
		line-height: 35px;
		display: flex;
		margin: 8px;
		flex-direction: row;
		border-radius: 4px;
		justify-content: flex-start;
		align-items: center;
	}

	.placeholder-style-small {
		font-size: 12px;
	}

	.placeholder-style {
		font-size: 14px;
	}

	.query-search-icon {
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 16px;
	}

	.query-search-content {
		display: flex;
		flex: 1;
		color: #999999;
		font-size: $uni-font-size-base;
		margin-left: 10px;
		margin-right: 10px;
	}

	.query-export-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		border-radius: 4px;
		margin-right: 5px;
		font-size: $uni-font-size-base;
		color: #E60000;
		border: 1px solid #E60000;
		background: #FFFFFF;
	}

	.query-more-css {
		display: flex;
		align-items: center;
		justify-content: center;
		padding-left: 8px;
		padding-right: 8px;
		height: 30px;
		background: #FFFFFF;
		border: 1px solid #999999;
		border-radius: 4px;
		font-size: $uni-font-size-base;
		color: #999999;
	}

	.more-container {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: 4px;
		flex: 1;
	}

	.select-view {
		flex: 1;
	}

	.query-condition-btn {
		display: flex;
		margin-top: 10px;
		flex-direction: row;
		justify-content: space-between;
		background: #FFFFFF;
	}

	.query-clear {
		background-color: $uni-border-color;
	}

	.query-confirm {
		background-color: $uni-color-primary;
	}

	.query-btn-all {
		display: flex;
		justify-content: center;
		align-items: center;
		margin-left: 8px;
		margin-right: 8px;
		padding: 8px;
		text-align: center;
		border-radius: 4px;
		flex: 1;
		color: #ffffff;
		font-size: $uni-font-size-base;
	}
</style>

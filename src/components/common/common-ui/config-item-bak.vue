<template>
	<view class="content">
		<config-input 
		v-if="col.el=='input'" 
		:label="col.label" 
		:disabled="col.disabled" 
		:placeholder="col.placeholder"
		:width="col.mobileSpan" 
		:rules="col.rules" 
		:dataProp="col.prop"
		 @valueChange="change"/>
		
		<config-selector 
		v-if="col.el=='selector'&&col.type=='single'" 
		:label="col.label" 
		:disabled="col.disabled" 
		:placeholder="col.placeholder"
		:width="col.mobileSpan" 
		:rules="col.rules" 
		:dataProp="col.prop"
		 @clickSelector="showPick"/>

        <my-w-picker 
		v-model='isShowPick'
		:selectList="selectList" 
		@confirm="onConfirm" 
		 mode="selector"
		 themeColor="#E60000" />
	</view>
</template>

<script>
	import configInput from "@/components/common/common-ui/config-input.vue"
	import configSelector from "@/components/common/common-ui/config-selector.vue"
	import myMPicker from '@/components/common/w-picker/my-w-picker.vue';
	export default {
		name:'configItem',
		components: {
			configInput,
			configSelector,
			myMPicker
		},
		props: {
			col: {
				type: Object,
				default () {
					return {
						el: "input", // 表单类型
						label: "姓名", // 标题
						placeholder: "请输入姓名", // 占位内容
						prop: "name", //字段标识  绑定值
						span: 8, //宽度  按照24单元格均分，手机端可以用另外一个字段
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						readonly: true, // 是否只读字段  
						disabled: false, // 是否不可编辑
						rules: { // 校验字段
							required: true,
							trigger: "change",
							message: "手机号不能为空"
						},
						 type:'single',//单选
						 dataList: [],  //数据源
						 isFirst: false, //是否默认选中第一个
						 valueKey: { //数据源解析规则  label对应的是中文名，value对应的是id
						 label: "name",
						 value: "id"
						 }
					}
				}
			}
		},
		data() {
			return {
				isShowPick:false,
				selectList:[],
			}
		},
		methods: {
			showPick(){
				 console.log('clickSelector')
				this.selectList=this.col&&this.col.dataList?this.col.dataList:[],
				this.isShowPick = true
			},
			onConfirm(val){
				let data={...this.col}
				data[this.col.valueKey.label] = val.label
				data[this.col.valueKey.value] = val.value
				this.$emit('itemData',data)
			},
			change(val){
				this.$emit('itemData',{
					...col,
					value:val.value
					
				})
			},
			submit() {
				//在for循环中ref无法渲染

				this.$refs.configInput.checkInput().then(res => {
					console.log(res)
				}).catch(err => {
					console.log(err)
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	.content {
		background-color: $uni-bg-color-grey;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.config-view {
		display: flex;
		flex-flow: row;
		flex-wrap: wrap;
		align-items: flex-start;
		background-color: #FFFFFF;
	}
</style>

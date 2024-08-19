<template>
	<view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
		<view class="config-view">
			<template v-for="(col,index) in columns">
				<config-input v-if="col.el=='input'" :label="col.label" :disabled="col.disabled" :placeholder="col.placeholder"
				 :width="col.mobileSpan" :rules="col.rules" :dataProp="col.prop" @valueChange="change" :key="index" />

				<config-selector v-if="col.el=='selector'&&!col.multiple" :label="col.label" :disabled="col.disabled" :placeholder="col.placeholder"
				 :width="col.mobileSpan" :rules="col.rules" :dataProp="col.prop" :value="col.value" @clickSelector="showPick(col.prop,'single')"
				 :key="index" />

				<config-multi-selector v-if="col.el=='selector'&&col.multiple" :label="col.label" :disabled="col.disabled"
				 :placeholder="col.placeholder" :width="col.mobileSpan" :rules="col.rules" :dataProp="col.prop" :values="col.value"
				 @clickSelector="showPick(col.prop,'multi')" @deleteValue='deleteValue' :key="index" />
			</template>
		</view>


		<w-picker ref="selector" :selectList="selectList" @confirm="onConfirm" mode="selector" themeColor="#E60000" />
	</view>
</template>

<script>
	import configInput from "./components//config-input.vue"
	import configSelector from "./components/config-selector.vue"
	import configMultiSelector from "@/components/common/common-ui/config-multi-selector.vue"
	import wPicker from '@/components/common/w-picker/w-picker.vue';
	export default {
		name: 'configItem',
		components: {
			configInput,
			configSelector,
			configMultiSelector,
			wPicker
		},
		data() {
			return {
				pickType: '',
				colType: '',
				selectList: [],
				columns: [{
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
						}
					}, {
						el: "selector",
						prop: "signerType",
						label: "签署方",
						placeholder: "请选择签署方",
						span: 8,
						dataList: [{ //数据源
								value: "leaseholder",
								label: "租赁方"
							},
							{
								value: "tenantry",
								label: "承租方"
							},
							{
								value: "thirdParty",
								label: "其他"
							}
						],
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						isFirst: false, //是否默认选中第一个
						value: "leaseholder",
						variable: {
							non: [{
								key: 'signerType',
								value: 'leaseholder'
							}],
							or: [{
									key: 'customerType',
									value: 'enterprise'
								},
								{
									key: 'actorIndentityType',
									value: '1'
								}
							]
						}
					},
					{
						el: "selector",
						prop: "customerType",
						label: "客户类型",
						placeholder: "请选择客户类型",
						span: 8,
						dataList: [{ //数据源
								value: "企业客户",
								label: "enterprise"
							},
							{
								value: "个人客户",
								label: "personal"
							}
						],
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						value:'leaseholder', //默认值
						variable: { //显示判断变量
							non: [{ //不等于
								key: 'signerType',
								value: 'leaseholder'
							}]
						}
					},
					{
						el: "selector",
						prop: "actorIndentityType",
						label: "签署类型",
						placeholder: "请选择签署类型",
						span: 8,
						dataList: [{ //数据源
								value: "个人",
								label: "0"
							},
							{
								value: "公章",
								label: "1"
							}
						],
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						value: "0"
					},
					{
						el: "selector",
						prop: "authorizedOrg",
						label: "签署机构",
						placeholder: "请选择客户类型",
						span: 8,
						dataList: [],
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						value:"",
						variable: { //顯示判斷變量
							or: [{ //或
									key: 'customerType',
									value: 'enterprise'
								},
								{
									key: 'actorIndentityType',
									value: '1'
								}
							]
						}
					},
					{
						el: "selector",
						prop: "signerUser",
						label: "签署人",
						placeholder: "请选择签署人",
						span: 8,
						dataList: [],
						mobileSpan: 100, // 手机端宽度  按照百分比区分
						value:"", //默认值
						variable: { //顯示判斷變量
							or: [{ //或
									key: 'customerType',
									value: 'enterprise'
								},
								{
									key: 'actorIndentityType',
									value: '1'
								}
							]
						}
					}

				]
			}
		},
		methods: {
			showPick(type, colType) {
				this.pickType = type;
				this.colType = colType;
				this.selectList = this.columns.some(o => o.prop == type) ? (this.columns.find(o => o.prop == type).dataList ? this.columns
					.find(o => o.prop == type).dataList : []) : [];
				this.$refs.selector.show()
			},
			onConfirm(val) {
				let item = {}
				let index = this.columns.findIndex(o => o.prop == this.pickType)
				if (index != -1) {
					switch (this.colType) {
						case 'single':
							this.columns[index].value = val.checkArr.label
							break;
						case 'multi':
							let values = this.columns[index].value ? this.columns[index].value : [];
							if (!values.some(o => o.value == val.checkArr.value)) {
								values.push(val.checkArr)
								this.columns[index].value = values
							}

							break;
						default:
							break;
					}

					console.log(this.columns)
				}
			},
			//
			deleteValue(val) {
				let item = {}
				let index = this.columns.findIndex(o => o.prop == val.dataProp)
				if (index != -1) {
					this.columns[index].value.splice(val.pos, 1)
					console.log(this.columns)
				}
			},
			change(val) {
				this.$emit('itemData', {
					...col,
					value: val.value

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

<template>
	<view style="margin-left: 2px; font-weight: 400">
		<i :class="['iconfont', iconClass]" :style="{ color: color, 'font-size': fontSize }" @click.stop="showTip"></i>
		<view class="pop-container">
			<uni-popup ref="tipPop" type="center" :mask-click="true">
				<view class="uni-tip">
					<view class="tip-title">提示</view>

					<view v-html="content" class="tip-content"></view>
					<view class="uni-tip-group-button">
						<text class="uni-tip-button" @click.stop="closePop">知道了</text>
					</view>
				</view>
			</uni-popup>
		</view>
	</view>
</template>

<script>
import uniPopup from '@/components/common/uni-popup/uni-popup.vue';
export default {
	name: 'businessTip',
	components: {
		uniPopup
	},
	props: {
		iconClass: {
			type: String,
			default: 'iconzl--zhushi'
		},
		color: {
			type: String,
			default: '#bcbcbc'
		},
		fontSize: {
			type: String,
			default: '12px'
		},
		tipName: {
			type: String,
			default: ''
		},
		tips: {
			type: String,
			default: ''
		},
		contract: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			selfcontract: null,
			content: '',
			accountType: '1' //租户采用的账期类型，1：履约 2:按照企业账期 3:按照合同账期 4:按照设备账期
		};
	},
	watch: {
		contract: {
			handler(val) {
				let vals = Object.keys(val);
				if (vals.length > 0) {
					this.selfcontract = val;
				} else {
					return;
				}
			},
			deep: true
		}
	},
	created() {
		let resData = uni.getStorageSync(this.$savekey.CONFIG_INFO);
		if (resData) {
			let obj = resData.find((o) => o.code === 'account_type'); //营收类型
			if (obj) {
				this.accountType = obj.value;
			}
		}
	},
	methods: {
		closePop() {
			this.$refs.tipPop.close();
		},
		//显示tips
		showTip() {
			if (this.tips) {
				this.content = this.tips;
			} else {
				switch (this.tipName) {
					case 'rent': //租金
						this.content = `1.天租：租金=租赁天数*单价
								  <br>
								2.按月（30天）：租金=租赁月数*单价+单价/30*剩余天数
								  <br>
								3.按月（自然月）：租金=租赁月数*单价+单价/配置月天数（默认30天）*剩余天数
								  <br>
								4.周租：租金=租赁周数*单价+单价/7*剩余天数
								  <br>
								5.月租（月份）：租金=整月数*月单价+剩余天数*日单价
								  <br>
								6.日租转月租：
								  <br>
								 \ta)租期不满一个月：若（租赁天数*日单价）< 月单价，则租金=租赁天数*日单价；若（租赁天数*日单价）>=月单价，则租金=月单；
								  <br>
								 \tb)租期大于一个月：租金=租赁月数*单价+单价/配置月天数（默认30天）*剩余天数
								  <br>`;
						break;
					case 'subletRent': //转租租赁方式：租金
						this.content = `1.天租：租金=租赁天数*单价
								 <br>
								2.按月（30天）：租金=租赁月数*单价+单价/30*剩余天数
								 <br>
								3.按月（自然月）：租金=租赁月数*单价+单价/配置月天数（默认30天）*剩余天数
								 <br>
								4.周租：租金=租赁周数*单价+单价/7*剩余天数
								 <br>
								5.日租转月租：
								 <br>
								 \ta)租期不满一个月：若（租赁天数*日单价）< 月单价，则租金=租赁天数*日单价；若（租赁天数*日单价）>=月单价，则租金=月单价；
								  <br>
								 \tb)租期大于一个月：租金=租赁月数*单价+单价/配置月天数（默认30天）*剩余天数
								  <br>`;
						break;
					case 'contractSubtotal': //合同小计
						this.content = `小计=设备租金+设备运费+设备押金`;
						break;
					case 'performRevenue': //履约营收
						this.content = `履约营收 = 履约租金 + 运费 + 索赔`;
						break;
					case 'receivedRevenue': //合同的-已收营收/已收/实收
						this.content = `当前合同所有收款单之和-当前合同所有退款单之和`;
						break;
					case 'staffReceivedRevenue':
						this.content = `当前员工所有收款单之和-当前员工所有退款单之和`;
						break;
					case 'customerReceivedRevenue': //客户-已收营收/已收/实收
						this.content = `当前客户所有收款单之和-当前客户退款单之和`;
						break;
					case 'revenue': //履约营收
						this.content = `履约营收=履约租金+运费+索赔`;
						break;
					case 'appointDeposit': //约定押金
						this.content = `当前合同所有设备的押金之和`;
						break;

					case 'paid': //实收
						this.content = `实收=当前合同累计收款-累计退款`;
						break;
					case 'settleArrears': //结算欠款
						this.content = `结算欠款=结算营收-实收`;
						break;
					case 'settleArrears': //结算欠款
						this.content = `结算欠款=结算营收-实收`;
						break;
					case 'settleRevenue': //结算营收
						this.content = `结算营收=当前合同所有结算单优惠/增收后的金额`;
						break;
					case 'performanceOfArrears': //履约欠款
						this.content = `履约欠款=履约营收-实收`;
						break;
					case 'receivedDeposit': //已收押金
						this.content = `当前合同所有收款单的押金之和-退款单的押金之和`;
						break;
					case 'deposit': //押金
						this.content = `约定押金：当前合同所有设备的押金之和
							               <br><br> 
										   已收押金：当前合同所有收款单的押金之和-当前合同所有退款单的押金之和`;
						break;
					case 'performCarriage': //履约运费
						this.content = `当前合同所有设备的运费之和`;
						break;
					case 'receivedCarriage': //已收运费
						this.content = `当前合同所有收款单的运费之和-当前合同所有退款单的运费之和`;
						break;
					case 'carriage': //运费
						this.content = `履约运费：当前合同所有设备的运费之和
							                <br><br>
							                已收运费：当前合同所有收款单的运费和-当前合同所有退款单的运费和`;
						break;
					case 'debt': //应收
						// this.content =
						// `
						// 	<div style='line-height: 26px;margin-bottom:12px'>
						// 	<div>履约营收=履约租金+运费+索赔</div>
						//     <div>¥4000=¥3500+¥300+¥20</div>
						// 	</div>
						//             <div style='line-height: 26px;'>
						// 				<div>实收：当前合同所有收款单之和-当前合同所</div>
						// 				<div>当前实收：¥2500</div>
						// 			</div>
						//             <div style='margin:10px 0 20px 0'>成本：运费+装卸费+沟通费+维修费+调度</div>
						// 			<div style='color:#FE931F;margin-bottom:10px'><i class='iconfont iconzl--zhushi' :style="{color:'#FE931F','font-size':'36rpx','margin-right':'4px'}" ></i>当前为预付合同</div>

						// 				<div style='line-height: 26px;'>
						// <div>预付合同：应收=履约营收-实收+应预收租金</div>
						// <div>¥500=4000-2500+1000</div>
						// 	</div>
						// 			`
						this.content = `1.预付合同：应收=履约营收-已收营收+应预收租金
							                <br><br>
							                2.非预付合同：应收=履约营收-已收营收`;
						break;
						break;
					case 'performHire': //履约租金
						this.content = `设备履约租期内的租金`;
						break;
					case 'settleReceivable': //结算应收
						this.content = `截止到本次结算的累计应收（结算营收-实收）`;
						break;
					case 'curSettleRevenue': //当期营收
						this.content = `本次结算周期内的营收`;
						break;
					case 'settleEarning': //当期收款
						this.content = `本次结算周期内的收款`;
						break;
					case 'settleDebt': //当期应收
						this.content = `本次结算周期内的应收（当期营收-当期收款）`;
						break;
					case 'deviceSubtotal': //设备小计
						this.content = `设备小计=设备实算租金+报停租金+索赔+运费+增收金额-减免金额`;
						break;
					case 'expireRevenueContract': //账期租金(A)-账期租金就是现在系统中的到期营收
						this.content = `以合同支付约定为准，从指定开始时间到对应的合同支付到期日为止，相关设备产生的租金。
								<br>
								\t1.退场付清：以合同最后一台设备退场日期为到期日，计算相关设备各自进退场区间内产生的租金。
								<br>
								\t2.月结：以合同结算日为到期日，计算所有设备截止到到期日时产生的租金。无固定结算日时按照履约租金计算。`;
						break;
					case 'expireRevenueDevice': //账期租金(B)-账期租金就是现在系统中的到期营收
						this.content = `以合同中每台设备进场时间为准，从指定开始时间到每台设备对应的支付到期日为止，产生的租金。
								<br>
								\t1.退场付清：以合同最后一台设备退场日期为到期日，计算所有设备各自进退场区间内产生的租金。
								<br>
								\t2.月结：以合同结算日为到期日，计算所有设备截止到到期日时产生的租金。无固定结算日时按照履约租金计算。`;
						break;
					case 'expireRevenueCustomer': //账期租金(C)-账期租金就是现在系统中的到期营收
						this.content = `从某月的账期日的第二天至下月的账期日为一周期的租金`;
						break;
					case 'accountRevenue': //账期营收
						this.content = '';
						switch (Number(this.accountType)) {
							case 2:
								this.content = `账期租金：开始月的上个月账期日的前一天至选定结束月的账期日的租金
									                <br>`;
								break;
							case 3:
								this.content = `账期租金：以合同支付约定为准，从选定时间到对应的合同支付到期日为止，相关设备产生的租金。
										<br>
										  \t1.退场付清：以合同最后一台设备退场日期为到期日，计算相关设备各自进退场区间内产生的租金。
										 <br>
										  \t2.月结：以合同结算日为到期日，计算所有设备截止到到期日时产生的租金。无固定结算日时按照履约租金计算。
										  <br>`;
								break;
							case 4:
								this.content = `账期租金：以合同中每台设备进场时间为准，从选定时间到每台设备对应的支付到期日为止，产生的租金。
										  <br>
										  \t1.退场付清：以合同最后一台设备退场日期为到期日，计算所有设备各自进退场区间内产生的租金。
										  <br>
										  \t2.月结：以合同结算日为到期日，计算所有设备截止到到期日时产生的租金。无固定结算日时按照履约租金计算。
										  <br>`;
								break;
							default:
								break;
						}
						this.content += `账期营收=账期租金+运费+索赔`;
						break;
					case 'accountDebt': //应收
						this.content = `应收 = 营收 - 实收/已收 + 增收 - 减免 `;
						break;
					case 'settleRevenue': //结算营收
						this.content = `截止到本次结算的累计营收`;
						break;
					case 'homeReceived': //首页实收
						this.content = `选定时间内收款总额`;
						break;
					case 'homeDebt': //首页应收
						this.content = `选定时间内应收总额`;
						break;
					case 'statisticsReceivedRevenue': //合同的-已收营收/已收/实收
						this.content = `当前合同选定时间内所有收款单之和-当前合同选定时间内所有退款单之和`;
						break;
					case 'servicefee': //收退款tip
						this.content = '本项目为扣除金额';
						break;
					case 'reimburse':
						this.content = '除租金、押金、运费之外的已收费用';
						break;
					default:
						break;
				}
			}

			this.$refs.tipPop.open();
		}
	}
};
</script>

<style lang="scss" scoped>
.pop-container {
	position: relative;
	z-index: 999;
}

/* 提示窗口 */
.uni-tip {
	/* #ifndef APP-NVUE */
	display: flex;
	flex-direction: column;
	/* #endif */
	padding: 15px 10px;
	width: 300px;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	border-radius: 4px;
}

.tip-title {
	width: 100%;
	text-align: center;
	padding: 10px;
	color: $uni-text-color;
	font-size: $uni-font-size-base;
	font-weight: bold;
	border-bottom: 1px solid $uni-bg-color-grey;
}

.tip-content {
	padding: 18px 8px;
	font-size: $uni-font-size-base;
	color: $uni-text-color;
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 520;
	color: #222222;
	line-height: 2;
}

.uni-tip-group-button {
	margin: 0;
	padding: 0 !important;
	width: 100%;
	display: flex;
	flex-direction: row;
	// margin-top: 20px;
	border-top: 1px solid #e6e6e6;
}

.uni-tip-button {
	flex: 1;
	text-align: center;
	padding: 8px;
	font-size: $uni-font-size-base;
	color: $uni-color-primary;
	font-size: 32rpx;
	font-family: PingFangSC-Medium, PingFang SC;
	font-weight: 500;
	color: #e60000;
}
</style>

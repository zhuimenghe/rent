<template>
	<view class="value-style" :style="{color:fontColor,'background-color':backgroundColor,'font-size':fontSize}" >{{value}}</view>
</template>

<script>
	export default {
		name: 'headTag',
		props: {
			value: {
				type: String,
				default: ''
			},
			backgroundColor:{
				type: String,
				default: '#E60000'
			},
			fontColor:{
				type: String,
				default: '#ffffff'
			},
			fontSize:{
				type: String,
				default: '12px'
			},
			
		},
		data() {
			return{
				
			}
		},
		methods:{
			
		}
		
	}
</script>

<style lang="scss" scoped>
	.value-style {
		line-height: 18px;
		width: 20px;
		border-radius: 0px 9px 9px 0px;
		margin-right: 8px;
		font-size: 12px;
		color: #FFFFFF;
		text-align: center;
	}
</style>

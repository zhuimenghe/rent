<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <create-step
      processKey="proceeds"
      @submitApply="submit"
      :orgId="customer.orgId"
      :businessOwner="customer.salesman"
      :model="form"
      :rules="rules"
    >
      <p class="title"><span class="line"></span>基本信息</p>
      <view class="form">
        <c-form-item label="收款金额（元）" required>
          <input class="input" type="digit" v-model="form.totalHire" @blur="totalHireBlur" placeholder="请输入">
        </c-form-item>
        <c-form-item label="收款时间" required>
          <c-form-datepicker v-model="form.receiptDate"></c-form-datepicker>
        </c-form-item>
        <c-form-item label="收款方式">
          <c-form-picker :list="typeList" v-model="form.type"></c-form-picker>
        </c-form-item>
        <c-form-item label="收款联系人" >
          <input class="input" type="text" v-model="form.contactName" placeholder="请输入">
        </c-form-item>
        <c-form-item label="联系人电话" >
          <input class="input" type="number" v-model="form.phoneNum" placeholder="请输入">
        </c-form-item>
      </view>
      <p class="title"><span class="line"></span>收款分配</p>
      <card v-for="(c,i) in contracts" :key="c.id" :c="c" @change="contractChange($event,i)" @totalChange="totalInput($event,i)"></card>
      <p class="title"><span class="line"></span>其他</p>
      <view class="bg">
        <imgupload
          @uploadfinish="imgsChange"
          @deleteUrl="imgsChange"
          type="proceed_type"
          :maximg="20"
          :imgFinishlist="form.fileList"
        />
        <view class="padding-left">备注</view>
        <textarea v-model="form.comment" class="textarea" placeholder-style="color:#999999" placeholder="请输入备注信息..."/>
      </view>
    </create-step>
  </div>
</template>
<script>
import createStep from "@/components/workflow/create-step.vue";
import imgupload from "@/components/common/image-upload/image-upload.vue";
import Card from './components/custom-proceed-contract.vue'
import {commonFeesAdjust} from './util'
export default {
  components:{
    createStep,
    imgupload,
    Card
  },
  data(){
    return{
      customer:{},
      typeList:[],
      form:{
        totalHire:'',
        receiptDate:null,
        contactName:'',
        phoneNum:'',
        type:'',
        fileList:[],
        comment:''
      },
      rules:{
        totalHire:{required:true,message:'收款金额必填'},
        receiptDate:{required:true,message:'收款时间必填'},
      },
      contracts:[],
    }
  },
  onLoad(options){
    this.loadInvoiceType()
    this.initCustomer(options.id)
    this.initContracts(options.id)
  },
  watch:{
  },
  methods:{
    async initCustomer(id){
      let url = this.$url.CUSRTOMER_DETAIL + id;
      let customer = await this.$network.getData(url, "GET", null)
      this.form.customerName = customer.name
      this.form.customerSalesman = customer.salesman
      this.form.customerSalesmanName = customer.salesmanName
      this.form.orgName = customer.orgName
      this.form.orgId = customer.orgId
      this.form.customerId = customer.id
      if(customer.type=='1'){
        this.form.phoneNum = customer.contactsList&&customer.contactsList.length ? customer.contactsList[0].phoneNum : ''
        this.form.contactName = customer.contactsList&&customer.contactsList.length ? customer.contactsList[0].name : ''
      }else{
        this.form.phoneNum = customer.phoneNum
        this.form.contactName = customer.name
      }
    },
    async initContracts(id){
      let list = await this.$network.contractsByCustomer(id,'5,6,7,8')
      this.contracts = list.map(c=>{
        return Object.assign(c,{
          orderSum: c.contractDetailDto ? c.contractDetailDto.orderList.map(o=>`${o.heightName}*${o.orderNum}`).join(' | ') : '',
          total:0,//总额
          hire: 0,//zujin
          claim: 0,//索赔
          carriage: 0,//运费
          laborCost: 0,//人工费
          debt: 0,//逾期
          serviceCharge: 0,//代收手续费 减法
        })
      })
    },
    contractChange(c,index){
      this.$set(this.contracts,index,c)
    },
    totalHireBlur(){
      this.form.totalHire = Number(this.form.totalHire)
      this.updateTotals(this.form.totalHire)
    },
    totalInput(e,index){
      this.contracts[index].total=e
      this.$nextTick(_=>{
        this.updateTotals(this.form.totalHire,index)
      })
    },
    updateTotals(totalHire,forceIndex=0){//更新每个合同总收款金额
      totalHire = totalHire || this.form.totalHire
      totalHire = Number(totalHire)
      let keys = [...this.contracts.keys()] //[0,1,2,3,4]
      let ops = new Array(this.contracts.length).fill(-1)
      let fees = this.contracts.map(c=>c.total)
      commonFeesAdjust(totalHire,fees,keys,ops,forceIndex)
      this.contracts.forEach((c,i)=>{
        c.total = fees[i]
      })
      this.contracts = this.contracts.slice()
    },
    modifyContract(c){
      let cFound = this.contracts.find(cc=>cc.id==c.id)
      Object.assign(cFound,c)
    },
    loadInvoiceType(){
			uni.showLoading();
			this.$network.loadType('pay_type')
				.then(result => {
					this.typeList = result;
					if(this.typeList.length > 0 && !this.form.type){
						this.form.type = this.typeList[0].value
					}
					uni.hideLoading();
				})
				.catch(err => {
					uni.hideLoading();
			});
		},
    imgsChange(val){
      let list = val.data;
      this.form.fileList = list
    },
    getBusinessCode() {
			let url = this.$url.CREATE_SETTLE_NO.replace(/{type}/, 'SK')
			return this.$network.getData(url, "GET", null)
		},
    async submit(val){
      let tasks = this.contracts.filter(c=>c.total>0).map(async c=>{
        //获取businessno
        let businessNo = await this.getBusinessCode()
        let body = {
          ...this.form,
          receiptDate:this.form.receiptDate+' 00:00:00',
          businessNo,
          contractId:c.id,
          contractNo:c.businessNo,
          contractDetailId:c.contractDetailDto.id,
          projectName:c.contractDetailDto.projectName,
          total:c.total,
          hire:c.hire,
          claim:c.claim,
          carriage:c.carriage,
          debt:c.debt,
          serviceCharge:c.serviceCharge,
          laborCost:c.laborCost,
        };
        let url = this.$url.SETTLE_PROCEEDS_CREAT + val;
        return this.$network.getData(url, 'POST', body)
      })
      await Promise.all(tasks)
      uni.showToast({title:'新增成功'})
      uni.navigateBack()
    }
  }
}
</script>
<style lang="scss" scoped>
  .title {
    height: 20px;
    font-size: 14px;
    color: #222222;
    font-weight: 600;
    padding: 6px 0;
    margin: 4px 0;
    display: flex;
    align-items: center;
    .line {
      display: block;
      width: 2px;
      height: 80%;
      background-color: #e60000;
      margin-right: 10px;
    }
  }
  .form{
    padding:0 24rpx;
    background: $uni-bg-color;
    .input{
      flex:1;
      text-align: right;
    }
  }
  
  .bg{
    background:$uni-bg-color;
    overflow: auto;
  }
  
  .textarea{
    font-size: $uni-font-size-base;
    box-sizing: border-box;
    width: calc(100% - 40rpx);
    margin:20rpx;
    padding:20rpx;
    background:$uni-bg-color-gray;
  }
</style>
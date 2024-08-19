<template lang="">
  <div class="page">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="form">
      <c-form :model="form" :rules="rules" ref="form">
        <c-form-item label="设备类别" required>
          <c-form-picker :list="deviceTypeList" :value="form.deviceType" @input="deviceTypeChange"></c-form-picker>
        </c-form-item>
        <!-- 设备类型不需要提交 -->
        <c-form-item label="设备类型" required>
          <c-form-picker :list="machineCategoryList" :value="machineCategory" @input="machineCategoryChange"></c-form-picker>
        </c-form-item>
        <c-form-item label="设备品牌" required>
          <c-form-picker :list="brandList" :value="form.machineBrand" @input="machineBrandChange"></c-form-picker>
        </c-form-item>
        <c-form-item label="设备型号" required>
          <c-form-picker :list="machineTypeList" v-model="form.machineType" @input="machineTypeChange"></c-form-picker>
        </c-form-item>
        <!-- 高空车1 叉车3有高度 -->
        <c-form-item label="设备高度" v-show="form.deviceType=='1' || form.deviceType=='3'">
          <input class="input" type="text" v-model="form.machineHeight" placeholder="高度" disabled>
          <!-- <c-form-picker :list="[]" v-model="form.machineHeight"></c-form-picker> -->
        </c-form-item>
        <!-- 挖掘机2 叉车3有吨位 -->
        <c-form-item label="吨位" v-show="form.deviceType=='2' || form.deviceType=='3'">
          <input class="input" type="text" :value="form.tonnage ? form.tonnage+'吨' : ''" placeholder="吨位" disabled>
          <!-- <c-form-picker :list="[]" v-model="form.tonnage"></c-form-picker> -->
        </c-form-item>
        <c-form-item label="车号" required>
          <input class="input" type="text" v-model="form.licenseId" placeholder="请输入" :disabled="isEdit">
        </c-form-item>
        <c-form-item label="区域" required>
          <c-form-picker :list="orgList" v-model="form.orgId"></c-form-picker>
        </c-form-item>
        <c-form-item label="采购时间" required>
          <c-form-datepicker v-model="form.purchaseTime"></c-form-datepicker>
        </c-form-item>
        <c-form-item label="自喷吗">
          <input class="input" type="text" v-model="form.printCode" placeholder="请输入">
        </c-form-item>
        <c-form-item label="设备来源">
          <c-form-picker :list="sourceList" v-model="form.source"></c-form-picker>
        </c-form-item>
        <c-form-item label="出场日期">
          <c-form-datepicker v-model="form.productDate"></c-form-datepicker>
        </c-form-item>
        <c-form-item label="保修期限" required>
          <c-form-picker :list="warrantyPeriodList" v-model="form.warrantyInfoDto.warrantyPeriod"></c-form-picker>
        </c-form-item>
        <c-form-item label="发动机号">
          <input class="input" type="text" v-model="form.machineExpandInfoDto.engineNumber" placeholder="请输入">
        </c-form-item>
        <c-form-item label="环保码">
          <input class="input" type="text" v-model="form.machineExpandInfoDto.environmentalCode" placeholder="请输入">
        </c-form-item>
        <c-form-item label="采购单号">
          <input class="input" type="text" v-model="form.purchaseNo" placeholder="请选择" disabled @click="gotoPurchasePicker">
        </c-form-item>
        <imgupload 
          @uploadfinish="uploadfinish" 
          @deleteUrl="deleteUrl" 
          type="vehicle_type" 
          uploadType="attachment"
          :maximg="20" 
          :imgFinishlist="form.fileList" 
        />
      </c-form>
    </view>
    <div class="actions-footer">
      <view class="z-btn bg-light-gray radius" @click="cancel">取消</view>
      <view class="z-btn bg-primary radius" @click="confirm">确定</view>
    </div>
  </div>
</template>
<script>
import imgupload from '@/components/common/image-upload/image-upload.vue';

export default {
  components:{
    imgupload
  },
  async onLoad(options){
    //组织区域
    let resOrgList = uni.getStorageSync(this.$savekey.ALL_ORG_LIST);
    this.orgList = [...resOrgList];

    let licenseId = options.licenseId
    if(licenseId){
      this.isEdit = true
      //编辑
      await this.getDetailWithLicenseID(licenseId)
      this.loadDeviceType(false);
      this.loadMachineCategory(false)
      this.loadBrand(false)
      this.loadMachineType(false)
    }else{
      this.loadDeviceType();
    }
    this.loadSource(),
    this.loadWarrantyPeriod()
  },
  data(){
    return{
      isEdit:false,
      deviceTypeList:[],
      orgList:[],
      sourceList:[],
      warrantyPeriodList:[],
      brandList:[],
      machineCategoryList:[],
      machineTypeList:[],
      machineCategory:'',
      form:{
        deviceType: null,
        driverType: null,
        fenceId: null,
        id: null,
        licenseId: null,
        locationId: null,
        machineBrand: null,
        machineClass: null,
        machineFileList: [],
        machineHeight: null,
        machineMillPrice: 0,
        machineType: null,
        orgId: "",
        printCode: '',
        productDate: null,
        purchaseTime: new Date().toISOString().split('T')[0],
        putIn: "0",
        source: null,
        tonnage: "",
        warrantyInfoDto: {warrantyPeriod: "2"},
        machineExpandInfoDto:{
          engineNumber:"",
          environmentalCode:''
        },
        purchaseNo:''
      },
      rules:{
        deviceType:{required:true,message:'类别必选'},
        machineBrand:{required:true,message:'品牌必选'},
        machineType:{required:true,message:'型号必选'},
        licenseId:{required:true,message:'车号必填'},
        orgId:{required:true,message:'区域必选'},
        purchaseTime:{required:true,message:'采购时间必选'},
      }
    }
  },
  watch:{
    // 'form.deviceType':function(){
    //   this.loadMachineCategory()
    // },
    // machineCategory(){
    //   this.loadBrand()
    // },
    // 'form.machineBrand':function(){
    //   this.loadMachineType()
    // },
    // deviceTypeList(list){
    //   this.form.deviceType = list&&list.length ? list[0].value : ''
    //   //清空下层关联list
    //   this.machineCategoryList=[]
    // },
    // machineCategoryList(list){
    //   this.machineCategory = list&&list.length ? list[0].value : ''
    //   //清空下层关联list
    //   this.brandList = []
    // },
    // brandList(list){
    //   this.form.machineBrand = list&&list.length ? list[0].value : ''
    //   //清空下层关联list
    //   this.machineTypeList = []
    // },
    // machineTypeList(list){
    //   if(list&&list.length){
    //     this.form.machineType = list[0].value
    //     this.form.machineHeight = list[0].heightName
    //     this.form.tonnage = list[0].tonnage
    //   }else{
    //     this.form.machineType = ''
    //     this.form.machineHeight = ''
    //     this.form.tonnage = ''
    //   }
    // }
  },
  methods:{
    async getDetailWithLicenseID(licenseId) {
			let urlstr = this.$url.MACHINE_RECORD_DETAIL + licenseId;
			let result = await this.$network.getData(urlstr, 'GET', null,{showLoading:true})
      result.purchaseTime = result.purchaseTime ? result.purchaseTime.split(' ')[0] : new Date().toISOString().split('T')[0]
      result.productDate = result.productDate ? result.productDate.split(' ')[0] : null
      if(!result.machineExpandInfoDto) delete result.machineExpandInfoDto
      if(!result.warrantyInfoDto) delete result.warrantyInfoDto
      Object.assign(this.form,result);
      this.machineCategory = result.machineTypeId
		},
    deviceTypeChange(val){
      this.form.deviceType = val
      this.loadMachineCategory()
    },
    machineCategoryChange(val){
      this.machineCategory = val
      this.loadBrand()
    },
    machineBrandChange(val){
      this.form.machineBrand = val
      this.loadMachineType()
    },
    machineTypeChange(val){
      let mt = this.machineTypeList.find(t=>t.value==val)
      if(mt){
        this.form.machineHeight = mt.heightName
        this.form.tonnage = mt.tonnage
      }else{
        this.form.machineHeight = ''
        this.form.tonnage = ''
      }
    },
    async loadDeviceType(autoSelect=true){
      //设备类别
      let list = await this.$network.machineTypeSelect(null,true)
      list = list.map(d=>{
        return {
          label:d.deviceTypeName,
          value:d['device_type']
        }
      })
      this.deviceTypeList = list
      if(autoSelect){
        this.deviceTypeChange(list&&list.length ? list[0].value : '')
      }
    },
    async loadMachineCategory(autoSelect=true){
      //设备类型
      if(this.form.deviceType){
        let list = await this.$network.machineTypeSelect({deviceType:this.form.deviceType},true)
        list = list.map(d=>{
          return {
            label:d.typeName,
            value:d.type
          }
        })
        this.machineCategoryList = list
        if(autoSelect){
          this.machineCategoryChange(list&&list.length ? list[0].value : '')
        }
      }
    },
    async loadBrand(autoSelect=true){
      //设备品牌
      if(this.form.deviceType&&this.machineCategory){
        let list = await this.$network.machineTypeSelect({deviceType:this.form.deviceType,type:this.machineCategory},true)
        list = list.map(d=>{
          return {
            label:d.brand,
            value:d.brand
          }
        })
        this.brandList = list
        if(autoSelect){
          this.machineBrandChange(list&&list.length ? list[0].value : '')
        }
      }
    },
    async loadMachineType(autoSelect=true){
      //设备型号
      if(this.form.deviceType&&this.machineCategory&&this.form.machineBrand){
        let list = await this.$network.machineTypeSelect({deviceType:this.form.deviceType,type:this.machineCategory,brand:this.form.machineBrand},true)
        list = list.map(d=>{
          return {
            ...d,
            label:d.name,
            value:d.id
          }
        })
        this.machineTypeList = list
        if(autoSelect){
          if(list&&list.length){
            this.form.machineType = list[0].value
            this.form.machineHeight = list[0].heightName
            this.form.tonnage = list[0].tonnage
          }else{
            this.form.machineType = ''
            this.form.machineHeight = ''
            this.form.tonnage = ''
          }
        }
      }
    },
    async loadSource(){
      //设备来源
      this.sourceList = await this.$network.loadUserType('machine_source')
    },
    async loadWarrantyPeriod(){
      //保修期限
      this.warrantyPeriodList = await this.$network.loadUserType('warranty_period')
    },
    async confirm(){
      let err = await this.$refs.form.validate()
      if(!err){
        let data = {
          ...this.form,
          purchaseTime:this.form.purchaseTime + ' 00:00:00',
        }
        if(this.form.productDate){
          data.productDate = this.form.productDate + ' 00:00:00'
        }
        if(this.isEdit){
          this.$network.machineUpdate(data)
          uni.showToast({
            title:'修改成功'
          })
        }else{
          this.$network.machineCreate(data)
          uni.showToast({
            title:'添加成功'
          })
        }
        setTimeout(() => {
          uni.navigateBack()
        }, 200);
      }else{
        let {errors} = err
        uni.showToast({
          title: errors[0].message,
          icon: 'none'
        })
      }
    },
    cancel(){
      uni.navigateBack()
    },
    //上传图片回调
		uploadfinish(val) {
			let list = val.data;
      this.form.machineFileList = list
		},
		//删除回调
		deleteUrl(val) {
			let list = val.data;
      this.form.machineFileList = list
		},
    gotoPurchasePicker(){
      uni.navigateTo({
        url:'/devicePages/purchase/purchase-record?isPicker=true'
      })
    },
    setPurchaseNo(no){
      this.form.purchaseNo = no
    }
  }
}
</script>
<style lang="scss" scoped>
  .page{
    padding-bottom:calc(env(safe-area-inset-bottom) + 130rpx);
    input{
      font-size: $uni-font-size-base;
      &[disabled]{
        color:$uni-text-color-grey;
      }
    }
  }
  .form{
    margin: 10px 10px 0px 10px;
    padding:0 24rpx;
    background: $uni-bg-color;
    border-radius: 6rpx;
    .input{
      flex:1;
      text-align: right;
    }
  }
</style>
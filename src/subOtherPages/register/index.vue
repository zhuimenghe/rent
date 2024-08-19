<template>
	<view class="page" >
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="timeline">
      <view class="line"></view>
      <view class="item active"  style="left:55rpx">
        <view class="circle">
          <text class="iconfont iconyingyezhizhao"></text>
        </view>
        <text class="margin-top-lg">提交资料</text>
      </view>
      <view class="item" :class="{active:status>=1}" style="left:326rpx">
        <view class="circle">
          <text class="iconfont iconshenhe"></text>
        </view>
        <text class="margin-top-lg">审核中</text>
      </view>
      <view class="item" style="left:597rpx">
        <view class="circle">
          <text class="iconfont icontongguo"></text>
        </view>
        <text class="margin-top-lg">审核通过</text>
      </view>
    </view>
    <view class="audit" v-if="status==1">
      <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/file-search.png"></image>
      <view class="msg">
        <view>正在审核中，请注意电话回访</view>
        <view>审核1个工作日完成，请耐心等待</view>
      </view>
    </view>
    <view class="flex-scroll-wrapper flex flex-direction" v-if="status==0">
      <view class="flex-scroll-wrapper">
        <view class="img-upload">
          <view class="flex-1 text-lg text-bold">营业执照上传</view>
          <view class="box" v-if="!form.businessLicensePath" @click="upload">
            <text class="iconfont icontianjia"></text>
            <text>上传证件</text>
          </view>
          <image v-else class="img" :src="form.businessLicensePath" @click="upload"></image>
        </view>
        <view class="tip">
          请填写企业信息（营业执照上传后自动识别）
        </view>
        <view class="form">
          <view class="line">
            <text class="text-gray label">公司名称<text class="text-primary">*</text></text>
            <input type="text" class="flex-1" v-model="form.companyName">
          </view>
          <view class="line">
            <text class="text-gray label">机构代码</text>
            <input type="text" class="flex-1" v-model="form.companyCode">
          </view>
          <view class="line">
            <text class="text-gray label">公司地址</text>
            <input type="text" class="flex-1"  v-model="form.address">
          </view>
          <view class="line">
            <text class="text-gray label">联系人<text class="text-primary">*</text></text>
            <input type="text" class="flex-1"  v-model="form.contact">
          </view>
          <view class="line">
            <text class="text-gray label">联系方式<text class="text-primary">*</text></text>
            <input type="text" class="flex-1" v-model="form.phoneNum">
          </view>
        </view>
      </view>
      <view class="tip2 text-sm">注：提交审核后，请注意电话回访，1个工作日开通账号。</view>
      <view class="footer">
        <view class="text-grey"></view>
        <view class="btn" @click="apply">提交审核</view>
      </view>
    </view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	components: {
	},
	data() {
		return {
      status:0,
      form:{
        "companyName": "",
        "companyCode": "",
        "address": "",
        "contact": "",
        "phoneNum": "",
        "businessLicensePath":""
      },
		};
	},
	computed:{
	},
	onShow() {
	},
	onLoad() {
	},
	mounted(){
	},
	methods: {
    upload(){
      let vm = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album','camera'], //从相册选择
        success: (res)=>{
          uni.showLoading({
            title: '识别中,请稍等...',
          });
          vm.form.businessLicensePath=res.tempFilePaths[0]
          let uploadUrl = vm.$url.BASE_URL + vm.$url.UPLOAD_IMG;
          let headerDic = {
            "Content-Type": "application/json",
            Authorization: "",
          };
          let loginMes = uni.getStorageSync("loginMesage");
          if (loginMes) {
            let access_token =
              loginMes.token_type + " " + loginMes.access_token;
            headerDic.Authorization = access_token;
          }
          uni.uploadFile({
            url: uploadUrl, //仅为示例，非真实的接口地址
            header: headerDic,
            filePath:vm.form.businessLicensePath,
            name: "file",
            formData: {
              type: "account_apply",
              uploadType: "attachment",
            },
            success: (uploadFileRes) => {
              let resData = uploadFileRes.data
                ? JSON.parse(uploadFileRes.data)
                : {};
              console.log(resData.result);
              vm.form.businessLicensePath = resData.result.url;
              if (resData.code && resData.code == 200) {
                vm.$network
                  .getData(vm.$url.BIZLICENSE, "GET", {
                    licenseUrl: resData.result.url,
                  })
                  .then((result) => {
                    console.log(result);
                    vm.form.companyName = result.name;
                    vm.form.companyCode = result.regNum;
                    vm.form.address = result.address;
                    uni.hideLoading();
                  })
                  .catch((err) => {
                    uni.hideLoading();
                  });
                console.log(resData.result.url, "-------------------");
              } else {
                console.log(uploadFileRes);
                console.log("fail");
              }
            },
            fail(){
              uni.hideLoading();
            }
          });
        }
      });
    },
    async apply(){
      if(!this.form.companyName){
        return uni.showToast({
          icon: 'none',
          title: '请填写公司名称'
        })
      }
      if(!this.form.contact){
        return uni.showToast({
          icon: 'none',
          title: '请填写联系人'
        })
      }
      if(!this.form.phoneNum){
        return uni.showToast({
          icon: 'none',
          title: '请填写联系方式'
        })
      }
      await this.$network.tenantApply(this.form)
      this.status = 1
    }
	},
};
</script>
<style lang="scss" scoped>
.page{
  height:100%;
  @include flex(column);
}
.tip{
  height:85rpx;
  line-height:85rpx;
  padding:0 24rpx;
  color:#8c8c8c;
}
.tip2{
  padding:24rpx;
}
.form{
    background: $uni-bg-color;
    .line{
      @include hairline-bottom();
      @include flex(row,center);
      height:85rpx;
      padding:0 32rpx;
      .label{
        width:170rpx;
      }
      input{
        font-size: $uni-font-size-base;
      }
    }
  }
.timeline{
  height:270rpx;
  padding:0 50rpx;
  position:relative;
  .item{
    @include flex(column,center);
    position:absolute;
    bottom:46rpx;
    z-index: 10;
    .circle{
      width:99rpx;
      height:99rpx;
      border-radius: 100%;
      background: $uni-bg-color;
      color:#FE931F;
      @include flex(row,center,center);
      font-size: 38rpx;
    }
    &.active{
      color:$uni-color-primary;
      .circle{
        background: linear-gradient(360deg, #FE7437 0%, #F52F00 100%);
        color:#fff;
      }
    }
  }
  .line{
    position:absolute;
    width:480rpx;
    left:135rpx;
    top:115rpx;
    height:1rpx;
    background: #FE931F;
    z-index: 1;
  }
}
.img-upload{
  @include flex(row,center);
  background: $uni-bg-color;
  padding:38rpx 30rpx;
  .box{
    width: 320rpx;
    height: 240rpx;
    background: #F4F4F4;
    @include flex(column,center,center);
    color:#8c8c8c;
    .iconfont{
      font-size: 80rpx;
      margin-bottom:26rpx;
    }
  }
  .img{
    width: 320rpx;
    height: 240rpx;
  }
}
.footer{
  padding: 0 30rpx;
  padding-bottom:env(safe-area-inset-bottom);
  box-sizing: content-box;
  height:100rpx;
  background-color: $uni-bg-color;
  box-shadow: 0rpx 0rpx 10rpx 0rpx rgba(0,0,0,0.27);
  @include flex(row,center,space-between);
  .btn{
    width: 255rpx;
    height: 72rpx;
    background: linear-gradient(360deg, #FE7437 0%, #F52F00 100%);
    border-radius: 36rpx;
    @include flex(row,center,center);
    font-size:32rpx;
    color:$uni-text-color-inverse;
  }
}
.audit{
  background: $uni-bg-color;
  flex:1;
  @include flex(column,center,flex-start);
  .img{
    width:321rpx;
    height:326rpx;
    margin-top:132rpx;
  }
  .msg{
    margin-top:37rpx;
    line-height:64rpx;
    font-size: 32rpx;
    text-align: center;
  }
}
</style>

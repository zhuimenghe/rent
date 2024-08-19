<template lang="">
  <view>
    <view class="card" v-if="c.type=='1'">
      <view class="head">
        <view class="icon"></view>
        开票信息
      </view>
      <view class="content padding-tb">
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">银行账号：</text>
          <text class="">{{c.bankAccount || '-'}}</text>
          <text class="margin-left-xl iconfont iconfuzhi text-grey" @click="copy(c.bankAccount)"></text>
        </view>
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">开户行：</text>
          <text class="">{{c.openingBank || '-'}}</text>
        </view>
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">纳税人识别号：</text>
          <text class="">{{c.taxNumber || '-'}}</text>
          <text class="margin-left-xl iconfont iconfuzhi text-grey" @click="copy(c.taxNumber)"></text>
        </view>
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">公司固话：</text>
          <text class="">{{c.fixedPhone || '-'}}</text>
        </view>
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">区域编码类型：</text>
          <text class="">{{c.idTypeName || '-'}}</text>
        </view>
        <view class="flex padding-tb-sm align-center">
          <text class="text-gray">区域编码：</text>
          <text class="">{{c.idNumber || '-'}}</text>
        </view>
      </view>
    </view>
    <view class="card">
      <view class="head head-flex" >
        <view >
          <view class="icon"></view>
        联系人
        </view>
        <view class="add-btn" @click="addContact('add')">
          <!-- <text style="font-size:40rpx;margin-right:3px">+</text> -->
         新增联系人
        </view>
      </view> 
      <view class="contact" v-for="(p,i) in contacts" :key="i">
        <view>
          <view class="pdlr28 flex align-center justify-between">
            <view class="text-bold fs32 flex align-center ">
              <text class='overflow-hidden'>{{p.name}} （{{p.phoneNum}}）</text>
              <img class='img-verified' v-if="p.verified" :src="verifed" alt="已实名">
              <img class='img-verified' v-else :src="unverifed" alt="未实名">
            </view>
          <view class="iconfont icontelephone" @click="callPhone(p.phoneNum)"></view>
          </view>
          <view class="pdlr28 margin-top5  text-df text-gray">
            联系人职责：{{p.dutyListName&&p.dutyListName.split(',').join('、')||'-'}}
          </view>
          <view class="pdlr28 margin-top text-df text-gray flex align-center justify-between">
            <view>
              身份证号:{{p.identity || '-'}} 
            </view>
          </view>
          <view  class="pdlr28 margin-top text-df text-gray">
            联系地址:{{p.address || '-'}}
          </view>
          <view   class="pdlr28 margin-top text-df text-gray">
            备注:{{p.remark || '-'}}
          </view>
          <view class="pdlr28 margin-top11 text-df text-gray operate-btn flex align-center justify-between bg-gray-lighter">
            <view class="flex align-center ">
              <text class="wenhao" @click="showDialog(p)">?</text>
              <text class="text">租户端授权</text>
              <switch 
              style="transform: scale(0.5)"
            :checked="p.rentalPermission"
            color="#3288FF" 
            @change="permissionChange($event,p)" 
				/>
            </view>
            <view v-if="p.id!=0" class="edit-btn flex align-center" @click="addContact('edit',p)">
              <i class="iconfont iconzl--bianji"></i>修改
            </view>
          </view>
        </view>
      </view>
      <view v-if="!contacts||!contacts.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
    </view>
    <view class="card" v-if="c.type=='1'">
      <view class="head">
        <view class="icon"></view>
        营业执照
      </view>
      <imgupload
        v-if="c.businessLicenseList&&c.businessLicenseList.length > 0"
        :isupload="false"
        :isShowBg="false"
        :isShowLabel="false"
        :imgFinishlist="c.businessLicenseList"
      ></imgupload>
      <view v-if="!c.businessLicenseList||!c.businessLicenseList.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
      <!-- <view class="imgs">
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
      </view> -->
    </view>
    <view class="card" v-else>
      <view class="head">
        <view class="icon"></view>
        身份证照片
      </view>
      <imgupload
        v-if="idCards&&idCards.length > 0"
        :isupload="false"
        :isShowBg="false"
        :isShowLabel="false"
        :imgFinishlist="idCards"
      ></imgupload>
      <view v-if="!idCards||!idCards.length" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
      <!-- <view class="imgs">
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
      </view> -->
    </view>
    <view class="card">
      <view class="head">
        <view class="icon"></view>
        其他附加
      </view>
      <imgupload
        v-if="c.otherAttachmentsList&&c.otherAttachmentsList.length > 0"
        :isupload="false"
        :isShowBg="false"
        :isShowLabel="false"
        :imgFinishlist="c.otherAttachmentsList"
      ></imgupload>
      <imgupload
        v-if="c.personalCustomerAttachmentFileList&&c.personalCustomerAttachmentFileList.length > 0"
        :isupload="false"
        :isShowBg="false"
        :isShowLabel="false"
        :imgFinishlist="c.personalCustomerAttachmentFileList"
      ></imgupload>
      <view v-if="(!c.otherAttachmentsList||!c.otherAttachmentsList.length)&&(!c.personalCustomerAttachmentFileList||!c.personalCustomerAttachmentFileList.length)" class="empty-data-box">
        <image class="img" mode="widthFix" src="/static/empty.png"></image>
        <text class="text">暂无内容</text>
      </view>
      <uni-popup ref="popup" :is-mask-click='false'  background-color="#fff" >
        <!-- :class="{ 'popup-height': type === 'left' || type === 'right' }" -->
				<view class="popup-content popup-dialog">
          <view class="popup-title">提示</view>
          <view
						class="text">开启后当前用户可使用手机号访问三一租赁租户端小程序查看签订的合同信息、设备信息
        </view>
          </view>
          <text class="popup-btn" @click="hiddenDialog">关闭</text>
			</uni-popup>
      <!-- <view class="imgs">
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
        <image class="img" src="https://app-package-sany.oss-cn-beijing.aliyuncs.com/appAssets/official-scan.png?versionId=CAEQIRiBgIDIoZ.YixgiIDc2ZjFhZGI2YzVlYTQ1ODJhZDIyNzMzNWYzOWMxZDMz"></image>
      </view> -->
    </view>
  </view>
</template>
<script>
import imgupload from "@/components/common/image-upload/image-upload.vue";
import util from '@/common/common-method/common-method'
import verifed from '@/static/verifed.png'
import unverifed from '@/static/unverifed.png'
export default {
  components: { imgupload },
  props: {
    c: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      contactDutys: [],
      verifed,
      unverifed,
    }
  },
  computed: {
    contacts() {
      // if (this.c.type == '1') {
      //   return this.c.contactsList
      // } else {
      //   return [{
      //     name: this.c.name,
      //     dutyList: [],
      //     phoneNum: this.c.phoneNum,
      //     email: this.c.email,
      //     identity: this.c.identity,
      //     address: this.c.address,
      //     remark: this.c.remark,
      //     rentalPermission: this.c.rentalPermission,
      //     verified: this.c.verified
      //   }]
      // }
      return this.c.contactsList
    },
    idCards() {
      let list = []
      if (this.c.identityCardFront) {
        list = list.concat(this.c.identityCardFront)
      }
      if (this.c.identityCardBehind) {
        list = list.concat(this.c.identityCardBehind)
      }
      return list
    }
  },
  methods: {
    hiddenDialog() {
      this.$refs.popup.close();
    },
    showDialog() {
      this.$refs.popup.open()
    },
    //回调函数方法
    async permissionChange(rp, row) {
      console.log(rp, row, 'permissionChange');
      let data = {
        customerId: this.c.id,
        "customerContactId": row.id == 0 ? null : row.id,
        "rentalPermission": rp.detail.value
      }
      let url = this.$url.RENTAL_PERMISSION;
      let res = await this.$network
        .getData(url, "PUT", data)
      row.rentalPermission = rp.detail.value
    },
    addContact(key, row) {
      console.log(row, 'addContact');
      let param = {};
      key == 'add' ? param = { type:this.c.type,customerId: this.c.id } : param = { customerId: this.c.id, ...row,type:this.c.type };
      let url = '/otherPages/linkman/connect-create?item=' + encodeURIComponent(JSON.stringify(param)) + '&edit=true';
      uni.navigateTo({
        url: url
      });
    },
    init() {
      this.getContactDuty()
    },
    getContactDuty() {
      this.$network.loadType('contact_duty').then((res) => {
        this.contactDutys = res;
      });
    },
    duty(val) {
      let duty = [];
      this.contactDutys.map((item) => {
        val.map((i) => {
          if (item.value === i) {
            duty.push(item.label);
          }
        });
      });
      return duty.join(",");
    },
    callPhone(phone) {
      uni.makePhoneCall({ phoneNumber: phone })
    },
    copy(c) {
      if (c) {
        util.copy(c)
      }
    }
  }
}
</script>
<style lang="scss">
@import './custom-detail.scss';
</style>
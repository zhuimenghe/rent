<template>
  <scroll-view
    scroll-y="true"
    class="choose-bg-view"
    ref="list"
    :class="{ 'popup-show': popupShow }"
    @scroll="onScroll"
    :style="viewPosition"
  >
    <view class="add-container" @click="gotoCompany">
      <i class="iconfont labelstyle iconadd"></i>
    </view>
    <list class="list-style">
      <!-- @click="backToPre(item)" -->
      <radio-group>
        <cell class="cell-style-company" v-for="item in datalist" :key="item">
          <view>
            <view class="cell-view-part title-style">
              <text>{{ item.name }}</text>
            </view>
            <cell
              class="cell-style-driver"
              v-for="driver in item.logisticsDrivers"
              :key="driver"
            >
              <view class="cell-view-part subtitle-style">
                <text>{{ "联系人:" + driver.name }}</text>
              </view>
              <view class="cell-view-part subtitle-style">
                <text>{{ "电话:" + driver.phoneNum }}</text>
              </view>
              <view class="cell-view-part subtitle-style cell-check-part">
                <radio
                  :value="driver.id"
                  :checked="driver.id === currentId"
                  activeBorderColor="#e60000"
                  iconColor="#e60000"
                  color="#e60000"
                  @click="selectDriver(item, driver)"
                />
              </view>
            </cell>
            <view
              class="cell-style-driver cell-style-driver-add"
              @click="openAddContactPopup(item)"
              >+ 添加物流联系人</view
            >
          </view>
        </cell>
        <cell style="height: 200px">
          <view><uni-load-more iconType="auto" :status="morestatus" /></view>
        </cell>
      </radio-group>
    </list>
    <view class="bottom-view">
      <view class="bottom-btn btn-cancel" @click="cancel">取消</view>
      <view class="bottom-btn btn-confirm" @click="confirm">确定</view>
    </view>

    <!-- 添加联系人模态框 -->
    <uni-popup ref="addContactPopup" type="center" class="popup-view" :mask-click="false">
      <view class="popup-content">
        <view class="popup-title">新增物流联系人</view>
        <view class="row-item">
          <view class="row-tag"> 姓名<span style="color: #ff0000">*</span> </view>
          <input class="input-style" v-model="newContact.name" placeholder="联系人姓名" />
        </view>
        <view class="row-item">
          <view class="row-tag"> 电话<span style="color: #ff0000">*</span> </view>
          <input
            class="input-style"
            v-model="newContact.phoneNum"
            placeholder="联系人电话"
          />
        </view>
        <view class="col-item">
          <view class="row-tag"> 备注 </view>
          <textarea
            class="text-style"
            v-model="newContact.remark"
            placeholder="请输入备注..."
          />
        </view>
        <view style="margin-left: -10px">
          <imgupload
            @uploadfinish="uploadfinish"
            @deleteUrl="deleteUrl"
            :imgFinishlist="newContact.fileList"
            type="logistics_driver"
            uploadType="attachment"
            :maximg="20"
          />
        </view>
        <!-- <button @click="uploadAttachment">上传附件</button> -->
        <view class="bottom-popup">
          <view class="bottom-btn btn-cancel" @click="cancelAddContact">取消</view>
          <view class="bottom-btn btn-confirm" @click="confirmAddContact">确定</view>
        </view>
      </view>
    </uni-popup>

    <s-sany-popup ref="customToast"></s-sany-popup>
  </scroll-view>
</template>
<script>
import imgupload from "@/components/common/image-upload/image-upload.vue";
import uniLoadMore from "@/components/common/uni-load-more/uni-load-more.vue";
import datestr from "@/common/common-method/common-method.js";
export default {
  components: {
    imgupload,
    uniLoadMore,
  },
  data() {
    return {
      datalist: [],
      page: 1,
      morestatus: "more",
      typestr: "",
      searchKey: "",
      currentId: "",
      selectedCompany: null, // 新增
      selectedDriver: null, // 新增
      popupShow: false,
      viewPosition: "",
      newContact: {
        name: "",
        phoneNum: "",
        remark: "",
        attachment: "",
      },
    };
  },
  //下拉刷新
  onPullDownRefresh() {
    this.page = 1;
    this.datalist = [];
    this.getdata();
  },
  //上拉加载
  onReachBottom() {
    if (this.morestatus == "noMore") {
      return;
    }
    this.page += 1;
    this.morestatus = "loading";
    this.getdata();
  },
  methods: {
    //上传图片回调
    uploadfinish(val) {
      let list = val.data;
      this.newContact = {
        ...this.newContact,
        fileList: [...list],
      };
    },
    //删除回调
    deleteUrl(val) {
      let list = val.data;
      this.newContact = {
        ...this.newContact,
        fileList: [...list],
      };
    },
    cancelAddContact() {
      this.newContact = {
        name: "",
        phoneNum: "",
        remark: "",
        attachment: "",
      };
      this.closeAddContactPopup();
    },
    confirmAddContact() {
      this.addContact();
    },
    cancel() {
      // this.closeAddContactPopup();
      uni.navigateBack({
        animationDuration: 200,
      });
    },
    confirm() {
      if (this.selectedDriver && this.selectedCompany) {
        this.backToPre({
          ...this.selectedDriver,
          company: this.selectedCompany,
        });
      } else {
        // 提示用户选择
        this.$refs.customToast.showModal({
          title: "异常",
          content: "请先选择一个物流联系人",
        });
      }
    },
    selectDriver(company, driver) {
      this.currentId = driver.id;
      this.selectedCompany = company;
      this.selectedDriver = driver;
    },
    onScroll(e) {
      if (e.detail.scrollTop) this.viewPosition = "top:" + e.detail.scrollTop;
    },
    openAddContactPopup(company) {
      this.selectedCompany = company;
      this.popupShow = true;
      this.$refs.addContactPopup.open();
      // const query = uni.createSelectorQuery().in(this);
      // query
      //   .select(".choose-bg-view")
      //   .scrollOffset()
      //   .exec((res) => {
      //     console.log("当前滚动距离:", res[0].scrollTop);
      //     this.viewPosition = "top:" + res[0].scrollTop;

      //   });
    },
    closeAddContactPopup() {
      this.popupShow = false;
      this.viewPosition = "";
      this.$refs.addContactPopup.close();
    },
    async addContact() {
      if (!this.newContact.name) {
        this.$refs.customToast.showModal({ title: "异常", content: "请填写联系人姓名" });
        return;
      }
      if (!datestr.isphonenum(this.newContact.phoneNum)) {
        this.$refs.customToast.showModal({
          title: "异常",
          content: "电话号码格式不正确",
        });
        return;
      }
      if (this.selectedCompany) {
        await this.$network.getData(this.$url.ADD_LOGISTICS_CONTACT, "POST", {
          companyId: this.selectedCompany.id,
          logisticsProviderType: "2",
          ...this.newContact,
        });
        this.cancelAddContact();
        this.getdata(); // 刷新页面数据
      }
    },
    searchTo() {
      uni.showLoading();
      this.page = 1;
      this.datalist = [];
      this.getdata();
    },
    getdata(customid) {
      let param = {
        current: this.page,
        size: 9999,
        businessKey: this.searchKey || null,
        isExport: false,
      };
      this.$network
        .getData(this.$url.CONTRACT_LOGISTICS_COMPANY_LIST, "POST", param)
        .then((result) => {
          this.datalist = result.records;
          let pages = result.pages;
          if (pages <= this.page) {
            this.morestatus = "noMore";
          } else {
            this.morestatus = "more";
          }
          uni.stopPullDownRefresh();
          uni.hideLoading();
        })
        .catch((err) => {
          this.morestatus = "noMore";
          uni.stopPullDownRefresh();
          uni.hideLoading();
        });
    },
    backToPre(item) {
      uni.$emit("choose-trans-emit", {
        dict: item,
        type: this.typestr,
      });
      uni.navigateBack({
        animationDuration: 200,
      });
    },
    gotoCompany() {
      let url = "../../otherPages/logistics/logistics-company/create-company";
      uni.navigateTo({
        url: url,
      });
    },
  },
  onLoad(option) {
    if (option.type) {
      this.typestr = option.type;
    }
    this.getdata();
  },
  onShow() {
    this.getdata();
  },
};
</script>

<style lang="scss" scoped>
.choose-bg-view {
  flex: 1;
  background: $uni-bg-color-grey;

  &.popup-show {
    overflow: hidden;
    position: fixed;
    left: 0;
    right: 0;
  }
}

.list-style {
  display: flex;
  flex: 1;
  flex-direction: column;
  margin-top: 10px;
}

.cell-style-company {
  display: flex;
  flex-direction: column;
  line-height: 60rpx;
  margin-left: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  background: #ffffff;

  &:last-child {
    margin-bottom: 100px;
  }
}

.cell-style-driver {
  display: flex;
  flex-direction: row;
  line-height: 60rpx;
  border-bottom-color: #eeeeee;
  border-bottom-style: solid;
  border-bottom-width: 1px;
  background: #ffffff;
  text-align: center;

  &.cell-style-driver-add {
    text-align: center;
    color: #e60000;
    line-height: 80rpx;
    display: block;
  }
}

.cell-view-part {
  display: flex;
  flex: 1;
  background: #ffffff;
  margin-left: 10px;
  justify-content: flex-start;
  margin: 5px;
}

.title-style {
  font-size: $uni-font-size-lg;
  color: $uni-text-color;
  font-weight: bold;
}

.subtitle-style {
  font-size: $uni-font-size-base;
  color: $uni-text-color-gray;
  text-align: left;
  max-width: 40%;
  word-break: break-all;
}

.filter-top-view {
  position: fixed;
  display: flex;
  flex-direction: row;
  top: 0;
  height: 50px;
  left: 0;
  right: 0;
  z-index: 100;
  background: #ffffff;
  overflow: hidden;
  align-items: center;
  justify-content: flex-start;
}

.search-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  margin-bottom: 1px;
  width: 50%;
  float: left;
  box-sizing: border-box;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 5px;
  flex-direction: row;
  padding-left: 5px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
  margin-right: 5px;
}

.search-content {
  display: flex;
  flex: 1;
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 5px;
  margin-right: 10px;
}

.filter-view-style {
  height: 35px;
  display: flex;
  background: $uni-color-primary;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  border-radius: 5px;
  font-size: $uni-font-size-base;
  color: #ffffff;
  padding-left: 10px;
  padding-right: 10px;
}

//添加按钮
.add-container {
  position: fixed;
  z-index: 11;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 100px;
  right: 44rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 100%;
  box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.2);
  color: $uni-text-color-inverse;
  background-color: #f08200;

  .iconfont {
    font-size: 48rpx;
  }
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

.cell-check-part {
  flex: inherit;
}

.bottom-popup {
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  display: flex;
}

.bottom-view {
  position: fixed;
  display: flex;
  left: 0px;
  right: 0px;
  bottom: 0px;
  height: 60px;
  justify-content: flex-end;
  flex-direction: row;
  align-items: center;
  background: #ffffff;
  z-index: 100;
}

.bottom-btn {
  display: flex;
  flex: 1;
  height: 40px;
  border-radius: 3px;
  background: #dcdfe6;
  font-size: 32rpx;
  color: #fff;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: 10px;
  margin-left: 10px;

  &.btn-confirm {
    display: flex;
    flex: 1;
    height: 40px;
    border-radius: 3px;
    background: #e60000;
    font-size: 32rpx;
    color: #ffffff;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    margin-right: 10px;
  }
}

.popup-content {
  background: #ffffff;
  width: 80vw;
  padding: 20rpx;
  border-radius: 20rpx;

  .popup-title {
    font-size: $uni-font-size-lg;
    color: $uni-text-color;
    font-weight: bold;
    padding: 20rpx 0;
  }

  .row-item {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 0px;
    color: $uni-text-color;
    font-size: $uni-font-size-base;
    border-bottom: 1px solid $uni-bg-color-grey;

    .row-tag {
      width: 98px;
      text-align: left;
    }

    .input-style {
      flex: 1;
      text-align: right;
      font-size: $uni-font-size-base;
    }
  }

  .col-item {
    display: flex;
    margin-top: 5px;
    flex-direction: column;
    align-items: flex-start;
    color: $uni-text-color;
    font-size: $uni-font-size-base;

    .text-style {
      color: $uni-text-color;
      font-size: $uni-font-size-base;
      padding: 2px 6px;
      border: 1px solid $uni-bg-color-grey;
      border-radius: 4px;
      height: 45px;
      width: calc(100% - 15px);
      margin-top: 8px;
    }
  }
}
</style>

<template>
  <view class="content">
    <s-sany-popup ref="customToast"></s-sany-popup>
    <canvas canvas-id="canvas" class="share__canvas"></canvas>
    <view class="operationView draw_canvas" v-if="dataDic.operatorName">
      <view class="operation draw_canvas">
        <view class="title draw_canvas" data-type="text" :data-text="dataDic.orgCode"></view>
        <view class="operationBody draw_canvas">
          <view class="_text draw_canvas" data-type="text" data-text="高空作业操作证"></view>
          <image class="_img draw_canvas" data-type="image" :data-url="dataDic.iconFile.url" data-delay="1"
            mode="aspectFit"></image>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="姓名"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dataDic.operatorName">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="身份证号"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dataDic.operatorIdentity">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="操作车型"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dataDic.operatorMachineType">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="培训时间"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dateSlice(dataDic.operatorTrainDate)">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="有效日期"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dateSlice(dataDic.effectiveDate)">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
        </view>
        <view class="_title draw_canvas" data-type="text" :data-text="dataDic.orgName"></view>
        <image v-if="dataDic.sealFileList" class="_seal draw_canvas" data-type="image"
          :data-url="dataDic.sealFileList[0].url" data-delay="1" mode="aspectFit"></image>
      </view>
    </view>
    <view class="operationViews draw_canvas" v-if="picList.length != 0">
      <view class="operation draw_canvas" v-for="item in picList">
        <view class="title draw_canvas" data-type="text" :data-text="item.orgCode"></view>
        <view class="operationBody draw_canvas">
          <view class="_text draw_canvas" data-type="text" data-text="高空作业操作证"></view>
          <image class="_img draw_canvas" data-type="image" :data-url="item.iconFile.url" data-delay="1"
            mode="aspectFit"></image>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="姓名"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="item.operatorName">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="身份证号"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="item.operatorIdentity">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="操作车型"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="item.operatorMachineType">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="培训时间"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dateSlice(item.operatorTrainDate)">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
          <view class="bodyItem draw_canvas">
            <view class="left draw_canvas" data-type="text" data-text="有效日期"></view>
            <view class="right draw_canvas">
              <view class="rightText draw_canvas" data-type="text" :data-text="dateSlice(item.effectiveDate)">
              </view>
              <view class="rightline draw_canvas" data-type="text"></view>
            </view>
          </view>
        </view>
        <view class="_title draw_canvas" data-type="text" :data-text="item.orgName"></view>

        <image v-if="item.sealFileList" class="_seal draw_canvas" data-type="image" :data-url="item.sealFileList[0].url"
          data-delay="1" mode="aspectFit"></image>
      </view>
    </view>
    <view class="search-container">
      <view class="search-top">
        <view class="select-container"> </view>
        <view class="search-box">
          <i class="iconfont search-icon iconzl--sousuo"></i>
          <view class="search-content"><input placeholder="姓名/身份证号" placeholder-class="placeholder-style"
              @input="searchChange" v-model="fuzzyParam" /></view>
        </view>
        <view class="more-css" @click="drawImages"><text>批量下载</text></view>
      </view>
    </view>

    <view class="list-container" show-scrollbar="false">
      <view v-for="(item, index) in datalist" :key="index" class="box">
        <view class="boxBody">
          <image class="imageShow" mode="aspectFit" :src="item.iconFile.url"></image>
          <view class="content">
            <p class="boxtitle">
              {{ item.operatorName }}（{{ item.orgCode }}）
            </p>
            <p>身份证号：{{ item.operatorIdentity }}</p>
            <p>操作车型：{{ item.operatorMachineType }}</p>
            <p>培训时间：{{ dateSlice(item.operatorTrainDate) }}</p>
            <p>有效日期：{{ dateSlice(item.effectiveDate) }}</p>
          </view>
        </view>

        <view class="cell-bg-view" @click="changeCheck(index)">
          <mycheckbox class="checkbox" :checked="item.checked" color="#E60000" :value="index"
             :disabled="item.disabled" />
          <view class="bottom-btns-view">
            <view class="tag-btns-view" @click.stop="edit(item)">{{
      "修改"
    }}</view>
            <view class="tag-btns-view" @click.stop="drawImage(item)">{{
      "下载"
    }}</view>
            <button style="line-height: 20px !important; margin-right: 0" class="tag-btns-view" @click="delItem(item)">
              {{ "删除" }}
            </button>
          </view>
        </view>
      </view>
    </view>

    <view class="add-device-my" @click="goToAdd()">
      <text class="iconfont iconadd"></text>
    </view>
    <w-picker :selectList="selectList" @confirm="onConfirm" mode="selector" ref="selector" themeColor="#E60000" />
    <w-picker mode="date" startYear="2000" endYear="3000" :current="true" @confirm="onConfirmDate" :disabledAfter="true"
      ref="date" themeColor="#E60000" />
  </view>
</template>
<script>
import Wxml2Canvas from "wxml2canvas";
import { mapState } from "vuex";
import wPicker from "@/components/common/w-picker/w-picker.vue";
import labelArrow from "@/components/common/common-ui/label-arrow.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";
export default {
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      isShowGroup: false,
      datalist: [],
      url: "",
      show: false,
      userList: [],
      selectList: [],
      flowId: "",
      title: "",
      fuzzyParam: "",
      checkNum: 0,
      dataDic: {},
      picList: [],
    };
  },
  components: {
    wPicker,
    labelArrow,
    selectView,
  },
  computed: {
    ...mapState("system", {
      posTop: (s) => s.statusBarHeight + s.titleBarHeight,
    }),
  },
  watch: {
    checkNum(val) {
      if (val == 9) {
        this.datalist.forEach((e) => {
          if (e.checked) {
          } else {
            e.disabled = true;
          }
        });
      } else {
        this.datalist.forEach((e) => {
          e.disabled = false;
        });
      }
    },
  },
  mounted() { },
  onShow() {
    this.getList();
  },

  methods: {
    getList() {
      let param = {
        current: 1,
        size: 500,
        fuzzyParam: this.fuzzyParam,
      };

      let url = this.$url.certificateGetPage;
      this.$network
        .getData(url, "POST", param)
        .then((result) => {
          this.datalist = result.records;
          this.datalist.forEach((e) => {
            e.checked = false;
            e.disabled = false;
          });
          uni.stopPullDownRefresh();
        })
        .catch((err) => { });
    },
    searchChange() {
      this.getList();
    },
    showdatepick(type) {
      this.picktype = type;
      this.$refs.date.show();
    },

    onPullDownRefresh() {
      this.page = 1;
      this.datalist = [];
      this.getList();
    },

    download(item) { },
    // 时间显示
    dateSlice(date) {
      if (!date) return;
      if (date.search(" ") == -1) {
        return date;
      } else {
        return date.slice(0, date.search(" "));
      }
    },
    goToAdd() {
      uni.navigateTo({
        url: "/otherPages/logistics/operationAdd",
      });
    },
    drawImage(item) {
      this.dataDic = item;
      let drawImage = new Wxml2Canvas({
        width: 595, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
        height: 842, // 高
        element: "canvas",
        background: "#f0f0f0",
        progress(percent) { },
        finish(url) {
          uni.saveImageToPhotosAlbum({
            filePath: url,
            success: function () {
              uni.showToast({
                icon: "none",
                title: "下载成功，请到手机相册查看",
              });
            },
          });
        },
        error(res) { },
      });
      let data = {
        list: [
          {
            type: "wxml",
            class: ".operationView .draw_canvas", // draw_canvas指定待绘制的元素
            limit: ".operationView", // 限定绘制元素的范围，取指定元素与它的相对位置
            x: 0,
            y: 0,
          },
        ],
      };

      drawImage.draw(data);
    },
    drawImages() {
      let _this = this;
      _this.picList = [];
      _this.datalist.map((e) => {
        if (e.checked) {
          _this.picList.push(e);
        }
      });
      uni.showLoading();
      let drawImage = new Wxml2Canvas({
        width: 595, // 宽， 以iphone6为基准，传具体数值，其他机型自动适配
        height: 842, // 高
        element: "canvas",
        background: "#f0f0f0",
        progress(percent) { },
        finish(url) {
          console.log(url);
          uni.hideLoading();
          uni.saveImageToPhotosAlbum({
            filePath: url,
            success: function () {
              uni.showToast({
                icon: "none",
                title: "下载成功，请到手机相册查看",
              });
              _this.datalist.map((e) => {
                e.checked = false;
              });
              _this.$forceUpdate();
            },
          });
        },
        error(res) { },
      });
      let data = {
        list: [
          {
            type: "wxml",
            class: ".operationViews .draw_canvas", // draw_canvas指定待绘制的元素
            limit: ".operationViews", // 限定绘制元素的范围，取指定元素与它的相对位置
            x: 0,
            y: 0,
          },
        ],
      };

      drawImage.draw(data);
    },
    edit(item) {
      console.log(item);
      uni.navigateTo({
        url: `/otherPages/logistics/operationAdd?dataDic=${encodeURIComponent(
          JSON.stringify(item)
        )}`,
      });
    },
    delItem(item) {
      uni.showModal({
        title: "提示",
        content: "确定要删除该设备么?",
        success: (res) => {
          if (res.cancel) {
          } else {
            let url = this.$url.certificateAdd + `/${item.id}`;
            this.$network
              .getData(url, "DELETE")
              .then((result) => {
                this.getList();
              })
              .catch((err) => { });
          }
        },
      });
    },
    changeCheck(i) {
      this.datalist[i].checked = !this.datalist[i].checked;
      this.$forceUpdate();
      this.checkNum = 0;
      this.datalist.map((e) => {
        if (e.checked) {
          this.checkNum++;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .attacment-style {
  padding: 4px 0 !important;
}
.count {
  font-size: 30rpx;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #1278ff;
  margin: 0 8rpx 0 24rpx;
}
.content {
  width: 100%;
  height: 100%;
  background-color: $uni-bg-color-grey;
  position: relative;
}

.float-view {
  position: fixed;
  display: flex;
  bottom: 16px;
  right: 16px;
  width: 50px;
  height: auto;
  box-shadow: 1px 1px 4px #eeeeee;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  z-index: 300;
  background-color: #ffffff;
}

.more-css {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-left: 8px;
  padding-right: 8px;
  // margin-right: 12px;
  height: 30px;
  border-radius: 4px;
  font-size: $uni-font-size-base;
  color: #222222;
}

//添加按钮
.add-container {
  // position: fixed;
  display: flex;
  // bottom: 32px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.rubbish-container {
  // position: fixed;
  display: flex;
  // bottom: 92px;
  // right: 16px;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  // box-shadow: 0px 0px 10px #E60000;
  justify-content: center;
  align-items: center;
  background-color: $uni-color-primary;
}

.show-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
  position: fixed;
  display: flex;
  box-shadow: 0px 0px 10px #eeeeee;
  right: 0px;
  bottom: 16px;
  z-index: 960;
}

.close-icon {
  font-size: 20px;
  color: #aaaaaa;
  margin-top: 10px;
}

.labelstyle {
  color: #ffffff;
  font-size: 30px;
  font-weight: bold;
}

.labelstyle-text {
  color: #ffffff;
  font-size: 18px;
  font-weight: bold;
}

.labelstylerubbish {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
}

.search-container {
  position: sticky;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #ffffff;
  z-index: 100;
}
.list-med {
  position: relative;
  width: 100%;
  background: $uni-bg-color-grey;
}

.search-top {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  background: #ffffff;
}

.search-bottom {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 100%;
  z-index: 55;
  color: $uni-color-title;
  margin: 5px;
  font-size: $uni-font-size-sm;
  text-align: center;
}

.select-view {
  flex: 1;
}

.search-box {
  background: #f7f7f7;
  height: 35px;
  flex: 1;
  line-height: 35px;
  display: flex;
  margin: 8px 8px;
  flex-direction: row;
  padding-left: 8px;
  border-radius: 4px;
  justify-content: flex-start;
  align-items: center;
}

.select-container {
  display: flex;
  // width: 40%;
  flex-direction: column;
  position: relative;
}

.select-label {
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
  justify-content: center;
  align-items: center;
  text-align: center;
  // border: 1px solid #AAAAAA;
  padding: 2px 4px;
  border-radius: 4px;
}

.select-list {
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 28px;
  left: 0px;
  width: 150%;
  font-size: $uni-font-size-base;
  text-align: center;
  background-color: $uni-bg-color-grey;
  border-radius: 0px 0px 4px 4px;
}

.checkbox {
  justify-content: flex-end;
  transform: scale(0.6);
  margin-left: 10px;
}

.select-item {
  display: flex;
  flex-direction: row;
  padding: 10px 10px;
  width: 100%;
  background-color: #ffffff;
  text-align: left;
  margin-top: 1rpx;
  padding-left: 15px;
}

.search-icon {
  color: #999999;
  font-size: $uni-font-size-base;
}

.search-content {
  color: #999999;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  flex: 1;
}

.title-tag-text {
  color: #ffffff;
  box-sizing: border-box;
  font-size: 12px;
  padding: 2px;
  text-align: center;
  background-color: #e60000;
  border-radius: 4px;
  font-weight: 400;
}

.option-btn {
  padding: 0px 10px;
  border-radius: 20px;
  border: 1px solid $uni-color-primary;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
  height: 24px;
  line-height: 24px;
}

.pop-container {
  position: relative;
  z-index: 999;
}

.select-view-row {
  margin-left: 10px;
  min-width: 80px;
  align-items: center;
  justify-content: flex-start;
  background: #ffffff;
  display: flex;
  flex-direction: row;
}

.btn-container {
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
}
.cell-bg-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
  padding: 2px 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: $uni-font-size-base;
  color: $uni-color-primary;
  background-color: #ffffff;
  border-radius: 16px;
  border: 1px solid $uni-color-primary;
  margin: 0px 4px;

  &.active {
    background-color: $uni-color-primary;
    color: #ffffff;
  }
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}

.uni-tip-group-button {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}

.bottom-btns-view {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.tag-btns-view {
  padding: 3px 15px;
  border-radius: 50px;
  border: $uni-color-primary 1px solid;
  color: $uni-color-primary;
  font-size: $uni-font-size-base;
  margin-left: 10px;
}
.add-device {
  width: 96rpx;
  height: 96rpx;
  background: #f08200;
  box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.2);
  @include flex(row, center, center);
  border-radius: 100%;
  color: $uni-text-color-inverse;
  position: fixed;
  right: 44rpx;
  bottom: 150rpx;
  .iconfont {
    font-size: 48rpx;
  }
}

.title {
  color: #222222;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.create {
  color: #222222;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  margin-bottom: 8px;
}

.clear {
  background-color: $uni-border-color;
}

.confirm {
  background-color: $uni-color-primary;
}
._btn {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
  margin-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  text-align: center;
  border-radius: 4px;
  flex: 1;
  color: #ffffff;
  font-size: $uni-font-size-base;
}
.add-device-my {
  width: 96rpx;
  height: 96rpx;
  background: #f08200;
  box-shadow: 0px 0px 16rpx 0px rgba(0, 0, 0, 0.2);
  @include flex(row, center, center);
  border-radius: 100%;
  color: $uni-text-color-inverse;
  position: fixed;
  right: 44rpx;
  bottom: 136px;
  .iconfont {
    font-size: 48rpx;
  }
}
.list-container {
  .box {
    background-color: #fff;
    margin: 8px 0;
    padding: 12px;

    .boxBody {
      display: grid;
      grid-template-columns: 28% 70%;
      .content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-color: #fff;
        .boxtitle {
          color: #222222;
          font-size: 16px;

          font-weight: 600;
        }
        p {
          background-color: #fff;
          color: #8c8c8c;
          font-size: 12px;
        }
      }
      .imageShow {
        display: block;
        box-sizing: border-box;
        width: 90px;
        height: 120px;
        margin-right: 8px;
      }
    }
  }
}
.share__canvas {
  position: fixed;
  top: -1900px;
  width: 595px !important;
  height: 842px !important;
}
.operationView {
  position: fixed;
  top: -2900px;
  width: 595px;
  height: 842px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding: 16px;
  .operation {
    position: relative;
    width: 176px;
    height: 261px;
    .title {
      height: 32px;
      line-height: 32px;
      background-color: #004684;
      color: #fff;
      text-align: center;
    }
    .operationBody {
      padding: 0 15px;
      overflow: hidden;
      ._text {
        height: 16px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        letter-spacing: 2px;
      }
      ._img {
        display: block;
        width: 54px;
        height: 60px;
        margin: 0 auto;
      }
      .bodyItem {
        box-sizing: border-box;
        width: 100%;
        height: 23px;
        display: grid;
        grid-template-columns: 20% 70%;
        grid-gap: 15px;
        align-items: center;
        font-size: 9px !important;
        .left {
          display: flex;
          justify-content: space-between;
          text-align: left;
          margin-right: 15px;
          width:60px;
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          .rightText {
            width: 100%;
            height: 13px;
            line-height: 13px;
            margin-top: 2px;
          }
          .rightline {
            height: 0.5px;
            margin-top: 3px;
            background-color: #000;
            width: 100%;
          }
        }
      }
    }
    ._title {
      height: 22px;
      line-height: 22px;
      font-size: 10px;
      background-color: #004684;
      color: #fff;
      text-align: center;
    }
    ._seal {
      position: absolute;
      display: block;
      width: 99px;
      height: 99px;
      bottom: 22px;
      left: 60px;
    }
  }
}
.operationViews {
  position: fixed;
  top: -2900px;
  width: 595px;
  height: 842px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  padding: 16px;
  .operation {
    position: relative;
    width: 176px;
    height: 261px;
    .title {
      height: 32px;
      line-height: 32px;
      background-color: #004684;
      color: #fff;
      text-align: center;
    }
    .operationBody {
      padding: 0 15px;
      overflow: hidden;
      ._text {
        height: 16px;
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
        line-height: 17px;
        letter-spacing: 2px;
      }
      ._img {
        display: block;
        width: 54px;
        height: 60px;
        margin: 0 auto;
      }
      .bodyItem {
        box-sizing: border-box;
        width: 100%;
        height: 23px;
        display: grid;
        grid-template-columns: 20% 70%;
        grid-gap: 15px;
        align-items: center;
        font-size: 9px !important;
        .left {
          display: flex;
          justify-content: space-between;
          margin-right: 15px;
          width: 60px;
        }
        .right {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
          .rightText {
            width: 100%;
            height: 13px;
            line-height: 13px;
            margin-top: 2px;
          }
          .rightline {
            height: 0.5px;
            background-color: #000;
            width: 100%;
            margin-top: 3px;
          }
        }
      }
    }
    ._title {
      height: 22px;
      line-height: 22px;
      font-size: 10px;
      background-color: #004684;
      color: #fff;
      text-align: center;
    }
    ._seal {
      position: absolute;
      display: block;
      width: 99px;
      height: 99px;
      bottom: 22px;
      left: 60px;
    }
  }
}
::v-deep.checkbox .bgclass {
  width: 30px !important;
  height: 30px !important;
}
.checkbox {
  margin-left: 0;
}
</style>

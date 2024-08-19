<template>
  <view>
    <s-sany-popup ref="customToast"></s-sany-popup>
    <view class="topfence-detail">
      <view class="topfence-detail-input-view">
        <view
          class="topfence-detail-left"
          style="flex: 1;height: 40px; border-bottom-width: 1px;border-bottom-color: #eeeeee;border-bottom-style: solid;"
        >
          <text>围栏信息</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>围栏名称</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{ dataDic.name || '' }}</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>围栏创建人</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{ dataDic.createName || '' }}</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>半径(米)</text>
        </view>
        <view class="topfence-detail-right">
          <text
            class="topfence-detail-input-style"
          >{{ dataDic.pathType == '1' ? '多边形' : dataDic.radius || '' }}</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>区域</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{ dataDic.orgName || '' }}</text>
        </view>
      </view>
     
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>地址</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{ dataDic.address || '' }}</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>最后更新时间</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{ dataDic.lastModifyTime || '0' }}</text>
        </view>
      </view>
      <view class="topfence-detail-input-view">
        <view class="topfence-detail-left">
          <text>关联设备</text>
        </view>
        <view class="topfence-detail-right">
          <text class="topfence-detail-input-style">{{datalist.length}}</text>
        </view>
      </view>
      <view class="topfence-detail-bottom-view">
        <view class="btn-view style-tilte-one" @click="binding()">
          <text>批量绑定</text>
        </view>
        <view class="btn-view style-tilte-two" @click="unbind()">
          <text>批量解绑</text>
        </view>
      </view>
    </view>
    <view class="list-bg-view">
      <view
        class="topfence-detail-input-view"
        style="justify-content: space-between;height: 40px;border-bottom: 1px solid #eeeeee;"
      >
        <view class="topfence-detail-left" style="flex: 1;">
          <text>设备</text>
        </view>
        <input v-model="fuzzyParam" placeholder="自喷码/车号" class="input-style" />
        <selectView :value="info.name" hint="是否锁车" @clickSelect="showPick('isLockCar')" />
      </view>
      <list>
        <cell v-for="(item,index) in datalist" :key="index" class="topfence-detail">
          <view class="topfence-detail-input-view">
            <view class="topfence-detail-left">
              <text>{{ item.printCode||'' }}</text>
              <text
                :style="{ color: item.offlineMode!=null ? item.offlineMode?'#FF0000' : '#4EC365':'#FF0000'}"
              >{{item.offlineMode!=null ? item.offlineMode?"(离线)" : "(在线)":'(-)'}}</text>
            </view>
            <view class="topfence-detail-right" style="color: #E60000;">
              <text
                class="topfence-detail-input-style"
              >{{ item.stateName || '-'}}-{{item.subStateName || '-'}}</text>
            </view>
          </view>
          <view class="topfence-detail-input-view">
            <view class="topfence-detail-left">
              <text>车号</text>
            </view>
            <view class="topfence-detail-right">
              <text class="topfence-detail-input-style">{{ item.licenseId || '-' }}</text>
            </view>
          </view>

          <!-- <view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>型号</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.machineBrand || '-'}}{{item.machineTypeName || '-'}}</text>
						</view>
          </view>-->
          <!-- <view class="topfence-detail-input-view">
						<view class="topfence-detail-left"><text>所在地</text></view>
						<view class="topfence-detail-right">
							<text class="topfence-detail-input-style">{{ item.locationName || '-' }}</text>
						</view>
          </view>-->
          <view class="topfence-detail-input-view">
            <view class="topfence-detail-left">
              <text>当前位置</text>
            </view>
            <view class="topfence-detail-right">
              <text class="topfence-detail-input-style">{{ item.address || '-' }}</text>
            </view>
          </view>
          <view class="topfence-detail-input-view" >
            <view class="topfence-detail-left">
              <text>区域</text>
            </view>
            <view class="topfence-detail-right">
              <text class="topfence-detail-input-style">{{ item.orgName || '-' }}</text>
            </view>
          </view>
		     <view class="topfence-detail-input-view" style="margin-bottom: 20px;">
            <view class="topfence-detail-left">
              <text>锁车状态</text>
            </view>
            <view class="topfence-detail-right">
              <text class="topfence-detail-input-style" v-if="item.lockStatus===0">解锁</text>
              <text class="topfence-detail-input-style" v-if="item.lockStatus===1">锁车</text>
              <text class="topfence-detail-input-style" v-else>--</text>
            </view>
          </view>
        </cell>
      </list>
    </view>
    <w-picker
      :selectList="selectList"
      @confirm="dialog"
      mode="selector"
      ref="selector"
      themeColor="#E60000"
    />
  </view>
</template>

<script>
import wPicker from "@/components/common/w-picker/w-picker.vue";
import selectView from "@/components/common/common-ui/selector-view.vue";

export default {
  data() {
    return {
      datalist: [],
      dataDic: {},
      fuzzyParam: null,
      selectList: [
        {
          label: "",
          value: ""
        },
        {
          label: "锁车",
          value: 1
        },
        {
          label: "解锁",
          value: 0
        }
      ],
      info: {
        name: "",
        value: null
      },
      dataInfo: {}
    };
  },
  components: {
    wPicker,
    selectView
  },
  watch: {
    fuzzyParam(val) {
      setTimeout(() => {
        this.loadMachionList();
      }, 100);
    }
  },
  onLoad(option) {
    this.dataDic = JSON.parse(option.item);
    console.log(this.dataDic, "this.dataDic ");
    let id = this.dataDic.id;
    if (id) {
      this.getFenceInfo(id);
    }
    this.loadMachionList();
    uni.$on("refreshData-fence", () => {
      this.loadMachionList();
    });
  },
  onUnload() {
    uni.$off("refreshData-fence");
  },
  methods: {
    // 获取电子围栏详情
    async getFenceInfo(id) {
      let res = await this.$network.fenceInfo(id);
      this.dataInfo = res;
    },
    dialog(val) {
      this.info.name = val.result;
      this.info.value = val.checkArr.value;
      this.loadMachionList();
    },
    showPick(type) {
      this.$refs.selector.show();
    },
    loadMachionList() {
		let status=this.info.value===1||this.info.value===0?this.info.value:null;
      let param = {
        fenceId: this.dataDic.id,
        fuzzyParam: this.fuzzyParam ? this.fuzzyParam : null,
        lockStatus: status
      };
      this.$network
        .getData(this.$url.MACHINE_FENCE_MACHINE_LIST, "POST", param)
        .then(result => {
          this.datalist = result;
		  console.log( this.datalist,' this.lockStatus');
        })
        .catch(err => {
          uni.showToast({
            title: "服务端异常, 请稍后再试",
            icon: "none"
          });
          uni.hideLoading();
        });
    },
    //绑定
    binding() {
      uni.navigateTo({
        url: "./fence-binding?item=" + JSON.stringify(this.dataDic)
      });
    },
    //解绑
    unbind() {
      uni.navigateTo({
        url: "./fence-unbinding?item=" + JSON.stringify(this.dataDic)
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.machine-bg-view {
  display: flex;
  flex-direction: column;
  background: $uni-bg-color-grey;
}

.topfence-detail {
  display: flex;
  width: 100%;
  flex-direction: column;
  background: #ffffff;
  border-bottom-style: solid;
  margin-top: 10px;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
}

.topfence-detail-input-view {
  display: flex;
  flex-direction: row;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  margin-left: 15px;
  margin-right: 15px;
  padding: 5px 0px;
  font-size: $uni-font-size-base;
}

.topfence-detail-left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.input-style {
  padding-left: 6px;
  color: #333333;
  font-size: 14px;
  background-color: #eeeeee;
  border-radius: 4px;
  margin-right: 4px;
  flex: 2;
  text-align: left;
  height: 30px;
  line-height: 30px;
  margin-left: 8px;
}

.topfence-detail-right {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  color: $uni-text-color;
  font-size: $uni-font-size-base;
}

.topfence-detail-input-style {
  flex: 1;
  text-align: right;
}

.topfence-detail-bottom-view {
  display: flex;
  flex: 1;
  height: 50px;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}

.btn-view {
  display: flex;
  border-radius: 5px;
  margin-right: 10px;
  width: 60px;
  height: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: $uni-font-size-base;
}

.style-tilte-one {
  background: #e60000;
  color: #ffffff;
}

.style-tilte-two {
  background: #fe931f;
  color: #eeeeee;
}

.style-tilte-three {
  background: #fffcf7;
  color: #f9c0c8;
}

.list-bg-view {
  display: flex;
  flex-direction: column;
  background: #ffffff;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
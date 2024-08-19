export default {
    data() {
        return {
            hideButton: true, // 控制按钮显示隐藏
            scrollTimeout: null, // 存储滚动检测定时器的ID
            touchStartY: 0, // 记录触摸开始时的Y坐标
            moveThreshold: 20, // 设定触发隐藏按钮的滑动阈值
        }
    },
    methods: {
        handleTouchStart(event) {
            if (this.mode === "normal") {
                return;
            }
            return;
            // 记录触摸开始时的Y坐标
            this.touchStartY = event.touches[0].clientY;
 
        },
        handleTouchMove(event) {
            if (this.mode === "normal") {
                return;
            }
            return;
            const touchCurrentY = event.touches[0].clientY;

            // 检查滑动距离是否超过阈值
            if (Math.abs(touchCurrentY - this.touchStartY) > this.moveThreshold) {
                // 当触摸移动超过阈值时，隐藏按钮
                this.hideButton = true;
                // 清除之前的定时器（如果有）
                if (this.scrollTimeout) {
                    clearTimeout(this.scrollTimeout);
                }

                // 设置新的定时器，一段时间后显示按钮
                this.scrollTimeout = setTimeout(() => {
                    this.hideButton = false;
                }, 1000); // 3000毫秒后显示按钮，可调整
            }
        },
        handleBatchAfter(msg = "操作成功") {
            const pages = getCurrentPages();
            const prevPage = pages[pages.length - 2]; // 上一个页面实例
            // 调用上一个页面的方法
            if (prevPage && prevPage.$vm.headerrefresh) {
                // 直接执行顶部刷新方法会导致触底，很奇怪
                prevPage.$vm.headerrefresh();
            }
            uni.navigateBack({
                delta: 1,
                success: () => {
                    uni.showToast({
                        icon: "success",
                        title: msg,
                    });
                },
            });
        }
    },
}

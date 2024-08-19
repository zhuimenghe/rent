export default {
    methods: {
        checkField(obj, key, message, customCheck = (value) => value !== undefined && value !== null) {
            // 通用字段检查函数
            // 检查给定对象的指定字段是否满足自定义验证（默认为非空和非undefined检查）
            if (!customCheck(obj[key])) {
                uni.showToast({ title: message, icon: 'none' });
                return false;
            }
            return true;
        }
    },
}

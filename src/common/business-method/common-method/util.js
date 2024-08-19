/**
 * 提取并返回给定字符串中的日期部分。
 * 
 * @param {string} time - 包含日期和可能包含时间的字符串。
 * @returns {string} - 返回日期字符串。如果输入为空或不合法，返回空字符串。
 */
export function getDate(time) {
    // 如果没有提供 time 参数，或者 time 为空，直接返回空字符串
    if (!time) return "";
    // 使用正则表达式分割字符串，提取日期部分。
    // 这里假定日期和时间之间是由空格分隔的，正则表达式 /\s+/ 匹配一个或多个空白字符。
    // split 方法将字符串分割为数组，然后取数组的第一个元素，即日期部分。
    return time.split(/\s+/)[0];
}

/**
 * 发起电话呼叫。
 * 
 * @param {string} value - 需要拨打的电话号码。
 * 
 * 此函数检查提供的电话号码是否存在，如果存在，使用 uni-app 的内置方法 uni.makePhoneCall 发起电话呼叫。
 * 如果呼叫成功或失败，会在控制台打印相应的消息。
 */
export function handleCallPhone(value) {
    if (value) {
        uni.makePhoneCall({
            // 手机号
            phoneNumber: value,
            // 成功回调
            success: (res) => {
                console.log("调用成功!");
            },

            // 失败回调
            fail: (res) => {
                console.log("调用失败!");
            },
        });
    }
}

/**
 * 处理文件描述字符串，提取文件描述和必要性标记。
 * 
 * @param {string} fileDesc - 包含文件描述和必要性标记的字符串，使用 "|" 分隔。
 * @returns {object} - 包含处理后的文件描述（fileDesc）和必要性标记（required）的对象。
 * 
 * 此函数接收一个字符串参数，该字符串应包含文件描述和通过 "|" 分隔的布尔值（表示文件的必要性）。
 * 函数会分割这个字符串，提取文件描述和必要性标记。如果字符串按 "|" 分割后有多于一个部分，
 * 则认为最后一个部分是必要性标记，并尝试将其解析为布尔值；否则，默认文件不是必需的。
 */
export function processFileDesc(fileDesc) {
    // 检查 fileDesc 是否存在，如果不存在，直接返回默认值
    if (!fileDesc) {
        return { fileDesc: '', required: false };
    }
    const parts = fileDesc.split("|"); // 按 "|" 分割字符串。
    if (parts.length > 1) {
        return {
            fileDesc: parts[0], // 文件描述部分。
            required: JSON.parse(parts[parts.length - 1]) // 尝试将最后一个部分解析为布尔值。
        };
    }
    return { fileDesc, required: false }; // 默认情况下，文件不是必需的。
}

/**
 * 根据订单 ID 筛选并返回与该订单相关联的机器列表。
 * 
 * @param {Array} machines - 包含所有机器的数组。
 * @param {string} orderId - 要筛选机器的订单 ID。
 * @returns {Array} - 返回一个数组，包含与给定订单 ID 相关联的所有机器。如果没有找到任何机器，返回空数组。
 * 
 */
export function getMachinesByOrderId(machines, orderId) {
    return machines.filter(machine => machine.contractOrderId === orderId);
}

/**
 * 根据订单 ID 获取与该订单相关联的机器列表的长度。
 * 
 * @param {Array} machines - 包含所有机器的数组。
 * @param {string} orderId - 要获取机器列表长度的订单 ID。
 * @returns {number} - 返回与给定订单 ID 相关联的机器列表的长度。如果没有找到任何机器，返回 0。
 * 
 */
export function getMachineListLengthByOrderId(machines, orderId) {
    return getMachinesByOrderId(machines, orderId).length;
}


/**
 * 检查用户是否具备所需的所有权限。
 * 
 * 本方法从本地存储中获取用户权限列表，并检查传入的权限键（keys）是否全部存在于用户的权限列表中。
 * 
 * @param {Array<string>} keys - 需要检查的权限键数组。
 * @returns {boolean} - 如果用户具有所有指定的权限，返回 true；否则返回 false。
 * 
 * @example
 * // 假设用户的权限列表已存储，并且包含权限 'edit' 和 'delete'
 * const requiredPermissions = ['edit', 'delete'];
 * const hasPermissions = checkAllPermissions(requiredPermissions);
 * console.log(hasPermissions); // 输出：true 或 false，取决于用户是否具备这些权限
 * 
 * 该方法首先尝试从本地存储中获取用户权限列表。如果检索过程中发生异常（如本地存储不可访问），
 * 它会捕获这些异常并输出错误信息，同时方法返回 false，表示权限检查失败（默认用户没有权限）。
 */
export function checkAllPermissions(keys) {
    try {
        // 从本地存储获取用户权限列表
        const permissions = uni.getStorageSync(this.$savekey.USER_PRIVILEGES_MEG);

        // 检查每个传入的键是否在权限列表中至少有一个匹配的项
        return keys.every((key) => permissions.some((x) => x.value === key));
    } catch (error) {
        // 输出错误信息到控制台
        console.error("Error fetching permissions:", error);

        // 出现异常时，返回 false 表示用户没有所需权限
        return false;
    }
}

// 定义一个方法来显示toast
export function  showToast(err) {
    uni.showToast({
        title: err.details && err.details[0] ? err.details[0] : "发生错误",
        icon: "none",
    });
}

// 检查对象是否为空
export function isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
}
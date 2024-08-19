// 保存原始的 console.error 函数
const originalConsoleError = console.error;
let logger = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null

// 重写 console.error 函数
console.error = function (message, ...args) {
  // 调用原始 console.error，保持控制台输出的行为不变
  originalConsoleError('logger error:',message, ...args);

  // 使用微信小程序的日志上报功能
  if(logger){
    logger.error(message, ...args)
  }
};
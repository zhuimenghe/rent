/**判断是不是三一设备 */
export const isSanyMachine=(licenseId)=>{
  if (!licenseId) return;
  const REG = /^(SPS|SPT|SPA)[0-9]{2}[A-Z]{2}[0-9]{4}8$/;//三一机号符合的规则
  return REG.test(licenseId);
}

export function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}

export const debounce = (fn, delay = 500) => {

  // 定时器，用来 setTimeout
  var timer

  // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
  function debounced() {

    // 保存函数调用时的上下文和参数，传递给 fn
    var context = this
    var args = arguments

    // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
    clearTimeout(timer)

    // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
    // 再过 delay 毫秒就执行 fn
    timer = setTimeout(function () {
      fn.apply(context, args)
    }, delay)
  }
  debounced.cancel = function () {
    clearTimeout(timer)
  }
  debounced.immediate = function () {
    debounced.cancel()
    var context = this
    var args = arguments
    fn.apply(context, args)
  }
  return debounced
}

export const selectorQuery = function (id, method, vm) {
  let query = uni.createSelectorQuery()
  if (vm) {
    query = query.in(vm)
  }
  return new Promise((resolve, reject) => {
    query.select(id)[method](data => {
      resolve(data)
    }).exec();
  })
}

export const canvas2dCtx = function (id, vm) {
  let query = uni.createSelectorQuery()
  if (vm) {
    query = query.in(vm)
  }
  return new Promise((resolve, reject) => {
    query.select(id).fields({ node: true, size: true }).exec(res => {
      console.log(res[0]);
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      resolve(ctx)
    })
  })
}

export const canvasCtx = async function (id, vm) {
  let context = uni.createCanvasContext(id, vm)
  /* #ifdef MP-WEIXIN */
  context = await canvas2dCtx('#' + id, vm)
  /* #endif */
  return context
}

export const pause = function (t) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, t);
  })
}


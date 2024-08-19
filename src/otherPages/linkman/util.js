export function commonFeesAdjust(total, fees, keys, ops, forceKey) {
  let fi = keys.findIndex(k => k == forceKey)
  if (fi !== -1) {
    keys = [forceKey, ...keys.filter(k => k != forceKey)]//根据forceKey调整,forceKey放到第一位，保证不会被修改
    ops.splice(0, 0, ops.splice(fi, 1)[0])
  }
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const op = ops[i]
    fees[k] = Number(fees[k])
    if (total >= 0) {
      total = total + op * fees[k]
    }
    if (total <= 0) {
      //减完剩负的，说明不够，当前fees[k][valueKey]需要调整, 把不够的减掉
      fees[k] = fees[k] - op * total
      //把后续的清0
      for (let j = i + 1; j < keys.length; j++) {
        fees[keys[j]] = 0
      }
      break; 跳出循环
    }
  }
  if (total > 0) {//还有剩余，放到最后一个key上
    fees[keys[keys.length - 1]] += total
  }
}
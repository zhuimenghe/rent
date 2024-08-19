export const hasDupliaceDemand = (orderList) => {
  //校验设备需求唯一性
  //展开
  let demandList = []
  orderList.forEach(o => {
    if (o.machineType && o.machineType.length) {
      o.machineType.forEach(mt => {
        demandList.push({ ...o, machineType: mt })
      })
    } else {
      demandList.push({ ...o, machineType: null })
    }
  })
  //校验唯一性
  let hasDuplicate = demandList.some(d1 => {
    return demandList.some(d2 => {
      if (d1 != d2) {
        if (d1.type == d2.type && d1.height == d2.height && d1.machineType == d2.machineType
          && d1.settlementType == d2.settlementType && Number(d1.hire) == Number(d2.hire)
          && Number(d1.hireMonthly) == Number(d2.hireMonthly)) {
          return true
        }
      }
    })
  })
  return hasDuplicate
}
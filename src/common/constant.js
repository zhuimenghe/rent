export const REPORT_TYPE_KEY_MAP = {
  WEEK: '1',
  MONTH: '2',
  SETTLE: '3',
  MANUAL: '4',
}

export const REPORT_TYPE_NAME_MAP = {
  [REPORT_TYPE_KEY_MAP.WEEK]: '周报',
  [REPORT_TYPE_KEY_MAP.MONTH]: '月报',
  [REPORT_TYPE_KEY_MAP.SETTLE]: '结项报告',
  [REPORT_TYPE_KEY_MAP.MANUAL]: '手动报告',
}

export const REPORT_TYPES = Object.keys(REPORT_TYPE_NAME_MAP).map(k => {
  return {
    value: k,
    label: REPORT_TYPE_NAME_MAP[k]
  }
})

export const MACHINE_ICON_CLASS = {
  3: "iconzhibi",//直臂车
  4: "iconjiancha",//剪叉
  2: "iconqubi",//屈臂
  1: "iconjiancha",//剪叉
}

export const PARAMS_SIGN_KEY = '123pl,okmIJN098'
let baseUrl = 'https://awp-rental.sany.com.cn/'
// let baseUrl = 'https://rental-test.sany.com.cn/'
let baseUrlCoupon = 'https://awp-operate-rental.sany.com.cn/'
// let baseUrlCoupon = 'https://operate-rental-test.sany.com.cn/'
if (process.env.NODE_ENV === 'testing') {
  baseUrl = 'https://rental-test.sany.com.cn/'
  baseUrlCoupon = 'https://operate-rental-test.sany.com.cn/'
} else if (process.env.NODE_ENV === 'development') {
  baseUrl = 'https://rental-test.sany.com.cn/'
  // baseUrl = 'https://rental-dev.sany.com.cn/'
  baseUrlCoupon = 'https://operate-rental-test.sany.com.cn/'
  // baseUrl = '/'
} else if (process.env.NODE_ENV === 'development_h5') {
  // baseUrl = 'https://rental-test.sany.com.cn/'
  baseUrl = '/'
  baseUrlCoupon = 'https://operate-rental-test.sany.com.cn/'
}
export const BASE_URL = baseUrl + "api/"; //三一测试
export const BASE_URL_COUPON = baseUrlCoupon + 'operate-api'; //三一测试
// export const BASE_URL = "https://test-rental.sany.com.cn/api/"; //三一测试
// export const BASE_URL = "https://rental.sany.com.cn/api/"; //三一生产环境

export const BASE_SHARE_URL = baseUrl; //分享
// export const BASE_SHARE_URL = "https://test-rental.sany.com.cn/web/"; //分享
// export const BASE_SHARE_URL = "https://rental.sany.com.cn/"; //分享

export const CHECK_UPDATE_URL = BASE_URL + "configapi/api/4/app/rentalbay/check/"; //检查更新

export const AmapKeyWebApi = BASE_URL.indexOf('https://awp-rental.sany.com.cn') == -1 ? "6e6dbe29ac3829f525d7a8aa4c2d2fb6" : "a647219a3733b7b5a974db69d943f0dc"

//个人用户信息Private address is forbidden to callback
export const LOGIN_URL = "userapi/api/auth/login"; //登录
export const USER_INFO = "userapi/api/auth/user/info"; //查询当前用户信息
export const USER_PERMISSIONS = "userapi/api/auth/user/permissions" //查询当前用户菜单列表=
export const USER_PRIVILEGES = "userapi/api/auth/user/privileges" //查询当前用户权限列表
export const SYS_DIC = "userapi/api/sys/dict/type"; //多条件分页查询列表
export const ORG_LIST = "userapi/api/auth/org/all?status=1"; //获取当前用户下区域
export const USER_LEADERS = "userapi/api/auth/user/list"; //查询业务担当列表
export const USER_ORG_SINGLE = 'userapi/api/auth/org/single'; //查询当前用户单节点的区域区域
export const UPDATE_RENANT_USER = 'userapi/api/auth/user/tenant/saveOrUpdateTenant'; //修改租户


export const USER_RESETMM = "userapi/api/auth/user/updatePassword" //修改密码
export const USER_SYS_DICT = "userapi/api/sys/dict/type/" //字典表
export const CUR_SYS_DICT = "userapi/api/sys/dict/page" //实时字典表
//设备 
export const DEVICE_MAP_DISTRIBUTION = "machineapi/api/machine/getMap"; //设备地图分布
export const DEVICE_MAP_CLAC = "machineapi/api/machine/monitor/iot/count"; //数据分布
export const LOWER_VOICE_REMIND = "machineapi/api/machine/monitor/voice/remind"; //低电量语音提醒

//new-根据machineType获取这个设备对于的上传规则
export const GET_MACHINE_TYPE_SCENE_RULE_BY_MACHINETYPE = 'machineapi/api/machine-file-scene-rule/getMachineTypeSceneRuleByMachineType'
//调拨
export const ALLOT_RECORD_LIST = "machineapi/api/t-allocation/page"; //设备锁车列表
export const ALLOT_INIT = "machineapi/api/t-allocation/init"; //设备调拨新增初始化
export const ALLOT_CREATE = "machineapi/api/t-allocation"; //新增調撥
export const ALLOT_DETAIL = "machineapi/api/t-allocation/detail?businessNo="; //调拨详情
//控制
export const CONTROL_LOG_LIST = "machineapi/api/machine/remote/remoteLog/page"; //设备控制log列表
export const CONTROL_LOG_CARLIST = "machineapi/api/machine/remote/remoteLog/detail/"
export const CONTROL_LOCKORUNLOCK_LIST = "machineapi/api/machine/remote/operation"; //设备解锁/锁车
export const CONTROL_LOCKHISTORY_LIST = "machineapi/api/machine/remote/log/"
export const CONTROL_ALL_CAR_LIST = "machineapi/api/machine/remote/machine/page" //锁车-全部设备列表
//档案
export const MACHINE_RECORD = "machineapi/api/machine/page"; //设备档案列表
export const MACHINE_RECORD_DETAIL = "machineapi/api/machine/"; //设备档案详情
export const MACHINE_RECORD_LIFECYCLE = "machineapi/api/machine/status/list"; //获取生命周期
export const MACHINE_RECORD_NEWLIFECYCLE = "machineapi/api/machine/status/page"; //获取生命周期
export const MACHINE_UPDATA_PRICE = "machineapi/api/machine"; //修改价格
export const MACHINE_RECORD_GROUP_LIFECYCLE = "contractapi/api/machine/status/list/group"; //获取生命周期组
export const MACHINE_LIVE_CIRCLE_FILTER = "contractapi/api/bussDict/group" //生命周期树状图
export const WORKIN_ORDERS = "contractapi/api/workIn/getContractOrder" //进场查询合同订单及剩余数量
export const MACHINE_LIVE_CIRCLE_SAVE = "contractapi/api/bussDict/custom-config" //生命周期树状图


export const MACHINE_RECORD_BUSSDICT = "machineapi/api/bussDict/list"; //获取业务字典表列表
export const MACHINE_RECORD_TYPE = "machineapi/api/machine/type/list"
//监控
export const MACHINE_MONITOR = "machineapi/api/machine/monitor/page"; //设备监控列表
export const MACHINE_MONITOR_WORKTIMEINTERVAL = "machineapi/api/machine/monitor/xxx/workTimeInterval"; //设备工作时长
export const MACHINE_MONITOR_WORKCONDITION = "machineapi/api/machine/monitor/xxx/machineWorkCondition"; //获取近一周的工作数据
export const MACHINE_MONITOR_HOURSBYMONTH = "machineapi/api/machine/monitor/xxx/getWorkHoursByMonth"; //获取近一周的工作数据
export const MACHINE_MONITOR_BATTERY = "machineapi/api/machine/monitor/licenseId/xxx/battery"; //获取电池电量曲线
export const MACHINE_MONITOR_MAFUNCTINFOLIST = "machineapi/api/machine/monitor/getMalfunctionInfoList"; //获取获取设备警示状态列表s
export const MACHINE_MONITOR_TRAJECTORY = "machineapi/api/machine/monitor/trajectory"; //获取轨迹信息
export const MACHINE_MONITOR_NEWBATTERY = "machineapi/api/machine/monitor/licenseId/getBatteryInfoList"; //获取电量曲线
export const MACHINE_MONITOR_DOWNFILE = "machineapi/api/machine/monitor/exportExcel/machineMalfunction"; //获取下载地址
export const MACHINE_MONITOR_PAGE = "machineapi/api/machine/monitor/page/machineMalfunction"; //获取page

//围栏
export const MACHINE_FENCE_LIST = 'machineapi/api/fence/getFencePage' //围栏列表
export const MACHINE_FENCE_DELETE = 'machineapi/api/fence/'
export const MACHINE_FENCE_UPDATA = 'machineapi/api/fence'
export const MACHINE_FENCE_NAME = 'machineapi/api/fence/fenceName/'
export const MACHINE_FENCE_MACHINE_LIST = "machineapi/api/fence/machines";
export const MACHINE_FENCE_BINDING = "machineapi/api/fence/batchBind"
export const MACHINE_FENCE_LIST_BY_USER = "machineapi/api/fence/list"

//补液
export const MACHINE_INFUSION_LIST = "machineapi/api/fluid/record/page"
export const MACHINE_INFUSION_DETAIL = "machineapi/api/fluid/record/"
export const MACHINE_INFUSION_CREATE = "machineapi/api/fluid/record"
export const MACHINE_INFUSION_INIT = "machineapi/api/fluid/record/init/"
export const MACHINE_INFUSION_CAR = "machineapi/api/fluid/record/search/"
//合同 
export const EDIT_CONTRACT = "contractapi/api/contract"; //新增、变更合同
export const CONTRACT_LIST = "contractapi/api/contract/page"; //合同列表
export const SETTLE_REMIND_PAGE = "contractapi/api/settlementRemind/page"; //结算提醒分页查询
export const SETTLE_REMIND_DEAL = "contractapi/api/settlementRemind/deal"; //结算待办处理
export const CONTRACT_DEATIL_BY_NO = "contractapi/api/contract/info"; //根据单号查询合同详情
export const CONTRACT_TOTAL = "settleapi/api/reimburse/getSettleData?contractNo="; //根据单号查询最后营收
export const CONTRACT_EXECUTE_INFO = "contractapi/api/contract/executeInfo"; //查询合同执行流
export const CONTRACT_EXECUTE_INFO_ESIGN = "contractapi/api/contract/executeInfo/esign"; //根据合同单号查询可合并电签的业务
export const CONTRACT_DETAIL_RECEIVABLE = "settleapi/api/receivable/contract"; //合同详情-合同营收
export const CONTRACT_DETAIL_RECEIVABLE_PAGE = "settleapi/api/receivable/contract/page"; //合同结算列表
export const CONTRACT_DETAIL_GETSETTLEMENTDATA = "settleapi/api/receivable/getSettlementData"; //合同结算列表
export const SETTLEBUSINESS_CODE = "settleapi/api/businessCode"; //合同结算列表
export const receivable_customize = "settleapi/api/receivable/customize"; //合同结算列表
export const settlement_check = "settleapi/api/settlement/check"; //合同结算列表
export const getTransportInfo = "contractapi/api/gps/fast/business/getTransportInfo"; //合同结算列表
export const fastBusiness = "contractapi/api/gps/fast/business"; //合同结算列表
export const CONTRACT_ASSIGN_VEHICLE = "machineapi/api/machine/contract/page"; //合同-设备信息-指定设备-设备列表
export const CONTRACT_CHECK_NAME = "contractapi/api/contract/checkUniqueness"
export const CONTRACT_ALLNUM_NAME = "contractapi/api/contract/status/statistics"
export const CONTRACT_FILE_LIST = "contractapi/api/contract/contractId/xxx/allFile"
export const CONTRACT_UPDATA_STATE = "contractapi/api/contract/contractId/xxx/updateStatus"
export const CONTRACT_PREVIEWCONTRACT = "contractapi/api/contract/preViewContract" //新建合同预览

export const CONTRACT_DELETE = "contractapi/api/contract/delete/{id}" //删除合同
export const CONTRACT_DELETE_CHECK = "contractapi/api/contract/deleteCheck/{id}" //删除合同确认
//快捷合同
export const SIMPLE_CONTRACT_ADD = "contractapi/api/contract/express"; //新增

//物流
export const LOGISTICS_RECORD = "logisticsapi/api/logisticsRecord/page" //物流记录
export const LOGISTICS_RECORD_DETAIL = "logisticsapi/api/logisticsRecord/" //物流记录详情
export const LOGISTICS_RECORD_DETAIL_UPDATA = "logisticsapi/api/logisticsRecord" //修改物流记录详情

/**物流公司**/
export const ADD_LOGISTICS_CONTACT = "logisticsapi/api/logistics-driver" //物流信息列表
export const CONTRACT_LOGISTICS_COMPANY_LIST = "logisticsapi/api/logisticsCompany/page" //物流信息列表
export const CONTRACT_LOGISTICS_COMPANY_AllLIST = "logisticsapi//api/logisticsCompany/logisticsCompanies" //物流信息列表
export const MACHINE_LOGISTICS_COMPANY_LIST = "logisticsapi/api/logisticsCompany/page" //车辆调拨物流公司列表
export const MACHINE_LOGISTICS_COMPANY_INFO = "logisticsapi/api/logisticsCompany/xxx" //物流公司信息
export const MACHINE_LOGISTICS_COMPANY_MSG = "logisticsapi/api/logisticsCompany/" //物流公司信息
export const LOGISTICS_URL = "logisticsapi/api/logisticsCompany" //新增编辑物流公司
export const DELETE_LOGISTICS_URL = "logisticsapi/api/logisticsCompany/{id}" //删除物流公司
//======
export const LOGISTICS_TRANS_LIST = "logisticsapi/logistics-record-cargo-info/pageStatic" //删除物流公司
/**我方物流**/
//我方物流车辆管理
export const OUER_LOGISTICES_VEHICLE_PAGE = "logisticsapi/api/logistics-machine/page" //我方物流 -车辆分页列表
export const OUER_LOGISTICES_VEHICLE_LIST = "logisticsapi/api/logistics-machine/list" //我方物流 -车辆列表
export const OUER_LOGISTICES_VEHICLE_EDIT = "logisticsapi/api/logistics-machine" //我方物流 -新增修改车辆   
export const DELETE_OUER_LOGISTICES_VEHICLE = "logisticsapi/api/logistics-machine/{id}" //我方物流 -删除车辆   
//我方物流司机管理
export const OUER_LOGISTICES_DRIVER_PAGE = "logisticsapi/api/logistics-driver/page" //我方物流 -司机分页列表
export const OUER_LOGISTICES_DRIVER_LIST = "logisticsapi/api/logistics-driver/list" //我方物流 -司机列表
export const OUER_LOGISTICES_DRIVER_EDIT = "logisticsapi/api/logistics-driver" //我方物流 -新增修改司机  
export const DELETE_OUER_LOGISTICES_DRIVER = "logisticsapi/api/logistics-driver/{id}" //我方物流 -删除司机
//物流应付
export const LOGISTICES_PAY_LIST = "logisticsapi/logistics-payable-record/page" //转租应付page
export const LOGISTICES_PAY_DELETE = "logisticsapi/logistics-payable-record/" //根据id删除物流应付记录
export const LOGISTICES_HW_LIST = "logisticsapi/logistics-record-cargo-info/page" //根据i货物记录
export const LOGISTICES_PAY_ADD = "logisticsapi/logistics-payable-record" //新增应付记录
export const LOGISTICES_PAY_DETAIL = "logisticsapi/logistics-payable-record/"
//进场
export const WORK_IN_LIST = "contractapi/api/workIn/list"; //查询进场列表(不分页)
export const WORK_IN_PAGE = "contractapi/api/workIn/page"; //多条件分页查询进场列表(分页)
export const WORK_IN_CARCHOOSE = "machineapi/api/machine/contract/page" //进场选择设备
export const WORK_IN_CARCHOOSE_NEW = "contractapi/api/workIn/machine" //进场选择设备
export const WORK_IN_CREATE = "contractapi/api/workIn" //进场创建
export const WORK_IN_ORDER_LEFT = "contractapi/api/workIn/getContractOrder" //查询合同订单信息及剩余数量
export const WORK_IN_DETAIL = "contractapi/api/workIn/detail" //查询进场详情
export const GET_CHECK_LISWT = "contractapi/api/check/list"
export const BrandList_WORKIN = "machineapi/api/machine/type/list";
export const WorkIn_Left_Car = "contractapi/api/workIn/order/machine"
export const WORK_IN_CHECK = "contractapi/api/workIn/machine/check" //校验进场车辆时间是否符合要求
export const WORK_IN_SIMPLE_ADD = "contractapi/api/workIn/express"; //进场申請
export const WORK_IN_DELETE_CHECK = "contractapi/api/workIn/delete/check"; //进场删除确认
export const WORK_IN_DELETE = "contractapi/api/workIn/delete/{id}"; //进场删除
export const WORK_IN_UPDATE_CHECK = "contractapi/api/workIn/update/check"; //进场修改确认
export const WORK_IN_UPDATE = "contractapi/api/workIn/update"; //进场修改
export const WORK_IN_DELIVERYPIC = "contractapi/api/workIn/getDeliveryPicByByMachine"; //进场设备物流附件
//退场
export const WORK_OUT_CREATE = "contractapi/api/workOut"; //退場申請
export const WORK_OUT_LIST = "contractapi/api/workOut/list"; //查询退场列表(不分页)
export const WORK_OUT_PAGE = "contractapi/api/workOut/page"; //多条件分页查询退场列表(分页)
export const WORK_OUT_ORDER_LEFT = "contractapi/api/workOut/getContractOrder" //查询合同订单信息及剩余数量
export const WORK_OUT_DETAIL = "contractapi/api/workOut/detail" //查询进场详情
export const WORK_OUT_CHECK = "contractapi/api/workOut/machine/check" //校验退场车辆时间是否符合要求
export const WORK_OUT_SIMPLE_ADD = "contractapi/api/workOut/express"; //退场申請
export const WORK_OUT_DELETE_CHECK = "contractapi/api/workOut/deleteCheck/{id}"; //退场删除
export const WORK_OUT_DELETE = "contractapi/api/workOut/delete/{id}"; //退场删除
export const WORK_OUT_UPDATE_CHECK = "contractapi/api/workOut/updateCheck/{id}"; //退场修改确认
export const WORK_OUT_UPDATE = "contractapi/api/workOut/update"; //退场修改
export const WORK_OUT_DELIVERYPIC = "contractapi/api/workOut/getDeliveryPicByByMachine"; //退场设备物流附件



//报停
export const PAUSE_LIST = "contractapi/api/pause/list"; //查询报停列表(不分页)
export const PAUSE_PAGE = "contractapi/api/pause/page"; //多条件分页查询报停列表(分页)
export const CREATE_PAUSE = "contractapi/api/pause"; //创建报停
export const CREATE_SERVICE_PAUSE = "contractapi/api/pause/createServicePause"; //创建服务报停
export const PAUSE_DETAIL = "contractapi/api/pause/detail"; //报停详情
export const WORKED_MACHINE_LIST_BY_CONTRACT = "contractapi/api/contract/workedMachine"; //查询合同可退场设备列表
export const PAUSE_MACHINE_CHECK = "contractapi/api/pause/adjustCheck/"; //报停状态查询
export const MACHINE_ISWAIT_COUNT = "machineapi/api/sys/param/" //待办数量
//索赔
export const CLAIM_PAGE = "contractapi/api/claim/page"; //多条件分页查询索赔列表(分页)
export const CLAIM_ITEM_LIST = "contractapi/api/claimItem/list"; //查询索赔项列表
export const CREATE_CLAIM = "contractapi/api/claim"; //创建索赔
export const CREATE_SERVICE_CLAIM = "contractapi/api/claim/createServiceClaim"; //创建服务索赔
export const CLAIM_DETAIL = "contractapi/api/claim/detail"; //索赔详情
export const MACHINE_LIST_BY_CONTRACT = "contractapi/api/contract/machine"; //索赔报停设备
export const CLAIM_MACHINE_CHECK = "contractapi/api/claim/adjustClaim/"; //索赔状态查询
//收款
export const SETTLE_PROCEEDS_PAGE = "settleapi/api/proceeds/page"; //多条件分页查询收款列表(分页)
export const SETTLE_PROCEEDS_CONTRACT_PAGE = "settleapi/api/proceeds/contract/page"; //多条件分页查询收款合同列表(分页)
export const SETTLE_PROCEEDS_CUSTOMER_PAGE = "settleapi/api/proceeds/customer/page"; //多条件分页查询收款客户列表(分页)
export const SETTLE_PROCEEDS_CREAT = "settleapi/api/proceeds" //新建退款
export const SETTLE_PROCEEDS_DETAIL = "settleapi/api/proceeds/detail?businessNo="
export const SETTLE_PROCEEDS_SYNTHESIZE = "settleapi/api/proceeds/synthesize/statistic?contractNo="

//退款
export const SETTLE_REIMBURSE_LIST = "settleapi/api/reimburse/page"; //分页查询退款列表
export const SETTLE_PROCEEDS_LIST = "settleapi/api/proceeds/synthesize/statistic"; //查询收退款数量
export const SETTLE_REIMBURSE_CREAT = "settleapi/api/reimburse" //新建退款
export const SETTLE_REIMBURSE_DETAIL = "settleapi/api/reimburse/detail?businessNo=" //退款详情
//发票
export const SETTLE_INVOICE_LIST = "settleapi/api/invoice/page" //查询发票列表
export const SETTLE_INVOICE_CREAT = "settleapi/api/invoice" //创建发票
export const SETTLE_INVOICE_DETAIL = "settleapi/api/invoice/detail?businessNo="
//联系人
export const LINKMAN_LIST = "contractapi/api/customer/page"; //获取联系人列表
export const LINKMAN_COMPANY_LIST = "contractapi/api/customer/contact/"; //获取公司联系人列表
export const LINKMAN_PERSON_CREAT = "contractapi/api/customer" //创建
export const LINKMAN_PERSON_DELETE = 'contractapi/api/customer/' //删除
export const CUSTOMER_URGENT_SMS = "contractapi/api/customer/urgent/sms"
export const CONTRACT_URGENT_SMS = "contractapi/api/contract/urgent/sms"
export const RENTAL_PERMISSION = "contractapi/api/customer/rental-permission"
export const CUSTOMER_RECALL_SMS_V2 = "contractapi/api/customer/urgent-recall/sms/v2"
export const LINKMAN_PERSON_CONNECT = "contractapi/api/customer/contact/"
export const WECHAT_RENTALMNURL = "contractapi/api/wechat/rentalMnUrl"
export const LINKMAN_PERSON_CONNECT_UPDATE = "contractapi/api/customer/contact" //企业客户联系人更新
export const LINKMAN_GET_CUSTOMERMSG = "contractapi/api/customer/getCustomer/"
export const INVOICE_CUSTOMERMSG = "contractapi/api/customer/listCustomer"
//设备
export const MACHINE_TYPE = "machineapi/api/sys/dict/type/"; //获取设备类型
export const UNLOCK_BY_PASSWORD = "machineapi/api/machine/remote/v2/dynamic/code/"; //密码解锁
export const MACHINE_TYPE_LIST = "machineapi/api/machine/type/selected"; //获取同类型高度
export const MACHINE_BRAND_HEIGTH_LIST = "machineapi/api/machine/type/getMachinesList"; //获取同类型高度下品牌



//流程Request URL: http://47.102.158.33:8181/api/machineapi/api/machine/repair/search/183424?timestamp=1582021811728
export const FIRST_NODE_USER = "xxx/api/workflow/actProcess/firstNodeUsers"; //通过流程定义id获取第一个任务节点
export const ASSIGN_USER_LIST = "userapi/api/auth/user/leaders/userStatus"; //可指定的审批人列表
export const TO_DO_LIST = "contractapi/api/workflow/actTask/todoList"; //待办列表
export const DONE_LIST = "contractapi/api/workflow/actTask/doneList"; //已办列表
export const MY_APPLY_LIST = "contractapi/api/workflow/actBusiness/page"; //申请列表
export const BACK_MY_APPLY = "xxx/api/workflow/actBusiness/recall"
export const BACK_LIST = "xxx/api/workflow/actTask/backList?taskId="; //回退环节
export const NEXT_NODE_USER = "xxx/api/workflow/actProcess/nextNodeUsers"; //通过流程实例获取下一个任务的处理用户， 节点为null表示需要手动通过assign设置处理人
export const BACK_TASK = "xxx/api/workflow/actTask/back"; //回退接口
export const DATA_FORM = "xxx/api/workflow/actBusiness/dataForm?businessKey="; //详情
export const DATA_FORM_PLUS = "xxx/api/workflow/actBusiness/dataForm?businessKey="; //附加合同详情
export const PASS_TASK = "xxx/api/workflow/actTask/pass"; //通过接口
export const HISTORIC_FLOW_LIST = "xxx/api/workflow/actTask/historicFlow"; //审批流接口
export const PROCESS_NODE = "xxx/api/workflow/actProcess/getProcessNode"; //审批流
export const PROCESS_NODE_COMMENT = "contractapi//api/workflow/flowComment/saveFlowComment"; //审批流
export const BUSINESS_PROCESS = "contractapi/api/workflow/actProcess" //获取我的申请的业务分类
export const WORKFLOW_FINISH_STATE = "contractapi/api/workflow/actTask/info?taskId=" //判断流程是否完成
export const WORKFLOW_PERSON_LIST = "contractapi/api/data/range/user" //判断流程是否完成
export const WORKFLOW_FILE_UPLOAD = "contractapi/api/workflow/actModel/node/formProperties"

//上传
export const UPLOAD_IMG = "machineapi/api/rental/file/upload"; //通过接口
export const UPLOAD_IMG_DELETE = "machineapi/api/rental/file?id=" //删除
//维修
export const MACHINE_REPAIR_LIST = "machineapi/api/machine/repair/page" //维修记录
export const MACHINE_REPAIR_MACHINELIST = "machineapi/api/machine/repair/machine/page" //车辆维修记录
export const MACHINE_REPAIR_FINISH = "machineapi/api/machine/repair/machine/repairComplete" //维修完成
export const MACHINE_REPAIR_CREATE = "machineapi/api/machine/repair"; //维修新建
export const MACHINE_REPAIR_DETAIL = "machineapi/api/machine/repair/detail" //维修详情
export const REPAIR_CAR_LIST = "machineapi//api/machine/getMachineListBindRules" //模糊查询设备
export const REPAIR_CREATE_DIC = "machineapi/api/machine/repair/init/"
export const DEVICE_CONTRACT_LIST = "contractapi/api/machine/rentRecord/contract/byMachine"
export const DEVICE_USERS_LIST = "machineapi/api/machine/servicer?biz="

//巡检
export const MACHINE_POLLING_LIST = "machineapi/api/inspection/record/page" //巡检记录
export const MACHINE_POLLING_MACHINELIST = "machineapi/api/inspection/record/inspectionHistoryRecord" //车辆巡检记录
export const MACHINE_POLLING_CREATE = "machineapi/api/inspection/record/save" //巡检新增
export const MACHINE_POLLING_DETAIL = "machineapi/api/inspection/record/detail" //巡检详情
export const MACHINE_POLLING_INIT = "machineapi/api/inspection/record/init/" //巡检车辆初始化数据

//保养
export const MAINTAIN_LIST = "machineapi/api/maintenance/record/page"; //保养记录
export const MAINTAIN_MACHINE_LIST = "machineapi/api/maintenance/record/machinePage"; //保养记录
export const MAINTAIN_DETAIL = "machineapi/api/maintenance/record/detail"; //保养详情
export const SEARCH_MAINTAIN_MACHINE = "machineapi/api/maintenance/record/search/"; //保养搜索
export const INIT_MAINTAIN = "machineapi/api/maintenance/record/init/{licenseId}"; //初始化新增保养信息
export const MAINTAIN_PROS_BY_RULE = "machineapi/rules/getLevelListByRulesId/{leverId}" //获取等级列表
export const MAINTAIN_PROS_BY_LEVEL = "machineapi/rules-project/leverId/{leverId}"; //获取该等级下内容列表
// export const MAINTAIN_PROS_BY_LEVEL = "machineapi/api/maintenance/level/maintenanceContentsByLevelId/{levelId}"; //保养登记下的保养项
export const CREATE_MAINTAIN = "machineapi/api/maintenance/record/save"; //新增保养
//转租
export const SUBLET_CONMPANY_LIST = "machineapi/api/sublet/company/page"; //转租公司 
export const CREATE_SUBLET_CONMPANY = "machineapi/api/sublet/company"; //新建、修改转租公司 
export const SUBLET_CONMPANY_DETAIL = "machineapi/api/sublet/company/companyDetail/{subletCompanyId}"; //转租公司 详情
export const SUBLET_CONMPANY_APPLY_LIST = "machineapi/api/sublet/list"; //转租公司 包含设备列表
export const SUBLET_APPLY_MACHINE_LIST = "machineapi/api/sublet/getMachine/{businessNo}"; //转租设备 通过转租单id查询
export const DELETE_SUBLET_CONMPANY = "machineapi/api/sublet/company/{id}"; //删除转租公司
export const SUBLET_DEVICE_LIST = "machineapi/api/sublet/subletMachinePage"; //转租设备 
export const RETURN_SUBLET_DEVICE = "machineapi/api/sublet/rentBackEdit/{businessNo}/{licenseId}/{rentBackDate}"; //设备-还租 
export const DELECT_SUBLET_PAYMENT = "machineapi/api/sublet/settlement/{id}"; //应付单-删除
export const BATCH_RETURN_SUBLET_DEVICE = "machineapi/api/sublet/rentBack"; //转租设备 
export const SUBLET_APPLY_LIST = "machineapi/api/sublet/list"; //转租申请分页列表
export const SUBLET_APPLY_PAGE = "machineapi/api/sublet/getSubletApplyPage"; //转租申请分页列表
export const SUBLET_APPLY_DETAIL = "machineapi/api/sublet/detail"; //根据id或者单号查询转租详情
export const CREATE_SUBLET_APPLY = "machineapi/api/sublet"; //根据id或者单号查询转租详情
export const CAL_SUBLET_TOTAL = "machineapi/api/sublet/customizeSettlement"; //估算
export const SUBLET_UPDATA_MSG = "machineapi/api/sublet/subletMachine/"; //修改车辆信息
export const SUBLET_PAY_LIST = "machineapi/api/sublet/settlement/page"; //转租应付列表
export const SUBLET_PAY_GET = "machineapi/api/sublet/settlement/getSettlementData"; //转租应付新增
export const SUBLET_PAY_CUSTOMIZE = "machineapi/api/sublet/settlement/customize"; //转租应付自定义
export const SUBLET_PAY_ADD = "machineapi/api/sublet/settlement"; //转租应付单新增
export const SUBLET_PAY_DETAIL = "machineapi/api/sublet/settlement/detail"; //转租应付详情
export const SUBLET_PAY_FINISH = "machineapi/api/sublet/settlement/editPayable"; //转租已付修改
export const BATCH_SUBLET_PAY_FINISH = "machineapi/api/sublet/settlement/editPayable/batch"; //批量修改已付

export const SUBLET_PAUSE_PAGE = "machineapi/api/sublet/pause/page"; //转租报停分页
export const SUBLET_PAUSE_DETAIL = "machineapi/api/sublet/pause/detail"; //转租报停详情
export const SUBLET_PAUSE_CREATE = "machineapi/api/sublet/pause"; //转租报停新增
export const SUBLET_PAUSE_DELETE = "machineapi/api/sublet/pause/deletePause/"; //转租报停删除
export const SUBLET_CHECK_DEVICE = "machineapi/api/sublet/checkLicenseId "; //转租设备重复校验
export const SUBLET_DEVICE_DETAIL = "machineapi/api/sublet/getSubletMachineDetail"; //转租车辆信息


//合同变更
export const CONTRACT_CHANGE_LIST = "contractapi/api/contract/page"
export const CONTRACT_CHANGE_PAGE = "contractapi/api/contract/change/page" //列表
//结算列表
export const SETTLEMENT_LIST = "settleapi/api/settlement/page"
export const CREATE_BUSINESS_NO = "contractapi/api/businessCode?prefix={type}" //生成订单编号
export const CREATE_MACHINE_NO = "machineapi/api/businessCode?prefix={type}" //生成订单编号
export const CREATE_SETTLE_NO = "settleapi/api/businessCode?prefix={type}" //生成订单编号
export const CREATE_PART_NO = "partsapi/api/businessCode?prefix={type}" //生成订单编号
export const CREATE_LOGISTICS_NO = "logisticsapi/api/businessCode?prefix={type}" //生成订单编号

export const CREATE_CONTRACT_CHANGE = "contractapi/api/contract/change" //合同变更
//附加合同
export const CONTRACT_EXPANSE = "contractapi/api/contract/plus"
export const PRE_CONTRACT_EXPANSE = "contractapi/api/contract/plus/preContractPlus?contractId={contractId}&contractNo={contractNo}"
//库存
export const CONTRACT_MACHINESTORE = 'contractapi/api/contract/machineStore'
//通用审批
export const COMMON_APPROVE_LIST = 'contractapi/api/commonApprove/page'
export const COMMON_APPROVE_DETAIL = 'contractapi/api/commonApprove/detail'
export const COMMON_APPROVE_CREATE = 'contractapi/api/commonApprove'

//合同附件
export const CONTRACT_FILELIST_SAVE = 'contractapi/api/contract/saveAttachment' //合同单独上传附件
export const CONTRACT_FILELIST_FIND = 'contractapi/api/contract/getAttachment' //合同获取附件
export const CONTRACT_FILELIST_FIND_USER = 'machineapi/api/rental/file/getAttachment'
export const MACHINE_FILELIST = 'machineapi/api/machine/getAttachment'
export const CONTRACT_FILELIST_SAVE_USER = 'machineapi/api/rental/file/saveAttachment'


export const POST_CID = 'dataapi/api/user/phone/{cid}' //dataapi
export const DELETE_CID = 'dataapi/api/user/phone'
export const COM_NAME_MATCH = 'contractapi/api/config/enterprise/info'
export const CUSRTOMER_DETAIL = 'contractapi/api/customer/getCustomerList/'
export const POST_DEVICE = 'userapi/api/user-login-info-log/save '

//整备接口
export const WAIT_SERVICE_LIST = 'machineapi/api/cr-work-out-machine/page'
export const ADD_WAIT_SERVICE_LIST = 'machineapi/api/t-check-repair'
export const STOCK_SERVICE_LIST = 'machineapi/api/t-check-repair/record/page'
export const STOCK_SERVICE_MACHINE_LIST = 'machineapi/api/t-check-repair/machine/page'
export const STOCK_SERVICE_DETAIL = 'machineapi/api/t-check-repair/detail'
export const ABNORMAL_SERVICE_LIST = 'machineapi/api/cr-abnormal-check-repair/page'
export const FINISH_SERVICE_LIST = 'machineapi/api/cr-machine-prepare/page'
export const FINISH_SERVIECE_ADD = "machineapi/api/cr-machine-prepare"
export const BANDING_CARLIST_REPAIR = "machineapi/api/cr-abnormal-check-repair/repairs"
export const BANDING_CARLIST_PASS = "machineapi/api/cr-abnormal-check-repair/pass/"
export const BANDING_CARLIST_TABTWO = "machineapi/api/t-check-repair/customPage"
export const RENTAL_WAIT_SERVICE_LIST = 'machineapi/api/cr-work-out-machine/inRentPage'
export const FINISH_CHECK_LIST = "machineapi/api/t-check-repair/reconditionedPage" //已检修
export const CHECKBASE_CHECK_LIST = "machineapi/api/t-check-repair/init/" //获取检修配置项目
export const CHECKBASE_CHECK_ITEM_LIST = "machineapi/api/inspection/level/inspectionContentsByLevelId/" //检修项
export const INIT_CHECK = "machineapi/api/t-check-repair/init/"
//结算
export const SETTLE_LIST_DOWN = "settleapi/api/statement/page"
export const SETTLE_LIST_ACCOUNT_EXPORT = "settleapi/api/settlement/page"
export const SETTLE_LIST_ACCOUNT = "settleapi/api/settlement/listSettlementPage"


export const MARK_READ = "userapi/api/notice/read"
export const READ_LIST = "userapi/api/notice/page"
export const UNREAD_LIST = "userapi/api/notice/unread"
export const JUDGE_OVERDUE = "settleapi/api/overdue/contract"
export const OVERDUE_RECORD = "settleapi/api/overdue/record/page"
export const OVERDUE_UPDATE = "settleapi/api/overdue/update"
export const ACT_PROCESS = "contractapi/api/workflow/actProcess/getByKey"

export const SETTLE_JQLIST_DETAIL = "settleapi/api/settlement/list?contractNo="
export const SETTLE_DETAIL = "settleapi/api/settlement/detail?businessNo="
export const SETTLE_DZ_DETAIL = "settleapi/api/statement/detail?businessNo="
export const SETTLE_JQ_DETAIL = "settleapi/api/settle/detail?businessNo="
export const SETTLE_JQ_CONTRACT = "settleapi/api/settle/detail?contractNo="

//采购
export const PURCHASE_LIST = "machineapi/api/t-purchase/page"
export const PURCHASE_DETAIL = "machineapi/api/t-purchase/detail"
export const PURCHASE_INIT = "machineapi/api/t-purchase/init"
export const PURCHASE_MACHINE_LIST = "machineapi/api/machine/type/page"
export const CREATE_PURCHASE = "machineapi/api/t-purchase"
export const DELETE_PURCHASE = "machineapi/api/t-purchase/{businessNo}" //删除

//配件相关接口
//配件配置
export const ACC_BASE_LIST = "partsapi/rental/partsBasics/page" //配件列表
export const ACC_BASE_LIST_ADD = "partsapi/rental/partsBasics" //配件配置新增
export const ACC_BASE_LIST_DELETE = "partsapi/rental/partsBasics/" //配件配置删除
//配件库存
export const ACC_INVENTORY_LIST = "partsapi/rental/partsStock/group/page" //库存列表
export const ACC_INVENTORY_DETAIL = "partsapi/rental/partsStock/" //库存详情
export const ACC_INVENTORY_UPDATAPRICE = "partsapi/rental/partsUnitPrice" //库存更新价格PATCH
export const ACC_INVENTORY_STATISTICS = "partsapi/rental/partsStock/statistics" //数据统计
export const ACC_PRICE_DETAIl = "partsapi/rental/partsUnitPrice?businessNo=" //库存更新价格PATCH
//配件入库
export const ACC_STORAGR_LIST = "partsapi/rental/partsStorage/page" //入库列表
export const ACC_STORAGR_CREATE = "partsapi/rental/partsStorage" //入库添加
export const ACC_STORAGR_DETAIL = "partsapi/rental/partsStorage?businessNo=" //入库详情
export const ACC_STORAGR_CHECK = "partsapi/rental/partsStorage/checkItemNumber" //入库详情
export const ACC_MATERIAL_LIST = "partsapi/rental/partsStock/getPartsStockList" //查询物料号列表


//配件出库
export const ACC_RECEIVE_LIST = "partsapi/rental/partsCollar/page" //出库列表
export const ACC_RECEIVE_CREATE = "partsapi/rental/partsCollar" //出库添加
export const ACC_RECEIVE_DETAIL = "partsapi/rental/partsCollar?businessNo=" //出库详情
//配件退回
export const ACC_BACK_LIST = "partsapi/rental/partsReturn/page" //退回列表
export const ACC_BACK_CREATE = "partsapi/rental/partsReturn" //退回添加
export const ACC_BACK_DETAIL = "partsapi/rental/partsReturn?businessNo=" //退回详情
//配件调拨
export const ACC_ALLOT_LIST = "partsapi/rental/partsAllocation/page" //调拨列表
export const ACC_ALLOT_CREATE = "partsapi/rental/partsAllocation" //调拨添加
export const ACC_ALLOT_DETAIL = "partsapi/rental/partsAllocation?businessNo=" //调拨详情


export const WEIXIN_INFO = "weixinapi/api/auth/wxUser/{userId}" //查询用户的绑定信息
export const STATISTICS_SETTLEMENT = "settleapi/api/settlement/year/statistics" //指定时间查询结算营收
export const STATISTICS_REVENUE = "settleapi/api/receivable/statistics" //首页-营收统计
export const STATISTICS_STAFF = "settleapi/api/receivable/businessOwner/statistics" //首页-营收统计
export const STATISTICS_STAFF_V2 = "settleapi/api/receivable/v2/businessOwner/statistics" //首页-营收统计
// export const STATISTICS_TEAM_STAFF = "settleapi/api/receivable/manager/statistics" //首页-管理者营收统计
export const STATISTICS_CUSTOMER = "settleapi/api/receivable/customer/statistics" //首页-营收统计
export const STATISTICS_CUSTOMER_PAGE = "settleapi/api/receivable/customer/statistics/page" //客户营收统计分页
export const STATISTICS_CUSTOMER_V2_PAGE = "settleapi/api/receivable/v2/customer/statistics" //客户营收统计分页V2
// export const STATISTICS_CONTRACT_STATUS = "contractapi/api/contract/status/statistics" //首页-营收统计
export const STATISTICS_CONTRACT_STATUS = "settleapi/api/receivable/contractState/statistics" //首页-合同统计

// export const ORG_ALL = "userapi/api/auth/org/all?status=1" //首页-区域
export const ORG_ALL = "userapi/api/auth/org/all" //首页-区域
//用户消息配置
export const USERINFO_NOTICE_LIST = "pushapi/message-reminding-configuration/list"

export const USERINFO_NOTICE_SAVE = "pushapi/message-reminding-configuration/updateUserConfig"
//首页图表数据
export const HOME_MACHINE_YEAR_LIST = "contractapi/api/contract/machineRateByYear" //年
export const MACHINE_YEAR_LIST = "contractapi/api/contract/machineTypeRateListByYear" //出租率更多
export const HOME_MACHINE_DAY_LIST = "contractapi/api/contract/machineRate" //当前月
export const HOME_MACHINE_STATE_LIST = "machineapi/api/machine/indexCount" //设备统计状态
export const HOME_MACHINE_STOCK_LIST = "contractapi/api/contract/machineStore" //设备统计状态
export const DEVICE_STATISTICS_LIST = "settleapi/api/receivable/machine/accounts" //设备统计报表
export const DEVICE_STATISTICS_V2_LIST = "settleapi/api/receivable/v2/machine/accounts" //设备统计报表v2

export const CONFIG_PAGE = "userapi/api/sys/param/page" //配置信息
//报停索赔选择车辆合同
export const SEARCH_MACHINE_CLAIM = 'contractapi/api/contract/getMachine' //查车辆列表    
export const SEARCH_MACHINECONTRACT_CLAIM = 'contractapi/api/contract/getContractPageByMachine' //根据车查合同列表 

export const MACHINE_TYPE_COUNT = 'machineapi/api/machine/count2' //根据类型获得统计计数 

export const CONTRACT_NUM = "contractapi/api/contract/getContractCount" //新增合同数量
export const CUSTOMER_NUM = "contractapi/api/customer/getCustomerCount" //新增客户数量

export const DOWNLOAD_WORD_ESIGN = "contractapi/api/{businessType}/downloadWord" //下载电签合同
export const DOWNLOAD_WORD_CONTRACT = "contractapi/api/contract/downloadWord" //下载Word版合同
export const DOWNLOAD_WORD_WORKIN = "contractapi/api/workIn/downloadWord" //下载Word版合同 进场
export const DOWNLOAD_WORD_CREATE_WORKIN_PREVIEW = "contractapi/api/workIn/preViewWorkIn/v2" //预览Word版 新增进场
export const DOWNLOAD_WORD_CREATE_WORKIN_DOWN = "contractapi/api/workIn/downloadWord/v2" //下载Word版 新增进场
export const DOWNLOAD_WORD_WORKOUT = "contractapi/api/workOut/downloadWord" //下载Word版合同 退场

export const REVENUE_LIST = "settleapi/api/receivable/contract/account" //合同营收统计
export const REVENUE_LIST_EXPORT = "settleapi/api/receivable/contract/receivable/export" //合同营收统计列表导出

export const REVENUE_V2_LIST = "settleapi/api/receivable/v2/contract/account" //合同结算营收统计
export const REVENUE_V2_LIST_EXPORT = "settleapi/api/receivable/v2/contract/account/export" //合同结算营收统计导出

export const NOTIFY_UNREAD_COUNT = "userapi/api/notice/unreadWarningCount" //获取未读预警消息数量
export const CHILDREN_TYPE = "userapi/api/sys/dict/parent/{parent}" //根据parent获取子级类型列表

export const CHARGE_DEIAIL = "machineapi/api/machine/monitor/licenseId/chargeDetails" //充放电详情
export const QUERY_FINISHED_DOCUMENT = 'esignapi/api/eSign/document/getFlowDoc' //查看签署文件
export const CHARGE_STATISTICS = "machineapi/api/machine/monitor/licenseId/chargeStatistics" //充放统计

export const TENANT_DETAIL_URL = 'userapi/api/auth/user/tenant/tenantDetail' //查询租户详情(GET)
export const ESIGN_CUSTOMER_PERMISSION_URL = 'contractapi/api/customer/findCustomer' //查询客户电签权限信息(GET)
export const ESIGN_USER_PERMISSION_URL = 'userapi/api/auth/user/userListHasPower' //查询有权限的用户page(POST)

export const ESIGN_OTHNER_CUSTOMTER_URL = 'contractapi/api/customer/findCanUseCustomer' //查询其他租赁方的租赁签署人(GET)
export const ESIGN_ATTACHMENT_URL = 'contractapi/api/contract/signAttachment?businessNo={businessNo}' //获取合同签署附件
export const ESIGN_START_FLOW = 'esignapi/api/eSign/deployFlow' //启动电签接口(POST)
export const esignRecordPage = 'esignapi/api/esign-record/page'
export const esignRecordFile = 'esignapi/api/esign-record/file' //下载
export const esignRecord = 'esignapi/api/esign-record' //详情
export const esignRecordInfo = 'esignapi/api/esign-record/{id}/info' //详情
export const esignRecordRevoke = 'esignapi/api/esign-record/{id}/revoke'
export const ESIGN_START_WORKIN_FLOW = 'esignapi/api/eSign/createFlowOneStep' //启动电签接口(POST)
export const ESIGN_UPLOADFILE_URL_CONTRACT = 'contractapi/api/contract/uploadSignFile' //上传文档接口
export const ESIGN_DOWNLOAD_URL_CONTRACT_MERGE = 'contractapi/api/contract/downloadWord/merge' //上传文档接口
export const ESIGN_UPLOADFILE_URL_CONTRACT_MERGE = 'contractapi/api/contract/uploadMergeFile' //合并电签下载文档接口
export const ESIGN_UPLOADFILE_URL_SETTLE = 'settleapi/api/settlement/uploadSignFile' //上传文档接口
export const ESIGN_UPLOADFILE_URL_STATEMENT = 'settleapi/api/statement/uploadSignFile' //上传文档接口
export const ESIGN_UPLOADFILE_URL_CONTRACT_PLUS = 'contractapi/api/contract/plus/uploadSignFile' //上传文档接口
export const ESIGN_FLOW_ATTACHMENT = 'esignapi/api/eSign/document/getFlowAttachment' //电签附件
export const ESIGN_FLOW_DETAIL = 'esignapi/api/eSign/getFlow/{flowId}' //电签详情
export const ESIGN_FLOW_DOC = 'esignapi/api/eSign/document/getFlowDoc' //电签文档
export const ESIGN_FLOW_LOG = 'esignapi/api/eSign/userSignLog/list' //电签流程记录
export const ESIGN_FLOW_DOC_ONING = 'esignapi/api/eSign/document/{docId}' //电签文档-签署中
export const UPDATE_EXTEND_INFO = 'contractapi/api/contract/updateExtendData' //合同扩展信息
export const ESGIN_RENTAL_DETAIL = 'esignapi/esign-org/org/{id}' //组织/租户机构信息->根据id查看详情
export const ESGIN_UNBIND_STAFF = 'userapi/api/auth/user/unBind' //解绑员工的电签
export const tenantPage = 'userapi/api/tenant/page' //解绑员工的电签
export const ESGIN_UNBIND_CUSTOMER = 'contractapi/api/customer/unBind' //解绑客户的电签
export const ESIGN_FLOW_RESTART = 'esignapi/api/eSign/startFlow/{flowId}' //重新发起电签
export const ESIGN_UPLOADFILE_URL_WORK_IN = 'contractapi/api/workIn/uploadSignFile' //上传文档接口
export const ESIGN_UPLOADFILE_URL_WORK_OUT = 'contractapi/api/workOut/uploadSignFile' //上传文档接口


export const ESIGN_DEFAULT_USER_LIST = 'userapi/api/auth/user/findCanUseCustomers' //查看当前已经认证的用户列表 1 公司 2 个人
export const ESIGN_DEFAULT_CUSTOMER_LIST = 'contractapi/api/customer/findCanUseCustomers' //查看当前已经认证的客户列表 1 公司 2 个人
export const ESIGN_DEFAULT_USER_UPDATE = 'userapi/api/auth/user/updateEsignId' //更新当前已经认证的用户列表 1 公司 2 个人
export const ESIGN_DEFAULT_CUSTOMER_UPDATE = 'contractapi/api/customer/updateEsignId' //更新当前已经认证的客户列表 1 公司 2 个人

export const ESGIN_RECORD_BUSSINESS = 'contractapi/api/sign/getBusinessTypeList' //签署记录业务类型
export const ESGIN_RECORD_URL = 'contractapi/api/sign/log/page' //签署记录
export const ESGIN_REVOKE_FLOW_URL = 'esignapi/api/eSign/revokeFlow' //撤销
export const ESGIN_SEARCH_WORDS_POSTION = 'esignapi/api/eSign/searchWordsPosition' //搜索关键字坐标
export const ESGIN_FIND_USER_INFO = 'esignapi/esign-user/findEx/user' //根据条件查询用户列表，（身份证 and 身份证类型） or （手机号）
export const ESGIN_FIND_ORG_USER_INFO = 'esignapi/esign-org/findEx/user' //根据条件查询组织列表，（身份证 and 身份证类型） or （手机号）
export const ESGIN_ESIGN_GETSIGNURL = 'esignapi/api/eSign/getSignUrl' //分享签署
export const deployFlow = 'esignapi/api/eSign/deployFlow/v3' //分享签署m
export const ESIGN_START_NEW = 'esignapi/api/esign-flow/start' //启动电签新接口
export const ESGIN_FIND_USER_LINK = 'esignapi/esign-user-verfiy-log/findByEx?verfiyResult=1&userId={userId}&contractFlowId={contractFlowId}' //查询用户认证地址
export const ESGIN_FIND_ORG_LINK = 'esignapi/esign-org-verfiy-log/findByEx?verfiyResult=1&orgId={orgId}&contractFlowId={contractFlowId}' // 查询组织认证地址）



export const STAFF_LIST = 'userapi/api/auth/user/page' //租户员工(POST)
export const ESIGN_GEN_AUTH_COMPANY_CODE = 'esignapi/esign-auth-code/genSchemaAuthCode' //企業-生成、更新个人授权码

//补录
export const WORKIN_OUT_CHECK = 'contractapi/api/workInOut/supplement/check/' //数据排查
export const WORKIN_OUT_CREATE = 'contractapi/api/workInOut/supplement' //新建补录
export const WORKIN_OUT_LIST = 'contractapi/api/workInOut/supplement/page' //新建补录列表
export const WORKIN_OUT_DETAIL = 'contractapi/api/workInOut/supplement/detail' //新建补录详情
export const WORK_INOUT_CARCHOOSE = "machineapi/api/machine/contract/page" //进场选择设备
export const WORK_INOUT_ORDERLIST = "contractapi/api/contract/order/getList" //补录设备列表

export const NOTICE_TAB_NUM = "userapi/api/notice/warningListAndUnreadCount" //重要通知的數量

export const DEVICE_ERCODE_IMG = "machineapi/api/qrcode/createMachineQrcode" //设备的二维码
export const DEVICE_ERCODE_IMG_LOGO = "machineapi/api/qrcode/createMachineQrcodeLogo" //设备的二维码
export const DEVICE_ERCODE_IMG_DOWNLOAD = "machineapi/api/qrcode/createMachineStream" //设备的二维码下载



export const ALL_MENUS_URL = "userapi/api/auth/user/getPermissions" //获取菜单数据
export const ADD_MENUS_URL = "userapi/api/auth/user/getAddPermissions " //查询当前用户角色下的新增功能权限
export const ALL_ADD_MENUS_URL = "userapi/api/auth/user/getAppPermissionsByUserId" //获取当前用户下的新增菜单
export const SAVE_ADD_MENUS_URL = "userapi/api/auth/user/customizeAddMenus" //保存当前用户下的新增菜单


export const CHART_RENT_TREND_URL = "contractapi/api/machine/machineType/rentTrend" //租金趋势
export const CHART_RENT_TREND_EXPORT = "contractapi/api/machine/machineType/rentTrend/export" //租金趋势-导出
export const CHART_REVENUE_MOTHLY_URL = "settleapi/api/settlement/month/statistics" //营收月度统计
export const INSURANCE_CREATE_URL = "machineapi/api/machine-insurance/save" //新增保险单
export const INSURANCE_RECORD_PAGE = "machineapi/api/machine-insurance/page" //保险记录分页
export const INSURANCE_DEVICE_PAGE = "machineapi/api/machine-insurance/inTheEquipmentPage" // 在保设备分页
export const INSURANCE_DETAIL_URL = "machineapi/api/machine-insurance/detail" // 保险单详情

export const SETTLE_CONTRACT_LIST = "settleapi/api/receivable/contract/page" // 结算合同列表
export const SETTLE_CUSTOMER_LIST = "settleapi/api/receivable/customer/page" // 结算客户列表
export const SETTLEMENT_DATA_URL = "settleapi/api/receivable/getStatementData" // 结算信息
export const SETTLEMENT_GETPERIODRECEIPT = "settleapi/api/receivable/getPeriodReceipt" // 结算信息
export const SETTLEMENT_CUSTOMIZE = "settleapi/api/receivable/customize" // 结算信息
export const SETTLEMENT_MACHINECHECK = "settleapi/api/settlement/machineCheck" // 车辆校验
export const SETTLEMENT_SETTLEMENT = "settleapi/api/settlement" // 新增结算
export const SETTLEMENT_SETTLEMENT_PREVIEW = "settleapi/api/settlement/export/v2" // 结算预览
export const SETTLEMENT_DELETE_CHECK = "settleapi/api/settlement/deleteCheck/{businessNo}" // 结算删除
export const SETTLEMENT_DELETE = "settleapi/api/settlement/delete/{businessNo}" // 结算删除

export const proceeds_list = "settleapi/api/proceeds/unbind/list" // 收款单列表
export const reimburse_list = "settleapi/api/reimburse/unbind/list" // 收款单列表
export const CREATE_APPLY = "settleapi/api/apply" // 新增对账/结算申请
export const APPLY_DATEIL = "settleapi/api/apply/detail" // 对账/结算申请详情
export const APPLY_PAGE = "settleapi/api/apply/page" // 对账/结算申请列表


export const STATISTICS_DEBT = "settleapi/api/debt/statistics" // 应收统计汇总
export const STATISTICS_DEBT_LIST = "settleapi/api/debt/statistics/list" // 应收统计列表
export const STATISTICS_DEBT_LIST_EXPORT = "settleapi/api/debt/statistics/export" // 应收统计汇总-导出
export const DEVICE_SELECT = "machineapi/api/machine/type/selectBest"; //获取设备的列表（可配置属性）
export const CONFIG_SYS_DETAIL = "userapi/api/sys-ui-param/detail" // 查询配置详情

//设备任务下发
export const MACHINE_SEND_PAGE = "machineapi/api/machineRemind/page" //下发分页
export const MACHINE_SEND_USER = "machineapi/api/machineRemind/arrange" //下发gongneg
export const MACHINE_SEND_RECORD_PAGE = "machineapi/api/task-release-record/page" //下发记录分页
export const MACHINE_SEND_RECORD_UPDATA = "machineapi/api/task-release-record" //下发记录更新
export const MACHINE_TODO_PAGE = "machineapi/api/service/todo/page" //待办分页/已办
export const MACHINE_TODO_CONNECT = "machineapi/api/service/todo" //待办关联
export const MACHINE_REPAIR_C_PAGE = "machineapi/api/machine/repair/list/associatedBusinessNo?associatedBusinessNo="
export const MACHINE_MENU_CLOSE = "machineapi/api/machineRemind/task/close" //任务关闭
export const MACHINE_MENU_CLOSE_LY = "machineapi/api/service/todo/arrange/task/close" //待办领用任务关闭
export const MACHINE_MENU_CLOSE_WAIT = "machineapi/api/service/todo/task/close" //待办关闭
export const MACHINE_TAST_COUNT = "machineapi/api/machineRemind/taskTodoCount" //待办数量
export const MACHINE_TAST_TODOR = "machineapi/api/machineRemind/todoArrange" //待办数量

export const BATTERY_DETAIL_URL = "machineapi/api/battery/detail" //根据车号查询电池详情
export const BATTERY_SUBMIT = "machineapi/api/battery" //更换电池
export const BATTERY_DEVICE_LIST = "machineapi/api/battery/getBatteryPage" //车辆维度的电池管理查询页面
export const BATTERY_RECORD_LIST = "machineapi/api/battery/getBatteryRecordPage" //车辆电池管理记录页面
export const BATTERY_EDIT = "machineapi/api/battery/editBattery" //编辑电池信息
export const DELETE_BATTERY = "machineapi/api/battery/deleteBattery/{id}" //删除电池信息

export const GET_DYNAMIC_FIELD = "settleapi/api/custom-field/{type}" //获取动态显示字段//contractAccountV2  合同  contractAccountV2Settlement   合同结算营收统计   machineAccountsV2  车辆  customerStatisticsV2  客户  businessOwnerStatisticsV2  业务负责人
export const SAVE_DYNAMIC_FIELD = "settleapi/api/custom-field" //保存动态显示字段

export const FIND_MACHINE = "machineapi/api/machine/monitor/findMachine/{licenseId}" //一键找车接口
export const CHECK_SUPPORT_FIND_MACHINE = "machineapi/api/machine/monitor/checkSupportFindMachine/{keyWord}" //查看是否支持一键找车接口


export const CREATE_DISCOUNT = "settleapi/api/settlement/discounts" //新增合同优惠：优惠，增收
export const GET_SETTLE_BY_CONTRACT =
  "settleapi/api/settlement/discounts/getSettleDetailByContractNo" //根据合同号查询当前合同最近一次结算单的当期营收和当期收款
export const DISCOUNT_LIST = "settleapi/api/settlement/discounts/page" //多条件分页查询合同优惠列表
export const DISCOUNT_DETAIL = "settleapi/api/settlement/discounts/detail" //根据id、单号查询合同优惠详情
export const DELETE_DISCOUNT = "settleapi/api/settlement/discounts/delete/{businessNo}" //删除合同优惠


export const MACHINE_FINANCE_LIST = "machineapi/api/machine-finance/page" //融资管理分页
export const MACHINE_FINANCE_UPDATE = "machineapi/api/machine-finance" //融资管理修改
export const MACHINE_DEPRECIATION_LIST = "machineapi/api/machine-finance/pageDepreciate" //折旧成本分页
export const MACHINE_DEPRECIATION_UPDATE = "machineapi/api/machine-finance/saveDepreciate" //折旧成本修改
export const COST_LIST = "contractapi/api/cost/search" //折旧成本修改


export const CHECK_PRODUCT_VERSION = "configapi/tenant/serverPush/getLastProductVerion" //产品版本

export const PUBLIC_FILE_DEAL = "machineapi/api/shareRentalFile/share" //附件公开



/* 服务交接机 */
export const CONTRACTAPI_DELIVER_TO = "contractapi/api/deliver/to" //新增服务交机
export const CONTRACTAPI_DELIVER_TO_BIND = "contractapi/api/deliver/to/bind" //进场关联服务交机单
export const CONTRACTAPI_DELIVER_TO_DELETE = "contractapi/api/deliver/to/delete/" //删除未关联的交机单
export const CONTRACTAPI_DELIVER_TO_DETAIL = "contractapi/api/deliver/to/detail" //根据单号查询交机单
export const CONTRACTAPI_DELIVER_TO_PAGE = "contractapi/api/deliver/to/page" //交机单分页列表

export const CONTRACTAPI_DELIVER_FROM = "contractapi/api/deliver/from" //新增服务接机
export const CONTRACTAPI_DELIVER_FROM_BIND = "contractapi/api/deliver/from/bind" //进场关联服务接机单
export const CONTRACTAPI_DELIVER_FROM_DELETE = "contractapi/api/deliver/from/delete/" //删除未关联的接机单
export const CONTRACTAPI_DELIVER_FROM_DETAIL = "contractapi/api/deliver/from/detail" //根据单号查询接机单
export const CONTRACTAPI_DELIVER_FROM_PAGE = "contractapi/api/deliver/from/page" //接机单分页列表

export const DEVICE_DUE_COUNT = "contractapi/api/contract/getStatisticalMachineDueInfo" //设备到期统计
export const DEVICE_DUE_LIST = "contractapi/api/contract/getStatisticalMachineDueDetailInfo" //设备到期统计列表
export const SEARCH_ALL_LIST = "searchapi/es/search"

/* 电池巡检 */
export const BATTERY_POLLING_LIST = "machineapi/api/battery-patrol-record/page" //电池巡检记录
export const BATTERY_POLLING_DEVICE = "machineapi/api/battery-patrol-record/machinePatrolRecord" //电池设备巡检
export const BATTERY_POLLING_DETAIL = "machineapi/api/battery-patrol-record/detail"//电池巡检详情
export const CREATE_BATTERY_POLLING = "machineapi/api/battery-patrol-record/save"//电池巡检新增

/* 设备库存 */
export const MACHINE_INVENTORY_LIST = "machineapi/api/machine/inventory/list" //设备库存统计报表
export const MACHINE_INVENTORY_DETIAL = "machineapi/api/machine/inventory/detail" //设备库存统计报表
export const MACHINE_OVERALL = "machineapi/api/machine/overall" //设备库存总览



/*模板判断*/
export const RENTAL_PAG_SAVE = "settleapi/api/rental/file/page";

//检查是否需要更新密码
export const CHECK_MODIFY_PWD = "userapi/api/auth/user/checkNeedUpdatePass";
//超过期限未更新密码-修改密码
export const PASS_EXPIRE_UPDATE = "userapi/api/auth/user/passExpireUpdate";
//修改初始密码
export const PASS_ORIGIN_UPDATE = "userapi/api/auth/user/firstUpdatePass";

//身份证识别
export const IDCARDFRONT = "userapi/api/auth/user/idCardFront";

// 营业执照识别

export const BIZLICENSE = "userapi/api/auth/org/bizLicense";


export const tenantParent = "userapi/api/tenant/parent/{id}";

// 操作证列表
export const certificateAdd = "machineapi/api/machine/operation/certificate"
export const certificateGetPage = "machineapi/api/machine/operation/certificate/getPage";
export const certificateSaveSeale = "machineapi/api/machine/operation/certificate/saveSeal";

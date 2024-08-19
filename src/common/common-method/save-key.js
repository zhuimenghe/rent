export const LOGIN_MEG = "loginMesage"; //用户登录完成后存储
export const USER_INFO_MEG = "userinfoMesage"; //获取个人信息
export const USER_INFO_SYNC = "userinfoSync"; //获取个人信息

export const USER_PRIVILEGES_MEG = "privilegesMesage"; //获取菜单信息
export const CONFIG_INFO = "configInfo"; //获取菜单信息
export const TENANT_DETAIL = "tenantDetail"; //租户详情
export const MY_ADD_MENUS = "addMenus"; //我的新增菜单
export const MY_ALL_MENUS = "allMenus"; //所有的菜单
export const IS_OPENED_APP = "isOpenedApp"; //是否打开过APP
export const LAST_CREATE_TYPE = "lastCreateType"; //业务新增上次点击数据

/**********************用户权限字段表****************************************/
export const PERMISSION_CONTRACT_MENU = "contract"; //合同管理
export const PERMISSION_CONTRACT_ADD = "addContract"; //新建合同
export const PERMISSION_CONTRACT_LIST = "contractManage"; //合同列表
export const PERMISSION_CONTRACT_CHANGE = "contractChanges"; //附加合同变更
export const PERMISSION_CONTRACT_CHANGE_ADD = "contractChangeAdd"; //合同变更新增
export const PERMISSION_CONTRACT_EXPENSE = "contractPlus"; //附加合同新增
export const PERMISSION_CONTRACT_EXPENSE_ADD = "contractPlusAdd"; //附加合同新增
export const PERMISSION_CONTRACT_DELETE = "contractDelete"; //删除合同

export const PERMISSION_SIMPLE_CONTRACT_ADD = "addExpressContract"; //快捷合同新增
export const PERMISSION_SIMPLE_WORKIN_ADD = "addExpressWorkIn"; //快捷进场新增
export const PERMISSION_SIMPLE_WORKOUT_ADD = "addExpressWorkOut"; //快捷退场新增

export const PERMISSION_MACHINE_MAINTIAN_MENU = "vehicleRepairMenu"; //设备维护
export const PERMISSION_MACHINE_REPAIR = "vehicleRepair"; //设备维修
export const PERMISSION_MACHINE_REPAIR_ADD = "vehicleServiceAdd"; //新增维修
export const PERMISSION_MACHINE_POLLING_ADD = "addInspection"; //新增维修
export const PERMISSION_BATTERY_POLLING_ADD = "addBatteryInspection"; //新增维修
export const PERMISSION_MACHINE_MAINTAIN = "vehicleMaintain"; //设备保养
export const PERMISSION_MACHINE_MAINTAIN_ADD = "vehicleMaintainAdd"; //设备保养
export const PERMISSION_MACHINE_FLUID = "vehicleFluid"; //设备补液
export const PERMISSION_MACHINE_FLUID_ADD = "vehicleFluidAdd"; //设备补液
export const PERMISSION_MACHINE_MENU = "deviceManage"; //设备管理
export const PERMISSION_MACHINE_FENCE = "fence"; //电子围栏
export const PERMISSION_MACHINE_FENCE_ADD = "fenceAdd"; //电子围栏-新增
export const PERMISSION_MACHINE_FENCE_DELETE = "fenceDelete"; //电子围栏-删除
export const PERMISSION_MACHINE_FENCE_EDIT = "fenceEdit"; //电子围栏-编辑
export const PERMISSION_MACHINE_FENCE_BIND = "fenceBindDevice"; //电子围栏-关联
export const PERMISSION_MACHINE_CONTROL = "vehicleControl"; //设备控制
export const PERMISSION_MACHINE_LOCK_UNLOCK = "lockOrUnlockMachine"; //锁车或解锁
export const PERMISSION_MACHINE_ARCHIVES = "vehicleArchives"; //设备档案
export const PERMISSION_MACHINE_ALLOT = "vehicleAllot"; //设备调拨
export const PERMISSION_MACHINE_ALLOT_ADD = "vehicleAllotAdd"; //设备调拨
export const PERMISSION_MACHINE_DISTRIBUTION = "distribution"; //设备分布
export const PERMISSION_MACHINE_MONTIOR = "vehicleMonitoring"; //设备监控
export const PERMISSION_MACHINE_EDIT = "vehicleArchivesEdit"; //设备编辑权限
export const PERMISSION_MACHINE_ADD = "vehicleArchivesAdd"; //设备新增权限

export const PERMISSION_NOTICE_MENU = "notice"; //通知审批
export const PERMISSION_NOTICE_MY_REQUEST = "myRequest"; //我的申请
export const PERMISSION_NOTICE_MY_TODO = "myTodo"; //我的待办
export const PERMISSION_NOTICE_MY_DONE = "done"; //我的已办
export const PERMISSION_NOTICE_MESSAGE = "message"; //消息提醒
export const PERMISSION_NOTICE_PROCESS = "process"; //通用流程

export const PERMISSION_REPORT_LIST = "reportList"; //报表列表

export const PERMISSION_SUBLET_MENU = "sublet"; //转租管理
export const PERMISSION_SUBLET_APPLY = "subletApply"; //转租申请
export const PERMISSION_SUBLET_COMPANY = "subletCompany"; //转租公司
export const PERMISSION_SUBLET_COMPANY_ADD = "subletCompanyAdd"; //转租公司
export const PERMISSION_SUBLET_COMPANY_EDIT = "subletCompanyEdit"; //转租公司
export const PERMISSION_SUBLET_COMPANY_DELETE = "subletCompanyDelete"; //转租公司
export const PERMISSION_SUBLET_DEVICE = "subletDevice"; //转租设备
export const PERMISSION_SUBLET_ADD = "subletApplyAdd"; //转租新增
export const PERMISSION_SUBLET_PAUSE = "subletPause"; //转租报停
export const PERMISSION_SUBLET_PAY = "subletPay"; //转租报\应付
export const PERMISSION_SUBLET_PAYADD = "subletPayAdd"; //转租报\应付
export const PERMISSION_SUBLET_DOWNLOAD = "subletDownload"; //转租报\应付
export const PERMISSION_SUBLET_RENT = "rent"; //转租-还租

export const PERMISSION_LOGISTICS_MENU = "logistics"; //物流管理
export const PERMISSION_LOGISTICS_RECORD = "logisticsRecord"; //物流记录
export const PERMISSION_LOGISTICS_COMPANY = "logisticsCompany"; //物流公司
export const PERMISSION_LOGISTICS_COMPANY_ADD = "logisticsCompanyAdd"; //物流公司
export const PERMISSION_LOGISTICS_COMPANY_EDIT = "logisticsCompanyEdit"; //物流公司
export const PERMISSION_LOGISTICS_COMPANY_DELETE = "logisticsCompanyDelete"; //物流公司
export const PERMISSION_LOGISTICS_UPDATA = "editLogisticsLog"; //物流公司
export const PERMISSION_LOGISTICS_PAY_ADD = "addLogisticsPay"; //物流公司
export const PERMISSION_LOGISTICS_PAY_DELETE = "deleteLogisticspay"; //物流公司
export const PERMISSION_LOGISTICS_PAY_UPDATA = "paidLogistics"; //物流公司

export const PERMISSION_SETTLEMENT_MENU = "settlement"; //结算管理
export const PERMISSION_SETTLEMENT_FLEXIBLE = "flexibleSettlement"; //灵活结算\新增灵活结算
export const PERMISSION_DOWNLOAD_SETTLEMENT_TEMP = "downloadSettlementTemplate"; //下载结算模板
export const PERMISSION_EXPORT_SETTLE = "settlementListExport"; //下载结算模板
export const PERMISSION_EXPORT_SETTLEDZ = "exportStatementAccount"; //下载结算模板
export const PERMISSION_EXPORT_STATEMENT = "exportStatementList"; //对账单列表导出

export const PERMISSION_INVOICE_MANAGE = "invoiceManage"; //发票管理
export const PERMISSION_INVOICE_MANAGE_ADD = "invoiceAdd"; //发票管理
export const PERMISSION_REFUND_MANAGE = "refundManage"; //退款管理
export const PERMISSION_REFUND_MANAGE_ADD = "refundAdd"; //退款管理-新增
export const PERMISSION_COST_MANAGE_ADD = "costAdd"; //退款管理-新增
export const PERMISSION_COLLECTION_MANAGE = "collectionManage"; //收款管理 
export const PERMISSION_COLLECTION_MANAGE_ADD = "collectionAdd"; //收款管理



export const PERMISSION_CONTRACT_EXECUTION_MENU = "contractExecution"; //合同执行
export const PERMISSION_CLAIM_MANAGE = "claimManage"; //索赔管理
export const PERMISSION_CLAIM_MANAGE_ADD = "claimAdd"; //索赔管理-新增
export const PERMISSION_CLAIM_MANAGE_ADJUST = "claimManageAdjust"; //索赔管理-调整
export const PERMISSION_CLAIM_MANAGE_ADD_SERIVE = "addServiceClaim"; //索赔管理-服务新增
export const PERMISSION_CLAIM_MANAGE_ADD_BUSINESS = "addBusinessClaim"; //索赔管理-业务新增

export const PERMISSION_PAUSE_MANAGE = "reportManage"; //报停管理
export const PERMISSION_PAUSE_MANAGE_ADD = "pauseAdd"; //报停管理-新增
export const PERMISSION_PAUSE_MANAGE_ADD_SERIVE = "addServicePause"; //报停管理-服务新增
export const PERMISSION_PAUSE_MANAGE_ADD_BUSINESS = "addBusinessPause"; //报停管理-业务新增
export const PERMISSION_PAUSE_MANAGE_ADJUST = "pauseAdjust"; //报停管理-调整
export const PERMISSION_WORK_IN_MANAGE = "arrivalManage"; //进场管理
export const PERMISSION_WORK_IN_ADD = "workIn"; //新建进场单
export const PERMISSION_WORK_OUT_MANAGE = "exitManage"; //退场管理
export const PERMISSION_WORK_OUT_ADD = "workOut"; //新建进场单
export const PERMISSION_COMMON_APPROVE = "commonApprove"; //通用审批
export const PERMISSION_INDEX = "index"; //首页
export const PERMISSION_TODO = "todo"; //代办事项
export const PERMISSION_CUSTOMER_MANAGER = "customerManage"; //客户管理
export const PERMISSION_CUSTOMER_MANAGER_DELETE = "customerDelete"; //客户管理-删除
export const PERMISSION_CUSTOMER_MANAGER_EDIT = "customerEdit"; //客户管理-编辑
export const PERMISSION_CUSTOMER_MANAGER_ADD = "customerAdd"; //客户管理-新增
export const PERMISSION_CUSTOMER_MANAGER_ADD_PERSON = "addPersonalCustomer"; //客户管理-新增个人
export const PERMISSION_CUSTOMER_MANAGER_ADD_COMPANY = "addCompanyCustomer"; //客户管理-新增企业
export const PERMISSION_STOCK_HOME = "spotCheck"; //整备模块
export const PERMISSION_STOCK_ADD = "checkRepairAdd"; //新增入库检修权限
export const PERMISSION_PREPARE_ADD = "prepareAdd"; //整备权限
export const PERMISSION_PREPARE_THOUGH = "checkRepairPass"; //检修通过权限
export const PERMISSION_REPAIRBING = "repairBind"; //检修绑定维修单权限
export const PERMISSION_CHECK_EXPORT = "vahicleOverhaulExport"; //设备档案

export const PERMISSION_PURCHASE_MANAGE = "vehiclePurchase"; //设备采购
export const PERMISSION_PURCHASE_ADD = "addPurchase"; //新增设备采购
export const PERMISSION_PURCHASE_DELETE = "deletePurchase "; //删除设备采购

export const PERMISSION_REPAIR_ADD = "vehicleServiceAdd"; //维修管理
export const PERMISSION_MAINTAIN_ADD = "vehicleMaintainAdd"; //维修管理
export const PERMISSION_INFUSION_ADD = "vehicleFluidAdd"; //维修管理

export const PERMISSION_PART_MANAGE = "partsManage"; //配件管理
export const PERMISSION_PARTSTOCK_ADD = "addPartsPutIn"; //配件入库
export const PERMISSION_PARTPRICE_ADD = "adjustPartsPrice"; //配件调整单价
export const PERMISSION_PARTALLOCT_ADD = "addPartsAllocation"; //配件调拨
export const PERMISSION_PARTRECEVICE_ADD = "addPartsReceive"; //配件出库
export const PERMISSION_PARTBACK_ADD = "addPartsBack"; //配件退回
export const PERMISSION_PARTBASE_ADD = "addPartConfig"; //配件退回
export const PERMISSION_PARTBASE_LIST = "configOptions"; //配件退回

export const PERMISSION_CHART_CREDIT = "ChartCredit"; //营收统计
export const PERMISSION_CHART_RATE = "ChartRate"; //出租率
export const PERMISSION_RATE_EXPORT = "reportRentExport"; //出租率导出
export const PERMISSION_CHART_CONTRACT = "ChartContract"; //合同统计
export const PERMISSION_CHART_MACHINE = "ChartMachine"; //设备统计
export const PERMISSION_CHART_INVENTTORY = "ChartInventory"; //库存
export const PERMISSION_CHART_CLINET = "ChartClient"; //客户
export const PERMISSION_CHART_STAFF = "ChartStaff"; //员工
export const PERMISSION_CHART_BUSINESS = "chartPersonal"; //个人人营收


export const PERMISSION_EXPORT_DEVICE = "exportFaultWarningDerivation"; //设备管理-设备监控详情-故障预警导出
export const PERMISSION_EXPORT_SETTLEMENT = "exportStatement"; //灵活结算-结算列表-结算详情-导出结算单
export const PERMISSION_EXPORT_SETTLEMENT_DETAIL = "exportStatementAccount"; //灵活结算-对账列表-对账详情-导出对账单
export const PERMISSION_EXPORT_CONTRACT_LIST = "exportContractList"; //合同列表导出
export const PERMISSION_EXPORT_CONTRACT_TEMPLATE = "contractDownloadWord"; //合同模板导出
export const PERMISSION_EXPORT_CUSTOMER_REVENUE = "exportCustomerRevenue"; //客户营收统计导出
export const PERMISSION_EXPORT_STAFF_REVENUE = "exportStaffRevenue"; //员工营收统计导出


export const PERMISSION_OUR_LOGISTICS_DRIVER_ADD = "ourselvesLogisticsDriverAdd"; //我方物流司机增加
export const PERMISSION_OUR_LOGISTICS_DRIVER_EDIT = "ourselvesLogisticsDriverEdit"; //我方物流司机修改
export const PERMISSION_OUR_LOGISTICS_DRIVER_DELETE = "ourselvesLogisticsDriverDelete"; //我方物流司机删除


export const PERMISSION_OUR_LOGISTICS_VEHICLE_ADD = "ourselvesLogisticsVehicleAdd"; //我方物流车辆增加

export const PERMISSION_OUR_LOGISTICS_VEHICLE_EDIT = "ourselvesLogisticsVehicleEdit"; //我方物流车辆修改
export const PERMISSION_OUR_LOGISTICS_VEHICLE_DELETE = "ourselvesLogisticsVehicleDelete"; //我方物流车辆删除
export const PERMISSION_OUR_LOGISTICS_MANAGE = "ourselvesLogistics"; //我方物流权限


export const PERMISSION_DEVICE_UPDATA = "editMachinePrice";//车辆档案修改权限

export const PERMISSION_ADD_PIGENOHOLE = "contractFile";//归档权限
export const PERMISSION_LIST_WORKINOUT = "workSupplement";//补录查看权限
export const PERMISSION_ADD_WORKINOUT = "workInOutSupplementAdd";//补录新增权限


export const PERMISSION_ESIGN_MENU = "signature";//电签管理
export const PERMISSION_SHOWDOWNSESGIN = "exportEsignLog";//电签列表导出
export const PERMISSION_ESIGN_TENANT_CERTIFY = "tenantCertification";//租户认证
export const PERMISSION_ESIGN_CERTIFY_MANAGE = "certificationManage";//认证管理
export const PERMISSION_ESIGN_RECORD = "signatureRecord";//签署记录
export const PERMISSION_ESIGN__UPDATE = "signatureAdd";//签章权限
export const PERMISSION_ESIGN_ADD = "contractESignAdd";//合同启动权限
export const PERMISSION_PLUS_ESIGN_ADD = "contractPlusESignAdd";//合同启动权限
export const PERMISSION_ESIGN_RENTAL_USER = "signatureIsShowUser";//认证管理-租赁员工tab
export const PERMISSION_SETTLEMENT_ESIGN_ADD = "settlementESignAdd";//结算启动权限
export const PERMISSION_STATEMENT_ESIGN_ADD = "statementESignAdd";//结算启动权限
export const PERMISSION_WORKIN_ESIGN_ADD = "workInESignAdd";//进场启动权限
export const PERMISSION_WORKOUT_ESIGN_ADD = "workOutESignAdd";//退场启动权限


export const PERMISSION_DEVICE_REVENUE_STATISTICS = "machineRevenueStatistics";//设备营收统计
export const PERMISSION_DEVICE_REVENUE_EXPORT = "exportMachineRevenueStatistics";//设备营收导出

export const PERMISSION_CONTRACT_REVENUE_STATISTICS = "expireRevenue";//合同营收统计
export const PERMISSION_CONTRACT_REVENUE_STATISTICS_EXPORT = "exportContractReport";//合同营收统计
export const PERMISSION_CONTRACT_PERFORM_STATISTICS_EXPORT = "exportPerformContractReport";//合同履约营收统计
export const PERMISSION_STAFF_REVENUE_STATISTICS = "staffOverdueStatistics";//员工营收统计
export const PERMISSION_STAFF_PERFORM_STATISTICS = "exportPerformStaffReport";//员工履约营收统计
export const PERMISSION_CUSTOMER_REVENUE_STATISTICS = "customerOverdue";//客户营收统计
export const PERMISSION_CUSTOMER_PERFORM_STATISTICS = "exportPerformCustomerReport";//客户履约营收统计
export const PERMISSION_DEVICE_PERFORM_STATISTICS = "exportPerformMachineReport";//设备履约营收统计
export const PERMISSION_SHOW_DEVICE_QRCODE = "showQrCode";//是否显示设备二维码

export const PERMISSION_MACHINE_LX_REVENUE_QRCODE = "machinePerform";//设备履约营收
export const PERMISSION_CONTRACT_LX_REVENUE_QRCODE = "contractPerform";//合同履约营收



export const PERMISSION_EXPORT_ALL_LIST = 'reportList';//下载权限
export const PERMISSION_MANAGER_STATISTICS = "ChartManager";//合同营收统计

export const PERMISSION_RENT_TREND_STATISTICS = "RentTrendChart";//租金趋势
export const PERMISSION_RENT_TREND_STATISTICS_MORE = "rentTrendReport";//租金趋势-更多
export const PERMISSION_RENT_TREND_EXPORT = "exportRentTrendReport";//租金趋势-导出

export const PERMISSION_INSURANCE_MANAGE = "vehicleInsurance";//保险管理
export const PERMISSION_INSURANCE_ADD = "addVehicleInsurance";//新增保险

export const PERMISSION_APPLICATION_MANGE = "applyManage";//申请结算对账的管理
export const PERMISSION_APPLICATION_ADD = "addApply";//申请结算对账的新增
export const PERMISSION_STATISTICS_DEBT = "ChartDebt";//应收统计报表
export const PERMISSION_STATISTICS_DEBT_MORE = "debtReport";//应收统计报表-更多
export const PERMISSION_STATISTICS_DEBT_EXPORT = "exportDebtReport";//应收统计报表-导出
export const PERMISSION_STATISTICS_REVENUE_MONTHLY = "revenueMonthlyStatistics";//首页-营收月度统计




export const PERMISSION_BATTERY_DEVICE = "deviceBattery";//电池管理-设备电池
export const PERMISSION_BATTERY_RECORD = "batteryRecord";//电池管理-电池记录
export const PERMISSION_BATTERY_DEVICE_EXPORT = "deviceBatteryExport";//电池管理-设备电池-导出
export const PERMISSION_BATTERY_RECORD_EXPORT = "batteryRecordExport";//电池管理-电池记录-导出

export const PERMISSION_FINANCING_DEVICE = "financingEdit";//融资管理编辑-设备电池
export const PERMISSION_DEPRECIATION_DEVICE = "depreciationEdit";//折旧成本编辑-设备电池

export const PERMISSION_FIND_MACHINE = "findMachine";//一键找车
export const PERMISSION_ADD_SETTLED = "contractSettledAdd";//新增合同优惠
export const PERMISSION_ADD_DISCOUNTS = "addContractDiscounts";//新增合同优惠
export const PERMISSION_BUSINESS_DISCOUNTS = "discountsList";//优惠/增收列表
export const PERMISSION_BUSINESS_COST = "costManage";//优惠/增收列表
export const PERMISSION_BUSINESS_DISCOUNTS_EXPORT = "discountsListExport";//优惠/增收列表-导出
export const PERMISSION_BUSINESS_COST_EXPORT = "costExport";//优惠/增收列表-导出
export const PERMISSION_DISCOUNTS_DELETE = "discountsDelete";//优惠/增收删除

export const PERMISSION_SERVICE_TASK = "vehicleTaskManage";//服务任务
export const PERMISSION_SHARE_SETTING = "sharingRights";//分享设置权限
export const PERMISSION_SHARE = "machineShare";//分享权限


/***********************************************************************************/

export const USER_ROLE_SEVICER = 21; //用户角色-服务人员
export const USER_ROLE_BUSINESS = 31; //用户角色-业务人员

export const ALL_ORG_LIST = 'saveorglist'
export const ALL_USER_LIST = 'saveuserlist'


export const MEMORY_STORAGE = "memoryStorage"; //内存存储
export const MS_CONTRACT = "0"; //跳转合同tab
export const MS_WORK_IN = "1"; //跳转进场tab
export const MS_WORK_OUT = "2"; //跳转退场tab
export const MS_CLAIM = "3"; //跳转索赔tab
export const MS_PROCEEDS = "4"; //跳转收款tab
export const MS_REIMBURSE = "5"; //跳转退款tab
export const MS_INVOICE = "6"; //跳转发票tab
export const MS_PAUSE = "7"; //跳转报停tab
export const MS_CONTRACT_CHANGE = "8"; //跳转合同变更tab
export const MS_CONTRACT_EXPEND = "10"; //跳转合同附加tab
export const MS_SETTLE_DOWN = "11"; //跳转结算单tab
export const MS_SETTLE_ACCOUNT = "12"; //跳转对账单tab





export const SERVICE_DELIVER_ADD = "serviceDeliverAdd"; //新增交机单
export const SERVICE_RECEIVE_ADD = "serviceReceiveAdd"; //新增接机单
export const PERMISSION_STATISTICS_DEVICE_DUE_COUNT = "MachineDueStatistics"; //设备到期统计
export const PERMISSION_STATISTICS_DEVICE_DUE_MORE = "machineDueReport"; //设备到期统计-报表
export const PERMISSION_STATISTICS_DEVICE_DUE_EXPORT = "machineDueExport"; //设备到期统计-导出




import LOGO from '@/assets/images/logo.png'
export const logo = LOGO
export const sitename = '普惠通'
export const footertext = '普惠通 2017-2018 © 金惠普民'

// export const baseUrl = 'http://staging.phjrt.com:8080'
export const API = {
  // host: 'http://192.168.1.45',
  login: 'api/product/third_party/login', // 登录
  getUserInfo: 'api/product/third_party/user/info', // 获取当前登录用户的资料
  getEAccountStatis: '/api/user/administration/electronicAccountForChannel', // 电子账户渠道分析

  // dashboard
  loansOrderStatis: '/api/product/third_party/statistics/loans_order', // 贷款订单数据
  eAccountStatis: '/api/product/third_party/statistics/eleAccount', // 开通电子账户数据
  loansAccount:'api/product/third_party/statistics/homepage',//首页数据总览

  //新增二类户
  getEleAccountList:'api/product/third_party/banks/ele_account/lists',//查询二类户列表

  //注册新用户
  getRoleList:'api/product/third_party/roles',//查询角色权限列表
  registerNewUser:'api/product/third_party/user',//注册新用户

  //人员管理
  getUserManageInfo:'api/product/third_party/loans/order_distribution',//查询人员管理页面数据

  // 金融超市
  loansProduct: '/api/product/third_party/loans', // 贷款产品信息相关
  createLoansProduct: '/api/product/third_party/loans/create', // 新建贷款产品
  getLoadList: '/api/product/third_party/loans/lists', // 获取贷款产品列表
  editLoanInfo: '/api/product/third_party/loans/edit_info', // 编辑贷款产品
  loanStatus: '/api/product/third_party/loans/status', // 编辑贷款产品状态
  loanFormGroups: '/api/product/form/groups', // 编辑贷款产品表单分组
  loanFormFields: '/api/product/form/fields', // 编辑贷款产品表单字段
  loanFormProductField: '/api/product/form/product/field', // 编辑贷款产品分组下的字段
  loanFormFieldsValues: '/api/product/form/fields/values', // 管理表单字段选项
  loanFormSelectOptions: '/api/product/loans/create/select', // 贷款表单下拉选择字段选项

  // 订单管理
  orderList: '/api/product/third_party/loans/orders', // 订单列表
  loanOrder: '/api/product/third_party/loans/order', // 查看订单详情
  loanOrderStatus: '/api/product/third_party/loans/order/audit_status', // 查看订单状态
  loanOrderAudit: 'api/product/third_party/loans/order/audit', // 订单审核

  // 菜单设置
  menus: 'api/product/third_party/menus/sidebar',
  
   //菜单编辑
  menusEditor: '/api/product/third_party/menus'
}

import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Card, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore, isEmptyObj, getRouteParams } from '@/utils/util'
import './OrderView.less'

import OrderAuditModal from '../OrderAuditModal/OrderAuditModal'

class OrderView extends React.Component {
  state = {
    loading: false,
    data: [],
    realname:'',
    product_name:'',
    order_no:'',
    idcard:'',
    applyData: [],
    viewClass: 'view-wrapper hideimg',
    viewImg: '',
    loans_use: '',//贷款用途
    deadline: '',//申请授信期限
    amount: '',//申请授信金额
    allow_amount: '',//审批授信后金额
    allow_day: '',//审批授信后期限
    allow_repayment_method: '',//审批还款方式
    alow_info:{},
    pass_rate:0,
    orderStatus: '',
    statusList: [],
    statusModalVisible: false,
    remarkText: '',
    prompt_msg:'',
    repayMethodOptions:[]
    // propsData:getRouteParams(this.props)
  }
  hasState = true
  
  componentDidMount () {
    //登录校验
    const { user, location, history, dispatch, app } = this.props
    const { pathname } = location
    if (pathname === '/login') {
      return
    }
    const token = loadStore('token')
    if (!token) {
      Modal.warning({
        title: '提示！',
        content: '登录已过期，请重新登陆',
        onOk: () => {
          if (pathname !== '/') {
            history.push(`/login?from=${encodeURIComponent(pathname.substr(1))}`)
          } else {
            history.push('/login')
          }
        }
      })
      return
    }
    //登录校验结束
    GET(API.loanFormSelectOptions)
      .then(data => {
        // console.log('初始化订单详情页获取api-------->',data)
        if (data.status === 200) {
          this.hasState && this.setState({
            repayMethodOptions: data.repayment_method
          })
        }
      })
    this.loadListData()
  }

  componentWillUnmount () {
    this.hasState = false
  }

  loadListData = () => {
    this.setState({ loading: true })
    const { match } = this.props
    const { id } = match.params
    
    const hide = message.loading('数据加载中..', 0)
    GET(`${API.loanOrder}/${id}`)
      .then(data => {
        // console.log('查询订单信息api返回--------->',data)
        hide()
        this.hasState && this.setState({
          loading:false,
          data: data.other_detail_item,
          applyData: data.apply_detail,
          idcard:data.idcard,
          loans_use: data.loans_use,
          deadline: data.deadline,
          amount: data.amount,
          allow_amount: data.allow_amount,
          allow_day: data.allow_day,
          allow_repayment_method: data.allow_repayment_method,
          pass_rate: data.pass_rate,
          realname: data.realname,
          product_name: data.product_name,
          order_no: data.order_no,
          orderStatus: data.audit_status,
          statusList: data.status_list,
        })
      })
  }

  goback = () => {
    this.props.history.goBack()
  }

  scaleImg = e => {
    this.setState({
      viewImg: e.target.getAttribute('src'),
      viewClass: 'view-wrapper showimg'
    })
  }

  hideViewImg = () => {
    this.setState({
      viewClass: 'view-wrapper hideimg'
    })
  }

  openModal = () => {
    this.setState({
      statusModalVisible: true
    })
    const { history, location, match } = this.props
    const id = match.params.id
    this.getStatusList(id)
  }
  getStatusList = id => {
    GET(`${API.loanOrderStatus}/${id}`)
      .then(data => {
        if (data.status === 200) {
          this.hasState && this.setState({
            prompt_msg: data.prompt_msg,
            alow_info: data.form_data,
            // orderStatus: data.orderStatus,
          })
        }
      })
  }
  handleAudit = () => {
    const { match } = this.props
    const { id } = match.params
    const {
      statusList,
      orderStatus,
      statusModalVisible,
      remarkText
    } = this.state
    const form = this.statusModal
    form.validateFields((err, values) => {
      if (!err) {
        // console.log('授信传回后台的数据------->',values)
        POST(API.loanOrderAudit, {
          order_id: id,
          status: values.orderStatus ? values.orderStatus : (this.state.orderStatus ==='indeterminate' ? 'credited' : ''),
          remark: '',
          allow_amount: values.allow_amount,
          allow_day: values.allow_day,
          allow_repayment_method: values.allow_repayment_method,
        }).then(data => {
          if (data.status === 200) {
            message.success(data.message)
            this.loadListData()
            this.setState({
              statusModalVisible: false
            })
            form.resetFields()
          }
        })
      }
    })
  }
  component = (src) => {
    return  <img
              src={src}
              alt='图片'
              onClick={e => { this.scaleImg(e) }}
            />
  }
  closeModal = () => {
    this.statusModal.resetFields()
    this.setState({
      statusModalVisible: false
    })
  }
  statusConfig = {//订单状态管理
    'unaudited' : '未受理',
    'reject' : '不受理',
    'accepted' : '已受理',
    'pending' : '待审核',
    'checked' : '已审核',
    'unchecked' : '审核失败',
    'indeterminate' : '待确定授信信息',
    'credited' : '已授信',
    'lending' : '已放款',
  }
  render () {
    const {
      statusList,
      orderStatus,
      applyData,
      idcard,
      loans_use,
      deadline,
      amount,
      allow_amount,
      allow_day,
      allow_repayment_method,
      pass_rate,
      data,
      realname,
      product_name,
      order_no,
      statusModalVisible,
      remarkText,
      prompt_msg,
      alow_info,
      repayMethodOptions
    } = this.state
    // console.log('orderView data------>',data)
    return (
      <div>
        <div className="page-head orderview-head">
          <Button type="primary" icon="left" onClick={this.goback}>返回</Button>
          <div>产品名称：{product_name}</div>
          <div>订单号：{order_no}</div>
          <div>
            <div className="orderview-head-right">
              <span>订单状态：{this.statusConfig[orderStatus]}</span>
              {
                statusList && statusList.length > 0 
                ? <Button type="primary" icon="form" onClick={this.openModal}>
                    操作
                  </Button>
                : null
              }
            </div>
          </div>
        </div>
        <div className="page-content">
          <Card className="orderview-card" loading={this.state.loading}>
            <Row>
              <Col span="12">
                <span>申请人：{realname}</span>
              </Col>
              <Col span="12">
                <span>身份证号：{idcard}</span>
              </Col>
            </Row>
          </Card>
          {
            orderStatus === 'credited' || orderStatus === 'lending'
            ? <Card className="orderview-card" loading={this.state.loading}>
                <Row>
                  <Col span="8">
                    <span>审批后的授信金额：{allow_amount}</span>
                  </Col>
                  <Col span="8">
                    <span>审批后的授信期限：{allow_day}</span>
                  </Col>
                  <Col span="8">
                    <span>审批后的还款方式：{allow_repayment_method}</span>
                  </Col>
                </Row>
              </Card>
            : null
          }
          <Card className="orderview-card" loading={this.state.loading}>
            <Row>
              <Col span="12">
                <span>申请授信金额：{amount}</span>
              </Col>
              <Col span="12">
                <span>申请授信期限：{deadline}</span>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <span>贷款用途：{loans_use}</span>
              </Col>
            </Row>
          </Card>
          <Card 
            className="orderview-card" 
            loading={this.state.loading}
            title={'申请资料评分：'+pass_rate+'（仅供参考）'}
          >
            <div className="orderview-card-grid">
              <Row>
                <Col span="8"><b>准入条件</b></Col>
                <Col span="8"><b>选项</b></Col>
                <Col span="8"><b>备注（佐证证明）</b></Col>
              </Row>
            </div>
          {
            applyData.length > 0
            ? applyData.map( (item,index) => {
              return  <div className="orderview-card-grid" key={index}>
                        <Row>
                          <Col span="8">
                            <span>{item.label}</span>
                          </Col>
                          <Col span="8">
                            <span>{item.value}</span>
                            {
                              item.is_evidence === 1
                              ? '（已修改）'
                              : null
                            }
                          </Col>
                          {
                            item.evidence
                            ? <Col span="8">
                                <img 
                                  alt='tu'
                                  src={item.evidence}
                                  onClick={e => { this.scaleImg(e) }}
                                />
                              </Col>
                            : null
                          }
                        </Row>
                      </div>
            })
            : null
          }
          </Card>
          {/******信用评分暂时静态******/}
          <Card 
            className="orderview-card" 
            loading={this.state.loading}
            title='个人信用信息评分（数据来源：河南农村信用信息系统）'
          >
            <div className="orderview-card-grid">
              <Row>
                <Col span="8">
                  <span><b>总评分</b></span>
                </Col>
                <Col span="8">
                    <span>80分（信用良好）</span>
                </Col>
              </Row>
            </div>
            <div className="orderview-card-grid">
              <Row>
                <Col span="8">
                  <span>房产</span>
                </Col>
                <Col span="8">
                    <span>20分（40%）</span>
                </Col>
              </Row>
            </div>
            <div className="orderview-card-grid">
              <Row>
                <Col span="8">
                  <span>经营实体</span>
                </Col>
                <Col span="8">
                    <span>18分（30%）</span>
                </Col>
              </Row>
            </div>
            <div className="orderview-card-grid">
              <Row>
                <Col span="8">
                  <span>个人信用</span>
                </Col>
                <Col span="8">
                    <span>24分（30%）</span>
                </Col>
              </Row>
            </div>
          </Card>
          {/******信用评分暂时静态***结束***/}
          <Card 
            className="orderview-card" 
            loading={this.state.loading}
            title='其他资料'
          >
            {data.length > 0 && data.map((card, key) => (
              <div className="orderview-card-grid" key={key}>
                <Row>
                  <Col span="8">
                    <span>{card.label}</span>
                  </Col>
                  <Col span="16">
                    {card.value && card.type === 'image'
                      ? <img onClick={e => { this.scaleImg(e) }} src={card.value} alt={card.label} />
                      : <span>{card.value}</span>
                    }
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </div>
        <div onClick={this.hideViewImg} className={this.state.viewClass}>
          <img src={this.state.viewImg} alt="" />
        </div>
        <OrderAuditModal
          ref={node => { this.statusModal = node }}
          visible={statusModalVisible}
          orderStatus={orderStatus}
          statusList={statusList}
          remarkText={remarkText}
          alow_info={alow_info}
          prompt_msg={prompt_msg}
          onCancel={this.closeModal}
          onCreate={this.handleAudit}
          repayMethodOptions={repayMethodOptions}
        />
      </div>
    )
  }
  componentWillUnount () {
    this.hasState = false
    // console.log('componentWillUnount')
  }
}

export default OrderView

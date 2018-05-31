import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover, Cascader } from 'antd'
import { SearchForm } from '@/components'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore } from '@/utils/util'
import './OrderList.less'

import OrderAuditModal from '../OrderAuditModal/OrderAuditModal'

class OrderList extends React.Component {
  state = {
    data: [],
    loading: false,
    pageSize: 10,
    total: 0,
    current: 1,
    orderStatus: '',
    statusList: [],
    statusModalVisible: false,
    remarkText: '',
    selectedId: '',
    areas: []
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
    this.getOrderList(1)
  }

  componentWillUnmount () {
    this.hasState = false
  }

  getStatusList = id => {
    GET(`${API.loanOrderStatus}/${id}`)
      .then(data => {
        if (data.status === 200) {
          this.hasState && this.setState({
            statusList: data.status_list,
            orderStatus: data.audit_status,
            statusModalVisible: true,
            remarkText: data.audit_flow.remark || '',
            selectedId: id
          })
        }
      })
  }

  getOrderList = (page, startDate, endDate, phone, order_no, area) => {
    this.setState({ loading: true })
    GET(API.orderList, {
      startDate,
      endDate,
      phone,
      page,
      order_no,
      area
    }).then(data => {
      if (data.status === 200) {
        this.hasState && this.setState({
          data: data.data,
          areas: data.areas,
          loading: false,
          pageSize: data.per_page,
          total: data.total,
          current: data.current_page
        })
      }
    })
  }

  search = ({ date = {}, phone, order_no, area }) => {
    this.getOrderList(1, date[0], date[1], phone, order_no, area)
  }

  viewOrder = record => {
    // this.props.history.push(`/order/view/${record.order_id}`)
    const { history, location, match } = this.props
    history.push({
      pathname: `/order/view/${record.order_id}`,
      state: { data: record }
    })
  }

  auditOrder = record => {
    this.getStatusList(record.order_id)
  }

  closeModal = () => {
    this.statusModal.resetFields()
    this.setState({
      statusModalVisible: false
    })
  }

  handleAudit = () => {
    const {
      statusList,
      orderStatus,
      statusModalVisible,
      remarkText,
      selectedId
    } = this.state
    const form = this.statusModal
    form.validateFields((err, values) => {
      if (!err) {
        // console.log(values)
        POST(API.loanOrderAudit, {
          order_id: selectedId,
          status: values.orderStatus,
          remark: values.remarkText
        }).then(data => {
          if (data.status === 200) {
            message.success(data.message)
            this.getOrderList(1)
            this.setState({
              statusModalVisible: false
            })
            form.resetFields()
          }
        })
      }
    })
  }

  render () {
    const columns = [{
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '订单编号',
      dataIndex: 'order_no'
    }, {
      title: '购买用户',
      dataIndex: 'realname'
    }, {
      title: '用户手机',
      dataIndex: 'user_name'
    }, {
      title: '购买金额',
      dataIndex: 'money'
    }, {
      title: '申请期限',
      dataIndex: 'day'
    }, {
      title: '申请用途',
      dataIndex: 'application_use'
    }, {
      title: '申请时间',
      dataIndex: 'created_at'
    }, {
      title: '购买状态',
      dataIndex: 'statusTxt'
    }, {
      title: '地址',
      dataIndex: 'area'
    }, {
      title: '操作',
      key: 'opt',
      render: (text, record) => (
        <div>
          <a onClick={() => { this.viewOrder(record) }}>查看</a>
          {/* <a onClick={() => { this.auditOrder(record) }}> 审核</a> */}
        </div>
      )
    }]

    const { statusModalVisible, orderStatus, statusList, remarkText, areas } = this.state
    // console.log('state------>', areas)
    return (
      <div>
        <div className="page-head">
          <h3>订单列表</h3>
        </div>
        <div className="page-content">
          <Table
            title={() => (
              <div className="u-table-title">
                <span>订单列表</span>
                <SearchForm
                  onSubmit={this.search}
                  catagory={[
                    { key: 'area', type: 'cascader', label: '区域', areas: areas},
                    { key: 'order_no', type: 'input', label: '订单编号' },
                    { key: 'phone', type: 'input', label: '电话号码' },
                    { key: 'date', type: 'timeRange', label: '产品申请时间' },
                  ]}
                  // options={{ initialValue: [], rules: [{ type: 'array' }] }}
                />
              </div>
            )}
            rowKey={record => record.order_id}
            columns={columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            bordered={true}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              current: this.state.current,
              onChange: (page, pageSize) => {
                this.getOrderList(page)
              }
            }}
          />
        </div>
        <OrderAuditModal
          ref={node => { this.statusModal = node }}
          visible={statusModalVisible}
          orderStatus={orderStatus}
          statusList={statusList}
          remarkText={remarkText}
          onCancel={this.closeModal}
          onCreate={this.handleAudit}
        />
      </div>
    )
  }
}

export default OrderList

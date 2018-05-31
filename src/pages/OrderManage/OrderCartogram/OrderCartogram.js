import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import ReactEcharts from 'echarts-for-react'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore, getLineChartOption } from '@/utils/util'
import './OrderCartogram.less'

class OrderCartogram extends React.Component {
  state = {
    chartTitle: '',
    chartXData: [],
    chartYData: []
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
    this.hasState && this.setState({
      chartTitle: '统计分析',
      chartXData: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      chartYData: [820, 932, 901, 934, 1290, 1330, 1320]
    })
  }

  componentWillUnmount () {
    this.hasState = false
  }

  render () {
    const { chartTitle, chartXData, chartYData } = this.state
    return (
      <div>
        <div className="page-head">
          <h3>订单统计</h3>
        </div>
        <div className="page-content">
          <h3 style={{ marginLeft: 30 }}>贷款订单{chartTitle}</h3>
          <ReactEcharts
            option={getLineChartOption(chartTitle, chartXData, chartYData)}
            lazyUpdate={true}
          />
        </div>
      </div>
    )
  }
}

export default OrderCartogram

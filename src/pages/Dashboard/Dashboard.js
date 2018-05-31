import React from 'react'
import { connect } from 'react-redux'
import CountUp from 'react-countup'
import ReactEcharts from 'echarts-for-react'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Card, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore, isEmptyObj, getLineChartOption } from '@/utils/util'
import './Dashboard.less'

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 }
}
const chartsColResponsiveProps = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
  xl: 12
}

// https://preview.pro.ant.design/#/dashboard/analysis
// http://antd-admin.zuiidea.com/dashboard
class Dashboard extends React.Component {
  state = {
    number: 2018,
    totalUser: 0,
    // cardList: [
    //   { title: '贷款申请', icon: 'bank', color: '#4fdc7e', number: new Date().getFullYear() },
    //   { title: '电子账户', icon: 'laptop', color: '#68b7fb', number: new Date().getMonth() + 1 },
    //   { title: '注册人数', icon: 'team', color: '#cd6fe8', number: new Date().getDate() },
    //   { title: '实名认证', icon: 'solution', color: '#ff5871', number: new Date().getDay() }
    // ],
    loansNum:null,
    eleAccountNum:null,
    registerNum:null,
    realnameNum:null,
    easTitle: '',
    easXData: [],
    easYData: [],
    losTitle: '',
    losXData: [],
    losYData: []
  }
  hasState = true

  getEAccountStatis = async days => {
    return GET(API.eAccountStatis, {
      days
    })
  }

  getLoansOrderStatis = days => {
    return GET(API.loansOrderStatis, {
      days
    })
  }

  componentDidMount () {
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

    GET(API.loansAccount)//获取首页数据总览
    .then(data => {
      // console.log(data)
      if(data.status === 200) {
        this.hasState && this.setState({
          loansNum:data.loans_num,
          eleAccountNum:data.eleAccount_num,
          registerNum:data.register_num,
          realnameNum:data.realname_num,
        })
      }
    })

    this.getEAccountStatis()
      .then(data => {
        // console.log(data)
        if (data.status === 200) {
          this.hasState && this.setState({
            easTitle: data.seriesData && data.seriesData.length > 0 && data.seriesData[0].name,
            easXData: data.xAxisData,
            easYData: data.seriesData && data.seriesData.length > 0 && data.seriesData[0].data
          })
        }
      })
    this.getLoansOrderStatis()
      .then(data => {
        // console.log(data)
        if (data.status === 200) {
          this.hasState && this.setState({
            losTitle: data.seriesData && data.seriesData.length > 0 && data.seriesData[0].name,
            losXData: data.xAxisData,
            losYData: data.seriesData && data.seriesData.length > 0 && data.seriesData[0].data
          })
        }
      })
  }

  componentWillUnmount () {
    this.hasState = false
  }
  
  render () {
    const { easTitle, easXData, easYData, losTitle, losXData, losYData, loansNum, eleAccountNum, registerNum, realnameNum, } = this.state
    const cardList = [
      { title: '贷款申请', icon: 'bank', color: '#4fdc7e', number: loansNum },
      { title: '电子账户', icon: 'laptop', color: '#68b7fb', number: eleAccountNum },
      // { title: '注册人数', icon: 'team', color: '#cd6fe8', number: registerNum },
      // { title: '实名认证', icon: 'solution', color: '#ff5871', number: realnameNum }
    ]
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <Row gutter={32} style={{ padding: '0 20px' }}>
            {cardList.length > 0 && cardList.map((item, key) => (
              <Col {...topColResponsiveProps} key={key}>
                <Card hoverable={true} bordered={false}>
                  <Icon type={item.icon} className="dashboard-content-icon" style={{ color: item.color }}/>
                  <div className="dashboard-content-wrapper">
                    <p>{item.title}</p>
                    <CountUp
                      start={0}
                      end={item.number}
                      duration={2.75}
                      useEasing
                      useGrouping
                      separator=","
                    />
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          <Row>
            <Col {...chartsColResponsiveProps} style={{ padding: 20, marginBottom: 24 }}>
              <div style={{ padding: 20, backgroundColor: '#fff' }}>
                <h3 style={{ marginLeft: 30 }}>电子账户{easTitle}</h3>
                <ReactEcharts
                  option={getLineChartOption(easTitle, easXData, easYData)}
                  lazyUpdate={true}
                />
              </div>
            </Col>
            <Col {...chartsColResponsiveProps} style={{ padding: 20, marginBottom: 24 }}>
              <div style={{ padding: 20, backgroundColor: '#fff' }}>
                <h3 style={{ marginLeft: 30 }}>贷款订单{losTitle}</h3>
                <ReactEcharts
                  option={getLineChartOption(losTitle, losXData, losYData, true)}
                  lazyUpdate={true}
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
}

export default Dashboard

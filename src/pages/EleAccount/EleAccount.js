'use strict'
import React from 'react'
import {Card, Row, Col, Table, Modal} from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore } from '@/utils/util'
import { SearchForm } from '@/components'
import './EleAccount.less'

//二类户模块

class EleAccount extends React.Component {
  state = {
    data: [],
    loading: false,
    pageSize: 10,
    total: 0,
    current: 1,
    accountSum: null,
    monthAccountSum: null,
    weekAccountSum: null,
    dayAccountSum: null,

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
    this.getEleAccountList(1)
  }
  search = ({ date = {} }) => {
    this.getEleAccountList(1, date[0], date[1])
  }
  getEleAccountList = (page, startDate, endDate) => {
    this.setState({ loading: true })
    GET(API.getEleAccountList, {
      startDate,
      endDate,
      page,
    }).then(data => {
      if (data.status === 200) {
        // console.log(data)
        this.hasState && this.setState({
          data: data.data,
          accountSum: data.account_sum,
          monthAccountSum: data.month_account_sum,
          weekAccountSum: data.week_account_sum,
          dayAccountSum: data.day_account_sum,
          loading: false,
          pageSize: data.pagination.per_page,
          total: data.pagination.total,
          current: data.pagination.current_page
        })
      }
    })
  }
  render () {
    const columns = [{
      title: '用户名',
      dataIndex: 'name'
    }, {
      title: '电子账户状态',
      dataIndex: 'account_status'
    }, {
      title: '是否有交易',
      dataIndex: 'has_record'
    }, {
      title: '申请时间',
      dataIndex: 'created_at'
    }]
    const {accountSum, monthAccountSum, weekAccountSum, dayAccountSum} = this.state
    return (
      <div className="m-loadprod">
        <div className="page-head">
          <h3>新增二类户查询</h3>
        </div>
        <div className="page-content">
          <Row className='info'>
            <Col span="6">
              <span>累计申请人数：{accountSum}人</span>
            </Col>
            <Col span="6">
              <span>本月申请人数：{monthAccountSum}人</span>
            </Col>
            <Col span="6">
              <span>最近7天申请人数：{weekAccountSum}人</span>
            </Col>
            <Col span="6">
              <span>当天申请人数：{dayAccountSum}人</span>
            </Col>
          </Row>
          <Table
            title={() => (
              <div className="u-table-title">
                <span>二类户列表</span>
                <SearchForm
                  onSubmit={this.search}
                  catagory={[
                    { key: 'date', type: 'timeRange', label: '申请时间' },
                  ]}
                />
              </div>
            )}
            rowKey={record => record.account_id}
            columns={columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            bordered={true}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              current: this.state.current,
              onChange: (page, pageSize) => {
                this.getEleAccountList(page)
              }
            }}
          />
        </div>
      </div>
    )
  }
}
export default EleAccount
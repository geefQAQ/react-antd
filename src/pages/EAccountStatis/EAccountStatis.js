import React from 'react'
import { Table, Icon, Button, Input, Form, Popconfirm, message, Row, Col, Modal } from 'antd'
import { SearchForm } from '@/components'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { setStore, hideTel, loadStore } from '@/utils/util'

import './EAccountStatis.less'

export default class EAccountStatis extends React.Component {
  state = {
    data: [],
    loading: false,
    pageSize: 10,
    total: 0,
    current: 1,
    channel: '',
    zzbTotal: 0,
    zzbValid: 0,
    zybTotal: 0,
    zybValid: 0
  }
  hasState = true
  componentDidMount() {
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
  }
  
  componentWillMount () {
    this.getStatis()
  }

  getStatis (page) {
    this.setState({ loading: true })
    GET(API.getEAccountStatis, {
      channel: this.state.channel,
      page
    }).then(data => {
      // console.log(data)
      this.hasState && this.setState({
        data: data.data,
        loading: false,
        total: data.pagination.total,
        pageSize: data.pagination.per_page,
        current: data.pagination.current,
        zzbTotal: data.zzb_account_sum,
        zzbValid: data.zzb_account_effective,
        zybTotal: data.zyb_account_sum,
        zybValid: data.zyb_account_effective
      })
    }).catch(() => {
      this.hasState && this.setState({ loading: false })
    })
  }

  search (values) {
    // console.log(values)
    this.setState({ channel: values.channel }, () => {
      this.getStatis()
    })
  }

  render () {
    const columns = [{
      title: '手机号',
      dataIndex: 'name',
      render: text => hideTel(text)
    }, {
      title: '注册时间',
      dataIndex: 'created_at'
    }, {
      title: '注册渠道',
      dataIndex: 'channel'
    }, {
      title: '是否实名',
      dataIndex: 'realname_status'
    }, {
      title: '郑州银行账号状态',
      key: 'zzb',
      render: (text, record) => <div>
        <span>{record.has_zzb_account} </span>/
        <span> {record.has_zzb_record}</span>
      </div>
    }, {
      title: '中原银行账号状态',
      key: 'zyb',
      render: (text, record) => <div>
        <span>{record.has_zyb_account} </span>/
        <span> {record.has_zyb_record}</span>
      </div>
    }]

    return (
      <div className="m-eastatis">
        <div className="page-head">
          <h3>渠道数据统计</h3>
        </div>
        <div className="page-content">
          <Table
            title={() => (
              <div className="u-table-title">
                <Row gutter={16} className="u-table-title--text">
                  <Col span={12}>中原银行(有效数/总数)：<strong>{this.state.zybValid}</strong> / <strong>{this.state.zybTotal}</strong></Col>
                  <Col span={12}>郑州银行(有效数/总数)：<strong>{this.state.zzbValid}</strong> / <strong>{this.state.zzbTotal}</strong></Col>
                </Row>
                <SearchForm
                  onSubmit={this.search.bind(this)}
                  catagory={[
                    { key: 'channel', type: 'input', label: '渠道号' }
                  ]}
                />
              </div>
            )}
            size={'small'}
            rowKey={record => record.name}
            columns={columns}
            dataSource={this.state.data}
            bordered={true}
            loading={this.state.loading}
            pagination={{
              pageSize: this.state.pageSize,
              total: this.state.total,
              current: this.state.current,
              onChange: (page, pageSize) => {
                this.getStatis(page)
              }
            }}
          />
        </div>
      </div>
    )
  }

  componentWillUnmount () {
    this.hasState = false
  }
}

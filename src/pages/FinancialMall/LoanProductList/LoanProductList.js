import React from 'react'
import { Table, Icon, Button, Input, Form, Popconfirm, message, Row, Col, Cascader, Modal } from 'antd'
import { SearchForm } from '@/components'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { setStore, loadStore } from '@/utils/util'
import './LoanProductList.less'

class LoanProductList extends React.Component {
  state = {
    data: [],
    loading: false,
    total: 0,
    areas:[],
    current: 1,
    pageSize: 10
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
    this.getData()
  }

  getData (page, startDate, endDate, status, area) {
    this.setState({ loading: true })
    
    GET(API.getLoadList, {
      page,
      startDate,
      endDate,
      status,
      area
    })
      .then(data => {
        this.hasState && this.setState({
          data: data.data,
          areas: data.areas,
          loading: false,
          total: data.total,
          current: data.current_page,
          pageSize: data.per_page
        })
      })
      .catch(e => {
        // console.log(e.message)
        this.hasState && this.setState({ loading: false })
      })
  }

  check (record) {
    // console.log(record)
    const { history } = this.props
    history.push(`/loan/check/${record.product_id}`)
  }

  unshelve (record) {
    // console.log(record)
    let status = ''
    switch (record.status) {
      case 'draft':
      case 'pending':
      case 'unpublish':
        status = 'publish'
        break
      case 'publish':
        status = 'unpublish'
        break
      default:
        message.error('无法操作！')
    }

    POST(API.loanStatus, {
      product_id: record.product_id,
      status
    }).then(data => {
      if (data.status === 200) {
        this.getData()
        message.success(data.message)
      }
    })
  }

  // toFormField (record) {
  //   console.log('传入编辑附加信息页面的信息-------->', record)
  //   const { history, location } = this.props
  //   history.push({
  //     pathname: `/loan/formgroup/${record.product_id}`,
  //     state: { ...record, fromRoute: location.pathname }
  //   })
  // }

  renderStatus = status => {
    switch (status) {
      case 'draft':
      case 'pending':
      case 'unpublish':
        return '上架'
      case 'publish':
        return '下架'
      default: return ''
    }
  }

  search = ({ date = {}, status, area}) => {
    if(status === '全部'){
      status = 'all'
    }
    this.getData(1, date[0], date[1],status, area)
  }
  render () {
    const columns = [{
      title: '产品名称',
      dataIndex: 'name'
    }, {
      title: '月利率',
      dataIndex: 'month_yield'
    }, {
      title: '贷款金额',
      dataIndex: 'money'
    }, {
      title: '产品类型',
      dataIndex: 'c_name'
    }, {
      title: '产品状态',
      dataIndex: 'status',
      render: text => {
        switch (text) {
          case 'publish': return '已发布'
          case 'draft': return '草稿'
          case 'pending': return '待确定信息'
          case 'deleted': return '已删除'
          case 'unpublish': return '已下架'
          default: return ''
        }
      }
    }, {
      title: '操作',
      key: 'opt',
      render: (text, record) => (
        <div>
          <a onClick={() => { this.check(record) }}>查看</a> |
          <a onClick={() => { this.unshelve(record) }}>{this.renderStatus(record.status)}</a> |
        </div>
      )
    }]
    return (
      <div className="m-loadprod">
        <div className="page-head">
          <h3>贷款产品列表</h3>
        </div>
        <div className="page-content">
          <Table
            title={() => (
              <div className="u-table-title">
                <span>贷款产品</span>

                {/* <span>地址:<Cascader options={addressData} placeholder="请选择区域" /></span> */}
                <SearchForm
                  onSubmit={this.search}
                  catagory={[
                    {key:'area',type:'cascader',label:'地址',areas:this.state.areas},
                    { key: 'date', type: 'timeRange', label: '产品添加时间' },
                    {
                      key: 'status',
                      type: 'select',
                      label: '产品状态',
                      initialValue: '全部',
                      options: [
                        { value: 'all', text: '全部' },
                        { value: 'publish', text: '已发布' },
                        { value: 'draft', text: '草稿' },
                        { value: 'pending', text: '待确定信息' },
                        { value: 'deleted', text: '已删除' },
                        { value: 'unpublish', text: '已下架' },
                      ] }
                  ]}
                />
              </div>
            )}
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
                this.getData(page)
              }
            }}
          />
        </div>
      </div>
    )
  }

  componentWillUnount () {
    this.hasState = false
    // console.log('componentWillUnount')
  }
}

export default LoanProductList

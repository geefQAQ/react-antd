import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover, Card, Tree } from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore } from '@/utils/util'

import './LoanProductCheck.less'

//  @desc 贷款产品信息查看页

const TreeNode = Tree.TreeNode
class LoanProductCheck extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showBackBtn: props.match.params.id,
      loading: false,
      prodStatus: '',
      name: '',
      catagory: '',
      bank: '',
      minLoanAmount: '',
      maxLoanAmount: '',
      minLoanLimits: '',
      maxLoanLimits: '',
      minRate: '',
      maxRate: '',
      repayMethod: '',
      imgs: [],
      imgPath: '',
      contents: [],
      treeData: []
    }
  }
  componentDidMount(){
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
  handleBack = () => {
    const { history } = this.props
    history.push('/loan/prodlist')
  }
  //  跳转产品基本信息编辑页
  edit () {
    const { match, history } = this.props
    const id = match.params.id
    history.push(`/loan/form/${id}`)
  }
  //  跳转新增字段信息编辑页
  editAdd () {
    // console.log(record)
    const { history, location, match } = this.props
    const id = match.params.id
    history.push({
      pathname: `/loan/formgroup/${id}`,
      state: { fromRoute: location.pathname }
    })
  }
  //  贷款信息API查询
  loadFormData = id => {
    //  贷款分类
    const loanCatagory = {
      1: '普惠授信',
      2: '无抵押贷款',
      3: '无抵押无担保',
      4: '房产抵押贷款',
      5: '车辆抵押贷款',
      6: '纯信用',
      7: '其他'
    }
    //  是否上架、产品状态
    const publishStatus = {
      'draft': '否',
      'pending': '否',
      'unpublish': '否',
      'publish': '是'
    }
    //  还款方式
    const repaymentMethod = {
      '1': '等额本金',
      '2': '等额本息',
      '3': '按月付息到期到期还本',
      '4': '其他'
    }
    this.setState({ loading: true })
    POST(API.editLoanInfo, {
      id
    }).then(data => {
      if (data.status === 200) {
        let result = data.data
        console.log('check page result------->', result)
        this.setState({
          prodStatus: publishStatus[result.status],
          name: result.name,
          catagory: loanCatagory[result.c_id],
          bank: result.bank_code,
          minLoanAmount: result.minimum_money || 0,
          maxLoanAmount: result.highest_money || 0,
          minLoanLimits: result.minimum_time_limit || 0,
          maxLoanLimits: result.highest_time_limit || 0,
          minRate: result.minimum_month_yield,
          maxRate: result.highest_month_yield,
          repayMethod: repaymentMethod[result.repayment_method],
          imgPath: result.icon ? result.icon : '',
          imgs: result.icon ? [{
            uid: -1,
            status: 'done',
            name: result.icon,
            thumbUrl: `${window.baseUrl}/${result.icon}`,
            url: `${window.baseUrl}/${result.icon}`
          }] : [],
          contents: result.detail
        })
      }
    }).catch(e => {
      e.message !== 'out route' && this.setState({ loading: false })
    })
  }
  // 加载关系树
  loadData = (id) => {
    GET('/api/product/form/product', {
      product_id: id
    }).then(data => {
      console.log('关系树数据查询-------->', data)
      this.setState({treeData: data})
    })
  }
  componentWillMount () {
    const { match, history } = this.props
    const id = match.params.id

    if (id) {
      this.loadFormData(id)
      this.loadData(id)
    }
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.fields && item.fields.length > 0) {
        console.log('children=======>')
        return (
          <TreeNode title={item.group_name} key={item.field_group_id}>
            {
              item.values && item.values.length > 0
                ? item.values.map(v => {
                  return <TreeNode title={v.group_name} key={item.field_group_id}>

                  </TreeNode>
                })
                : null
            }
          </TreeNode>
        )
      }
      console.log('no children=======>', item, item.fields)
      return <TreeNode title={item.group_name} key={item.field_group_id}/>
    })
  }
  render () {
    console.log('check page result------>', this.state.treeData)
    return (
      <div>
        <div className="page-head">
          {this.state.showBackBtn && <Button type="primary" size="small" icon="left" onClick={this.handleBack}>返回</Button>}
          <h3>查看贷款产品
          </h3>
        </div>
        <div className="page-content">
          {/* 产品基本信息展示 */}
          <Card title="产品基本资料" extra={<a onClick={() => { this.edit() }}>编辑</a>}>
            <Row>
              <Col span={24}><p>产品名称：{this.state.name}</p></Col>
            </Row>
            <Row>
              <Col span={12}><p>分类：{this.state.catagory}</p></Col>
              <Col span={12}><p>所属银行：：{this.state.bank}</p></Col>
            </Row>
            <Row>
              <Col span={12}><p>最低贷款金额：{this.state.minLoanAmount}</p></Col>
              <Col span={12}><p>最高贷款金额：{this.state.maxLoanAmount}</p></Col>
            </Row>
            <Row>
              <Col span={12}><p>最低贷款期限：{this.state.minLoanLimits}</p></Col>
              <Col span={12}><p>最高贷款期限：{this.state.maxLoanLimits}</p></Col>
            </Row>
            <Row>
              <Col span={12}><p>最低月利率：{this.state.minRate}%</p></Col>
              <Col span={12}><p>最高月利率：{this.state.maxRate}%</p></Col>
            </Row>
            <Row>
              <Col span={12}><p>还款方式：{this.state.repayMethod}</p></Col>
              <Col span={12}><p>是否上架：{this.state.prodStatus}</p></Col>
            </Row>
            <p>产品图片：
              {
                this.state.imgPath
                  ? <img alt="产品图片" src={window.baseUrl + '/' + this.state.imgPath} />
                  : '无'
              }
            </p>
            { this.state.contents.length > 0
              ? this.state.contents.map(item => {
                return <p key={item.key}>{item.key} ： <div dangerouslySetInnerHTML={{ __html: item.value }}/></p>
              })
              : null
            }
          </Card>
          {/* 自定义字段展示 */}
          {
            this.state.treeData && this.state.treeData.length > 0
              ? <Card title="自定义字段" extra={<a onClick={() => { this.editAdd() }}>编辑</a>}>
                <div>
                  {this.state.treeData.length > 0 && <Tree>
                    {this.state.treeData
                      .sort((a, b) => a.order - b.order || a.field_group_id - b.field_group_id)
                      .map(group => (
                        <TreeNode
                          key={group.field_group_id}
                          title={group.group_name || '-'}
                        >
                          {
                            group.fields &&
                            group.fields.length > 0 &&
                            group.fields
                              .sort((a, b) => a.order - b.order || a.id - b.id)
                              .map(field => (
                                <TreeNode
                                  key={`${group.field_group_id}-${field.id}`}
                                  title={field.label || '-'}
                                >
                                  {
                                    field.values &&
                                    field.values.length > 0 &&
                                    field.values
                                      .sort((a, b) => a.order - b.order || a.value_id - b.value_id)
                                      .map(v => (
                                        <TreeNode
                                          key={`${group.field_group_id}-${field.id}-${v.value_id}`}
                                          title={v.key || '-'}
                                        >
                                          {
                                            v.child &&
                                            v.child.length > 0 &&
                                            v.child
                                              .sort((a, b) => a.order - b.order || a.field_group_id - b.field_group_id)
                                              .map(child => (
                                                <TreeNode
                                                  key={`${group.field_group_id}-${field.id}-${v.value_id}-${child.field_group_id}`}
                                                  title={child.group_name || '-'}
                                                >
                                                  {
                                                    child.fields &&
                                                    child.fields.length > 0 &&
                                                    child.fields
                                                      .sort((a, b) => a.order - b.order || a.id - b.id)
                                                      .map(valueField => (
                                                        <TreeNode
                                                          key={`${group.field_group_id}-${field.id}-${v.value_id}-${child.field_group_id}-${valueField.id}`}
                                                          title={valueField.label || '-'}
                                                        />
                                                      ))}
                                                </TreeNode>
                                              ))}
                                        </TreeNode>
                                      ))}
                                </TreeNode>
                              ))}
                        </TreeNode>
                      ))}
                  </Tree>}
                </div>
              </Card>
              : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({ app })

export default connect(mapStateToProps)(LoanProductCheck)

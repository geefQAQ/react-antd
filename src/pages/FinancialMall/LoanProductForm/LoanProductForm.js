import React from 'react'
import { connect } from 'react-redux'
import { Table, Icon, Button, Input, InputNumber, Form, Modal, Select, Switch, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { loadStore } from '@/utils/util'

import './LoanProductForm.less'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
}
const formItemInnerLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 }
  }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 18, offset: 6 }
  }
}

let contentId = 0
class FormField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabledForm: false,
      loading: false,
      prodStatus: true,
      institutions:'',
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
      selectOptions: [],
      bankOptions: [{
        text: '郑州银行',
        value: 'ZZB'
      }, {
        text: '中原银行',
        value: 'ZYB'
      }],
      repayMethodOptions: []
    }
    this.hasState = true
  }

  loadSelectOptions = () => {
    GET(API.loanFormSelectOptions)
      .then(data => {
        // console.log(data)
        if (data.status === 200) {
          this.hasState && this.setState({
            selectOptions: data.loans_category,
            repayMethodOptions: data.repayment_method
          })
        }
      })
  }

  loadFormData = id => {
    this.props.form.resetFields()
    this.setState({ loading: true })
    POST(API.editLoanInfo, {
      id
    }).then(data => {
      console.log(data)
      if (data.status === 200) {
        let result = data.data
        this.hasState && this.setState({
          loading: false,
          prodStatus: this.handleStatus(result.status),
          name: result.name,
          catagory: result.c_id + '',
          bank: result.bank_code,
          minLoanAmount: result.minimum_money || 0,
          maxLoanAmount: result.highest_money || 0,
          minLoanLimits: result.minimum_time_limit || 0,
          maxLoanLimits: result.highest_time_limit || 0,
          minRate: result.minimum_month_yield,
          maxRate: result.highest_month_yield,
          repayMethod: result.repayment_method,
          imgPath: result.icon,
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

  handleStatus = status => {
    switch (status) {
      case 'draft':
      case 'pending':
      case 'unpublish':
        return false
      case 'publish':
        return true
      default: return true
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
  componentWillMount () {
    this.loadSelectOptions()
    //获取用户信息api请求
      GET(API.getUserInfo).then(
        data => {
          console.log('获取当前用户信息api---->',data)
          if (data.status === 200) {
            // if(data.institutions ==='UNKNOW'){
            //   alert('您当前所属银行信息未确定，无法操作')
            //   return
            // }
            this.setState({
              institutions:data.institutions,
            })
            
          }
        }
      )

    const { match, history } = this.props
    const id = match.params.id

    if (id) {
      this.loadFormData(id)
    }
  }

  componentWillUmount () {
    this.hasState = false
  }

  addForm = values => {
    console.log('add form...')
    POST(API.createLoansProduct, {
      name: values.name,
      status: values.prodStatus ? 'publish' : 'unpublish',
      icon: this.state.imgPath,
      bank_code: values.bank,
      minimum_month_yield: values.minRate,
      highest_month_yield: values.maxRate,
      minimum_money: values.minLoanAmount,
      highest_money: values.maxLoanAmount,
      c_id: values.catagory, // 分类id
      minimum_time_limit: values.minLoanLimits,
      highest_time_limit: values.maxLoanLimits,
      repayment_method: values.repayMethod, // 还款方式id
      detail: JSON.stringify(values.contents)
    }).then(data => {
      console.log(data)
      if (data.status === 200) {
        message.success(data.message)
        this.props.history.push({
          pathname: `/loan/formgroup/${data.product_id}`,
          state: { name: values.name }
        })
      }
    })
  }

  editForm = (values, id) => {
    POST(`${API.loansProduct}/${id}/edit`, {
      name: values.name,
      status: values.prodStatus ? 'publish' : 'unpublish',
      icon: this.state.imgPath,
      bank_code: values.bank,
      minimum_month_yield: values.minRate,
      highest_month_yield: values.maxRate,
      minimum_money: values.minLoanAmount,
      highest_money: values.maxLoanAmount,
      c_id: values.catagory, // 分类id
      minimum_time_limit: values.minLoanLimits,
      highest_time_limit: values.maxLoanLimits,
      repayment_method: values.repayMethod, // 还款方式id
      detail: JSON.stringify(values.contents)
    }).then(data => {
      console.log(data)
      if (data.status === 200) {
        message.success(data.message)
        this.props.history.goBack()
      }
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const { form, match } = this.props
    const { id } = match.params
    console.log(id)
    form.validateFields((err, fieldValue) => {
      if (!err) {
        if (fieldValue.contents) {
          fieldValue.contents = fieldValue.contents.filter(_ => !!_)
        }
        if (id) {
          // 存在 id ，则视为编辑模式
          this.editForm(fieldValue, id)
        } else {
          // 否则视为添加模式
          this.addForm(fieldValue)
        }
        // console.log(fieldValue.contents && fieldValue.contents.filter(_ => !!_))
        // history.push('/loancomponent', { name: fieldValue.name })
      }
    })
  }

  addConfig = () => {
    const { form } = this.props
    const contentkeys = form.getFieldValue('contentkeys')
    const len = this.state.contents.length
    if (len > 0 && contentId < len) {
      contentId = len
    }
    const nextContentKeys = contentkeys.concat(contentId)
    contentId++
    form.setFieldsValue({ contentkeys: nextContentKeys })
  }

  removeConfig = k => {
    const { form } = this.props
    const contentkeys = form.getFieldValue('contentkeys')
    form.setFieldsValue({ contentkeys: contentkeys.filter(key => key !== k) })
  }

  render () {
    const { form, match } = this.props
    const { getFieldDecorator } = form
    const { contents, loading, disabledForm, institutions } = this.state
    // 页面内容
    const defaultcontentKeys = contents.map((_, i) => i)
    getFieldDecorator('contentkeys', { initialValue: defaultcontentKeys })
    const contentkeys = form.getFieldValue('contentkeys')
    return (
      <Form onSubmit={this.onSubmit} layout="inline">
        <div className="right-reload-spin">
          {match.params.id && <Icon type="reload" spin={loading} className="right-reload-spin-icon" onClick={() => { this.loadFormData(match.params.id) }} />}
        </div>
        <Row className="m-loanform" gutter={2}>
          <Col span={24}>
            <FormItem
              label="产品名称"
              labelCol={{ xs: 24, sm: 3 }}
              wrapperCol={{ xs: 24, sm: 21 }}
            >
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '产品名称不能为空！' }],
                initialValue: this.state.name
              })(<Input autoComplete={'name'} disabled={disabledForm}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="分类">
              {getFieldDecorator('catagory', {
                rules: [{ required: true, message: '请选择分类！' }],
                initialValue: this.state.catagory
              })(<Select
                disabled={disabledForm}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.state.selectOptions.map(o => <Option key={o.id} id={o.id}>{o.name || o.id}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="所属银行">
              {getFieldDecorator('bank', {
                rules: [{ required: true, message: '所属银行不能为空！' }],
                initialValue: institutions !== 'ADMIN' ? institutions : this.state.bank ? this.state.bank :''
              })(<Input disabled={institutions === 'ADMIN' ? false : true}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="最低贷款金额">
              {getFieldDecorator('minLoanAmount', {
                rules: [{ required: true, message: '最低贷款金额不能为空！' }],
                initialValue: this.state.minLoanAmount
              })(<InputNumber min={0} disabled={disabledForm} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="最高贷款金额">
              {getFieldDecorator('maxLoanAmount', {
                rules: [{ required: true, message: '最高贷款金额不能为空！' }],
                initialValue: this.state.maxLoanAmount
              })(<InputNumber min={0} disabled={disabledForm} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="最低贷款期限">
              {getFieldDecorator('minLoanLimits', {
                rules: [{ required: true, message: '最低贷款期限不能为空！' }],
                initialValue: this.state.minLoanLimits
              })(<InputNumber min={0} disabled={disabledForm} formatter={value => `${value}月`} parser={value => value.replace('月', '')}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="最高贷款期限">
              {getFieldDecorator('maxLoanLimits', {
                rules: [{ required: true, message: '最高贷款期限不能为空！' }],
                initialValue: this.state.maxLoanLimits
              })(<InputNumber min={0} disabled={disabledForm} formatter={value => `${value}月`} parser={value => value.replace('月', '')}/>)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="最低月利率"
              {...formItemLayout}
            >
              {getFieldDecorator('minRate', {
                rules: [{ required: true, message: '最低月利率不能为空！' }],
                initialValue: this.state.minRate
              })(<InputNumber disabled={disabledForm} step={0.01} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem
              label="最高月利率"
              {...formItemLayout}
            >
              {getFieldDecorator('maxRate', {
                rules: [{ required: true, message: '最高月利率不能为空！' }],
                initialValue: this.state.maxRate
              })(<InputNumber disabled={disabledForm} step={0.01} formatter={value => `${value}%`} parser={value => value.replace('%', '')} />)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="还款方式"
              labelCol={{ xs: 24, sm: 3 }}
              wrapperCol={{ xs: 24, sm: 9 }}
            >
              {getFieldDecorator('repayMethod', {
                rules: [{ required: true, message: '还款方式不能为空！' }],
                initialValue: this.state.repayMethod
              })(<Select
                disabled={disabledForm}
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >
                {this.state.repayMethodOptions.map(o => <Option key={o.value} value={o.value}>{o.name || o.value}</Option>)}
              </Select>)}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="是否上架"
              labelCol={{ xs: 24, sm: 3 }}
              wrapperCol={{ xs: 24, sm: 9 }}
            >
              {getFieldDecorator('prodStatus', {
                rules: [{ required: true }],
                valuePropName: 'checked',
                initialValue: this.state.prodStatus
              })(
                <Switch
                  checkedChildren="上架"
                  unCheckedChildren="下架"
                  disabled={this.state.disabledForm}
                />
              )}
            </FormItem>
          </Col>
          <Col span={24}>
            <FormItem
              label="产品图片"
              labelCol={{ xs: 24, sm: 3 }}
              wrapperCol={{ xs: 24, sm: 9 }}
            >
              {getFieldDecorator('imgs', {})(<Upload
                disabled={disabledForm}
                action={`${window.baseUrl}/api/content/upload`}
                headers={{ Authorization: loadStore('token') }}
                listType={'picture-card'}
                fileList={this.state.imgs}
                onSuccess={data => {
                  // console.log(data)
                  message.success(String(data.message))
                  this.setState({
                    imgPath: data.data.path,
                    imgs: [{
                      uid: -999,
                      status: 'done',
                      name: data.data.path,
                      thumbUrl: `${window.baseUrl}/${data.data.path}`,
                      url: `${window.baseUrl}/${data.data.path}`
                    }]
                  })
                }}
                onRemove={data => {
                  this.setState({ imgPath: '', imgs: [] })
                }}
              ><Icon type="upload" />上传图片</Upload>)}
            </FormItem>
          </Col>
          <Col span={3}>
            <div className="m-form-label">信息内容：</div>
          </Col>
          <Col span={21}>
            {contentkeys.map((k, index) => (
              <Row gutter={2} key={k} style={{ marginTop: '10px' }}>
                <Col span={20}>
                  <FormItem label={'名称'} {...formItemInnerLayout}>
                    {getFieldDecorator(`contents[${k}][key]`, {
                      whitespace: true,
                      rules: [{ required: true, message: '添加的信息名称不能为空！' }],
                      initialValue: this.state.contents.length > 0 && this.state.contents[k] !== undefined ? this.state.contents[k]['key'] : ''
                    })(<Input disabled={disabledForm} autoComplete={'config-key'} />)}
                  </FormItem>
                  <FormItem label={'内容'} {...formItemInnerLayout}>
                    {getFieldDecorator(`contents[${k}][value]`, {
                      whitespace: true,
                      rules: [{ required: true, message: '添加的信息内容不能为空！' }],
                      initialValue: this.state.contents.length > 0 && this.state.contents[k] !== undefined ? this.state.contents[k]['value'] : ''
                    })(<TextArea disabled={disabledForm} rows={4} />)}
                  </FormItem>
                </Col>
                {!disabledForm && <Col span={4} className="dynamic-delete-button" onClick={() => this.removeConfig(k)}>
                  <Icon type="minus-circle-o" />
                  <span> 删除项</span>
                </Col>}
              </Row>
            ))}
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button disabled={disabledForm} type="dashed" onClick={this.addConfig} style={{ width: '60%' }}>
                    <Icon type="plus" />添加信息项
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span={24} style={{ marginTop: '30px', textAlign: 'center' }}>
            <FormItem>
              <Button type="primary" htmlType="submit">
                {match.params.id ? '更新' : '下一步'}
              </Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}

const FormFieldComponent = Form.create()(FormField)

class LoanProductForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showBackBtn: props.match.params.id
    }
  }

  handleBack = () => {
    this.props.history.goBack()
  }

  render () {
    return (
      <div>
        <div className="page-head">
          {this.state.showBackBtn && <Button type="primary" size="small" icon="left" onClick={this.handleBack}>返回</Button>}
          <h3>
            {this.state.showBackBtn ? '编辑贷款产品' : '添加贷款产品'}
          </h3>
        </div>
        <div className="page-content">
          <FormFieldComponent {...this.props} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({ app })

export default connect(mapStateToProps)(LoanProductForm)

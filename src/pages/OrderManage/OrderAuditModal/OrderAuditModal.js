import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Form, Modal, Button, Radio, Select, Icon, Switch } from 'antd'
import icons from '@/utils/icons'
import './OrderAuditModal.less'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 }
  }
}
class OrderAuditModal extends React.Component {
  state = {
    showTip:false
  }
  statusConfig = {
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
  // componentDidMount () {
  //   this.showTip(this.props.orderStatus)
  // }
  showTip = value => {
    // console.log('showTip----value----->',value)
    if(value === 'indeterminate'){
      this.setState({
        showTip: true
      })
      return
    }
    this.setState({
      showTip: false
    })
  }
  render () {
    const { visible, onCancel, onCreate, form, statusList, orderStatus, remarkText, repayMethodOptions, prompt_msg, alow_info } = this.props
    const { getFieldDecorator } = form
    let list = statusList.filter(item => orderStatus === 'unaudited' ? item.key !== orderStatus : (item.key !== orderStatus && item.key !== 'unaudited'))
    let statusText = this.statusConfig[orderStatus]
    // console.log('当前订单状态---------->',alow_info)
    return (
      <Modal
        visible={visible}
        title={'订单操作'}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form>
          {
            orderStatus && orderStatus !== 'indeterminate'
            ? <FormItem label="状态变更" {...formItemLayout}>
                {getFieldDecorator('orderStatus', {
                  rules: [{ required: true, message: '请选择状态！' }]
                })(
                  <Select
                    showSearch
                    onChange={this.showTip}
                    placeholder={statusText ? `当前订单状态：${statusText}` : ''}
                  >
                    {list.length > 0 && list.map(s => <Option key={s.key} value={s.key}>{s.value}</Option>)}
                  </Select>
                )}
              </FormItem>
            : null
          }
          
          {
            this.state.showTip || orderStatus === 'indeterminate'
            ? <p>{prompt_msg}</p>
            : null
          }
          {
            orderStatus && orderStatus ==='checked' || orderStatus && orderStatus ==='indeterminate'
            ? <div>
              <FormItem
                label="授信金额"
                {...formItemLayout}
              >
                {getFieldDecorator('allow_amount', {
                  rules: [{ required: true, message: '授信金额不能为空！' }],
                  initialValue: orderStatus && orderStatus ==='indeterminate' ? alow_info.allow_amount : ''
                })(<Input disabled={orderStatus && orderStatus ==='indeterminate' ? true : false}/>)}
              </FormItem>
              <FormItem
                label="授信期限"
                {...formItemLayout}
              >
                {getFieldDecorator('allow_day', {
                  rules: [{ required: true, message: '授信期限不能为空！' }],
                  initialValue: (orderStatus && orderStatus ==='indeterminate' ? alow_info.allow_day : 1)
                })(<InputNumber min={0} formatter={value => `${value}个月`} parser={value => value.replace('个月', '')} disabled={orderStatus && orderStatus ==='indeterminate' ? true : false}/>)}
              </FormItem>
              <FormItem
                label="还款方式"
                {...formItemLayout}
              >
                {getFieldDecorator('allow_repayment_method', {
                  rules: [{ required: true, message: '还款方式不能为空！' }],
                  initialValue: orderStatus && orderStatus ==='indeterminate' ? alow_info.allow_repayment_method : ''
                })(<Input disabled={orderStatus && orderStatus ==='indeterminate' ? true : false}/>)}
              </FormItem>
            </div>
            : null
          }
          {/* <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remarkText', {})(
              <TextArea placeholder={remarkText ? `当前审核备注：${remarkText}` : ''} rows={3} />
            )}
          </FormItem> */}
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(OrderAuditModal)

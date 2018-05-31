import React from 'react'
import PropTypes from 'prop-types'
import { Form, Button, Input, DatePicker, Select, Cascader } from 'antd'
import moment from 'moment'
import { GET, POST } from '@/utils/service'
import { API } from '@/utils/config'
import { isEmptyObj } from '@/utils/util'

import './SearchForm.less'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker


class FormBody extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    style: PropTypes.object,
    className: PropTypes.string,
    // type: PropTypes.arrayOf(PropTypes.oneOf(['input', 'date', 'dateRange', 'time', 'timeRange', 'select'])),
    catagory: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['input', 'date', 'dateRange', 'time', 'timeRange', 'select', 'cascader']).isRequired,
      label: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]).isRequired,
        text: PropTypes.string
      })),
      onChange: PropTypes.func,
      onOk: PropTypes.func
    })),
    options: PropTypes.object,
    onSubmit: PropTypes.func
  }


  static defaultProps = {
    catagory: [{
      key: 'value',
      type: 'input',
      label: ''
    }]
  }

  handleSubmit (e) {
    e.preventDefault()
    const { form, onSubmit, catagory } = this.props
    form.validateFields((err, fieldsValue) => {
      if (!err) {
        let values = {}
        catagory.map(item => {
          switch (item.type) {
            case 'input':
              values[item.key] = fieldsValue[item.key] || ''
              break
            case 'date':
              values[item.key] = fieldsValue[item.key].format('YYYY-MM-DD')
              break
            case 'dateRange':
              values[item.key] = fieldsValue[item.key]['length'] > 0 ? [fieldsValue[item.key][0].format('YYYY-MM-DD'), fieldsValue[item.key][1].format('YYYY-MM-DD')] : []
              break
            case 'time':
              values[item.key] = fieldsValue[item.key].format('YYYY-MM-DD HH:mm:ss')
              break
            case 'timeRange':
              values[item.key] = fieldsValue[item.key]['length'] > 0 ? [fieldsValue[item.key][0].format('YYYY-MM-DD HH:mm:ss'), fieldsValue[item.key][1].format('YYYY-MM-DD HH:mm:ss')] : []
              break
            case 'select':
              values[item.key] = fieldsValue[item.key]
              break
            case 'cascader':
              values[item.key] = fieldsValue[item.key] && fieldsValue[item.key]['length'] > 0 ? fieldsValue[item.key] : []
              break
            default:
              values.value = fieldsValue.value
          }
          return item
        })
        // 处理传递区域参数
        values.area ? values.area = values.area.join('-') : null;
        onSubmit(values)
      }
    })
  }

  render () {
    const { form, catagory, options, style, className } = this.props
    const { getFieldDecorator } = form
    const config = isEmptyObj(options) ? {
      initialValue: moment(),
      rules: [{ type: 'object', message: '请选择时间！' }]
    } : options
    const rangeConfig = isEmptyObj(options) ? {
      initialValue: [],
      rules: [{ type: 'array', message: '请选择时间范围！' }]
    } : options
    return (
      <Form layout="inline" onSubmit={this.handleSubmit.bind(this)} style={{ ...style }} className={className}>
        {catagory.map(item => {
          switch (item.type) {
            case 'input':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, options)(<Input />)}
                </FormItem>
              )
            case 'date':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, config)(<DatePicker onOk={item.onOk} onChange={item.onChange} />)}
                </FormItem>
              )
            case 'dateRange':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, rangeConfig)(<RangePicker placeholder={['开始日期', '结束日期']} onOk={item.onOk} onChange={item.onChange} />)}
                </FormItem>
              )
            case 'time':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, config)(<DatePicker onOk={item.onOk} onChange={item.onChange} showTime format="YYYY-MM-DD HH:mm:ss" />)}
                </FormItem>
              )
            case 'timeRange':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, rangeConfig)(<RangePicker placeholder={['开始时间', '结束时间']} onOk={item.onOk} onChange={item.onChange} showTime format="YYYY-MM-DD HH:mm:ss" />)}
                </FormItem>
              )
            case 'select':
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator(item.key, {
                    initialValue: item.initialValue,
                    ...options
                  })(<Select
                    style={{ minWidth: 80 }}
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                  >
                    {item.options && item.options.map(o => <Option key={o.value} value={o.value}>{o.text || o.value}</Option>)}
                  </Select>)}
                </FormItem>
              )
              case 'cascader':
                return (
                  <FormItem key={item.key} label={item.label}>
                    {getFieldDecorator(item.key)(<Cascader changeOnSelect placeholder={'请选择区域'} options={catagory[0].areas} onChange={item.onChange} />)}
                </FormItem>
                )
            default:
              return (
                <FormItem key={item.key} label={item.label}>
                  {getFieldDecorator('value', {})(<Input />)}
                </FormItem>
              )
          }
        })}
        <FormItem>
          <Button type="primary" htmlType="submit" icon="search">查询</Button>
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(FormBody)

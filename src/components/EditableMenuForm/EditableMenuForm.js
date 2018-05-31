import React from 'react'
import PropTypes from 'prop-types'
import { Input, InputNumber, Form, Modal, Button, Radio, Select, Icon, Switch } from 'antd'
import icons from '@/utils/icons'
import './EditableMenuForm.less'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

class EditableMenuForm extends React.Component {
  render () {
    const { visible, onCancel, onCreate, form, mainTitle, label, uri, icon, order, isShow } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title={mainTitle}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical" className="menu-edit">
          <FormItem label="菜单名称" className="menu-edit--item">
            {getFieldDecorator('label', {
              rules: [{ required: true, message: '菜单名称不能为空！' }],
              initialValue: label
            })(<Input />)}
          </FormItem>
          <FormItem label="路由地址" className="menu-edit--item">
            {getFieldDecorator('uri', {
              rules: [{ required: true, message: '路由地址不能为空！' }],
              initialValue: uri || '/'
            })(<Input />)}
          </FormItem>
          <FormItem label="图标icon" className="menu-edit--item">
            {getFieldDecorator('icon', {
              rules: [{ required: true, message: '请选择一个图标icon！' }],
              initialValue: icon
            })(
              <Select
                showSearch
              >
                {icons.commonIcons.map(icon => <Option key={icon} value={icon}><Icon type={icon} /> {icon}</Option>)}
              </Select>
            )}
          </FormItem>
          <FormItem label="排序" className="menu-edit--item">
            {getFieldDecorator('order', {
              rules: [{ required: true, message: '路由地址不能为空！' }],
              initialValue: order || 0
            })(<InputNumber min={0} max={999} />)}
          </FormItem>
          <FormItem label="是否显示" className="menu-edit--item">
            {getFieldDecorator('isShow', {
              initialValue: isShow,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

EditableMenuForm.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  mainTitle: PropTypes.string,
  label: PropTypes.string,
  uri: PropTypes.string,
  icon: PropTypes.string,
  order: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default Form.create()(EditableMenuForm)

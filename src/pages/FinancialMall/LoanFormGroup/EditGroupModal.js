import React from 'react'
import PropTypes from 'prop-types'
import { Modal, message, Form, Input, Switch, InputNumber } from 'antd'

const FormItem = Form.Item

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

class EditGroupModal extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    groupName: PropTypes.string,
    isRequired: PropTypes.bool,
    order: PropTypes.number,
    onCreate: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  }

  render () {
    const { form, visible, title, onCreate, onCancel, groupName, isRequired, order } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        visible={visible}
        title={title}
        okText={'确定'}
        cancelText={'取消'}
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form>
          <FormItem label="分组名称" {...formItemLayout}>
            {getFieldDecorator('groupName', {
              rules: [{ required: true, message: '分组名称不能空！' }],
              initialValue: groupName
            })(<Input />)}
          </FormItem>
          <FormItem label="是否必填" {...formItemLayout}>
            {getFieldDecorator('isRequired', {
              initialValue: isRequired,
              valuePropName: 'checked'
            })(
              <Switch checkedChildren="是" unCheckedChildren="否" />
            )}
          </FormItem>
          <FormItem label="排序" {...formItemLayout}>
            {getFieldDecorator('order', {
              initialValue: order
            })(<InputNumber />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(EditGroupModal)

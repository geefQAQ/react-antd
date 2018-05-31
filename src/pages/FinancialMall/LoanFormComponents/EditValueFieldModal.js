import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Icon, Button, Input, InputNumber, Form, Select, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST, PUT } from '@/utils/service'

const FormItem = Form.Item

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

/**
 * 特殊字段下的表格编辑弹出层
 */
class EditValueFieldModal extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    visible: PropTypes.bool.isRequired,
    title: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    onCreate: PropTypes.func,
    onCancel: PropTypes.func
  }

  render () {
    const { form, visible, title, onCreate, onCancel, label, value } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        style={{ marginTop: 100 }}
        width={400}
        visible={visible}
        title={title}
        okText={'确定'}
        cancelText={'取消'}
        onOk={onCreate}
        onCancel={onCancel}
      >
        <Form>
          <FormItem {...formItemLayout} label="字段名">
            {getFieldDecorator('key', {
              rules: [{ required: true, message: '字段名不能为空！' }],
              initialValue: label
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="字段标识">
            {getFieldDecorator('value', {
              rules: [{ required: true, message: '字段标识不能为空！' }],
              initialValue: value
            })(<Input />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(EditValueFieldModal)

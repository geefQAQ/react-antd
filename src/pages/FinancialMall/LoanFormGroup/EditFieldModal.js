import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Table, Select, Row, Col } from 'antd'
import { loadFormData } from './functions'
const Option = Select.Option

class EditFieldModal extends React.Component {
  state = {
    data: [],
    selectedValue: []
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        data: nextProps.data,
        selectedValue: nextProps.selectedKeys
      })
    }
  }

  handleChange = value => {
    this.setState({
      selectedValue: value
    })
  }

  onCreate = () => {
    this.props.onCreate(this.state.selectedValue)
  }

  render () {
    const { visible, title, onCancel, data } = this.props
    return (
      <Modal
        visible={visible}
        title={title}
        okText={'确定'}
        cancelText={'取消'}
        onOk={this.onCreate}
        onCancel={onCancel}
        maskClosable={false}
      >
        <Row>
          <Col span={4}>
            <div style={{ lineHeight: '32px' }}>选择字段：</div>
          </Col>
          <Col span={20}>
            <Select
              mode="tags"
              style={{ width: '100%' }}
              placeholder="选择相应的字段"
              onChange={this.handleChange}
              value={this.state.selectedValue}
            >
              {data.map(item => (
                <Option key={item.id} value={`${item.id}`}>{item.label}</Option>
              ))}
            </Select>
          </Col>
        </Row>
      </Modal>
    )
  }
}

export default EditFieldModal

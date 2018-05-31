import React from 'react'
import { connect } from 'react-redux'
import { Modal, Table, Icon, Button, Input, InputNumber, Form, Select, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST, PUT, DELETE } from '@/utils/service'
import { API } from '@/utils/config'
import formtypes from '@/mock/formcomponents'
import EditValueFieldModal from './EditValueFieldModal'
import { loadTableData } from './functions'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input

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
 * 字段管理编辑弹出层
 */
let countTableList = 1000
class EditLoanFormModal extends React.Component {
  state = {
    confirmLoading: false, // 点击确定按钮时显示加载

    selectType: '', // 当前选择的类型 type，用于判断 radio/list/list_group
    listData: [], // 当类型下有值列表时，表格中的数据
    listTableLoading: false, // 表格是否在加载

    // 弹框编辑字段
    // radio/list/list_group 下需要编辑的值 label/value
    showEditValueField: false,
    editValueType: '',
    selectedEditId: '',
    editValueTitle: '',
    editValueLabel: '',
    editValueValue: ''
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.setState({
        listData: nextProps.tableData,
        selectType: nextProps.type
      })
    }
  }

  refreshTable = () => {
    this.setState({
      listTableLoading: true
    })
    loadTableData(this.state.selectType, this.props.editId, data => {
      if (!data) {
        message.error('加载失败！')
        return
      }
      message.success('加载成功！')
      this.setState({
        listTableLoading: false,
        listData: data
      })
    })
  }

  addValueField = () => {
    this.setState({
      showEditValueField: true,
      editValueType: 'add',
      selectedEditId: '',
      editValueTitle: '添加字段',
      editValueLabel: '',
      editValueValue: ''
    })
  }

  editValueField = record => {
    // console.log(record)
    this.setState({
      showEditValueField: true,
      editValueType: 'edit',
      selectedEditId: record.value_id,
      editValueTitle: '编辑字段',
      editValueLabel: record.key,
      editValueValue: record.value
    })
  }

  createValueField = () => {
    const { editId } = this.props
    const { listData, editValueType, selectedEditId } = this.state
    const form = this.editValueFieldModal
    form.validateFields((err, values) => {
      if (!err) {
        // console.log(values, editId)

        // 新建表单
        if (editId === '') {
          if (editValueType === 'add') {
            this.setState({
              listData: [...listData, {value_id: countTableList++, ...values}]
            })
          }
          if (editValueType === 'edit') {
            this.setState({
              listData: listData.map(item => {
                if (item.value_id === selectedEditId) {
                  return { value_id: item.value_id, ...values }
                }
                return item
              })
            })
          }
          this.setState({
            showEditValueField: false
          })
          form.resetFields()
          return
        }

        // 添加表格字段
        if (editValueType === 'add') {
          POST(API.loanFormFieldsValues, {
            field_id: editId,
            key: values.key,
            value: values.value
          }).then(data => {
            // console.log(data)
            if (data.status === 200) {
              message.success(data.message)
              this.setState({
                // listData: [...listData, {value_id: countTableList++, ...values}],
                listData: [...listData, data],
                showEditValueField: false
              })
              form.resetFields()
            }
          })
        }

        // 编辑表格字段
        if (editValueType === 'edit') {
          // 先判断值是否被修改
          let selectData = listData.filter(_ => _.value_id === selectedEditId)[0] // 找个值必须存在一个
          if (selectData.key === values.key && selectData.value === values.value) {
            // 没有修改值的情况，不做操作
            this.setState({ showEditValueField: false })
            form.resetFields()
            return
          }

          PUT(API.loanFormFieldsValues, {
            value_id: selectedEditId,
            key: values.key,
            value: values.value
          }).then(data => {
            // console.log(data)
            if (data.status === 200) {
              message.success(data.message)
              this.setState({
                showEditValueField: false,
                listData: listData.map(item => {
                  if (item.value_id === selectedEditId) {
                    return { value_id: item.value_id, ...values }
                  }
                  return item
                })
              })
              form.resetFields()
            }
          })
        }
      }
    })
  }

  delValueField = record => {
    // console.log(record)
    if (this.props.editId === '') {
      this.setState({
        listData: this.state.listData.filter(_ => _.value_id !== record.value_id)
      })
      return
    }
    DELETE(API.loanFormFieldsValues, {
      value_id: record.value_id
    }).then(data => {
      if (data.status === 200) {
        message.success(data.message)
        // this.refreshTable()
        this.setState({
          listData: this.state.listData.filter(_ => _.value_id !== record.value_id)
        })
      }
    })
  }

  renderTable = () => {
    const { selectType, listData, listTableLoading } = this.state
    // 按value_id的大小顺序排列显示
    listData.sort((a, b) => a.value_id - b.value_id)
    if (selectType === 'radio' || selectType === 'list' || selectType === 'list_group') {
      const columns = [{
        title: '字段名',
        dataIndex: 'key'
      }, {
        title: '字段标识',
        dataIndex: 'value'
      }, {
        title: '操作',
        key: 'opt',
        render: (text, record) => (
          <div>
            <a onClick={() => { this.editValueField(record) }}>编辑</a>
            <span> | </span>
            <Popconfirm placement="right" title={'确定要删除这一项吗？'} onConfirm={() => this.delValueField(record)} okText="确定" cancelText="取消">
              <a>删除</a>
            </Popconfirm>
          </div>
        )
      }]
      return (
        <Table
          style={{ margin: '10px 0 40px 16px' }}
          title={() => (
            <div className="u-table-title">
              <span>{'该类型下的字段值'}</span>
              <span>
                <Button icon="plus" size="small" onClick={this.addValueField}>添加选项值</Button>
                <a onClick={this.refreshTable} style={{ marginLeft: 8 }}>
                  <Icon type={this.state.listTableLoading ? 'loading' : 'sync'}/>
                </a>
              </span>
            </div>
          )}
          rowKey={record => record.value_id}
          columns={columns}
          dataSource={listData}
          loading={listTableLoading}
          pagination={false}
          size={'small'}
        />
      )
    }
    return null
  }

  onCreate = () => {
    let { selectType, listData } = this.state
    // console.log(listData)

    // if ((selectType === 'radio' || selectType === 'list' || selectType === 'list_group') && listData.length < 1) {
    //   message.error('请在表格中添加值！')
    //   return
    // }
    this.setState({ confirmLoading: true })
    this.props.onCreate(listData, () => {
      this.setState({ confirmLoading: false })
    })
  }

  render () {
    const { form, title, visible, onCancel, label, fieldName, type, helptext } = this.props
    const { getFieldDecorator } = form
    return (
      <Modal
        onOk={this.onCreate}
        onCancel={onCancel}
        okText="确定"
        cancelText="取消"
        title={title}
        visible={visible}
        confirmLoading={this.state.confirmLoading}
        afterClose={() => {
          this.setState({
            selectType: '',
            confirmLoading: false,
            listData: []
          })
        }}
      >
        <Form>
          <FormItem {...formItemLayout} label="显示名称">
            {getFieldDecorator('label', {
              rules: [{ required: true, message: '显示名称不能为空！' }],
              initialValue: label
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="关键字标识">
            {getFieldDecorator('fieldName', {
              rules: [{ required: true, message: '关键字标识不能为空！' }],
              initialValue: fieldName
            })(<Input />)}
          </FormItem>
          <FormItem {...formItemLayout} label="类型">
            {getFieldDecorator('type', {
              rules: [{ required: true, message: '类型不能为空！' }],
              initialValue: type
            })(
              <Select
                onChange={value => { this.setState({ selectType: value }) }}
              >
                {formtypes.filter(item => item.show).map(item => <Option key={item._id} value={item.type}>{item.type + '\t/\t' + item.label}</Option>)}
              </Select>
            )}
          </FormItem>
          {this.renderTable()}
          <FormItem {...formItemLayout} label="说明文本">
            {getFieldDecorator('text', {
              initialValue: helptext
            })(<Input />)}
          </FormItem>
        </Form>
        <EditValueFieldModal
          ref={node => { this.editValueFieldModal = node }}
          visible={this.state.showEditValueField}
          title={this.state.editValueTitle}
          label={this.state.editValueLabel}
          value={this.state.editValueValue}
          onCreate={this.createValueField}
          onCancel={() => { this.editValueFieldModal.resetFields(); this.setState({ showEditValueField: false }) }}
        />
      </Modal>
    )
  }
}

export default Form.create()(EditLoanFormModal)

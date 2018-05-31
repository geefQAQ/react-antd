import React from 'react'
import { connect } from 'react-redux'
import { Modal, Table, Icon, Button, Input, InputNumber, Form, Select, DatePicker, Upload, Popconfirm, message, Row, Col, Popover } from 'antd'
import { GET, POST, PUT, DELETE } from '@/utils/service'
import { API } from '@/utils/config'
import formtypes from '@/mock/formcomponents'
import EditLoanFormModal from './EditLoanFormModal'
import { loadTableData } from './functions'
import './LoanFormComponents.less'

const FormItem = Form.Item

/**
 * 字段管理表格
 */
class LoanFormComponents extends React.Component {
  state = {
    data: [],
    loading: false,
    showEditForm: false,
    modalTitle: '',
    cLabel: '',
    cFieldName: '',
    cType: '',
    cText: '',
    opt: '',
    editId: ''
  }
  hasState = true

  componentWillMount () {
    this.getFormFieldsData()
  }

  componentWillUnmount () {
    this.hasState = false
  }

  getFormFieldsData = () => {
    this.setState({ loading: true })
    GET(API.loanFormFields, {})
      .then(data => {
        data.sort((a, b) => a.id - b.id) // 按id排序
        this.hasState && this.setState({
          data,
          loading: false
        })
      })
      .catch(e => {
        this.hasState && this.setState({ loading: false })
      })
  }

  addFieldRow = () => {
    this.setState({
      showEditForm: true,
      modalTitle: '新建字段',
      cLabel: '',
      cFieldName: '',
      cType: '',
      cText: '',
      editId: '',
      opt: 'add',
      cTableData: []
    })
  }

  editFieldRow = record => {
    // console.log(record)
    // // 设置不让修改类型为 radio/list/list_group 的字段
    // if (['radio', 'list', 'list_group'].findIndex(_ => _ === record.type) > -1) {
    //   message.error('不允许修改！')
    //   return
    // }
    loadTableData(record.type, record.id, data => {
      this.setState({
        showEditForm: true,
        modalTitle: '编辑字段',
        cLabel: record.label,
        cFieldName: record.admin_label,
        cType: record.type,
        cText: record.help_text,
        opt: 'edit',
        editId: record.id,
        cTableData: data || []
      })
    })
  }

  delFieldRow = record => {
    // console.log(record)
    DELETE(API.loanFormFields, {
      id: record.id
    }).then(data => {
      if (data.status === 200) {
        message.success(data.message)
        this.getFormFieldsData()
      }
    })
  }

  saveFormData = (listData, callback) => {
    const editForm = this.editForm
    editForm.validateFields((err, values) => {
      if (!err) {
        const opt = this.state.opt
        // console.log(values, opt)

        // 添加字段
        if (opt === 'add') {
          POST(API.loanFormFields, {
            label: values.label,
            admin_label: values.fieldName,
            type: values.type,
            help_text: values.text,
            values: values.type === 'select' ? [{ key: 'select', value: '{}' }] : listData
          }).then(data => {
            if (data.status === 200) {
              message.success(data.message)
              editForm.resetFields()
              this.hasState && this.setState({
                showEditForm: false
              })
              this.getFormFieldsData()
            }
            callback()
          }).catch(e => {
            this.hasState && this.setState({
              showEditForm: false
            })
            callback()
          })
        }
        // 编辑字段
        if (opt === 'edit') {
          // 先判断值是否被修改
          // （由于此处编辑提交的values值不影响变化，所以只需要判断其他几个内容是否修改）
          let currentRecord = this.state.data.filter(_ => _.id === this.state.editId)[0]
          if (
            currentRecord.label === values.label &&
            currentRecord.admin_label === values.fieldName &&
            currentRecord.type === values.type &&
            currentRecord.help_text === values.text
          ) {
            // 编辑的四个值都没有改变时，不进行下一步操作
            this.setState({ showEditForm: false })
            editForm.resetFields()
            callback()
            return
          }

          PUT(API.loanFormFields, {
            id: this.state.editId,
            label: values.label,
            admin_label: values.fieldName,
            type: values.type,
            help_text: values.text,
            values: values.type === 'select' ? [{ key: 'select', value: '{}' }] : listData
          }).then(data => {
            if (data.status === 200) {
              message.success(data.message)
              editForm.resetFields()
              this.hasState && this.setState({
                showEditForm: false
              })
              this.getFormFieldsData()
            }
            callback()
          }).catch(e => {
            this.hasState && this.setState({
              showEditForm: false
            })
            callback()
          })
        }
      } else {
        callback()
      }
    })
  }

  onCancel = () => {
    this.editForm.resetFields()
    this.setState({ showEditForm: false })
  }

  render () {
    const columns = [{
      title: '显示名称',
      dataIndex: 'label'
    }, {
      title: '关键字标识',
      dataIndex: 'admin_label'
    }, {
      title: '类型',
      dataIndex: 'type'
    }, {
      title: '说明',
      dataIndex: 'help_text',
      width: '12%'
    }, {
      title: '创建时间',
      dataIndex: 'created_at'
    }, {
      title: '更新时间',
      dataIndex: 'updated_at'
    }, {
      title: '操作',
      key: 'opt',
      width: '10%',
      render: (text, record) => (
        <span>
          <a onClick={() => this.editFieldRow(record)}>编辑</a>
          <span> | </span>
          <Popconfirm placement="top" title={'确定要删除这一项吗？'} onConfirm={() => this.delFieldRow(record)} okText="确定" cancelText="取消">
            <a>删除</a>
          </Popconfirm>
        </span>
      )
    }]

    return (
      <div>
        <div className="page-head">
          <h3>贷款产品表单</h3>
        </div>
        <div className="page-content m-loan-fieldstable">
          <Table
            title={() => (
              <div className="u-table-title">
                <span>{'贷款产品表单字段'}</span>
                <Button type="primary" icon="plus" size="small" onClick={this.addFieldRow}>添加字段</Button>
              </div>
            )}
            rowKey={record => record.id}
            columns={columns}
            dataSource={this.state.data}
            loading={this.state.loading}
            bordered={true}
            pagination={false}
            size={'small'}
          />
        </div>
        <EditLoanFormModal
          ref={node => { this.editForm = node }}
          visible={this.state.showEditForm}
          title={this.state.modalTitle}
          onCreate={this.saveFormData}
          onCancel={this.onCancel}
          label={this.state.cLabel}
          fieldName={this.state.cFieldName}
          type={this.state.cType}
          helptext={this.state.cText}
          editId={this.state.editId}
          tableData={this.state.cTableData}
        />
      </div>
    )
  }
}

const mapStateToProps = ({ app }) => ({ app })

export default connect(mapStateToProps)(LoanFormComponents)

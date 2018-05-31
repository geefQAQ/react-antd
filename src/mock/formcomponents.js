export default [
  { _id: 1, show: true, label: '文本输入', key: 'text', type: 'input' },
  { _id: 2, show: false, label: '密码框', key: 'password', type: 'password', value: [] },
  { _id: 3, show: false, label: '数字框', key: 'number', type: 'number', value: [] },
  { _id: 4, show: false, label: '文件上传', key: 'file', type: 'file', value: [] },
  { _id: 5, show: true, label: '文本域', key: 'textarea', type: 'textarea', value: [] },
  { _id: 6, show: true, label: '单选', key: 'radio', type: 'radio', value: [{ _id: 61, label: '单选一', value: 0 }, { _id: 62, label: '单选二', value: 1 }] },
  { _id: 7, show: false, label: '多选框', key: 'checkbox', type: 'checkbox', value: [{ _id: 71, label: '多选一', value: 0 }, { _id: 72, label: '多选二', value: 1 }, { _id: 73, label: '多选三', value: 2 }] },
  { _id: 8, show: true, label: '一级下拉列表', key: 'list', type: 'list', value: [{ _id: 81, label: '下拉列表一', value: 0 }, { _id: 82, label: '下拉列表二', value: 1 }, { _id: 83, label: '下拉列表三', value: 2 }] },
  { _id: 9, show: true, label: '多级选择', key: 'select', type: 'select', value: [] },
  { _id: 10, show: true, label: '多级分组选择', key: 'list_group', type: 'list_group', value: [] },
  { _id: 11, show: true, label: '图片', key: 'image', type: 'image', value: [] },
  { _id: 12, show: true, label: '日期', key: 'date', type: 'date', value: [] },
  { _id: 13, show: false, label: '时间', key: 'time', type: 'time', value: [] }
]

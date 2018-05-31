export default [{
  id: 0,
  label: '分组一',
  isRequired: true,
  order: 0,
  fields: [{
    label: '单项选择',
    admin_label: 'radios',
    type: 'radio',
    help_text: '',
    id: '01',
    value: [{
      label: '是',
      value: 1,
      value_id: '0101',
      children: [{
        id: '010101',
        label: 'group1-1',
        isRequired: true,
        order: 0,
        fields: [{
          id: '01010101',
          label: '子项一',
          admin_label: 'text',
          type: 'input',
          help_text: 'aaa'
        }, {
          id: '01010102',
          label: '子项二，选择多项下拉列表',
          admin_label: 'list-group',
          type: 'list-group',
          help_text: '选择列表'
        }]
      }]
    }, {
      label: '否',
      value: 0,
      value_id: '0102'
    }]
  }, {
    label: '文本框',
    admin_label: 'text',
    type: 'input',
    help_text: '',
    id: '02'
  }, {
    label: '列表选择',
    admin_label: 'list',
    type: 'list',
    help_text: '',
    id: '03',
    value: [{
      label: '列表一',
      value: 'list01',
      value_id: '0301'
    }]
  }]
}, {
  id: 1,
  label: '分组二',
  isRequired: true,
  order: 1,
  fields: [{
    id: '102',
    label: '',
    admin_label: '',
    type: 'radio',
    help_text: '',
    value: [{
      label: '是',
      value: 1,
      value_id: '10201',
      children: {
        label: 'group1-1',
        isRequired: true,
        order: 0,
        fields: []
      }
    }, {
      label: '否',
      value_id: '10202',
      value: 0
    }]
  }]
}]

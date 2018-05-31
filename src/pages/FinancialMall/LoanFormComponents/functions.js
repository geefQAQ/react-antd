import { GET, POST, PUT, DELETE } from '@/utils/service'
import { API } from '@/utils/config'

export const loadTableData = (type, id, cb) => {
  if (!id) {
    cb(null)
    return
  }
  if (type === 'radio' || type === 'list' || type === 'list_group') {
    GET(API.loanFormFieldsValues, {
      field_id: id
    }).then(data => {
      cb(data)
    }).catch(() => {
      cb(null)
    })
    return
  }
  cb(null)
}

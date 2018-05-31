import { GET, POST, PUT, DELETE } from '@/utils/service'
import { API } from '@/utils/config'

export const loadFormData = cb => {
  GET(API.loanFormFields, {})
    .then(data => {
      data.sort((a, b) => a.id - b.id)
      cb(data)
    })
    .catch(() => {
      cb(null)
    })
}

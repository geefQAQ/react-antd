import { TOGGLESIDER, LOAD_MENU, ADDMENUROW, UPDATEMENUROW, DELMENUROW } from '@/utils/constants'
import { API } from '@/utils/config'
import { GET, POST, PUT } from '@/utils/service'

export const loadMenu = () => dispatch => {
  return GET(API.menus)
    .then(data => {
      dispatch({ type: LOAD_MENU, items: data })
    })
}

export const addMenuRow = row => dispatch => {
  return POST(API.menus, {
    ...row
  }).then(data => {
    // dispatch({ type: ADDMENUROW, items: row })
    dispatch(loadMenu())
  })
}

export const updateMenuRow = row => dispatch => {
  return PUT(API.menus, {
    ...row
  }).then(data => {
    // dispatch({ type: UPDATEMENUROW, item: row })
    dispatch(loadMenu())
  })
}

export const delMenuRow = key => ({
  type: DELMENUROW,
  id: key
})

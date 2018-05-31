import { combineReducers } from 'redux'
import { TOGGLESIDER, LOAD_MENU, SELECTMENU, CHANGEOPENMENUKEY, ADDMENUROW, UPDATEMENUROW, DELMENUROW } from '@/utils/constants'

import { loadStore, setStore } from '@/utils/util'

import defaultMenu from '@/mock/menu'
/**
 * initial state
 */
const app = {
  value: 0,
  siderWidth: 256,
  siderFold: true,
  menuList: defaultMenu,
  selectMenuKey: loadStore('selectMenuKey').split(',') || [],
  openMenuKey: loadStore('openMenuKey').split(',') || []
}

/**
 * reduce values
 */

const siderWidth = (state = app.siderWidth, action) => {
  switch (action.type) {
    case TOGGLESIDER:
      return action.width
    default:
      return state
  }
}

const siderFold = (state = app.siderFold, action) => {
  switch (action.type) {
    case TOGGLESIDER:
      return !state
    default:
      return state
  }
}

const selectMenuKey = (state = app.selectMenuKey, action) => {
  // console.log(action.type)
  switch (action.type) {
    case SELECTMENU:
      setStore('selectMenuKey', action.selectKey.join(','))
      return action.selectKey
    default:
      return state
  }
}

const openMenuKey = (state = app.openMenuKey, action) => {
  switch (action.type) {
    case CHANGEOPENMENUKEY:
      setStore('openMenuKey', action.openKey.join(','))
      return action.openKey
    default:
      return state
  }
}

const menuList = (state = app.menuList, action) => {
  switch (action.type) {
    case LOAD_MENU:
      return action.items
    case ADDMENUROW:
      return [...state, action.item]
    case UPDATEMENUROW:
      return state.map(item => item.id === action.item.id ? action.item : item)
    case DELMENUROW:
      return state.filter(_ => _.id !== action.id)
    default:
      return state
  }
}

export default combineReducers({
  siderWidth,
  siderFold,
  menuList,
  selectMenuKey,
  openMenuKey,
})
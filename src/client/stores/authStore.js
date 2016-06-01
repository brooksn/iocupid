import { throttle } from 'lodash'
import decode from 'jwt-decode'
import EventEmitter from 'events'
import AppDispatcher from '../dispatcher/AppDispatcher.js'
const authStore = new EventEmitter()
const localStorageKey = 'base64jwt'
export const CHANGE_EVENT = 'change'

const getLocalStore = function getLocalStore() {
  let base64jwt = null
  if (window) {
    base64jwt = window.localStorage.getItem(localStorageKey)
  }
  return {base64jwt}
}

const store = getLocalStore()

const saveStoreToLocalStorage = function saveStoreToLocalStorage() {
  if (window) window.localStorage.setItem(localStorageKey, store.base64jwt)
}

const unthrottledEmitChange = function unthrottledEmitChange() {
  saveStoreToLocalStorage()
  authStore.emit(CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 200)

export const setJWTBase64 = function setJWTBase64(token) {
  if (typeof token === 'string') store.base64jwt = token
  else throw Error('Type of token must be a string.')
  emitChange(CHANGE_EVENT)
}

export const getJWTPayload = function getJWT() {
  if (!store.base64jwt) return store.base64jwt
  else return decode(store.base64jwt)
}

export const getJWTBase64 = function getJWTBase64() {
  return store.base64jwt
}

export const getUserID = function getUserID() {
  if (!store.base64jwt) return store.base64jwt
  else return decode(store.base64jwt).userID
}

AppDispatcher.register((dispatch) => {
  if (dispatch.actionType === 'SET_JWT_BASE_64') {
    setJWTBase64(dispatch.data.token)
  }
})

export default authStore

import throttle from 'lodash.throttle'
import EventEmitter from 'events'
const formStore = new EventEmitter()
export const CHANGE_EVENT = 'change'

const formInput = {
  email: '',
  name: '',
  skills: [],
  interests: []
}

const unthrottledEmitChange = function unthrottledEmitChange() {
  formStore.emit(CHANGE_EVENT)
}
const emitChange = throttle(unthrottledEmitChange, 200)

export const addSkill = function addSkill(skill) {
  if (formInput.skills.indexOf(skill) < 0) {
    formInput.skills.push(skill)
    emitChange(CHANGE_EVENT)
  }
}

export const removeSkill = function removeSkill(skill) {
  const index = formInput.skills.indexOf(skill)
  if (index >= 0) {
    formInput.skills.splice(index, 1)
    emitChange(CHANGE_EVENT)
  }
}

export const addInterest = function addInterest(interest) {
  if (formInput.interests.indexOf(interest) < 0) {
    formInput.interests.push(interest)
    emitChange(CHANGE_EVENT)
  }
}

export const removeInterest = function removeInterest(interest) {
  const index = formInput.interests.indexOf(interest)
  if (index >= 0) {
    formInput.interests.splice(index, 1)
    emitChange(CHANGE_EVENT)
  }
}

export const changeEmail = function changeEmail(email) {
  if (formInput.email !== email) {
    formInput.email = email
    emitChange(CHANGE_EVENT)
  }
}

export const changeName = function (name) {
  if (formInput.name !== name) {
    formInput.name = name
    emitChange(CHANGE_EVENT)
  }
}

export const getEmail = function getEmail() {
  return formInput.email
}

export const getName = function getName() {
  return formInput.name
}

export const getSkills = function getSkills() {
  return formInput.skills
}

export const getInterests = function getInterests() {
  return formInput.interests
}

Object.freeze(formStore)
export default formStore

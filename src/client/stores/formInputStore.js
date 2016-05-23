import throttle from 'lodash.throttle'

const formInput = {
  email: '',
  name: '',
  skills: [],
  interests: []
}

export const observers = new Set()

export function observeChanges (fn) {
  observers.add(fn)
}

export function unobserveChanges (fn) {
  observers.delete(fn)
}

let notifyChange = function notifyChange (change) {
  observers.forEach(function (observer) {
    observer(change)
  })
}

const throttledNotifyChange = throttle(notifyChange, 100)

export const addSkill = function (skill) {
  if (formInput.skills.indexOf(skill) < 0) {
    formInput.skills.push(skill)
    throttledNotifyChange('CHANGE_SKILLS')
  }
}

export const removeSkill = function (skill) {
  let index = formInput.skills.indexOf(skill)
  if (index >= 0) {
    formInput.skills.splice(index, 1)
    throttledNotifyChange('CHANGE_SKILLS')
  }
}

export const addInterest = function (interest) {
  if (formInput.interests.indexOf(interest) < 0) {
    formInput.interests.push(interest)
    throttledNotifyChange('CHANGE_INTERESTS')
  }
}

export const removeInterest = function (interest) {
  let index = formInput.interests.indexOf(interest)
  if (index >= 0) {
    formInput.interests.splice(index, 1)
    throttledNotifyChange('CHANGE_INTERESTS')
  }
}

export const changeEmail = function (email) {
  if (formInput.email !== email) {
    formInput.email = email
    throttledNotifyChange('CHANGE_EMAIL')
  }
}

export const changeName = function (name) {
  if (formInput.name !== name) {
    formInput.name = name
    throttledNotifyChange('CHANGE_NAME')
  }
}

export function getEmail () {
  return formInput.email
}

export function getName () {
  return formInput.name
}

export function getSkills () {
  return formInput.skills
}

export function getInterests () {
  return formInput.interests
}

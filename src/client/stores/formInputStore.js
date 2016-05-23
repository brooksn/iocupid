import throttle from 'lodash.throttle'

const formInput = {
  email: '',
  name: '',
  skills: [],
  interests: []
}

export const observers = new Set()

export function observeChanges(fn) {
  observers.add(fn)
}

export function unobserveChanges(fn) {
  observers.delete(fn)
}

const notifyChange = function notifyChange(change) {
  observers.forEach(observer => {
    observer(change)
  })
}

const throttledNotifyChange = throttle(notifyChange, 100)

export function addSkill(skill) {
  if (formInput.skills.indexOf(skill) < 0) {
    formInput.skills.push(skill)
    throttledNotifyChange('CHANGE_SKILLS')
  }
}

export const removeSkill = function removeSkill(skill) {
  const index = formInput.skills.indexOf(skill)
  if (index >= 0) {
    formInput.skills.splice(index, 1)
    throttledNotifyChange('CHANGE_SKILLS')
  }
}

export const addInterest = function addInterest(interest) {
  if (formInput.interests.indexOf(interest) < 0) {
    formInput.interests.push(interest)
    throttledNotifyChange('CHANGE_INTERESTS')
  }
}

export const removeInterest = function removeInterest(interest) {
  const index = formInput.interests.indexOf(interest)
  if (index >= 0) {
    formInput.interests.splice(index, 1)
    throttledNotifyChange('CHANGE_INTERESTS')
  }
}

export const changeEmail = function changeEmail(email) {
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

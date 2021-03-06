import { oneLine } from 'common-tags'

const testJWTPayload = function testJWTPayload(props, propName, componentName) {
  if (props[propName]) {
    const payload = props[propName]
    if (typeof payload !== 'object') {
      return new Error(`Prop ${propName} in ${componentName} must be an object. `)
    }
    if (typeof payload.userID !== 'string') {
      return new Error(oneLine`Prop ${propName} in ${componentName}
        must have a key "userID" containing a string. `)
    }
    if (typeof payload.services !== 'object') {
      return new Error(oneLine`Prop ${propName} in ${componentName}
        must have a key "services" containing an object. `)
    } else {
      for (const service in payload.services) {
        if (typeof payload.services[service].token !== 'string') {
          return new Error('Each service in a JWTPayload must contain a key "token". ')
        }
        if (typeof payload.services[service].username !== 'string'
          && typeof payload.services[service].id !== 'string') {
          return new Error('Each service in a JWTPayload must contain a key "username". ')
        }
      }
    }
  } else return null
}

const JWTPayload = function JWTPayload(props, propName, componentName) {
  return testJWTPayload(props, propName, componentName)
}

JWTPayload.isRequired = function JWTPayloadIsRequired(props, propName, componentName) {
  if (!props[propName]) {
    return new Error(oneLine`Prop ${propName} in ${componentName} is required.
      Did you mean to use JWTPayload.allowNull in the PropTypes instead?`)
  } else {
    return testJWTPayload(props, propName, componentName)
  }
}

JWTPayload.allowNull = function JWTPayloadIsRequired(props, propName, componentName) {
  if (typeof props[propName] === 'undefined') {
    return new Error(oneLine`Prop ${propName} in ${componentName} may not be undefined. `)
  } else {
    return testJWTPayload(props, propName, componentName)
  }
}

export default JWTPayload

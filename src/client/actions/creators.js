export const setJWTBase64 = function setJWTBase64(token) {
  try {
    JSON.parse(token)
    return new Error('token must be base64 encoded.')
  } catch (e) {
    return {
      actionType: 'SET_JWT_BASE_64',
      data: {
        token: token
      }
    }
  }
}

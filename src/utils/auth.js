import Cookies from 'js-cookie'

const TokenKey = 'goj_token'
const UserIdKey = 'user_id'
const AvatarKey = 'avatar'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function getUserId() {
  return Cookies.get(UserIdKey)
}

export function getAvatar() {
  return Cookies.get(AvatarKey)
}

export function setToken(token, expires) {
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + 1000 * expires)
  return Cookies.set(TokenKey, token, {
    expires: expiresTime
  })
}

export function setUserId(user_id, expires) {
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + 1000 * expires)
  return Cookies.set(UserIdKey, user_id, {
    expires: expiresTime
  })
}

export function setAvatar(avatar, expires) {
  const millisecond = new Date().getTime()
  const expiresTime = new Date(millisecond + 1000 * expires)
  return Cookies.set(AvatarKey, avatar, {
    expires: expiresTime
  })
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function removeUserId() {
  return Cookies.remove(UserIdKey)
}

export function removeAvatar() {
  return Cookies.remove(AvatarKey)
}

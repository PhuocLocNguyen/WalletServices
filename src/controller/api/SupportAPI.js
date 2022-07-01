import QueryString from 'query-string'
import { APP_VERSION, env } from '../../common/constants'
import { KEY_STORE } from '../../common/constants/keystore'


export class SupportAPI {
  static async postGetCommonPair (typeTrade, currencyIn, currencyOut, isForceReload) {
    const body = {
      typeTrade,
      currencyIn,
      currencyOut,
      isForceReload
    }

    return this.postGateWay('ammPairV2', REQUEST_TYPE.POST, body)
  }

  static async getCoinLocal () {
    return this.getData('coinLocal')
  }

  static async getCoinGecko () {
    return this.getData('coinGecko')
  }

  static async getSetting () {
    return this.getData('settingV6')
  }

  static async getData (type, queryBody) {
    return this.postGateWay(type, REQUEST_TYPE.GET, undefined, queryBody)
  }

  static async postData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.POST, body)
  }

  static async putData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.PUT, body)
  }

  static async postGateWay (url, method = REQUEST_TYPE.GET, body, queryBody, linkServer, options) {
    try {
      const serverUrl = linkServer || env.SUPPORT_API

      const token = getItemStorage(KEY_STORE.SPAM_TOKEN)
      const spamToken = '0xaeb0325a6789f597b4f7c2c4dcb36b1ba4232384ffaf7b24670b71dafc564cec'

      let queryStr = ''
      let queryFly

      if (queryBody) {
        queryFly = QueryString.stringify(queryBody)
        queryStr = '?' + queryFly
      }

      const params = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Version: APP_VERSION,
          Authorization: 'Bearer ' + token
        },
        ...options
      }

      let passwordHash = ''

      if (body) {
        params.body = JSON.stringify(body)
      }

      if (method !== 'GET') {
        passwordHash = JSON.stringify(body || {})
      } else {
        passwordHash = queryBody ? QueryString.stringify(queryBody) : {}
      }

      const hashPassword = crypto.HmacSHA256(passwordHash, spamToken || '')
      params.headers.Signature = hashPassword
      const response = await fetch(serverUrl + url + queryStr, params)

      const responJson = await response.json()

      if (response.status === 200) {
        return responJson
      }

      if (response.status === 400) {
        return responJson
      }

      return null
    } catch (error) {
      console.log(error)
      return null
    }
  }
}

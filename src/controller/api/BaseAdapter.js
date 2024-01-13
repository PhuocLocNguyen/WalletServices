import QueryString from 'query-string'
import crypto from 'crypto-js'
import get from 'lodash/get'
import { REQUEST_TYPE } from '../../common/constants/requestType'
import { APP_VERSION, env } from '../../common/constants'
import { KEY_STORE } from '../../common/constants/keystore'
import { getItemStoragePersist } from '../../common/function/utils'

export default class BaseAdapter {
  static async getData (type, queryBody, options, codeToken) {
    return this.postGateWay(
      type,
      REQUEST_TYPE.GET,
      undefined,
      queryBody,
      null,
      options,
      codeToken
    )
  }

  static async postData (type, body, options) {
    return this.postGateWay(type, REQUEST_TYPE.POST, body, null, null, options)
  }

  static async putData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.PUT, body)
  }

  static async deleteData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.DELETE, undefined, body)
  }

  static async putDataView (type, body) {
    return this.postGateWay(type + '/view', REQUEST_TYPE.PUT, body)
  }

  static async postGetCommonPair (typeTrade, currencyIn, currencyOut) {
    const body = {
      typeTrade,
      currencyIn,
      currencyOut
    }

    return this.postGateWay('ammRouter/commonPair', REQUEST_TYPE.POST, body)
  }

  static async postGateWay (
    url,
    method = REQUEST_TYPE.GET,
    body,
    queryBody,
    linkServer,
    options,
    newToken
  ) {
    try {
      const serverUrl = linkServer || env.ADAPTER_URL
      const JWT_TOKEN_ADAPTER = getItemStoragePersist(KEY_STORE.JWT_TOKEN_ADAPTER)
      
      const token = newToken || get(JWT_TOKEN_ADAPTER, 'token')


      let queryStr = ''
      let queryFly

      if (queryBody) {
        queryFly = QueryString.stringify(queryBody)
        queryStr = '?' + queryFly
      }

      const params = {
        method,
        headers: {
          Source: 'C98HUWAEXMK',
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Version: APP_VERSION,
          Authorization: 'Bearer ' + token,
        },
        ...options
      }

      let passwordHash = ''

      if (body) {
        params.body = JSON.stringify(body)
      }

      if (method !== REQUEST_TYPE.GET) {
        passwordHash = JSON.stringify(body || {})
      } else {
        passwordHash = queryBody ? QueryString.stringify(queryBody) : {}
      }

      const hashPassword = crypto.HmacSHA256(passwordHash,  '')
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

import QueryString from 'query-string'
import crypto from 'crypto-js'
import omitBy from 'lodash/omitBy'
import isNil from 'lodash/isNil'
import { APP_VERSION, env } from '../../common/constants'
import { REQUEST_TYPE } from '../../common/constants/requestType'
import { KEY_STORE } from '../../common/constants/keystore'
import { getItemStorage } from '../../common/function/utils'
import { convertPasswordHMAC256Old } from '../../common/function'

const STR_ERR = 'The requested URL was not found '
export default class BaseAPI {
  static async getData (type, queryBody, options) {
    return this.postGateWay(type, REQUEST_TYPE.GET, undefined, queryBody, null, options)
  }

  static async postData (type, body, options, signature) {
    return this.postGateWay(type, REQUEST_TYPE.POST, body, null, null, options, signature)
  }

  static async putData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.PUT, body)
  }

  static async deleteData (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.DELETE, undefined, body)
  }

  static async getDataAll (type) {
    return this.postGateWay(type + '/getFilterWithUser', REQUEST_TYPE.GET)
  }

  // get data development
  static async getDataDevelopment (type, queryBody, options) {
    return this.postGateWay(type, REQUEST_TYPE.GET, undefined, queryBody, 'https://development.coin98.services/api/', options)
  }

  static async postDataDevelopment (type, body, options) {
    return this.postGateWay(type, REQUEST_TYPE.POST, body, null, 'https://development.coin98.services/api/', options)
  }

  static async putDataDevelopment (type, body) {
    return this.postGateWay(type, REQUEST_TYPE.PUT, body, null, 'https://development.coin98.services/api/')
  }

  static async sendCodeVerify () {
    return this.postGateWay('user/telegram/link', REQUEST_TYPE.POST)
  }

  static async verifyPinCode (otpCode) {
    return this.postGateWay('user/pincode/reset', REQUEST_TYPE.POST, { otpCode })
  }

  static async verifyCodeTelegram (code) {
    return this.postGateWay('user/telegram/verify', REQUEST_TYPE.POST, { code })
  }

  static async putDataView (type, body) {
    return this.postGateWay(type + '/view', REQUEST_TYPE.PUT, body)
  }

  static async getRelated (type, lang, category) {
    return this.postGateWay(type + `/related/${lang}/${category}`, REQUEST_TYPE.GET)
  }

  static async getDataByID (type, id) {
    return this.postGateWay(type + `/item/${id}`, REQUEST_TYPE.GET)
  }



  static async postGetCommonPair (typeTrade, currencyIn, currencyOut) {
    const body = {
      typeTrade,
      currencyIn,
      currencyOut
    }

    return this.postGateWay('ammRouter/commonPair', REQUEST_TYPE.POST, body)
  }

  // static async getSwapHistory (address) {
  //   return this.postGateWay(`history/${transactionType.swap}/${address}`, REQUEST_TYPE.GET)
  // }

  static async getDataFilter (type, id = '', lang, isViewFull) {
    return this.postGateWay(type + '/getFilterData', REQUEST_TYPE.GET, undefined, { id, lang, isViewFull })
  }

  static async checkInDaily () {
    return this.postGateWay('user/checkIn', REQUEST_TYPE.PUT)
  }

  static async postHistory (hash,
    from,
    to,
    chain,
    amount,
    message,
    memo,
    fee,
    gasPrice,
    gasLimit,
    contractData,
    isMultisend
  ) {
    const body = {
      hash,
      from,
      to,
      chain,
      amount,
      message,
      memo,
      fee,
      gasPrice,
      gasLimit,
      contractData,
      isMultisend,
      source: 'hub'
    }

    return this.postGateWay('history/v2', REQUEST_TYPE.POST, body)
  }

  static async putDataPin (id, isNews) {
    return this.postGateWay(`${isNews ? 'news' : 'newsFeed'}/pin`, REQUEST_TYPE.PUT, { id })
  }

  static async getRewardFilter () {
    return this.postGateWay('reward/filterV2', REQUEST_TYPE.GET)
  }

  static async getGameFilter () {
    return this.postGateWay('game/filterV2', REQUEST_TYPE.GET)
  }

  static async getUserById (id) {
    return this.postGateWay('user/getInfo', REQUEST_TYPE.GET, undefined, { id })
  }

  static async getUserByRefId (id) {
    return this.postGateWay(`user/refMe/${id}`, REQUEST_TYPE.GET)
  }

  static async getByCategory (type, id, level) {
    return this.postGateWay(type + `/category/${id}/${level}`, REQUEST_TYPE.GET)
  }

  static async getEvent (page, size = 20) {
    const queryBody = {
      page, size
    }

    return this.postGateWay('event', undefined, undefined, queryBody)
  }

  static async getConfig () {
    return this.postGateWay('config')
  }

  static async getConfigByType (param) {
    return this.postGateWay(`config/type/${param}`)
  }

  static async getConfigByTypeMultiple (body) {
    return this.postGateWay('config/typeV2', REQUEST_TYPE.POST, { setting: body })
  }

  static async getCoinInAddress (chain) {
    const body = {
      chain
    }
    return this.postGateWay('getCoinAddress', REQUEST_TYPE.POST, body)
  }

  static async getListCoin () {
    return this.postGateWay('coin?type=tomo', REQUEST_TYPE.GET)
  }

  static async updateReaction (id, userId, type, value, keyValue = 'news') {
    const body = {
      id, userId, type, value
    }

    return this.postGateWay(`${keyValue}/reaction`, REQUEST_TYPE.PUT, body)
  }

  static async fetchCoin (coin, day) {
    // return this.postGateWay('', REQUEST_TYPE.GET, null, null, `https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=${day}`)
  }

  static async checkUser (id, lang, isResetPass, uniqueDeviceId, isResendCode) {
    const body = {
      id,
      lang,
      deviceLocale: getItemStorage(KEY_STORE.GET_LOCALE),
      isResetPass,
      uniqueDeviceId,
      isResendCode
    }

    return this.postGateWay('user', REQUEST_TYPE.POST, body)
  }

  static async verifyOTPCodeEmail (id, password, otp, email) {
    const body = {
      id,
      password: convertPasswordHMAC256Old(password),
      otp,
      email
    }

    return this.postGateWay('user/verifyOtpEmail', REQUEST_TYPE.POST, body)
  }

  static async loginUser (id, password) {
    const body = {
      id, password: convertPasswordHMAC256Old(password)
    }

    return this.postGateWay('user/login_user', REQUEST_TYPE.POST, body)
  }

  static async updateRefUser (refId, isCheckOnly) {
    const body = {
      refId, isCheckOnly
    }

    return this.postGateWay('user/ref/update', REQUEST_TYPE.PUT, body)
  }

  static async updateFollowUser (followId) {
    const body = {
      followId
    }

    return this.postGateWay('user/follow/update', REQUEST_TYPE.PUT, body)
  }

  static async getListUser (idList) {
    const body = {
      idList
    }

    return this.postGateWay('user/getByList', REQUEST_TYPE.POST, body)
  }

  static async getListUserRef (idList) {
    const body = {
      idList
    }

    return this.postGateWay('user/getByListRef', REQUEST_TYPE.POST, body)
  }

  static async getListReward (idList) {
    const body = {
      idList
    }

    return this.postGateWay('reward/getByList', REQUEST_TYPE.POST, body)
  }

  static async putUpdateBuyer (id, shipInformation, address, indexReward, isCodeRequest) {
    const body = {
      id, shipInformation, address, indexReward, isCodeRequest
    }

    return this.postGateWay('reward/buyer', REQUEST_TYPE.PUT, body)
  }

  static async decodeToken () {
    return this.postGateWay('user/decodeToken', REQUEST_TYPE.POST)
  }

  static async getSignedS3 (fileType, fileName) {
    const body = {
      fileType,
      fileName
    }
    return this.postGateWay('signedS3', REQUEST_TYPE.POST, body)
  }

  static async updateUser (body) {
    return this.postGateWay('user', REQUEST_TYPE.PUT, body)
  }

  static async verifyOtpCode (id, otp, refId, uniqueDeviceId) {
    const body = {
      id, otp, refId, uniqueDeviceId
    }

    return this.postGateWay('user/verifyOtp', REQUEST_TYPE.POST, body)
  }

  static async postGateWay (url, method = REQUEST_TYPE.GET, body, queryBody, linkServer, options, onChangeSignature) {


    try {
      const serverUrl = linkServer || env.API_URL

      const token = getItemStorage(KEY_STORE.JWT_TOKEN_REDUX)
      const spamToken = '0xaeb0325a6789f597b4f7c2c4dcb36b1ba4232384ffaf7b24670b71dafc564cec'

      let queryStr = ''
      let queryFly

      if (queryBody) {
        queryBody = omitBy(queryBody, isNil)
        queryFly = QueryString.stringify(queryBody)
        queryStr = '?' + queryFly
      }

      const params = {
        method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Version: APP_VERSION,
          Authorization: token ? 'Bearer ' + token : 'Bearer',
          Source: 'C98HUWAEXMK'
          // onChainSignature: onChangeSignature || ReduxServices.getReduxState('signature')
        },
        ...options
      }

      let passwordHash = ''

      if (body) {
        params.body = JSON.stringify(body)
        // security in earn
        if (body.tokenEarn) {
          params.headers.signatureEarn = body.tokenEarn
        }
      }

      if (method !== REQUEST_TYPE.GET) {
        passwordHash = JSON.stringify(body || {})
      } else {
        passwordHash = queryBody ? QueryString.stringify(queryBody) : {}
      }

      const hashPassword = crypto.HmacSHA256(passwordHash, spamToken || '')

      params.headers.Signature = hashPassword

      const response = await fetch(serverUrl + url + queryStr, params)

      const responJson = await response.json()
      if (JSON.stringify(responJson).includes(STR_ERR)) {
        return null
      }
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

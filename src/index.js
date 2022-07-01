import get from "lodash/get"
import { CHAIN_DATA } from "./common/constants/chainData"
import { KEY_STORE } from "./common/constants/keystore"
import { setItemStorage } from "./common/function/utils"
import { SupportAPI } from "./controller/api/SupportAPI"

const CHAIN_DATA_VALUES = Object.values(CHAIN_DATA)
const SETTING_LOCAL = CHAIN_DATA_VALUES.filter(itm => itm.rpcURL).reduce((a, v) => ({ ...a, [v.chain]: v.rpcURL }), {})

export default class WalletServices {
    constructor (props) {
        this.setting = SETTING_LOCAL
        // setItemStorage(get(props, KEY_STORE.JWT_TOKEN_REDUX), KEY_STORE.JWT_TOKEN_REDUX)
    }

    async init () {
        await this.fetchSetting()
    }

    async fetchSetting () {
        return new Promise(async (resolve) => {
          try {
            setTimeout(() => {
              resolve()
            }, 1500)
            const response = await SupportAPI.getSetting()
            if (response) {
              this.setting = response
            }
            resolve()
          } catch (error) {
            resolve()
          }
        })
      }

      findSetting (chain) {
        return this.setting[chain] || get(CHAIN_DATA, `${chain}.rpcURL`)
      }
}

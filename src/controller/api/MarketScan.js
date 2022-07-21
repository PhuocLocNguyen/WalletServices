import QueryString from 'query-string'
import { getLength } from '../../common/function/utils'
import BaseAPI from './BaseAPI'

export default class MarketScan {
  static async getCoinGeckoDetail (id, symbol, isExact, signal) {
    const coinDetail = await BaseAPI.getData('coin/cgk/detail', { id, symbol, isExact }, { signal })
    return coinDetail
  }

  static getBinancePair (pair) {
    return this.fetchData('https://api.binance.com/api/v3/avgPrice?symbol=' + pair)
  }

  static async getRateCryptoCurrency (id, currency = 'usd') {
    if (getLength(id) > 0) {
      const coinPrice = await BaseAPI.getData('coin/cgk/price', { id, currency })
      return coinPrice || 0
    }
    return null
  }

  static getPolkadotChainBalance (chain, address) {
    return this.fetchData(`https://subload.coin98.services/web3/polkadot/${chain}/${address}`)
  }

  static async getChartDetailCgk (id, day = 1, interval = 3600) {
    const response = await MarketScan.fetchData(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${day}&interval=${interval}`)
    return response
  }

  static async getChartCoin (id, day = 1, interval = 3600, signal) {
    if (getLength(id) > 0) {
      try {
        const chartData = await BaseAPI.getData('coin/cgk/chart', { id, day, interval }, { signal })

        return chartData
      } catch (error) {
        return []
      }
    }
    return null
  }

  static async fetchData (queryStr) {
    const response = await fetch(queryStr)
    const responJson = await response.json()
    return responJson
  }

  static async getExchangeRateFromUSD (fiatMoney) {
    const apiLayer = {
      url: 'https://apilayer.net/api/',
      key: '3b9b4514ddc6edf4b62290299c727fa6'
    }

    try {
      const queryStr = QueryString.stringify({
        access_key: apiLayer.key,
        from: 'USD',
        to: fiatMoney,
        amount: 1,
        format: 1
      })
      const apiurl = apiLayer.url + 'convert?' + queryStr
      const response = await MarketScan.fetchData(apiurl)

      return response.result
    } catch (error) {
      return null
    }
  }
}

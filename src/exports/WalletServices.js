import get from "lodash/get"
import { CHAIN_DATA } from "../common/constants/chainData"
import { SupportAPI } from "../controller/API/SupportAPI"
import C98Balances from '../controller/ABI/C98Balances'
import { genContract, genWeb3, getTokenInfo } from "../controller/Web3/evm"
import { getItemStorage, getLength, lowerCase, setItemStorage } from '../common/function/utils'
import { convertWeiToBalance } from "../common/function"
import ERC20 from "../controller/ABI/ERC20"
import { chainType } from "../common/constants/chainType"
import BaseAPI from "../controller/API/BaseAPI"
import { COIN_IMAGE } from "../common/constants"

const CHAIN_DATA_VALUES = Object.values(CHAIN_DATA)
const SETTING_LOCAL = CHAIN_DATA_VALUES.filter(itm => itm.rpcURL).reduce((a, v) => ({ ...a, [v.chain]: v.rpcURL }), {})
export const WEB3_CHAIN = CHAIN_DATA_VALUES.filter(itm => itm.isWeb3).map(itm => itm.chain)
export const COSMOS_CHAIN = CHAIN_DATA_VALUES.filter(itm => itm.isCosmos).map(itm => itm.chain)
export const CHAIN_HAVE_TOKEN = CHAIN_DATA_VALUES.filter(itm => itm.isToken).map(itm => itm.chain)

export class WalletServices {
    constructor () {
        this.setting = SETTING_LOCAL
        this.coinLocal = null

        this.findCoingeckoData = this.findCoingeckoData.bind(this)
        this.findCoinGeckoPrice = this.findCoinGeckoPrice.bind(this)
        this.refreshFetchData = this.refreshFetchData.bind(this)
        this.checkIsReady = this.checkIsReady.bind(this)
        this.fetchSetting = this.fetchSetting.bind(this)
        this.generateData = this.generateData.bind(this)
        this.fetchInfoCoin = this.fetchInfoCoin.bind(this)
    }

    async init () {
        await this.fetchSetting()
        this.checkIsReady()
    }

    async checkIsReady () {
        try {
        WEB3_CHAIN.map(item => {
            const web3Only = genWeb3(item)
            this['web3' + item] = web3Only
    
            if (CHAIN_DATA[item].balances) {
              this['contractBalance' + item] = new web3Only.eth.Contract(C98Balances, CHAIN_DATA[item].balances)
            }
          })
          await this.refreshCoinData()
          this.refreshFetchData()
        }catch (error) {
            return false
        }
    }

    // find

    findCoingeckoData (cgkId) {
        const findInCgk = this.coinGecko.find((data) => data.id === cgkId)
        return findInCgk
      }

    findCoinGeckoPrice (cgkId) {
        const findInCgk = this.coinGecko.find((data) => data.id === cgkId)
        return get(findInCgk, 'current_price', 0)
    }
    

    getCoinFetch (chain) {
        return chain ? this.coinLocal[chain] : this.coinLocal
      }

    findCoinLocal (chain, address) {
        const listCoin = this.coinLocal[chain] || []
        return listCoin.find(item => lowerCase(item.address) === lowerCase(address))
      }
    

    findSetting (chain) {
        return this.setting[chain] || get(CHAIN_DATA, `${chain}.rpcURL`)
      }

    async fetchInfoCoin  (chain, address) {
        let info = this.findCoinLocal(chain, address)
        if (!info) {
          info = await getTokenInfo(address, chain)
        }
        return info
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
            console.log("???? ~ file: index.js ~ line 34 ~ WalletServices ~ returnnewPromise ~ error", error)
            resolve()
          }
        })
      }

      async refreshFetchData (isReloadNew) {
        return new Promise(async (resolve) => {
          if (!isReloadNew) {
            const oldData = await getItemStorage('coinGeckoPriceV2')
            if (oldData) {
              this.coinGecko = oldData
              resolve()
            }
          }
    
          const response = await SupportAPI.getCoinGecko()
          if (response) {
            setItemStorage(response, 'coinGeckoPriceV2')
            this.coinGecko = response
            resolve()
          } else {
            resolve()
          }
        })
      }

      async refreshCoinData (isReloadNew) {
        try {
          return new Promise(async (resolve) => {
             const oldDataLocal = await getItemStorage('coinFetchDataLocalV2')
    
             const mergeLocal = (tokenList) => {
                oldDataLocal.map(item => {
                  if (tokenList[item.chain]) {
                    tokenList[item.chain].push(item)
                  } else {
                    tokenList[item.chain] = [item]
                  }
                })
              }


        if (!isReloadNew) {
            const oldData = await getItemStorage('coinDataLocalV2')
            if (oldData) {
              if (getLength(oldDataLocal) > 0) {
                mergeLocal(oldData)
              }

              this.coinLocal = oldData
              resolve()
            }
          }

        // Fetch new coin local
          const response = await SupportAPI.getCoinLocal()

          if (response) {
            setItemStorage(response, 'coinDataLocalV2')
            if (getLength(oldDataLocal) > 0) {
              const filterOtherLocal = oldDataLocal.filter(itm => !(response[itm.chain] && response[itm.chain].find(res => lowerCase(res.address) === lowerCase(itm.address))))
              setItemStorage(filterOtherLocal, 'coinFetchDataLocalV2')
              mergeLocal(response, filterOtherLocal)
            }
    
            this.coinLocal = response
  
            resolve()
          } else {
            resolve()
          }
     
          })
        } catch (err) {
          console.log('Refresh CoinData ', err)
        }
      }

      async fetchWallet (addresses) {
        try {
          const totalData = []
    
          await Promise.all(addresses.map(async (item) => {
            try {
              const result = await this.generateObjectByChain(item).catch()
    
              result && Array.prototype.push.apply(totalData, result)
            } catch (error) {
              return true
            }
          }))
    
          return totalData
        } catch (error) {
          return false
        }
      }

      async fetchTokenBalance (contractAddress, address, decimalToken, chain, isGetRawAmount) {
        return new Promise(async (resolve, reject) => {
          try {
            const chainGenerate = chain
            const web3 = this['web3' + chainGenerate]
    
            if (!web3) {
              this['web3' + chainGenerate] = genWeb3(chain, false)
            }
    
            const contract = genContract(web3, ERC20, contractAddress)
    
            contract.methods.balanceOf(address).call().then(balance => {
              if (isGetRawAmount) return resolve(balance)
              if (decimalToken) {
                const tokenBalance = convertWeiToBalance(balance, decimalToken)
                resolve(tokenBalance)
              } else {
                contract.methods.decimals().call().then(decimal => {
                  const tokenBalance = convertWeiToBalance(balance, decimal)
                  resolve(tokenBalance)
                }).catch(() => {
                  const tokenBalance = convertWeiToBalance(balance, 18)
                  resolve(tokenBalance)
                })
              }
            }).catch(() => {
              resolve(0)
            })
          } catch (err) {
            resolve(0)
          }
        })
      }

      async getDataTokens (chain, address) {
        if (chain === chainType.ether) {
          const result = await BaseAPI.getData(`fetchEther/${address}`)
          return result && result.tokens ? result.tokens.map(item => ({ ...item, balance: convertWeiToBalance(item.balance, item.tokenInfo.decimals) })) : []
        } else {
          if (this['contractBalance' + chain]) {
            const result = await this.getWeb3BalancesContract(chain, address)
            return result
          } else {
            return []
          }
        }
      }

      async getWeb3BalancesContract (chain, address) {
        return new Promise(async (resolve, reject) => {
          try {
            const tokenData = this.coinLocal[chain] ? this.coinLocal[chain].filter((item) => getLength(item.address) > 0) : []
            const addressChain = tokenData.map((item) => item.address)
    
            const fetchSplit = async (start) => {
              const sliceTokenData = tokenData.slice(start, start + 500)
              return this['contractBalance' + chain].methods.balances([address], addressChain.slice(start, start + 500)).call().then(resultData => {
                const mapData = resultData.map((item, index) => {
                  const formatBalance = parseFloat(item)
                  if (formatBalance > 0) {
                    const tokenCheck = sliceTokenData[index]
                    return {
                      balance: convertWeiToBalance(formatBalance, tokenCheck.decimal),
                      tokenInfo: {
                        cgkId: tokenCheck.cgkId,
                        address: tokenCheck.address,
                        symbol: tokenCheck.symbol,
                        name: tokenCheck.name,
                        decimals: tokenCheck.decimal,
                        image: tokenCheck.image
                      }
                    }
                  } else {
                    return null
                  }
                })
    
                return mapData.filter(item => item)
              }).catch((er) => {
                return []
              })
            }
            const fullResponse = []
    
            for (let i = 0; i < addressChain.length; i += 500) {
              const data = await fetchSplit(i)
              Array.prototype.push.apply(fullResponse, data)
            }
            resolve(fullResponse)
          } catch (error) {
            resolve([])
          }
        })
      }

      async fetchMainBalance (address, chain) {
        return new Promise(async (resolve, reject) => {
          try {
            this['web3' + chain].eth.getBalance(address).then(async (response) => {
              resolve(convertWeiToBalance(response))
            }).catch((errr) => {
              resolve(0)
            })
          } catch (error) {
            resolve(0)
          }
        })
      }

      async fetchInitial (address, chain, wallet) {
        return new Promise(async (resolve, reject) => {
          try {
            resolve(await this.fetchMainBalance(address, chain, undefined, undefined, false, wallet))
          } catch (error) {
            resolve(0)
          }
        })
      }

      async generateObjectByChain (dataChain) {
        try {
          const finalData = []
    
          const { address, chain } = dataChain
    
          // Main Coin
          const balance = await this.fetchInitial(address, chain, dataChain)
    
          if (!balance && balance !== 0) {
            return null
          }
    
          if (CHAIN_DATA[chain].isToken) {
            // Get Token Data
            const tokenData = await this.getDataTokens(chain, address)
    
            if (getLength(tokenData) > 0) {
              const tokenList = tokenData.map(item => {
                let infoCoin = item.tokenInfo
                let balance = item.balance
    
                if (chain === chainType.ether) {
                  const coinLower = lowerCase(infoCoin.address)
                  const findDataCoin = this.coinLocal.ether.find(coinData => lowerCase(coinData.address) === coinLower)
                  balance = convertWeiToBalance(balance, infoCoin.decimals)
                  if (balance === 0) {
                    return null
                  }
    
                  if (findDataCoin) {
                    infoCoin = findDataCoin
                    infoCoin.decimals = infoCoin.decimal
                  } else {
                    infoCoin.image = getLength(infoCoin.image) > 0 ? `https://ethplorer.io${infoCoin.image}` : COIN_IMAGE.ETH_GRAY
                  }
                }
    
                if (!infoCoin || getLength(infoCoin.symbol) === 0) {
                  return null
                }
    
                return this.generateData({
                  // Info Data use for token
                  price: typeof (infoCoin.price) === 'object' ? infoCoin.price.rate : (getLength(infoCoin.cgkId) > 0 ? 0 : infoCoin.price),
                  decimal: infoCoin.decimals,
                  cgkId: infoCoin.cgkId,
                  name: infoCoin.name,
                  image: infoCoin.image,
                  symbol: infoCoin.symbol,
                  // Cosmos chain only
                  denom: infoCoin.denom,
                  // Other Data for main coin and token
                  chain,
                  balance,
                  baseAddress: item.baseAddress,
                  walletAddress: address,
                  address: infoCoin.address
                })
              }).filter(item => item)
    
              Array.prototype.push.apply(finalData, tokenList)
            }
          }
    
          return finalData
        } catch (error) {
          console.log(error)
        }
      }

      generateData (dataGen, isMainCoin) {
        const { chain, balance, baseAddress, bnbId, walletAddress, address, locked, frozen } = dataGen
    
        let decimal = dataGen.decimal
        let cgkId = dataGen.cgkId
        let symbol = dataGen.symbol
        let name = dataGen.name
        let image = dataGen.image
        let priceChange24h = 0
        let marketCap = 0
        let circulatingSupply = 0
        let maxSupply = 0
        let volume = 0
        let price = dataGen.price
        let denom = dataGen.denom
    
        // Data fixed for Main Coin
        // [Reason] Important data need fixed
        const chainData = CHAIN_DATA[chain] || CHAIN_DATA.custom
        if (isMainCoin) {
          cgkId = chainData.id
          symbol = chainData.symbol
          name = chainData.name
          image = chainData.imageLink
          decimal = chainData.decimal || 18
          denom = chainData.denom
        }
    
        const findInCgk = this.coinGecko.find(data => data.id === cgkId)
    
        // Data from Coingecko
        if (findInCgk) {
          priceChange24h = findInCgk.price_change_percentage_24h
          volume = findInCgk.total_volume
          price = findInCgk.current_price
          marketCap = findInCgk.market_cap
          circulatingSupply = findInCgk.circulating_supply
          maxSupply = findInCgk.total_supply
        }
    
        return {
          bnbId,
          decimal,
          price_change_percentage_24h: priceChange24h || 0,
          cgkId,
          _id: address + symbol + name + walletAddress + baseAddress,
          symbol,
          name,
          image: getLength(image) > 0 ? image : undefined,
          price: price || 0,
          fiatBalance: price * balance || 0,
          btcPrice: price / this.btcPrice || 0,
          chain,
          ethPrice: price / this.ethPrice || 0,
          balance: parseFloat(balance) || 0,
          baseAddress, // Solana main SOL address
          walletAddress, // Wallet address
          address, // Token address
          volume: parseFloat(volume) || 0,
          market_cap: marketCap || 0,
          circulating_supply: circulatingSupply || 0,
          max_supply: maxSupply || 0,
          denom,
          locked,
          frozen
        }
      }

      // validateBlockChainAddress = (address) => {
      //   const reg = /^(0x)[0-9A-Fa-f]{40}$/
      //   return reg.test(address)
      // }
      
}

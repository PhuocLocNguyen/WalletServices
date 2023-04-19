import get from "lodash/get"
import { CHAIN_DATA } from "../common/constants/chainData"
import { SupportAPI } from "../controller/API/SupportAPI"
import C98Balances from '../controller/ABI/C98Balances'
import { genContract, genWeb3, getTokenInfo } from "../controller/Web3/evm"
import { getItemStorage, getLength, lowerCase, setItemStorage } from '../common/function/utils'
import { convertWeiToBalance, renderAMMImage, scientificToDecimal, splitAddress, upperCase } from "../common/function"
import ERC20 from "../controller/ABI/ERC20"
import { chainType } from "../common/constants/chainType"
import BaseAPI from "../controller/API/BaseAPI"
import { ADDRESS_MAIN_COIN, COIN_IMAGE } from "../common/constants"
import { KEY_STORE } from "../common/constants/keystore"
import ERC721 from "../controller/ABI/ERC721"
import { fetchSPLAccount, genConnectionSolana, parseTokenAccountData, solanaGetBalance } from "../exports/Solana"
import { PublicKey } from '@solana/web3.js'

const CHAIN_DATA_VALUES = Object.values(CHAIN_DATA)
const SETTING_LOCAL = CHAIN_DATA_VALUES.filter(itm => itm.rpcURL).reduce((a, v) => ({ ...a, [v.chain]: v.rpcURL }), {})
export const WEB3_CHAIN = CHAIN_DATA_VALUES.filter(itm => itm.isWeb3).map(itm => itm.chain)
export const COSMOS_CHAIN = CHAIN_DATA_VALUES.filter(itm => itm.isCosmos).map(itm => itm.chain)
export const CHAIN_HAVE_TOKEN = CHAIN_DATA_VALUES.filter(itm => itm.isToken).map(itm => itm.chain)
const SUPPORTED_NFT = CHAIN_DATA_VALUES.filter(itm => itm.isSupportedNFT).map(itm => itm.chain)

export class WalletServices {
    constructor () {
        this.setting = SETTING_LOCAL
        this.coinLocal = {}
        this.solanaToken = null

        this.findCoingeckoData = this.findCoingeckoData.bind(this)
        this.findCoinGeckoPrice = this.findCoinGeckoPrice.bind(this)
        this.refreshFetchData = this.refreshFetchData.bind(this)
        this.checkIsReady = this.checkIsReady.bind(this)
        this.fetchSetting = this.fetchSetting.bind(this)
        this.generateData = this.generateData.bind(this)
        this.fetchInfoCoin = this.fetchInfoCoin.bind(this)
        this.fetchBalanceByChain = this.fetchBalanceByChain.bind(this)
        this.refreshInformationNFT = this.refreshInformationNFT.bind(this)
        this.fetchNFT = this.fetchNFT.bind(this)
        this.fetchNFTEVMBalances = this.fetchNFTEVMBalances.bind(this)
        this.getTokenSolanaAddress = this.getTokenSolanaAddress.bind(this)
        this.fetchAllowance = this.fetchAllowance.bind(this)


    }

    async init () {
        await this.fetchSetting()
        this.checkIsReady()
    }

    async checkIsReady ({isNoNFT, isSolana}) {
        try {
        WEB3_CHAIN.map(item => {
            const web3Only = genWeb3(item)
            this['web3' + item] = web3Only
    
            if (CHAIN_DATA[item].balances) {
              this['contractBalance' + item] = new web3Only.eth.Contract(C98Balances, CHAIN_DATA[item].balances)
            }
          })
          !isNoNFT && this.refreshInformationNFT()
          await this.refreshCoinData()
          await this.refreshFetchData()
          isSolana ? await this.refreshCoinSolana() :  ''
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

    getCoinSolana () {
        return this.solanaToken
      }
    
    findCoinSolana (fMint) {
        const findCoin = this.solanaToken.find(dataCoin => get(dataCoin, 'mintAddress', get(dataCoin, 'address')) === fMint)
        return findCoin
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

  async refreshCoinSolana () {
    const oldData = await getItemStorage('solanaTokenV2')
    this.solanaToken = oldData

    const response = await BaseAPI.getData('solanaToken')
    if (response) {
      setItemStorage(response, 'solanaTokenV2')
      this.solanaToken = response
    }
  }

     
  async refreshInformationNFT () {
    return new Promise(async (resolve, reject) => {
      const nftStorage = await getItemStorage(KEY_STORE.SET_NFT_INFORMATION)
      if (nftStorage) {
        this.nftInformation = nftStorage
        resolve()
      }

      const fetchData = await BaseAPI.getData('nft/supported/v2')
      if (fetchData) {
        setItemStorage(fetchData, KEY_STORE.SET_NFT_INFORMATION)
        this.nftInformation = fetchData
      }
      resolve()
    })
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
            console.log("🚀 ~ file: index.js ~ line 34 ~ WalletServices ~ returnnewPromise ~ error", error)
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


      async getTokenSolanaAddress (address) {
        try {
          const connection = genConnectionSolana()
    
          const balanceSOL = convertWeiToBalance(await connection.getBalance(new PublicKey(address)), 9)
    
          const accountToken = await connection.getTokenAccountsByOwner(new PublicKey(address),
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') })
          if (getLength(accountToken.value) > 0) {
            const allAccount = accountToken.value.map(item => {
              const { amount, mint } = parseTokenAccountData(item.account.data)
    
              const fMint = mint.toString()
    
              const findCoinDecimals = this.solanaToken.find(dataCoin => dataCoin.mintAddress === fMint)
    
              const coinDecimal = findCoinDecimals ? (findCoinDecimals.decimals || 6) : 6
    
              const amountToken = parseFloat(convertWeiToBalance(amount, coinDecimal))
    
              if (amountToken > 0) {
                const findCoin = this.solanaToken.find(dataCoin => dataCoin.mintAddress === fMint)
    
                if (findCoin && findCoin.symbol !== 'SOL') {
                  return {
                    tokenInfo: {
                      cgkId: findCoin.id,
                      address: fMint,
                      symbol: findCoin.symbol,
                      name: findCoin.name,
                      decimals: coinDecimal,
                      image: findCoin.icon
                    },
                    baseAddress: item.pubkey.toString(),
                    balance: amountToken
                  }
                }
                return null
              } else {
                return null
              }
            })
    
            const finalData = allAccount.filter(item => item)
    
            return [{ tokenInfo: { symbol: 'SOL' }, balance: balanceSOL }, ...finalData]
          } else {
            return [{ tokenInfo: { symbol: 'SOL' }, balance: balanceSOL }]
          }
        } catch (error) {
          console.log('🚀 ~ file: WalletServices.js ~ line 1132 ~ WalletServices ~ getTokenSolanaAddress ~ error', error)
          return null
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

       async fetchTokenBalance (contractAddress, address, decimalToken, chain, solTokenAddress, chainCustom, isGetRawAmount) {
        return new Promise(async (resolve, reject) => {
          try {

            if (chain === chainType.solana) {
              const splAccountAddress = solTokenAddress || await fetchSPLAccount({ address }, contractAddress)
      
              const amount = await solanaGetBalance(splAccountAddress, true, null, isGetRawAmount)
              resolve(amount)
            }else{
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
            }

            
          } catch (err) {
            resolve(0)
          }
        })
      }

      async getDataTokens (chain, address, listToken) {
        if (chain === chainType.ether) {
          const result = await BaseAPI.getData(`fetchEther/${address}`)
          return result && result.tokens ? result.tokens.map(item => ({ ...item, balance: convertWeiToBalance(item.balance, item.tokenInfo.decimals) })) : []
        } else {
          if (this['contractBalance' + chain]) {
            const result = await this.getWeb3BalancesContract(chain, address, listToken)
            return result
          } else {
            return []
          }
        }
      }

      async getWeb3BalancesContract (chain, address, listToken) {
        return new Promise(async (resolve, reject) => {
          try {
            const tokenData = listToken || (this.coinLocal[chain] ? this.coinLocal[chain].filter((item) => getLength(item.address) > 0) : [])
            const addressChain = tokenData.map((item) => item.address.trim())
    
            const fetchSplit = async (start) => {
              const sliceTokenData = tokenData.slice(start, start + 500)
              return this['contractBalance' + chain].methods.balances([address], addressChain.slice(start, start + 500)).call().then(resultData => {
                const mapData = resultData.map((item, index) => {
                  const formatBalance = parseFloat(item)
                  if (formatBalance > 0) {
                    const tokenCheck = sliceTokenData[index]
                    const decimals = tokenCheck.decimal || tokenCheck.decimals
                    
                    return {
                      balance: convertWeiToBalance(formatBalance, tokenCheck.decimal),
                      tokenInfo: {
                        cgkId: tokenCheck.cgkId || tokenCheck.id,
                        address: tokenCheck.address,
                        symbol: tokenCheck.symbol,
                        name: tokenCheck.name,
                        decimals,
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

       async fetchBalanceByChain (chain, wallet, selectedToken, bnbId) {
        if (!wallet || (wallet && getLength(Object.keys(wallet)) === 0)) {
          return 0
        }
    
        let balance = 0
        if (selectedToken && getLength(selectedToken.address) > 0 && chain !== chainType.terra) {
          balance = await this.fetchTokenBalance(selectedToken.address,
            selectedToken.walletAddress || wallet.address, selectedToken.decimal, chain, selectedToken.baseAddress, wallet.chainCustom)
        } else {
          balance = await this.fetchMainBalance(wallet.address, chain, bnbId, selectedToken ? selectedToken.denom : (chain === chainType.terra ? 'uluna' : ''), false, wallet)
        }
    
        let realBalance = 0
        if (balance) {
          if (chain === chainType.binance) {
            if (balance.free) {
              realBalance = balance
            }
            if (balance[0] && balance[0].symbol) {
              realBalance = balance[0]
            }
          } else {
            realBalance = scientificToDecimal(balance)
          }
        }
    
        return realBalance
      }

      async fetchMainBalance (address, chain) {
        return new Promise(async (resolve, reject) => {
          try {

            if (chain === chainType.solana) {
              const connectionSolana = genConnectionSolana()
              const balance = await connectionSolana.getBalance(new PublicKey(address))
              resolve(convertWeiToBalance(balance, 9))
            } else{

              let block = 'latest'
              this['web3' + chain].eth.getBalance(address).then(async (response) => {
                resolve(convertWeiToBalance(response))
              }).catch((errr) => {
                resolve(0)
              })
            }

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
          const chainData = CHAIN_DATA[chain]
    
          finalData.push({
            price: this.findCoinGeckoPrice(chainData.id),
            address: ADDRESS_MAIN_COIN[chain],
            cgkId: chainData.id,
            symbol: chainData.symbol,
            name: chainData.name,
            image: chainData.imageLink,
            decimals: chainData.decimal || 18,
            denom: chainData.denom,
            balance: balance || 0
          })
          
    
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


      async fetchNFT (walletRedux) {
        const findWallet =  walletRedux.filter(itm => itm.isActive && SUPPORTED_NFT.includes(itm.chain))
        if (getLength(findWallet) > 0) {
          const walletFull = findWallet.map(itm => { return { address: itm.address, chain: itm.chain } })
          const fetchData = await BaseAPI.postData('nft/accountV2', { isV2: true, data: walletFull }).catch()
    
          // Fetch on local device
          if (this.nftInformation) {
            const otherChain = this.nftInformation.other
            const solanaChain = this.nftInformation.solana
    
            const dataMap = Object.keys(otherChain)
            const finalData = await Promise.all(dataMap.map(async (itm) => {
              const gameSupported = otherChain[itm]
    
              if (!gameSupported.isSupported) return false
    
              try {
                const gameChainFinal = await Promise.all(gameSupported.chain.map(async (gameChain) => {
                  const findWallet = walletFull.find(wl => wl.chain === gameChain.chain)
                  if (!findWallet) return null
                  if (WEB3_CHAIN.includes(gameChain.chain)) {
                    const data = await this.fetchNFTEVMBalances(gameChain.chain, findWallet.address, gameChain.address, gameSupported.tokenID, gameChain.multiple, gameSupported.key)
                    if (getLength(data) === 0) return null
                    return data
                  }
                }))
    
                let fmtData = gameChainFinal.filter(itm => itm)
                fmtData = [].concat.apply([], fmtData)
    
                if (getLength(fmtData) === 0) return null
    
                return {
                  key: itm,
                  sizeCover: gameSupported.sizeCover,
                  size: gameSupported.size,
                  isCover: gameSupported.isCover,
                  isCoverLogo: gameSupported.isCoverLogo,
                  link: gameSupported.link,
                  logo: gameSupported.logo,
                  name: gameSupported.name,
                  data: fmtData,
                  total: getLength(fmtData)
                }
              } catch (error) {
                return null
              }
            }))
    
            let finalDataSolana = []
    
            // try {
            //   const findWalletSolana = walletFull.find(wl => wl.chain === chainType.solana)
            //   if (findWalletSolana) {
            //     const dataSolana = await this.getSolanaNFT(findWalletSolana.address, solanaChain).catch()
    
            //     if (dataSolana) {
            //       finalDataSolana = Object.keys(dataSolana).map(key => {
            //         const gameInfo = solanaChain[key]
            //         return {
            //           key,
            //           size: get(gameInfo, 'size', { height: 14, width: 43 }),
            //           isCover: get(gameInfo, 'isCover', true),
            //           isCoverLogo: get(gameInfo, 'isCoverLogo', true),
            //           sizeCover: get(gameInfo, 'sizeCover'),
            //           link: get(gameInfo, 'link'),
            //           logo: get(gameInfo, 'logo', 'https://coin98.s3.ap-southeast-1.amazonaws.com/NFT/solanaDefault.png'),
            //           name: get(gameInfo, 'name', 'Solana NFT'),
            //           data: dataSolana[key],
            //           total: getLength(dataSolana[key])
            //         }
            //       })
            //     }
            //   }
            // } catch (error) {
            //   console.log('Load solana nft error ', error)
            // }
            const resultData = []
    
            if (getLength(finalData) > 0) {
              Array.prototype.push.apply(resultData, finalData.filter(itm => itm))
            }
            if (getLength(finalDataSolana) > 0) {
              Array.prototype.push.apply(resultData, finalDataSolana.filter(itm => itm))
            }
    
            Array.prototype.push.apply(resultData, fetchData)
    
            // ReduxServices.callDispatchAction(StorageReduxAction.setNFT(resultData))
            return resultData
          }
        } else {
          // ReduxServices.callDispatchAction(StorageReduxAction.setNFT([]))
          return []
        }
      }

      async fetchNFTEVMBalances (chain, owner, contractAddress, gameID, multipleAddress, keyGame) {
        try {
          const web3BSC = this['web3' + chain]
    
          if (multipleAddress) {
            let finalMultiple = await Promise.all(multipleAddress.map(async (item) => {
              const data = await this.fetchNFTEVMBalances(chain, owner, item.address, item.key)
              return data
            }))
    
            finalMultiple = finalMultiple.filter(itm => itm)
            if (getLength(finalMultiple) > 0) {
              finalMultiple = [].concat.apply([], finalMultiple)
              return finalMultiple
            } else {
              return []
            }
          }
    
          const payload = []
          const contract = new web3BSC.eth.Contract(ERC721, contractAddress)
          const totalAsset = await contract.methods.balanceOf(owner).call()
          const endNum = parseFloat(totalAsset)
    
          if (endNum > 0) {
            for (let i = 0; i < endNum; i++) {
              const tokenID = await contract.methods.tokenOfOwnerByIndex(owner, i).call()
    
              payload.push({
                id: tokenID,
                address: contractAddress,
                image: '',
                chain,
                name: ''
              })
            }
    
            const payloadInfo = await BaseAPI.postData('eco/nfts/info', {
              data: payload.map(item => {
                return {
                  chain,
                  key: keyGame,
                  id: item.id
                }
              })
            }).catch()
    
            const finalMapInfo = payload.map(item => {
              if (payloadInfo) {
                const findInfo = payloadInfo.find(info => get(info, 'tokenId', '').toString() === item.id.toString())
                if (findInfo) {
                  item.image = get(findInfo, 'tokenInfo.image')
                  item.name = get(findInfo, 'tokenInfo.name') || upperCase(gameID) + ` #${item.id}`
                  return item
                }
              }
              return item
            })
    
            return finalMapInfo
          }
          return []
        } catch (error) {
          return []
        }
      }

      async fetchAllowance (address, chain, tokenListCheck, spender, contractType) {
        return new Promise(async (resolve, reject) => {
          if (WEB3_CHAIN.includes(chain)) {
            const tokenData = this.coinLocal[chain]
            this['contractBalance' + chain].methods.allowances([address], tokenListCheck, spender).call().then(async (resultData) => {
              const mapData = resultData.map(async (item, index) => {
                if (item === '0') return null
                const tokenAddress = tokenListCheck[index]
                const tokenCheck = tokenData.find(itm => lowerCase(itm.address) === lowerCase(tokenAddress))
    
                const data = {
                  _id: spender[index] + tokenAddress + chain,
                  chain,
                  balance: item,
                  type: contractType[index] || { address: spender[index], name: splitAddress(spender[index], false, 5) },
    
                  tokenInfo: {
                    address: tokenAddress,
                    decimals: 18,
                    image: renderAMMImage({ address: tokenAddress }, chain)
                  }
                }
                if (tokenCheck) {
                  data.tokenInfo = {
                    cgkId: tokenCheck.cgkId,
                    address: tokenCheck.address,
                    symbol: tokenCheck.symbol,
                    name: tokenCheck.name,
                    decimals: tokenCheck.decimal,
                    image: tokenCheck.image
                  }
                } else {
                  const tokenInfo = await getTokenInfo(tokenAddress, chain)
                  if (tokenInfo) {
                    data.tokenInfo = {
                      address: tokenAddress,
                      symbol: tokenInfo.symbol,
                      name: tokenInfo.name,
                      decimals: tokenInfo.decimals,
                      image: renderAMMImage({ address: tokenAddress }, chain)
                    }
                  }
                }
                return data
              })
              const finalReturn = await Promise.all(mapData)
    
              resolve(finalReturn.filter(item => item))
            }).catch((err) => {
              resolve([])
            })
          }
        })
      }
    

}

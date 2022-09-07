import Web3 from 'web3'
import { CHAIN_STANDARD } from '../../common/constants'
import { CHAIN_DATA } from '../../common/constants/chainData'
import { chainType } from '../../common/constants/chainType'
import { getLength, lowerCase } from '../../common/function/utils'
import ERC20 from '../ABI/ERC20'
const { default: Resolution } = require('@unstoppabledomains/resolution')
const resolution = new Resolution()
const bip39 = require('bip39')
const bs58 = require('bs58')

export const generateSeed = async (mnemonic) => {
  const seed = await bip39.mnemonicToSeed(mnemonic)
  return seed
}
export const convertBase58 = (secretKey, isDecode) => {
  return isDecode
    ? bs58.decode(secretKey)
    : bs58.encode(Buffer.from(secretKey, 'hex'))
}

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const genWeb3 = (chain, isProvider, rpcLink) => {
    let provider
    const options = {}
  
    if (rpcLink) {
      provider = rpcLink
    } else {
      provider = window.wallet.findSetting(chain)
      if (chain === chainType.klaytn) {
        options.headers = [
          {
            name: 'Origin',
            value: 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn'
          }
        ]
      }
    }
  
    if (chain === 'rinkeby') {
      provider = 'https://rinkeby.infura.io/v3/92d53cee52834368b0fabb42fa1b5570'
    }
  
    if (chain === 'binanceSmartTest') {
      provider = 'https://data-seed-prebsc-1-s1.binance.org:8545'
    }
  
    const web3 = new Web3()
    web3.setProvider(new web3.providers.HttpProvider(provider, options))
  
    return web3
  }


export const unstopDomainResolver = (domain, chain, currency) => {
  return new Promise(resolve => {
    resolution.addr(domain, currency).then(addr => resolve(addr)).catch(() => {
      const resolveSymbol = `${currency}${CHAIN_STANDARD[chain] ? `_${CHAIN_STANDARD[chain]}` : ''}`
      resolution.addr(domain, resolveSymbol).then(addr => resolve(addr)).catch(() => {
        const lastSymbol = CHAIN_DATA[chain].symbol
        resolution.addr(domain, lastSymbol).then(addr => resolve(addr)).catch(() => resolve(ZERO_ADDRESS))
      })
    })
  })
}

  export const genContract = (web3, minABI, contractAddress) => {
    return new web3.eth.Contract(minABI, contractAddress)
  }

  export const getTokenInfo = (contractAddress, chain = chainType.ether) => {
    return new Promise(async (resolve, reject) => {
      try {
        const findLocal = window.wallet.getCoinFetch(chain)
  
        if (getLength(findLocal) > 0) {
          const findData = findLocal.find(it => lowerCase(it.address) === lowerCase(contractAddress))
          if (findData) {
            return resolve({
              chain,
              address,
              name: findData.name,
              image: findData.image,
              symbol: findData.symbol,
              decimals: findData.decimal
            })
          }
        }
  
        const web3 = genWeb3(chain)
        const contract = genContract(web3, ERC20, contractAddress)
  
        contract.methods.symbol().call().then(symbol => {
          contract.methods.name().call().then(name => {
            contract.methods.decimals().call().then(decimals => {
              resolve({address: contractAddress, name, decimals, symbol, chain })
            }).catch(() => {
              resolve({address: contractAddress, name, decimals: 18, symbol, chain })
            })
          }).catch(() => {
            resolve({ name: '', decimals: 18, symbol, chain })
          })
        }).catch(() => {
          resolve(false)
        })
      } catch (error) {
        resolve(false)
      }
    })
  }

  export const getGasPrice = async (web3, chain) => {
    const web3Run = web3 || genWeb3(chain)
    const gasPrice = await web3Run.eth.getGasPrice()
    return gasPrice
  }



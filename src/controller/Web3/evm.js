import Web3 from 'web3'
import { chainType } from '../../common/constants/chainType'
import { getLength, lowerCase } from '../../common/function/utils'
import ERC20 from '../ABI/ERC20'


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
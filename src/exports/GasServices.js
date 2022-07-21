import get from 'lodash/get'
import { CHAIN_DATA } from '../common/constants/chainData'
import { chainType } from '../common/constants/chainType'
import { KEY_STORE } from '../common/constants/keystore'
import { convertBalanceToWei, convertWeiToBalance } from '../common/function'
import { getItemStorage, getLength, setItemStorage } from '../common/function/utils'
import BaseAPI from '../controller/API/BaseAPI'
import { ALGORAND_MIN_TX_FEE } from '../controller/Library/Local/algo/constants'
import { getGasPrice } from '../controller/Web3/evm'

// const BlueElectrum = require('../controller/Blockchain/BlueElectrum')

export class GasServices {
  // Get and cached new ether gas
  static async getGasEther (isGetNew) {
    const getCache = isGetNew ? false : await getItemStorage(KEY_STORE.FEE_TXS)

    if (getCache) {
      const gasFull = await BaseAPI.getData('cryptoData/ethGas', { chain: chainType.ether })
      if (gasFull) {
        setItemStorage(gasFull, KEY_STORE.FEE_TXS)
      }
      return gasFull
    } else {
      const gasFull = await BaseAPI.getData('cryptoData/ethGas', { chain: chainType.ether })
      if (gasFull) {
        setItemStorage(gasFull, KEY_STORE.FEE_TXS)
      }
      return gasFull
    }
  }

//   static async getGasSendBTC (isBech32) {
//     let feeBitCoin = await BlueElectrum.estimateFees(true, isBech32)
//     const maxFee = isBech32 ? 10 : 1500
//     feeBitCoin = parseFloat(feeBitCoin) > maxFee ? maxFee : feeBitCoin
//     return [Math.floor(feeBitCoin * 0.8).toFixed(0), Math.floor(feeBitCoin).toFixed(0), Math.floor(feeBitCoin * 1.2).toFixed(0)]
//   }

  static async get (chain, isGetNew, isGetWithText) {
    // Ether will get from etherscan or ethgas station
    // Bitcoin will get from library
    // Other chain get from setting database
    // if (chain === chainType.bitcoin) {
    //   let feeBitCoin = await BlueElectrum.estimateFees()

    //   feeBitCoin = parseFloat(feeBitCoin) > 10 ? 10 : feeBitCoin

    //   return isGetWithText
    //     ? {
    //       low: convertWeiToBalance(Math.floor(feeBitCoin) * 400, 8),
    //       standard: convertWeiToBalance(Math.floor(feeBitCoin * 1.5) * 400, 8),
    //       fast: convertWeiToBalance(Math.floor(feeBitCoin * 2) * 400, 8)
    //     }

    //     : { low: Math.floor(feeBitCoin * 0.8).toFixed(0), standard: Math.floor(feeBitCoin).toFixed(0), fast: Math.floor(feeBitCoin * 1.2).toFixed(0) }
    // }

    const isEtherChain = chain === chainType.ether
    const isKlaytn = chain === chainType.klaytn

    const standardGas =
        isEtherChain
          ? { ether: await GasServices.getGasEther(isGetNew) }
        //   : (isGetNew ? await BaseAPI.getConfigByType('standardGwei') : ReduxService.genGasStandard())
          : await BaseAPI.getConfigByType('standardGwei')

    const gasSelect = (standardGas && standardGas[chain]) ? standardGas[chain] : parseFloat(convertWeiToBalance(await getGasPrice(undefined, chain), 9))

    if (isKlaytn) {
      return {
        standard: gasSelect,
        fast: gasSelect,
        fastest: gasSelect,
        gaswar: gasSelect,
        starwar: gasSelect
      }
    }

    const isLowerDecimal = gasSelect < 1
    const numFixed = isLowerDecimal ? 4 : 2

    return isEtherChain
      ? gasSelect
      : {
        standard: parseFloat((gasSelect * 1).toFixed(numFixed)),
        fast: parseFloat((gasSelect * 1.1).toFixed(numFixed)),
        fastest: parseFloat((gasSelect * 1.3).toFixed(numFixed)),
        gaswar: parseFloat((gasSelect * 1.7).toFixed(numFixed)),
        starwar: parseFloat((gasSelect * 3).toFixed(numFixed))
      }
  }

  static async getFee (selectedToken, gasLimit, gasPrice) {
    const chain = selectedToken.chain
    const chainSelected = CHAIN_DATA[selectedToken.chainCustom ? chainType.custom : selectedToken.chain]

    const isSendToken = getLength(selectedToken.address) > 0

    if (selectedToken.denom && selectedToken.chain !== chainType.terra && selectedToken.chain !== chainType.terra2) {
      const chainInfo = await window.wallet.getCosmosConfig(selectedToken.chain)
      const feeAverage = get(chainInfo, 'gasPriceStep.average', 0)
      return feeAverage
    }

    if (chainSelected.chain === chainType.custom || chainSelected.isWeb3) {
      return convertWeiToBalance(gasLimit * gasPrice, 9)
    }

    if (chain === chainType.bitcoin) {
      return gasPrice
    }

    if (chain === chainType.tron) {
      // Estimate enegry for sending tron data
      // Send TRX fixed at 0.1
      if (isSendToken) {
        // Is TRC10
        const isTRC10 = !isNaN(selectedToken.address)

        if (isTRC10) {
          return 0
        } else {
          const fee = await window.wallet.tronClient.trx.getChainParameters()
          const estFee = convertBalanceToWei(1 / fee.find(item => item.key === 'getEnergyFee').value, 6)
          return 29631 / estFee
        }
      }
      return 0
    }

    if (chainSelected.feeDefault) {
      return chainSelected.feeDefault
    }

    if (chain === chainType.avaxX) {
      // Avax-X fixed at 0.001 on every transaction
      return 0.001
    }

    if (chain === chainType.secretNetwork) {
      // Need estimated fee in here
      return 0.02
    }

    if (chain === chainType.solana) {
      // Solana fixed at 0.000005 on every transaction
      return 0.000005
    }

    if (chain === chainType.kusama) {
      // Kusama fixed at 0.0026 on every transaction
      return 0.0026
    }
    if (chain === chainType.polkadot) {
      // Polkadot fixed at 0.016 on every transaction
      return 0.016
    }

    if (chain === chainType.near) {
      return 0.001
    }

    if (chain === chainType.terra || chain === chainType.terra2) {
      const standardGwei = await BaseAPI.getConfigByType('standardGwei')
      if (standardGwei[chain]) {
        return standardGwei[chain]
      }
    }

    if (chain === chainType.ton) {
      return window.wallet.tonClient.estimateGas()
    }

    if (chain === chainType.functionX) {
      return 0.8
    }

    if (chainSelected.isCosmos) {
      // Need estimated fee in here
      return 0.0025
    }

    if (chain === chainType.theta) {
      return 0.3
    }

    if (chain === chainType.algorand) {
      return ALGORAND_MIN_TX_FEE
    }

    return 0
  }

  // App only using for get language for gas
  static async getGasWithText (chain, isGetNew) {
    const fullGas = await GasServices.get(chain, isGetNew, true)

    let subName = ' Gwei '
    switch (chain) {
    case chainType.bitcoin:
      subName = ' '
      break
    }

    const gasFullData = [
        { key: 'lowest', value: fullGas.lowest, label: 'slowest', subLabel: subName + fullGas.lowest },
        { key: 'low', value: fullGas.low, label: 'slow', subLabel: subName + fullGas.low },
        { key: 'standard', value: fullGas.standard, label: 'standard', subLabel: subName + fullGas.standard },
        { key: 'fast', value: fullGas.fast, label: 'fast', subLabel: subName + fullGas.fast },
        { key: 'fastest', value: fullGas.fastest, label: 'fastest', subLabel: subName + fullGas.fastest },
        { key: 'gaswar', value: fullGas.gaswar, label: 'gasWar', subLabel: subName + fullGas.gaswar },
        { key: 'starwar', value: fullGas.starwar, label: 'starWar', subLabel: subName + fullGas.starwar }
    ]

    const data = gasFullData.filter(item => fullGas[item.key])
    return { data, index: data.findIndex(itm => itm.key === 'standard') }
  }

  static async getGasByType (chain, isGetNew, type = 'standard') {
    const fullGas = await GasServices.get(chain, isGetNew)
    return fullGas[type] || 25
  }
}

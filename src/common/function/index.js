import bigdecimal from 'bigdecimal'
import { convertCheckSUM } from '../../controller/Web3/evm'
import { chainType } from '../constants/chainType'


export const upperCase = (value) => {
  return value ? (value.toLowerCase() === 'wsol' ? 'wSOL' : value.toUpperCase()) : value
}

export const roundingNumber = (number, rounding = 7) => {
  const powNumber = Math.pow(10, parseInt(rounding))
  const fmtNumber = scientificToDecimal(Math.floor(number * powNumber) / powNumber)

  return isNaN(fmtNumber) ? 0 : fmtNumber
}

export const getLength = (value) => {
  return value ? value.length : 0
}

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const genDefaultBech32Config = chain => {
    return {
      bech32PrefixAccAddr: chain,
      bech32PrefixAccPub: chain + 'pub',
      bech32PrefixValAddr: chain + 'valoper',
      bech32PrefixValPub: chain + 'valoperpub',
      bech32PrefixConsAddr: chain + 'valcons',
      bech32PrefixConsPub: chain + 'valconspub'
    }
  }

  export const convertBalanceToWei = (strValue, iDecimal = 18) => {
    try {
      const multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal))
      const convertValue = new bigdecimal.BigDecimal(String(strValue))
      return multiplyNum.multiply(convertValue).toString().split('.')[0]
    } catch (err) {
      return 0
    }
  }

  export const convertWeiToBalance = (strValue, iDecimal = 18) => {
    try {
      if (parseFloat(strValue) === 0) return 0;
      const multiplyNum = new bigdecimal.BigDecimal(Math.pow(10, iDecimal));
      const convertValue = new bigdecimal.BigDecimal(String(strValue));
      return convertValue.divide(multiplyNum).toString();
    } catch (err) {
      return 0;
    }
  };

  
export const convertPasswordHMAC256Old = (password) => {
  const hashPassword = crypto.HmacSHA256(password, 'coin98_token')
  const hexhash = crypto.enc.Hex.stringify(hashPassword)
  return hexhash
}

export const scientificToDecimal = (num) => {
  const sign = Math.sign(num)
  // if the number is in scientific notation remove it
  // eslint-disable-next-line no-useless-escape
  if (/\d+\.?\d*e[\+\-]*\d+/i.test(num)) {
    const zero = '0'
    const parts = String(num).toLowerCase().split('e') // split into coeff and exponent
    const e = parts.pop() // store the exponential part
    let l = Math.abs(e) // get the number of zeros
    const direction = e / l // use to determine the zeroes on the left or right
    const coeffArray = parts[0].split('.')

    if (direction === -1) {
      coeffArray[0] = Math.abs(coeffArray[0])
      num = zero + '.' + new Array(l).join(zero) + coeffArray.join('')
    } else {
      const dec = coeffArray[1]
      if (dec) l = l - dec.length
      num = coeffArray.join('') + new Array(l + 1).join(zero)
    }
  }

  if (sign < 0) {
    num = -num
  }
  return num
}

export const splitAddress = (address, isVersion2, numSplit) => {
  if (address) {
    return address.substring(0, isVersion2 ? 4 : (numSplit || 10)) + (isVersion2 ? ' **** **** ' : ' ... ') + address.substring(getLength(address) - (isVersion2 ? 4 : (numSplit || 10)), getLength(address))
  } else {
    return ''
  }
}

export const renderAMMImage = (coin, chain = chainType.ether) => {
  if (coin) {
    if (getLength(coin.ownLogo) > 0) {
      return coin.ownLogo
    }

    const isLogoURI = getLength(coin.logoURI) > 0 || getLength(coin.icon)
    const url = coin.logoURI || coin.icon
    if (isLogoURI && !url.includes('.svg')) {
      if (url.includes('ipfs')) {
        const idIPFS = url.replace('ipfs://', '')
        return `https://cloudflare-ipfs.com/ipfs/${idIPFS}`
      }
      if (url.includes('https')) {
        return url
      }
    }

    if (isLogoURI) {
      return url
    }

    let nameChain = 'ethereum'

    switch (chain) {
    case chainType.binanceSmart:
      nameChain = 'smartchain'
      break
    case chainType.heco:
      nameChain = 'heco'
      break
    }

    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${nameChain}/assets/${convertCheckSUM(coin.address)}/logo.png`
  }
}
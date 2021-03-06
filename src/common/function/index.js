import bigdecimal from 'bigdecimal'

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
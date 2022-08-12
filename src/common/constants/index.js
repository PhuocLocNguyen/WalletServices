import { chainType } from "./chainType"

export const env = {
    API_URL: 'https://development.coin98.services/api/',
    // API_URL: 'https://production.coin98.services/api/',
    SUPPORT_API: 'https://information.coin98.services/api/',
    NODE_ENV: 'local'
}

export const APP_VERSION = '1.0.0'

export const COIN_IMAGE = {
    CUSDC98: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/CUSDC98.png',
    BTC: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/BTC.png',
    ETH: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ETH.png',
    ETHARB: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/arbitrum_eth.png',
    ETHA0X: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/arbitrum_xdai.png',
    OP: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/op.png',
    BOBA: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/boba_eth.png',
    KCS: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/kucoin.png',
    BNB: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/BNBVer2.png',
    HT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/heco.png',
    TOMO: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/Tomo.png',
    USDT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/USDT.jpg',
    AVAX: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/avax.png',
    KSM: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/kusama.png',
    NEAR: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/near.png',
    DOT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/dot.png',
    C98: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/coin98.png',
    TRX: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/tron.png',
    CELO: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/celo.png',
    SOL: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/solana.jpg',
    SRM: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/serum.jpg',
    ATOM: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/cosmos.png',
    RUNE: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/thor.png',
    LUNA: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/terra.png',
    LUNA2: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/terra2.png',
    KAVA: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/kava.png',
    SCRT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/secretNetwork.png',
    EGLD: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/elrond.png',
    XTZ: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/tezos.png',
    ONE: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/harmony.png',
    CFX: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/conflux.png',
    AURORA: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/aurora.png',
  
    BAND: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/band.png',
    FTM: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/fantom.png',
    MATIC: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/polygon.png',
    XPRT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/persistance.png',
    XDAI: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_xdai.png',
    KAI: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_kardia.png',
    RON: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_ronin.png',
    OKT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_okex.png',
    GT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_gate.png',
    KLAY: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_klaytn.png',
  
    CRO: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/CRO.png',
    BTT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/BTT.png',
    HNT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_hnt.png',
    FLOW: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/ic_flow.png',
    THETA: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/THETA.png',
    GLMR: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/GMLR.png',
    LAT: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/LAT.png',
    TON: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/TON.png',
    TFUEL: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/TFUEL.png',
    ALGO: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/algorand.png',
    CSPR: 'https://coin98.s3.ap-southeast-1.amazonaws.com/Coin/casper.png',
    FX: 'https://coin98.s3.ap-southeast-1.amazonaws.com/fx.png'
  }


  export const ADDRESS_MAIN_COIN = {
    [chainType.ether]: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    [chainType.binanceSmart]: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
    [chainType.heco]: '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F',
    [chainType.matic]: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    [chainType.AVAX]: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    [chainType.fantom]: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    [chainType.kucoin]: '0x4446Fc4eb47f2f6586f9fAAb68B3498F86C07521',
    [chainType.celo]: '0x471EcE3750Da237f93B8E339c536989b8978a438',
    [chainType.boba]: '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000'
  }
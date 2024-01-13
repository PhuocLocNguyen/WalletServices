import  get  from "lodash/get"
import { chainType } from "./chainType"

export const env = {
    // API_URL: 'https://development.coin98.services/api/',
    API_URL: 'https://api.coin98.com/api/',
    ADAPTER_URL: 'https://api.coin98.com/adapters/',
    SUPPORT_API: 'https://information.coin98.com/api/',
    NODE_ENV: 'local'
}

export const APP_VERSION = '1.0.0'

export const isDapp = typeof window !== 'undefined' ? get(window, 'coin98.isMobile') : false

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
    FX: 'https://coin98.s3.ap-southeast-1.amazonaws.com/fx.png',
    KUB: 'https://assets.coingecko.com/coins/images/15760/standard/KUB.png?1696515385'
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

  export const settingReduxRefSOL = {
    MNGO: "FqkRLRNMhri5Fcw6po5mfrdQC5JECmfzjjvAn4R918d8",
    BTC: "2y8YvkwtNr3wEXYKpzEW2jAfCGjfGBjgJ6fGntzh7GyU",
    FTT: "FPv8zKn5oVg4FcHHiCkunp92AnuCXbrdN1iGn4DD2FcB",
    YFI: "F88dSWG8Lp6E2D7NQzW7pzLPBCdGeXsJiemgQuyiDDJ",
    LINK: "9KVbkGepJjRUgNQGbCNUwbh5KntSKVBQot6TKorYML9k",
    XRP: "3ZjUxkm5XpQPhH44XXe36rGUfX9qWm3rFZRG81eYqVZY",
    MSRM: "J5by8PM3DRXrSBgb482ZcUNcGbVVRcUgjcKyCMLHDiAQ",
    SXP: "7YLqv782YN7KRk8V1kaFfPjAgZy8VqtNprrmEY1xB4dr",
    ALEPH: "HgDgtwHyrxKcAFYz2M4L8UhCedrLNxSH3UxgbxU4519p",
    CREAM: "5gYCPbqessMv7XVCxtS3zJg1Ah3kGp3Tj8EFYjqNZt12",
    UBXT: "6VMJgcFVMh4LyvQEjBe86x6FPBkUUTmk392NfEoLkrZP",
    FRONT: "J15NVhiARM3orjkTGMViznumPc6QzwAQ6ZaVwoHmYyir",
    AKRO: "FNR1wnH5S3EWyYxGhvMxCi2edEtn1DPAsPcYY5ybN3K6",
    UNI: "9pFCjJaqDqpY9Kxi5aFB6aXHKCS7S5JfTnn7AHn1WzTa",
    KEEP: "7a2qULdgy8t7Nkhk1tBZjhUr1Ui7pXANweT9sBfmNpuK",
    TOMO: "GybZCWBoYcNCGuJGWxyNtBQgKBw3nhdPFhYA8oyBdEn6",
    KIN: "ABRQjHZ1NZvBWqcdjHbkTGUcgRY5sKCnLmwx5QLwgruA",
    MAPS: "A8RDvsHXVqpnmzkKR93vKuBLhvZpqpgEkH5SvR9wVLfK",
    AAVE: "8axe4fP4Aswhg8rXcfuxGwL1Z8PGDnXL5PG342t8aJgy",
    TRYB: "4vsCM3Bd562rrDWx5EXUkqGX62ZVepgLcqQprS8pexmX",
    WUSDT: "BVb9GXgkMVjq86X6QdKAKx57mvGjxwUDggSiVzBzDKyb",
    WUSDC: "9ykQDimF8uj6oaU2Cdxw7vw2xiPb1a6we2zSBTKvkDFH",
    USDC: "FDi2iCFp2A8fSbfCLdFiyargEL4jAsbg2ijLmaVLYepa",
    SUSHI: "6eLpGdqCqC8z8okgkttAj3v8kwkpUzDGTs2aqYh9aYXD",
    HNT: "ADfww9zJjJh25gxEzZTRsBt3LnJzdmZ1D2tkXF8tKjUn",
    MATH: "F849S6fEv5S2rD5uXyS4aCwAvoNWpRsSB1dUDN2yrHxp",
    OXY: "6cnNsEfMQEzrDNNdMGFgp4Mw95ZUS7FNcAXRrRRrgntP",
    COPE: "7NKiKuXFgZSMo7cWU92beF9SNCYnjbKiy9xHYjCHzsy",
    ETH: "8US6YGrciik1TzZZ53SGLj8jo4VrGHbbCwXBHruZjuhx",
    SRM: "CTVtBL3qd9rM2XJPL5wbK7S9Qm7CXmTjaHXThTZojTiq",
    LUA: "9BwSsWouUCTqNeY94e1TPFix6YJkRNuZyz1CLuvaRYiv",
    FIDA: "GEptMtc6eccCDRFPgpVCZCsKz7wvX4f2TNYqUUqFGDwp",
    RAY: "68qMPz8pyBrFo3rxgrK8Rw4FnJB39Kf8Do3qeDaA9LCz",
    CEL: "2mQvx1NZAuA2XzAcfVKqDCUZXd4N57yD4jiLsbWKBjsp",
    RSR: "Hr2r2sVYGeXUZEakMCjvMT9bmHnCJ6MueYU4eMw1ey6Z",
    HXRO: "CrEdEK6Z3kAeNF4PxKWefSVfDjoFpNzarXqRu6qtR4e6",
    SWAG: "hXR6SECx7ExsDCroiKJXPbFtxReNSzLqA6XmsquWDEP",
    USDT: "8zoygE51ShVPw5FieMhh68WdbCgJVeJFE1nW1Rxxu4r8",
    HGET: "5x9HPEdsyhH9breh2LygwJVdzazUz8gb3tDiHFs9WXGV"
}

export const CHAIN_STANDARD = {
  [chainType.binanceSmart]: 'BEP20',
  [chainType.ether]: 'ERC20',
  [chainType.heco]: 'HRC20',
  [chainType.matic]: 'MATIC',
  [chainType.fantom]: 'FANTOM',
  [chainType.avax]: 'AVAX',
  [chainType.xDai]: 'XDAI',

  [chainType.solana]: 'SOLANA',
  [chainType.eos]: 'EOS',
  [chainType.binance]: 'BEP2',
  [chainType.terra]: 'TERRA',
  [chainType.tron]: 'TRON',
  [chainType.bitcoin]: ''
}
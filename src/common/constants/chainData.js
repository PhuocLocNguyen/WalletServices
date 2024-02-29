import { COIN_IMAGE } from ".";
import { ALGORAND_MIN_TX_FEE } from "../../controller/Library/Local/algo/constants";
import { chainType } from "./chainType";

export const CHAIN_DATA = {
  ancient8: {
    balances: '0x6509A9977569413CE8baCa7C50BeA0F2F983E53B',
    isSupportedBaryon: true,
    replacementSymbol: 'ANCIENT8',
    isSupportedNFT: true,
    isCrawlNFTServices: true,
    numChainId: 28122024,
    chainId: '0x1ad1ba8',
    tokenStandard: 'ERC20',
    nftStandard: 'ERC721',
    isWeb3: true,
    isFee: true,
    image: 'web_ancient8',
    environment: 'devnet',
    isL2: true,
    name: 'Ancient8 Testnet V2',
    shortName: 'ETH',
    logo: COIN_IMAGE.ETH,
    symbol: 'ETH',
    chain: 'ancient8',
    standard: 'ERC20 ERC721',
    rpcURL: 'https://rpcv2-testnet.ancient8.gg',
    scan: 'https://scanv2-testnet.ancient8.gg'
  },
  ancient8Mainnet: {
    balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
    isSupportedBaryon: false,
    replacementSymbol: 'ANCIENT8',
    isSupportedNFT: true,
    isCrawlNFTServices: true,
    numChainId: 888888888,
    chainId: '0x34fb5e38',
    tokenStandard: 'ERC20',
    nftStandard: 'ERC721',
    isWeb3: true,
    isFee: true,
    image: 'web_ancient8',
    environment: 'devnet',
    isL2: true,
    name: 'Ancient8',
    shortName: 'ETH',
    logo: COIN_IMAGE.ETH,
    symbol: 'ETH',
    chain: 'ancient8Mainnet',
    standard: 'ERC20 ERC721',
    rpcURL: 'https://rpc.ancient8.gg',
    scan: 'https://scan.ancient8.gg'
  },
  bitkub: {
    isSupportedBaryon: true,
    numChainId: 96,
    chainId: '0x60',
    isToken: true,
    isSupportedNFT: true,
    trcToken: 'KAP-20',
    nftToken: 'KAP721',
    isWeb3: true,
    image: 'web_bitkub',
    balances: '0x4d461b38d1753386D4d6797F79441Ed0adC2f6F8',

    id: 'bitkub-coin',
    name: 'Bitkub Chain',
    shortName: 'Bitkub',
    imageLink: COIN_IMAGE.KUB,
    symbol: 'KUB',
    chain: 'bitkub',
    rpcURL: 'https://rpc.bitkubchain.io',
    scan: 'https://www.bkcscan.com'
  },
  '97': {
    kind: 'evm',
    key: '97',

    numChainId: 97,
    decimals: 18,
    chainId: '0x61',
    numLoad: 1,
    isBridge: true,
    isToken: true,
    isSupportedNFT: true,
    nftToken: 'BEP721',
    trcToken: 'BEP20',
    symbolSpecial: 'BSC',
    balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
    multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
    nftMint: '0x2418400d29F8B774E49e93C5cb54460ae5Ecd788',
    stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
    subName: 'BSC',

    isSupportedV2: true,
    isWeb3: true,
    isFee: true,
    image: 'app_binance',

    id: 'binancecoin',
    name: 'BNB Smart Chain testnet',
    shortName: 'BSC',
    symbol: 'BNB',
    chain: '97',
    trcName: 'BNB BEP20',
    rpcURL: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    scan: 'https://testnet.bscscan.com/',
    launchpadFactory: '0x8F94EAb4bF74CD9934B056031A97F502009eBfB8',
    launchpadMintableKey: '0x444f313053c893c305c4a5f333f3b033d548405c830016c4b623e787aa045145',
    launchpadTransferableKey: '0x1bc7992855b26a5ae511e9b448c90941ef8f1b835f4936d94c8cfd9202da9384'
  },
    multiChain: {
      isOther: true,
      isMnemonic: true,
      name: 'Multi-Chain',
      image: 'app_multi_chain',
      chain: chainType.multiChain,
      trcName: 'All Blockchains'
    },
    evm: {
      isOther: true,
      name: 'EVM Wallet',
      image: 'app_evm',
      chain: chainType.evm,
      trcName: 'EVM Wallet'
    },
    hardwareWallet: {
      isOther: true,
      isHardware: true,
      name: 'Hardware Wallet',
      image: 'app_ledger',
      chain: chainType.hardwareWallet,
      trcName: 'Import hardware wallet'
    },
    customCreate: {
      isOther: true,
      name: 'Custom Network',
      image: 'app_custom_network',
      chain: chainType.customCreate,
      trcName: 'Create Custom Network'
    },
    custom: {
      isOther: true,
      name: 'Custom Network',
      image: 'app_box',
      chain: chainType.custom,
      trcName: 'Custom Network'
    },
    binanceSmartTest: {
      isOther: true,
      numChainId: 97,
      chainId: '0x61',
      rpcURL: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    },
  
    bitcoin: {
      numLoad: 5,
      isFee: true,
      isMnemonic: true,
      image: 'app_bitcoin',
      id: 'bitcoin',
      name: 'Bitcoin',
      shortName: 'Bitcoin',
      imageLink: COIN_IMAGE.BTC,
      symbol: 'BTC',
      chain: chainType.bitcoin,
      trcName: 'BTC',
      scan: 'https://www.blockchain.com/btc'
    },
    ether: {
      numChainId: 1,
      chainId: '0x1',
      numLoad: 0,
      isSupportedEIP1559: true,
      isToken: true,
      isBridge: true,
      isSupportedNFT: true,
  
      trcToken: 'ERC20',
      nftToken: 'ERC721',
      balances: '0x38bb7b9b87bdfbed883aaf50a2f411d330fe32d6',
      multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
      stake: '0x836bf46520C373Fdc4dc7E5A3bAe735d13bD44e3',
      isSupportedV2: true,
      isWeb3: true,
      isFee: true,
      image: 'app_ethereum',
      id: 'ethereum',
      name: 'Ethereum',
      shortName: 'Ethereum',
      imageLink: COIN_IMAGE.ETH,
      symbol: 'ETH',
      chain: chainType.ether,
      trcName: 'ETH ERC20 ERC721',
      rpcURL: 'https://mainnet.infura.io/v3/92d53cee52834368b0fabb42fa1b5570',
      scan: 'https://etherscan.io'
    },
    binanceSmart: {
      numChainId: 56,
      chainId: '0x38',
      numLoad: 1,
      isBridge: true,
      isToken: true,
      isSupportedNFT: true,
      nftToken: 'BEP721',
      trcToken: 'BEP20',
      symbolSpecial: 'BSC',
      balances: '0xA6762c710852681c4593C10c4304C5211FB2122c',
      multisend: '0x2E1D30460265bFEBedacf5bb6f9A80F0E74B7498',
      nftMint: '0xc4cAd0938256ABA4417c565044Be2c2EB77096cb',
      stake: '0x08ac9c38ce078b9b81e5ab5bf8aafc3d2db94385',
      subName: 'BSC',
  
      isSupportedV2: true,
      isWeb3: true,
      isFee: true,
      image: 'app_binance',
  
      id: 'binancecoin',
      name: 'BNB Smart Chain',
      shortName: 'BSC',
      imageLink: COIN_IMAGE.BNB,
      symbol: 'BNB',
      chain: chainType.binanceSmart,
      trcName: 'BNB BEP20',
      rpcURL: 'https://bsc-mainnet.nodereal.io/v1/5c4ed7c647c0479f9ae118b0b62c745c',
      scan: 'https://bscscan.com'
    },
    heco: {
      numChainId: 128,
      chainId: '0x80',
      numLoad: 1,
      isToken: true,
      isSupportedEIP1559: true,
      isSupportedNFT: true,
      trcToken: 'HRC20',
      nftToken: 'HRC721',
      isWeb3: true,
      isFee: true,
      image: 'app_heco',
      balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
      multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
  
      id: 'huobi-token',
      name: 'HECO Chain',
      shortName: 'Huobi',
      imageLink: COIN_IMAGE.HT,
      symbol: 'HT',
      chain: chainType.heco,
      trcName: 'HT HRC20',
      rpcURL: 'https://http-mainnet.hecochain.com',
      scan: 'https://hecoinfo.com'
    },
    okex: {
      numChainId: 66,
      chainId: '0x42',
      numLoad: 2,
      isSupportedNFT: true,
      balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
      multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
      isToken: true,
      id: 'oec-token',
      name: 'OKExChain',
      image: 'app_okex',
      symbol: 'OKT',
      chain: chainType.okex,
      imageLink: COIN_IMAGE.OKT,
      icon: 'okex',
      trcToken: 'KIP20',
      nftToken: 'NFT',
      trcName: 'OKT KIP10 KIP20 NFT',
      isFee: true,
      isWeb3: true,
      rpcURL: 'https://exchainrpc.okex.org',
      scan: 'https://www.oklink.com/okexchain'
    },
    terra2: {
      prefix: 'terra',
      numPath: 330,
  
      numLoad: 3,
      isToken: true,
      trcToken: 'CW20',
  
      isCosmos: true,
      isMemo: true,
  
      id: 'terra-luna-2',
      name: 'Terra 2.0',
      image: 'app_terra2',
      symbol: 'LUNA',
      denom: 'uluna',
      imageLink: COIN_IMAGE.LUNA2,
      chain: chainType.terra2,
      trcName: 'LUNA CW20',
      scan: 'https://finder.terra.money/mainnet/',
      chainId: 'phoenix-1'
    },
    gate: {
      numChainId: 86,
      chainId: '0x56',
      numLoad: 2,
      balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
      multisend: '0x963e1bcd1f82724bd8fa16a3b6962d100fb287fc',
      nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
      isSupportedNFT: true,
      isToken: true,
      id: 'gatechain-token',
      name: 'GateChain',
      image: 'app_gate',
      symbol: 'GT',
      chain: chainType.gate,
      imageLink: COIN_IMAGE.GT,
      icon: 'gate',
      trcToken: 'GRC20',
      nftToken: 'GRC721',
      trcName: 'GT GRC20 GRC721',
      isFee: true,
      isWeb3: true,
      rpcURL: 'https://evm.gatenode.cc',
      scan: 'https://gatescan.org'
    },
  
    kucoin: {
      numChainId: 321,
      chainId: '0x141',
  
      numLoad: 2,
      isToken: true,
      subName: 'KCS',
      trcToken: 'KRC20',
      nftToken: 'KRC721',
      balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
      multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
      isWeb3: true,
      isSupportedNFT: true,
      isFee: true,
      image: 'app_kucoin',
      id: 'kucoin-shares',
      name: 'KuCoin Community Chain',
      shortName: 'Kucoin',
      imageLink: COIN_IMAGE.KCS,
      symbol: 'KCS',
      chain: chainType.kucoin,
      trcName: 'KCS KRC20 KRC721',
      rpcURL: 'https://rpc-mainnet.kcc.network',
      scan: 'https://explorer.kcc.io/en'
    },
    solana: {
      numLoad: 1,
      isToken: true,
      trcToken: 'SPL',
      nftToken: 'SPL NFT',
      multisend: true,
      isBridge: true,
      isSupportedNFT: true,
  
      image: 'app_solana',
  
      id: 'solana',
      name: 'Solana',
      shortName: 'Solana',
      imageLink: COIN_IMAGE.SOL,
      symbol: 'SOL',
      chain: chainType.solana,
      trcName: 'SOL SPL',
      rpcURL: 'https://information.coin98.com/solanaV4',
      rpcURLSerum: 'https://solana-api.projectserum.com',
      scan: 'https://solscan.io'
    },
    near: {
      numLoad: 2,
      isToken: true,
      trcToken: 'NEP141',
  
      image: 'app_near',
      id: 'near',
      name: 'Near',
      imageLink: COIN_IMAGE.NEAR,
      symbol: 'NEAR',
      trcName: 'NEAR NEP141',
      chain: chainType.near,
      scan: 'https://explorer.near.org',
      rpcURL: 'https://public-rpc.blockpi.io/http/near',
      // rpcURL: 'https://rpc.mainnet.near.org',
      scanTxs: 'transactions',
      scanAddr: 'accounts'
    },
    avax: {
      isSupportedEIP1559: true,
      numPath: 9000,
  
      isBridge: true,
      numChainId: 43114,
      chainId: '0xa86a',
  
      numLoad: 1,
      isSupportedNFT: true,
      isToken: true,
      trcToken: 'ARC20',
      nftToken: 'ARC721',
      symbolSpecial: 'CCHAIN',
      balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
      multisend: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
      nftMint: '0x0eCE57A677D5e72D1ad45774239e23463CF1d743',
  
      subName: 'C',
  
      isSupportedV2: true,
      isWeb3: true,
      isFee: true,
      image: 'app_avalancher',
      id: 'avalanche-2',
      name: 'Avalanche C-Chain',
      shortName: 'Avalanche',
      imageLink: COIN_IMAGE.AVAX,
      symbol: 'AVAX',
      chain: chainType.avax,
      trcName: 'AVAX-C ARC20',
      rpcURL: 'https://api.avax.network/ext/bc/C/rpc',
      scan: 'https://snowtrace.io'
    },
    avaxX: {
      numLoad: 5,
      isBridge: true,
      symbolSpecial: 'XCHAIN',
      subName: 'X',
      image: 'app_avalancher',
      id: 'avalanche-2',
      name: 'Avalanche X-Chain',
      shortName: 'Avalanche',
      imageLink: COIN_IMAGE.AVAX,
      symbol: 'AVAX',
      chain: chainType.avaxX,
      trcName: 'AVAX-X',
      scan: 'https://avascan.info/blockchain/x'
    },
    tron: {
      numLoad: 1,
      isToken: true,
      isBridge: true,
      trcToken: 'TRC20',
      trcSubName: 'TRC10',
  
      image: 'app_tron',
  
      id: 'tron',
      name: 'Tron',
      shortName: 'Tron',
      imageLink: COIN_IMAGE.TRX,
      symbol: 'TRX',
      chain: chainType.tron,
      trcName: 'TRX TRC10 TRC20',
      scan: 'https://tronscan.org/#',
      scanTxs: 'transaction'
    },
    matic: {
      // isSupportedEIP1559: true,
      numChainId: 137,
      chainId: '0x89',
      numLoad: 2,
      isToken: true,
      trcToken: 'PRC20',
      nftToken: 'PRC721',
      isSupportedV2: true,
      isSupportedNFT: true,
      isFee: true,
      isWeb3: true,
      balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
      multisend: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
      nftMint: '0x9aE5c1cf82aF51CBB83D9A7B1C52aF4B48E0Bb5E',
  
      id: 'matic-network',
      name: 'Polygon',
      image: 'app_polygon',
      imageLink: COIN_IMAGE.MATIC,
      symbol: 'MATIC',
      chain: chainType.matic,
      trcName: 'MATIC PRC20',
      rpcURL: 'https://rpc-mainnet.maticvigil.com',
      scan: 'https://polygonscan.com'
    },
    fantom: {
      numChainId: 250,
      chainId: '0xFA',
  
      numLoad: 2,
      isSupportedV2: true,
      isToken: true,
      isSupportedNFT: true,
      trcToken: 'FRC20',
      nftToken: 'FRC721',
      balances: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
      multisend: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
      nftMint: '0x67807b9f5B9757C0c79347F0b3f360C15c5E6aFF',
  
      isFee: true,
      isWeb3: true,
  
      id: 'fantom',
      name: 'Fantom',
      image: 'app_fantom',
      imageLink: COIN_IMAGE.FTM,
      symbol: 'FTM',
      chain: chainType.fantom,
      trcName: 'FANTOM FRC20',
      rpcURL: 'https://rpcapi.fantom.network',
      scan: 'https://ftmscan.com'
    },
    xDai: {
      isSupportedEIP1559: true,
      numChainId: 100,
      chainId: '0x64',
  
      numLoad: 2,
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
      isSupportedNFT: true,
      isToken: true,
      id: 'xdai',
      name: 'Gnosis Chain',
      image: 'app_xDai',
      symbol: 'XDAI',
      chain: chainType.xDai,
      imageLink: COIN_IMAGE.XDAI,
      icon: 'xDai',
      trcToken: 'XRC20',
      nftToken: 'XRC721',
      trcName: 'XDAI XRC20',
      isFee: true,
      isWeb3: true,
      rpcURL: 'https://rpc.xdaichain.com',
      scan: 'https://blockscout.com/xdai/mainnet'
    },
    polkadot: {
      isPolkadot: true,
      numLoad: 3,
      image: 'app_polkadot',
  
      isMnemonic: true,
      id: 'polkadot',
      name: 'Polkadot',
      shortName: 'Polkadot',
      imageLink: COIN_IMAGE.DOT,
      symbol: 'DOT',
      chain: chainType.polkadot,
      trcName: 'DOT',
      rpcURL: 'rpc.polkadot.io',
      scan: 'https://polkadot.subscan.io',
      scanTxs: 'extrinsic',
      scanAddr: 'account'
    },
    kusama: {
      isPolkadot: true,
      numLoad: 3,
      image: 'app_kusama',
  
      isMnemonic: true,
      id: 'kusama',
      name: 'Kusama',
      shortName: 'Kusama',
      imageLink: COIN_IMAGE.KSM,
      symbol: 'KSM',
      chain: chainType.kusama,
      trcName: 'KSM',
      rpcURL: 'kusama-rpc.polkadot.io',
      scan: 'https://kusama.subscan.io'
    },
    cosmos: {
      prefix: 'cosmos',
      numPath: 118,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
      isFactory: true,
  
      chainId: 'cosmoshub-4',
      id: 'cosmos',
      name: 'Cosmos',
      image: 'app_cosmos',
      symbol: 'ATOM',
      imageLink: COIN_IMAGE.ATOM,
      chain: chainType.cosmos,
      trcName: 'ATOM',
      scan: 'https://www.mintscan.io/cosmos',
      scanTxs: 'txs',
      scanAddr: 'account',
      scanBlocks: 'blocks/id'
    },
    thor: {
      prefix: 'thor',
      numPath: 931,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
      id: 'thorchain',
      name: 'THORChain',
      image: 'app_thorchain',
      imageLink: COIN_IMAGE.RUNE,
      symbol: 'RUNE',
      chain: chainType.thor,
      trcName: 'RUNE',
      scan: 'https://viewblock.io/thorchain'
    },
  
    terra: {
      prefix: 'terra',
      numPath: 330,
  
      numLoad: 3,
      isToken: true,
      trcToken: 'CW20',
  
      isCosmos: true,
      isMemo: true,
  
      id: 'terra-luna',
      name: 'Old Terra',
      image: 'app_terra',
      symbol: 'LUNC',
      denom: 'uluna',
      imageLink: COIN_IMAGE.LUNA,
      chain: chainType.terra,
      trcName: 'LUNC CW20',
      scan: 'https://finder.terra.money/columbus-5',
      chainId: 'columbus-5'
    },
    band: {
      prefix: 'band',
      numPath: 494,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
      id: 'band-protocol',
      name: 'BandChain',
      image: 'app_band',
      imageLink: COIN_IMAGE.BAND,
      symbol: 'BAND',
      trcName: 'BAND',
      chain: chainType.band,
      scan: 'https://cosmoscan.io',
      scanAddr: 'account'
    },
    kava: {
      prefix: 'kava',
      numPath: 459,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
  
      id: 'kava',
      name: 'Kava',
      image: 'app_kava',
      imageLink: COIN_IMAGE.KAVA,
      symbol: 'KAVA',
      chain: chainType.kava,
      trcName: 'KAVA',
      scan: 'https://www.mintscan.io/kava',
      scanTxs: 'txs',
      scanAddr: 'account',
      scanBlocks: 'blocks/id'
    },
    secretNetwork: {
      prefix: 'secret',
      numPath: 529,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
      isFactory: true,
  
      chainId: 'secret-4',
      id: 'secret',
      name: 'Secret Network',
      image: 'app_secret_network',
      imageLink: COIN_IMAGE.SCRT,
      symbol: 'SCRT',
      chain: chainType.secretNetwork,
      trcName: 'SCRT',
      scan: 'https://secretnodes.com/secret/chains/secret-4',
      scanTxs: 'transactions',
      scanAddr: 'account',
      scanBlocks: 'blocks/id'
    },
    persistence: {
      prefix: 'persistence',
      numPath: 750,
  
      numLoad: 3,
      isCosmos: true,
      isMemo: true,
      isFactory: true,
  
      chainId: 'core-1',
      id: 'persistence',
      name: 'Persistence',
      image: 'app_-persistence',
      imageLink: COIN_IMAGE.XPRT,
      symbol: 'XPRT',
      chain: chainType.persistence,
      trcName: 'XPRT',
      scan: 'https://explorer.persistence.one',
      scanBlocks: 'blocks',
      scanTxs: 'transactions',
      scanAddr: 'wallet'
    },
  
    binance: {
      prefix: 'bnb',
      numPath: 714,
  
      numLoad: 2,
      isToken: true,
      trcToken: 'BEP2',
      symbolSpecial: 'BC',
  
      isCosmos: true,
      isMemo: true,
      subName: 'BC',
  
      image: 'app_binance',
  
      id: 'binancecoin',
      name: 'BNB Beacon Chain',
      shortName: 'Binance',
      imageLink: COIN_IMAGE.BNB,
      symbol: 'BNB',
      chain: chainType.binance,
      trcName: 'BNB BEP2 BEP8',
      scan: 'https://explorer.binance.org'
    },
    functionX: {
      prefix: 'fx',
      numPath: 118,
  
      numLoad: 3,
      isCosmos: true,
      isFactory: true,
      isMemo: true,
  
      chainId: 'fxcore',
      id: 'fx-coin',
      name: 'Function X',
      image: 'app_functionX',
      symbol: 'FX',
      imageLink: COIN_IMAGE.FX,
      chain: chainType.functionX,
      trcName: 'FX FXRC20',
      scan: 'https://explorer.functionx.io/fxcore',
      rpcURL: 'https://fx-json.functionx.io:26657',
      scanTxs: 'tx',
      scanAddr: 'address'
    },
    elrond: {
      isLibrary: true,
  
      prefix: 'erd',
      numPath: 508,
      nftToken: 'SFT',
      numLoad: 3,
      feeDefault: 0.00005,
      isToken: true,
      trcToken: 'ESDT',
  
      id: 'elrond-erd-2',
      name: 'Elrond',
      image: 'app_elrond',
      imageLink: COIN_IMAGE.EGLD,
      symbol: 'EGLD',
      chain: chainType.elrond,
      trcName: 'EGLD ESDT SFT',
      scan: 'https://explorer.elrond.com',
      scanTxs: 'transactions',
      scanAddr: 'accounts',
      scanBlocks: 'blocks'
    },
    tezos: {
      isLibrary: true,
      feeDefault: 0.0015,
  
      prefix: 'tz1',
      numPath: 1729,
      nftToken: 'FA2',
      isToken: true,
      trcToken: 'FA1.2',
      numLoad: 2,
  
      id: 'tezos',
      name: 'Tezos',
      image: 'app_tezos',
      imageLink: COIN_IMAGE.XTZ,
      symbol: 'XTZ',
      rpcURL: 'https://mainnet.api.tez.ie',
      chain: chainType.tezos,
      trcName: 'XTZ FA1.2 FA2',
      scan: 'https://tezblock.io',
      scanTxs: 'transaction',
      scanAddr: 'account',
      scanBlocks: 'block'
    },
    celo: {
      // mainAddress: '0x471ece3750da237f93b8e339c536989b8978a438',
      numPath: 52752,
  
      numChainId: 42220,
      chainId: '0xA4EC',
  
      numLoad: 1,
      isSupportedNFT: true,
      isFee: true,
      isToken: true,
      balances: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
      multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
      isWeb3: true,
      nftToken: 'CELO721',
      image: 'app_celo',
      id: 'celo',
      name: 'Celo',
      shortName: 'Celo',
      imageLink: COIN_IMAGE.CELO,
      symbol: 'CELO',
      chain: chainType.celo,
      trcName: 'CELO CUSD',
      rpcURL: 'https://forno.celo.org',
      scan: 'https://explorer.celo.org'
    },
    tomo: {
      numPath: 889,
  
      numChainId: 88,
      chainId: '0x58',
      // numChainId: 4,
      // chainId: '0x4',
  
      numLoad: 2,
      isBridge: true,
      isToken: true,
      isSupportedNFT: true,
      trcToken: 'TRC21',
      nftToken: 'TRC721',
      isWeb3: true,
      isFee: true,
      image: 'app_tomochain',
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      // multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      nftMint: '0xAE12C5930881c53715B369ceC7606B70d8EB229f',
  
      id: 'tomochain',
      name: 'TomoChain',
      shortName: 'Tomo',
      imageLink: COIN_IMAGE.TOMO,
      symbol: 'TOMO',
      chain: chainType.tomo,
      trcName: 'TOMO TRC21',
      rpcURL: 'https://rpc.tomochain.com',
      scan: 'https://scan.tomochain.com'
    },
    algorand: {
      feeDefault: ALGORAND_MIN_TX_FEE,
  
      trcToken: 'ALGO',
      nftToken: 'ALGO721',
      isToken: true,
      id: 'algorand',
      name: 'Algorand',
      image: 'app_algorand',
      imageLink: COIN_IMAGE.ALGO,
      symbol: 'ALGO',
      chain: chainType.algorand,
      trcName: 'ALGO ALGO721',
      scan: 'https://algoexplorer.io'
    },
    casper: {
      trcToken: 'CSPR',
      nftToken: 'CSPR-NFT',
      id: 'casper-network',
      name: 'Casper',
      image: 'app_casper',
      imageLink: COIN_IMAGE.CSPR,
      symbol: 'CSPR',
      chain: chainType.casper,
      trcName: 'CSPR',
      scanTxs: 'deploy',
      scanAddr: 'account',
      scan: 'https://cspr.live'
    },
    kardia: {
      numChainId: 24,
      chainId: '0x18',
  
      numLoad: 2,
      isToken: true,
      id: 'kardiachain',
      name: 'KardiaChain',
      image: 'app_kardia',
      symbol: 'KAI',
      chain: chainType.kardia,
      imageLink: COIN_IMAGE.KAI,
      icon: 'kardia',
      subName: 'KAI',
      trcToken: 'KRC20',
      nftToken: 'KRC721',
      trcName: 'KAI KRC20 KRC721',
      balances: '0x8ef3C4Bf105Ec17cbeD7615C5711d2F4D44a4194',
      multisend: '0xf21201135568A81c9046d60a003eC2B883173F2f',
      nftMint: '0x8347CD0aaF874259e9d577BeE08231F648C3fc29',
  
      isFee: true,
      isWeb3: true,
      rpcURL: 'https://rpc.kardiachain.io',
      scan: 'https://explorer.kardiachain.io'
    },
    ronin: {
      prefix: 'ronin:',
      numChainId: 2020,
      chainId: '0x7e4',
  
      numLoad: 2,
      isToken: true,
      isSupportedNFT: true,
      id: 'ronin',
      name: 'Ronin',
      image: 'app_ronin',
      nftToken: 'RRC721',
      symbol: 'RON',
      chain: chainType.ronin,
      imageLink: COIN_IMAGE.RON,
      icon: 'ronin',
      trcToken: 'RRC20',
      trcName: 'RON RRC20 RRC721',
      isFee: true,
      isWeb3: true,
      rpcURL: 'https://api.roninchain.com/rpc',
      scan: 'https://explorer.roninchain.com'
    },
  
    klaytn: {
      numChainId: 8217,
      chainId: '0x2019',
  
      numLoad: 2,
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      multisend: '0x5c93f4b35d3dd97ef481881aa33d00f76806fdad',
  
      isSupportedNFT: true,
      isToken: true,
      id: 'klay-token',
      name: 'Klaytn',
      image: 'app_klaytn',
      symbol: 'KLAY',
      trcToken: 'KIP7',
      nftToken: 'KIP37',
  
      chain: chainType.klaytn,
      imageLink: COIN_IMAGE.KLAY,
      icon: 'klaytn',
      trcName: 'KLAY KIP7 KIP37',
      isFee: true,
      isWeb3: true,
      scan: 'https://scope.klaytn.com',
      rpcURL: 'https://kaikas.cypress.klaytn.net:8651',
      scanAddr: 'account'
    },
    harmony: {
      prefix: 'one',
      numChainId: 1666600000,
      chainId: '0x63564C40',
      numLoad: 1,
      isToken: true,
      isSupportedNFT: true,
      nftToken: 'HRC721',
      trcToken: 'HRC20',
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      multisend: '0x9aE5c1cf82aF51CBB83D9A7B1C52aF4B48E0Bb5E',
      nftMint: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
  
      isWeb3: true,
      isFee: true,
      image: 'app_harmony',
  
      id: 'harmony',
      name: 'Harmony',
      imageLink: COIN_IMAGE.ONE,
      symbol: 'ONE',
      chain: chainType.harmony,
      trcName: 'ONE HRC20 HRC721',
      rpcURL: 'https://api.harmony.one',
      scan: 'https://explorer.harmony.one'
    },
    conflux: {
      isLibrary: true,
      feeDefault: 0.00005,
  
      prefix: 'cfx',
      trcToken: 'CRC20',
      nftToken: 'CRC721',
      isToken: true,
      numLoad: 2,
  
      id: 'conflux-token',
      name: 'Conflux',
      image: 'app_conflux',
      imageLink: COIN_IMAGE.CFX,
      symbol: 'CFX',
      chain: chainType.conflux,
      trcName: 'CFX CRC20 CRC721',
      scan: 'https://www.confluxscan.io',
      scanTxs: 'transaction',
      scanAddr: 'address',
      scanBlocks: 'block'
    },
    optimism: {
      // defaultGas: 882000,
      // mainAddress: '0x4200000000000000000000000000000000000006',
      isL2: true,
      isBridge: true,
      numChainId: 10,
      chainId: '0xA',
      // numChainId: 69,
      // chainId: '0x45',
  
      numLoad: 2,
      isToken: true,
      trcToken: 'ERC20 OPT',
      nftToken: 'ERC721 OPT',
      // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      // multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
      isWeb3: true,
      isFee: true,
      image: 'app_optimism',
      id: 'ethereum',
      name: 'Optimism',
      shortName: 'Optimism',
      imageLink: COIN_IMAGE.OP,
      symbol: 'ETH',
      symbolSpecial: 'OP',
      chain: chainType.optimism,
      trcName: 'ETH ERC20 ERC721',
      rpcURL: 'https://mainnet.optimism.io',
      // rpcURL: 'https://kovan.optimism.io',
      scan: 'https://optimistic.etherscan.io'
    },
    boba: {
      // defaultGas: 80000000,
      // mainAddress: '0x4200000000000000000000000000000000000006',
      isL2: true,
      isBridge: true,
      numChainId: 288,
      chainId: '0x120',
      // numChainId: 28,
      // chainId: '0x1C',
  
      numLoad: 2,
      isToken: true,
      trcToken: 'ERC20 BOBA',
      nftToken: 'ERC721 BOBA',
      // multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
      isWeb3: true,
      isFee: true,
      image: 'app_boba',
      id: 'ethereum',
      name: 'Boba Network',
      shortName: 'Boba Network',
      imageLink: COIN_IMAGE.BOBA,
      symbol: 'ETH',
      symbolSpecial: 'BOBA',
      chain: chainType.boba,
      trcName: 'ETH ERC20 ERC721',
      rpcURL: 'https://mainnet.boba.network',
      scan: 'https://blockexplorer.boba.network'
    },
    arbitrum: {
      // defaultGas: 7000000,
      isL2: true,
      isBridge: true,
      numChainId: 42161,
      chainId: '0xA4B1',
      // numChainId: 421611,
      // chainId: '0x66EEB',
  
      numLoad: 2,
      isToken: true,
      trcToken: 'ERC20 ARB',
      nftToken: 'ERC721 ARB',
      // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      // multisend: '0xaEC945e04baF28b135Fa7c640f624f8D90F1C3a6',
      isWeb3: true,
      isFee: true,
      image: 'app_arbitrum',
      id: 'ethereum',
      name: 'Arbitrum',
      shortName: 'Arbitrum',
      imageLink: COIN_IMAGE.ETHARB,
      symbol: 'ETH',
      symbolSpecial: 'ARB',
      chain: chainType.arbitrum,
      trcName: 'ETH ERC20 ERC721',
      rpcURL: 'https://arb1.arbitrum.io/rpc',
      // rpcURL: 'https://rinkeby.arbitrum.io/rpc',
      scan: 'https://arbiscan.io'
    },
    arbitrumXdai: {
      isL2: true,
      numChainId: 200,
      chainId: '0xC8',
  
      numLoad: 2,
      isToken: true,
      isSupportedNFT: true,
      trcToken: 'ERC20 AOX',
      nftToken: 'ERC721 AOX',
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      multisend: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      nftMint: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC',
  
      isWeb3: true,
      isFee: true,
      image: 'app_arbitrum_xdai',
      id: 'xdai',
      name: 'Arbitrum on xDai',
      shortName: 'Arbitrum on xDai',
      imageLink: COIN_IMAGE.ETHA0X,
      symbol: 'XDAI',
      symbolSpecial: 'AOX',
      chain: chainType.arbitrumXdai,
      trcName: 'XDAI XRC20 XRC721',
      rpcURL: 'https://arbitrum.xdaichain.com',
      scan: 'https://blockscout.com/xdai/aox'
    },
    aurora: {
      isL2: true,
      feeDefault: 0,
  
      numChainId: 1313161554,
      chainId: '0x4e454152',
      numLoad: 2,
      isToken: true,
      isSupportedNFT: true,
      nftToken: 'AURORA721',
      trcToken: 'AURORA20',
      // balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      // nftMint: '0xc4cAd0938256ABA4417c565044Be2c2EB77096cb',
  
      isWeb3: true,
      image: 'app_aurora',
  
      id: 'ethereum',
      name: 'Aurora',
      shortName: 'Aurora',
      imageLink: COIN_IMAGE.AURORA,
      symbol: 'AURORA',
      chain: chainType.aurora,
      trcName: 'AURORA AURORA20 AURORA721',
      rpcURL: 'https://mainnet.aurora.dev',
      scan: 'https://explorer.mainnet.aurora.dev'
    },
    ton: {
      id: 'the-open-network',
      name: 'The Open Network',
      shortName: 'TON',
      imageLink: COIN_IMAGE.TON,
      isToken: false,
      isMemo: true,
      symbol: 'TON',
      chain: chainType.ton,
      trcName: 'TON TON721',
      rpcURL: 'https://toncenter.com/api/v2/jsonRPC',
      scan: 'https://tonscan.org',
      image: 'app_ton'
    },
    cronos: {
      id: 'crypto-com-chain',
      chain: chainType.cronos,
      name: 'Cronos',
      shortName: 'CRO',
      isToken: true,
      trcToken: 'CRO',
      numChainId: 25,
      chainId: '0x19',
      symbol: 'CRO',
      image: 'app_cronos',
      trcName: 'CRC20 CRC721',
      rpcURL: 'https://evm-cronos.crypto.org',
      scan: 'https://cronoscan.com',
      imageLink: COIN_IMAGE.CRO,
      isSupportedEIP1559: true,
      isSupportedNFT: true,
      isWeb3: true,
      isFee: true,
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      nftMint: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      multisend: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC'
    },
    bittorrent: {
      numChainId: 199,
      chainId: '0xc7',
      isToken: true,
      trcToken: 'BTT',
      isSupportedNFT: true,
      isWeb3: true,
      isFee: true,
      id: 'bittorrent',
      name: 'BitTorrent Chain',
      shortName: 'BTTC',
      image: 'app_bitorrent',
      imageLink: COIN_IMAGE.BTT,
      symbol: 'BTT',
      chain: chainType.bittorrent,
      trcName: 'BTTC BRC20 BRC721',
      balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
      nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
      multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      rpcURL: 'https://rpc.bt.io',
      scan: 'https://scan.bt.io/#',
      scanTxs: 'transaction',
      scanAddr: 'address'
    },
    theta: {
      trcToken: 'THETA',
      id: 'theta-network',
      name: 'Theta Network',
      shortName: 'THETA',
      image: 'app_thetanetwork',
      imageLink: COIN_IMAGE.THETA,
      symbol: 'THETA',
      chain: chainType.theta,
      trcName: 'TNT20 TNT721',
      rpcURL: 'https://theta-bridge-rpc.thetatoken.org/rpc',
      scan: 'https://explorer.thetatoken.org',
      scanTxs: 'txs',
      scanAddr: 'account'
      // isFee: true
    },
    thetaFuel: {
      numChainId: 361,
      chainId: '0x169',
      isToken: true,
      trcToken: 'TFUEL',
      isSupportedNFT: true,
      isWeb3: true,
      isFee: true,
      id: 'theta-fuel',
      name: 'Theta Network EVM',
      shortName: 'THETA',
      image: 'app_thetanetwork',
      imageLink: COIN_IMAGE.TFUEL,
      symbol: 'TFUEL',
      chain: chainType.thetaFuel,
      trcName: 'TNT20 TNT721',
      rpcURL: 'https://eth-rpc-api.thetatoken.org/rpc',
      scan: 'https://explorer.thetatoken.org',
      scanTxs: 'txs',
      scanAddr: 'account',
      balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
      nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
      multisend: '0xf7eee3a8363731c611a24cddfcbcade9c153cfe8'
    },
    platon: {
      numChainId: 210425,
      chainId: '0x335F9',
      isToken: true,
      isWeb3: true,
      isFee: true,
      isSupportedNFT: true,
      trcToken: 'LAT',
      id: 'platon-network',
      name: 'PlatON Network',
      shortName: 'LAT',
      image: 'app_platon',
      imageLink: COIN_IMAGE.LAT,
      symbol: 'LAT',
      chain: chainType.platon,
  
      trcName: 'PRC20 PRC721',
      rpcURL: 'https://openapi2.platon.network/rpc',
      scan: 'https://scan.platon.network',
      balances: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8',
      nftMint: '0x5C93F4B35d3dD97Ef481881aA33d00F76806FdAD',
      multisend: '0x963e1BcD1f82724bD8Fa16a3B6962D100fB287FC'
    },
    moonbeam: {
      numChainId: 1284,
      chainId: '0x504',
      isToken: true,
      trcToken: 'GLMR',
      isSupportedEIP1559: true,
      isSupportedNFT: true,
      isWeb3: true,
      isFee: true,
      id: 'moonbeam',
      name: 'Moonbeam',
      shortName: 'GLMR',
      image: 'app_moonbeam',
      imageLink: COIN_IMAGE.GLMR,
      symbol: 'GLMR',
      chain: chainType.moonbeam,
      trcName: 'MERC20 MERC721',
      rpcURL: 'https://rpc.api.moonbeam.network',
      scan: 'https://moonscan.io',
      balances: '0x8a77C6d87B5E5Ea7e779C7d14cA50315Bfc4C019',
      nftMint: '0x1C40CBda91e1E0504805eCf038F2e067D11DdBE9',
      multisend: '0xf7eEe3A8363731C611A24CdDfCBcaDE9C153Cfe8'
    }
  }
import {ComputeBudgetProgram, PublicKey, TransactionInstruction, Message, Keypair as SolAccount, SYSVAR_RENT_PUBKEY, Transaction, Connection, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Token } from '@solana/spl-token'
import BufferLayout from 'buffer-layout'
import { sleep, convertWeiToBalance, getLength, roundingNumber } from '../../common/function'
import nacl from 'tweetnacl'
import { derivePath } from 'ed25519-hd-key'
import { isDapp, settingReduxRefSOL } from '../../common/constants'
// Serum Market V3
import { OpenOrders, _OPEN_ORDERS_LAYOUT_V2, MARKET_STATE_LAYOUT_V3 } from '@project-serum/serum/lib/market'
import { publicKeyLayout } from '@project-serum/serum/lib/layout'
import { TOKEN_MINTS, DexInstructions } from '@project-serum/serum'
import { CHAIN_DATA } from '../../common/constants/chainData'

import { convertBase58, generateSeed } from '../../controller/Web3/evm'
// import { DeviceUUID } from 'device-uuid'

import { get } from 'lodash'

const bs58 = require('bs58')

export const FEE_SOL = 0.000005

export const messFail = [
  'gasSolNotEnough',
  'tradeErrFund',
  'sizeTooSmall',
  'txsFail',
  'tooLarge',
  'exceedsLimit'
]

export const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
)

const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93)
])

const SERUM_CACHE_ACCOUNT = {}
export const SERUM_PROGRAM_ID_V3 = '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin'
export const FILTER_MARKETS = [
  {
    dataSize: MARKET_STATE_LAYOUT_V3.span
  }
]


export const parseTokenAccountData = (data) => {
  const { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data)
  return {
    mint: new PublicKey(mint),
    owner: new PublicKey(owner),
    amount
  }
}

export const NATIVE_SOL = {
  id: 'solana',
  mintAddress: 'So11111111111111111111111111111111111111112',
  symbol: 'SOL',
  name: 'Solana',
  icon: 'https://cdn.jsdelivr.net/gh/trustwallet/assets/blockchains/solana/info/logo.png',
  decimals: 9
}

export const SRM_PROGRAM_V3 = new PublicKey(SERUM_PROGRAM_ID_V3)

const txsFail = 'txsFail'

const pathSollet = 'm/44\'/501\'/0\'/0\''

// Gen solana connection
export function genConnectionSolana (isSerum) {
  if (window.wallet) {
    const connectionSolana = new Connection(isSerum
      ? 'https://solana-api.projectserum.com'
      : 'https://information.coin98.com/api/solanaV4', 
      {
        commitment: 'recent',
        headers:{
          development:'coin98'
        },
        httpHeaders: {
          development: 'coin98',
          authority: 'coin98.com',
          Version: '1.0',
          Authorization: 'Bearer token',
          Signature: 'c26340d5243d802f03de751b9cbc049557ad0a14296aacf4a37dc7399adbe65c',
          origin: 'https://wallet.coin98.com',
          referer: 'https://wallet.coin98.com'
        }
      })
    return connectionSolana
  }
}

const OWNER_VALIDATION_PROGRAM_ID = new PublicKey(
  '4MNPdKu9wFMvEeZBMt3Eipfs5ovVWTJb31pEXDJAAxX5'
)

const OWNER_VALIDATION_LAYOUT = BufferLayout.struct([
  publicKeyLayout('account')
])

const LAYOUT = BufferLayout.union(BufferLayout.u8('instruction'))
LAYOUT.addVariant(
  0,
  BufferLayout.struct([
    BufferLayout.u8('decimals'),
    BufferLayout.blob(32, 'mintAuthority'),
    BufferLayout.u8('freezeAuthorityOption'),
    BufferLayout.blob(32, 'freezeAuthority')
  ]),
  'initializeMint'
)
LAYOUT.addVariant(1, BufferLayout.struct([]), 'initializeAccount')
LAYOUT.addVariant(
  3,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'transfer'
)
LAYOUT.addVariant(
  7,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'mintTo'
)
LAYOUT.addVariant(
  8,
  BufferLayout.struct([BufferLayout.nu64('amount')]),
  'burn'
)

const instructionMaxSpan = Math.max(
  ...Object.values(LAYOUT.registry).map((r) => r.span)
)

// Support function
function encodeTokenInstructionData (instruction) {
  const b = Buffer.alloc(instructionMaxSpan)
  const span = LAYOUT.encode(instruction, b)
  return b.slice(0, span)
}

function initializeAccount ({ account, mint, owner }) {
  const keys = [
    { pubkey: account, isSigner: false, isWritable: true },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    data: encodeTokenInstructionData({
      initializeAccount: {}
    }),
    programId: TOKEN_PROGRAM_ID
  })
}

// function calculateSizeTransaction (transactions, recentBlockhash, owner) {
//   const transactionList = new Transaction({ recentBlockhash, feePayer: owner })
//   transactions
//     .filter((t) => t)
//     .forEach((t) => {
//       transactionList.add(t)
//     })
//   const data = transactionList.compileMessage()
//   return data.length > 911
// }

async function checkSOLfromSPLAccount (address) {
  try {
    const response = await fetch(CHAIN_DATA.solana.rpcURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        method: 'getAccountInfo',
        jsonrpc: '2.0',
        params: [address,
          { encoding: 'jsonParsed', commitment: 'confirmed' }],
        id: 'b7659fb6-7bcf-4b08-b822-64f98086a6d8'
      })
    })

    const jsonRes = await response.json()
    const realSOlAddress = jsonRes.result.value.owner === '11111111111111111111111111111111'
      ? address
      : jsonRes.result.value.data.parsed.info.owner
    return realSOlAddress
  } catch (error) {
    return address
  }
}

function transferEncode ({ source, destination, amount, owner }) {
  const keys = [
    { pubkey: source, isSigner: false, isWritable: true },
    { pubkey: destination, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: true, isWritable: false }
  ]
  return new TransactionInstruction({
    keys,
    data: encodeTokenInstructionData({
      transfer: { amount }
    }),
    programId: TOKEN_PROGRAM_ID
  })
}

async function findProgramAddress (seeds, programId) {
  const [publicKey, nonce] = await PublicKey.findProgramAddress(seeds, programId)
  return { publicKey, nonce }
}

async function findAssociatedTokenAddress (walletAddress, tokenMintAddress) {
  const { publicKey } = await findProgramAddress(
    [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )
  return publicKey
}

function encodeOwnerValidationInstruction (instruction) {
  const b = Buffer.alloc(OWNER_VALIDATION_LAYOUT.span)
  const span = OWNER_VALIDATION_LAYOUT.encode(instruction, b)
  return b.slice(0, span)
}

// Excute function
export const assertOwner = ({ account, owner }) => {
  const keys = [{ pubkey: account, isSigner: false, isWritable: false }]
  return new TransactionInstruction({
    keys,
    data: encodeOwnerValidationInstruction({ account: owner }),
    programId: OWNER_VALIDATION_PROGRAM_ID
  })
}

// Coin98 old format and sollet format
export function createSolanaWallet (seed, isSollet, privateKey) {

  if (privateKey) {
    return SolAccount.fromSecretKey(convertBase58(privateKey, true), { skipValidation: false })
  } else {
    const keyPair = nacl.sign.keyPair.fromSeed(isSollet ? derivePath(pathSollet, seed).key : seed.slice(0, 32))
    const nodeSolana = new SolAccount(keyPair)
    return nodeSolana
  }
}

export async function genOwnerSolana (wallet, deviceId) {
  try {


    if (isDapp) {
      const publicKey = new PublicKey(wallet?.address)
      return { publicKey }
    }

    let privateKey, seed

    const uuid = await import('device-uuid').then(mod => mod.DeviceUUID().get())

    if (getLength(wallet.privateKey) === 0) {
      const decryptMnemonic = await window.coin98?.provider.request({ method: 'aes_decrypt_coin98', params: { data: wallet.mnemonic, deviceId, uuid } })
      seed = await generateSeed(decryptMnemonic)
    } else {
      const decryptPrivateKey = await window.coin98?.provider.request({ method: 'aes_decrypt_coin98', params: { data: wallet.privateKey, deviceId, uuid } })
      privateKey = decryptPrivateKey
    }

    const owner = createSolanaWallet(seed, wallet.isSollet, privateKey)

    if (owner.publicKey.toString() === (wallet.walletAddress || wallet.address)) {
      return owner
    } else {
      if (privateKey) {
        return null
      }
      const owner = createSolanaWallet(seed, !wallet.isSollet)
      return owner
    }
  } catch (e) {
    console.log("🚀 ~ file: index.js ~ line 293 ~ genOwnerSolana ~ e", e)
    // await sleep(200)
    // if (time < 10) { return genOwnerSolana(wallet, time + 1) }
    return null
  }
}

export async function fetchSPLAccount (wallet, mintAddress) {
  try {
    if (mintAddress.toString() === NATIVE_SOL.mintAddress) {
      return wallet.address
    }

    const connection = genConnectionSolana()

    const publicKey = new PublicKey(wallet.address)
    const mintPubkey = new PublicKey(mintAddress)

    const fetchInside = async (isLastFetch) => {
      const accountToken = await connection.getTokenAccountsByOwner(publicKey, { mint: mintPubkey })
      if (accountToken && accountToken.value.length > 0) {
        let pubKey = accountToken.value[0].pubkey

        // Find ata first
        if (accountToken.value.length > 1) {
          const ata = await findAssociatedTokenAddress(publicKey, mintPubkey)
          const findAta = accountToken.value.find(itm => itm.pubkey.equals(ata))
          pubKey = findAta ? findAta.pubkey : accountToken.value.sort((a, b) => a.lamports > b.lamports ? -1 : 1)[0].pubkey
        }

        return pubKey
      } else {
        if (isLastFetch || !wallet.mnemonic || !wallet.privateKey) return null
        await createSPLToken(wallet, mintAddress)
        await sleep(200)
        return await fetchInside(true)
      }
    }
    return await fetchInside()
  } catch (error) {
    // log('Generate SPL error ', error && error.toString())
    return null
  }
}

export async function settleTransactions (marketTrade, selectedWallet) {
  const connection = genConnectionSolana()
  const owner = await genOwnerSolana(selectedWallet)

  const openOrders = await marketTrade.findOpenOrdersAccountsForOwner(
    connection,
    owner.publicKey
  )

  const filterOrder = getLength(openOrders) > 0 ? openOrders.filter(item => (item.baseTokenFree > 0 || item.quoteTokenFree > 0)) : []

  if (getLength(filterOrder) > 0) {
    filterOrder.reduce(
      (chain, item) => chain.then(async () => {
        const baseToken = await marketTrade.findBaseTokenAccountsForOwner(
          connection,
          owner.publicKey,
          true
        )
        const quoteToken = await marketTrade.findQuoteTokenAccountsForOwner(
          connection,
          owner.publicKey,
          true
        )

        const refAccount = settingReduxRefSOL
        let referrerQuoteWallet = null
        if (refAccount && marketTrade.supportsReferralFees) {
          const findInfo = TOKEN_MINTS.find((item) => item.address.toString() === marketTrade.quoteMintAddress.toString())
          if (findInfo) {
            referrerQuoteWallet = refAccount[findInfo.name] ? new PublicKey(refAccount[findInfo.name]) : null
          }
        }

        const { transaction, signers } = await marketTrade.makeSettleFundsTransaction(
          connection,
          item,
          baseToken[0].pubkey,
          quoteToken[0].pubkey,
          referrerQuoteWallet
        )

        return postBaseSendTxs(connection, [transaction], [owner, ...signers], true)
      }),
      Promise.resolve()
    ).then(() =>
      console.log('Done')
    )
  }
}

export async function sendMultipleSolana (selectedWallet, sendContract, listAddress, listAmount) {
  return new Promise(async (resolve, reject) => {
    try {
      const connection = genConnectionSolana()

      const owner = await genOwnerSolana(selectedWallet)

      const transaction = []

      for (let i = 0; i < listAddress.length; i++) {
        try {
          const toAddress = listAddress[i]
          const amount = listAmount[i]
          await sendTransactionSolana(selectedWallet, getLength(sendContract.address) > 0 ? sendContract : null, toAddress, amount, connection, owner, transaction)
        } catch (error) {
          console.log(error)
        }
      }

      const hash = await postBaseSendTxs(connection, transaction, [owner])
      if (messFail.includes(hash)) {
        reject(hash)
      } else {
        return resolve(hash)
      }
    } catch (error) {
      reject(error)
    }
  })
}

export const getBalanceSol = async (accountSol) => {
  const connection = genConnectionSolana()
  // const { accountSol } = store.getState()
  const balance = await connection.getBalance(new PublicKey(accountSol))
  const balanceConvert = convertWeiToBalance(balance, 9)
  // store.dispatch(StoreActions.setBalanceSol(balanceConvert))
  return balanceConvert
}

export async function solanaGetBalance (address, contract, connection, isGetRawAmount) {
  if (!address) return 0
  try {
    const connectionSolana = connection || genConnectionSolana()

    const pubKey = new PublicKey(address)

    if (contract) {
      const tokenInfo = await connectionSolana.getTokenAccountBalance(pubKey, 'recent')
      return isGetRawAmount ? tokenInfo?.value?.amount : tokenInfo?.value?.uiAmount
      // return tokenInfo?.value?.uiAmount
    }
    const balance = await connectionSolana.getBalance(pubKey)
    // return convertWeiToBalance(balance, 9)
    return isGetRawAmount ? balance : convertWeiToBalance(balance, 9)
  } catch (error) {
    return 0
  }
}


// Optimize function send for SPL and SOL use for multiple and single

export const decodeSolana = (buffer) => {
  try {
    return Message.from(buffer)
  } catch (e) {
    return null
  }
}

// WC v2
export const solanaSignMessage = async (wallet, message) => {
  const owner = await genOwnerSolana(wallet)

  const signature = nacl.sign.detached(bs58.decode(message), owner.secretKey)
  const bs58Signature = bs58.encode(signature)

  return { signature: bs58Signature }
}

export const solanaSignTransaction = async (wallet, seralised) => {
  const owner = await genOwnerSolana(wallet)
  const tx = deserialiseTransaction(seralised)
  tx.sign(owner)
  const result = tx.signatures[tx.signatures.length - 1]

  if (!result || (result && !result.signature)) {
    throw new Error('Missing Signature')
  }

  return {
    signature: bs58.encode(result.signature)
  }
}

export const deserialiseTransaction = (seralised) => {
  const tx = new Transaction({
    recentBlockhash: seralised.recentBlockhash,
    feePayer: new PublicKey(bs58.decode(seralised.feePayer))
  })
  tx.add(...seralised.instructions.map(x => ({
    programId: new PublicKey(bs58.decode(x.programId)),
    data: x.data ? Buffer.from(bs58.decode(x.data)) : Buffer.from([]),
    keys: x.keys.map(y => (Object.assign(Object.assign({}, y), { pubkey: new PublicKey(bs58.decode(y.pubkey)) })))
  })))
  seralised.partialSignatures.forEach(partial => {
    tx.addSignature(new PublicKey(bs58.decode(partial.pubkey)), Buffer.from(bs58.decode(partial.pubkey)))
  })
  return tx
}

export const serialiseTransaction = (tx) => {
  return {
    feePayer: tx.feePayer.toBase58(),
    recentBlockhash: tx.recentBlockhash,
    instructions: tx.instructions.map(instruction => ({
      programId: instruction.programId.toBase58(),
      keys: instruction.keys.map(key => (Object.assign(Object.assign({}, key), { pubkey: key.pubkey.toBase58() }))),
      data: bs58.encode(instruction.data)
    })),
    partialSignatures: tx.signatures.map(sign => ({
      pubkey: sign.publicKey.toBase58(),
      signature: bs58.encode(sign.signature)
    }))
  }
}

// End: WC v2
export const solanaSignDapp = async (wallet, transactionOrMessage, isMessage, isBase58) => {
  const tou8 = require('buffer-to-uint8array')
  const owner = await genOwnerSolana(wallet)
  const address = wallet.address

  if (isMessage && isBase58) {
    const bufSecretKey = owner.secretKey
    const serializedData = Buffer.from(transactionOrMessage)
    const bufSig = nacl.sign(serializedData, bufSecretKey).slice(0, 64)
    const signature = bs58.encode(Buffer.from(bufSig))

    return { address, msg: transactionOrMessage, signature }
  }

  if (isMessage) {
    const isMultiSign = Array.isArray(transactionOrMessage)
    const msgs = isMultiSign ? transactionOrMessage : [transactionOrMessage]
    const signatures = msgs.slice().map(msg => {
      const bufSecretKey = owner.secretKey
      const serializedData = Buffer.from(msg)
      const bufSig = nacl.sign(serializedData, bufSecretKey).slice(0, 64)
      const sig = Buffer.from(bufSig).toString('hex')
      return { address, sig, signature: sig, msg }
    })

    if (isMultiSign) {
      return signatures
    }
    return signatures[0]
  }

  const rawTxt = bs58.decode(transactionOrMessage)
  const txtTransformed = tou8(rawTxt)
  const signature = nacl.sign.detached(txtTransformed, owner.secretKey)

  const encodedSignature = bs58.encode(signature)
  return encodedSignature
}

export async function closeOpenOrder (marketTrade, wallet, openOrder) {
  const connection = genConnectionSolana()
  const owner = await genOwnerSolana(wallet)

  const transactions = []

  openOrder.map(order => {
    order.openOrdersAddress = new PublicKey(order.openOrdersAddress)
    const bigNumber = require('bn.js')

    order.orderId = new bigNumber(order.orderId)
    order.clientId = new bigNumber(order.clientId)
    order.priceLots = new bigNumber(order.priceLots)
    order.sizeLots = new bigNumber(order.sizeLots)

    transactions.push(marketTrade.makeCancelOrderInstruction(connection, owner.publicKey, order))
  })

  const hash = await postBaseSendTxs(connection, transactions, [owner], true)
  if (messFail.includes(hash)) {
    return { mess: hash, isError: true }
  } else {
    return hash
  }
}

export async function closeOpenOrderSerumDEX (wallet, openOrder, marketAddress) {
  const connection = genConnectionSolana()

  const owner = await genOwnerSolana(wallet)

  const createTxs = DexInstructions.closeOpenOrders({
    market: new PublicKey(marketAddress),
    openOrders: new PublicKey(openOrder),
    owner: owner.publicKey,
    solWallet: owner.publicKey,
    programId: SRM_PROGRAM_V3
  })

  const hash = await postBaseSendTxs(connection, [createTxs], [owner], true)
  if (messFail.includes(hash)) {
    return { mess: hash === txsFail ? 'claimFailed' : hash, isError: true }
  } else {
    const keyData = marketAddress + wallet.address
    SERUM_CACHE_ACCOUNT[keyData] = null

    return hash
  }
}

export async function unwrappedSPL (wallet, wSPL) {
  const connection = genConnectionSolana()

  const owner = await genOwnerSolana({
    mnemonic: wallet.mnemonic,
    isSollet: wallet.isSollet,
    address: wallet.address
  })

  const createTxs = Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID,
    new PublicKey(wSPL),
    owner.publicKey,
    owner.publicKey,
    []
  )
  const hash = await postBaseSendTxs(connection, [createTxs], [owner], true)
  if (messFail.includes(hash)) {
    return { mess: hash, isError: true }
  } else {
    return hash
  }
}

// Create Token SPL version 2
// https://spl.solana.com/associated-token-account
export async function createSPLToken (wallet, mintToken) {
  try {
    const connection = genConnectionSolana()
    const owner = await genOwnerSolana(wallet)
    const mintPubkey = new PublicKey(mintToken)

    const ata = await findAssociatedTokenAddress(owner.publicKey, mintPubkey)

    const createTxs = Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mintPubkey,
      ata,
      owner.publicKey,
      owner.publicKey
    )

    return postBaseSendTxs(connection, [createTxs], [owner], true)
  } catch (error) {
    return null
  }
}

export async function findOpenOrderAddress (marketTrade, address) {
  const connectionSolana = genConnectionSolana()
  const openOrdersAccounts = await marketTrade.findOpenOrdersAccountsForOwner(connectionSolana, new PublicKey(address), 0)
  const isAlreadyCreateProgramAccount = getLength(openOrdersAccounts) > 0
  const rentLamport = await connectionSolana.getMinimumBalanceForRentExemption(_OPEN_ORDERS_LAYOUT_V2.span)
  return {
    account: isAlreadyCreateProgramAccount ? openOrdersAccounts[0] : '',
    isExist: isAlreadyCreateProgramAccount,
    amount: rentLamport,
    amountUi: convertWeiToBalance(rentLamport, 9)
  }
}

export async function placeOrderSerumV3 (
  inputAmount,
  selectedWallet,
  marketTrade,
  outputAmount,
  fromCoin,
  toCoin,
  findAlreadyCreateProgram
) {
  return new Promise(async (resolve, reject) => {
    try {
      const connectionSolana = genConnectionSolana()
      const owner = await genOwnerSolana(selectedWallet)
      let signers = [owner]
      let transaction = []

      const isAlreadyCreateProgramAccount = findAlreadyCreateProgram.isExist

      const fromMint = fromCoin.mintAddress
      const toMint = toCoin.mintAddress
      const isFromSOL = fromMint === NATIVE_SOL.mintAddress
      let openOrdersAddress

      if (!isAlreadyCreateProgramAccount) {
        const newAccount = new SolAccount()

        const rentLamport = findAlreadyCreateProgram.amount
        openOrdersAddress = newAccount.publicKey
        transaction.push(
          SystemProgram.createAccount({
            fromPubkey: owner.publicKey,
            newAccountPubkey: newAccount.publicKey,
            lamports: rentLamport,
            space: _OPEN_ORDERS_LAYOUT_V2.span,
            programId: SRM_PROGRAM_V3
          })
        )

        signers.push(newAccount)
      } else {
        openOrdersAddress = findAlreadyCreateProgram.account.address
      }

      const isBuy = outputAmount.side === 'buy'
      const estPrice = outputAmount.worstPrice * (isBuy ? 1.01 : 0.99)
      const amountInputFormat = roundingNumber(isBuy ? inputAmount / estPrice : inputAmount, 6)

      let wrappedSolAccount = null

      // Always create wSOL for swap transaction
      if (isFromSOL) {
        // Calculate SOL needed for sending transaction
        let lamports
        if (isBuy) {
          lamports = Math.round(outputAmount.worstPrice * amountInputFormat * 1.01 * LAMPORTS_PER_SOL)
          if (isAlreadyCreateProgramAccount) {
            lamports -= findAlreadyCreateProgram.account.quoteTokenFree.toNumber()
          }
        } else {
          lamports = Math.round(amountInputFormat * LAMPORTS_PER_SOL)
          if (isAlreadyCreateProgramAccount) {
            lamports -= findAlreadyCreateProgram.account.baseTokenFree.toNumber()
          }
        }
        lamports = Math.max(lamports, 0) + 1e7
        const mintPubkeySOL = new PublicKey(NATIVE_SOL.mintAddress)
        // Find already wSOL in account

        const wSOLAccount = new SolAccount()

        transaction.push(
          SystemProgram.createAccount({
            fromPubkey: owner.publicKey,
            newAccountPubkey: wSOLAccount.publicKey,
            lamports,
            space: ACCOUNT_LAYOUT.span,
            programId: TOKEN_PROGRAM_ID
          })
        )
        signers.push(wSOLAccount)

        transaction.push(
          initializeAccount({
            account: wSOLAccount.publicKey,
            mint: mintPubkeySOL,
            owner: owner.publicKey
          })
        )
        wrappedSolAccount = wSOLAccount.publicKey
      }



      transaction.push(
        marketTrade.makePlaceOrderInstruction(connectionSolana, {
          owner: owner.publicKey,
          payer: wrappedSolAccount || new PublicKey(fromCoin.address),
          side: outputAmount.side,
          price: estPrice,
          size: amountInputFormat,
          orderType: 'limit',
          openOrdersAddressKey: openOrdersAddress
          // feeDiscountPubkey: useFeeDiscountPubkey
        })
      )

      // Close wSOL for return SOL
      if (wrappedSolAccount) {
        transaction.push(
          Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID,
            wrappedSolAccount,
            owner.publicKey,
            owner.publicKey,
            []
          )
        )
      }

      const mintSameFrom = marketTrade.baseMintAddress.toString() === fromMint.toString()
      const mintSameTo = marketTrade.quoteMintAddress.toString() === toMint.toString()

      const refAccount = settingReduxRefSOL
      let referrerQuoteWallet = null
      if (refAccount && marketTrade.supportsReferralFees) {
        const findInfo = TOKEN_MINTS.find((item) => item.address.toString() === marketTrade.quoteMintAddress.toString())
        if (findInfo) {
          referrerQuoteWallet = refAccount[findInfo.name] ? new PublicKey(refAccount[findInfo.name]) : null
        } else {
          window.listener.postCrash('REF_SOL' + marketTrade.quoteMintAddress.toString())
        }
      }

      const settleTransactions = await marketTrade.makeSettleFundsTransaction(
        connectionSolana,
        new OpenOrders(openOrdersAddress, { owner: owner.publicKey }, new PublicKey(SERUM_PROGRAM_ID_V3)),
        new PublicKey(mintSameFrom ? fromCoin.address : toCoin.address),
        new PublicKey(mintSameTo ? toCoin.address : fromCoin.address),
        referrerQuoteWallet
      )

      transaction = [...transaction, ...settleTransactions.transaction.instructions]

      if (getLength(settleTransactions.signers) > 0) {
        signers = [...signers, ...settleTransactions.signers]
      }


      const hash = await postBaseSendTxs(connectionSolana, transaction, signers, true)

      if (messFail.includes(hash)) {
        resolve({ mess: hash, isError: true })
      } else {
        resolve(hash)
      }
    } catch (mess) {
      const messErr = encodeMessErr(mess)
      reject(messErr)
    }
  })
}

export async function createOldTokenAccount (wallet, deviceId, address) {
  const connection = genConnectionSolana()
  const owner = await genOwnerSolana(wallet, deviceId);
  let signers = [owner]
  const transaction = new Transaction()

  const wSOLAccount = new SolAccount()

        transaction.add(
          SystemProgram.createAccount({
            fromPubkey: owner.publicKey,
            newAccountPubkey: wSOLAccount.publicKey,
            lamports: 0.5 + 1e7,
            space: ACCOUNT_LAYOUT.span,
            programId: TOKEN_PROGRAM_ID
          })
        )
        signers.push(wSOLAccount)

        transaction.add(
          initializeAccount({
            account: wSOLAccount.publicKey,
            mint: new PublicKey(address),
            owner: owner.publicKey
          })
        )

        const txSign = await postBaseSendSolanaNew({
          addressWallet: wallet?.address,
          connection,
          transactions: transaction,
          signer: signers,
          isWaitDone: true
        })
        console.log("🚀 ~ file: index.js ~ line 989 ~ createOldTokenAccount ~ txSign", txSign)

}

// For migrate old token SPL
// Check amount > 0 only and move fund not close old account
export async function findOldTokenAccount (connect, address) {
  const connection = connect || genConnectionSolana()

  const publicKey = new PublicKey(address)

  return connection.getParsedTokenAccountsByOwner(
    publicKey,
    {
      programId: TOKEN_PROGRAM_ID
    },
    'confirmed'
  )
    .then(async (parsedTokenAccounts) => {
      const tokenAccounts = {}
      const auxiliaryTokenAccounts = []

      for (const tokenAccountInfo of parsedTokenAccounts.value) {
        const tokenAccountPubkey = tokenAccountInfo.pubkey
        const tokenAccountAddress = tokenAccountPubkey.toBase58()
        const parsedInfo = tokenAccountInfo.account.data.parsed.info
        const mintAddress = parsedInfo.mint
        const balance = parsedInfo.tokenAmount.amount

        const ata = await findAssociatedTokenAddress(publicKey, new PublicKey(mintAddress))

        if (mintAddress !== 'So11111111111111111111111111111111111111112') {
          if (ata.equals(tokenAccountPubkey)) {
            tokenAccounts[mintAddress] = {
              account: tokenAccountInfo.account,
              pubkey: new PublicKey(tokenAccountAddress),
              tokenAccountAddress,
              balance
            }
          } else if (parsedInfo && balance > 0) {
            tokenAccountInfo.ata = ata
            auxiliaryTokenAccounts.push(tokenAccountInfo)
          }
        }
      }

      return { owner: address, auxiliaryTokenAccounts, tokenAccounts }
    })
}

export async function getRentSerumV3 (connect) {
  const connection = connect || genConnectionSolana()

  const rentLamport = await connection.getMinimumBalanceForRentExemption(_OPEN_ORDERS_LAYOUT_V2.span)
  return rentLamport
}

export async function findSwapTokenAccount (connect, address, serumMarket) {
  try {
    const owner = new PublicKey(address)
    const fullData = await OpenOrders.findForOwner(connect, owner, SRM_PROGRAM_V3)
    return fullData
  } catch (error) {
    return []
  }
}

export async function migrateOldSPLTokens (connection, wallet, auxiliaryTokenAccounts, tokenAccounts, showAlertToast) {
  const atas = []
  const owner = await genOwnerSolana(wallet)

  const ownerPubKey = owner.publicKey
  const transaction = []
  let currentIndex = 0

  for (let index = 0; index < auxiliaryTokenAccounts.length; index++) {
    const filterTxs = transaction.filter(itm => itm.index === currentIndex)

    if (index > 0 && getLength(filterTxs) > 9) {
      currentIndex += 1
    }

    const auxiliaryTokenAccount = auxiliaryTokenAccounts[index]

    const { pubkey: from, account: accountInfo } = auxiliaryTokenAccount
    const { info } = accountInfo.data.parsed
    const { mint, tokenAmount } = info

    const mintPubkey = new PublicKey(mint)

    const findAtaAlreadyCreated = tokenAccounts[mint]

    const ata = findAtaAlreadyCreated
      ? new PublicKey(findAtaAlreadyCreated.tokenAccountAddress)
      : await findAssociatedTokenAddress(ownerPubKey, mintPubkey)

    const ataConvert = findAtaAlreadyCreated ? findAtaAlreadyCreated.tokenAccountAddress : ata.toString()

    if (!atas.includes(ataConvert) && !findAtaAlreadyCreated) {
      atas.push(ataConvert)

      transaction.push(
        {
          index: currentIndex,
          txs: Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            mintPubkey,
            ata,
            ownerPubKey,
            ownerPubKey
          )
        }
      )
    }

    const { amount, uiAmount } = tokenAmount
    if (uiAmount > 0) {
      const stateSend = {
        destination: ata,
        source: from,
        owner: ownerPubKey,
        amount: amount
      }

      transaction.push({
        index: currentIndex,
        txs: transferEncode(stateSend)
      })
    }

    // transaction.push({
    //   index: currentIndex,
    //   txs: Token.createCloseAccountInstruction(TOKEN_PROGRAM_ID,
    //     from,
    //     ata,
    //     ownerPubKey,
    //     []
    //   )
    // })
  }

  let hashResult

  for (let i = 0; i <= currentIndex; i++) {
    if (hashResult && hashResult.isError) {
      return hashResult
    } else {
      // showAlertToast(Lang.t('txsRunIndex', { amount: (i + 1) + '/' + (currentIndex + 1) }))

      const filterTxs = transaction.filter(itm => itm.index === i).map(itm => itm.txs)


      const hash = await postBaseSendTxs(connection, filterTxs, [owner], true)

      if (messFail.includes(hash)) {
        hashResult = { mess: hash, isError: true }
      } else {
        hashResult = hash
      }
    }
  }

  if (hashResult && hashResult.isError) {
    return hashResult
  } else {
    return hashResult
  }
}

export function encodeMessErr (mess) {
  const stringResult = mess ? mess.toString() : ''
  if (stringResult.includes('Error')) {
    let mess = txsFail
    switch (true) {
    case  stringResult.includes('0x1') || stringResult.includes('Insufficient funds') :
      mess = 'tradeErrFund'
      break
    case stringResult.includes('size too small'):
      mess = 'sizeTooSmall'
      break
    case stringResult.includes('Transaction too large'):
      mess = 'tooLarge'
      break
    case stringResult.includes('0x1') || stringResult.includes('Attempt to debit an account but') || stringResult.includes('prior credit'):
      mess = 'gasSolNotEnough'
      break
    case stringResult.includes('the capitalization checksum'):
      mess = null
      break
    }
    return mess
  } else {
    return txsFail
  }
}



export async function postBaseSendTxs (connection, transactions, signer, isWaitDone, isSentRaw) {
  const { blockhash } = await connection.getRecentBlockhash()
  const transactionList = isSentRaw ? transactions : new Transaction({ recentBlockhash: blockhash })
  if (!isSentRaw) {
    transactions
      .filter((t) => t)
      .forEach((t) => {
        transactionList.add(t)
      })
  }

  return connection.sendTransaction(transactionList, signer, {
    skipPreflight: false
  }).then(async (hash) => {
    if (isWaitDone !== 1) {
      await awaitTransactionSignatureConfirmation(connection, hash)
    }
    return hash
  }).catch(mess => {
    if (isWaitDone !== 1) {
      postBaseSendTxs(connection, transactions, signer, 1, isSentRaw)
    }
    return encodeMessErr(mess)
  })
}

export async function postBaseSendSolanaNew ({
  addressWallet,
  connection,
  transactions,
  signer,
  isWaitDone,
  callBack,
  callBackFinal,
  dataReturn,
  skipPreflight = false,
  multiplyFeePriority = 100
}) {
  try {
    let action = 'sendTransaction'

    if(!isDapp){
      const requestUnlock = await window.coin98.provider.request({method: 'request_unlock'});
      if(!get(requestUnlock, 'isUnlocked', false)){
        return { isErr: true, data: 'unlockFail' }
      }
    }

    if (isDapp) {
      const publicKey = new PublicKey(addressWallet)
      transactions.feePayer = publicKey
      transactions.recentBlockhash = (
        await connection.getRecentBlockhash('max')
      ).blockhash
      transactions = await signTransaction(transactions)
      if (signer.length > 1) {
        const getSignerValid = signer.slice().filter((it) => it.secretKey)
        transactions.partialSign(...getSignerValid)
      }
      transactions = transactions.serialize()
      action = 'sendRawTransaction'
    }

    // estimate gas
    const UNIT_DEFAULT = 200_000
    const FEE_DEFAULT = 100000

    const getPriority = await connection.getRecentPrioritizationFees()
    const currentFee = getPriority
      .filter((fee) => fee?.prioritizationFee > 0)
      .map((fee) => fee?.prioritizationFee)

    const simulate = await connection.simulateTransaction(transactions)
    const budgetUnitEst = get(simulate, 'value.unitsConsumed', UNIT_DEFAULT)
    const feePriority = Math.max(...currentFee) * multiplyFeePriority

    let transactionFeePriorityInstruction = null
    let budgetUnitInstruction = null
    let totalUnit = UNIT_DEFAULT

    // set fee priority
    if (feePriority <= FEE_DEFAULT) {
      transactionFeePriorityInstruction =
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: FEE_DEFAULT
        })
    } else {
      transactionFeePriorityInstruction =
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: feePriority
        })
    }

    // set budget unit
    if (budgetUnitEst <= UNIT_DEFAULT) {
      budgetUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: UNIT_DEFAULT
      })
    } else {
      // example:
      // budgetUnitEst = 285_000
      // unitCalculate = 285_000 - 200_000 = 85_000
      // result = 85_000 + 200_000 + 1_000 = 286_000
      const UNIT_BUFFER = 1_000
      const unitCalculate = budgetUnitEst - UNIT_DEFAULT
      totalUnit = unitCalculate + UNIT_DEFAULT + UNIT_BUFFER
      budgetUnitInstruction = ComputeBudgetProgram.setComputeUnitLimit({
        units: totalUnit
      })
    }

    transactions
      .add(budgetUnitInstruction)
      .add(transactionFeePriorityInstruction)


    
    //
    const tx = await connection[action](transactions, signer, {
      skipPreflight,
      preflightCommitment: 'confirmed'
    }).catch((err) => {
      console.log("🚀 ~ file: index.js ~ line 1203 ~ genConnectionSolana ~ err", err)
      const data = JSON.stringify(get(err, 'logs', ''))
      return { isErr: true, data: encodeMessErr(data) }
    })
    const { isErr } = tx
    if (isErr) {
      return tx
    }
    console.log({ tx })
    callBack && callBack(tx, dataReturn)
    connection.onSignatureWithOptions(
      tx,
      async () => {
        if (isWaitDone) {
          callBackFinal && callBackFinal(tx, dataReturn)
        }
      },
      {
        commitment: 'confirmed'
      }
    )
    return tx
  } catch (err) {
    console.log('txs solana err: ', err)
    return { isErr: true, data: encodeMessErr(err) }
  }
}

export async function postBaseSendSolanaRemake({
  addressWallet,
  connection,
  transactions,
  signer,
  isWaitDone,
  callBackDone,
  callBackFail,
  dataReturn
}){
  return new Promise(async (resolve, reject) => {
    try{
    let action = 'sendTransaction'
    if (isDapp) {
      const publicKey = new PublicKey(addressWallet)
      transactions.feePayer = publicKey
      transactions.recentBlockhash = (
        await connection.getRecentBlockhash('max')
      ).blockhash
      transactions = await signTransaction(transactions)
      if (signer.length > 1) {
        const getSignerValid = signer.slice().filter((it) => it.secretKey)
        transactions.partialSign(...getSignerValid)
      }
      transactions = transactions.serialize()
      action = 'sendRawTransaction'
    }



    const tx = await connection[action](transactions, signer, {
      skipPreflight: false,
      preflightCommitment: 'confirmed'
    })

    if(!isWaitDone){
      callBackDone && callBackDone(tx, dataReturn)
    }


    connection.onSignatureWithOptions(
      tx,
      async () => {
        if (isWaitDone) {
          callBackDone && callBackDone(tx, dataReturn)
          resolve('ok')
        }
      },
      {
        commitment: 'confirmed'
      }
    )
    }catch(err){
      callBackFail && callBackFail(encodeMessErr(err))
      reject(encodeMessErr(err))
    }

  })
  
}

export async function awaitTransactionSignatureConfirmation (
  connection,
  txid,
  timeout = 120000
) {
  let done = false
  const result = await new Promise((resolve, reject) => {
    (async () => {
      setTimeout(() => {
        if (done) {
          return
        }
        done = true
        console.log('Timed out for txid', txid)
        const timeout = { timeout: true }
        reject(timeout)
      }, timeout)
      try {
        connection.onSignature(
          txid,
          (result) => {
            done = true
            if (result.err) {
              reject(txsFail)
            } else {
              resolve(result)
            }
          },
          'recent'
        )
      } catch (e) {
        done = true
        console.log('WS error in setup', txid, e)
      }
      while (!done) {
        // eslint-disable-next-line no-loop-func
        (async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([
              txid
            ])
            const result = signatureStatuses && signatureStatuses.value[0]
            if (!done) {
              if (!result) {
                console.log('REST null result for', txid, result)
              } else if (result.err) {
                done = true
                reject(txsFail)
              } else if (!result.confirmations) {
                done = true
                resolve(result)
              } else {
                done = true
                resolve(result)
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e)
            }
          }
        })()
        await sleep(300)
      }
    })()
  })
  done = true
  return result
}

// export async function signTransaction (transaction, wallet) {
//   const bs58 = require('bs58')

//   const params = bs58.encode(transaction.serializeMessage())

//   const signature = await solanaSignDapp(wallet, params)
//   const sig = bs58.decode(signature)
//   const publicKey = new PublicKey(wallet.address)
//   transaction.addSignature(publicKey, sig)
//   return transaction
// }

export async function signTransaction (transaction) {
  return window?.coin98?.sol
    .request({ method: 'sol_sign', params: [transaction] })
    .then((res) => {
      const sig = bs58.decode(res.signature)
      const publicKey = new PublicKey(res.publicKey)
      transaction.addSignature(publicKey, sig)
      return transaction
    })
    .catch((err) => {
      console.log({ err })
    })
}

export const createAtaSol = async (connection, owner, transaction, amount) => {
  const mint = new PublicKey(NATIVE_SOL.mintAddress)
  const ata = await Token.getAssociatedTokenAddress(
    ASSOCIATED_TOKEN_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
    mint,
    owner,
    true
  )

  const rent = await Token.getMinBalanceRentForExemptAccount(connection)
  transaction.add(
    SystemProgram.transfer({
      fromPubkey: owner,
      toPubkey: ata,
      lamports: amount + rent
    }),
    Token.createAssociatedTokenAccountInstruction(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      ata,
      owner,
      owner
    )
  )

  return ata
}

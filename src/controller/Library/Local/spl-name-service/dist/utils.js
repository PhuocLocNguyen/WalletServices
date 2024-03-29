"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDNSRecordAddress = exports.performReverseLookup = exports.getFilteredProgramAccounts = exports.getNameOwner = exports.getNameAccountKey = exports.getHashedName = exports.signAndSendTransactionInstructions = exports.Numberu64 = exports.Numberu32 = exports.REVERSE_LOOKUP_CLASS = void 0;
const assert_1 = __importDefault(require("assert"));
const create_hash_1 = __importDefault(require("create-hash"));
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const bindings_1 = require("./bindings");
const state_1 = require("./state");
exports.REVERSE_LOOKUP_CLASS = new web3_js_1.PublicKey("33m47vH6Eav6jr5Ry86XjhRft2jRBLDnDgPSHoquXi2Z");
class Numberu32 extends bn_js_1.default {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 4) {
            return b;
        }
        assert_1.default(b.length < 4, "Numberu32 too large");
        const zeroPad = Buffer.alloc(4);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a Numberu64 from Buffer representation
     */
    static fromBuffer(buffer) {
        assert_1.default(buffer.length === 4, `Invalid buffer length: ${buffer.length}`);
        return new bn_js_1.default([...buffer]
            .reverse()
            .map((i) => `00${i.toString(16)}`.slice(-2))
            .join(""), 16);
    }
}
exports.Numberu32 = Numberu32;
class Numberu64 extends bn_js_1.default {
    /**
     * Convert to Buffer representation
     */
    toBuffer() {
        const a = super.toArray().reverse();
        const b = Buffer.from(a);
        if (b.length === 8) {
            return b;
        }
        assert_1.default(b.length < 8, "Numberu64 too large");
        const zeroPad = Buffer.alloc(8);
        b.copy(zeroPad);
        return zeroPad;
    }
    /**
     * Construct a Numberu64 from Buffer representation
     */
    static fromBuffer(buffer) {
        assert_1.default(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
        return new bn_js_1.default([...buffer]
            .reverse()
            .map((i) => `00${i.toString(16)}`.slice(-2))
            .join(""), 16);
    }
}
exports.Numberu64 = Numberu64;
const signAndSendTransactionInstructions = async (
// sign and send transaction
connection, signers, feePayer, txInstructions) => {
    const tx = new web3_js_1.Transaction();
    tx.feePayer = feePayer.publicKey;
    signers.push(feePayer);
    tx.add(...txInstructions);
    return await connection.sendTransaction(tx, signers);
};
exports.signAndSendTransactionInstructions = signAndSendTransactionInstructions;
async function getHashedName(name) {
    const input = bindings_1.HASH_PREFIX + name;
    const buffer = create_hash_1.default("sha256").update(input, "utf8").digest();
    return buffer;
}
exports.getHashedName = getHashedName;
async function getNameAccountKey(hashed_name, nameClass, nameParent) {
    const seeds = [hashed_name];
    if (nameClass) {
        seeds.push(nameClass.toBuffer());
    }
    else {
        seeds.push(Buffer.alloc(32));
    }
    if (nameParent) {
        seeds.push(nameParent.toBuffer());
    }
    else {
        seeds.push(Buffer.alloc(32));
    }
    const [nameAccountKey] = await web3_js_1.PublicKey.findProgramAddress(seeds, bindings_1.NAME_PROGRAM_ID);
    return nameAccountKey;
}
exports.getNameAccountKey = getNameAccountKey;
async function getNameOwner(connection, nameAccountKey) {
    const nameAccount = await connection.getAccountInfo(nameAccountKey);
    if (!nameAccount) {
        throw new Error("Unable to find the given account.");
    }
    return state_1.NameRegistryState.retrieve(connection, nameAccountKey);
}
exports.getNameOwner = getNameOwner;
//Taken from Serum
async function getFilteredProgramAccounts(connection, programId, filters) {
    const resp = await connection.getProgramAccounts(programId, {
        commitment: connection.commitment,
        filters,
        encoding: "base64",
    });
    return resp.map(({ pubkey, account: { data, executable, owner, lamports } }) => ({
        publicKey: pubkey,
        accountInfo: {
            data: data,
            executable,
            owner: owner,
            lamports,
        },
    }));
}
exports.getFilteredProgramAccounts = getFilteredProgramAccounts;
async function performReverseLookup(connection, nameAccount) {
    let hashedReverseLookup = await getHashedName(nameAccount.toBase58());
    let reverseLookupAccount = await getNameAccountKey(hashedReverseLookup, exports.REVERSE_LOOKUP_CLASS);
    let name = await state_1.NameRegistryState.retrieve(connection, reverseLookupAccount);
    if (!name.data) {
        throw "Could not retrieve name data";
    }
    let nameLength = new bn_js_1.default(name.data.slice(0, 4), "le").toNumber();
    return name.data.slice(4, 4 + nameLength).toString();
}
exports.performReverseLookup = performReverseLookup;
async function getDNSRecordAddress(nameAccount, type) {
    let hashedName = await getHashedName("\0".concat(type));
    let recordAccount = await getNameAccountKey(hashedName, undefined, nameAccount);
    return recordAccount;
}
exports.getDNSRecordAddress = getDNSRecordAddress;
//# sourceMappingURL=utils.js.map
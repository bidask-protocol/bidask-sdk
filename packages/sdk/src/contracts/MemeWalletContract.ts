import { Address, beginCell, Cell, Contract, contractAddress } from '@ton/ton'

type MemeJettonWalletConfig = {
  ownerAddress: Address
  jettonMasterAddress: Address
  bidaskExclusive?: boolean
}

function jettonWalletConfigToCell(config: MemeJettonWalletConfig): Cell {
  return beginCell()
    .storeCoins(0) // jetton balance
    .storeAddress(config.ownerAddress)
    .storeAddress(config.jettonMasterAddress)
    .storeBit(config.bidaskExclusive ?? false)
    .endCell()
}

/**
 * @ignore
 */
export class MemeJettonWallet implements Contract {
  static code =
    'b5ee9c7201020f010003b8000114ff00f4a413f4bcf2c80b0102016202030202cf0405001da0f605da89a1f401f481f48061f05503c33e24638d34c7cc75cb082f1a8a3325b4cfcc7e800c238475cb08f7bb2fbd24bc8ff874cfcc7e800c38bb51343e8000a832007e80b3b27b553835cb082f1a8a3338c0b5cb081f14fd4b38c0b5cb08b2be0f7938c0b5cb09a6e42b190c772103fcbc200607080123007d01085bace4c0b0c0248c9c38b8c08c600c01fced44d001d33ffa00fa40fa40fa0006fa0020fa40fa40d70a00f89222c70591318e51f892f82a5392c8cf842012ce15ce14ca00c9785202155cf90001f9005ad76501d76524aa09820a0381a0a0c8cb1fcb0fcb0fcbffcbff71f9040031330284f7b002fa4484f7b05003ba02c00012b0f2e04ae25137a0c801fa0212cec90901fcd33ffa00fa40fa40f401fa0020f404016e913091d1e223fa4430c000f2e14df897f89370f83a237271e304f839206e8119f922e304216e811eaf5803e304820898968027a05034a813a07381032c70f83ca00270f83612a00170f836a07381040282100966018070f837a0bcf2b0ed44d0fa0020fa40fa40d70a00f892230a00daf897f839206e81108658e304718102f270f8380170f836a08111b270f836a0bcf2b0ed44d0fa0020fa40fa4030f89222c705f2e04904d33ffa00fa40305351bef2af5151a1c801fa0214cec9ed54c8cf91ef765f7acb3f58fa02cecec9c8cf858812ce71cf0b6eccc98050fb0000deed54228e275077f00125c8cf850818ce58fa0282107362d09ccf0b8a16cb3f5003fa02ce13f400c98011fb00945f03345be221d72c05318e33f8276f10f897a1f82fa07381040282100966018070f837b60972fb02c8cf850812ce8210d53276dbcf0b8ecb3fc9810082fb00915be201fec705f2e0495349bef2af5149a1c801fa0213cec9ed54f82a27c8cf8420ce13ce13ca00c978c8cf905e3514661acb3f5008fa0212ce14ce58fa02cec9c8cf8988015475245cf90001f9005ad76501d76524aa09820a0381a0a0c8cb1fcb0fcb0fcbffcbff71f904003184f7b004800b27d7243615ce12cbf781150dcf0b79cc0b000eccccc98050fb0002fc01d120d0d72c271d06a41492f231e0d72c22070846b492f231e0d72c212c9c2b0c92f231e0d72c27e7cf2c7c92f231e0d72c233326f15492f231e0d72c21be04b6fc92f231e0d72c2607ff708492f231e0d72c2607ff709492f231e0d72c2607ff708c92f231e0d72c253fdac7c492f231e0d72c222346f3bc92f231e0890d0e00086559ce1d003ad72792f231e0d72c2229af8d5c92f231e0d72c259bd4805c3192f231e0'

  static get codeCell() {
    return Cell.fromBoc(Buffer.from(MemeJettonWallet.code, 'hex'))[0]
  }

  static createFromConfig(config: MemeJettonWalletConfig, code: Cell, workchain = 0) {
    const data = jettonWalletConfigToCell(config)
    const init = { splitDepth: 8, code, data }
    return new MemeJettonWallet(
      rewriteAddressFirstBits(config.ownerAddress, contractAddress(workchain, init)),
      init,
    )
  }

  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}
}

const address_mask = 115339776388732929035197660848497720713218148788040405586178452820382218977280n
const address_antimask =
  452312848583266388373324160190187140051835877600158453279131187530910662655n

function rewriteAddressFirstBits(source: Address, addr: Address): Address {
  let source_hash = BigInt('0x' + source.hash.toString('hex'))
  let addr_hash = BigInt('0x' + addr.hash.toString('hex'))
  addr_hash = (source_hash & address_mask) | (addr_hash & address_antimask)
  let base = '0:'
  for (let i = 0; i < 64 - addr_hash.toString(16).length; ++i) {
    base += '0'
  }
  return Address.parse(base + addr_hash.toString(16))
}

import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { BridgedVerifiedNullifier } from "../generated/schema"
import { BridgedVerifiedNullifier as BridgedVerifiedNullifierEvent } from "../generated/RobinXWorldIdVerifier/RobinXWorldIdVerifier"
import { handleBridgedVerifiedNullifier } from "../src/robin-x-world-id-verifier"
import { createBridgedVerifiedNullifierEvent } from "./robin-x-world-id-verifier-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let messageId = Bytes.fromI32(1234567890)
    let nullifierHash = BigInt.fromI32(234)
    let caller = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newBridgedVerifiedNullifierEvent = createBridgedVerifiedNullifierEvent(
      messageId,
      nullifierHash,
      caller
    )
    handleBridgedVerifiedNullifier(newBridgedVerifiedNullifierEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("BridgedVerifiedNullifier created and stored", () => {
    assert.entityCount("BridgedVerifiedNullifier", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "BridgedVerifiedNullifier",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "messageId",
      "1234567890"
    )
    assert.fieldEquals(
      "BridgedVerifiedNullifier",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "nullifierHash",
      "234"
    )
    assert.fieldEquals(
      "BridgedVerifiedNullifier",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "caller",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})

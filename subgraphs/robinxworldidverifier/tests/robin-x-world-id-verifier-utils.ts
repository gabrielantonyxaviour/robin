import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt, Address } from "@graphprotocol/graph-ts"
import { BridgedVerifiedNullifier } from "../generated/RobinXWorldIdVerifier/RobinXWorldIdVerifier"

export function createBridgedVerifiedNullifierEvent(
  messageId: Bytes,
  nullifierHash: BigInt,
  caller: Address
): BridgedVerifiedNullifier {
  let bridgedVerifiedNullifierEvent = changetype<BridgedVerifiedNullifier>(
    newMockEvent()
  )

  bridgedVerifiedNullifierEvent.parameters = new Array()

  bridgedVerifiedNullifierEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  bridgedVerifiedNullifierEvent.parameters.push(
    new ethereum.EventParam(
      "nullifierHash",
      ethereum.Value.fromUnsignedBigInt(nullifierHash)
    )
  )
  bridgedVerifiedNullifierEvent.parameters.push(
    new ethereum.EventParam("caller", ethereum.Value.fromAddress(caller))
  )

  return bridgedVerifiedNullifierEvent
}

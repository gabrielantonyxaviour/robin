import { BridgedVerifiedNullifier as BridgedVerifiedNullifierEvent } from "../generated/RobinXWorldIdVerifier/RobinXWorldIdVerifier"
import { BridgedVerifiedNullifier } from "../generated/schema"

export function handleBridgedVerifiedNullifier(
  event: BridgedVerifiedNullifierEvent
): void {
  let entity = new BridgedVerifiedNullifier(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.nullifierHash = event.params.nullifierHash
  entity.caller = event.params.caller

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

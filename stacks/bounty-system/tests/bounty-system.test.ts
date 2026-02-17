import { describe, expect, it, beforeEach } from "vitest"
import { Cl } from "@stacks/transactions"

declare const simnet: any

describe("Bounty System Contract - Comprehensive Tests", () => {
  const accounts = simnet.getAccounts()
  const deployer = accounts.get("deployer")!
  const creator1 = accounts.get("wallet_1")!
  const creator2 = accounts.get("wallet_2")!
  const hunter1 = accounts.get("wallet_3")!
  const hunter2 = accounts.get("wallet_4")!
  const randomUser = accounts.get("wallet_5")!

  const testTitle = "Fix security vulnerability in smart contract" as const
  const testSubmission = "Fixed the reentrancy vulnerability and added tests" as const
  const testDeadline = 1000 // blocks from now

  describe("Contract Initialization", () => {
    it("should set contract owner to deployer", () => {
      // Contract owner is set at deployment to tx-sender
      // We can verify by checking who can set fees
      const result = simnet.callPublicFn(
        "bounties",
        "set-platform-fee",
        [Cl.uint(600)],
        deployer
      )
      expect(result.result).toBeOk(Cl.bool(true))
    })

    it("should initialize platform fee to 5%", () => {
      const result = simnet.callReadOnlyFn(
        "bounties",
        "get-platform-fee",
        [],
        deployer
      )
      expect(result.result).toBeOk(Cl.uint(500))
    })

    it("should initialize bounty nonce to 0", () => {
      // Create a bounty to see nonce increments from 0 to 1
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )
      expect(result.result).toBeOk(Cl.uint(1))
    })
  })

  describe("Bounty Creation", () => {
    it("should create a bounty with valid parameters", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(5000), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )

      expect(result.result).toBeOk(Cl.uint(1))

      const bounty = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(1)],
        deployer
      )

      expect(bounty.result).toBeSome(
        Cl.tuple({
          creator: Cl.principal(creator1),
          reward: Cl.uint(5000),
          title: Cl.stringAscii(testTitle),
          hunter: Cl.none(),
          status: Cl.uint(1), // status-open
          "created-at": Cl.uint(simnet.blockHeight),
          deadline: Cl.uint(testDeadline),
          submission: Cl.none()
        })
      )

      // Check user stats updated
      const stats = simnet.callReadOnlyFn(
        "bounties",
        "get-user-stats",
        [Cl.principal(creator1)],
        deployer
      )

      expect(stats.result).toEqual(
        Cl.tuple({
          "bounties-created": Cl.uint(1),
          "bounties-completed": Cl.uint(0),
          "total-earned": Cl.uint(0),
          "reputation-score": Cl.uint(0)
        })
      )
    })

    it("should create multiple bounties with incrementing IDs", () => {
      // First bounty
      simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii("Bounty 1"), Cl.uint(100)],
        creator1
      )

      // Second bounty
      const result2 = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(2000), Cl.stringAscii("Bounty 2"), Cl.uint(200)],
        creator1
      )

      expect(result2.result).toBeOk(Cl.uint(2))

      const bounty2 = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(2)],
        deployer
      )

      expect(bounty2.value.data.title).toEqual(Cl.stringAscii("Bounty 2"))
    })

    it("should reject bounty with zero reward", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(0), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(103)) // err-invalid-amount
    })

    it("should reject bounty with past deadline", () => {
      const pastDeadline = simnet.blockHeight - 10
      
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii(testTitle), Cl.uint(pastDeadline)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(103)) // err-invalid-amount
    })

    it("should allow bounty with deadline at current block", () => {
      const currentBlock = simnet.blockHeight
      
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii(testTitle), Cl.uint(currentBlock)],
        creator1
      )

      // Should reject because deadline must be > current block
      expect(result.result).toBeErr(Cl.uint(103))
    })

    it("should handle maximum title length", () => {
      const maxTitle = "A".repeat(256) as `${string}`
      
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii(maxTitle), Cl.uint(testDeadline)],
        creator1
      )

      expect(result.result).toBeOk(Cl.uint(3))
    })
  })

  describe("Claim Bounty", () => {
    let bountyId: number

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(5000), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )
      bountyId = (result.result as any).value.value
    })

    it("should allow hunter to claim open bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      expect(result.result).toBeOk(Cl.bool(true))

      const bounty = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(bountyId)],
        deployer
      )

      expect(bounty.value.data.hunter).toEqual(Cl.some(Cl.principal(hunter1)))
      expect(bounty.value.data.status).toEqual(Cl.uint(2)) // status-assigned
    })

    it("should prevent claiming already claimed bounty", () => {
      // First claim
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      // Second claim attempt
      const result = simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter2
      )

      expect(result.result).toBeErr(Cl.uint(106)) // err-already-assigned
    })

    it("should prevent claiming expired bounty", () => {
      // Advance past deadline
      simnet.mineEmptyBlocks(testDeadline + 10)

      const result = simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(105)) // err-not-completed
    })

    it("should prevent claiming non-existent bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(999)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(101)) // err-not-found
    })

    it("should allow multiple hunters to claim different bounties", () => {
      // Create second bounty
      simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(3000), Cl.stringAscii("Another Bounty"), Cl.uint(testDeadline + 100)],
        creator2
      )

      // Claim first bounty
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(1)],
        hunter1
      )

      // Claim second bounty
      const result = simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(2)],
        hunter2
      )

      expect(result.result).toBeOk(Cl.bool(true))
    })
  })

  describe("Submit Work", () => {
    let bountyId: number

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(5000), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )
      bountyId = (result.result as any).value.value

      // Claim the bounty
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )
    })

    it("should allow assigned hunter to submit work", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(bountyId), Cl.stringAscii(testSubmission)],
        hunter1
      )

      expect(result.result).toBeOk(Cl.bool(true))

      const bounty = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(bountyId)],
        deployer
      )

      expect(bounty.value.data.submission).toEqual(Cl.some(Cl.stringAscii(testSubmission)))
      expect(bounty.value.data.status).toEqual(Cl.uint(3)) // status-submitted
    })

    it("should prevent non-assigned user from submitting", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(bountyId), Cl.stringAscii(testSubmission)],
        hunter2
      )

      expect(result.result).toBeErr(Cl.uint(102)) // err-unauthorized
    })

    it("should prevent submitting after deadline", () => {
      // Advance past deadline
      simnet.mineEmptyBlocks(testDeadline + 10)

      const result = simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(bountyId), Cl.stringAscii(testSubmission)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(105)) // err-not-completed
    })

    it("should prevent submitting for non-existent bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(999), Cl.stringAscii(testSubmission)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(101)) // err-not-found
    })

    it("should handle maximum submission length", () => {
      const maxSubmission = "A".repeat(512) as `${string}`
      
      const result = simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(bountyId), Cl.stringAscii(maxSubmission)],
        hunter1
      )

      expect(result.result).toBeOk(Cl.bool(true))
    })
  })

  describe("Approve Bounty", () => {
    let bountyId: number
    const reward = 5000

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(reward), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )
      bountyId = (result.result as any).value.value

      // Claim and submit
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(bountyId), Cl.stringAscii(testSubmission)],
        hunter1
      )
    })

    it("should allow creator to approve completed bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      const platformFee = Math.floor(reward * 0.05) // 5%
      const hunterPayment = reward - platformFee
      
      expect(result.result).toBeOk(Cl.uint(hunterPayment))

      const bounty = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(bountyId)],
        deployer
      )

      expect(bounty.value.data.status).toEqual(Cl.uint(4)) // status-completed

      // Check hunter stats updated
      const hunterStats = simnet.callReadOnlyFn(
        "bounties",
        "get-user-stats",
        [Cl.principal(hunter1)],
        deployer
      )

      expect(hunterStats.result).toEqual(
        Cl.tuple({
          "bounties-created": Cl.uint(0),
          "bounties-completed": Cl.uint(1),
          "total-earned": Cl.uint(hunterPayment),
          "reputation-score": Cl.uint(10)
        })
      )
    })

    it("should prevent non-creator from approving", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(bountyId)],
        hunter2
      )

      expect(result.result).toBeErr(Cl.uint(102)) // err-unauthorized
    })

    it("should prevent approving non-submitted bounty", () => {
      // Create new bounty without submission
      const newBounty = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(3000), Cl.stringAscii("Quick Bounty"), Cl.uint(testDeadline)],
        creator1
      )
      const newBountyId = (newBounty.result as any).value.value

      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(newBountyId)],
        hunter1
      )

      // Try to approve without submission
      const result = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(newBountyId)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(105)) // err-not-completed
    })

    it("should prevent approving already completed bounty", () => {
      // Approve first time
      simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      // Try to approve again
      const result = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(105)) // err-not-completed (status not submitted)
    })

    it("should calculate platform fee correctly", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      const platformFee = Math.floor(reward * 0.05)
      const hunterPayment = reward - platformFee
      
      expect(result.result).toBeOk(Cl.uint(hunterPayment))
    })
  })

  describe("Cancel Bounty", () => {
    let bountyId: number

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(5000), Cl.stringAscii(testTitle), Cl.uint(testDeadline)],
        creator1
      )
      bountyId = (result.result as any).value.value
    })

    it("should allow creator to cancel open bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "cancel-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      expect(result.result).toBeOk(Cl.bool(true))

      const bounty = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(bountyId)],
        deployer
      )

      expect(bounty.value.data.status).toEqual(Cl.uint(5)) // status-cancelled
    })

    it("should prevent non-creator from cancelling", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "cancel-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(102)) // err-unauthorized
    })

    it("should prevent cancelling assigned bounty", () => {
      // Claim the bounty
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(bountyId)],
        hunter1
      )

      const result = simnet.callPublicFn(
        "bounties",
        "cancel-bounty",
        [Cl.uint(bountyId)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(106)) // err-already-assigned
    })

    it("should prevent cancelling non-existent bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "cancel-bounty",
        [Cl.uint(999)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(101)) // err-not-found
    })
  })

  describe("Milestone Management", () => {
    let bountyId: number

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(10000), Cl.stringAscii("Multi-milestone bounty"), Cl.uint(testDeadline)],
        creator1
      )
      bountyId = (result.result as any).value.value
    })

    it("should allow creator to add milestone", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(1), Cl.stringAscii("Research phase"), Cl.uint(30)],
        creator1
      )

      expect(result.result).toBeOk(Cl.bool(true))

      const milestone = simnet.callReadOnlyFn(
        "bounties",
        "get-milestone",
        [Cl.uint(bountyId), Cl.uint(1)],
        deployer
      )

      expect(milestone.result).toBeSome(
        Cl.tuple({
          description: Cl.stringAscii("Research phase"),
          percentage: Cl.uint(30),
          completed: Cl.bool(false)
        })
      )
    })

    it("should allow adding multiple milestones", () => {
      // Add first milestone
      simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(1), Cl.stringAscii("Phase 1"), Cl.uint(30)],
        creator1
      )

      // Add second milestone
      const result2 = simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(2), Cl.stringAscii("Phase 2"), Cl.uint(70)],
        creator1
      )

      expect(result2.result).toBeOk(Cl.bool(true))

      const milestone2 = simnet.callReadOnlyFn(
        "bounties",
        "get-milestone",
        [Cl.uint(bountyId), Cl.uint(2)],
        deployer
      )

      expect(milestone2.result).toBeSome()
    })

    it("should prevent non-creator from adding milestone", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(1), Cl.stringAscii("Test"), Cl.uint(50)],
        hunter1
      )

      expect(result.result).toBeErr(Cl.uint(102)) // err-unauthorized
    })

    it("should prevent adding milestone to non-existent bounty", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(999), Cl.uint(1), Cl.stringAscii("Test"), Cl.uint(100)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(101)) // err-not-found
    })

    it("should allow overriding existing milestone", () => {
      // Add milestone
      simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(1), Cl.stringAscii("Original"), Cl.uint(30)],
        creator1
      )

      // Override same milestone
      simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(bountyId), Cl.uint(1), Cl.stringAscii("Updated"), Cl.uint(40)],
        creator1
      )

      const milestone = simnet.callReadOnlyFn(
        "bounties",
        "get-milestone",
        [Cl.uint(bountyId), Cl.uint(1)],
        deployer
      )

      expect(milestone.value.data.description).toEqual(Cl.stringAscii("Updated"))
      expect(milestone.value.data.percentage).toEqual(Cl.uint(40))
    })
  })

  describe("Platform Fee Management", () => {
    it("should allow owner to set platform fee", () => {
      const newFee = 750 // 7.5%
      
      const result = simnet.callPublicFn(
        "bounties",
        "set-platform-fee",
        [Cl.uint(newFee)],
        deployer
      )

      expect(result.result).toBeOk(Cl.bool(true))

      const fee = simnet.callReadOnlyFn(
        "bounties",
        "get-platform-fee",
        [],
        deployer
      )

      expect(fee.result).toBeOk(Cl.uint(newFee))
    })

    it("should prevent non-owner from setting fee", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "set-platform-fee",
        [Cl.uint(600)],
        creator1
      )

      expect(result.result).toBeErr(Cl.uint(100)) // err-owner-only
    })

    it("should allow setting fee to zero", () => {
      const result = simnet.callPublicFn(
        "bounties",
        "set-platform-fee",
        [Cl.uint(0)],
        deployer
      )

      expect(result.result).toBeOk(Cl.bool(true))
    })

    it("should allow setting fee to maximum", () => {
      const maxFee = 10000 // 100%
      
      const result = simnet.callPublicFn(
        "bounties",
        "set-platform-fee",
        [Cl.uint(maxFee)],
        deployer
      )

      expect(result.result).toBeOk(Cl.bool(true))
    })
  })

  describe("User Stats", () => {
    it("should track user stats accurately across multiple bounties", () => {
      // Creator creates bounties
      simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii("Bounty 1"), Cl.uint(500)],
        creator1
      )

      simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(2000), Cl.stringAscii("Bounty 2"), Cl.uint(600)],
        creator1
      )

      // Hunter claims and completes first bounty
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(1)],
        hunter1
      )

      simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(1), Cl.stringAscii("Work 1")],
        hunter1
      )

      simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(1)],
        creator1
      )

      // Check creator stats
      const creatorStats = simnet.callReadOnlyFn(
        "bounties",
        "get-user-stats",
        [Cl.principal(creator1)],
        deployer
      )

      expect(creatorStats.result).toEqual(
        Cl.tuple({
          "bounties-created": Cl.uint(2),
          "bounties-completed": Cl.uint(0),
          "total-earned": Cl.uint(0),
          "reputation-score": Cl.uint(0)
        })
      )

      // Check hunter stats
      const hunterStats = simnet.callReadOnlyFn(
        "bounties",
        "get-user-stats",
        [Cl.principal(hunter1)],
        deployer
      )

      const platformFee = Math.floor(1000 * 0.05)
      const hunterPayment = 1000 - platformFee

      expect(hunterStats.result).toEqual(
        Cl.tuple({
          "bounties-created": Cl.uint(0),
          "bounties-completed": Cl.uint(1),
          "total-earned": Cl.uint(hunterPayment),
          "reputation-score": Cl.uint(10)
        })
      )
    })

    it("should return default stats for new user", () => {
      const stats = simnet.callReadOnlyFn(
        "bounties",
        "get-user-stats",
        [Cl.principal(randomUser)],
        deployer
      )

      expect(stats.result).toEqual(
        Cl.tuple({
          "bounties-created": Cl.uint(0),
          "bounties-completed": Cl.uint(0),
          "total-earned": Cl.uint(0),
          "reputation-score": Cl.uint(0)
        })
      )
    })
  })

  describe("Edge Cases and Error Handling", () => {
    it("should handle non-existent bounty in get-bounty", () => {
      const result = simnet.callReadOnlyFn(
        "bounties",
        "get-bounty",
        [Cl.uint(999)],
        deployer
      )

      expect(result.result).toBeNone()
    })

    it("should handle non-existent milestone", () => {
      const result = simnet.callReadOnlyFn(
        "bounties",
        "get-milestone",
        [Cl.uint(1), Cl.uint(999)],
        deployer
      )

      expect(result.result).toBeNone()
    })

    it("should handle bounty with very large reward", () => {
      const largeReward = 1000000000
      
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(largeReward), Cl.stringAscii("Large Bounty"), Cl.uint(1000)],
        creator1
      )

      expect(result.result).toBeOk(Cl.uint(3))
    })

    it("should handle very far future deadline", () => {
      const farFuture = 1000000
      
      const result = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(1000), Cl.stringAscii("Future Bounty"), Cl.uint(farFuture)],
        creator1
      )

      expect(result.result).toBeOk(Cl.uint(4))
    })

    it("should handle multiple operations in sequence", () => {
      // Create bounty
      const create = simnet.callPublicFn(
        "bounties",
        "create-bounty",
        [Cl.uint(5000), Cl.stringAscii("Complex Flow"), Cl.uint(500)],
        creator1
      )
      const id = (create.result as any).value.value

      // Claim
      simnet.callPublicFn(
        "bounties",
        "claim-bounty",
        [Cl.uint(id)],
        hunter1
      )

      // Add milestone
      simnet.callPublicFn(
        "bounties",
        "add-milestone",
        [Cl.uint(id), Cl.uint(1), Cl.stringAscii("Test"), Cl.uint(100)],
        creator1
      )

      // Submit
      simnet.callPublicFn(
        "bounties",
        "submit-work",
        [Cl.uint(id), Cl.stringAscii("Final work")],
        hunter1
      )

      // Approve
      const approve = simnet.callPublicFn(
        "bounties",
        "approve-bounty",
        [Cl.uint(id)],
        creator1
      )

      expect(approve.result).toBeOk(Cl.uint(4750)) // 5000 - 5%
    })
  })
})

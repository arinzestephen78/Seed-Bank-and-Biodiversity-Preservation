import { describe, it, expect, beforeEach } from 'vitest'

// Mock blockchain state
let userReputations: { [key: string]: { score: number, successful_grows: number, conservation_efforts: number } } = {}

// Mock contract functions
const updateReputation = (sender: string, user: string, successfulGrow: boolean, conservationEffort: boolean) => {
  if (sender !== user && sender !== 'CONTRACT') {
    return { success: false, error: 'ERR-NOT-AUTHORIZED' }
  }
  const currentRep = userReputations[user] || { score: 0, successful_grows: 0, conservation_efforts: 0 }
  userReputations[user] = {
    score: currentRep.score + 1,
    successful_grows: successfulGrow ? currentRep.successful_grows + 1 : currentRep.successful_grows,
    conservation_efforts: conservationEffort ? currentRep.conservation_efforts + 1 : currentRep.conservation_efforts
  }
  return { success: true }
}

const getReputation = (user: string) => {
  return userReputations[user] || null
}

describe('ReputationSystem', () => {
  beforeEach(() => {
    userReputations = {}
  })
  
  it('should update user reputation', () => {
    const result = updateReputation('wallet1', 'wallet1', true, false)
    expect(result.success).toBe(true)
    expect(getReputation('wallet1')).toEqual({
      score: 1,
      successful_grows: 1,
      conservation_efforts: 0
    })
  })
  
  it('should allow contract to update reputation', () => {
    const result = updateReputation('CONTRACT', 'wallet2', false, true)
    expect(result.success).toBe(true)
    expect(getReputation('wallet2')).toEqual({
      score: 1,
      successful_grows: 0,
      conservation_efforts: 1
    })
  })
  
  it('should not allow unauthorized updates', () => {
    const result = updateReputation('wallet1', 'wallet2', true, true)
    expect(result.success).toBe(false)
    expect(result.error).toBe('ERR-NOT-AUTHORIZED')
  })
})

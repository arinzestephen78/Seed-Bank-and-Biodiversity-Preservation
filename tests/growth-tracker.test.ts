import { describe, it, expect, beforeEach } from 'vitest'

// Mock blockchain state
let plantGrowthData: { [key: string]: any } = {}
let blockHeight = 1

// Mock contract functions
const recordGrowthData = (sender: string, seedId: number, plantingDate: number, height: number, notes: string) => {
  if (height <= 0) {
    return { success: false, error: 'ERR-INVALID-DATA' }
  }
  const key = `${seedId}-${sender}`
  const currentData = plantGrowthData[key] || { planting_date: 0, growth_stages: [], yield: 0 }
  const newStage = { date: blockHeight, height, notes }
  plantGrowthData[key] = {
    planting_date: currentData.planting_date || plantingDate,
    growth_stages: [...currentData.growth_stages, newStage].slice(-10),
    yield: currentData.yield
  }
  blockHeight++
  return { success: true }
}

const recordYield = (sender: string, seedId: number, yield_: number) => {
  if (yield_ <= 0) {
    return { success: false, error: 'ERR-INVALID-DATA' }
  }
  const key = `${seedId}-${sender}`
  const currentData = plantGrowthData[key] || { planting_date: 0, growth_stages: [], yield: 0 }
  plantGrowthData[key] = { ...currentData, yield: yield_ }
  return { success: true }
}

const getGrowthData = (seedId: number, grower: string) => {
  return plantGrowthData[`${seedId}-${grower}`] || null
}

describe('GrowthTracker', () => {
  beforeEach(() => {
    plantGrowthData = {}
    blockHeight = 1
  })
  
  it('should record growth data', () => {
    const result = recordGrowthData('wallet1', 1, 100, 10, 'Seedling stage')
    expect(result.success).toBe(true)
    expect(getGrowthData(1, 'wallet1')).toEqual({
      planting_date: 100,
      growth_stages: [{ date: 1, height: 10, notes: 'Seedling stage' }],
      yield: 0
    })
  })
  
  it('should not record invalid growth data', () => {
    const result = recordGrowthData('wallet1', 1, 100, 0, 'Invalid height')
    expect(result.success).toBe(false)
    expect(result.error).toBe('ERR-INVALID-DATA')
  })
  
  it('should record yield', () => {
    recordGrowthData('wallet1', 1, 100, 10, 'Seedling stage')
    const result = recordYield('wallet1', 1, 50)
    expect(result.success).toBe(true)
    expect(getGrowthData(1, 'wallet1')).toEqual({
      planting_date: 100,
      growth_stages: [{ date: 1, height: 10, notes: 'Seedling stage' }],
      yield: 50
    })
  })
  
  it('should not record invalid yield', () => {
    const result = recordYield('wallet1', 1, 0)
    expect(result.success).toBe(false)
    expect(result.error).toBe('ERR-INVALID-DATA')
  })
})


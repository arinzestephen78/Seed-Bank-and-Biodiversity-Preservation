import { describe, it, expect, beforeEach } from 'vitest'

// Mock blockchain state
let nftOwners: { [key: number]: string } = {}
let tokenMetadata: { [key: number]: { species: string, variety: string, genetic_info: string } } = {}
let lastTokenId = 0

// Mock contract functions
const mintSeedNFT = (sender: string, species: string, variety: string, genetic_info: string) => {
  lastTokenId++
  nftOwners[lastTokenId] = sender
  tokenMetadata[lastTokenId] = { species, variety, genetic_info }
  return { success: true, value: lastTokenId }
}

const getSeedInfo = (tokenId: number) => {
  return tokenMetadata[tokenId] || null
}

const getOwner = (tokenId: number) => {
  return nftOwners[tokenId] || null
}

describe('SeedNFT', () => {
  beforeEach(() => {
    nftOwners = {}
    tokenMetadata = {}
    lastTokenId = 0
  })
  
  it('should mint a new seed NFT', () => {
    const result = mintSeedNFT('wallet1', 'Tomato', 'Beefsteak', 'ATGC...')
    expect(result.success).toBe(true)
    expect(result.value).toBe(1)
    expect(getOwner(1)).toBe('wallet1')
    expect(getSeedInfo(1)).toEqual({
      species: 'Tomato',
      variety: 'Beefsteak',
      genetic_info: 'ATGC...'
    })
  })
  
  it('should retrieve seed info', () => {
    mintSeedNFT('wallet1', 'Carrot', 'Nantes', 'GCTA...')
    const info = getSeedInfo(1)
    expect(info).toEqual({
      species: 'Carrot',
      variety: 'Nantes',
      genetic_info: 'GCTA...'
    })
  })
  
  it('should get the correct owner of a seed NFT', () => {
    mintSeedNFT('wallet1', 'Pepper', 'Bell', 'TACG...')
    expect(getOwner(1)).toBe('wallet1')
  })
})

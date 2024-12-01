;; SeedNFT Contract

(define-non-fungible-token seed-nft uint)

(define-data-var last-token-id uint u0)

(define-map seed-metadata
  uint
  {
    species: (string-ascii 64),
    variety: (string-ascii 64),
    genetic-info: (string-utf8 256)
  }
)

(define-public (mint-seed-nft (species (string-ascii 64)) (variety (string-ascii 64)) (genetic-info (string-utf8 256)))
  (let
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (try! (nft-mint? seed-nft token-id tx-sender))
    (map-set seed-metadata token-id {species: species, variety: variety, genetic-info: genetic-info})
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

(define-read-only (get-seed-info (token-id uint))
  (map-get? seed-metadata token-id)
)


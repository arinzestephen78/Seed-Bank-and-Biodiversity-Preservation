;; GrowthTracker Contract

(define-map plant-growth-data
  {seed-id: uint, grower: principal}
  {
    planting-date: uint,
    growth-stages: (list 10 {date: uint, height: uint, notes: (string-utf8 256)}),
    yield: uint
  }
)

(define-public (record-growth-data
  (seed-id uint)
  (planting-date uint)
  (height uint)
  (notes (string-utf8 256))
)
  (let
    (
      (growth-key {seed-id: seed-id, grower: tx-sender})
      (current-data (default-to
        {planting-date: u0, growth-stages: (list), yield: u0}
        (map-get? plant-growth-data growth-key)
      ))
      (new-stage {date: block-height, height: height, notes: notes})
      (updated-stages (unwrap-panic (as-max-len? (append (get growth-stages current-data) new-stage) u10)))
    )
    (map-set plant-growth-data growth-key
      (merge current-data {
        planting-date: (if (is-eq (get planting-date current-data) u0) planting-date (get planting-date current-data)),
        growth-stages: updated-stages
      })
    )
    (ok true)
  )
)

(define-public (record-yield (seed-id uint) (yield uint))
  (let
    (
      (growth-key {seed-id: seed-id, grower: tx-sender})
      (current-data (default-to
        {planting-date: u0, growth-stages: (list), yield: u0}
        (map-get? plant-growth-data growth-key)
      ))
    )
    (map-set plant-growth-data growth-key
      (merge current-data {yield: yield})
    )
    (ok true)
  )
)

(define-read-only (get-growth-data (seed-id uint) (grower principal))
  (map-get? plant-growth-data {seed-id: seed-id, grower: grower})
)

;; ReputationSystem Contract

(define-map user-reputation
  principal
  {
    score: uint,
    successful-grows: uint,
    conservation-efforts: uint
  }
)

(define-public (update-reputation (user principal) (successful-grow bool) (conservation-effort bool))
  (let
    (
      (current-rep (default-to {score: u0, successful-grows: u0, conservation-efforts: u0} (map-get? user-reputation user)))
      (new-score (+ (get score current-rep) u1))
      (new-grows (if successful-grow (+ (get successful-grows current-rep) u1) (get successful-grows current-rep)))
      (new-efforts (if conservation-effort (+ (get conservation-efforts current-rep) u1) (get conservation-efforts current-rep)))
    )
    (map-set user-reputation user {
      score: new-score,
      successful-grows: new-grows,
      conservation-efforts: new-efforts
    })
    (ok true)
  )
)

(define-read-only (get-reputation (user principal))
  (map-get? user-reputation user)
)


import { useEffect, useRef } from 'react'

type InventoryOverlayProps = {
  items: string[]
  reportsHidden: boolean
  onClose: () => void
}

export function InventoryOverlay({ items, reportsHidden, onClose }: InventoryOverlayProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <section className="overlay" aria-label="Inventory stash">
      <div className="overlay__panel">
        <p className="overlay__title">=== INVENTORY STASH ===</p>
        <div className="stash-list">
          {items.length === 0 ? (
            <p className="choice">Empty</p>
          ) : (
            items.map((item, index) => (
              <p className="choice" key={`${item}-${index}`}>
                <span className="choice__tag">[{index + 1}]</span> {item}
              </p>
            ))
          )}
        </div>
        {reportsHidden ? <p className="overlay__note">Lead Box: Redacted Budget Reports</p> : null}
        <button className="proceed-button" ref={buttonRef} type="button" onClick={onClose}>
          [Close]
        </button>
      </div>
    </section>
  )
}

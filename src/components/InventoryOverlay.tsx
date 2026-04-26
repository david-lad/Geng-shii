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
      <div className="overlay__panel overlay__panel--inventory">
        <p className="pause__title">INVENTORY</p>
        <div className="inventory__list">
          {items.length === 0 ? (
            <p className="inventory__item">Empty</p>
          ) : (
            items.map((item, index) => (
              <p className="inventory__item" key={`${item}-${index}`}>
                <span className="choice__tag">[{index + 1}]</span> {item}
              </p>
            ))
          )}
          {reportsHidden ? <p className="inventory__item">Lead Box: Redacted Budget Reports</p> : null}
        </div>
        <div className="pause__actions">
          <button className="pause__action choice--active" ref={buttonRef} type="button" onClick={onClose}>
            [Close]
          </button>
        </div>
      </div>
    </section>
  )
}

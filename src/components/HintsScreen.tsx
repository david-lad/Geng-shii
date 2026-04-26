import { useEffect, useRef } from 'react'

type HintsScreenProps = {
  onStart: () => void
}

const briefingLines = [
  'Search rooms carefully. Progress depends on items, timing, and state changes.',
  'Keyboard: ARROWS to move focus. ENTER to confirm. I for Inventory. P or ESC to pause.',
  'Mouse / Touch: CLICK or TAP actions directly. Use HUD buttons for menus.',
  'Keep the Redacted Budget Reports hidden before crossing the Science Wing scanner.',
]

export function HintsScreen({ onStart }: HintsScreenProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        onStart()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onStart])

  return (
    <main className="screen screen--briefing">
      <section className="overlay__panel overlay__panel--briefing" aria-label="Mission briefing">
        <p className="pause__title">MISSION BRIEF</p>
        <div className="briefing__body" style={{ overflowY: 'auto', maxHeight: '60vh' }}>
          {briefingLines.map((line, index) => (
            <p className="briefing__line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </div>
        <div className="pause__actions">
          <button className="pause__action choice--active" ref={buttonRef} type="button" onClick={onStart}>
            [Begin Mission]
          </button>
        </div>
      </section>
    </main>
  )
}

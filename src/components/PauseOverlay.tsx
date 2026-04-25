import { useEffect, useRef, useState } from 'react'

type PauseOverlayProps = {
  onResume: () => void
  onReturnToTitle: () => void
}

export function PauseOverlay({ onResume, onReturnToTitle }: PauseOverlayProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const actions = [
    { label: '[Resume]', onClick: onResume },
    { label: '[Title]', onClick: onReturnToTitle },
  ]

  useEffect(() => {
    buttonRefs.current[selectedIndex]?.focus({ preventScroll: true })
  }, [selectedIndex])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        setSelectedIndex((current) => (current + 1) % actions.length)
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        setSelectedIndex((current) => (current - 1 + actions.length) % actions.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [actions.length])

  return (
    <section className="overlay" aria-label="Paused game">
      <div className="overlay__panel overlay__panel--pause">
        <p className="pause__title">PAUSED</p>
        <p className="pause__copy">Progress saved.</p>
        <div className="pause__actions">
          {actions.map((action, index) => (
            <button
              key={action.label}
              className={`pause__action ${selectedIndex === index ? 'choice--active' : ''}`}
              ref={(element) => {
                buttonRefs.current[index] = element
              }}
              type="button"
              onMouseEnter={() => setSelectedIndex(index)}
              onFocus={() => setSelectedIndex(index)}
              onClick={action.onClick}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

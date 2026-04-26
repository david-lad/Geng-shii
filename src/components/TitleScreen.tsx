import { useEffect, useRef, useState } from 'react'

type TitleScreenProps = {
  hasSavedGame: boolean
  onContinue: () => void
  onEnter: () => void
}

const titleLines = [
  'The Skool System has kept you docile. But today, the Nerrd dies.',
  'The Geng Shii is born. Break the system. Take over the Hood.',
]

export function TitleScreen({ hasSavedGame, onContinue, onEnter }: TitleScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const actions = hasSavedGame
    ? [
        { label: '[Continue]', onClick: onContinue },
        { label: '[New Game]', onClick: onEnter },
      ]
    : [{ label: '[New Game]', onClick: onEnter }]

  useEffect(() => {
    buttonRefs.current[selectedIndex]?.focus({ preventScroll: true })
  }, [selectedIndex])

  useEffect(() => {
    setSelectedIndex(0)
  }, [hasSavedGame])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!actions.length) {
        return
      }

      if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedIndex((current) => (current + 1) % actions.length)
      }

      if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelectedIndex((current) => (current - 1 + actions.length) % actions.length)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [actions.length])

  return (
    <main className="screen screen--title">
      <section className="title-block" aria-label="Title screen">
        <h1 className="logo" aria-label="Geng Shii">
          <span>GENG</span>
          <span>SHII</span>
        </h1>
        <p className="title-copy">{titleLines[0]}</p>
        <p className="title-copy">{titleLines[1]}</p>
        <div className="title-actions">
          {actions.map((action, index) => (
            <button
              key={action.label}
              className={`enter-button ${selectedIndex === index ? 'choice--active' : ''}`}
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
      </section>
    </main>
  )
}

import { useEffect, useRef } from 'react'

type EndScreenProps = {
  victory: boolean
  lines: string[]
  onRestart: () => void
}

export function EndScreen({ victory, lines, onRestart }: EndScreenProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <main className="screen screen--end">
      <section className="ending" aria-live="polite">
        <h1 className="ending__title">{victory ? 'GENG SHII ASCENDANT' : 'SYSTEM FAILURE'}</h1>
        <div className="ending__body">
          {lines.map((line, index) => (
            <p className="ending__copy" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
          <p className="ending__copy">
            {victory
              ? 'The Skool network turns against itself. The administration falls without a final fight.'
              : 'You are apprehended, reconditioned, and folded back into the system.'}
          </p>
        </div>
        <button className="enter-button" ref={buttonRef} type="button" onClick={onRestart}>
          [Restart]
        </button>
      </section>
    </main>
  )
}

import { useEffect, useRef } from 'react'

type LevelResultProps = {
  lines: string[]
  onContinue: () => void
}

export function LevelResult({ lines, onContinue }: LevelResultProps) {
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    buttonRef.current?.focus({ preventScroll: true })
  }, [])

  return (
    <main className="screen screen--game">
      <section className="playfield playfield--result" aria-live="polite">
        <div className="scene-copy">
          {lines.map((line, index) => (
            <p className="scene-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </div>

        <button className="enter-button" ref={buttonRef} type="button" onClick={onContinue}>
          [Continue]
        </button>
      </section>
    </main>
  )
}

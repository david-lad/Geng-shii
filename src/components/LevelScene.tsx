import { useEffect, useRef, useState } from 'react'
import type { RoomView } from '../game'

type LevelSceneProps = {
  room: RoomView
  hp: number
  maxHp: number
  evidenceCount: number
  inventoryCount: number
  reportsHidden: boolean
  inputLocked: boolean
  onSelectAction: (actionId: string) => void
  onOpenInventory: () => void
  onPause: () => void
}

export function LevelScene({
  room,
  hp,
  maxHp,
  evidenceCount,
  inventoryCount,
  reportsHidden,
  inputLocked,
  onSelectAction,
  onOpenInventory,
  onPause,
}: LevelSceneProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedControl, setSelectedControl] = useState<'actions' | 'inventory' | 'pause'>('actions')
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const inventoryRef = useRef<HTMLButtonElement | null>(null)
  const pauseRef = useRef<HTMLButtonElement | null>(null)
  const actionSignature = room.actions.map((action) => action.id).join('|')

  useEffect(() => {
    setSelectedIndex(0)
    setSelectedControl('actions')
  }, [actionSignature, room.room])

  useEffect(() => {
    if (inputLocked) {
      return
    }

    const target =
      selectedControl === 'actions'
        ? buttonRefs.current[selectedIndex]
        : selectedControl === 'inventory'
          ? inventoryRef.current
          : pauseRef.current

    target?.focus({ preventScroll: true })
  }, [inputLocked, room, selectedControl, selectedIndex])

  useEffect(() => {
    if (inputLocked) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (!room.actions.length) {
        return
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (selectedControl === 'actions') {
          setSelectedIndex((current) => (current + 1) % room.actions.length)
          return
        }

        setSelectedControl((current) => (current === 'inventory' ? 'pause' : 'inventory'))
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (selectedControl === 'actions') {
          setSelectedIndex((current) => (current - 1 + room.actions.length) % room.actions.length)
          return
        }

        setSelectedControl((current) => (current === 'inventory' ? 'pause' : 'inventory'))
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()

        if (selectedControl === 'actions') {
          setSelectedControl('inventory')
          return
        }

        setSelectedControl((current) => (current === 'inventory' ? 'pause' : 'inventory'))
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()

        if (selectedControl === 'actions') {
          return
        }

        setSelectedControl('actions')
      }

      if (event.key === 'Enter') {
        if (selectedControl === 'actions') {
          const selectedAction = room.actions[selectedIndex]
          if (!selectedAction) {
            return
          }

          event.preventDefault()
          onSelectAction(selectedAction.id)
          return
        }

        event.preventDefault()
        if (selectedControl === 'inventory') {
          onOpenInventory()
          return
        }

        onPause()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [inputLocked, onOpenInventory, onPause, onSelectAction, room.actions, selectedControl, selectedIndex])

  return (
    <main className="screen screen--game">
      <section className="playfield" aria-label={room.title}>
        <header className="scene-copy">
          <p className="scene-line scene-line--title">{room.title}</p>
          {room.lines.map((line, index) => (
            <p className="scene-line" key={`${line}-${index}`}>
              {line}
            </p>
          ))}
        </header>

        <div className="choice-list">
          {room.actions.map((action, index) => (
            <button
              key={action.id}
              ref={(element) => {
                buttonRefs.current[index] = element
              }}
              className={`choice ${selectedControl === 'actions' && selectedIndex === index ? 'choice--active' : ''}`}
              type="button"
              onMouseEnter={() => {
                setSelectedControl('actions')
                setSelectedIndex(index)
              }}
              onFocus={() => {
                setSelectedControl('actions')
                setSelectedIndex(index)
              }}
              onClick={() => onSelectAction(action.id)}
            >
              <span className="choice__tag">[{index + 1}]</span> {action.label}
            </button>
          ))}
        </div>

        <footer className="hud">
          <p>
            HP: {hp}/{maxHp}
          </p>
          <p>Evidence: {evidenceCount}/3</p>
          <p>Stash: {inventoryCount}</p>
          <p>{reportsHidden ? 'Reports Hidden: Yes' : 'Reports Hidden: No'}</p>
          <button
            className={`hud__switch ${selectedControl === 'inventory' ? 'choice--active' : ''}`}
            ref={inventoryRef}
            type="button"
            onMouseEnter={() => setSelectedControl('inventory')}
            onFocus={() => setSelectedControl('inventory')}
            onClick={onOpenInventory}
          >
            [Inventory]
          </button>
          <button
            className={`hud__switch hud__pause ${selectedControl === 'pause' ? 'choice--active' : ''}`}
            ref={pauseRef}
            type="button"
            onMouseEnter={() => setSelectedControl('pause')}
            onFocus={() => setSelectedControl('pause')}
            onClick={onPause}
          >
            [Pause]
          </button>
        </footer>
      </section>
    </main>
  )
}

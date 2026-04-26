import { useEffect, useState } from 'react'
import './App.css'
import { EndScreen } from './components/EndScreen'
import { HintsScreen } from './components/HintsScreen'
import { InventoryOverlay } from './components/InventoryOverlay'
import { LevelResult } from './components/LevelResult'
import { LevelScene } from './components/LevelScene'
import { PauseOverlay } from './components/PauseOverlay'
import { TitleScreen } from './components/TitleScreen'
import {
  countEvidence,
  createInitialGameState,
  getRoomView,
  listInventory,
  resolveAction,
  type GameState,
} from './game'

type Phase = 'title' | 'hints' | 'room' | 'message' | 'end'
type ActivePhase = Exclude<Phase, 'title'>

type SaveData = {
  phase: ActivePhase
  gameState: GameState
  messageLines: string[]
}

const SAVE_KEY = 'geng-shii-save'

function loadSave(): SaveData | null {
  try {
    const raw = window.localStorage.getItem(SAVE_KEY)
    if (!raw) {
      return null
    }

    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

function App() {
  const initialSave = loadSave()
  const [phase, setPhase] = useState<Phase>(initialSave?.phase ?? 'title')
  const [gameState, setGameState] = useState<GameState>(initialSave?.gameState ?? createInitialGameState())
  const [messageLines, setMessageLines] = useState<string[]>(initialSave?.messageLines ?? [])
  const [showInventory, setShowInventory] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  const roomView = getRoomView(gameState)
  const hasSavedGame = initialSave !== null

  useEffect(() => {
    if (phase === 'title') {
      return
    }

    const saveData: SaveData = {
      phase,
      gameState,
      messageLines,
    }

    window.localStorage.setItem(SAVE_KEY, JSON.stringify(saveData))
  }, [gameState, messageLines, phase])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (phase === 'title' && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault()
        startGame()
      }

      if ((phase === 'room' || phase === 'message') && (event.key === 'Escape' || event.key === 'p' || event.key === 'P')) {
        event.preventDefault()
        setShowInventory(false)
        setIsPaused((current) => !current)
      }

      if (phase === 'room' && !isPaused && (event.key === 'i' || event.key === 'I')) {
        event.preventDefault()
        setShowInventory((current) => !current)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isPaused, phase])

  function startGame() {
    setGameState(createInitialGameState())
    setMessageLines([])
    setShowInventory(false)
    setIsPaused(false)
    setPhase('hints')
  }

  function continueSavedGame() {
    const saved = loadSave()
    if (!saved) {
      startGame()
      return
    }

    setGameState(saved.gameState)
    setMessageLines(saved.messageLines)
    setShowInventory(false)
    setIsPaused(false)
    setPhase(saved.phase)
  }

  function returnToTitle() {
    setShowInventory(false)
    setIsPaused(false)
    setPhase('title')
  }

  function handleAction(actionId: string) {
    const result = resolveAction(gameState, actionId)
    setGameState(result.state)
    setShowInventory(false)

    if (result.lines.length > 0) {
      setMessageLines(result.lines)
      setPhase(result.state.gameOver ? 'end' : 'message')
      return
    }

    if (result.state.gameOver) {
      setPhase('end')
      return
    }

    setPhase('room')
  }

  function continueFromMessage() {
    if (gameState.gameOver) {
      setPhase('end')
      return
    }

    setMessageLines([])
    setPhase('room')
  }

  if (phase === 'title') {
    return <TitleScreen hasSavedGame={hasSavedGame} onContinue={continueSavedGame} onEnter={startGame} />
  }

  if (phase === 'hints') {
    return <HintsScreen onStart={() => setPhase('room')} />
  }

  if (phase === 'end') {
    return <EndScreen victory={gameState.victory} lines={messageLines} onRestart={startGame} />
  }

  return (
    <>
      {phase === 'room' ? (
        <LevelScene
          room={roomView}
          hp={gameState.hp}
          maxHp={gameState.maxHp}
          evidenceCount={countEvidence(gameState)}
          inventoryCount={listInventory(gameState).length}
          reportsHidden={gameState.reportsHidden}
          inputLocked={showInventory || isPaused}
          onSelectAction={handleAction}
          onOpenInventory={() => setShowInventory(true)}
          onPause={() => {
            setShowInventory(false)
            setIsPaused(true)
          }}
        />
      ) : null}

      {phase === 'message' ? <LevelResult lines={messageLines} onContinue={continueFromMessage} /> : null}

      {showInventory && phase === 'room' ? (
        <InventoryOverlay
          items={listInventory(gameState)}
          reportsHidden={gameState.reportsHidden}
          onClose={() => setShowInventory(false)}
        />
      ) : null}

      {isPaused ? <PauseOverlay onResume={() => setIsPaused(false)} onReturnToTitle={returnToTitle} /> : null}

      <div className="orientation-lock" aria-live="polite" aria-label="Landscape required">
        <p className="orientation-lock__title">Rotate Device</p>
        <p className="orientation-lock__copy">GENG SHII is locked to landscape mode on mobile.</p>
      </div>
    </>
  )
}

export default App

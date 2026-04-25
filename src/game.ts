export type ItemId =
  | 'budgetReports'
  | 'rustedKey'
  | 'rubberMat'
  | 'powerCoupling'
  | 'screwdriver'
  | 'rationPack'
  | 'blankTape'
  | 'chemicalKey'
  | 'transferOrders'
  | 'acidFlask'
  | 'testingLogs'
  | 'masterKeycard'

export type RoomId =
  | 'archivalStorage'
  | 'boilerRoom'
  | 'drainageTunnels'
  | 'janitorialCloset'
  | 'quadrangleSouth'
  | 'quadrangleWest'
  | 'quadrangleEast'
  | 'quadrangleNorth'
  | 'quadrangleCentre'
  | 'cafeteriaHall'
  | 'laundryRoom'
  | 'roof'
  | 'enforcerBarracks'
  | 'decontaminationLock'
  | 'synthesisLab'
  | 'dissectionTheatre'
  | 'specimenContainment'
  | 'plumbingStation'
  | 'velvetFoyer'
  | 'mainframeRoom'
  | 'headmastersOffice'

export type RoomAction = {
  id: string
  label: string
}

export type RoomView = {
  room: RoomId
  title: string
  lines: string[]
  actions: RoomAction[]
}

export type GameState = {
  hp: number
  maxHp: number
  room: RoomId
  gameOver: boolean
  victory: boolean
  inventory: Record<ItemId, boolean>
  reportsHidden: boolean
  floorboardPried: boolean
  liftPowered: boolean
  grateRemoved: boolean
  dogScared: boolean
  fountainFlooded: boolean
  lockdownActive: boolean
  notesRead: boolean
  valvesSolved: boolean
  droidDocked: boolean
}

export type ActionResult = {
  state: GameState
  lines: string[]
}

export const itemNames: Record<ItemId, string> = {
  budgetReports: 'Redacted Budget Reports',
  rustedKey: 'Rusted Iron Key',
  rubberMat: 'Insulated Rubber Mat',
  powerCoupling: 'Power Coupling',
  screwdriver: 'Screwdriver',
  rationPack: 'Ration Pack',
  blankTape: 'Blank Cassette Tape',
  chemicalKey: 'Chemical Key',
  transferOrders: 'Forged Transfer Orders',
  acidFlask: 'Acid Flask',
  testingLogs: 'Unethical Testing Logs',
  masterKeycard: 'Master Executive Keycard',
}

const itemOrder: ItemId[] = [
  'budgetReports',
  'rustedKey',
  'rubberMat',
  'powerCoupling',
  'screwdriver',
  'rationPack',
  'blankTape',
  'chemicalKey',
  'transferOrders',
  'acidFlask',
  'testingLogs',
  'masterKeycard',
]

function emptyInventory(): Record<ItemId, boolean> {
  return {
    budgetReports: false,
    rustedKey: false,
    rubberMat: false,
    powerCoupling: false,
    screwdriver: false,
    rationPack: false,
    blankTape: false,
    chemicalKey: false,
    transferOrders: false,
    acidFlask: false,
    testingLogs: false,
    masterKeycard: false,
  }
}

export function createInitialGameState(): GameState {
  return {
    hp: 100,
    maxHp: 100,
    room: 'archivalStorage',
    gameOver: false,
    victory: false,
    inventory: emptyInventory(),
    reportsHidden: false,
    floorboardPried: false,
    liftPowered: false,
    grateRemoved: false,
    dogScared: false,
    fountainFlooded: false,
    lockdownActive: false,
    notesRead: false,
    valvesSolved: false,
    droidDocked: false,
  }
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    inventory: { ...state.inventory },
  }
}

function withRoom(state: GameState, room: RoomId): GameState {
  return {
    ...state,
    room,
  }
}

function damage(state: GameState, amount: number): GameState {
  const next = cloneState(state)
  next.hp = Math.max(0, next.hp - amount)
  if (next.hp <= 0) {
    next.gameOver = true
  }
  return next
}

function moveFromSouthQuadrant(state: GameState, targetRoom: RoomId): ActionResult {
  if (Math.random() > 0.7) {
    const punished = damage(state, 20)
    return {
      state: withRoom(punished, 'boilerRoom'),
      lines: [
        'A Prefect catches you cutting across the courtyard.',
        'You are dragged back to the Rusted Service Lift and dumped into the Sub-Basement.',
        'HP reduced by 20.',
      ],
    }
  }

  return {
    state: withRoom(state, targetRoom),
    lines: [],
  }
}

function moveToTower(state: GameState): ActionResult {
  if (Math.random() > 0.6) {
    return {
      state: damage(state, 40),
      lines: [
        'Elite Security spot you between the marble pillars.',
        'Suppressive fire tears through the foyer before you dive back into cover.',
        'HP reduced by 40.',
      ],
    }
  }

  return {
    state: withRoom(state, 'mainframeRoom'),
    lines: ['You slip behind the pillars, time the alternating patrols, and reach the Mainframe Room unseen.'],
  }
}

export function listInventory(state: GameState) {
  return itemOrder.filter((itemId) => state.inventory[itemId]).map((itemId) => itemNames[itemId])
}

export function countEvidence(state: GameState) {
  return Number(state.inventory.budgetReports) + Number(state.inventory.transferOrders) + Number(state.inventory.testingLogs)
}

export function getRoomView(state: GameState): RoomView {
  const { inventory } = state

  switch (state.room) {
    case 'archivalStorage':
      return {
        room: state.room,
        title: 'Archival Storage',
        lines: [
          'The Sub-Basement stinks of paper rot and cold iron.',
          'Decaying paperwork is stacked against a locked steel door.',
          ...(state.floorboardPried ? [] : ['A loose floorboard shifts in the corner.']),
        ],
        actions: [
          { id: 'go-boiler', label: 'Proceed to the Boiler Room.' },
          ...(state.floorboardPried ? [] : [{ id: 'pry-floorboard', label: 'Pry open the loose floorboard.' }]),
        ],
      }

    case 'boilerRoom':
      return {
        room: state.room,
        title: 'Boiler Room',
        lines: [
          'The Boiler Room is the dead heart of the campus.',
          'A Neutral Maintenance Droid patrols toward a high-voltage charging panel.',
          `The Rusted Service Lift ${state.liftPowered ? 'thrums with power' : 'sits dormant and missing its Power Coupling'}.`,
          ...(state.droidDocked ? ['The droid is currently docked and its Power Coupling is exposed.'] : []),
        ],
        actions: [
          { id: 'return-archival', label: 'Return to Archival Storage.' },
          { id: 'go-tunnels', label: 'Enter the Drainage Tunnels.' },
          ...(inventory.rustedKey ? [{ id: 'go-closet', label: 'Unlock the Janitorial Closet.' }] : []),
          { id: 'wait-droid', label: 'Wait for the droid to dock at the panel.' },
          { id: 'extract-coupling', label: 'Attempt to extract the exposed Power Coupling.' },
          ...(inventory.powerCoupling && !state.liftPowered
            ? [{ id: 'power-lift', label: 'Insert the Power Coupling into the Rusted Service Lift.' }]
            : []),
          ...(state.liftPowered ? [{ id: 'ride-lift', label: 'Take the Rusted Service Lift to the surface.' }] : []),
        ],
      }

    case 'drainageTunnels':
      return {
        room: state.room,
        title: 'Drainage Tunnels',
        lines: [
          'Ankle-deep freezing water drags at your legs.',
          ...(inventory.rustedKey ? [] : ['A damp cardboard box rests against a cracked wall.']),
          ...(state.grateRemoved ? ['An opened ventilation shaft leads up into the Cafeteria.'] : []),
        ],
        actions: [
          { id: 'return-boiler', label: 'Return to the Boiler Room.' },
          ...(inventory.rustedKey ? [] : [{ id: 'take-key', label: 'Search the cardboard box.' }]),
          ...(state.grateRemoved ? [{ id: 'climb-cafeteria', label: 'Climb through the Cafeteria vent shortcut.' }] : []),
        ],
      }

    case 'janitorialCloset':
      return {
        room: state.room,
        title: 'Janitorial Closet',
        lines: [
          'Bleach fumes sting your nose.',
          ...(inventory.rubberMat ? [] : ['An insulated rubber mat hangs from a metal peg.']),
        ],
        actions: [
          { id: 'return-boiler', label: 'Return to the Boiler Room.' },
          ...(inventory.rubberMat ? [] : [{ id: 'take-mat', label: 'Take the Insulated Rubber Mat.' }]),
        ],
      }

    case 'quadrangleSouth':
      return {
        room: state.room,
        title: 'Quadrangle - South',
        lines: [
          'The central courtyard is a neutral zone. Combat here is impossible.',
          'Prefects patrol the square in strict counter-clockwise loops.',
          'Topiary hedges provide the only real cover.',
        ],
        actions: [
          { id: 'go-west', label: 'Sneak west into the Dormitories.' },
          { id: 'go-east', label: 'Move east toward the sealed Science Wing.' },
          { id: 'go-north', label: 'Approach the Administration Tower gates.' },
          { id: 'go-centre', label: 'Check the Ancient Dry Fountain.' },
          { id: 'ride-down', label: 'Take the lift back down to the Boiler Room.' },
        ],
      }

    case 'quadrangleWest':
      return {
        room: state.room,
        title: 'Quadrangle - West',
        lines: ['The Dormitories entrance yawns open to the west.'],
        actions: [
          { id: 'enter-cafeteria', label: 'Enter the Dormitories through the Cafeteria.' },
          { id: 'return-south', label: 'Return to the South Quadrant.' },
        ],
      }

    case 'quadrangleEast':
      return {
        room: state.room,
        title: 'Quadrangle - East',
        lines: ['Heavy blast doors seal the Science Wing behind a chemical lock.'],
        actions: [
          { id: 'use-chemical-key', label: 'Try the Chemical Key on the blast doors.' },
          { id: 'return-south', label: 'Return to the South Quadrant.' },
        ],
      }

    case 'quadrangleNorth':
      return {
        room: state.room,
        title: 'Quadrangle - North',
        lines: ['Massive brass padlocks hold the Administration Tower gates shut.'],
        actions: [
          { id: 'use-acid', label: 'Pour the Acid Flask over the brass padlocks.' },
          { id: 'return-south', label: 'Return to the South Quadrant.' },
        ],
      }

    case 'quadrangleCentre':
      return {
        room: state.room,
        title: 'Quadrangle - Centre',
        lines: state.fountainFlooded
          ? [
              'The Ancient Dry Fountain is now flooded with violent pressure.',
              'Water churns over the grated drain at the bottom.',
            ]
          : ['The Ancient Dry Fountain is dry. A grated drain is visible at the bottom.'],
        actions: [
          { id: 'return-south', label: 'Return to the South Quadrant.' },
          ...(state.fountainFlooded ? [{ id: 'swim-tunnel', label: 'Dive into the flooded Subterranean Tunnel.' }] : []),
        ],
      }

    case 'cafeteriaHall':
      return {
        room: state.room,
        title: 'Cafeteria Main Hall',
        lines: [
          'Frightened students keep their heads low over trays of grey paste.',
          ...(inventory.screwdriver ? [] : ['A screwdriver glints beneath a bent metal table.']),
          ...(inventory.rationPack ? [] : ['A ration pack has been abandoned on a nearby tray.']),
          ...(state.grateRemoved ? ['The eastern vent has been opened into a permanent shortcut.'] : ['A heavy ventilation grate blocks a dark shaft on the eastern wall.']),
        ],
        actions: [
          { id: 'go-laundry', label: 'Head upstairs to the Abandoned Laundry Room.' },
          { id: 'go-barracks', label: 'Go downstairs to the Enforcer Barracks.' },
          { id: 'exit-west', label: 'Slip back out to the West Quadrant.' },
          ...(inventory.screwdriver ? [] : [{ id: 'take-screwdriver', label: 'Take the Screwdriver.' }]),
          ...(inventory.rationPack ? [] : [{ id: 'take-ration', label: 'Take the Ration Pack.' }]),
          ...(inventory.screwdriver && !state.grateRemoved
            ? [{ id: 'remove-grate', label: 'Use the Screwdriver to remove the ventilation grate.' }]
            : []),
          ...(state.grateRemoved ? [{ id: 'vent-to-tunnels', label: 'Climb through the vent to the Drainage Tunnels.' }] : []),
        ],
      }

    case 'laundryRoom':
      return {
        room: state.room,
        title: 'Abandoned Laundry Room',
        lines: ['The Black Market Dealer watches from beside a broken washing machine.'],
        actions: [
          { id: 'go-roof', label: 'Climb the fire escape to the Roof.' },
          { id: 'return-cafeteria', label: 'Go back down to the Cafeteria.' },
          ...(inventory.blankTape || !inventory.rationPack
            ? []
            : [{ id: 'trade-tape', label: 'Trade the Ration Pack for a Blank Cassette Tape.' }]),
        ],
      }

    case 'roof':
      return {
        room: state.room,
        title: 'Dormitory Roof',
        lines: ['The Pirate Radio Host is broadcasting rebellion through a jury-rigged antenna array.'],
        actions: [
          { id: 'return-laundry', label: 'Climb back down to the Laundry Room.' },
          ...(inventory.blankTape && !state.dogScared
            ? [{ id: 'give-tape', label: 'Hand over the Blank Cassette Tape for the manifesto broadcast.' }]
            : []),
        ],
      }

    case 'enforcerBarracks':
      return {
        room: state.room,
        title: 'Enforcer Barracks',
        lines: state.dogScared
          ? [
              'The Enforcer is still asleep on the bunk.',
              'The guard dog has retreated into the bathroom, whining under the radio tone.',
            ]
          : [
              'A sleeping Enforcer sprawls across the bunk.',
              'A guard dog sits at the foot of the bed, fully alert and watching you.',
            ],
        actions: [
          { id: 'return-cafeteria', label: 'Retreat upstairs to the Cafeteria.' },
          ...(state.dogScared
            ? [
                ...(inventory.chemicalKey ? [] : [{ id: 'steal-chemical-key', label: 'Steal the Chemical Key from the Enforcer belt.' }]),
                ...(inventory.transferOrders ? [] : [{ id: 'take-orders', label: 'Raid the footlocker for the Forged Transfer Orders.' }]),
              ]
            : [{ id: 'approach-enforcer', label: 'Try to approach the sleeping Enforcer.' }]),
        ],
      }

    case 'decontaminationLock':
      return {
        room: state.room,
        title: 'Decontamination Lock',
        lines: [
          'Automated biometric scanners sweep the chamber in repeating arcs.',
          'A lead-lined specimen box sits in the corner.',
          ...(state.reportsHidden ? ['Your Redacted Budget Reports are currently hidden inside the box.'] : []),
        ],
        actions: [
          { id: 'scan-lab', label: 'Step into the biometric scan and enter the lab.' },
          { id: 'return-east', label: 'Exit back to the Quadrangle.' },
          ...(inventory.budgetReports ? [{ id: 'hide-reports', label: 'Place the Redacted Budget Reports into the lead-lined box.' }] : []),
          ...(state.reportsHidden ? [{ id: 'retrieve-reports', label: 'Retrieve the Redacted Budget Reports from the box.' }] : []),
        ],
      }

    case 'synthesisLab':
      return {
        room: state.room,
        title: 'Chemical Synthesis Lab',
        lines: [
          'Raw sulfur, potassium, and glass beakers are scattered across the benches.',
          ...(inventory.acidFlask ? ['A finished Acid Flask is secured in your inventory.'] : []),
        ],
        actions: [
          { id: 'go-dissection', label: 'Enter the Dissection Theatre.' },
          { id: 'go-specimen', label: 'Enter the Specimen Containment Room.' },
          { id: 'go-plumbing', label: 'Enter the Plumbing Reroute Station.' },
          { id: 'return-decon', label: 'Return to the Decontamination Lock.' },
          ...(!inventory.acidFlask && state.notesRead
            ? [{ id: 'mix-acid', label: 'Mix the industrial solvent using the recovered ratio notes.' }]
            : []),
        ],
      }

    case 'dissectionTheatre':
      return {
        room: state.room,
        title: 'Dissection Theatre',
        lines: [
          'Pinned notes cover a corkboard at the front of the theatre.',
          state.notesRead
            ? 'You have already memorized the solvent ratio and valve sequence schematic.'
            : 'The notes describe the exact solvent ratio and the only valid valve sequence for the campus plumbing.',
        ],
        actions: [
          ...(state.notesRead ? [] : [{ id: 'read-notes', label: 'Study the notes and memorize the schematic.' }]),
          { id: 'return-lab', label: 'Return to the Lab.' },
        ],
      }

    case 'specimenContainment':
      return {
        room: state.room,
        title: 'Specimen Containment',
        lines: [
          'Stasis tubes line the room with grotesque experiments suspended inside.',
          ...(inventory.testingLogs ? [] : ['A clipboard near the terminal contains the Unethical Testing Logs.']),
        ],
        actions: [
          { id: 'return-lab', label: 'Return to the Lab.' },
          ...(inventory.testingLogs ? [] : [{ id: 'take-logs', label: 'Take the Unethical Testing Logs.' }]),
        ],
      }

    case 'plumbingStation':
      return {
        room: state.room,
        title: 'Plumbing Reroute Station',
        lines: [
          'Four rusted valves control the campus water pressure.',
          ...(state.fountainFlooded ? ['The pressure has already been rerouted to the Quadrangle fountain.'] : []),
        ],
        actions: [
          { id: 'return-lab', label: 'Return to the Lab.' },
          ...(!state.fountainFlooded && state.notesRead
            ? [{ id: 'reroute-water', label: 'Turn the valves in the memorized sequence.' }]
            : []),
        ],
      }

    case 'velvetFoyer':
      return {
        room: state.room,
        title: 'Velvet Foyer',
        lines: [
          'Elite Security patrol in alternating pairs beneath marble pillars and velvet banners.',
          'Their vision cones are broader and harsher than anything in the Quadrangle.',
        ],
        actions: [
          { id: 'sneak-mainframe', label: 'Sneak toward the Mainframe Room.' },
          { id: 'retreat-tower', label: 'Retreat to the Quadrangle.' },
        ],
      }

    case 'mainframeRoom':
      return {
        room: state.room,
        title: 'Mainframe Room',
        lines: [
          'The master terminal governs the entire Skool network.',
          'Heavy security doors separate this room from the Headmaster Office.',
        ],
        actions: [
          { id: 'return-foyer', label: 'Return to the Velvet Foyer.' },
          ...(state.lockdownActive ? [] : [{ id: 'insert-evidence', label: 'Load the accumulated blackmail evidence into the terminal.' }]),
          ...(state.lockdownActive ? [{ id: 'enter-office', label: "Enter the Headmaster's Office." }] : []),
        ],
      }

    case 'headmastersOffice':
      return {
        room: state.room,
        title: "Headmaster's Office",
        lines: [
          'The Headmaster is pinned behind a mahogany desk with nowhere left to run.',
          'Your evidence is already propagating through the Skool network.',
        ],
        actions: [{ id: 'demand-resignation', label: 'Force the Headmaster to sign his resignation.' }],
      }
  }
}

export function resolveAction(state: GameState, actionId: string): ActionResult {
  const next = cloneState(state)

  switch (state.room) {
    case 'archivalStorage':
      if (actionId === 'go-boiler') return { state: withRoom(next, 'boilerRoom'), lines: [] }
      if (actionId === 'pry-floorboard') {
        next.floorboardPried = true
        next.inventory.budgetReports = true
        return {
          state: next,
          lines: [
            'You pry up the loose board and expose a hidden packet of evidence.',
            'Acquired: Redacted Budget Reports.',
          ],
        }
      }
      break

    case 'boilerRoom':
      if (actionId === 'return-archival') return { state: withRoom(next, 'archivalStorage'), lines: [] }
      if (actionId === 'go-tunnels') return { state: withRoom(next, 'drainageTunnels'), lines: [] }
      if (actionId === 'go-closet' && state.inventory.rustedKey) return { state: withRoom(next, 'janitorialCloset'), lines: [] }
      if (actionId === 'wait-droid') {
        next.droidDocked = true
        return {
          state: next,
          lines: [
            'You wait in the boiler noise until the Maintenance Droid returns to the charging panel.',
            'Its Power Coupling slides into reach.',
          ],
        }
      }
      if (actionId === 'extract-coupling') {
        if (state.inventory.powerCoupling) {
          return { state: next, lines: ['You already have the Power Coupling.'] }
        }
        if (!state.droidDocked) {
          return {
            state: next,
            lines: ['The droid is still moving. You need it docked before the coupling can be reached.'],
          }
        }
        next.droidDocked = false
        if (state.inventory.rubberMat) {
          next.inventory.powerCoupling = true
          return {
            state: next,
            lines: [
              'You brace the Insulated Rubber Mat against the panel and tear out the coupling safely.',
              'Acquired: Power Coupling.',
            ],
          }
        }

        return {
          state: damage(next, 100),
          lines: [
            'You grab the live coupling barehanded.',
            'The voltage is instant and catastrophic.',
          ],
        }
      }
      if (actionId === 'power-lift' && state.inventory.powerCoupling) {
        next.inventory.powerCoupling = false
        next.liftPowered = true
        return {
          state: next,
          lines: ['You slot the Power Coupling into the Rusted Service Lift. The platform rattles to life.'],
        }
      }
      if (actionId === 'ride-lift' && state.liftPowered) return { state: withRoom(next, 'quadrangleSouth'), lines: [] }
      break

    case 'drainageTunnels':
      if (actionId === 'return-boiler') return { state: withRoom(next, 'boilerRoom'), lines: [] }
      if (actionId === 'take-key') {
        next.inventory.rustedKey = true
        return {
          state: next,
          lines: ['You search the box and recover a rusted iron key.'],
        }
      }
      if (actionId === 'climb-cafeteria' && state.grateRemoved) return { state: withRoom(next, 'cafeteriaHall'), lines: [] }
      break

    case 'janitorialCloset':
      if (actionId === 'return-boiler') return { state: withRoom(next, 'boilerRoom'), lines: [] }
      if (actionId === 'take-mat') {
        next.inventory.rubberMat = true
        return {
          state: next,
          lines: ['You pull the Insulated Rubber Mat from the wall and roll it under your arm.'],
        }
      }
      break

    case 'quadrangleSouth':
      if (actionId === 'go-west') return moveFromSouthQuadrant(next, 'quadrangleWest')
      if (actionId === 'go-east') return moveFromSouthQuadrant(next, 'quadrangleEast')
      if (actionId === 'go-north') return moveFromSouthQuadrant(next, 'quadrangleNorth')
      if (actionId === 'go-centre') return moveFromSouthQuadrant(next, 'quadrangleCentre')
      if (actionId === 'ride-down') return { state: withRoom(next, 'boilerRoom'), lines: [] }
      break

    case 'quadrangleWest':
      if (actionId === 'enter-cafeteria') return { state: withRoom(next, 'cafeteriaHall'), lines: [] }
      if (actionId === 'return-south') return { state: withRoom(next, 'quadrangleSouth'), lines: [] }
      break

    case 'quadrangleEast':
      if (actionId === 'use-chemical-key') {
        if (!state.inventory.chemicalKey) {
          return { state: next, lines: ['The chemical lock rejects you. You need the proper key.'] }
        }
        return { state: withRoom(next, 'decontaminationLock'), lines: [] }
      }
      if (actionId === 'return-south') return { state: withRoom(next, 'quadrangleSouth'), lines: [] }
      break

    case 'quadrangleNorth':
      if (actionId === 'use-acid') {
        if (!state.inventory.acidFlask) {
          return { state: next, lines: ['The brass padlocks are too heavy to force without the solvent.'] }
        }
        return {
          state: withRoom(next, 'velvetFoyer'),
          lines: ['The Acid Flask hisses across the brass padlocks until the gates swing open.'],
        }
      }
      if (actionId === 'return-south') return { state: withRoom(next, 'quadrangleSouth'), lines: [] }
      break

    case 'quadrangleCentre':
      if (actionId === 'return-south') return { state: withRoom(next, 'quadrangleSouth'), lines: [] }
      if (actionId === 'swim-tunnel' && state.fountainFlooded) {
        return {
          state: withRoom(next, 'velvetFoyer'),
          lines: ['You dive through the flooded fountain drain and emerge inside the Administration Tower.'],
        }
      }
      break

    case 'cafeteriaHall':
      if (actionId === 'go-laundry') return { state: withRoom(next, 'laundryRoom'), lines: [] }
      if (actionId === 'go-barracks') return { state: withRoom(next, 'enforcerBarracks'), lines: [] }
      if (actionId === 'exit-west') return { state: withRoom(next, 'quadrangleWest'), lines: [] }
      if (actionId === 'take-screwdriver') {
        next.inventory.screwdriver = true
        return { state: next, lines: ['Acquired: Screwdriver.'] }
      }
      if (actionId === 'take-ration') {
        next.inventory.rationPack = true
        return { state: next, lines: ['Acquired: Ration Pack.'] }
      }
      if (actionId === 'remove-grate' && state.inventory.screwdriver) {
        next.grateRemoved = true
        return {
          state: next,
          lines: ['You remove the ventilation grate and open a permanent shortcut into the Drainage Tunnels.'],
        }
      }
      if (actionId === 'vent-to-tunnels' && state.grateRemoved) return { state: withRoom(next, 'drainageTunnels'), lines: [] }
      break

    case 'laundryRoom':
      if (actionId === 'go-roof') return { state: withRoom(next, 'roof'), lines: [] }
      if (actionId === 'return-cafeteria') return { state: withRoom(next, 'cafeteriaHall'), lines: [] }
      if (actionId === 'trade-tape' && state.inventory.rationPack) {
        next.inventory.rationPack = false
        next.inventory.blankTape = true
        return {
          state: next,
          lines: ['The dealer takes the food without a word and slides you a Blank Cassette Tape.'],
        }
      }
      break

    case 'roof':
      if (actionId === 'return-laundry') return { state: withRoom(next, 'laundryRoom'), lines: [] }
      if (actionId === 'give-tape' && state.inventory.blankTape) {
        next.inventory.blankTape = false
        next.dogScared = true
        return {
          state: next,
          lines: [
            'The Pirate Radio Host records the manifesto and hijacks the intercom system.',
            'A high-frequency tone floods the Dormitories.',
          ],
        }
      }
      break

    case 'enforcerBarracks':
      if (actionId === 'return-cafeteria') return { state: withRoom(next, 'cafeteriaHall'), lines: [] }
      if (actionId === 'approach-enforcer' && !state.dogScared) {
        return {
          state: withRoom(damage(next, 30), 'cafeteriaHall'),
          lines: [
            'The guard dog lunges the moment you step closer.',
            'You escape, bleeding, back into the Cafeteria.',
            'HP reduced by 30.',
          ],
        }
      }
      if (actionId === 'steal-chemical-key' && state.dogScared) {
        next.inventory.chemicalKey = true
        return { state: next, lines: ['You unclip the Chemical Key from the Enforcer belt.'] }
      }
      if (actionId === 'take-orders' && state.dogScared) {
        next.inventory.transferOrders = true
        return { state: next, lines: ['You crack open the footlocker and secure the Forged Transfer Orders.'] }
      }
      break

    case 'decontaminationLock':
      if (actionId === 'scan-lab') {
        if (state.inventory.budgetReports) {
          const failed = damage(next, 100)
          failed.inventory.budgetReports = false
          return {
            state: failed,
            lines: [
              'The scanner flags the Redacted Budget Reports as contraband.',
              'Incendiary gas floods the chamber, burning the evidence and your lungs with it.',
            ],
          }
        }
        return {
          state: withRoom(next, 'synthesisLab'),
          lines: ['The scanner clears you. The Science Wing opens deeper inside.'],
        }
      }
      if (actionId === 'return-east') return { state: withRoom(next, 'quadrangleEast'), lines: [] }
      if (actionId === 'hide-reports' && state.inventory.budgetReports) {
        next.inventory.budgetReports = false
        next.reportsHidden = true
        return { state: next, lines: ['You secure the Redacted Budget Reports inside the lead-lined specimen box.'] }
      }
      if (actionId === 'retrieve-reports' && state.reportsHidden) {
        next.inventory.budgetReports = true
        next.reportsHidden = false
        return { state: next, lines: ['You retrieve the Redacted Budget Reports from the specimen box.'] }
      }
      break

    case 'synthesisLab':
      if (actionId === 'go-dissection') return { state: withRoom(next, 'dissectionTheatre'), lines: [] }
      if (actionId === 'go-specimen') return { state: withRoom(next, 'specimenContainment'), lines: [] }
      if (actionId === 'go-plumbing') return { state: withRoom(next, 'plumbingStation'), lines: [] }
      if (actionId === 'return-decon') return { state: withRoom(next, 'decontaminationLock'), lines: [] }
      if (actionId === 'mix-acid' && state.notesRead) {
        next.inventory.acidFlask = true
        return {
          state: next,
          lines: ['You follow the recovered ratio precisely and distill a usable Acid Flask.'],
        }
      }
      break

    case 'dissectionTheatre':
      if (actionId === 'read-notes') {
        next.notesRead = true
        return {
          state: next,
          lines: ['You memorize the industrial solvent ratio and the four-valve plumbing sequence.'],
        }
      }
      if (actionId === 'return-lab') return { state: withRoom(next, 'synthesisLab'), lines: [] }
      break

    case 'specimenContainment':
      if (actionId === 'return-lab') return { state: withRoom(next, 'synthesisLab'), lines: [] }
      if (actionId === 'take-logs') {
        next.inventory.testingLogs = true
        return { state: next, lines: ['Acquired: Unethical Testing Logs.'] }
      }
      break

    case 'plumbingStation':
      if (actionId === 'return-lab') return { state: withRoom(next, 'synthesisLab'), lines: [] }
      if (actionId === 'reroute-water' && state.notesRead) {
        next.fountainFlooded = true
        next.valvesSolved = true
        return {
          state: next,
          lines: ['The pipe network groans as the water pressure reroutes. The Ancient Dry Fountain floods silently.'],
        }
      }
      break

    case 'velvetFoyer':
      if (actionId === 'sneak-mainframe') return moveToTower(next)
      if (actionId === 'retreat-tower') {
        return { state: withRoom(next, state.fountainFlooded ? 'quadrangleCentre' : 'quadrangleNorth'), lines: [] }
      }
      break

    case 'mainframeRoom':
      if (actionId === 'return-foyer') return { state: withRoom(next, 'velvetFoyer'), lines: [] }
      if (actionId === 'insert-evidence') {
        if (state.inventory.budgetReports && state.inventory.transferOrders && state.inventory.testingLogs) {
          next.lockdownActive = true
          return {
            state: next,
            lines: [
              'The terminal verifies the corruption trail and pushes it across the Skool network.',
              'Facility lockdown engages. The heavy security doors seal Elite Security out in the foyer.',
            ],
          }
        }

        return {
          state: next,
          lines: ['The system rejects the upload. All three pieces of blackmail evidence are required.'],
        }
      }
      if (actionId === 'enter-office' && state.lockdownActive) return { state: withRoom(next, 'headmastersOffice'), lines: [] }
      break

    case 'headmastersOffice':
      if (actionId === 'demand-resignation') {
        next.inventory.masterKeycard = true
        next.victory = true
        next.gameOver = true
        return {
          state: next,
          lines: [
            'The Headmaster signs the resignation letter with a shaking hand.',
            'He slides the Master Executive Keycard across the desk.',
          ],
        }
      }
      break
  }

  return { state: next, lines: ['Nothing happens.'] }
}

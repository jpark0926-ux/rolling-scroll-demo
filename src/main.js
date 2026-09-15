const PANELS = [
  {
    id: 'overture',
    index: '00',
    kicker: 'Meridian Atelier',
    title: 'Objects\nin motion',
    lede: 'Six faces on a drum. Scroll and the cylinder turns — each piece a full scene, none of them a slide.',
    mark: 'ring',
    tone: 'overture',
  },
  {
    id: 'atlas',
    index: '01',
    kicker: 'Acoustics',
    title: 'Atlas',
    lede: 'A sealed birch cabinet and one full-range driver. Tuned for rooms that stay quiet on purpose.',
    specs: [
      ['Driver', '4″ full-range'],
      ['Cabinet', 'Baltic birch'],
      ['Finish', 'Oil black'],
    ],
    mark: 'bar',
    tone: 'atlas',
  },
  {
    id: 'halo',
    index: '02',
    kicker: 'Light',
    title: 'Halo',
    lede: 'A suspended ring that throws a soft horizon, not a hotspot. Dims to a candle without flicker.',
    specs: [
      ['Source', '2700 K COB'],
      ['Throw', 'Indirect'],
      ['Body', 'Spun brass'],
    ],
    mark: 'halo',
    tone: 'halo',
  },
  {
    id: 'signal',
    index: '03',
    kicker: 'Broadcast',
    title: 'Signal',
    lede: 'Shortwave, weather, and a single analog dial. Built to be left on a windowsill for a decade.',
    specs: [
      ['Bands', 'AM / SW / WX'],
      ['Dial', 'Machined alum.'],
      ['Power', 'Cell or crank'],
    ],
    mark: 'wave',
    tone: 'signal',
  },
  {
    id: 'drift',
    index: '04',
    kicker: 'Seating',
    title: 'Drift',
    lede: 'A lounge chair that leans like a dune. Wool, ash, and a pitch you notice only when you stand.',
    specs: [
      ['Frame', 'White ash'],
      ['Cloth', 'Undyed wool'],
      ['Pitch', '18°'],
    ],
    mark: 'seat',
    tone: 'drift',
  },
  {
    id: 'nova',
    index: '05',
    kicker: 'Optics',
    title: 'Nova',
    lede: 'A compact rangefinder with a quiet shutter and a viewfinder that still has a hard edge.',
    specs: [
      ['Lens', '35 mm f/2'],
      ['Finder', '1:1 brightline'],
      ['Body', 'Black chrome'],
    ],
    mark: 'lens',
    tone: 'nova',
  },
  {
    id: 'ledger',
    index: '06',
    kicker: 'Paper',
    title: 'Ledger',
    lede: 'A desk-bound notebook with a lay-flat stitch and paper that takes a fountain pen without bleed.',
    specs: [
      ['Size', 'A5'],
      ['Stock', '90 gsm cream'],
      ['Bind', 'Thread, 3-hole'],
    ],
    mark: 'leaf',
    tone: 'ledger',
  },
]

const ANGLE_STEP = 90
const LERP = 0.16
const SNAP_MS = 280

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const stage = document.getElementById('stage')
const rig = document.getElementById('rig')
const rail = document.getElementById('rail')
const dotsNav = document.getElementById('dots')

document.documentElement.style.setProperty('--panel-count', String(PANELS.length))

function markSvg(kind) {
  const icons = {
    ring: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="22" fill="none" stroke="currentColor" stroke-width="1.25"/><circle cx="40" cy="40" r="3" fill="currentColor"/></svg>',
    bar: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect x="18" y="34" width="44" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
    halo: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="26" fill="none" stroke="currentColor" stroke-width="1.25"/><circle cx="40" cy="40" r="14" fill="none" stroke="currentColor" stroke-width="1.25" opacity="0.45"/></svg>',
    wave: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M12 40c8-14 16-14 24 0s16 14 24 0 16-14 24 0" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
    seat: '<svg viewBox="0 0 80 80" aria-hidden="true"><path d="M16 52h48M22 52V28c0-4 8-8 18-8s18 4 18 8v24" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
    lens: '<svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" stroke-width="1.25"/><circle cx="40" cy="40" r="8" fill="none" stroke="currentColor" stroke-width="1.25"/><path d="M58 22l8-8" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
    leaf: '<svg viewBox="0 0 80 80" aria-hidden="true"><rect x="24" y="14" width="32" height="52" rx="1" fill="none" stroke="currentColor" stroke-width="1.25"/><path d="M24 28h32M32 14v14" fill="none" stroke="currentColor" stroke-width="1.25"/></svg>',
  }
  return icons[kind] ?? icons.ring
}

function panelHTML(panel, i) {
  const specs = panel.specs
    ? `<dl class="specs">${panel.specs
        .map(
          ([k, v]) =>
            `<div><dt>${k}</dt><dd>${v}</dd></div>`,
        )
        .join('')}</dl>`
    : ''

  const cue =
    i === 0
      ? `<p class="cue"><span class="cue-line"></span>Scroll</p>`
      : ''

  return `
    <article class="panel tone-${panel.tone}" data-index="${i}" id="panel-${panel.id}">
      <div class="panel-face">
        <div class="panel-sheen"></div>
        <div class="panel-shade"></div>
        <div class="panel-inner">
          <div class="panel-top">
            <span class="panel-index">${panel.index}</span>
            <span class="panel-kicker">${panel.kicker}</span>
          </div>
          <div class="panel-mid">
            <div class="panel-mark">${markSvg(panel.mark)}</div>
            <h2 class="panel-title">${panel.title.replace('\n', '<br />')}</h2>
            <p class="panel-lede">${panel.lede}</p>
            ${specs}
          </div>
          ${cue}
        </div>
      </div>
    </article>
  `
}

rig.innerHTML = PANELS.map(panelHTML).join('')
rail.innerHTML = PANELS.map((_, i) => `<div class="snap" data-snap="${i}"></div>`).join('')
dotsNav.innerHTML = PANELS.map(
  (panel, i) =>
    `<button type="button" class="dot" data-to="${i}" aria-label="Go to ${panel.title.replace('\n', ' ')}"></button>`,
).join('')

const faces = [...rig.querySelectorAll('.panel')]
const dots = [...dotsNav.querySelectorAll('.dot')]

let target = 0
let current = 0
let ticking = false
let snapTimer = 0
let viewportH = window.innerHeight

function maxScroll() {
  return Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
}

function readTarget() {
  viewportH = window.innerHeight
  const max = PANELS.length - 1
  target = Math.min(max, Math.max(0, (window.scrollY / maxScroll()) * max))
}

function goTo(index, behavior = 'smooth') {
  const max = PANELS.length - 1
  const y = max === 0 ? 0 : (index / max) * maxScroll()
  window.scrollTo({ top: y, behavior: reduced ? 'auto' : behavior })
}

function apply(progress) {
  const radius = viewportH * 0.5
  rig.style.setProperty('--radius', `${radius}px`)

  let active = 0
  let best = Infinity

  faces.forEach((el, i) => {
    const offset = i - progress
    const abs = Math.abs(offset)

    if (abs < best) {
      best = abs
      active = i
    }

    if (abs > 1.12) {
      el.hidden = true
      el.style.visibility = 'hidden'
      return
    }

    el.hidden = false
    el.style.visibility = 'visible'

    const angle = offset * ANGLE_STEP
    const shade = Math.min(1, abs * 0.92)

    if (reduced) {
      el.style.transform = 'none'
      el.style.opacity = String(Math.max(0, 1 - abs))
      el.style.setProperty('--shade', '0')
    } else {
      el.style.opacity = '1'
      el.style.transform = `rotateX(${angle}deg) translateZ(var(--radius))`
      el.style.setProperty('--shade', String(shade))
    }

    el.classList.toggle('is-current', abs < 0.45)
    el.setAttribute('aria-hidden', abs > 0.55 ? 'true' : 'false')
  })

  dots.forEach((dot, i) => {
    dot.classList.toggle('is-active', i === active)
    dot.setAttribute('aria-current', i === active ? 'true' : 'false')
  })

  stage.dataset.active = String(active)
}

function frame() {
  ticking = true
  const next = reduced ? target : current + (target - current) * LERP
  current = Math.abs(target - next) < 0.0004 ? target : next
  apply(current)

  if (!reduced && Math.abs(target - current) > 0.0004) {
    requestAnimationFrame(frame)
  } else {
    ticking = false
    apply(target)
    current = target
  }
}

function requestFrame() {
  if (!ticking) requestAnimationFrame(frame)
}

function onScroll() {
  readTarget()
  requestFrame()

  if (reduced) return
  window.clearTimeout(snapTimer)
  snapTimer = window.setTimeout(() => {
    const nearest = Math.min(PANELS.length - 1, Math.max(0, Math.round(target)))
    const y = (nearest / Math.max(1, PANELS.length - 1)) * maxScroll()
    if (Math.abs(window.scrollY - y) > 4) {
      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, SNAP_MS)
}

function onResize() {
  readTarget()
  apply(current)
}

dots.forEach((dot) => {
  dot.addEventListener('click', () => goTo(Number(dot.dataset.to)))
})

window.addEventListener(
  'keydown',
  (event) => {
    const keys = {
      ArrowDown: 1,
      PageDown: 1,
      ArrowUp: -1,
      PageUp: -1,
    }
    if (event.key in keys) {
      event.preventDefault()
      const next = Math.min(
        PANELS.length - 1,
        Math.max(0, Math.round(target) + keys[event.key]),
      )
      goTo(next)
      return
    }
    if (event.key === 'Home') {
      event.preventDefault()
      goTo(0)
    }
    if (event.key === 'End') {
      event.preventDefault()
      goTo(PANELS.length - 1)
    }
  },
  { passive: false },
)

window.addEventListener('scroll', onScroll, { passive: true })
window.addEventListener('resize', onResize, { passive: true })

readTarget()
current = target
apply(current)

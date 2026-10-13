import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { birthdayConfig } from './data/birthdayConfig'
import { allMedia } from './data/mediaLibrary'
import './App.css'

const sceneLabels = {
  hero: 'Birthday',
  memories: 'Memories',
  timeline: 'Story',
  notes: 'Notes',
  cake: 'Cake',
  letter: 'Letter',
  final: 'Ending',
}

const mediaGallery = allMedia.map((src, index) => ({
  src,
  alt: `Little memory ${index + 1}`,
  isVideo: src.toLowerCase().endsWith('.mp4'),
}))

function App() {
  const [openWorld, setOpenWorld] = useState(false)
  const [currentScene, setCurrentScene] = useState('hero')
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [revealedNotes, setRevealedNotes] = useState([])
  const [revealedSecrets, setRevealedSecrets] = useState([])
  const [letterOpen, setLetterOpen] = useState(false)
  const [candlesLit, setCandlesLit] = useState(false)
  const [wishMade, setWishMade] = useState(false)
  const [skipAnimations, setSkipAnimations] = useState(false)
  const [confettiBurst, setConfettiBurst] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = () => setSkipAnimations(mediaQuery.matches)

    handleChange()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange)
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    mediaQuery.addListener(handleChange)
    return () => mediaQuery.removeListener(handleChange)
  }, [])

  useEffect(() => {
    if (!confettiBurst) return
    const timer = window.setTimeout(() => setConfettiBurst(false), 1800)
    return () => window.clearTimeout(timer)
  }, [confettiBurst])

  useEffect(() => {
    if (!selectedMemory) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') setSelectedMemory(null)
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedMemory])

  const progress = ((Object.keys(sceneLabels).indexOf(currentScene) + 1) / Object.keys(sceneLabels).length) * 100

  const jumpToScene = (scene) => {
    setCurrentScene(scene)
    const target = document.getElementById(scene)
    if (target) {
      target.scrollIntoView({ behavior: skipAnimations ? 'auto' : 'smooth', block: 'start' })
    }
  }

  const toggleNote = (index) => {
    setRevealedNotes((current) =>
      current.includes(index) ? current.filter((entry) => entry !== index) : [...current, index],
    )
  }

  const toggleSecret = (index) => {
    setRevealedSecrets((current) =>
      current.includes(index) ? current.filter((entry) => entry !== index) : [...current, index],
    )
  }

  const handleWish = () => {
    setCandlesLit(true)
    setWishMade(true)
    setConfettiBurst(true)
  }

  const revealNextMemory = (direction) => {
    if (!selectedMemory) return
    const index = birthdayConfig.memories.findIndex((memory) => memory.caption === selectedMemory.caption)
    const nextIndex = (index + direction + birthdayConfig.memories.length) % birthdayConfig.memories.length
    setSelectedMemory(birthdayConfig.memories[nextIndex])
  }

  const letterParagraphs = birthdayConfig.letterText.split('\n\n')

  return (
    <div className="birthday-app">
      <AnimatePresence>
        {!openWorld && (
          <motion.section
            className="opening-screen"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.7 }}
          >
            <div className="opening-card">
              <p className="eyebrow">A little surprise</p>
              <h1>{birthdayConfig.introLine}</h1>
              <p className="opening-subtitle">{birthdayConfig.introSubline}</p>
              <div className="opening-actions">
                <button type="button" className="primary-button" onClick={() => setOpenWorld(true)}>
                  {birthdayConfig.introButton}
                </button>
                <button type="button" className="secondary-button" onClick={() => setOpenWorld(true)}>
                  Skip intro
                </button>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {openWorld && (
        <>
          <header className="top-bar">
            <div className="brand-mark">A Little World Made for You</div>
            <nav className="scene-nav" aria-label="Main sections">
              {Object.entries(sceneLabels).map(([scene, label]) => (
                <button
                  key={scene}
                  type="button"
                  className={currentScene === scene ? 'scene-link active' : 'scene-link'}
                  onClick={() => jumpToScene(scene)}
                >
                  {label}
                </button>
              ))}
            </nav>
            <button type="button" className="secondary-button tiny" onClick={() => setSkipAnimations((value) => !value)}>
              {skipAnimations ? 'Motion on' : 'Skip motion'}
            </button>
          </header>

          <div className="progress-rail" aria-label="Story progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          <main className="story-shell">
            <section id="hero" className="scene hero-scene">
              <div className="hero-copy">
                <p className="eyebrow">For {birthdayConfig.friendName}</p>
                <h2>{birthdayConfig.heroTitle}</h2>
                <p className="hero-message">{birthdayConfig.heroMessage}</p>
                <p className="hero-note">{birthdayConfig.heroNote}</p>
                <div className="hero-actions">
                  <button type="button" className="primary-button" onClick={() => jumpToScene('memories')}>
                    Open the scrapbook
                  </button>
                  <button type="button" className="secondary-button" onClick={() => jumpToScene('notes')}>
                    Little notes
                  </button>
                </div>
              </div>

              <div className="hero-visual">
                <div className="photo-frame large-frame">
                  <img
                    src={birthdayConfig.memories[0].src}
                    alt={birthdayConfig.memories[0].alt}
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
                <div className="floating-flower" aria-hidden="true" />
              </div>
            </section>

            <section id="memories" className="scene scrapbook-scene">
              <div className="section-heading">
                <p className="eyebrow">Our little memories</p>
                <h3>Polaroids, laughter, and little moments.</h3>
              </div>

              <div className="scrapbook-grid">
                {birthdayConfig.memories.map((memory, index) => (
                  <button
                    key={`${memory.caption}-${index}`}
                    type="button"
                    className={`memory-card ${memory.size}`}
                    style={{ transform: `rotate(${memory.rotation})` }}
                    onClick={() => setSelectedMemory(memory)}
                    aria-label={`Open memory ${index + 1}`}
                  >
                    <img
                      src={memory.src}
                      alt={memory.alt}
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = 'none'
                      }}
                    />
                    <strong>{memory.caption}</strong>
                  </button>
                ))}
              </div>

              <div className="media-gallery" aria-label="Library of all saved moments">
                {mediaGallery.map((media, index) => (
                  <div key={`${media.src}-${index}`} className="media-tile">
                    {media.isVideo ? (
                      <video src={media.src} autoPlay muted loop playsInline preload="metadata" />
                    ) : (
                      <img src={media.src} alt={media.alt} loading="lazy" />
                    )}
                  </div>
                ))}
              </div>
            </section>

            <section id="timeline" className="scene timeline-scene">
              <div className="section-heading">
                <p className="eyebrow">Our story</p>
                <h3>Little moments that became big memories.</h3>
              </div>

              <div className="timeline">
                {birthdayConfig.timeline.map((entry, index) => (
                  <article key={`${entry.title}-${index}`} className={index % 2 === 0 ? 'timeline-item' : 'timeline-item reversed'}>
                    <div className="timeline-dot" aria-hidden="true" />
                    <div className="timeline-card">
                      <h4>{entry.title}</h4>
                      <p>{entry.description}</p>
                      {entry.image && (
                        <img
                          src={entry.image}
                          alt={entry.title}
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section id="notes" className="scene notes-scene">
              <div className="section-heading">
                <p className="eyebrow">Things I love about you</p>
                <h3>A few things that make you, YOU.</h3>
              </div>

              <div className="notes-grid">
                {birthdayConfig.notes.map((note, index) => {
                  const isRevealed = revealedNotes.includes(index)

                  return (
                    <button
                      key={`${note}-${index}`}
                      type="button"
                      className={isRevealed ? 'note-card open' : 'note-card'}
                      onClick={() => toggleNote(index)}
                    >
                      <span className="note-tag">Little note {index + 1}</span>
                      <span className="note-content">{isRevealed ? note : 'Tap to open'}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section id="cake" className="scene cake-scene">
              <div className="section-heading">
                <p className="eyebrow">Birthday cake</p>
                <h3>Light the candles and make a wish.</h3>
              </div>

              <div className="cake-wrapper">
                <div className="cake-illustration" aria-live="polite">
                  <div className="cake-plate" />
                  <div className="cake-body">
                    <div className="cake-icing" />
                    <div className="cake-sparkle" />
                  </div>
                  <div className="candles">
                    {[0, 1, 2].map((index) => (
                      <div key={index} className={candlesLit ? 'candle lit' : 'candle'}>
                        <span className="flame" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cake-controls">
                  <button type="button" className="primary-button" onClick={() => setCandlesLit((value) => !value)}>
                    {candlesLit ? 'Extinguish candles' : 'Light the candles'}
                  </button>
                  <button type="button" className="secondary-button" onClick={handleWish}>
                    Make a wish
                  </button>
                </div>

                <div className={confettiBurst ? 'confetti-layer visible' : 'confetti-layer'} aria-hidden="true">
                  {Array.from({ length: 24 }).map((_, index) => (
                    <span
                      key={index}
                      style={{
                        '--delay': `${index * 0.08}s`,
                        '--x': `${(index % 6) * 30 - 60}px`,
                        '--y': `${Math.floor(index / 6) * 26 - 20}px`,
                      }}
                    />
                  ))}
                </div>

                {wishMade && <p className="cake-message">{birthdayConfig.finalWish}</p>}
              </div>
            </section>

            <section id="letter" className="scene letter-scene">
              <div className="section-heading">
                <p className="eyebrow">One last thing</p>
                <h3>{birthdayConfig.letterTitle}</h3>
              </div>

              <div className="letter-wrap">
                <div className={letterOpen ? 'envelope opened' : 'envelope'} onClick={() => setLetterOpen(true)}>
                  <div className="envelope-flap" />
                  <div className="letter-paper">
                    {letterParagraphs.map((paragraph, index) => (
                      <p
                        key={`${paragraph}-${index}`}
                        className={letterOpen ? 'letter-paragraph visible' : 'letter-paragraph'}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
                <div className="letter-actions">
                  <button type="button" className="secondary-button" onClick={() => setLetterOpen(true)}>
                    Read the letter
                  </button>
                  <button type="button" className="secondary-button" onClick={() => setLetterOpen(true)}>
                    Skip animation
                  </button>
                </div>
              </div>
            </section>

            <section id="final" className="scene final-scene">
              <div className="final-card">
                <p className="eyebrow">The end, and the beginning</p>
                <h3>{birthdayConfig.finalTagline}</h3>
                <img
                  src={birthdayConfig.memories[1].src}
                  alt="A joyful memory together"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <p className="final-message">{birthdayConfig.finalSurpriseText}</p>
                <div className="final-actions">
                  <button type="button" className="primary-button" onClick={() => jumpToScene('hero')}>
                    {birthdayConfig.finalButton}
                  </button>
                  <button type="button" className="secondary-button" onClick={() => jumpToScene('letter')}>
                    Open the letter again
                  </button>
                </div>
              </div>
            </section>

            <section id="surprises" className="scene hidden-gifts-scene">
              <div className="section-heading">
                <p className="eyebrow">Hidden gifts</p>
                <h3>Little treasures scattered through the day.</h3>
              </div>

              <div className="secret-header">
                <span>
                  {revealedSecrets.length} / {birthdayConfig.hiddenSecrets.length} little surprises found
                </span>
              </div>

              <div className="gift-grid">
                {birthdayConfig.hiddenSecrets.map((secret, index) => {
                  const isOpened = revealedSecrets.includes(index)

                  return (
                    <button
                      key={`${secret.title}-${index}`}
                      type="button"
                      className={isOpened ? 'gift-card revealed' : 'gift-card'}
                      onClick={() => toggleSecret(index)}
                    >
                      <span className="gift-title">{secret.title}</span>
                      <span className="gift-message">{isOpened ? secret.message : 'Tap to open'}</span>
                    </button>
                  )
                })}
              </div>
            </section>
          </main>
        </>
      )}

      {selectedMemory && (
        <div className="lightbox-backdrop" onClick={() => setSelectedMemory(null)} role="dialog" aria-modal="true">
          <div className="lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-button" onClick={() => setSelectedMemory(null)} aria-label="Close memory view">
              ×
            </button>
            <div className="lightbox-media">
              <img
                src={selectedMemory.src}
                alt={selectedMemory.alt}
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="lightbox-copy">
              <h4>{selectedMemory.caption}</h4>
              <div className="lightbox-actions">
                <button type="button" className="secondary-button" onClick={() => revealNextMemory(-1)}>
                  Previous
                </button>
                <button type="button" className="secondary-button" onClick={() => revealNextMemory(1)}>
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App

import { useCallback, useEffect, useRef, useState } from 'react'
import Alert from '../components/Alert'
import Button from '../components/Button'
import Dropzone from '../components/Dropzone'
import ImagePanel from '../components/ImagePanel'
import Loader from '../components/Loader'
import Reveal from '../components/Reveal'
import {
  IconCheck,
  IconDownload,
  IconRefresh,
  IconSparkles,
  IconUpload,
} from '../components/Icons'
import { isMockMode, removeBackground, validateImage } from '../services/api'
import './RemoveBackgroundPage.css'

/** "2.4 MB" from a byte count. */
function formatSize(bytes) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** "beach-photo.jpg" -> "beach-photo-no-bg.png" */
function downloadName(originalName) {
  const base = (originalName || 'image').replace(/\.[^./\\]+$/, '')
  return `${base}-no-bg.png`
}

const TIPS = [
  'A clearly separated subject gives the cleanest edges.',
  'Even lighting beats harsh shadows behind the subject.',
  'Higher resolution in means more detail in your cutout.',
]

export default function RemoveBackgroundPage() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [resultUrl, setResultUrl] = useState(null)
  const [status, setStatus] = useState('idle') // idle | ready | processing | done | error
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')

  // Object URLs are tracked in a ref so cleanup can revoke them without
  // re-running on every state change.
  const objectUrls = useRef([])
  const abortRef = useRef(null)
  const resultRef = useRef(null)

  const trackUrl = (url) => {
    objectUrls.current.push(url)
    return url
  }

  const revokeAll = useCallback(() => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url))
    objectUrls.current = []
  }, [])

  // Release blob URLs and cancel any in-flight upload on unmount.
  useEffect(
    () => () => {
      revokeAll()
      abortRef.current?.abort()
    },
    [revokeAll]
  )

  const handleFileSelected = useCallback((selected) => {
    const validationError = validateImage(selected)

    // Reject the file but keep whatever was already loaded, so a bad drop
    // doesn't wipe out a good image the user is mid-way through.
    if (validationError) {
      setError(validationError)
      return
    }

    // Drop anything from a previous run.
    revokeAll()
    setError('')
    setResultUrl(null)
    setProgress(null)
    setFile(selected)
    setPreviewUrl(trackUrl(URL.createObjectURL(selected)))
    setStatus('ready')
  }, [revokeAll])

  const handleRemoveBackground = async () => {
    if (!file) return

    const controller = new AbortController()
    abortRef.current = controller

    setStatus('processing')
    setError('')
    setProgress(0)

    try {
      const { url } = await removeBackground(file, {
        signal: controller.signal,
        onUploadProgress: setProgress,
      })

      setResultUrl(trackUrl(url))
      setStatus('done')

      // Nudge the result into view on small screens, where the panels stack.
      requestAnimationFrame(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setStatus('error')
    } finally {
      setProgress(null)
      abortRef.current = null
    }
  }

  const handleReset = () => {
    abortRef.current?.abort()
    revokeAll()
    setFile(null)
    setPreviewUrl(null)
    setResultUrl(null)
    setProgress(null)
    setError('')
    setStatus('idle')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isProcessing = status === 'processing'
  const hasResult = status === 'done' && resultUrl

  return (
    <section className="rbg">
      <span className="glow rbg__glow" aria-hidden="true" />

      <div className="container rbg__inner">
        <Reveal className="rbg__header">
          <span className="eyebrow">
            <IconSparkles size={14} />
            Background remover
          </span>
          <h1 className="rbg__title">
            {hasResult ? 'Your cutout is ready' : 'Upload an image to get started'}
          </h1>
          <p className="rbg__subtitle">
            {hasResult
              ? 'Download your transparent PNG, or start over with a different image.'
              : 'Drop a photo below and we’ll strip the background, returning a transparent PNG at full resolution.'}
          </p>
        </Reveal>

        <Reveal className="card rbg__card" delay={90}>
          {/* Errors sit above the workspace so they're never scrolled past. */}
          {error && (
            <div className="rbg__alert">
              <Alert
                variant="error"
                title="We hit a problem"
                onDismiss={() => setError('')}
              >
                {error}
              </Alert>
            </div>
          )}

          {status === 'idle' || !previewUrl ? (
            <Dropzone onFileSelected={handleFileSelected} />
          ) : (
            <>
              <div
                className={`rbg__panels ${hasResult ? 'rbg__panels--split' : ''}`}
              >
                <ImagePanel
                  src={previewUrl}
                  alt={`Uploaded image: ${file?.name || 'preview'}`}
                  label="Original"
                  meta={
                    file ? `${file.name} · ${formatSize(file.size)}` : undefined
                  }
                >
                  {/* Overlay lives on the original while we wait for the result. */}
                  {isProcessing && !hasResult && <Loader progress={progress} />}
                </ImagePanel>

                {hasResult && (
                  <div ref={resultRef} className="rbg__result">
                    <ImagePanel
                      src={resultUrl}
                      alt="Result: image with the background removed"
                      label="Background removed"
                      meta="Transparent PNG"
                      transparent
                    />
                    <span className="rbg__result-badge">
                      <IconCheck size={14} />
                      Done
                    </span>
                  </div>
                )}
              </div>

              <div className="rbg__actions">
                {!hasResult && (
                  <Button
                    size="lg"
                    onClick={handleRemoveBackground}
                    loading={isProcessing}
                    disabled={!file}
                    responsiveBlock
                    icon={<IconSparkles size={18} />}
                  >
                    {isProcessing ? 'Removing background…' : 'Remove background'}
                  </Button>
                )}

                {hasResult && (
                  <Button
                    size="lg"
                    href={resultUrl}
                    download={downloadName(file?.name)}
                    responsiveBlock
                    icon={<IconDownload size={18} />}
                  >
                    Download image
                  </Button>
                )}

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={handleReset}
                  disabled={isProcessing}
                  responsiveBlock
                  icon={hasResult ? <IconUpload size={18} /> : <IconRefresh size={18} />}
                >
                  Upload another image
                </Button>
              </div>
            </>
          )}
        </Reveal>

        <Reveal className="rbg__tips" delay={140}>
          {TIPS.map((tip) => (
            <p key={tip} className="rbg__tip">
              <IconCheck size={15} />
              {tip}
            </p>
          ))}
        </Reveal>

        {isMockMode && (
          <Reveal className="rbg__note" delay={180}>
            <p>
              Demo mode: <code>POST /remove-background</code> is being simulated,
              so the result mirrors your upload. Set{' '}
              <code>VITE_USE_MOCK_API=false</code> to call the real API.
            </p>
          </Reveal>
        )}
      </div>
    </section>
  )
}

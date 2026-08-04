import { useCallback, useRef, useState } from 'react'
import { ACCEPTED_TYPES, MAX_FILE_SIZE } from '../services/api'
import { IconImage, IconUpload } from './Icons'
import './Dropzone.css'

const ACCEPT_ATTR = ACCEPTED_TYPES.join(',')
const MAX_MB = Math.round(MAX_FILE_SIZE / (1024 * 1024))

/**
 * Drag & drop surface that doubles as a file picker.
 *
 * The whole card is a <button>, so keyboard and screen-reader users get the
 * picker without needing to drag anything; the hidden <input type="file">
 * does the actual selection.
 */
export default function Dropzone({ onFileSelected, disabled = false }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  // dragenter/dragleave fire for every child element the pointer crosses.
  // Counting them keeps the highlight stable instead of flickering.
  const dragDepth = useRef(0)

  const openPicker = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleFiles = useCallback(
    (fileList) => {
      const file = fileList?.[0]
      if (file) onFileSelected(file)
    },
    [onFileSelected]
  )

  const handleDragEnter = (event) => {
    event.preventDefault()
    if (disabled) return
    dragDepth.current += 1
    setDragging(true)
  }

  const handleDragOver = (event) => {
    // Without this the browser navigates to the dropped file.
    event.preventDefault()
    if (!disabled) event.dataTransfer.dropEffect = 'copy'
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    dragDepth.current = Math.max(0, dragDepth.current - 1)
    if (dragDepth.current === 0) setDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    if (disabled) return
    handleFiles(event.dataTransfer.files)
  }

  return (
    <div className="dropzone-wrap">
      <button
        type="button"
        className={`dropzone ${dragging ? 'dropzone--active' : ''}`}
        onClick={openPicker}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={disabled}
        aria-label="Upload an image: drag and drop a file here, or activate to browse"
      >
        <span className="dropzone__icon" aria-hidden="true">
          {dragging ? <IconImage size={30} /> : <IconUpload size={30} />}
        </span>

        <span className="dropzone__title">
          {dragging ? 'Drop to upload' : 'Drag & drop your image'}
        </span>

        <span className="dropzone__subtitle">
          or <span className="dropzone__browse">browse your files</span>
        </span>

        <span className="dropzone__meta">
          PNG, JPG or WEBP &middot; up to {MAX_MB} MB
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT_ATTR}
        onChange={(event) => {
          handleFiles(event.target.files)
          // Reset so picking the same file twice still fires onChange.
          event.target.value = ''
        }}
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  )
}

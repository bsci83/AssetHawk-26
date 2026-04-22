'use client'

import React, { memo, useCallback, useRef, useEffect, useState } from 'react'
import jsQR from 'jsqr'
import { Camera, X, Upload } from 'lucide-react'

interface LightweightScannerProps {
  onScanSuccess: (result: string) => void
  onScanError: (error: string) => void
}

const LightweightScanner = memo(({ onScanSuccess, onScanError }: LightweightScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const streamRef = useRef<MediaStream | undefined>(undefined)

  const [scanning, setScanning] = useState(false)
  const [manualInput, setManualInput] = useState('')
  const [showManualInput, setShowManualInput] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    setScanning(false)
    setHasPermission(null)
  }, [])

  const scanFrame = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current

    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationRef.current = requestAnimationFrame(scanFrame)
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      animationRef.current = requestAnimationFrame(scanFrame)
      return
    }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert"
    })

    if (code) {
      cleanup()
      onScanSuccess(code.data)
      return
    }

    animationRef.current = requestAnimationFrame(scanFrame)
  }, [cleanup, onScanSuccess])

  const startScanning = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })

      streamRef.current = stream
      setHasPermission(true)
      setScanning(true)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()

        videoRef.current.onloadedmetadata = () => {
          scanFrame()
        }
      }
    } catch (error) {
      console.error('Camera access error:', error)
      setHasPermission(false)
      onScanError('Camera access denied or not available')
    }
  }, [scanFrame, onScanError])

  const stopScanning = useCallback(() => {
    cleanup()
  }, [cleanup])

  const handleManualSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim())
      setManualInput('')
      setShowManualInput(false)
    }
  }, [manualInput, onScanSuccess])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      {!scanning ? (
        <div className="text-center">
          <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">QR Scanner</h2>
          <p className="text-gray-600 mb-6">
            Point your camera at a QR code to scan it automatically
          </p>

          {hasPermission === false && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 text-sm">
                Camera access denied. Use manual input below.
              </p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={startScanning}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-medium flex items-center space-x-2 mx-auto"
            >
              <Camera className="h-5 w-5" />
              <span>Start Camera</span>
            </button>

            <button
              onClick={() => setShowManualInput(!showManualInput)}
              className="text-gray-600 hover:text-gray-700 font-medium flex items-center space-x-2 mx-auto"
            >
              <Upload className="h-4 w-4" />
              <span>Manual Input</span>
            </button>
          </div>

          {showManualInput && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual QR Code Input</h3>
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Paste QR code data or URL here"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
                <button
                  type="submit"
                  disabled={!manualInput.trim()}
                  className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 disabled:opacity-50 font-medium"
                >
                  Process Input
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Scanning for QR Code...</h3>
            <button
              onClick={stopScanning}
              className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
            >
              <X className="h-4 w-4" />
              <span>Stop</span>
            </button>
          </div>

          <div className="relative">
            <video
              ref={videoRef}
              className="w-full rounded-lg"
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />

            <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none">
              <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-purple-500"></div>
              <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-purple-500"></div>
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-purple-500"></div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-purple-500"></div>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-4 text-sm">
            Position the QR code within the camera view
          </p>
        </div>
      )}
    </div>
  )
})

LightweightScanner.displayName = 'LightweightScanner'

export default LightweightScanner

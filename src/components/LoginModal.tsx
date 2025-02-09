'use client'
import { useEffect, useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import { handleGoogleLogin } from '@/utils/session'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  redirectPath?: string
}

export default function LoginModal({
  isOpen,
  onClose,
  redirectPath,
}: LoginModalProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isInstagram, setIsInstagram] = useState(false)

  useEffect(() => {
    // Detect Instagram browser
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsInstagram(userAgent.includes('instagram'))
  }, [])

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true)
        })
      })
    } else {
      setIsVisible(false)
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleCopyLink = () => {
    const currentUrl = window.location.href
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert('Link copied! Please open in another browser to login.')
      })
      .catch((err) => {
        console.error('Failed to copy link:', err)
      })
  }

  if (!isAnimating && !isOpen) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className={`relative w-full max-w-sm transform rounded-lg bg-zinc-900 p-6 shadow-xl transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-medium text-white">Login Required</h2>
        {isInstagram ? (
          <>
            <p className="mt-2 text-sm text-zinc-400">
              Instagram browser does not support Google login. Please copy the
              link and open it in another browser.
            </p>
            <div className="mt-4">
              <button
                onClick={handleCopyLink}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/75"
              >
                Copy Link
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-sm text-zinc-400">
              Please login to vote for this project
            </p>
            <div className="mt-4">
              <button
                onClick={() => handleGoogleLogin(redirectPath)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/75"
              >
                <FcGoogle className="h-5 w-5" />
                Sign in with Google
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'

export const useOnlineState = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await fetch('https://ping.kognise.dev/')
        setIsOnline(true)
      } catch (_) {
        setIsOnline(false)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return isOnline
}
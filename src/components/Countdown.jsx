import React, { useEffect, useState } from 'react'

function getTimeRemaining() {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setMinutes(60, 0, 0) // move to top of next hour
  const diff = nextHour - now
  const totalSeconds = Math.max(0, Math.floor(diff / 1000))
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return { minutes: String(m).padStart(2, '0'), seconds: String(s).padStart(2, '0') }
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeRemaining())

  useEffect(() => {
    const t = setInterval(() => setTime(getTimeRemaining()), 1000)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="text-4xl sm:text-5xl font-black tabular-nums">
      {time.minutes}:{time.seconds}
    </div>
  )
}

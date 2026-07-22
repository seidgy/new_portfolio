import { ref } from 'vue'

export const isSoundEnabled = ref(false)

let audioCtx: AudioContext | null = null

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume()
  }
  return audioCtx
}

export function playSound(type: 'hover' | 'click' | 'success') {
  if (!isSoundEnabled.value) return

  try {
    const ctx = getAudioContext()
    const now = ctx.currentTime

    const osc = ctx.createOscillator()
    const gainNode = ctx.createGain()

    osc.connect(gainNode)
    gainNode.connect(ctx.destination)

    if (type === 'hover') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1300, now) // very high pitch
      gainNode.gain.setValueAtTime(0.015, now) // quiet
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)
      osc.start(now)
      osc.stop(now + 0.03)
    } else if (type === 'click') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, now) // click tone
      gainNode.gain.setValueAtTime(0.04, now)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.05)
      osc.start(now)
      osc.stop(now + 0.05)
    } else if (type === 'success') {
      osc.type = 'sine'
      osc.frequency.setValueAtTime(900, now)
      osc.frequency.setValueAtTime(1350, now + 0.06)
      gainNode.gain.setValueAtTime(0.03, now)
      gainNode.gain.setValueAtTime(0.03, now + 0.06)
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
      osc.start(now)
      osc.stop(now + 0.18)
    }
  } catch (e) {
    console.warn('Web Audio API not supported or user interaction required:', e)
  }
}

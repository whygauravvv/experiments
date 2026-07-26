import { bind, play, setEnabled, type SoundName } from "cuelume"

const SOUND_PREFERENCE_KEY = "experiments-sound-enabled"

export function getSoundEnabled() {
  if (typeof window === "undefined") return true

  try {
    return window.localStorage.getItem(SOUND_PREFERENCE_KEY) !== "false"
  } catch {
    return true
  }
}

export function initializeSounds() {
  setEnabled(getSoundEnabled())
  bind()
}

export function updateSoundEnabled(enabled: boolean) {
  if (enabled) {
    setEnabled(true)
    play("toggle")
  } else {
    play("toggle")
    setEnabled(false)
  }

  try {
    window.localStorage.setItem(SOUND_PREFERENCE_KEY, String(enabled))
  } catch {
    // Sound still works when storage is unavailable.
  }
}

export function playSound(name: SoundName) {
  play(name)
}

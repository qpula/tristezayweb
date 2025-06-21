document.addEventListener("DOMContentLoaded", () => {
  // Audio player singleton
  const AudioPlayer = (() => {
    let instance
    let currentTrack = ""
    let isPlaying = false

    function createInstance() {
      const audio = new Audio()
      audio.loop = true

      return {
        play: (src) => {
          if (currentTrack === src && isPlaying) {
            return // Already playing this track
          }

          if (currentTrack !== src) {
            audio.src = src
            currentTrack = src
            // Save to localStorage
            localStorage.setItem("doorsMusicTrack", src)
          }

          audio.play()
          isPlaying = true
          localStorage.setItem("doorsMusicPlaying", "true")

          return currentTrack
        },
        pause: () => {
          audio.pause()
          isPlaying = false
          localStorage.setItem("doorsMusicPlaying", "false")
        },
        resume: () => {
          if (currentTrack) {
            audio.play()
            isPlaying = true
            localStorage.setItem("doorsMusicPlaying", "true")
          }
        },
        getCurrentTrack: () => currentTrack,
        isPlaying: () => isPlaying,
        setVolume: (volume) => {
          audio.volume = volume
        },
      }
    }

    return {
      getInstance: () => {
        if (!instance) {
          instance = createInstance()
        }
        return instance
      },
    }
  })()

  // Initialize player
  const player = AudioPlayer.getInstance()

  // Track name mapping
  const trackDetails = {
    "music1.mp3": "Apagá las pantallas de Las luces primeras",
    "music2.mp3": "Es sólo una ilusión de Gustavo Cerati",
    "music3.mp3": "Artificial de Peces raros",
  }

  // Check if music was playing before
  function initializeFromStorage() {
    const savedTrack = localStorage.getItem("doorsMusicTrack")
    const wasPlaying = localStorage.getItem("doorsMusicPlaying") === "true"

    if (savedTrack) {
      if (wasPlaying) {
        player.play(savedTrack)
        updateTrackDisplay(getTrackName(savedTrack))
        updatePlayButton(true)
      } else {
        // Load the track but don't play
        player.play(savedTrack)
        player.pause()
        updateTrackDisplay("Aparente silencio")
        updatePlayButton(false)
      }
    } else {
      updateTrackDisplay("Aparente silencio")
    }
  }

  // Get track name from path
  function getTrackName(path) {
    const filename = path.split("/").pop()
    return trackDetails[filename] || filename.replace(".mp3", "")
  }

  // Update track display
  function updateTrackDisplay(trackName) {
    const trackDisplay = document.getElementById("currentTrackName")
    if (trackName === "Aparente silencio") {
      trackDisplay.textContent = trackName
    } else {
      trackDisplay.textContent = `Escuchando --> ${trackName}`
    }
  }

  // Update play/pause button
  function updatePlayButton(isPlaying) {
    const button = document.getElementById("toggleAudio")
    if (isPlaying) {
      button.textContent = "Pause"
      button.classList.add("playing")
    } else {
      button.textContent = "Play"
      button.classList.remove("playing")
    }
  }

  // Set up image hover effects
  const musicImages = document.querySelectorAll(".music-image")
  musicImages.forEach((img) => {
    const hoverSrc = img.getAttribute("data-hover")
    const originalSrc = img.getAttribute("data-original")

    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc
    })

    img.addEventListener("mouseleave", () => {
      img.src = originalSrc
    })
  })

  // Set up music playback
  const musicContainers = document.querySelectorAll(".music-image-container")
  musicContainers.forEach((container) => {
    container.addEventListener("click", function () {
      const audioSrc = this.getAttribute("data-audio")
      const trackName = getTrackName(audioSrc)

      // Remove active class from all containers
      musicContainers.forEach((c) => c.classList.remove("active"))

      // Add active class to clicked container
      this.classList.add("active")

      // Play the track
      player.play(audioSrc)
      updateTrackDisplay(trackName)
      updatePlayButton(true)
    })
  })

  // Toggle play/pause
  const toggleButton = document.getElementById("toggleAudio")
  toggleButton.addEventListener("click", () => {
    if (player.isPlaying()) {
      player.pause()
      updateTrackDisplay("Aparente silencio")
      updatePlayButton(false)
    } else {
      player.resume()
      const currentTrack = player.getCurrentTrack()
      if (currentTrack) {
        updateTrackDisplay(getTrackName(currentTrack))
        updatePlayButton(true)
      }
    }
  })

  // Back door functionality
  const backDoor = document.getElementById("backDoor")
  backDoor.addEventListener("click", () => {
    window.location.href = "index2.html"
  })

  updateTrackDisplay("Aparente silencio")
  // Initialize from localStorage
  initializeFromStorage()
})

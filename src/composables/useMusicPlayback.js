import { computed } from 'vue'
import { usePlayerStore } from '@/stores/playerStore.js'
import { useQueueStore } from '@/stores/queueStore.js'

export function useMusicPlayback(tracksRef, toPlayerPayload) {
    const playerStore = usePlayerStore()
    const queueStore = useQueueStore()

    function isPlaying(trackId) {
        return playerStore.isCurrent(trackId)
    }

    function togglePlay(trackId) {
        if (playerStore.isCurrent(trackId)) {
            playerStore.togglePlay()
            return true
        }
        return false
    }

    function playTrack(track) {
        if (playerStore.isCurrent(track.id)) {
            playerStore.togglePlay()
            return
        }
        const tracks = tracksRef.value
        const allTracks = tracks.map(toPlayerPayload)
        const index = allTracks.findIndex(t => String(t.id) === String(track.id))
        if (index === -1) {
            playerStore.play(toPlayerPayload(track))
            return
        }
        queueStore.setQueue(allTracks, index)
        playerStore.play(allTracks[index])
    }

    function playAll(startIndex = 0) {
        const tracks = tracksRef.value
        if (!tracks || tracks.length === 0) return
        const allTracks = tracks.map(toPlayerPayload)
        queueStore.setQueue(allTracks, startIndex)
        playerStore.play(allTracks[startIndex])
    }

    const isPlayingAny = computed(() => playerStore.isVisible && playerStore.currentEpisode)

    return {
        isPlaying,
        togglePlay,
        playTrack,
        playAll,
        isPlayingAny
    }
}
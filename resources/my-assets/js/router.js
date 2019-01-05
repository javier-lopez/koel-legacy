import isMobile from 'ismobilejs'

import { loadMainView } from './utils'
import { artistStore, albumStore, songStore, queueStore, playlistStore, userStore } from './stores'
import { playback } from './services'

export default {
  routes: {
    '/home' () {
      loadMainView('home')
    },

    '/queue' () {
      loadMainView('queue')
    },

    '/songs' () {
      loadMainView('songs')
    },

    '/albums' () {
      loadMainView('albums')
    },

    '/album/(\\d+)' (id) {
      const album = albumStore.byId(~~id)
      if (album) {
        loadMainView('album', album)
      }
    },

    '/artists' () {
      loadMainView('artists')
    },

    '/artist/(\\d+)' (id) {
      const artist = artistStore.byId(~~id)
      if (artist) {
        loadMainView('artist', artist)
      }
    },

    '/favorites' () {
      loadMainView('favorites')
    },

    '/recently-played' () {
      loadMainView('recently-played')
    },

    '/playlist/(\\d+)' (id) {
      const playlist = playlistStore.byId(~~id)
      if (playlist) {
        loadMainView('playlist', playlist)
      }
    },

    '/settings' () {
      userStore.current.is_admin && loadMainView('settings')
    },

    '/users' () {
      userStore.current.is_admin && loadMainView('users')
    },

    '/profile' () {
      loadMainView('profile')
    },

    '/login' () {

    },

    '/song/([a-z0-9]{32})' (id) {
      const song = songStore.byId(id)
      if (!song) return

      if (isMobile.apple.device) {
        // Mobile Safari doesn't allow autoplay, so we just queue.
        queueStore.queue(song)
        loadMainView('queue')
      } else {
        playback.queueAndPlay(song)
      }
    },

    '/youtube' () {
      loadMainView('youtubePlayer')
    },

    '/visualizer' () {
      loadMainView('visualizer')
    }
  },

  init () {
    this.loadState()
    window.addEventListener('popstate', () => this.loadState(), true)
  },

  loadState () {
    if (!window.location.hash) {
      return this.go('home')
    }

    Object.keys(this.routes).forEach(route => {
      const matches = window.location.hash.match(new RegExp(`^#!${route}$`))
      if (matches) {
        const [, ...params] = matches
        this.routes[route](...params)
        return false
      }
    })
  },

  /**
   * Navigate to a (relative, hashed) path.
   *
   * @param  {String|Number} path
   */
  go (path) {
    if (window.__UNIT_TESTING__) {
      return
    }

    if (path instanceof Number) {
      window.history.go(path)
      return
    }

    if (path[0] !== '/') {
      path = `/${path}`
    }

    if (path.indexOf('/#!') !== 0) {
      path = `/#!${path}`
    }

    path = path.substring(1, path.length)
    document.location.href = `${document.location.origin}${document.location.pathname}${path}`
  }
}

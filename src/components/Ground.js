import L from 'leaflet'
import { withLeaflet, GridLayer } from 'react-leaflet'
import { toCanvas } from '../tiled'

var originalInitTile = L.GridLayer.prototype._initTile

const tileLayer = L.GridLayer.extend({
  createTile({ x,y,z }, done) {
    return toCanvas(z, [x,y], canvas => done(null, canvas))
  },

  // possible tile-based issues in the future; not immediately apparent
  // possible tile-based issues in the future; not immediately apparent
  // possible tile-based issues in the future; not immediately apparent
  _initTile(tile) {
    originalInitTile.call(this, tile)
    const {x,y}=this.getTileSize()
    tile.style.width = `${x+1}px`
    tile.style.height = `${y+1}px`
  }
})

class Ground extends GridLayer {
  createLeafletElement() {
    return new tileLayer()
  }
}

export default withLeaflet(Ground)

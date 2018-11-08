import L from 'leaflet'
import { withLeaflet, GridLayer } from 'react-leaflet'
import { toCanvas } from '../tiled'

const tileLayer = L.GridLayer.extend({
  createTile({ x,y,z }, done) {
    return toCanvas(z, [x,y], canvas => done(null, canvas))
  }
})

class Ground extends GridLayer {
  createLeafletElement() {
    return new tileLayer()
  }
}

export default withLeaflet(Ground)

import L from 'leaflet'
import { withLeaflet, GridLayer } from 'react-leaflet'

const getTileUrl = ({ x, y, z }) => {
  console.log(`${z}@${x},${y} => ../assets/maps/${z}/${x},${y}.png`)

  try {
    return require(`../assets/maps/${z}/${x},${y}.png`)
  } catch (_) {
    return
  }
}

const tileLayer = L.TileLayer.extend({getTileUrl: getTileUrl})

class Ground extends GridLayer {
  createLeafletElement() {
    return new tileLayer()
  }
}

export default withLeaflet(Ground)

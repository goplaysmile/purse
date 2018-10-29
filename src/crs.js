import L from 'leaflet'

const crs = L.Util.extend({}, L.CRS, {
  // scale: 1.5,
  projection: L.Projection.LonLat,
  transformation: new L.Transformation(1/8, 1/16, 1/8, 1/8)
})

const toLatLng = xy => [xy[1], xy[0]]

export default crs
export { toLatLng }

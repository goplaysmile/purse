import React from 'react'
import { renderToString } from 'react-dom/server'
import { divIcon } from 'leaflet'
import { Marker } from 'react-leaflet'

const DivIcon = ({ position, children }) => (
  <Marker
    position={position}
    icon={divIcon({iconSize: null, html: renderToString(children)})}
  />
)

export default DivIcon

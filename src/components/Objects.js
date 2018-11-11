import React from 'react'
import { toLatLng } from '../crs'
import DivIcon from './DivIcon'
import '../styles/Objects.css'

const Objects = () => (
  <DivIcon position={toLatLng([1,1])}>
    {/* <div className="Object">
      X Y Z
    </div> */}
  </DivIcon>
)

export default Objects

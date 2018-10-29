import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import { Map } from 'react-leaflet'
import crs, { toLatLng } from '../crs'
import Ground from './Ground'
import DivIcon from './DivIcon'
import spritesPng from '../assets/sprites/sprites0.png'
import '../styles/App.css'

class App extends Component {
  constructor() {
    super()

    this.animFrame = this.animFrame.bind(this)
    
    this.state = {}
  }
  
  componentDidMount() {
    // window.addEventListener('keydown', this.keyDown.bind(this), true)
    // window.addEventListener('keyup', this.keyUp.bind(this), true)

    if (!this.animFrameRef) {
      this.animFrameRef = window.requestAnimationFrame(this.animFrame)
    }
  }

  componentWillUnmount() {
    // window.removeEventListener('keydown', this.keyDown.bind(this), true)
    // window.removeEventListener('keyup', this.keyUp.bind(this), true)

    window.cancelAnimationFrame(this.animFrameRef)
  }

  animFrame(time) {
    /* fluid, real-time animations (not event-based) */

    this.animFrameRef = window.requestAnimationFrame(this.animFrame)
  }

  center = [0,0]
  
  render() {
    const { center } = this
    console.log(`window.devicePixelRatio ${window.devicePixelRatio}`)
    
    return (
      <Map
        center={toLatLng(center)}
        zoom={0}
        crs={crs}
        
        // keyboardPanDelta={0}
        // dragging={false}
        doubleClickZoom={false}
        scrollWheelZoom={false}
        touchZoom={false}
      >
        <Ground />

        <DivIcon
          position={toLatLng(center)}
        >
          <div className="me">
            <img src={spritesPng} alt="" />
          </div>
        </DivIcon>

      </Map>
    )
  }
}

export default App

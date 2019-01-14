import React, { Component } from 'react'
import { Map } from 'react-leaflet'

import Ground from './Ground'
// import Objects from './Objects'
import crs, { toLatLng } from '../crs'

import 'leaflet/dist/leaflet.css'
import '../styles/App.css'

const sprites = [...Array(24).keys()].map(i => require(`../assets/sprites/${i}.png`))

const frames = {
  'up':    [0,1,2,1],
  'right': [9,10,11,10],
  'down':  [3,4,5,4],
  'left':  [6,7,8,7]
}

const keyToLR = {
  'ArrowLeft': 'left',
  'ArrowRight': 'right'
}

const keyToUD = {
  'ArrowUp': 'up',
  'ArrowDown': 'down'
}

class App extends Component {
  state = {
    xy: [0,0],
    to: [null,null],
    spr: 1,
  }

  keyDown = e => {
    this.setState(({ to:[ lr, ud ], dir }) => {
      const newLR = keyToLR[e.key] || lr
      const newUD = keyToUD[e.key] || ud
  
      if (newLR === lr && newUD === ud) return

      return {
        to: [newLR, newUD],
        dir: newLR || newUD || dir
      }
    })
  }

  keyUp = e => {
    this.setState(({ to:[ lr, ud ], dir }) => {
      const newLR = keyToLR[e.key]
      const newUD = keyToUD[e.key]
  
      if (!newLR && !newUD) return

      return {
        to: [newLR? null : lr, newUD? null : ud],
        dir: ud || lr || dir
      }
    })
  }

  animFrame = time => {
    /* fluid, real-time animations (not event-based) */

    this.setState(({ xy:[ x, y ], to:[ lr, ud ], last375ms }) => {
      let state = {}
      
      if (Date.now() >= (last375ms||0)+375) {
        if (lr || ud) {
          state.xy = [
            lr === 'left'? x-1 : lr === 'right'? x+1 : x,
            ud === 'up'? y-1 : ud === 'down'? y+1 : y
          ]
          
          this.map.panTo(toLatLng(state.xy), {
            animate: true,
            duration: .75,
            easeLinearity: .75,
          })

          state.last375ms = Date.now()
        }
      }

      if (Object.keys(state).length) return state
    })

    this.animFrameRef = window.requestAnimationFrame(this.animFrame)
  }
  
  componentDidMount() {
    this.map = this.refs.map.leafletElement

    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)

    if (!this.animFrameRef) {
      this.animFrameRef = window.requestAnimationFrame(this.animFrame)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)

    window.cancelAnimationFrame(this.animFrameRef)
  }

  refreshIcons = () => {
    const { xy } = this.state
    const { x:px, y:py } = this.map.latLngToContainerPoint(toLatLng(xy))
    this.setState({ px, py })
  }
  
  render() {
    const { px, py, xy, to:[ lr, ud ], dir, spr } = this.state

    // console.log(`to ${[lr, ud]}`) /** causes animFrame lag */

    const frm = lr || ud || dir || 'down'
    
    const [ f0, f1, f2, f3 ] = frames[frm]

    const sprite = sprites[spr]
    
    return (
      <div className="Camera">
        <div className="Map">
          <Map
            ref="map"
            crs={crs}
            center={toLatLng([0,0])}
            duration={1}
            onMove={this.refreshIcons}
            
            keyboard={false}
            // dragging={false}
            
            zoom={0}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}

            onClick={e => {
              this.setState(({ spr }) => ({
                spr: (spr+1)%24
              }))
            }}
          >
            <Ground />
            {/* <Objects /> */}
          </Map>

          <div
            className="me"
            style={{
              left: `${px}px`,
              top: `${py}px`,
              width: `${32}px`,
              height: `${64}px`,
            }}
          >
            <img
              src={sprite} alt=""
              style={{ transform: `translateX(-${f3*32}px)` }}
            />
          </div>

        </div>
      </div>
    )
  }
}

export default App

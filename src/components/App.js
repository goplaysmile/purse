import React, { Component } from 'react'
import 'leaflet/dist/leaflet.css'
import { Map } from 'react-leaflet'
import crs, { toLatLng } from '../crs'
import Ground from './Ground'
import DivIcon from './DivIcon'
import spritesPng from '../assets/sprites/sprites0.png'
import '../styles/App.css'
import { toPng } from '../tiled'

console.log(`window.devicePixelRatio ${window.devicePixelRatio}`)

const msInDay = 86400000
const msInMin = 60000
const day = () => Date.now()/msInDay - Date.now()/msInDay%1
const min = () => Date.now()/msInMin - Date.now()/msInMin%1
const ms250 = t => (t || Date.now())/250 - (t || Date.now())/250%1

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
    spr: 0,
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

    this.setState(({ xy:[ x,y ], to:[ lr,ud ], last250ms }) => {
      let state = {}
      
      if (ms250() !== last250ms) {
        if (lr || ud) {
          state.xy = [
            lr === 'left'? x-1 : lr === 'right'? x+1 : x,
            ud === 'up'? y-1 : ud === 'down'? y+1 : y
          ]
          
          this.refs.map.leafletElement.panTo(toLatLng(state.xy), {
            animate: true,
            duration: .75,
            easeLinearity: .75,
          })

          state.last250ms = ms250()
        }
      }

      if (Object.keys(state).length) return state
    })

    this.animFrameRef = window.requestAnimationFrame(this.animFrame)
  }
  
  componentDidMount() {
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
  
  render() {
    const { xy, to:[ lr,ud ], dir, spr } = this.state

    console.log(`to ${[lr, ud]}`)

    const frm = lr || ud || dir || 'down'
    
    const [ f0, f1, f2, f3 ] = frames[frm]
    
    return (
      <Map
        ref="map"
        crs={crs}
        center={toLatLng([0,0])}
        duration={1}
        
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

        <DivIcon
          position={toLatLng(xy)}
        >
          <div
            className="me"
            style={{
              width: `${32}px`,
              height: `${64}px`,
            }}
          >
            <img
              src={spritesPng} alt=""
              style={{transform: `translate(-${f3*32}px,-${spr*64}px)`}}
            />
          </div>
          <div className="me-name">Alex<span><span>Lv.</span>10</span></div>
        </DivIcon>

      </Map>
    )
  }
}

export default App

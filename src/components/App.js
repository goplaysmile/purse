import React, { Component } from 'react'
import { Map } from 'react-leaflet'

import Ground from './Ground'
// import Objects from './Objects'

import signInDatabase from './Database'
import crs, { toLatLng } from '../crs'

import 'leaflet/dist/leaflet.css'
import '../styles/App.css'

const SignIn = signInDatabase('online')

const sprites = [...Array(24).keys()].map(i => require(`../assets/sprites/${i}.png`))

const frames = {
  'u' : [0,1,2,1],
  'r' : [9,10,11,10],
  'd' : [3,4,5,4],
  'l' : [6,7,8,7],
}

const keyToLR = {
  'ArrowLeft'  : 'l',
  'ArrowRight' : 'r',
}

const keyToUD = {
  'ArrowUp'   : 'u',
  'ArrowDown' : 'd',
}

class App extends Component {

  state = {
    to: [null, null],
  }

  keyDown = e => {
    const { dir, setMe } = this.getMe()

    this.setState(({ to: [lr, ud] }) => {
      const newLR = keyToLR[e.key] || lr
      const newUD = keyToUD[e.key] || ud
  
      if (newLR === lr && newUD === ud) return

      setMe({ dir: newLR||newUD||dir })

      return {to: [newLR, newUD]}
    })
  }

  keyUp = e => {
    const { dir, setMe } = this.getMe()
    
    this.setState(({ to: [lr, ud] }) => {
      const newLR = keyToLR[e.key]
      const newUD = keyToUD[e.key]
  
      if (!newLR && !newUD) return

      setMe({ dir: ud||lr||dir })

      return {to: [newLR? null : lr, newUD? null : ud]}
    })
  }

  animationFrame = time => {
    /* fluid, real-time animations (not event-based) */

    const { x, y, setMe } = this.getMe()

    this.setState(({ px, py, to: [lr, ud], last375ms }) => {
      let state = {}
      
      if (Date.now() >= (last375ms||0)+375) {
        if (lr || ud) {

          const dx = lr === 'l'? x-1 : lr === 'r'? x+1 : x
          const dy = ud === 'u'? y-1 : ud === 'd'? y+1 : y
          setMe({ x:dx, y:dy })
          
          this.map.panTo(toLatLng([dx,dy]), {
            animate       : true,
            duration      : .75,
            easeLinearity : .75,
          })

          state.last375ms = Date.now()
        }
      }

      const { dx, dy } = this.map.latLngToContainerPoint(toLatLng([x,y]))
      if (dx !== px || dy !== py) {
        state.px = dx
        state.py = dy
      }

      if (Object.keys(state).length) return state
    })

    this.animationFrameRef = window.requestAnimationFrame(this.animationFrame)
  }
  
  componentDidMount() {
    this.map = this.refs.map.leafletElement

    window.addEventListener('keydown', this.keyDown)
    window.addEventListener('keyup', this.keyUp)

    if (!this.animationFrameRef) {
      this.animationFrameRef = window.requestAnimationFrame(this.animationFrame)
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.keyDown)
    window.removeEventListener('keyup', this.keyUp)

    window.cancelAnimationFrame(this.animationFrameRef)
  }

  getMe = () => {
    const { uid, players } = this.props

    const [ me, setMe ] = (players||{})[uid]||[{}]
    const { x, y, spr, dir } = me||{}

    return {
      x   : x   || 0,
      y   : y   || 0,
      spr : spr || 0,
      dir : dir || 'd',
      setMe,
    }
  }

  render() {
    const { px, py, to: [lr, ud] } = this.state

    const { x, y, spr, dir } = this.getMe()

    const [,,, f3 ] = frames[lr || ud || dir]

    const sprite = sprites[spr]
    
    return (
      <div className="Camera">
        <div className="Map">
          <Map
            ref="map"
            crs={crs}
            center={toLatLng([0,0])}
            duration={1}

            keyboard={false}
            dragging={false}
            
            zoom={0}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}

            // onClick={e => {
            //   this.setState(({ spr }) => ({
            //     spr: (spr+1)%24
            //   }))
            // }}
          >
            <Ground />
            {/* <Objects /> */}
          </Map>

          <div
            className="me"
            style={{
              left   : `${px}px`,
              top    : `${py}px`,
              width  : `${32}px`,
              height : `${64}px`,
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

const Uid = ({ uid, connectDatabase }) => {

  const Me = connectDatabase(`players/${uid}`)

  return (
    <Me>
      <App />
    </Me>
  )
}

export default () => (
  <SignIn>
    <Uid />
  </SignIn>
)

import React, { Component } from 'react'
import { Map } from 'react-leaflet'

import Ground from './Ground'
// import Objects from './Objects'

import { signInDatabase, connectDatabase } from './Database'
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
    this.setState(({ to: [lr, ud] }) => {
      const dLR = keyToLR[e.key] || lr
      const dUD = keyToUD[e.key] || ud
  
      if (dLR === lr && dUD === ud) return

      return {to: [dLR, dUD]}
    })
  }

  keyUp = e => {
    this.setState(({ to: [lr, ud] }) => {
      const dLR = keyToLR[e.key]
      const dUD = keyToUD[e.key]
  
      if (!dLR && !dUD) return

      return {to: [ dLR?null:lr, dUD?null:ud ]}
    })
  }

  animationFrame = time => {
    const { uid } = this.props
    const { x, y, dir, setPosition } = this.getPlayer(uid)
    let pos = {}

    this.setState(({ px, py, to: [lr, ud], last375ms }) => {
      let state = {}
      
      if (Date.now() >= (last375ms||0)+375) {
        if (lr || ud) {

          pos.x = lr === 'l'?
            x-1
            : lr === 'r'?
              x+1
              : x
          pos.y = ud === 'u'?
            y-1
            : ud === 'd'?
              y+1
              : y
          pos.dir = lr||ud||dir
          
          // this.map.panTo(toLatLng([ pos.x, pos.y ]), {
          //   animate       : true,
          //   duration      : .75,
          //   easeLinearity : .75,
          // })

          state.last375ms = Date.now()
        }
      }

      const { x:dx, y:dy } = this.map.latLngToContainerPoint(toLatLng([ pos.x||x, pos.y||y ]))
      if (dx !== px || dy !== py) {
        state.px = dx
        state.py = dy
      }

      if (Object.keys(state).length) return state
    })
    
    if (Object.keys(pos).length) setPosition(pos)

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

  getPlayer = uid => {
    const { cosmetic, position } = this.props

    const [ cos, setCosmetic ] = (cosmetic||{})[uid]||[{}]
    const { spr } = cos||{}

    const [ pos, setPosition ] = (position||{})[uid]||[{}]
    const { x, y, dir } = pos||{}

    const { x:px, y:py } = this.map? this.map.latLngToContainerPoint(toLatLng([ x||0, y||0 ])) : {}
    
    return {
      x   : x   || 0,
      y   : y   || 0,
      spr : spr || 0,
      dir : dir || 'd',
      px  : px  || 0,
      py  : py  || 0,
      setCosmetic,
      setPosition,
    }
  }

  rotateSprite = () => {
    const { uid } = this.props
    const { spr, setCosmetic } = this.getPlayer(uid)

    setCosmetic({ spr: (spr+1)%24 })
  }

  render() {
    const { uid, online } = this.props
    const { x, y } = this.getPlayer(uid)
    
    return (
      <div className="Camera">
        <div className="Map">
          <Map
            ref="map"
            crs={crs}
            center={toLatLng([x,y])}
            duration={1}

            keyboard={false}
            dragging={false}
            
            zoom={0}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            touchZoom={false}
          >
            <Ground />
            {/* <Objects /> */}
          </Map>

          {
            Object.keys(online).map(id => {
              const { px, py, spr, dir } = this.getPlayer(id)
              const [,,, f3 ] = frames[dir]
              const sprite = sprites[spr]

              return (
                <div
                  key={id}
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
                    onClick={() => id === uid? this.rotateSprite() : null}
                  />
                </div>
              )
            })
          }

        </div>
      </div>
    )
  }
}

function Players(props) {
  let { online, unmounted } = props
  
  if (!online) return null

  unmounted = unmounted||{...online}
  const [ uid, ...uids ] = Object.keys(unmounted)
  delete unmounted[uid]

  const Costmetic = connectDatabase(`cosmetic/${uid}`)
  const Position  = connectDatabase(`position/${uid}`)
  
  return (
    <Costmetic {...props}>
      <Position>
        {uids.length? Players({ online, unmounted }) : <App />}
      </Position>
    </Costmetic>
  )
}

// const SignedIn = ({ uid, online }) => (
//   <SignIn>
//     <Players />
//   </SignIn>
// )

export default () => (
  <SignIn>
    <Players />
  </SignIn>
)

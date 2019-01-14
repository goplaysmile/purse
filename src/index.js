import React from 'react'
import ReactDOM from 'react-dom'

import App from './components/App'
import * as serviceWorker from './serviceWorker'

import './styles/index.css'

// function to64s() {
//   const img = new Image()
//   img.src = require('./assets/sprites/sheet.png')

//   img.onload = () => {
//     let cav = document.createElement('canvas')
//     cav.width = img.width
//     cav.height = 64

//     let ctx = cav.getContext('2d')
//     let y = 0

//     let loop = () => {
//       let tot = img.height/64

//       ctx.clearRect(0, 0, cav.width, cav.height)

//       for (let x in [...Array(12).keys()]) {
//         ctx.drawImage(img, x*32, y*64, 32, 64, x*32 , 0, 32, 64)
//       }

//       let link = document.createElement('a')
//       link.download = `${y}.png`
//       link.href = cav.toDataURL()
//       console.log(`downloading ${link.download}`)
//       link.click()
      
//       y++
//       if (y < tot) setTimeout(loop, 1500)
//     }

//     loop()
//   }
// }

// to64s()

ReactDOM.render(<App />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

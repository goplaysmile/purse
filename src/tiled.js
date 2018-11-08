const toCanvas = (map, [ x,y ], resolve) => {
  const img = new Image()
  img.src = require('./assets/tiles/0.png')

  const tiles = [
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
    [[4,42], [3,42], [2,42], [1,42], [1,42], [2,42], [3,42], [4,42]],
  ]

  const canvas = document.createElement("canvas")

  img.onload = () => {
    canvas.width = 256
    canvas.height = 256

    const ctx = canvas.getContext('2d')

    for (let y=0; y<8; y++) {
      for (let x=0; x<8; x++) {
        const [ tx,ty ] = tiles[y][x]
        ctx.drawImage(img, tx*32, ty*32, 32, 32, x*32, y*32, 32, 32)
      }
    }

    resolve(canvas)
  }
  
  return canvas
}

export { toCanvas }

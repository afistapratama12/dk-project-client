export const formatMoney = (number) => {
    const rev = (""+ number).split("").reverse().join("")
  
    let res  = ""
  
    for (let i = 1 ; i <= rev.length ; i++) {
      res += rev[i-1]
  
      if (i % 3 === 0 && i !== rev.length) {
        res += "."
      }
    }
  
    return res.split("").reverse().join("")
}

export const positionInd = (position) => {
  switch (position) {
    case 'left':
        return 'Kiri'
    case 'center':
        return 'Tengah'
    case 'right':
        return 'Kanan'
    default:
        return ""
  }
}
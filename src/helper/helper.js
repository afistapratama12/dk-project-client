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


export const getTotalMoney = (allData) => {
  let money = 0

  allData.forEach((d) => {
    money += d.money_balance
  })

  return ""+ money
}

export const getTotalRO = (allData) => {
  let ro = 0

  allData.forEach((d) => {
    ro += d.ro_money_balance
  })

  return ""+ ro
}

export const handleShowSend = (selectSend) => {
  if (selectSend.money) {
    return "Keuangan"
  }

  if (selectSend.ro) {
    return  "Repeat Order"
  }

  if (selectSend.sas) {
    return "SAS"
  }

  return ""
}

// params cat, inOrOut = "in" | "out"
export const getTotalBalanceInOut = (allData, cat, inOrOut) => {
  let total = 0
  
  if (cat === "ro") {
    allData.forEach(d => {
      if (inOrOut === "out" && d.to_id !== 1) {
        total += d.ro_balance
      }

      if (inOrOut === "in" && d.to_id === 1) {
        total += d.ro_balance
      }
    })

  } else if (cat === "sas") {
    allData.forEach(d => {
      if (inOrOut === "out" && d.to_id !== 1) {
        total += d.sas_balance
      }

      if (inOrOut === "in" && d.to_id === 1) {
        total += d.sas_balance
      }
    })
  }

  return total
}
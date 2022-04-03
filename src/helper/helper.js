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

export const formatBigMoney = (number) => {
  const moneyStr = "" + number

  if (moneyStr.length < 8) {
    return formatMoney(number)
  } else if (moneyStr.length === 8) {
    // ex : 10_000_000 => 10 juta | 10.200.00 => 10,2 juta  | 10.243.000 => 10,24 juta
    if (moneyStr[2] === "0" && moneyStr[3] === "0") {
      return moneyStr.slice(0,2) + " juta"
    } else if (moneyStr[3] === "0") {
        return moneyStr.slice(0,2) + "," + moneyStr[2] + " juta"
    } else {
        return moneyStr.slice(0,2) + "," + moneyStr.slice(2, 4) + " juta"
    }
  } else if (moneyStr.length === 9) {
    // ex : 100_000_000 => 100 juta | 10.200.00 => 100,2 juta  | 10.243.000 => 100,2 juta
    if (moneyStr[3] === "0" && moneyStr[4] === "0") {
        return moneyStr.slice(0,3) + " juta"
    } else {
          return moneyStr.slice(0,3) + "," + moneyStr[3] + " juta"
    }
  } else if (moneyStr.length === 10) {
    // ex: 1.000.000.000 -> 1 miliar, 1.200.000.000 => 1,2 miliar | 1.232.231.222 => 1,23 miliar
    if (moneyStr[1] === "0" && moneyStr[2] === "0") {
        return moneyStr[0] + " miliar"
    } else if (moneyStr[2] === "0") {
        return moneyStr[0] + "," + moneyStr[1] + " miliar"
    } else {
        return moneyStr[0] + "," + moneyStr.slice(1,3) + " miliar"
    }
  } else if (moneyStr.length === 11) {
    // ex: 10.000.000.000 -> 10 miliar, 10.200.000.000 => 10,2 miliar | 10.232.231.222 => 10,23 miliar
    if (moneyStr[2] === "0" && moneyStr[3] === "0") {
        return moneyStr.slice(0, 2) + " miliar"
    } else if (moneyStr[3] === "0") {
        return moneyStr.slice(0,2) + "," + moneyStr[2] + " miliar"
    } else {
        return moneyStr.slice(0,2) + "," + moneyStr.slice(2,4) + " miliar"
    }
  } else if (moneyStr.length === 12) {
    // ex: 100.000.000.000 -> 100 miliar, 100.200.000.000 => 100,2 miliar | 100.232.231.222 => 100,2 miliar
    if (moneyStr[3] === "0" && moneyStr[4] === "0") {
        return moneyStr.slice(0, 3) + " miliar"
    } else {
        return moneyStr.slice(0,3) + "," + moneyStr[3] + " miliar"
    }
  } else {
        return "1 triliun"
  }
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
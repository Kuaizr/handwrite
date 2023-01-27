const caculateTranslation = (points, a) => {
  let midx = 0
  let midy = 0

  for (let i = 0; i < points.length; i++) {
    if (i % 2 == 0) {
      midx += points[i]
    } else {
      midy += points[i]
    }
  }
  midx = 2 * midx / (points.length)
  midy = 2 * midy / (points.length)

  let result = []

  for (let i = 0; i < points.length; i += 2) {
    result.push((points[i] - midx) * Math.cos(a) - (points[i + 1] - midy) * Math.sin(a) + midx)
    result.push((points[i + 1] - midy) * Math.cos(a) + (points[i] - midx) * Math.sin(a) + midy)
  }
  return result
}


export const processText = (text) => {
  const checkNumsOrChars = (word) => {
    var re = new RegExp("[0-9a-zA-Z.]");  //判断字符串是否为数字和字母组合     //判断正整数 /^[1-9]+[0-9]*]*$/  
    if (!re.test(word)) {
      return false;
    } else {
      return true;
    }
  }
  let words = []
  let tempchar = ""
  for (let i = 0; i < text.length; i++) {
    if (checkNumsOrChars(text[i])) {
      tempchar += text[i]
    } else {
      if (tempchar != "") {
        words.push(tempchar)
        tempchar = ""
      }
      words.push(text[i])
    }
  }
  return words
}
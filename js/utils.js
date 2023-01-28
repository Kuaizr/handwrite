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

export const getStyle = (obj, attr) => {
  if (typeof getComputedStyle)
    return getComputedStyle(obj, null)[attr];
  else
    return obj.currentStyle[attr];
}

const getScrollTop = () => {
  var scrollPos;
  if (window.pageYOffset) {
    scrollPos = window.pageYOffset;
  }
  else if (document.compatMode && document.compatMode != 'BackCompat') { scrollPos = document.documentElement.scrollTop; }
  else if (document.body) { scrollPos = document.body.scrollTop; }
  return scrollPos;
}


export const processText = (text) => {
  console.log(text)

  let words = []
  let tempchar = ""
  for (let i = 0; i < text.length; i++) {
    words.push(text[i])
  }
  return words
}

export const createBound = (root) => {
  let width = getStyle(root,"width")
  let height = getStyle(root,"height")
  let topBound = document.createElement('div')
  topBound.className = "bound"
  topBound.style.width = width
  topBound.style.height = "4px"
  let buttomBound = document.createElement('div')
  buttomBound.className = "bound"
  buttomBound.style.width = width
  buttomBound.style.height = "4px"
  let leftBound = document.createElement('div')
  leftBound.className = "bound"
  leftBound.style.width = "4px"
  leftBound.style.height = height
  let rightBound = document.createElement('div')
  rightBound.className = "bound"
  rightBound.style.width = "4px"
  rightBound.style.height = height

  root.appendChild(topBound)
  root.appendChild(buttomBound)
  root.appendChild(leftBound)
  root.appendChild(rightBound)

  const showBound = () => {
    if (topBound.style.display && topBound.style.display == "none") {
      topBound.style.display = "block"
      buttomBound.style.display = "block"
      leftBound.style.display = "block"
      rightBound.style.display = "block"
    }else{
      topBound.style.display = "none"
      buttomBound.style.display = "none"
      leftBound.style.display = "none"
      rightBound.style.display = "none"
    }
  }
  return [topBound, buttomBound, leftBound, rightBound, showBound]
}

export const mouseBind = (element, callback) => {
  element.onmousedown = (e) => {

    let currentX = e.clientX
    var currentY = e.clientY

    // 鼠标移动，将鼠标位置给到element
    document.onmousemove = (e) => {
      e = e || window.event
      var x = e.clientX - parseInt(getStyle(element.parentNode, "left").replace("px", ""))
      var y = e.clientY - parseInt(getStyle(element.parentNode, "top").replace("px", "")) + getScrollTop()
      x = x > 0 ? x : 0
      y = y > 0 ? y : 0
      if (x > parseInt(getStyle(element.parentNode, "width").replace("px", ""))) {
        x = parseInt(getStyle(element.parentNode, "width").replace("px", ""))
      }
      if (y > parseInt(getStyle(element.parentNode, "height").replace("px", ""))) {
        y = parseInt(getStyle(element.parentNode, "height").replace("px", ""))
      }
      callback(x, y)
    }
  }
  // 鼠标松开
  document.onmouseup = () => {
    document.onmousemove = null
  }

}
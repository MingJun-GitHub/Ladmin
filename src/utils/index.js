const flat2tree = (flatLs) => {
  let tree = []
  const main = flatLs => {
    flatLs.forEach(item => {
      if (item.pid === 0) {
        tree.push(item)
      } else {
        let index = flatLs.findIndex(item1 => item1.id === item.pid)
        if (index !== -1) {
          flatLs[index].children = flatLs[index].children || []
          flatLs[index].children.push(item)
        }
      }
    })
    return flatLs.filter(item => item.pid === 0)
  }
  main(flatLs)
  return tree
}

const saveTextFile = (() => {
  const a = document.createElement('a')
  a.style.display = 'none'
  document.body.appendChild(a)
  return (data, name) => {
    const blob = new Blob(data, {type: 'text/plain;charset=UTF-8'}),
      url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = name
    a.click()
    window.URL.revokeObjectURL(url)
  }
})()

export {
  saveTextFile,
  flat2tree
}

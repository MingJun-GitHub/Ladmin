const Mock = require('mockjs')

const api = [
  ...require('./modules/article')
]

module.exports = app => {
  api.forEach(item => {
    app[item.type](item.url, (rep, res) => {
      res.json(Mock.mock(item.data instanceof Function ? item.data(rep, res) : item.data))
    })
  }
  )
}

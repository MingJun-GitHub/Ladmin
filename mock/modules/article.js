module.exports = [
  {
    url: '/api/article/catalogue',
    type: 'get',
    data: {
      'code': 0,
      'msg': '',
      'data': {
        'list|6': [{
          'title': '@ctitle(5,15)',
          'code': '@string("lower",16)',
          'hits': '@integer(60,100)',
          'commentCount': '@integer(1,100)',
          'voteCount': '@integer(1,100)'
        }]
      }
    }
  },
  {
    url: '/api/article/uploadImg',
    type: 'post',
    data() {
      return {
        'code': 0,
        'msg': '已发送到后台',
        'url': 'http://localhost:8888/static/head/head2.gif'
      }
    }
  },
  {
    url: '/api/article',
    type: 'post',
    data(rep, res) {
      console.log(rep, res)

      return {
        'code': 0,
        'msg': '已发送到后台'
      }
    }
  }
]

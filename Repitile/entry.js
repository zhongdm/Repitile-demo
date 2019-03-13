const superagent = require('superagent')
const charset = require('superagent-charset')
charset(superagent)
const cheerio = require('cheerio')
const express = require('express')
const app = express()
const fs = require('fs')
const http = require('http')
const https = require('https')

const baseURL = 'https://book.qidian.com/info/1013822635#Catalog'

const port = 3000
// const hostname = 'localhost'

app.get('/', (req, res) => {
  // 设置头部信息
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  // 发起请求
  superagent
    .get(baseURL)
    .charset()
    .then(async (sres) => {
      let $ = cheerio.load(sres.text)
      let items = []
      $('.volume-wrap .volume .cf li').each((index, element) => {
        let $aEl = $(element).find('a')
        items.push({
          'title': $aEl.text(),
          'link': 'https:' + $aEl.attr('href')
        })
      })
      
      for (let i = 0, len = items.length; i < len; i++) {
        const content = await getChapterContentByLink(items[i].link)
        items[i].content = content
      }
      await writeToFile('Repitile/mine.json', items)
      res.json({'code': 200, items})
    })
    .catch (err => {
      console.log('Err msg is: ' + err)
      res.json({'code': 400, 'msg': err})
    })
})

async function getChapterContentByLink (link) {
  const res = await superagent.get(link).charset()
  let $ = cheerio.load(res.text)
  let content = ''
  $('.read-content').each((index, element) => {
    // console.log($(element).text())
    content += $(element).text()
  })
  return content
}

function writeToFile (file, datas) {
  fs.open(file, 'w+', (err) => {
    if (!err) {
      for (let j = 0, len = datas.length; j < len; j++) {
        fs.appendFile(file, datas[j].title + '\r\n' + datas[j].content, (err) => {

        })
      }
    }
  })

  fs.close()
}
const server = app.listen(port, () => {
  const port = server.address().port
  const hostname = server.address().address
  console.log(`应用启动成功，访问地址是http://${hostname}:${port}`)
})
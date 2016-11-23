const express = require('express')
const app = express()
const path = require('path')
const formidable = require('formidable')
const fs = require('fs')
const glob = require('glob')
const favicon = require('serve-favicon')

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'img', 'idm.ico')))

app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'views/index.html'));
})

app.get('/check', function(req, res){
  let size = {}
  files = glob.sync('uploads/**.**')
  files.map((file)=>{
    size[file.substring(8)] = fs.statSync(file)['size']
  })
  res.json(size)
});

app.get('/download/:file', function(req, res){
  res.download(path.join(__dirname, 'uploads', req.params.file))
})

app.post('/upload', function(req, res){

  let form = new formidable.IncomingForm()

  form.multiples = true

  form.uploadDir = path.join(__dirname, '/uploads')

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name))
  })

  form.on('error', function(err) {
    console.log('An error has occured: \n' + err)
  })

  form.on('end', function() {
    res.end('success')
  })

  form.parse(req)

});

var server = app.listen(3000, function(){
  console.log('Server running on port 3000')
})

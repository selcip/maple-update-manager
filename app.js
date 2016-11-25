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

  switch(req.params.file){
    case 'Map.wz':
      res.redirect('https://www.dropbox.com/s/tt7vmob1ydbyj86/Map.wz?dl=1')
      break;
    case 'Character.wz':
      res.redirect('https://www.dropbox.com/s/rpnpcm5w57oxus3/Character.wz?dl=1')
      break;
    case 'Mob.wz':
      res.redirect('https://www.dropbox.com/s/1g591kgislm1q6i/Mob.wz?dl=1')
      break;
    case 'Sound.wz':
      res.redirect('https://www.dropbox.com/s/t27lfij5zpkce1p/Sound.wz?dl=1')
      break;
    case 'Item.wz':
      res.redirect('https://www.dropbox.com/s/3ib2o9adxdd3qb9/Item.wz?dl=1')
      break;
    case 'UI.wz':
      res.redirect('https://www.dropbox.com/s/90lmbg53uhsyjql/UI.wz?dl=1')
      break;
    default:
      res.download(path.join(__dirname, 'uploads', req.params.file))
      break;
}

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

var server = app.listen(80, function(){
  console.log('Server running on port 3000')
})

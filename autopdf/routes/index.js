var fs = require('fs')
  , _ = require('lodash')
  , path = require('path')
/*
 * GET home page.
 */

exports.index = function(req, res){
  eachCompany(function(err, content) {
    res.render('index', { title: 'WELCOME TO AUTO_PDF_SERV_BOT', companies:content });
  })
};

// iterate through 'company' directories
function eachCompany(cb) {
  fs.readdir(__dirname+'/../public/pdf/', function(err, folders) {
    cb(null, folders)
  })
}

exports.getPDFs = function(req, res) {
  var company = req.body.company
  fs.readdir(__dirname+'/../public/pdfs/'+company+'/', function(err, pdfs) {
    res.send(pdfs)
  })
}

exports.getPdfList = function(req, res) {
  var good = []
  var company = req.params.company
  fs.readdir(__dirname+'/../public/pdf/'+company+'/', function(err, pdfs) {
    pdfs.forEach(function(pdf) {
      if(path.extname(pdf) === '.pdf' || path.extname(pdf) === '.PDF' || path.extname(pdf) === '.Pdf') {
        good.push(pdf)
      }
    })
    res.render('pdfList', {title: company+"'s PDFs", pdfs:good, company:company})
  })
}

exports.newOrg = function(req, res) {
  var name = req.body.name
  fs.mkdir(__dirname+'/../public/pdf/'+name, function(err) {
    res.redirect('/')
  })
}

exports.upload = function(req, res) {
  var file = req.files.toAdd
  console.log(req.params.company)
  fs.readFile(file.path, function(err, data) {
    if(err){console.log(err)}
    var newPath = __dirname+'/../public/pdf/'+req.params.company+'/'+file.name
    fs.writeFile(newPath, data, function(err) {
      if(err){console.log(err)}
      res.redirect('back')
    })
  })
}
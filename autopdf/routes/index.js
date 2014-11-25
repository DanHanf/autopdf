var fs = require('fs')
  , _ = require('lodash')
/*
 * GET home page.
 */

exports.index = function(req, res){
  eachCompany(function(err, content) {
    console.log(content)
    res.render('index', { title: 'Express', companies:content });
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
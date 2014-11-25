function getPDFs(company) {
  $.get('/getPDFs', {company:company}, function(res) {
    console.log(res)
  })
}

$(window).load(function() {
  //console.log(companies)
  //getPDFs
})

function newOrg() {
  var name = document.getElementById('name').value
  if(name === '') {
    alert('you gotta actually type something here')
  }
  else {
    $.post('/newOrg', {name:name}, function() {
      document.location.reload()
    })
  }
}

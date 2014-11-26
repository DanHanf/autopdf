
function newOrg() {
  var name = document.getElementById('name').value
  if(name === '') {
    alert('you gotta actually type something here')
  }
  else {
    console.log('nice')
    $.post('/newOrg', {name:name})
  }
}

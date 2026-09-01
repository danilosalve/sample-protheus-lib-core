function(codeType, content) {
  if (codeType == 'checkBalance') {
    this.eventTarget.send(codeType, content);
  } else if (codeType == 'setParam') {
    sessionStorage.setItem('param', content);
  } else if (codeType == 'setDateFormat') {
    this.eventTarget.send(codeType, content);
  } else if (codeType == 'mensagemProtheus') {
    alert('Mensagem recebida do Protheus: ' + content);
  }
}

function(codeType, content) {
  if (codeType == 'setParam') {
    sessionStorage.setItem('param', content);
  } else if (codeType == 'mensagemProtheus') {
    alert('Mensagem recebida do Protheus: ' + content);
  } else {
    this.eventTarget.send(codeType, content);
  }
}

#include "protheus.ch"

//------------------------------------------------------------------------------
/*/{Protheus.doc} sampleapp
Executa o App da demonstração do Universo.
@type function
@version 1.0
@author TOTVS
@since 07/04/2025
/*/
//------------------------------------------------------------------------------
user function sampleapp()
	FwCallApp("sample-protheus-lib-core")
return

//------------------------------------------------------------------------------
/*/{Protheus.doc} JsToAdvpl
Envia os comandos para o frontend de acordo com o tipo da chamada enviada pelo mesmo
@type function
@version 1.0
@author TOTVS
@since 07/04/2025
@param oWebChannel, object, objeto com o socket aberto para comunicação
@param cType, character, tipo/identificador para a chamadac
@param cContent, character, conteúdo da chamada
/*/
//------------------------------------------------------------------------------
static function JsToAdvpl(oWebChannel as object,cType as character,cContent as character)
    if cType == 'checkBalance'
        oWebChannel:AdvPLToJS('checkBalance', cValToChar(MostrarSaldo(cContent)))
	elseIf cType == 'getParam'
		oWebChannel:AdvPLToJS('setParam', SuperGetMv(cContent))
    endIf
return

//------------------------------------------------------------------------------
/*/{Protheus.doc} MostrarSaldo
Realiza a chamada do cálculo de saldo para determinado produto.
@type function
@version 1.0
@author TOTVS
@since 07/04/2025
@param cProduto, character, código produto
@return numeric, Saldo do produto
/*/
//------------------------------------------------------------------------------
static function MostrarSaldo(cProduto) as numeric
	local nSaldo := 0
	local aArea := GetArea()
	local aAreaSB2 := SB2->(GetArea())

	SB2->(dbSetOrder(1))
	if SB2->(dbSeek(xFilial("SB2") + cProduto))
		nSaldo := SaldoSB2()
	endIf

	RestArea(aAreaSB2)
	RestArea(aArea)
return nSaldo

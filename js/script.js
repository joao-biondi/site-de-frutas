
let modalKey = 0
let quantfrutas = 1
let cart = [] 


const seleciona = (elemento) => document.querySelector(elemento)
const selecionaTodos = (elemento) => document.querySelectorAll(elemento)

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}

const abrirModal = () => {
    seleciona('.frutaWindowArea').style.opacity = 0
    seleciona('.frutaWindowArea').style.display = 'flex'
    setTimeout(() => seleciona('.frutaWindowArea').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.frutaWindowArea').style.opacity = 0 // transparente
    setTimeout(() => seleciona('.frutaWindowArea').style.display = 'none', 500)
}

const botoesFechar = () => {

    selecionaTodos('.frutaInfo--cancelButton, .frutaInfo--cancelMobileButton').forEach( (item) => item.addEventListener('click', fecharModal) )
}

const preencheDadosDasfrutas = (frutaItem, item, index) => {
	frutaItem.setAttribute('data-key', index)
    frutaItem.querySelector('.fruta-item--img img').src = item.img
    frutaItem.querySelector('.fruta-item--price').innerHTML = formatoReal(item.price[0])
    frutaItem.querySelector('.fruta-item--name').innerHTML = item.name
    frutaItem.querySelector('.fruta-item--desc').innerHTML = item.description
}

const preencheDadosModal = (item) => {
    seleciona('.frutaBig img').src = item.img
    seleciona('.frutaInfo h1').innerHTML = item.name
    seleciona('.frutaInfo--desc').innerHTML = item.description
    seleciona('.frutaInfo--actualPrice').innerHTML = formatoReal(item.price[0])
}

const pegarKey = (e) => {
    // .closest retorna o elemento mais proximo que tem a class que passamos
    // do .fruta-item ele vai pegar o valor do atributo data-key
    let key = e.target.closest('.fruta-item').getAttribute('data-key')
    console.log('fruta clicada ' + key)
    console.log(frutaJson[key])

    // garantir que a quantidade inicial de frutas é 1
    quantfrutas = 1

    // Para manter a informação de qual fruta foi clicada
    modalKey = key

    return key
}

const mudarQuantidade = () => {
    // Ações nos botões + e - da janela modal
    seleciona('.frutaInfo--qtmais').addEventListener('click', () => {
        quantfrutas++
        seleciona('.frutaInfo--qt').innerHTML = quantfrutas
    })

    seleciona('.frutaInfo--qtmenos').addEventListener('click', () => {
        if(quantfrutas > 1) {
            quantfrutas--
            seleciona('.frutaInfo--qt').innerHTML = quantfrutas	
        }
    })
}

const adicionarNoCarrinho = () => {
    seleciona('.frutaInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        // pegar dados da janela modal atual
    	// qual fruta? pegue o modalKey para usar frutaJson[modalKey]
    	console.log("fruta " + modalKey)

	    // quantidade
    	console.log("Quant. " + quantfrutas)
        // preco
        let price = seleciona('.frutaInfo--actualPrice').innerHTML.replace('R$&nbsp;', '')
    
        // crie um identificador que junte id e tamanho
	    // concatene as duas informacoes separadas por um símbolo, vc escolhe
	    let identificador = frutaJson[modalKey].id+'t'

        // antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador )
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantfrutas
        } else {
            // adicionar objeto fruta no carrinho
            let fruta = {
                identificador,
                id: frutaJson[modalKey].id,
                qt: quantfrutas,
                price: parseFloat(price) // price: price
            }
            cart.push(fruta)
            console.log(fruta)
            console.log('Sub total R$ ' + (fruta.qt * fruta.price).toFixed(2))
        }

        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}

const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho ' + cart.length)
    if(cart.length > 0) {
        // mostrar o carrinho
	    seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex' // mostrar barra superior
    }

    // exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

const fecharCarrinho = () => {
    // fechar o carrinho com o botão X no modo mobile
    seleciona('.menu-closer').addEventListener('click', () => {
        seleciona('aside').style.left = '100vw' // usando 100vw ele ficara fora da tela
        seleciona('header').style.display = 'flex'
    })
}

const atualizarCarrinho = () => {
    // exibir número de itens no carrinho
	seleciona('.menu-openner span').innerHTML = cart.length
	
	// mostrar ou nao o carrinho
	if(cart.length > 0) {

		// mostrar o carrinho
		seleciona('aside').classList.add('show')

		// zerar meu .cart para nao fazer insercoes duplicadas
		seleciona('.cart').innerHTML = ''

        // crie as variaveis antes do for
		let subtotal = 0
		let desconto = 0
		let total    = 0

        // para preencher os itens do carrinho, calcular subtotal
		for(let i in cart) {
			// use o find para pegar o item por id
			let frutaItem = frutaJson.find( (item) => item.id == cart[i].id )
			console.log(frutaItem)

            // em cada item pegar o subtotal
        	subtotal += cart[i].price * cart[i].qt
            //console.log(cart[i].price)

			// fazer o clone, exibir na telas e depois preencher as informacoes
			let cartItem = seleciona('.models .cart--item').cloneNode(true)
			seleciona('.cart').append(cartItem)

			let frutaSizeName = cart[i].size

			let frutaName = `${frutaItem.name} (${frutaSizeName})`

			// preencher as informacoes
			cartItem.querySelector('img').src = frutaItem.img
			cartItem.querySelector('.cart--item-nome').innerHTML = frutaName
			cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

			// selecionar botoes + e -
			cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
				console.log('Clicou no botão mais')
				// adicionar apenas a quantidade que esta neste contexto
				cart[i].qt++
				// atualizar a quantidade
				atualizarCarrinho()
			})

			cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
				console.log('Clicou no botão menos')
				if(cart[i].qt > 1) {
					// subtrair apenas a quantidade que esta neste contexto
					cart[i].qt--
				} else {
					// remover se for zero
					cart.splice(i, 1)
				}

                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

				// atualizar a quantidade
				atualizarCarrinho()
			})

			seleciona('.cart').append(cartItem)

		} // fim do for

		// fora do for
		// calcule desconto 10% e total
		//desconto = subtotal * 0.1
		desconto = subtotal * 0
		total = subtotal - desconto

		// exibir na tela os resultados
		// selecionar o ultimo span do elemento
		seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
		seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
		seleciona('.total span:last-child').innerHTML    = formatoReal(total)

	} else {
		// ocultar o carrinho
		seleciona('aside').classList.remove('show')
		seleciona('aside').style.left = '100vw'
	}
}

const finalizarCompra = () => {
    seleciona('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        seleciona('aside').classList.remove('show')
        seleciona('aside').style.left = '100vw'
        seleciona('header').style.display = 'flex'
    })
}




frutaJson.map((item, index ) => {
    //console.log(item)
    let frutaItem = document.querySelector('.models .fruta-item').cloneNode(true)
    //console.log(frutaItem)
    //document.querySelector('.fruta-area').append(frutaItem)
    seleciona('.fruta-area').append(frutaItem)

    // preencher os dados de cada fruta
    preencheDadosDasfrutas(frutaItem, item, index)
    
    // fruta clicada
    frutaItem.querySelector('.fruta-item a').addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Clicou na fruta')

       
        let chave = pegarKey(e)
        

        // abrir janela modal
        abrirModal()

        // preenchimento dos dados
        preencheDadosModal(item)

       
        // pegar tamanho selecionado
        preencherTamanhos(chave)

		// definir quantidade inicial como 1
		seleciona('.frutaInfo--qt').innerHTML = quantfrutas

        // selecionar o tamanho e preco com o clique no botao
        escolherTamanhoPreco(chave)
        

    })

    botoesFechar()

}) 


mudarQuantidade()



adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()


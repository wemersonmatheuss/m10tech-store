// ========== MENU MOBILE NAV ========== 
// Mostra/esconde o menu mobile ao clicar no ícone do menu hamburguer
document.addEventListener('DOMContentLoaded', function() {
  // Seleciona a div.mobile
  const mobileMenu = document.querySelector('.mobile');
  if (!mobileMenu) return;
  // Seleciona ícones do menu hamburguer e do X
  const menuIcon = mobileMenu.querySelector('.menu-hamburguer');
  const closeIcon = mobileMenu.querySelector('.menu-close');
  // Seleciona a navegação dentro do mobile
  const navMobile = mobileMenu.querySelector('.navigation');
  if (!menuIcon || !closeIcon || !navMobile) return;

  // Função para abrir o menu mobile
  function openMobileMenu() {
    navMobile.classList.add('open');
    menuIcon.style.display = 'none';
    closeIcon.style.display = 'block';
  }
  // Função para fechar o menu mobile
  function closeMobileMenu() {
    navMobile.classList.remove('open');
    menuIcon.style.display = 'block';
    closeIcon.style.display = 'none';
  }

  // Ao clicar no ícone do menu hamburguer, abre o menu
  menuIcon.addEventListener('click', function() {
    openMobileMenu();
  });
  // Ao clicar no ícone de X, fecha o menu
  closeIcon.addEventListener('click', function() {
    closeMobileMenu();
  });

  // Fecha o menu mobile ao clicar fora dele
  document.addEventListener('click', function(e) {
    if (!mobileMenu.contains(e.target) && navMobile.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // Fecha o menu ao clicar em qualquer link ou botão dentro do menu
  navMobile.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', function() {
      closeMobileMenu();
    });
  });
});
// Botão do nav: Entre em Contato abre WhatsApp com mensagem padrão
document.querySelectorAll('nav .button button').forEach(btn => {
    btn.addEventListener('click', function(e) {
        // WhatsApp do cliente
        const numero = '12991548197';
        const mensagem = 'Olá, quero mais informações sobre os produtos';
        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    });
});
// Seleciona o container dos banners
const bannerContainer = document.querySelector('.banner');
// Seleciona todas as imagens dentro do banner
const banners = bannerContainer ? bannerContainer.querySelectorAll('img') : [];
// Inicializa o índice do banner atual
let currentBanner = 0;

// Função para mostrar apenas o banner atual com animação
function showBanner(index) {
    banners.forEach((img, i) => {
        // Remove a classe 'active' de todos
        img.classList.remove('active');
    });
    // Adiciona a classe 'active' apenas ao banner atual
    banners[index].classList.add('active');
}

// Mostra o primeiro banner ao carregar a página
if (banners.length > 0) {
    showBanner(currentBanner);
    // Define o intervalo para trocar de banner a cada 5 segundos (5000 ms)
    setInterval(() => {
        // Atualiza o índice do banner atual
        currentBanner = (currentBanner + 1) % banners.length;
        // Mostra o próximo banner com efeito
        showBanner(currentBanner);
    }, 5000);
}
// Fim do script de rotação automática de banners com animação



// ================= CARRINHO DE COMPRAS =====================
// Carrinho armazenado em localStorage para persistência
const STORAGE_KEY = 'm10tech_carrinho';
let carrinho = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// Função para formatar valor para BRL
function formatarValor(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// Função para atualizar o carrinho na página do carrinho e badge
function atualizarCarrinhoHTML() {
    // Atualiza badge do carrinho em todas as páginas
    const badge = document.getElementById('badge-carrinho');
    if (badge) {
        if (carrinho.length > 0) {
            badge.textContent = carrinho.length;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }

    // Atualiza lista de itens e total na página do carrinho
    const lista = document.getElementById('itnsCarrinho');
    const totalSpan = document.getElementById('totalCarrinho');
    if (!lista || !totalSpan) return;
    lista.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, idx) => {
        total += item.valor;
        const div = document.createElement('div');
        div.className = 'item-carrinho';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.gap = '12px';
        // Renderiza descrição de forma mais legível
        let descHtml = '';
        if (item.descricao) {
            descHtml = item.descricao.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        }
        div.innerHTML = `
            <img src="${item.img}" alt="${item.modelo}" style="width:70px;height:70px;object-fit:cover;border-radius:8px;">
            <div style="font-size:15px;flex:1;">
                <strong>${item.modelo}</strong><br>
                ${descHtml ? descHtml + '<br>' : ''}
                Cor: ${item.cor}<br>
                Valor: ${formatarValor(item.valor)}
            </div>
            <button class="btn-remove-carrinho" data-idx="${idx}" title="Remover do carrinho" style="background:none;border:none;cursor:pointer;padding:8px;display:flex;align-items:center;justify-content:center;">
                <img src="./assets/lixeira-de-reciclagem 1.svg" alt="Remover" style="width:28px;height:28px;object-fit:contain;">
            </button>
        `;
        lista.appendChild(div);
    });
    totalSpan.textContent = formatarValor(total);

    // Adiciona evento para remover item
    document.querySelectorAll('.btn-remove-carrinho').forEach(btn => {
        btn.addEventListener('click', function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            if (!isNaN(idx)) {
                carrinho.splice(idx, 1);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
                atualizarCarrinhoHTML();
            }
        });
    });
}

// Função para adicionar item ao carrinho
function adicionarAoCarrinho(produto) {
    carrinho.push(produto);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho));
    // Atualiza carrinho se estiver na página do carrinho
    atualizarCarrinhoHTML();
    alert('Produto adicionado ao carrinho!');
}

// Função para extrair informações do produto ao clicar em comprar
function obterInfoProduto(btn) {
    const product = btn.closest('.product');
    if (!product) return;
    const img = product.querySelector('.image img');
    // Pega todos os textos da descrição
    const descPs = product.querySelectorAll('.description p');
    let descricao = '';
    descPs.forEach(p => {
        descricao += p.outerHTML + ' ';
    });
    // Modelo (primeiro p)
    const modelo = descPs[0]?.textContent.replace('Modelo:', '').trim() || 'Produto';
    const corSelect = product.querySelector('.color select');
    const cor = corSelect ? corSelect.value || corSelect.options[corSelect.selectedIndex].text : 'Não selecionada';
    const valorText = product.querySelector('.price h3')?.textContent.replace(/[^\d,]/g, '').replace(',', '.') || '0';
    const valor = parseFloat(valorText);
    return {
        img: img ? img.src : '',
        modelo,
        descricao,
        cor,
        valor: isNaN(valor) ? 0 : valor
    };
}

// Adiciona evento a todos os botões de comprar
document.querySelectorAll('.product .button button').forEach(btn => {
    btn.addEventListener('click', function() {
        const produto = obterInfoProduto(this);
        if (!produto.cor || produto.cor.toLowerCase().includes('selecione')) {
            alert('Selecione uma cor antes de adicionar ao carrinho!');
            return;
        }
        adicionarAoCarrinho(produto);
        atualizarCarrinhoHTML(); // Atualiza badge imediatamente
    });
});

// Atualiza carrinho e badge ao abrir qualquer página
atualizarCarrinhoHTML();

// Função para enviar pedido pelo WhatsApp
function enviarPedido() {
    const nome = document.getElementById('nomeCliente')?.value.trim();
    if (!nome) {
        alert('Digite seu nome!');
        return;
    }
    if (!carrinho.length) {
        alert('Seu carrinho está vazio!');
        return;
    }

    let mensagem = `👋 Olá, meu nome é *${nome}*!\n\n🛒 Gostaria de fazer o seguinte pedido:\n`;
    let total = 0;

    carrinho.forEach((item, i) => {
        mensagem += `\n${i+1}. 📦 *${item.modelo}* \n   🎨 Cor: ${item.cor} \n   💰 Valor: ${formatarValor(item.valor)}`;
        total += item.valor;
    });

    mensagem += `\n\n📦 *Total do pedido:* ${formatarValor(total)}\n\n✅ Aguardo a confirmação!`;

    // Número do WhatsApp
    const numero = '12991548197';
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
}
// ================= FIM CARRINHO =====================

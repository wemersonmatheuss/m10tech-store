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

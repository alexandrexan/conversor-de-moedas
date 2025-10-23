let cotacaoDolarAtual = 0; // Variável global para armazenar a cotação

// Função para buscar a cotação do dólar
async function buscarCotacaoDolar() {
    const cotacaoAtualElement = document.getElementById('cotacaoAtual');
    
    try {
        // Requisição à API Awesome API para a cotação BRL/USD
        const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL');
        const data = await response.json();
        
        // Acessa o valor de "bid" (preço de compra) do dólar
        cotacaoDolarAtual = parseFloat(data.USDBRL.bid);
        
        if (cotacaoDolarAtual > 0) {
            cotacaoAtualElement.textContent = `Dólar atual: R$ ${cotacaoDolarAtual.toFixed(2).replace('.', ',')}`;
            cotacaoAtualElement.style.color = "#a3be8c";
            cotacaoAtualElement.style.fontWeight = "bold";
            cotacaoAtualElement.style.fontSize = "1.2em";
            cotacaoAtualElement.style.margin = "20px 0";
        } else {
            cotacaoAtualElement.textContent = "Não foi possível obter a cotação. Tente novamente mais tarde.";
            cotacaoAtualElement.style.color = "#bf616a";
        }
    } catch (error) {
        console.error("Erro ao buscar cotação do dólar:", error);
        cotacaoAtualElement.textContent = "Erro ao carregar a cotação. Verifique sua conexão.";
        cotacaoAtualElement.style.color = "#bf616a";
    }

    // Atualiza o texto da cotação conforme o idioma selecionado
    const lang = document.documentElement.lang || "pt-br";
    const textoCotacao = (typeof traducoes !== "undefined" && traducoes[lang]?.cotacaoAtualTexto)
    ? traducoes[lang].cotacaoAtualTexto
    : "Dólar atual:";

    cotacaoAtualElement.textContent = `${textoCotacao} R$ ${cotacaoDolarAtual.toFixed(2).replace('.', ',')}`;

}

// Função para normalizar entrada de números brasileiros
function normalizarNumerobrasileiro(valorString) {
    // Remove espaços em branco no início e fim
    valorString = valorString.trim();
    
    // Se não tem vírgula, assume que pontos são separadores de milhares
    if (!valorString.includes(',')) {
        // Remove todos os pontos (separadores de milhares)
        valorString = valorString.replace(/\./g, '');
    } else {
        // Se tem vírgula, ela é o separador decimal
        // Remove pontos (separadores de milhares) e substitui vírgula por ponto
        valorString = valorString.replace(/\./g, '').replace(',', '.');
    }
    
    return valorString;
}

// Função para validar se um número é válido após normalização
function isNumeroValido(numeroString) {
    // Verifica se após a limpeza ainda é um número válido
    const numero = parseFloat(numeroString);
    return !isNaN(numero) && numero >= 0;
}

// Função para converter Real para Dólar
function converter() {
    const valorCarteiraInput = document.getElementById('valorCarteira').value;
    const resultadoElement = document.getElementById('resultado');
    
    // Remove a classe de erro anterior
    resultadoElement.classList.remove('error');
    
    // Verifica se a cotação está disponível
    if (cotacaoDolarAtual <= 0) {
        resultadoElement.textContent = "Cotação do dólar não disponível. Não é possível converter.";
        resultadoElement.classList.add('error');
        return;
    }
    
    // Normaliza o número brasileiro para formato internacional
    const valorNormalizado = normalizarNumerobrasileiro(valorCarteiraInput);
    
    // Valida se o número é válido + traduz mensagem de erro
    if (!isNumeroValido(valorNormalizado)) {
    const lang = document.documentElement.lang || "pt-br";
    const msgErro = (typeof traducoes !== "undefined" && traducoes[lang]?.erroValorInvalido)
        ? traducoes[lang].erroValorInvalido
        : "Por favor, insira um valor válido.";

    resultadoElement.textContent = msgErro;
    resultadoElement.classList.add('error');
    return;
}
    
    // Converte para número
    const valorCarteira = parseFloat(valorNormalizado);
    
    // Calcula o valor em dólares
    const valorEmDolar = valorCarteira / cotacaoDolarAtual;
    
    // Exibe o resultado formatado no padrão brasileiro
    const valorReaisFormatado = valorCarteira.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    
    const valorDolarFormatado = valorEmDolar.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    });
    
    // Antes de exibir o resultado
    const lang = document.documentElement.lang || "pt-br";
    const textoEquivalem = (typeof traducoes !== "undefined" && traducoes[lang]?.equivalemA)
    ? traducoes[lang].equivalemA
    : "equivalem a";

    // Exibe o resultado formatado
    resultadoElement.textContent = `${valorReaisFormatado} ${textoEquivalem} ${valorDolarFormatado}`;
}

// Função para formatar entrada em tempo real (opcional)
function formatarEntrada() {
    const campo = document.getElementById('valorCarteira');
    let valor = campo.value;
    
    // Remove caracteres não numéricos exceto vírgula e ponto
    valor = valor.replace(/[^\d.,]/g, '');
    
    // Atualiza o campo
    campo.value = valor;
}

function handleKeyPress(evento) {
    // Verifica se a tecla pressionada foi Enter
    if (evento.key === 'Enter') {
        // Previne comportamentos padrão (como submeter formulário)
        evento.preventDefault();
        
        // Chama a função de conversão
        converter();
    }
}

// Inicializa quando a página carrega
document.addEventListener('DOMContentLoaded', function() {
    // Busca a cotação inicial
    buscarCotacaoDolar();

    // Adiciona o listener para o evento de tecla
    document.addEventListener('keypress', handleKeyPress);

    // Adiciona formatação em tempo real ao campo de entrada (opcional)
    const campoValor = document.getElementById('valorCarteira');
    if (campoValor) {
        campoValor.addEventListener('input', formatarEntrada);
    }
});
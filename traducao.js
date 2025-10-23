const traducoes = {
    "pt-br": {
        title: "Conversor R$ > US$",
        descricao: "Transforme valores de reais em dólares com base na cotação atual.",
        titulo: "Conversor R$ > US$",
        cotacaoAtualTexto: "Dólar atual:",
        cotacao: "Carregando cotação do Dólar...",
        labelCarteira: "Quanto você tem na carteira (R$)?",
        botaoConverter: "Converter",
        creditos: 'Criado por <strong><a href="https://github.com/alexandrexan" target="_blank">XAN</a></strong>',
        erroValorInvalido: "Por favor, insira um valor válido.",
        equivalemA: "equivalem a",

    },
    "en-us": {
        title: "Converter R$ > US$",
        descricao: "Convert Brazilian Reais into US Dollars based on the current exchange rate.",
        titulo: "Converter R$ > US$",
        cotacaoAtualTexto: "Current Dollar:",
        cotacao: "Loading Dollar exchange rate...",
        labelCarteira: "How much do you have in your wallet (R$)?",
        botaoConverter: "Convert",
        creditos: 'Created by <strong><a href="https://github.com/alexandrexan" target="_blank">XAN</a></strong>',
        erroValorInvalido: "Please enter a valid amount.",
        equivalemA: "equals",
    }
};

function aplicarTraducao(lang) {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const chave = el.getAttribute("data-i18n");
        const texto = traducoes[lang][chave];
        if (!texto) return;

        // Evita sobrescrever o valor dinâmico da cotação
        if (chave === "cotacao") {
            const cotacaoEl = document.getElementById("cotacaoAtual");
            if (cotacaoEl && !cotacaoEl.textContent.includes("R$") && !cotacaoEl.textContent.includes("$")) {
                cotacaoEl.textContent = texto;
            }
            return;
        }

        if (el.tagName === "TITLE") {
            document.title = texto;
        } else {
            el.innerHTML = texto;
        }
    });

    // Atualiza a cotação novamente após trocar idioma
    if (typeof buscarCotacaoDolar === "function") {
        buscarCotacaoDolar();
    }
}

function marcarBandeiraAtiva(lang) {
    document.querySelectorAll(".flag-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.lang === lang);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".flag-btn");
    botoes.forEach(btn => {
        btn.addEventListener("click", () => {
            const lang = btn.dataset.lang;
            aplicarTraducao(lang);
            marcarBandeiraAtiva(lang);
        });
    });

    aplicarTraducao("pt-br");
    marcarBandeiraAtiva("pt-br");
});
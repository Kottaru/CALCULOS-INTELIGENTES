document.addEventListener('DOMContentLoaded', () => {
    const numero1Input = document.getElementById('numero1');
    const numero2Input = document.getElementById('numero2');
    const botoesOp = document.querySelectorAll('.botao-op');
    const calcularBtn = document.getElementById('calcularBtn');
    const limparBtn = document.getElementById('limparBtn');
    const resultadoDiv = document.getElementById('resultado');

    let operacaoSelecionada = '+';

    // Função para formatar número com vírgula para exibição
    function formatarParaExibir(num) {
        return num.toString().replace('.', ',');
    }

    // Função para converter entrada com vírgula para número
    function parseNumero(str) {
        return parseFloat(str.replace(',', '.'));
    }

    // Event Listeners
    botoesOp.forEach(botao => {
        botao.addEventListener('click', () => {
            botoesOp.forEach(b => b.classList.remove('selecionado'));
            botao.classList.add('selecionado');
            operacaoSelecionada = botao.dataset.op;
        });
    });
    document.querySelector('[data-op="+"]').classList.add('selecionado');

    limparBtn.addEventListener('click', () => {
        numero1Input.value = '';
        numero2Input.value = '';
        resultadoDiv.innerHTML = '<div class="placeholder-text">O resultado detalhado aparecerá aqui...</div>';
        resultadoDiv.classList.remove('has-content');
    });

    calcularBtn.addEventListener('click', () => {
        const n1Str = numero1Input.value;
        const n2Str = numero2Input.value;

        if (!n1Str || !n2Str) {
            resultadoDiv.innerHTML = '<p style="color: red; text-align: center;">Por favor, preencha os dois números.</p>';
            resultadoDiv.classList.add('has-content');
            return;
        }
        
        const n1 = parseNumero(n1Str);
        const n2 = parseNumero(n2Str);

        if (isNaN(n1) || isNaN(n2)) {
            resultadoDiv.innerHTML = '<p style="color: red; text-align: center;">Use apenas números e vírgulas (ex: 12,5).</p>';
            resultadoDiv.classList.add('has-content');
            return;
        }

        let htmlResultado = '';
        switch (operacaoSelecionada) {
            case '+': htmlResultado = resolverAdicao(n1, n2); break;
            case '-': htmlResultado = resolverSubtracao(n1, n2); break;
            case '*': htmlResultado = resolverMultiplicacao(n1, n2); break;
            case '/': htmlResultado = resolverDivisao(n1, n2); break;
        }

        resultadoDiv.innerHTML = htmlResultado;
        resultadoDiv.classList.add('has-content');
    });

    // --- LÓGICA DAS OPERAÇÕES ---

    function resolverAdicao(n1, n2) {
        const resultado = n1 + n2;
        const n1Str = n1.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');
        const n2Str = n2.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');
        
        const { num1Formatado, num2Formatado, vaiUmArray } = calcularVisualAdicaoSubtracao(n1Str, n2Str, '+');
        
        let html = `<div class="passo-titulo">Adição: ${formatarParaExibir(n1)} + ${formatarParaExibir(n2)}</div>`;
        html += `<div class="conta-visual">`;
        html += `  ${vaiUmArray.join(' ').replace(/(\d)/g, '<span class="vai-um">$1</span> ')}\n`;
        html += `  ${num1Formatado}\n`;
        html += `+ ${num2Formatado}\n`;
        html += `  ${'-'.repeat(Math.max(num1Formatado.length, num2Formatado.length))}\n`;
        html += `  ${formatarParaExibir(resultado)}\n`;
        html += `</div>`;
        html += `<div class="resultado-final">Resultado: ${formatarParaExibir(resultado)}</div>`;
        return html;
    }

    function resolverSubtracao(n1, n2) {
        const resultado = n1 - n2;
        const n1Str = n1.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');
        const n2Str = n2.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/, '');

        let html = `<div class="passo-titulo">Subtração: ${formatarParaExibir(n1)} - ${formatarParaExibir(n2)}</div>`;
        
        if (n1 < n2) {
             html += `<p class="explicacao-texto">O resultado é negativo. Vamos calcular o valor positivo e depois adicionar o sinal de (-).</p>`;
             html += resolverSubtracaoVisual(n2, n1);
             html += `<div class="resultado-final">Resultado: -${formatarParaExibir(Math.abs(resultado))}</div>`;
        } else {
             html += resolverSubtracaoVisual(n1, n2);
             html += `<div class="resultado-final">Resultado: ${formatarParaExibir(resultado)}</div>`;
        }
        return html;
    }
    
    function resolverSubtracaoVisual(n1, n2) {
        const { num1Formatado, num2Formatado } = calcularVisualAdicaoSubtracao(n1.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/), n2.toFixed(10).replace('.', ',').replace(/0+$/, '').replace(/,$/), '-');
        
        let html = `<div class="conta-visual">`;
        html += `  ${num1Formatado}\n`;
        html += `- ${num2Formatado}\n`;
        html += `  ${'-'.repeat(Math.max(num1Formatado.length, num2Formatado.length))}\n`;
        html += `  ${formatarParaExibir(n1 - n2)}\n`;
        html += `</div>`;
        return html;
    }

    function resolverMultiplicacao(n1, n2) {
        const resultado = n1 * n2;
        const decimaisN1 = (n1.toString().split('.')[1] || '').length;
        const decimaisN2 = (n2.toString().split('.')[1] || '').length;
        const totalDecimais = decimaisN1 + decimaisN2;

        let html = `<div class="passo-titulo">Multiplicação: ${formatarParaExibir(n1)} × ${formatarParaExibir(n2)}</div>`;
        html += `<div class="explicacao-texto">`;
        html += `<p><strong>Passo 1:</strong> Multiplique os números ignorando as vírgulas.</p>`;
        html += `<p>${n1.toString().replace('.', '')} × ${n2.toString().replace('.', '')} = ${resultado.toFixed(totalDecimais).replace('.', '')}</p>`;
        html += `<p><strong>Passo 2:</strong> Conte as casas decimais.</p>`;
        html += `<p>${formatarParaExibir(n1)} tem ${decimaisN1} casa(s) decimal(is).<br>`;
        html += `${formatarParaExibir(n2)} tem ${decimaisN2} casa(s) decimal(is).</p>`;
        html += `<p>Total: ${decimaisN1} + ${decimaisN2} = ${totalDecimais} casas decimais.</p>`;
        html += `<p><strong>Passo 3:</strong> Coloque a vírgula no resultado, contando ${totalDecimais} casas da direita para a esquerda.</p>`;
        html += `</div>`;
        html += `<div class="resultado-final">Resultado: ${formatarParaExibir(resultado)}</div>`;
        return html;
    }

    function resolverDivisao(n1, n2) {
        if (n2 === 0) {
            return `<div class="passo-titulo">Divisão</div><p style="color: red; text-align: center;">Erro: Não é possível dividir por zero.</p>`;
        }
        
        const quociente = n1 / n2;
        let html = `<div class="passo-titulo">Divisão: ${formatarParaExibir(n1)} ÷ ${formatarParaExibir(n2)}</div>`;
        html += `<div class="explicacao-texto">`;
        html += `<p>A conta ${formatarParaExibir(n1)} ÷ ${formatarParaExibir(n2)} pergunta: "Quantas vezes o ${formatarParaExibir(n2)} cabe em ${formatarParaExibir(n1)}?"</p>`;
        html += `<p>Para facilitar, podemos transformar os números em inteiros se o divisor (${formatarParaExibir(n2)}) não for inteiro.</p>`;
        
        if (n2 % 1 !== 0) {
            const multiplicador = Math.pow(10, (n2.toString().split('.')[1] || '').length);
            const n1Inteiro = n1 * multiplicador;
            const n2Inteiro = n2 * multiplicador;
            html += `<p>Multiplicamos ambos por ${multiplicador}:</p>`;
            html += `<p>${formatarParaExibir(n1)} × ${multiplicador} = ${formatarParaExibir(n1Inteiro)}<br>`;
            html += `${formatarParaExibir(n2)} × ${multiplicador} = ${formatarParaExibir(n2Inteiro)}</p>`;
            html += `<p>Agora a conta é ${formatarParaExibir(n1Inteiro)} ÷ ${formatarParaExibir(n2Inteiro)}.</p>`;
        }
        html += `<p>O resultado final é <strong>${formatarParaExibir(quociente)}</strong>.</p>`;
        html += `</div>`;
        html += `<div class="resultado-final">Resultado: ${formatarParaExibir(quociente)}</div>`;
        return html;
    }
    
    // Função auxiliar para o visual de Adição e Subtração
    function calcularVisualAdicaoSubtracao(n1Str, n2Str, op) {
        const maxLength = Math.max(n1Str.length, n2Str.length);
        const n1Formatado = n1Str.padStart(maxLength, ' ');
        const n2Formatado = n2Str.padStart(maxLength, ' ');
        
        let vaiUmArray = Array(maxLength).fill(' ');
        if (op === '+') {
            let carry = 0;
            for (let i = maxLength - 1; i >= 0; i--) {
                const d1 = parseInt(n1Formatado[i]) || 0;
                const d2 = parseInt(n2Formatado[i]) || 0;
                if (d1 + d2 + carry >= 10) {
                    vaiUmArray[i] = '1';
                    carry = 1;
                } else {
                    carry = 0;
                }
            }
        }
        
        return { num1Formatado, num2Formatado, vaiUmArray };
    }
});

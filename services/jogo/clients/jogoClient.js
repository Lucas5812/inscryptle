const CARTAS_URL = process.env.CARTAS_URL || 'http://localhost:3001';

class JogoClient {

    static async chamar(caminho) {
        try {
            return await fetch(CARTAS_URL + caminho);
        } catch (erro) {
            const falha = new Error('Serviço de Cartas indisponível.');
            falha.codigo = 503;
            throw falha;
        }
    }

    static async listar() {
        const resposta = await JogoClient.chamar('/cartas');
        if (!resposta.ok) {
            throw new Error('Falha ao listar cartas no Serviço de Cartas (status ' + resposta.status + ').');
        }
        return resposta.json();
    }

    static async buscarCompletaPorId(id) {
        const resposta = await JogoClient.chamar(`/cartas/${id}`);
        if (resposta.status === 404) {
            return null;
        }
        if (!resposta.ok) {
            throw new Error('Falha ao buscar carta no Serviço de Cartas (status ' + resposta.status + ').');
        }
        return resposta.json();
    }
}

module.exports = JogoClient;
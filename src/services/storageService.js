import AsyncStorage from '@react-native-async-storage/async-storage';

// RF01 - Histórico local e persistência.
// Todas as visitas ficam em uma única chave, como uma lista JSON.
// O AsyncStorage grava no próprio aparelho, então funciona sem internet.
const CHAVE_VISITAS = '@visitas_tecnicas:v1';

export async function carregarVisitas() {
  const json = await AsyncStorage.getItem(CHAVE_VISITAS);
  if (!json) return [];

  try {
    const dados = JSON.parse(json);
    return Array.isArray(dados) ? dados : [];
  } catch {
    // Dado corrompido: não derruba o app, apenas começa vazio.
    return [];
  }
}

async function gravar(lista) {
  await AsyncStorage.setItem(CHAVE_VISITAS, JSON.stringify(lista));
  return lista;
}

/** Adiciona a visita no topo da lista e devolve a lista atualizada. */
export async function adicionarVisita(visita) {
  const atuais = await carregarVisitas();
  return gravar([visita, ...atuais]);
}

export async function removerVisita(id) {
  const atuais = await carregarVisitas();
  return gravar(atuais.filter((v) => v.id !== id));
}

export async function limparVisitas() {
  await AsyncStorage.removeItem(CHAVE_VISITAS);
  return [];
}

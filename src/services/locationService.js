import * as Location from 'expo-location';

export const ResultadoLocalizacao = {
  OK: 'ok',
  GPS_DESLIGADO: 'gps_desligado',
  NEGADO: 'negado',
  ERRO: 'erro',
};

const TEMPO_LIMITE_MS = 15000;

function comTempoLimite(promessa, ms) {
  return Promise.race([
    promessa,
    new Promise((_, rejeitar) =>
      setTimeout(() => rejeitar(new Error('tempo_esgotado')), ms)
    ),
  ]);
}

/**
 * RF02 + RNF01 - Obtém a posição atual tratando:
 *  - GPS desligado no aparelho
 *  - permissão negada / bloqueada
 *  - demora excessiva ou falha do sensor
 * Nunca lança exceção: devolve { status, coords?, mensagem? }.
 */
export async function obterLocalizacao() {
  try {
    const servicosAtivos = await Location.hasServicesEnabledAsync();
    if (!servicosAtivos) {
      return {
        status: ResultadoLocalizacao.GPS_DESLIGADO,
        mensagem: 'O GPS está desligado. Ative a localização do aparelho e tente novamente.',
      };
    }

    const permissao = await Location.requestForegroundPermissionsAsync();
    if (permissao.status !== 'granted') {
      return {
        status: ResultadoLocalizacao.NEGADO,
        mensagem: permissao.canAskAgain
          ? 'Permissão de localização negada. Toque em "Capturar localização" e escolha "Permitir".'
          : 'Localização bloqueada. Libere em Configurações > Apps > Permissões > Localização.',
      };
    }

    const posicao = await comTempoLimite(
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High }),
      TEMPO_LIMITE_MS
    );

    return {
      status: ResultadoLocalizacao.OK,
      coords: {
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
        precisao: posicao.coords.accuracy, // raio de erro em metros
      },
    };
  } catch (erro) {
    return {
      status: ResultadoLocalizacao.ERRO,
      mensagem:
        erro?.message === 'tempo_esgotado'
          ? 'O GPS demorou demais para responder. Tente em uma área mais aberta.'
          : 'Não foi possível obter a localização agora. Tente novamente.',
    };
  }
}

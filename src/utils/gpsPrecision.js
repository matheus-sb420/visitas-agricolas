import { cores } from '../constants/theme';

// RF02 - Limites de precisão do GPS (em metros)
export const LIMITE_ALTA_PRECISAO = 10;
export const LIMITE_MEDIA_PRECISAO = 30;

/**
 * Classifica a precisão (raio de erro em metros) retornada pelo GPS.
 * Quanto MENOR o número, MAIS precisa é a localização.
 *
 *   < 10 m        → Verde    (alta)
 *   10 m a 30 m   → Amarelo  (média)
 *   > 30 m        → Vermelho (baixa)
 */
export function classificarPrecisao(precisao) {
  if (precisao == null || Number.isNaN(precisao)) {
    return { nivel: 'indisponivel', cor: cores.neutro, rotulo: 'Sem localização' };
  }
  if (precisao < LIMITE_ALTA_PRECISAO) {
    return { nivel: 'alta', cor: cores.precisaoAlta, rotulo: 'Alta precisão' };
  }
  if (precisao <= LIMITE_MEDIA_PRECISAO) {
    return { nivel: 'media', cor: cores.precisaoMedia, rotulo: 'Média precisão' };
  }
  return { nivel: 'baixa', cor: cores.precisaoBaixa, rotulo: 'Baixa precisão' };
}

import { useWindowDimensions } from 'react-native';

import { LARGURA_TABLET } from '../constants/theme';

/**
 * RNF02 - useWindowDimensions é atualizado automaticamente quando o
 * aparelho gira, então qualquer componente que use este hook
 * se redesenha na nova orientação.
 */
export function useOrientation() {
  const { width, height } = useWindowDimensions();
  const paisagem = width > height;

  return {
    largura: width,
    altura: height,
    paisagem,
    // Duas colunas em paisagem ou em telas largas (tablets em retrato)
    duasColunas: paisagem || width >= LARGURA_TABLET,
  };
}

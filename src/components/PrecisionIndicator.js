import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';
import { classificarPrecisao } from '../utils/gpsPrecision';

/**
 * RF02 - Indicador visual de precisão do GPS.
 * Mostra cor + texto (não depende só da cor, o que ajuda daltônicos).
 */
export default function PrecisionIndicator({ precisao, compacto = false }) {
  const { cor, rotulo } = classificarPrecisao(precisao);
  const temValor = precisao != null && !Number.isNaN(precisao);

  return (
    <View
      style={[styles.container, !compacto && { borderColor: cor, backgroundColor: `${cor}1A` }]}
      accessibilityLabel={`${rotulo}${temValor ? `, margem de ${Math.round(precisao)} metros` : ''}`}
    >
      <View style={[styles.bolinha, compacto && styles.bolinhaCompacta, { backgroundColor: cor }]} />
      <Text style={[styles.texto, compacto && styles.textoCompacto]}>
        {rotulo}
        {temValor ? ` (±${precisao.toFixed(1)} m)` : ''}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: raio.sm,
    paddingVertical: espaco.xs,
    paddingHorizontal: espaco.sm,
    alignSelf: 'flex-start',
    marginTop: espaco.sm,
  },
  bolinha: { width: 14, height: 14, borderRadius: 7, marginRight: espaco.sm },
  bolinhaCompacta: { width: 10, height: 10, borderRadius: 5 },
  texto: { fontSize: 15, color: cores.texto, fontWeight: '500' },
  textoCompacto: { fontSize: 12, color: cores.textoSecundario, fontWeight: '400' },
});

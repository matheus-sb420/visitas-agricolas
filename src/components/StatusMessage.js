import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';

const ESTILOS = {
  erro: { cor: cores.erro, fundo: cores.erroFundo, icone: '⚠️' },
  aviso: { cor: cores.aviso, fundo: cores.avisoFundo, icone: '💡' },
  info: { cor: cores.info, fundo: cores.infoFundo, icone: 'ℹ️' },
};

/**
 * RNF01 - Mensagem amigável sobre o estado do sistema
 * (GPS desligado, permissão negada, falha ao carregar etc.).
 */
export default function StatusMessage({ tipo = 'info', mensagem }) {
  if (!mensagem) return null;
  const estilo = ESTILOS[tipo] ?? ESTILOS.info;

  return (
    <View
      style={[styles.container, { backgroundColor: estilo.fundo, borderLeftColor: estilo.cor }]}
      accessibilityRole="alert"
    >
      <Text style={styles.icone}>{estilo.icone}</Text>
      <Text style={[styles.texto, { color: estilo.cor }]}>{mensagem}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderRadius: raio.sm,
    padding: espaco.md,
    marginVertical: espaco.sm,
  },
  icone: { marginRight: espaco.sm, fontSize: 16 },
  texto: { flex: 1, fontSize: 14, lineHeight: 20 },
});

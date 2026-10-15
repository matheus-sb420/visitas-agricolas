import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';

/**
 * Botão padrão do app.
 * variante: 'primario' | 'secundario' | 'perigo'
 */
export default function PrimaryButton({
  titulo,
  onPress,
  variante = 'primario',
  carregando = false,
  desabilitado = false,
}) {
  const inativo = desabilitado || carregando;

  return (
    <Pressable
      onPress={onPress}
      disabled={inativo}
      accessibilityRole="button"
      accessibilityState={{ disabled: inativo, busy: carregando }}
      style={({ pressed }) => [
        styles.base,
        styles[variante],
        pressed && styles.pressionado,
        inativo && styles.inativo,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={variante === 'secundario' ? cores.primaria : cores.branco} />
      ) : (
        <Text
          style={[styles.texto, variante === 'secundario' && styles.textoSecundario]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48, // área de toque mínima recomendada
    paddingHorizontal: espaco.lg,
    paddingVertical: espaco.md,
    borderRadius: raio.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: espaco.xs,
  },
  primario: { backgroundColor: cores.primaria },
  secundario: {
    backgroundColor: cores.card,
    borderWidth: 1.5,
    borderColor: cores.primaria,
  },
  perigo: { backgroundColor: cores.erro },
  pressionado: { opacity: 0.8 },
  inativo: { opacity: 0.5 },
  texto: { color: cores.branco, fontSize: 16, fontWeight: '600' },
  textoSecundario: { color: cores.primaria },
});

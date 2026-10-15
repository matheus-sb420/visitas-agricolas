import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';
import PrecisionIndicator from './PrecisionIndicator';

/** Item do histórico de visitas (RF01). */
export default function VisitCard({ visita, onRemover }) {
  const temCoordenadas = visita.latitude != null && visita.longitude != null;

  return (
    <View style={styles.card}>
      {visita.foto ? (
        <Image source={{ uri: visita.foto }} style={styles.miniatura} />
      ) : (
        <View style={[styles.miniatura, styles.semFoto]}>
          <Text style={styles.semFotoTexto}>Sem foto</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.titulo} numberOfLines={1}>
          {visita.produtor}
        </Text>
        <Text style={styles.data}>{visita.data}</Text>

        {!!visita.observacoes && (
          <Text style={styles.observacoes} numberOfLines={2}>
            {visita.observacoes}
          </Text>
        )}

        {temCoordenadas && (
          <Text style={styles.coords} numberOfLines={1}>
            📍 {visita.latitude.toFixed(5)}, {visita.longitude.toFixed(5)}
          </Text>
        )}

        <PrecisionIndicator precisao={visita.precisao} compacto />
      </View>

      <Pressable
        onPress={() => onRemover(visita)}
        accessibilityRole="button"
        accessibilityLabel={`Excluir visita de ${visita.produtor}`}
        hitSlop={12}
        style={styles.excluir}
      >
        <Text style={styles.excluirTexto}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: espaco.md,
    paddingVertical: espaco.md,
    borderTopWidth: 1,
    borderTopColor: cores.borda,
  },
  miniatura: { width: 64, height: 64, borderRadius: raio.sm },
  semFoto: {
    backgroundColor: cores.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  semFotoTexto: { fontSize: 11, color: cores.textoSecundario },
  info: { flex: 1, minWidth: 0 },
  titulo: { fontSize: 16, fontWeight: '600', color: cores.texto },
  data: { fontSize: 12, color: cores.textoSecundario, marginTop: 2 },
  observacoes: { fontSize: 14, color: cores.texto, marginTop: espaco.xs },
  coords: { fontSize: 12, color: cores.textoSecundario, marginTop: espaco.xs },
  excluir: { padding: espaco.xs },
  excluirTexto: { fontSize: 16, color: cores.textoSecundario },
});

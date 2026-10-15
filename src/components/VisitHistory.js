import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';
import StatusMessage from './StatusMessage';
import VisitCard from './VisitCard';

/** RF01 - Lista das visitas salvas no aparelho. */
export default function VisitHistory({ visitas, carregando, erro, onRemover, onLimpar }) {
  return (
    <View style={styles.card}>
      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>Histórico ({visitas.length})</Text>
        {visitas.length > 0 && (
          <Pressable onPress={onLimpar} accessibilityRole="button" hitSlop={8}>
            <Text style={styles.limpar}>Limpar tudo</Text>
          </Pressable>
        )}
      </View>
      <Text style={styles.subtitulo}>Salvo no aparelho · disponível offline</Text>

      <StatusMessage tipo="erro" mensagem={erro} />

      {carregando ? (
        <ActivityIndicator color={cores.primaria} style={styles.carregando} />
      ) : visitas.length === 0 ? (
        <Text style={styles.vazio}>Nenhuma visita registrada ainda.</Text>
      ) : (
        visitas.map((visita) => (
          <VisitCard key={visita.id} visita={visita} onRemover={onRemover} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.card,
    borderRadius: raio.md,
    padding: espaco.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: espaco.sm,
  },
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, flexShrink: 1 },
  subtitulo: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 2,
    marginBottom: espaco.sm,
  },
  limpar: { color: cores.erro, fontWeight: '500' },
  carregando: { marginVertical: espaco.xl },
  vazio: { color: cores.textoSecundario, fontStyle: 'italic', marginVertical: espaco.md },
});

import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import VisitForm from '../components/VisitForm';
import VisitHistory from '../components/VisitHistory';
import { cores, espaco } from '../constants/theme';
import { useOrientation } from '../hooks/useOrientation';
import {
  adicionarVisita,
  carregarVisitas,
  limparVisitas,
  removerVisita,
} from '../services/storageService';

export default function HomeScreen() {
  const { duasColunas } = useOrientation(); // RNF02

  const [visitas, setVisitas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroHistorico, setErroHistorico] = useState('');

  // RF01 - carrega o histórico salvo assim que a tela abre
  useEffect(() => {
    (async () => {
      try {
        setVisitas(await carregarVisitas());
      } catch {
        setErroHistorico('Não foi possível carregar o histórico salvo no aparelho.');
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function handleSalvar(visita) {
    try {
      setVisitas(await adicionarVisita(visita));
      setErroHistorico('');
      return true;
    } catch {
      Alert.alert('Erro ao salvar', 'Não foi possível gravar a visita no aparelho. Tente novamente.');
      return false;
    }
  }

  function handleRemover(visita) {
    Alert.alert('Excluir visita', `Deseja excluir a visita de "${visita.produtor}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            setVisitas(await removerVisita(visita.id));
          } catch {
            Alert.alert('Erro', 'Não foi possível excluir a visita.');
          }
        },
      },
    ]);
  }

  function handleLimpar() {
    Alert.alert('Limpar histórico', 'Todas as visitas salvas serão apagadas. Continuar?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar tudo',
        style: 'destructive',
        onPress: async () => {
          try {
            setVisitas(await limparVisitas());
          } catch {
            Alert.alert('Erro', 'Não foi possível limpar o histórico.');
          }
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>🌱 Visitas Técnicas Agrícolas</Text>
          <Text style={styles.subtitulo}>Registre fotos e localização de cada visita</Text>
        </View>

        {/* RNF02 - duas colunas em paisagem/tablet, empilhado em retrato */}
        <View style={[styles.colunas, duasColunas && styles.colunasLado]}>
          <View style={duasColunas && styles.coluna}>
            <VisitForm onSalvar={handleSalvar} />
          </View>
          <View style={duasColunas && styles.coluna}>
            <VisitHistory
              visitas={visitas}
              carregando={carregando}
              erro={erroHistorico}
              onRemover={handleRemover}
              onLimpar={handleLimpar}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: cores.fundo },
  conteudo: {
    padding: espaco.lg,
    paddingBottom: espaco.xl * 2,
    width: '100%',
    maxWidth: 1100, // evita linhas esticadas demais em telas muito largas
    alignSelf: 'center',
  },
  cabecalho: { marginBottom: espaco.lg },
  titulo: { fontSize: 22, fontWeight: '700', color: cores.primariaEscura },
  subtitulo: { fontSize: 14, color: cores.textoSecundario, marginTop: espaco.xs },
  colunas: { gap: espaco.lg },
  colunasLado: { flexDirection: 'row', alignItems: 'flex-start' },
  coluna: { flex: 1, minWidth: 0 },
});

import React, { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { cores, espaco, raio } from '../constants/theme';
import { capturarFoto, ResultadoCamera } from '../services/cameraService';
import { obterLocalizacao, ResultadoLocalizacao } from '../services/locationService';
import {
  alertaCameraBloqueada,
  alertaCameraIndisponivel,
  alertaCameraNegada,
} from '../utils/permissionAlerts';
import PrecisionIndicator from './PrecisionIndicator';
import PrimaryButton from './PrimaryButton';
import StatusMessage from './StatusMessage';

/**
 * Formulário de nova visita: dados, foto (câmera) e localização (GPS).
 * onSalvar(visita) deve retornar true se a gravação deu certo.
 */
export default function VisitForm({ onSalvar }) {
  const [produtor, setProdutor] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [foto, setFoto] = useState(null);
  const [coords, setCoords] = useState(null);
  const [mensagemGPS, setMensagemGPS] = useState('');
  const [buscandoGPS, setBuscandoGPS] = useState(false);
  const [abrindoCamera, setAbrindoCamera] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // NÍVEL JÚNIOR - cada resultado da câmera leva a uma resposta diferente
  async function handleTirarFoto() {
    setAbrindoCamera(true);
    const resultado = await capturarFoto();
    setAbrindoCamera(false);

    switch (resultado.status) {
      case ResultadoCamera.OK:
        setFoto(resultado.uri);
        break;
      case ResultadoCamera.BLOQUEADO:
        alertaCameraBloqueada(); // instruções + botão para as configurações
        break;
      case ResultadoCamera.NEGADO:
        alertaCameraNegada();
        break;
      case ResultadoCamera.INDISPONIVEL:
        alertaCameraIndisponivel();
        break;
      default:
        break; // CANCELADO: usuário só fechou a câmera
    }
  }

  // RF02 + RNF01
  async function handleCapturarLocalizacao() {
    setBuscandoGPS(true);
    setMensagemGPS('');
    const resultado = await obterLocalizacao();
    setBuscandoGPS(false);

    if (resultado.status === ResultadoLocalizacao.OK) {
      setCoords(resultado.coords);
    } else {
      setMensagemGPS(resultado.mensagem);
    }
  }

  async function handleSalvar() {
    if (!produtor.trim()) {
      Alert.alert('Campo obrigatório', 'Informe o nome do produtor ou da propriedade.');
      return;
    }

    const visita = {
      id: Date.now().toString(),
      produtor: produtor.trim(),
      observacoes: observacoes.trim(),
      foto,
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
      precisao: coords?.precisao ?? null,
      data: new Date().toLocaleString('pt-BR'),
    };

    setSalvando(true);
    const ok = await onSalvar(visita);
    setSalvando(false);

    if (ok) {
      setProdutor('');
      setObservacoes('');
      setFoto(null);
      setCoords(null);
      setMensagemGPS('');
      Alert.alert('Visita salva', 'O registro foi salvo no aparelho e já aparece no histórico.');
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>Nova visita</Text>

      <Text style={styles.rotulo}>Produtor / propriedade *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex.: Sítio Boa Esperança"
        placeholderTextColor={cores.textoSecundario}
        value={produtor}
        onChangeText={setProdutor}
        returnKeyType="next"
      />

      <Text style={styles.rotulo}>Observações</Text>
      <TextInput
        style={[styles.input, styles.inputMultilinha]}
        placeholder="Condições da lavoura, recomendações..."
        placeholderTextColor={cores.textoSecundario}
        value={observacoes}
        onChangeText={setObservacoes}
        multiline
      />

      <Text style={styles.secao}>Foto</Text>
      {foto && <Image source={{ uri: foto }} style={styles.foto} resizeMode="cover" />}
      <PrimaryButton
        titulo={foto ? '📷 Tirar outra foto' : '📷 Tirar foto'}
        variante="secundario"
        onPress={handleTirarFoto}
        carregando={abrindoCamera}
      />

      <Text style={styles.secao}>Localização</Text>
      <PrimaryButton
        titulo={coords ? '📍 Atualizar localização' : '📍 Capturar localização'}
        variante="secundario"
        onPress={handleCapturarLocalizacao}
        carregando={buscandoGPS}
      />
      <StatusMessage tipo="aviso" mensagem={mensagemGPS} />
      <PrecisionIndicator precisao={coords?.precisao} />
      {coords && (
        <Text style={styles.coords}>
          {coords.latitude.toFixed(5)}, {coords.longitude.toFixed(5)}
        </Text>
      )}

      <View style={styles.espacoSalvar} />
      <PrimaryButton titulo="💾 Salvar visita" onPress={handleSalvar} carregando={salvando} />
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
  titulo: { fontSize: 18, fontWeight: '700', color: cores.texto, marginBottom: espaco.md },
  rotulo: { fontSize: 14, color: cores.textoSecundario, marginBottom: espaco.xs },
  secao: {
    fontSize: 15,
    fontWeight: '600',
    color: cores.texto,
    marginTop: espaco.lg,
    marginBottom: espaco.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: raio.sm,
    padding: espaco.md,
    fontSize: 16,
    color: cores.texto,
    marginBottom: espaco.md,
  },
  inputMultilinha: { minHeight: 90, textAlignVertical: 'top' },
  foto: {
    width: '100%',
    aspectRatio: 4 / 3,
    maxHeight: 320,
    borderRadius: raio.sm,
    marginBottom: espaco.xs,
  },
  coords: { fontSize: 13, color: cores.textoSecundario, marginTop: espaco.xs },
  espacoSalvar: { height: espaco.lg },
});

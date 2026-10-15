import * as ImagePicker from 'expo-image-picker';

// Possíveis resultados de uma tentativa de captura.
export const ResultadoCamera = {
  OK: 'ok',
  CANCELADO: 'cancelado',
  NEGADO: 'negado', // negou, mas o sistema ainda pode perguntar de novo
  BLOQUEADO: 'bloqueado', // "Não perguntar novamente" (canAskAgain: false)
  INDISPONIVEL: 'indisponivel', // sem câmera / erro de hardware
};

/**
 * NÍVEL JÚNIOR - Solicita permissão e abre a câmera.
 * Nunca lança exceção: sempre devolve um objeto { status, uri? }
 * para que a tela decida qual mensagem mostrar (RNF01).
 */
export async function capturarFoto() {
  let permissao;
  try {
    permissao = await ImagePicker.requestCameraPermissionsAsync();
  } catch {
    return { status: ResultadoCamera.INDISPONIVEL };
  }

  if (!permissao.granted) {
    // canAskAgain === false → o usuário marcou "Não perguntar novamente"
    return {
      status: permissao.canAskAgain ? ResultadoCamera.NEGADO : ResultadoCamera.BLOQUEADO,
    };
  }

  try {
    const resultado = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.5,
    });

    if (resultado.canceled || !resultado.assets?.length) {
      return { status: ResultadoCamera.CANCELADO };
    }
    return { status: ResultadoCamera.OK, uri: resultado.assets[0].uri };
  } catch {
    // Ex.: emulador sem câmera
    return { status: ResultadoCamera.INDISPONIVEL };
  }
}

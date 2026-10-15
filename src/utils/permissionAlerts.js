import { Alert, Linking, Platform } from 'react-native';

// NÍVEL JÚNIOR - Alertas de permissão da câmera.
// Ficam separados do serviço para que a lógica (cameraService) não dependa de UI.

const ROTULO_CONFIG = Platform.OS === 'ios' ? 'Abrir Ajustes' : 'Abrir configurações';

const PASSOS_CONFIG =
  Platform.OS === 'ios'
    ? '1. Toque em "Abrir Ajustes"\n' +
      '2. Ative a chave "Câmera"\n' +
      '3. Volte ao app e toque em "Tirar foto" novamente.'
    : '1. Toque em "Abrir configurações"\n' +
      '2. Entre em "Permissões"\n' +
      '3. Toque em "Câmera" e escolha "Permitir"\n' +
      '4. Volte ao app e toque em "Tirar foto" novamente.';

async function abrirConfiguracoes() {
  try {
    await Linking.openSettings();
  } catch {
    Alert.alert(
      'Não foi possível abrir as configurações',
      'Abra manualmente: Configurações > Apps > (este app) > Permissões > Câmera.'
    );
  }
}

/**
 * Exibido quando canAskAgain === false.
 * O sistema NÃO mostra mais o pedido de permissão, então a única saída
 * é o usuário liberar manualmente nas configurações do aparelho.
 */
export function alertaCameraBloqueada() {
  Alert.alert(
    'Acesso à câmera bloqueado',
    'Você marcou "Não perguntar novamente", então o sistema não vai mais exibir o pedido de permissão.\n\n' +
      'Para liberar a câmera manualmente:\n' +
      PASSOS_CONFIG,
    [
      { text: 'Agora não', style: 'cancel' },
      { text: ROTULO_CONFIG, onPress: abrirConfiguracoes },
    ]
  );
}

/** Exibido quando a permissão foi negada, mas ainda pode ser pedida de novo. */
export function alertaCameraNegada() {
  Alert.alert(
    'Permissão necessária',
    'A câmera é usada para registrar a foto da visita. Toque em "Tirar foto" novamente e escolha "Permitir".'
  );
}

/** Exibido quando o aparelho não tem câmera ou ela falhou (RNF01). */
export function alertaCameraIndisponivel() {
  Alert.alert(
    'Câmera indisponível',
    'Não foi possível acessar a câmera deste aparelho. Você ainda pode salvar a visita sem foto.'
  );
}

# 🌱 Registro de Visitas Técnicas Agrícolas

Aplicativo mobile em **React Native + Expo** para registrar visitas técnicas a propriedades rurais com **foto (câmera)**, **localização (GPS)** e **histórico salvo no próprio aparelho**, funcionando mesmo sem internet.

Projeto desenvolvido para a atividade prática **The Code Challenge — Hardware & Recursos Nativos**.

| | |
|---|---|
| **Aluno** | _Seu nome completo_ |
| **Nível escolhido** | 🟢 **Júnior** — Tratamento avançado de permissões negadas |
| **Vídeo de apresentação** | _cole aqui o link do vídeo_ |
| **Repositório** | _cole aqui o link do repositório_ |

---

## 📋 Sumário

1. [Funcionalidades](#-funcionalidades)
2. [Atendimento aos requisitos](#-atendimento-aos-requisitos)
3. [Tecnologias](#-tecnologias)
4. [Estrutura do projeto](#-estrutura-do-projeto)
5. [Como executar](#-como-executar)
6. [Como testar cada requisito](#-como-testar-cada-requisito)
7. [Decisões técnicas](#-decisões-técnicas)
8. [Limitações conhecidas](#-limitações-conhecidas)
9. [Uso de Inteligência Artificial](#-uso-de-inteligência-artificial)

---

## ✨ Funcionalidades

- Cadastro de visita com nome do produtor/propriedade e observações.
- Captura de foto pela câmera do aparelho.
- Captura de localização com indicador colorido de precisão do GPS.
- Histórico de visitas salvo localmente (AsyncStorage), com exclusão individual ou total.
- Mensagens amigáveis quando GPS, câmera ou permissões não estão disponíveis.
- Layout que se adapta a celulares, tablets, modo retrato e paisagem.

---

## ✅ Atendimento aos requisitos

### Nível Júnior — Tratamento avançado de permissões negadas

**Onde:** `src/services/cameraService.js` e `src/utils/permissionAlerts.js`

Ao tocar em **Tirar foto**, o app chama `ImagePicker.requestCameraPermissionsAsync()` e analisa o retorno:

| Situação | Retorno da permissão | O que o app faz |
|---|---|---|
| Permitiu | `granted: true` | Abre a câmera normalmente. |
| Negou uma vez | `granted: false`, `canAskAgain: true` | Explica para que serve a câmera e pede para tentar de novo. |
| **Marcou "Não perguntar novamente"** | `granted: false`, **`canAskAgain: false`** | Mostra **passo a passo** para liberar a câmera e um botão **"Abrir configurações"** que chama `Linking.openSettings()`. |
| Aparelho sem câmera / erro | exceção | Informa que a câmera está indisponível e permite salvar sem foto. |

O ponto central: quando `canAskAgain` é `false`, o sistema operacional **não exibe mais** o pedido de permissão. Um alerta genérico ("permissão negada") deixaria o usuário sem saída, por isso o app o leva direto à tela de configurações, com instruções específicas para Android e iOS.

```js
// src/services/cameraService.js
if (!permissao.granted) {
  return {
    status: permissao.canAskAgain ? ResultadoCamera.NEGADO : ResultadoCamera.BLOQUEADO,
  };
}
```

### RF01 — Histórico Local e Persistência

**Onde:** `src/services/storageService.js` e `src/screens/HomeScreen.js`

- As visitas são salvas no **AsyncStorage** como uma lista JSON, na chave `@visitas_tecnicas:v1`.
- O histórico é carregado ao abrir o app (`useEffect` na `HomeScreen`).
- Como os dados ficam no próprio aparelho, o histórico pode ser consultado **sem internet**.
- Se o dado salvo estiver corrompido, o app começa com a lista vazia em vez de travar.

### RF02 — Feedback Visual de Precisão do GPS

**Onde:** `src/utils/gpsPrecision.js` e `src/components/PrecisionIndicator.js`

O valor `coords.accuracy` do `expo-location` é o raio de erro em metros (quanto menor, melhor):

| Precisão | Cor | Rótulo |
|---|---|---|
| menor que 10 m | 🟢 Verde | Alta precisão |
| de 10 m a 30 m | 🟡 Amarelo | Média precisão |
| maior que 30 m | 🔴 Vermelho | Baixa precisão |
| sem leitura | ⚪ Cinza | Sem localização |

O indicador mostra **cor + texto + valor em metros**, para não depender apenas da cor (acessibilidade). A precisão também fica salva em cada visita e aparece no histórico.

### RNF01 — Degradação Graciosa e Tratamento de Erros

**Onde:** todos os arquivos de `src/services/` e `src/components/StatusMessage.js`

Os serviços **nunca lançam exceção para a tela**: sempre devolvem um objeto `{ status, ... }`, e a interface decide qual mensagem mostrar.

| Cenário | Comportamento |
|---|---|
| GPS desligado | `Location.hasServicesEnabledAsync()` detecta e mostra aviso pedindo para ativar. |
| Permissão de localização negada ou bloqueada | Mensagem explicando como liberar. |
| GPS demorando demais | Tempo limite de 15 s e sugestão de ir para área aberta. |
| Aparelho sem câmera (ex.: emulador) | Alerta informando, e a visita pode ser salva sem foto. |
| Falha ao ler/gravar o armazenamento | Alerta ou aviso, sem fechar o app. |

### RNF02 — UI/UX Responsiva

**Onde:** `src/hooks/useOrientation.js` e `src/screens/HomeScreen.js`

- `useWindowDimensions()` é atualizado automaticamente quando o aparelho gira.
- **Retrato (celular):** formulário e histórico empilhados.
- **Paisagem ou tablet (≥ 768 px):** formulário e histórico lado a lado.
- Largura máxima de 1100 px para o conteúdo não esticar demais em telas grandes.
- Foto com `aspectRatio` e largura de 100%, sem distorcer.
- Botões com altura mínima de 48 px e texto que se ajusta (`adjustsFontSizeToFit`).
- `SafeAreaView` evita que o conteúdo fique sob o notch ou a barra de status.
- Tudo dentro de `ScrollView`, então nada é cortado em telas pequenas.

---

## 🛠 Tecnologias

| Tecnologia | Uso |
|---|---|
| [Expo](https://expo.dev) (SDK 54) | Base do projeto e execução no Expo Go |
| React Native | Interface |
| `expo-image-picker` | Câmera e permissão da câmera |
| `expo-location` | GPS, permissão e precisão |
| `@react-native-async-storage/async-storage` | Persistência local (RF01) |
| `react-native-safe-area-context` | Áreas seguras da tela (RNF02) |
| `expo-status-bar` | Barra de status |

---

## 📁 Estrutura do projeto

```
visitas-agricolas/
├── App.js                        # Componente raiz (providers + tela inicial)
├── index.js                      # Ponto de entrada (registerRootComponent)
├── app.json                      # Configuração do Expo e textos de permissão
├── package.json                  # Dependências e scripts
├── .gitignore
├── README.md
└── src/
    ├── constants/
    │   └── theme.js              # Cores, espaçamentos e breakpoints
    ├── hooks/
    │   └── useOrientation.js     # RNF02 - detecta orientação/tamanho da tela
    ├── services/                 # Acesso a hardware e dados (sem UI)
    │   ├── cameraService.js      # NÍVEL JÚNIOR - permissão + câmera
    │   ├── locationService.js    # RF02/RNF01 - GPS com tratamento de erros
    │   └── storageService.js     # RF01 - AsyncStorage
    ├── utils/
    │   ├── gpsPrecision.js       # RF02 - regra de cores da precisão
    │   └── permissionAlerts.js   # NÍVEL JÚNIOR - alertas e abrir configurações
    ├── components/               # Peças reutilizáveis de interface
    │   ├── PrimaryButton.js
    │   ├── PrecisionIndicator.js # RF02 - indicador colorido
    │   ├── StatusMessage.js      # RNF01 - mensagens amigáveis
    │   ├── VisitCard.js          # Item do histórico
    │   ├── VisitForm.js          # Formulário de nova visita
    │   └── VisitHistory.js       # RF01 - lista de visitas salvas
    └── screens/
        └── HomeScreen.js         # Tela principal e layout responsivo
```

**Organização em camadas:**

- **services/** conversam com o hardware e o armazenamento e devolvem resultados simples.
- **utils/** guardam regras puras e alertas reutilizáveis.
- **components/** só cuidam de exibir dados e repassar ações.
- **screens/** juntam tudo e controlam o estado da tela.

Assim, trocar o AsyncStorage por SQLite, por exemplo, mexeria só no `storageService.js`.

---

## 🚀 Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org) 20 ou superior
- App **Expo Go** no celular ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Celular e computador na **mesma rede Wi-Fi**

### Passo a passo

```bash
# 1. Clonar o repositório
git clone <link-do-repositorio>
cd visitas-agricolas

# 2. Instalar as dependências
npm install

# 3. Alinhar as versões das bibliotecas com o SDK do Expo
npx expo install --fix

# 4. Iniciar o servidor de desenvolvimento
npx expo start
```

Depois, leia o QR code com o **Expo Go** (Android) ou com a **câmera** (iOS).

> **Se o Expo Go disser que o projeto é de um SDK incompatível**, atualize o projeto para o SDK mais recente:
> ```bash
> npx expo install expo@latest
> npx expo install --fix
> ```

> **Dica:** se o celular não conectar pela rede, use `npx expo start --tunnel`.

---

## 🧪 Como testar cada requisito

Recomenda-se testar em **celular físico**, pois emuladores não têm câmera real nem GPS preciso.

> **Observação sobre o Expo Go:** as permissões pertencem ao app **Expo Go**. Para "resetar" os testes, vá em *Configurações > Apps > Expo Go > Permissões*.

| # | Requisito | Passos | Resultado esperado |
|---|---|---|---|
| 1 | Fluxo normal | Preencher o nome, tirar foto, capturar localização e salvar. | Visita aparece no topo do histórico com foto e indicador de precisão. |
| 2 | **Júnior** – negar uma vez | Tocar em "Tirar foto" e negar. | Alerta explicando por que a câmera é necessária. |
| 3 | **Júnior** – bloqueio | Negar marcando "Não perguntar novamente" (no Android, negar duas vezes) e tocar em "Tirar foto". | Alerta com passo a passo e botão **"Abrir configurações"** que leva à tela de permissões. |
| 4 | **RF01** | Salvar visitas, ativar o **modo avião**, fechar e reabrir o app. | Histórico continua disponível. |
| 5 | **RF02** | Capturar a localização em ambiente fechado e depois ao ar livre. | Cor muda conforme a precisão (vermelho/amarelo → verde). |
| 6 | **RNF01** – GPS | Desligar a localização do aparelho e tocar em "Capturar localização". | Aviso amigável, sem travar. |
| 7 | **RNF01** – câmera | Rodar em um emulador sem câmera e tocar em "Tirar foto". | Alerta de câmera indisponível; a visita pode ser salva sem foto. |
| 8 | **RNF02** | Girar o aparelho. | Em paisagem, formulário e histórico ficam lado a lado, sem cortes. |

---

## 💡 Decisões técnicas

- **AsyncStorage em vez de SQLite:** o volume de dados é pequeno (dezenas ou centenas de visitas), e o AsyncStorage é mais simples de configurar e de explicar.
- **`expo-image-picker` em vez de `expo-camera`:** usa a câmera nativa do sistema, com menos código de interface, e o retorno da permissão já traz `canAskAgain`.
- **Serviços que devolvem `status`:** evitam `try/catch` espalhado pelas telas e tornam cada situação de erro explícita.
- **Tempo limite no GPS:** `getCurrentPositionAsync` pode demorar muito em locais fechados; 15 s evita que o botão fique carregando para sempre.
- **Indicador com cor e texto:** cumpre o RF02 sem depender só da cor.

---

## ⚠️ Limitações conhecidas

- A foto é referenciada pelo endereço temporário devolvido pela câmera. Se o sistema limpar o cache do app, a miniatura de visitas antigas pode deixar de aparecer, mas os demais dados continuam salvos. Uma melhoria futura seria copiar a imagem para a pasta permanente do app com `expo-file-system`.
- O histórico é exibido com `.map()` dentro de um `ScrollView`, adequado para dezenas de registros. Para milhares, o ideal seria uma `FlatList`.
- Não há sincronização com servidor; os dados existem apenas no aparelho.

---

## 🤖 Uso de Inteligência Artificial

Conforme permitido pela atividade, foi utilizada IA (Claude) como assistente para gerar a estrutura inicial e partes do código. Todo o código foi revisado, executado e testado no aparelho, e as decisões técnicas estão explicadas neste README e no vídeo de apresentação.

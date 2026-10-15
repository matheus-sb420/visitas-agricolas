import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent chama AppRegistry.registerComponent('main', () => App)
// e garante o funcionamento tanto no Expo Go quanto em builds nativos.
registerRootComponent(App);

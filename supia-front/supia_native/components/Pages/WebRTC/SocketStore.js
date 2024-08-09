// websocketStore.js
import {create} from 'zustand';

const useWebSocketStore = create(set => ({
  websocket: null,
  connect: (url, token) => {
    const websocket = new WebSocket(url);
    websocket.onopen = () => {
      console.log('WebSocket connected');
      const authMessage = {type: 'authenticate', token};
      websocket.send(JSON.stringify(authMessage));
    };
    websocket.onclose = () => {
      console.log('WebSocket disconnected');
    };
    websocket.onerror = error => {
      console.error('WebSocket error:', error);
    };
    set({websocket});
    return websocket;
  },
}));

export default useWebSocketStore;

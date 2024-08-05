// Socket용 서버
// cd supia_native\components\Pages\WebRTC
// node server.js로 구동

const WebSocket = require('ws');
const wss = new WebSocket.Server({port: 8080});

const clients = {}; // 사용자 ID와 웹소켓 연결을 저장하는 객체

// 웹소켓 연결 처리
wss.on('connection', ws => {
  let userId;

  ws.on('message', message => {
    const parsedMessage = JSON.parse(message);
    const {type, data} = parsedMessage;

    if (type === 'register') {
      // 사용자가 로그인할 때
      userId = data.userId;
      if (userId) {
        clients[userId] = ws; // 클라이언트 연결을 저장
        console.log(`User ${userId} registered`);
      }
    } else if (type === 'offer' || type === 'answer' || type === 'ice') {
      // 사용자가 등록된 경우에만 메시지 전송
      if (userId && clients[data.targetId]) {
        clients[data.targetId].send(message); // 특정 사용자에게 메시지 전송
      }
    }
  });

  ws.on('close', () => {
    if (userId) {
      delete clients[userId]; // 사용자 연결 삭제
      console.log(`User ${userId} disconnected`);
    }
  });
});

console.log('WebSocket server is running on ws://localhost:8080');

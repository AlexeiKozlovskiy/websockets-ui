import { httpServer } from './src/http_server';
import { websocketServer } from './src/ws_server/server';

const HTTP_PORT = 8181;
const WS_PORT = Number(process.env.PORT) || 3000;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
websocketServer(WS_PORT);

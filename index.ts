import { httpServer } from './src/http_server';
import { websocketServer } from './src/ws_server/server';

const HTTP_PORT = 8181;
const DEFAULT_PORT = 3000;
const WS_PORT = Number(process.env.PORT) || DEFAULT_PORT;

console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
websocketServer(WS_PORT);
console.log('http://localhost:8181/');


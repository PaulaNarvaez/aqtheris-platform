import {defineConfig} from 'vite';
// Preserve the browser-facing host so the API's same-origin check remains valid.
export const apiProxy={target:'http://127.0.0.1:3001',changeOrigin:false,configure(proxy){proxy.on('proxyReq',(proxyReq,req)=>{if(req.headers.host)proxyReq.setHeader('host',req.headers.host)})}};
export default defineConfig({server:{host:'0.0.0.0',proxy:{'/api':apiProxy}}});

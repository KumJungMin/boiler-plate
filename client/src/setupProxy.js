const {createProxyMiddleware} = require('http-proxy-middleware');
// https://www.inflearn.com/questions/28710


module.exports = function(app) {

  app.use(
  
  '/api',
  
  createProxyMiddleware({
  
  target: 'http://localhost:5000',
  
  changeOrigin: true,
  
  })
  
  );
  
  };


// module.exports = function(app){
//     app.use(
//         '/api',    // /api/뭐시기라고 하면 백엔드에게 요청보내기가 가능
//         createProxyMiddleware({
//           target: 'http://localhost:5000',  
//           //백엔드 서버가 5000번이니까, 타겟도 5000번
//           //프론트엔드 3000번에서 줄 때 -> 타겟을 5000번으로 하겠다
//           changeOrigin: true,
//         })
//       );
// }
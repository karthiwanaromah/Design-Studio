import { createServer } from 'vite';

async function startVite() {
  const server = await createServer({
    server: {
      host: '0.0.0.0',
      port: 5000,
    },
  });
  
  await server.listen();
  server.printUrls();
}

startVite();

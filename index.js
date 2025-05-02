import dotenv from 'dotenv';
import server from './src/app.js';

const { PORT } = process.env;
dotenv.config();

async function main() {
  try {
    server.listen(PORT || 3000, () => {
      console.log(`SERVER is listening at port ${PORT || 3000}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}
main();

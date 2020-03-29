import { connect, connection } from 'mongoose';
const URI = process.env.MONGO_URI || 'mongodb://localhost/db_test';
import { configDB } from './key';

connect(URI, configDB);

const cn = connection;

cn.once('open', () => {
  console.log('Database is connected ' + URI);
});

cn.on('error', (error) => {
  console.log('Error:', error);
});

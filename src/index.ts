import app from './app';
const port = process.env.PORT || 3000;
function main() {
  app.listen(port);
  console.log(`server on port ${port}`);
}
main();

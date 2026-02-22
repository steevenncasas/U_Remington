const { app } = require("./app");
const { env } = require("./config/env");

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
  console.log(`Login: http://localhost:${env.port}/login`);
});

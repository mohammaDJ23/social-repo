const app = require("./src/app");
const pool = require("./src/pool");

async function bootstrap() {
  try {
    await pool.connect({
      host: "localhost",
      port: 5432,
      database: "socialnetwork",
      user: "postgres",
      password: "fsiFJOIDW23493854"
    });

    app().listen(3005, () => {
      console.log("listening to 3005");
    });
  } catch (error) {
    console.error(error);
  }
}

bootstrap();

import {ApplicationConfig, DrobiServerApplication} from './application';
export * from './application';

import dotenv from 'dotenv';
import Airtable from 'airtable';

import {bot} from './bot';

const cors = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400,
  credentials: true,
};

export async function main(options: ApplicationConfig = {}) {
  const app = new DrobiServerApplication(options);
  await app.boot();
  await app.start();
  dotenv.config();

  const url = app.restServer.url;
  console.info(`Server is running at ${url}`);

  Airtable.configure({apiKey: undefined});

  await bot.start();

  return app;
}

if (require.main === module) {
  const config = {
    rest: {
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST ?? '0.0.0.0',
      gracePeriodForClose: 5000, // 5 seconds
      openApiSpec: {
        setServersFromRequest: true,
      },
      cors: {
        ...cors,
      },
    },
  };
  main(config).catch(err => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}

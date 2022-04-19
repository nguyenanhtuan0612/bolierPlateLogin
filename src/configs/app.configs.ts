import { Dialect } from 'sequelize/types';

export default () => ({
    port: parseInt(process.env.PORT) || 5000,
    appUrl: process.env.APP_URL,
    postgres: {
        dialect: 'postgres' as Dialect,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        logging: process.env.DB_LOGGING == 'true' ? true : false,
        synchronize: process.env.DB_SYNC == 'true' ? true : false,
        autoLoadModels: process.env.DB_AUTO_LOAD == 'true' ? true : false,
    },
    google: {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_SECRET_KEY,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
});

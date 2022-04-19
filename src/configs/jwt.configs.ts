export default () => ({
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshTokenKey: process.env.JWT_REFRESH_TOKEN_KEY,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    jwtExpiresForgotPassword: process.env.JWT_EXPIRES_FORGOT_PASSWORD,
});

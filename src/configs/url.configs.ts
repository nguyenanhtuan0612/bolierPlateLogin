export default () => ({
    baseUrl: process.env.APP_URL || 'http://103.28.38.94:28449',
    mediaUrl: process.env.APP_MEDIA_URL || 'http://103.28.38.94:28004',
    mailUrl: {
        send: process.env.APP_URL + '/kong/mail/api/v1/mail',
    },
});

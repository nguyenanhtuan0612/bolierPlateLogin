export default () => ({
    username: process.env.RMQ_USERNAME,
    password: process.env.RMQ_PASSWORD,
    queue: process.env.RMQ_QUEUE,
    url: process.env.RMQ_URL,
    clientList: {
        mail: 'mailService',
        partition: 'partitionService',
    },
    queueList: {
        mail: process.env.RMQ_MAIL_QUEUE,
        partition: process.env.RMQ_PARTITION_QUEUE,
    },
});

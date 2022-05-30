const redis = require('redis');

const client = redis.createClient({
    //url: 'redis://192.168.10.70:6379',
});
client.on('error', (err) => console.log('[REDIS] Error', err));
client.on('connect', () => console.log('[REDIS] Connected'));
client.on('ready', async () => console.log('[REDIS] Ready'));
client.connect();

module.exports = {
    client,
};

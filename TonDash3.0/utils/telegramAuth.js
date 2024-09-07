const crypto = require('crypto');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

function checkTelegramAuth(data) {
  const authData = data;
  const checkHash = authData.hash;
  delete authData.hash;

  const secret = crypto.createHash('sha256').update(BOT_TOKEN).digest();
  const sortedData = Object.keys(authData)
    .sort()
    .map((key) => `${key}=${authData[key]}`)
    .join('\n');
  const hash = crypto
    .createHmac('sha256', secret)
    .update(sortedData)
    .digest('hex');

  return hash === checkHash;
}

module.exports = checkTelegramAuth;

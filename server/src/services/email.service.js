import sgMail from '@sendgrid/mail';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

if (env.sendgrid.apiKey) {
  sgMail.setApiKey(env.sendgrid.apiKey);
}

/**
 * Sem chave do SendGrid configurada (ambiente local sem segredo de terceiros),
 * cai para log no console em vez de falhar — evita bloquear o fluxo de dev,
 * mas em produção (isProduction) um envio ausente ainda deve ser tratado como
 * erro pelo chamador, que já captura a rejeição da Promise.
 */
const send = async ({ devPreview, ...msg }) => {
  if (!env.sendgrid.apiKey) {
    // `devPreview` (link/código em texto puro) só é logado aqui, nunca via
    // sgMail — evita que segredos de ativação/reset acabem em logs de produção.
    logger.warn('SENDGRID_API_KEY ausente — email não enviado, exibindo no log (apenas dev).', {
      to: msg.to,
      subject: msg.subject,
      devPreview,
    });
    return;
  }
  await sgMail.send(msg);
};

const layout = (title, bodyHtml) => `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8" /><title>${title}</title></head>
<body style="font-family: Arial, sans-serif; background-color: #FFF8EE; padding: 20px; margin:0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 480px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden;">
    <tr><td style="background:#FF7A00; padding: 20px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:20px;">Zap List</h1>
    </td></tr>
    <tr><td style="padding: 24px; color:#1E1E1E; font-size:15px; line-height:1.6;">${bodyHtml}</td></tr>
    <tr><td style="text-align:center; font-size:12px; color:#666666; padding: 16px;">
      © ${new Date().getFullYear()} Zap List. Todos os direitos reservados.
    </td></tr>
  </table>
</body>
</html>`;

export const emailService = {
  sendActivationEmail(email, activationToken) {
    const deepLink = `${env.appScheme}://activate?token=${activationToken}`;
    return send({
      to: email,
      from: env.sendgrid.fromEmail,
      subject: 'Ative sua conta Zap List',
      devPreview: deepLink,
      html: layout(
        'Ativação de conta',
        `<p>Bem-vindo ao Zap List! Toque no botão abaixo pelo seu celular para ativar sua conta:</p>
         <p style="text-align:center; margin: 28px 0;">
           <a href="${deepLink}" style="background:#FF7A00; color:#fff; padding:12px 24px; border-radius:8px; text-decoration:none; font-weight:600;">Ativar conta</a>
         </p>
         <p style="color:#666666; font-size:13px;">Se você não criou esta conta, ignore este email. Este link expira em 24 horas.</p>`
      ),
    });
  },

  sendPasswordResetCode(email, code) {
    return send({
      to: email,
      from: env.sendgrid.fromEmail,
      subject: 'Código para redefinir sua senha',
      devPreview: code,
      html: layout(
        'Recuperação de senha',
        `<p>Use o código abaixo no app para redefinir sua senha:</p>
         <p style="text-align:center; font-size:28px; font-weight:700; letter-spacing:6px; color:#FF7A00; background:#FFF8EE; padding:14px; border-radius:8px; margin: 24px 0;">${code}</p>
         <p style="color:#666666; font-size:13px;">Este código expira em 10 minutos. Se você não solicitou, ignore este email — sua senha continua segura.</p>`
      ),
    });
  },
};

import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmail = (
  to: string,
  subject: string,
  name: string,
  token?: string
) => {
  const currentYear = new Date().getFullYear();
  let html = `
    <html lang="es">
      <head>
        <title>Reset Password</title>
      </head>
      <body>
        <div style="color: #121519; text-align:justify;">`;
  html += `<p>Hola <span style="font-weight: bold;">${name}</span>, `;
  html += token
    ? `hemos recibido una petición para reestablecer su contraseña.</p>`
    : `su contraseña se ha reestablecido.</p>`;
  html += `<hr style="opacity: .20; margin: 1rem 0;" />`;
  html += token
    ? `<p>Haz clic en el botón de abajo y crea una nueva contraseña. Si no solicitaste restablecer tu contraseña, ignora este correo electrónico. En caso de que hayas recibido más de un correo, debes utilizar el último que te llegó.</p>
    <p>Este enlace dejará de ser útil en las próximas 4 horas. Por favor, asegúrate de utilizarlo antes de que expire.</p>
      <div style="text-align:center; margin-top: 2rem;">
        <a href="${process.env.FRONTEND_URL}reset-password/${token}" style="background: #192c7b; color: #eee; margin: 1rem 0;padding: .8rem; border-radius: .5rem; cursor: pointer; text-decoration:none;">Reestablecer contraseña</a>
      </div>`
    : `<p>Ahora puede iniciar sesión con su nueva contraseña.</p>
          <div style="text-align:center; margin-top: 2rem;">
        <a href="${process.env.FRONTEND_URL}" style="background: #192c7b; color: #eee; margin: 1rem 0;padding: .8rem; border-radius: .5rem; cursor: pointer; text-decoration:none;">Iniciar sesión</a>
      </div>`;
  html += `<hr style="opacity: .20; margin: 1rem 0;" />
          <div style="text-align:center;">
          <span>© ${currentYear} CCIOD Technologies,  Todos los derechos reservados.</span>
          </div>
        </div>
        </body>
      </html>`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};

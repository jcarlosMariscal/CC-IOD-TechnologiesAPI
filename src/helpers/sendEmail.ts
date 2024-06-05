import { Response } from "express";
import * as nodemailer from "nodemailer";
import { resolve } from "path";

const transporter = nodemailer.createTransport({
  service: "Gmail", // o cualquier otro servicio de correo que utilices
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER, // tu correo
    pass: process.env.MAIL_PASSWORD, // tu contraseña
  },
});

export const sendEmail = (
  to: string,
  subject: string,
  name: string,
  token?: string
) => {
  let content = `<html lang="es">
        <head>
          <title>Reset Password</title>
        </head>
        <body>
        <div style="text-align:center;background:#192c7b;">
          <img src="cid:uniqueImageCID" alt="Logo CCIOD Technologies" />
        </div>
        <div style="color: #121519; text-align:justify;">`;
  content += `<p>Hola, <span style="font-weight: bold;">${name}</span>, `;
  content += token
    ? `hemos recibido una petición para reestablecer su contraseña.</p>`
    : `su contraseña se ha reestablecido.</p>`;
  content += `<hr style="opacity: .20; margin: 1rem 0;" />`;
  content += token
    ? `<p>Haz clic en el botón de abajo y crea una nueva contraseña. Si no solicitaste restablecer tu contraseña, ignora este correo electrónico. En caso de que hayas recibido más de un correo, debes utilizar el último que te llegó.</p>
          <div style="text-align:center; margin-top: 2rem;">
          <a href="${process.env.FRONTEND_URL}reset-password/${token}" style="background: #192c7b; color: #eee; margin: 1rem 0;padding: .8rem; border-radius: .5rem; cursor: pointer; text-decoration:none;">Reestablecer contraseña</a>
          </div>`
    : `<p>Ahora puede iniciar sesión con su nueva contraseña.</p>
          <div style="text-align:center; margin-top: 2rem;">
          <a href="${process.env.FRONTEND_URL}" style="background: #192c7b; color: #eee; margin: 1rem 0;padding: .8rem; border-radius: .5rem; cursor: pointer; text-decoration:none;">Iniciar sesión</a>
          </div>`;
  content += `<hr style="opacity: .20; margin: 1rem 0;" />
          <div style="text-align:center;">
          <span>© 2024 CCIOD,  Todos los derechos reservados.</span>
          </div>
        </div>
        </body>
      </html>`;
  const mailOptions = {
    from: process.env.MAIL_USER,
    to,
    subject,
    html: content,
    attachments: [
      {
        filename: "cciod-technologies.png",
        path: __dirname + "../../assets/cciod-technologies.png",
        cid: "uniqueImageCID", // Referenced in the HTML template
      },
    ],
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, response) => {
      if (err) {
        reject(err);
      } else {
        resolve(response);
      }
      // if (err) {
      //   return res.status(400).json({
      //     success: false,
      //     message: "Ocurrió un error al intentar enviar el correo.",
      //   });
      // } else {
      //   return res.status(201).json({
      //     success: true,
      //     message: "Correo enviado correctamente.",
      //   });
      // }
    });
  });
};

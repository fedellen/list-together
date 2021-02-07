import nodemailer from 'nodemailer';

export async function sendEmail(email: string, url: string) {
  const account = await nodemailer
    .createTestAccount()
    .catch((err) => console.log(JSON.stringify(err, null, 4)));

  if (!account) {
    console.log(
      'test account could not be made, here is the url anyway: ',
      url
    );
    return;
  }

  const transporter = nodemailer.createTransport({
    // // production email via SMTP
    // host: process.env.EMAIL_URL,
    // secure: true, // true for 465, false for other ports
    // auth: {
    //   user: process.env.EMAIL_USERNAME,
    //   pass: process.env.EMAIL_PASSWORD
    // }

    // test email
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: account.user, // generated ethereal user
      pass: account.pass // generated ethereal password
    },
    tls: { rejectUnauthorized: false }
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: email, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: `<a href="${url}">${url}</a>` // html body
  };

  const info = await transporter.sendMail(mailOptions);

  console.log('Message sent: %s', info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

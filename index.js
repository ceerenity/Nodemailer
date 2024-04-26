const { google } = require('googleapis');
const path = require('path');
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "xxxx",
    pass: "xxxx",
  },
  });

const getDriveService = () => {
  const KEYFILEPATH = path.join(__dirname, 'credentials.json');
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};
const drive = getDriveService();

drive.files.export(
  {
    fileId: "xxxxx",
    mimeType: "application/pdf",
  },
  {
    responseType: "stream",
  }
).then((res) => {
  console.log(res);
   main(res.data).catch(console.error);
 
  });


  async function main(res) {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'xxxxxx', // sender address
      to: "xxxxxxx", // list of receivers
      subject: "Hello", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>", // html body
      attachments: [{
        filename: "MyFile.pdf",
        content: res,
        encoding: "base64",
        contentType: "application/pdf",
      }]
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  }


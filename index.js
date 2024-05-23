const express = require('express');
const bodyParser = require('body-parser');
const PHPMailer = require('phpmailer');

const app = express();
const port = 3000;

// Configuração do servidor de e-mail
const mail = new PHPMailer(true);
mail.isSMTP();
mail.Host = 'smtp.office365.com';
mail.SMTPAuth = true;
mail.Username = 'rifapremiada2024@outlook.com.br';
mail.Password = 'YAGAMI2003';
mail.SMTPSecure = 'tls';
mail.Port = 587;
mail.CharSet = 'UTF-8';

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/enviarEmail', (req, res) => {
    try {
        const codigo = Math.floor(Math.random() * 9000) + 1000;

        // Validação de entrada
        const campoEmail = req.body.campoEmail;
        if (!campoEmail || !campoEmail.includes('@')) {
            throw new Error('Endereço de email inválido.');
        }

        const emailCliente = campoEmail;
        mail.setFrom('rifapremiada2024@outlook.com.br', 'Rifa online');
        mail.addAddress(emailCliente);

        mail.isHTML(true);
        mail.Subject = 'Rifa comprada!';
        mail.Body = `
        <html>
        <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background-color: #f2f2f2; padding: 20px; text-align: center; }
            .content { margin: 20px; text-align: center; }
            .footer { background-color: #f2f2f2; padding: 10px; text-align: center; font-size: 12px; }
        </style>
        </head>
        <body>
            <div class="content">
                <p>Parabéns! Você comprou um número.</p>
                <p><strong>Número da Sorte:</strong> ${codigo}</p>
            </div>
            <div class="footer">
                <p>Obrigado por participar. Boa sorte!</p>
            </div>
        </body>
        </html>
        `;
        mail.AltBody = 'Seu número da sorte é: ' + codigo;

        mail.send();

        // Aqui você pode adicionar a função para enviar mensagem para o Telegram
        // enviarMensagemTelegram('Rifa comprada +1 pix - acesse a lara senhor(a)', emailCliente);

        res.redirect('/index.html');
    } catch (error) {
        console.error("Erro ao enviar o código:", error);
        res.status(500).send("Erro ao enviar o código: " + error.message);
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

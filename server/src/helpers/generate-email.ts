export function generateEmail(
    userName: string,
    type: string, 
    details: { 
        confirmationLink?: string; 
        name?: string;
        email?: string;
        message?: string;
    }) {
    const currentYear = new Date().getFullYear();
 
    const emailBodies: { [key: string]: string } = {
        passwordChanged: `
        <p>Buna ${userName},</p>
        <p>Parola ta a fost schimbata cu success.</p>
    `,
        forgotPassword: `
        <p>Buna ${userName},</p>
        <p>Am primit o cerere de resetare a parolei dvs. va rugam sa dati click pe butonul de mai jos</p>
        <p><a href="${details.confirmationLink}" class="button">Resetare Parola</a></p>
    `,

    contactMessage: `
    <p><strong>Bună, Adriana,</strong></p>
   <p>Sperăm că ai o zi frumoasă! 🌞 Ai primit un nou mesaj prin formularul de contact de pe <strong>AgroUtilaj Service</strong>. Mai jos găsești detaliile:</p>
            <div style="padding: 15px; background: #f8f9fa; border-left: 4px solid #4CAF50; margin: 15px 0;">
            <p><strong>👤 Nume:</strong> ${details.name}</p>
            <p><strong>📧 Email:</strong> <a href="mailto:${details.email}" style="color: #4CAF50; text-decoration: none;">${details.email}</a></p>
            <p><strong>✉️ Mesaj:</strong></p>
            <blockquote style="margin: 10px 0; padding-left: 15px; border-left: 3px solid #4CAF50; color: #333;">"${details.message}"</blockquote>
        </div>
    <p>Îți recomandăm să răspunzi cât mai curând posibil pentru a menține o comunicare rapidă și eficientă. 😊</p>
    <p style="margin-top: 20px;">O zi frumoasă în continuare! ☀️</p>
`,

    };

    const emailBody = emailBodies[type] || "<p>Invalid email type provided.</p>";

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AgroUtilaj Service</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 100%;
            margin: 20px auto;
            background: #ffffff;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
        }
        .email-header {
            background-color:rgb(4, 14, 26);
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .email-body {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }
        .email-footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #555555;
        }
        a.button {
            display: inline-block;
            margin: 20px 0;
            padding: 10px 20px;
            color: #ffffff;
            background-color:rgb(6, 14, 22);
            text-decoration: none;
            border-radius: 5px;
        }
        a.button:hover {
            background-color:rgb(1, 5, 8);
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>AgroUtilaj Service</h1>
        </div>
        <div class="email-body">
            ${emailBody}
        </div>
        <div class="email-footer">
            <p>&copy; ${currentYear} AgroUtilaj Service. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
}
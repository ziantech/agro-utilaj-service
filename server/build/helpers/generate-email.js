"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmail = generateEmail;
function generateEmail(userName, type, details) {
    var currentYear = new Date().getFullYear();
    var privacyLink = "https://www.tl-db.com/terms";
    var noaddsLink = 'https://www.tl-db.com/dashboard/purchase?id=addsfree';
    var emailBodies = {
        passwordChanged: "\n        <p>Buna ".concat(userName, ",</p>\n        <p>Parola ta a fost schimbata cu success.</p>\n    "),
        forgotPassword: "\n        <p>Buna ".concat(userName, ",</p>\n        <p>Am primit o cerere de resetare a parolei dvs. va rugam sa dati click pe butonul de mai jos</p>\n        <p><a href=\"").concat(details.confirmationLink, "\" class=\"button\">Resetare Parola</a></p>\n    "),
    };
    var emailBody = emailBodies[type] || "<p>Invalid email type provided.</p>";
    return "<!DOCTYPE html>\n<html>\n<head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>AgroUtilaj Service</title>\n    <style>\n        body {\n            font-family: Arial, sans-serif;\n            margin: 0;\n            padding: 0;\n            background-color: #f4f4f4;\n        }\n        .email-container {\n            max-width: 100%;\n            margin: 20px auto;\n            background: #ffffff;\n            border: 1px solid #ddd;\n            border-radius: 8px;\n            overflow: hidden;\n        }\n        .email-header {\n            background-color:rgb(4, 14, 26);\n            color: #ffffff;\n            text-align: center;\n            padding: 20px;\n        }\n        .email-body {\n            padding: 20px;\n            color: #333333;\n            line-height: 1.6;\n        }\n        .email-footer {\n            background-color: #f4f4f4;\n            text-align: center;\n            padding: 10px;\n            font-size: 12px;\n            color: #555555;\n        }\n        a.button {\n            display: inline-block;\n            margin: 20px 0;\n            padding: 10px 20px;\n            color: #ffffff;\n            background-color:rgb(6, 14, 22);\n            text-decoration: none;\n            border-radius: 5px;\n        }\n        a.button:hover {\n            background-color:rgb(1, 5, 8);\n        }\n    </style>\n</head>\n<body>\n    <div class=\"email-container\">\n        <div class=\"email-header\">\n            <h1>AgroUtilaj Service</h1>\n        </div>\n        <div class=\"email-body\">\n            ".concat(emailBody, "\n        </div>\n        <div class=\"email-footer\">\n            <p>&copy; ").concat(currentYear, " AgroUtilaj Service. All rights reserved.</p>\n        </div>\n    </div>\n</body>\n</html>");
}

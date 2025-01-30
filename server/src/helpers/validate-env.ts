export const validateEnv = () => {
    // List of required environment variables
    const requiredEnvVars = [
        'PORT',
        'MONGO_DB_URI_DEV',
        'CORS_ORIGIN',
        'CORS_METHODS',
        'FRONTEND_URL',
        'EMAIL_USER',
        'EMAIL_PASS',
        'EMAIL_SERVICE'
    ];

    const missingEnvVars: string[] = [];

    requiredEnvVars.forEach((envVar) => {
        if (!process.env[envVar]) {
            missingEnvVars.push(envVar);
        }
    });

    if (missingEnvVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingEnvVars.join(', ')}`
        );
    }

    console.log('All required environment variables are loaded.');
};

// export const validateEnvProd = () => {
//     // List of required environment variables
//     const requiredEnvVars = [
//         'PORT',
//         'MONGO_DB_URI_PROD',
//         'CORS_ORIGIN',
//         'CORS_METHODS',
//         'EMAIL_USER',
//         'EMAIL_PASS',
//         'EMAIL_SERVICE',
//         'JWT_SECRET',
//         'REFRESH_TOKEN_SECRET',
//         'STRIPE_SECRET_KEY',
//         'STRIPE_PRICE_ADDS_FREE'
//         // Add more variables as needed
//     ];

//     const missingEnvVars: string[] = [];

//     requiredEnvVars.forEach((envVar) => {
        
//         if (!process.env[envVar]) {
//             missingEnvVars.push(envVar);
//         }
//     });

//     if (missingEnvVars.length > 0) {
//         throw new Error(
//             `Missing required environment variables: ${missingEnvVars.join(', ')}`
//         );
//     }

//     console.log('All required environment variables are loaded.');
// };

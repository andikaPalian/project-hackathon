import admin from "firebase-admin";
// import "dotenv/config";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

// Note: nanti ganti credentialnya agar dari env bukan dari file jsonnya
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// admin.initializeApp({
//   credential: admin.credential.cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
//   })
// })

export default admin;

export const db = admin.firestore();

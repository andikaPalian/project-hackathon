import admin from "firebase-admin";
import serviceAccount from "../../serviceAccountKey.json" with { type: "json" };

// Note: nanti ganti credentialnya agar dari env bukan dari file jsonnya
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;

export const db = admin.firestore();

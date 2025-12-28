import admin from "firebase-admin";
import "dotenv/config";

const getPrivateKey = () => {
  const base64Key = process.env.FIREBASE_PRIVATE_KEY_BASE64;

  if (base64Key) {
    return Buffer.from(base64Key, "base64").toString("utf8");
  }
  return undefined;
};

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: getPrivateKey(),
};

if (!admin.apps.length && firebaseConfig.privateKey) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig),
  });
}

export const db = admin.firestore();
export default admin;

import admin from "firebase-admin";
import { getAuth as fGetAuth } from "firebase-admin/auth";
import { getFirestore as fGetDatabase } from "firebase-admin/firestore";

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.PROJECT_ID,
      privateKey: process.env.PRIVATE_KEY,
      clientEmail: process.env.CLIENT_EMAIL,
    }),
  });
}

const getAuth = () => fGetAuth(app);
const getDatabase = () => fGetDatabase(app);

export { app, getAuth, getDatabase };

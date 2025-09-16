import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyCCziqCGhoe3PgvMmRKIBn43gs0Kb7XOdI",
  authDomain: "agrowatch-3e97f.firebaseapp.com",
  projectId: "agrowatch-3e97f",
  storageBucket: "agrowatch-3e97f.firebasestorage.app",
  messagingSenderId: "1002091625586",
  appId: "1:1002091625586:web:8fee6d23e3311edc0d96eb",
  measurementId: "G-LBP7FDSLSF"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Connect to emulator in development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, "localhost", 5001);
}

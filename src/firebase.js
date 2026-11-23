// Social sign-in (Google / Facebook / GitHub) via Firebase Authentication.
// The web client config is public by design (it only identifies the Firebase
// project, it is not a password), but it is kept out of the repo anyway and
// injected at build time through the VITE_FIREBASE_CONFIG environment
// variable. Paste the whole snippet from the Firebase console as-is; the
// parser below tolerates the surrounding JavaScript.
// Email/password sign-in keeps using the existing demo API and never touches
// Firebase.
import { initializeApp, getApps } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    GithubAuthProvider,
} from "firebase/auth";

// Strip JS comments without touching string literals, so a console snippet
// copied with its "// Initialize Firebase" lines still parses.
function stripComments(src) {
    let out = "";
    let inString = false;
    let quote = "";
    for (let i = 0; i < src.length; i++) {
        const ch = src[i];
        const next = src[i + 1];
        if (inString) {
            out += ch;
            if (ch === "\\") {
                out += next;
                i++;
            } else if (ch === quote) {
                inString = false;
            }
        } else if (ch === '"' || ch === "'") {
            inString = true;
            quote = ch;
            out += ch;
        } else if (ch === "/" && next === "/") {
            while (i < src.length && src[i] !== "\n") i++;
            out += "\n";
        } else if (ch === "/" && next === "*") {
            i += 2;
            while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++;
            i++;
        } else {
            out += ch;
        }
    }
    return out;
}

function parseFirebaseConfig(raw) {
    try {
        const clean = stripComments(raw);
        const start = clean.indexOf("{");
        const end = clean.lastIndexOf("}");
        if (start === -1 || end === -1) return null;
        // Quote the plain JS object keys and drop trailing commas so
        // JSON.parse accepts the snippet exactly as the console prints it.
        const jsonish = clean
            .slice(start, end + 1)
            .replace(/([{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:/g, '$1"$2":')
            .replace(/,\s*([}\]])/g, "$1");
        const parsed = JSON.parse(jsonish);
        if (parsed && parsed.apiKey && parsed.projectId && parsed.appId) {
            return parsed;
        }
        return null;
    } catch {
        return null;
    }
}

const firebaseConfig = parseFirebaseConfig(
    import.meta.env.VITE_FIREBASE_CONFIG || ""
);

export const firebaseReady = firebaseConfig !== null;

let auth = null;
if (firebaseReady) {
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
    auth = getAuth(app);
}

const socialProviders = {
    Google: GoogleAuthProvider,
    Facebook: FacebookAuthProvider,
    GitHub: GithubAuthProvider,
};

export { auth, socialProviders };

import * as admin from "firebase-admin";
import fs from "fs";

const serviceAccount = JSON.parse(
  fs.readFileSync(
    new URL(
      "./code-snippet-manager-42498-firebase-adminsdk-fbsvc-b83c40299a.json",
      import.meta.url
    ),
    "utf8"
  )
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

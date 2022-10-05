const Crypto = require("crypto");
const { Buffer } = require("buffer");
const fs = require("fs");

// Using a function generateKeyFiles
function generateKeyFiles() {
  const keyPair = Crypto.generateKeyPairSync("rsa", {
    modulusLength: 520,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "pluk",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: "pluk",
    },
  });

  // Creating private key file
  fs.writeFileSync("public.pem", keyPair.publicKey);
  fs.writeFileSync("private.pem", keyPair.privateKey);
}

// Generate keys
generateKeyFiles();

// Creating a function to encrypt string
function encryptString(plaintext, privateKeyFile, publicKeyFile) {
  //ß const privateKey = fs.readFileSync(privateKeyFile, "utf8");
  // Set RSA publicKey

  const publicKey = fs.readFileSync(publicKeyFile, "utf8");
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");
  const data = Buffer.from(plaintext);

  //signature creation:
  const sigstr = Crypto.sign("SHA256", data, { key: privateKey, passphrase: "pluk" }).toString("base64");
  const gcverify = Crypto.verify("RSA-SHA256", data, publicKey, Buffer.from(sigstr, "base64"));

  console.log("sig verified using pub key?: ", gcverify);

  return "ok";
}

// Defining a text to be encrypted
const plainText = "Hello world";

// Defining encrypted text
const encrypted = encryptString(plainText, "./private.pem", "./public.pem");

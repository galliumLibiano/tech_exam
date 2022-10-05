const Cryptr = require("cryptr");

// Using a function generateKeyFiles
function generateKeyFiles() {
  const keyPair = crypto.generateKeyPairSync("rsa", {
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
  fs.writeFileSync("publicpem", keyPair.publicKey);
  fs.writeFileSync("privatepem", keyPair.privateKey);
}

// Generate keys
generateKeyFiles();

// Creating a function to encrypt string
function encryptString(plaintext, privateKeyFile, publicKeyFile) {
  //ß const privateKey = fs.readFileSync(privateKeyFile, "utf8");
  // Set RSA publicKey

  const publicKey = fs.readFileSync(publicKeyFile, "utf8");
  const privateKey = fs.readFileSync(privateKeyFile, "utf8");

  //signature creation:
  const sigstr = crypto.sign("SHA256", plaintext, { key: privateKey, passphrase: "Hello world" }).toString("base64");
  const gcverify = crypto.verify("RSA-SHA256", plaintext, publicKey, Buffer.from(sigstr, "base64"));

  console.log("sig verified using pub key?: ", gcverify);

  return "ok";
}

// Defining a text to be encrypted
const plainText = "Hello world";

// Defining encrypted text
const encrypted = encryptString(plainText, "./private.pem", "./public.pem");

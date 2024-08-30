import OpenSSL from 'node-openssl-cert';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Options for OpenSSL
const optionsStart = {
  binpath: 'C:/Program Files/Git/usr/bin/openssl.exe',
};

// Initialize OpenSSL with options
const openssl = new OpenSSL(optionsStart);

const options = {
  encryption: {
    cipher: 'aes256',
    password: '',
  },
  rsa_keygen_bits: 2048,
};

const csrOptions = {
  clientKey: undefined,
  subject: {
    countryName: 'US',
    stateOrProvinceName: 'California',
    localityName: 'San Francisco',
    organizationName: 'MyCompany',
    organizationalUnitName: 'IT',
    commonName: 'localhost',
    emailAddress: 'admin@localhost',
  },
  extensions: {
    basicConstraints: {
      critical: true,
      CA: false,
    },
    keyUsage: {
      critical: true,
      usages: ['digitalSignature', 'keyEncipherment'],
    },
    extendedKeyUsage: {
      critical: true,
      usages: ['serverAuth'],
    },
  },
};

const selfSignOptions = {
  days: 365,
  hash: 'sha256',
  extensions: csrOptions.extensions,
};

// Generate RSA private key
openssl.generateRSAPrivateKey(options, (err, key) => {
  if (err) {
    console.error('Error generating private key:', err);
    return;
  }

  csrOptions.clientKey = key;

  // Generate CSR
  openssl.generateCSR(csrOptions, (err, csr) => {
    if (err) {
      console.error('Error generating CSR:', err);
      return;
    }

    // Self-sign the CSR
    openssl.selfSignCSR(
      {
        csr: csr,
        clientKey: key,
        days: selfSignOptions.days,
        hash: selfSignOptions.hash,
        extensions: selfSignOptions.extensions,
      },
      (err, crt) => {
        if (err) {
          console.error('Error self-signing CSR:', err);
          return;
        }

        // Write key and certificate to files
        try {
          fs.writeFileSync(path.join(__dirname, 'key.pem'), key);
          fs.writeFileSync(path.join(__dirname, 'cert.pem'), crt);
          //console.info('Certificates generated successfully');
        } catch (writeErr) {
          console.error('Error writing files:', writeErr);
        }
      }
    );
  });
});

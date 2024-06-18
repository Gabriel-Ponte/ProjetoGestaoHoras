
//const OpenSSL = require('node-openssl-cert');

import OpenSSL from "node-openssl-cert";
import fs from "fs";
import path from "path";
// const fs = require('fs');
// const path = require('path');

const openssl = new OpenSSL();

const options = {

  encryption: {
    cipher: 'aes256',
    password: '123456789'
  },
  rsa_keygen_bits: 2048
};

const csrOptions = {
  clientKey: undefined,
  extensions: {
    basicConstraints: {
      CA: true
    },
    keyUsage: {
      digitalSignature: true,
      keyEncipherment: true
    },
    subjectAltName: {
      critical: true,
      altNames: [
        {
          type: 2, // DNS
          value: 'localhost'
        }
      ]
    }
  }
};

const selfSignOptions = {
  days: 365,
  hash: 'sha256',
  extensions: csrOptions.extensions
};


openssl.generateRSAPrivateKey(options, (err, key) => {
  if (err) {
    console.error('Error generating private key:', err);
    return;
  }

  csrOptions.clientKey = key;

  openssl.generateCSR(csrOptions, (err, csr) => {
    if (err) {
      console.error('Error generating CSR:', err);
      return;
    }

    openssl.selfSignCSR({
      csr: csr,
      clientKey: key,
      days: selfSignOptions.days,
      hash: selfSignOptions.hash,
      extensions: selfSignOptions.extensions
    }, (err, crt) => {
      if (err) {
        console.error('Error self-signing CSR:', err);
        return;
      }

      fs.writeFileSync(path.join(__dirname, 'key.pem'), key);
      fs.writeFileSync(path.join(__dirname, 'cert.pem'), crt);
      console.log('Certificates generated successfully');
    });
  });
});

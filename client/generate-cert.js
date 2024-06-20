import openssl from "openssl-nodejs";
import OpenSSL from 'node-openssl-cert'
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from 'url';

try {
const BufferVariable = '';
openssl('openssl genpkey -out ../privkey.pem -algorithm RSA -pkeyopt rsa_keygen_bits:2018 -pkeyopt rsa_keygen_pubexp:3', (output) => console.error(output.toString()));
openssl(['req', '-config', { name:'csr.conf', buffer: BufferVariable }, '-out', 'CSR.csr', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'privateKey.key'], function (err, buffer) {
  console.error(err.toString(), buffer.toString());
  });

openssl('openssl req -config csr.cnf -x509 -sha256 -nodes -days 365 -newkey rsa:2048 -keyout key.key -out certificate.crt')
openssl('req', '-config', 'csr.conf', '-out', 'CSR.csr', '-new', '-newkey', 'rsa:2048', '-nodes', '-keyout', 'privateKey.key', function (err, buffer) {
  console.error(err.toString(), buffer.toString());
  });
} catch {
  
// Polyfill for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


var optionsStart = {
  binpath: 'C:/Program Files/Git/usr/bin/openssl.exe',
}

const openssl = new OpenSSL(optionsStart);


const options = {

  encryption: {
    cipher: 'aes256',
    password: '123456789',
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
      CA: false
    },
    keyUsage: {
      critical: true,
      usages: ['digitalSignature', 'keyEncipherment']
    },
    extendedKeyUsage: {
      critical: true,
      usages: ['serverAuth']
    }
  }
};

const selfSignOptions = {
  days: 365,
  hash: 'sha256',
  extensions: csrOptions.extensions,
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

        try {
          fs.writeFileSync(path.join(__dirname, 'key.pem'), key);
          fs.writeFileSync(path.join(__dirname, 'cert.pem'), crt);
          console.log('Certificates generated successfully');
        } catch (writeErr) {
          console.error('Error writing files:', writeErr);
        }
      }
    );
  });
});
}
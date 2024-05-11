import admin from "firebase-admin";
import { getAuth as fGetAuth } from "firebase-admin/auth";
import { getFirestore as fGetDatabase } from "firebase-admin/firestore";

const serviceAccout = {
  type: "service_account",
  project_id: "inventaris-sarana",
  private_key_id: "e97a817ab750562a213be134b044d77c04cfe282",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCs1i2dcx85eyos\n3+4ZOi71bnFxnJnjgO3hIgeCDlHYpMSf8Hy/ln0UIy0eM5VSVbMO3FRZlhvs3qza\npiVScJnu2W+X2KT8cyZavUaO+GtjSQD8QW0YJ5PF0BomBndL6z2/HJ3fG9UCWdSL\np2Q6RVM4tpHyzbYI/HHK90vJ+tBpUFjVPEnBPsJBsmogrWE0D8nYSKL1L+OHA02c\nZn8DtaYRWlqRJn/uLDD5GoIQEOqaXv3yGjHaj0ptBCyHDF7/Vr0FQ3m2bXTdPJ0p\nOvYiEboPZPqC0SSnmghXefGb1Mec6HFAJUEfdfYPnvyIFmiOAsJaw+DMf4DWBcbO\nnvzWtxF9AgMBAAECggEAAu+JCyVt8ILW4WKU/5OyltOfP1VFczejkrvfvHCe05sK\nMJyb7ysmCRCx5FNETtzgHjlVgMdhG7cKi5Tf3xRvi5Q2O4eKrIkOK+NkI+s0nmqa\nhtkGT9ni6NdojPXLfUbLyoe4vMCTGnzzycLNm9nFQ0TX73OutbIIAsZhi1bkca13\nDHyM5x1Qq+3DyGUDG+kLNftxvNs1uRcoveZtfO1m5xdvmqv1uT35hWHcW6EIh7IL\na3hc/RpkUl40777E8nMegujxCzwcv0nQS9aon8Q/NzoeygN7ZC8Gjl6+KdnZoHAH\nc/oOeDSGJAZW7jZq67ywJpOOGpAAUjNe2MzyqnSSpwKBgQDWc3SQrmn5eniY+2Zw\nEZl8hmXTOTgkUH94W9BPL/s9P0mmEq/f2irSy521AZztV60vRO4r9dE4mgB5Jpcf\nCvknhnxTwnmt4ZDZC/uN2vqNpKKI84IBHrzZI0hXvyiUuo8tNmQQt69mKP0KN6tI\nwxO7TgDJ1lWEcq+Y6RrdqskpjwKBgQDOUrGrvEW2cGzSmpKt7Fg5YfyiDbKLcBzE\nLqXjn7PbHpGjLs0BO/muDNHpup0x30BxEstAZDbS1AEjp1uaDeCj3KgcwHC795gV\nc7Ctq6hKoFfO79/aXVdcV1l0n3U9b2b5csYvKDBslq7CPMphL1SzvP2ACGw+zeLC\na7cRoBaWMwKBgQCwE+gXiz10G7y9T13SkoDFn8wnXAnet0GSX0BwZGMS7M3Zz+oc\nEJOstIZuwj5JGf4Wm7A65AC/SqMs1iSq1mWwsFmQpFMoE9bMf2wyEyQ5/H1/mQCb\nTtOcLb4OXeRCCdPZOZl7qHYZmXn6U68NdS7UUb2P+64Hq+rF0E/AxaOZvQKBgQCJ\nLrSRglo7xp6knT//wlCavssSGNdpHP8Tdgy4vzv/6mBdRsXqFy2ZC08bAAh623zm\ncd+QjdFh9rJXOXSPhsChUxq4G0AZyrNlOAn2P1djXx9jKV0GvN9UN4P0Jf32/jZS\nj3y0aB1iZgIGhhLt8WF5LKTE11TZoV0vdh0/69h4vwKBgQDOltCVx3JWQInr3uYd\ncmeZfdrJRecH1A945sWbM3tmSmNh+Cn7nF7JvOPy9HrI5GpAeD3DWbAhhZHdoMLL\nTz6bNlTeb8UiZ4yP+M5VW0Wh5KOAIFGLo9yeQ9YRrqAa71NEsNy1lzFWq/AMmQgW\n7h72PqjPBBlAapu1e4TxjpRwPg==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-2si6e@inventaris-sarana.iam.gserviceaccount.com",
  client_id: "113727047627646050733",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-2si6e%40inventaris-sarana.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

let app: admin.app.App;

if (!admin.apps.length) {
  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccout.project_id,
      privateKey: serviceAccout.private_key,
      clientEmail: serviceAccout.client_email,
    }),
  });
}

const getAuth = () => fGetAuth(app);
const getDatabase = () => fGetDatabase(app);

export { app, getAuth, getDatabase };

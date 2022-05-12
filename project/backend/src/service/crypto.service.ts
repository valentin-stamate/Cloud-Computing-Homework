import crypto from "crypto";
require('dotenv').config();

const env = process.env;

export class CryptoService {

    static algorithm = 'aes-256-ctr' as any;
    static secretKey = env.SECRET_KEY as string;

    static encrypt(text: string): Cypher {
        const iv = crypto.randomBytes(16);

        const cipher = crypto.createCipheriv(CryptoService.algorithm, CryptoService.secretKey, iv);

        const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

        return {
            iv: iv.toString('hex'),
            content: encrypted.toString('hex')
        };
    };

    static decrypt(hash: Cypher) {
        const decipher = crypto.createDecipheriv(CryptoService.algorithm, CryptoService.secretKey, Buffer.from(hash.iv, 'hex'));

        const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

        return decrypted.toString();
    };

}

export interface Cypher {
    iv: string;
    content: string;
}
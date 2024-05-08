const hasher = new Bun.CryptoHasher("sha256");
export const hash = (line:string) => hasher.update(line).digest("hex").slice(0,6);

import { createHash } from 'crypto';

export class BloomFilter {
    private bitArray: Uint8Array;
    private hashCount: number;
    private size: number

    constructor(size: number, hashCount: number) {
        this.size = size;
        this.hashCount = hashCount;
        this.bitArray = new Uint8Array(size);
    }

    private hash(value: string, seed: number) {
        const hash = createHash('sha256');
        hash.update(value + seed.toString());
        return Number(BigInt(`0x${hash.digest('hex')}`) % BigInt(this.size));
    }

    add(value: string) {
        for (let i = 0; i < this.hashCount; i++) {
            const index = this.hash(value, i);
            this.bitArray[index] = 1;
        }
    }

    search(value: string) {
        for (let i = 0; i < this.hashCount; i++) {
            const index = this.hash(value, i);
            if (this.bitArray[index] === 0) {
                return false;
            }
        }
        return true;
    }
}
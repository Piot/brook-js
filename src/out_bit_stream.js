export class OutBitStream {
  constructor(uint8Array) {
    this.array = new Uint8Array(512);
    this.arrayIndex = 0;
    this.bitCountWritten = 0;
    this.position = 0;
    this.accumulator = 0;
  }

  _writeBits(value, bitCount) {
    if (value < 0) {
      throw 'must write positive numbers';
    }
    if (bitCount == 0) {
      return;
    }
    const bitCountLeftInAccumulator = 32 - this.bitCountWritten;
    const possibleToWriteCount = Math.min(bitCountLeftInAccumulator, bitCount);
    const bitsToWait = bitCount - possibleToWriteCount;
    const masked = value & (0xffffffff >>> (32 - bitCount));
    const shift = bitCountLeftInAccumulator - possibleToWriteCount;
    let partial = masked;
    partial >>= bitsToWait;
    partial <<= shift;
    this.accumulator |= partial;
    this.bitCountWritten += possibleToWriteCount;
    this.position += possibleToWriteCount;
    if (this.bitCountWritten === 32) {
      this.array[this.arrayIndex++] = (this.accumulator & 0xff000000) >> 24;
      this.array[this.arrayIndex++] = (this.accumulator & 0x00ff0000) >> 16;
      this.array[this.arrayIndex++] = (this.accumulator & 0x0000ff00) >> 8;
      this.array[this.arrayIndex++] = (this.accumulator & 0x000000ff);
      this.accumulator = 0;
      this.bitCountWritten = 0;
    }
    if (bitsToWait > 0) {
      this._writeBits(value, bitsToWait);
    }
  }

  writeBits(value, bitCount) {
    this._writeBits(value, bitCount);
  }

  writeUint8(value) {
    this._writeBits(value, 8);
  }

  writeUint16(value) {
    this._writeBits(value, 16);
  }

  writeUint32(value) {
    this._writeBits(value, 32);
  }

  writeSigned(value, bitCount) {
    const isSigned = value < 0;
    this._writeBits(isSigned ? 1 : 0, 1);
    this._writeBits(value, bitCount - 1);
  }

  copyArrayBuffer(src, len) {
    return src.slice(0, len)
  }

  tell() {
    return this.position;
  }

  close() {
    const octetsLeft = Math.ceil(this.bitCountWritten / 8);
    for (let i = 0; i < octetsLeft; ++i) {
      const shift = 24 - i * 8;
      const mask = 0xff << shift;
      const octetValue = (this.accumulator & mask) >> shift;
      this.array[this.arrayIndex++] = octetValue;
    }
    const copyOfOctetArray = this.copyArrayBuffer(this.array, this.arrayIndex);
    return copyOfOctetArray;
  }

  bitCount() {
    return this.position;
  }

}

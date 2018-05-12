/*

MIT License

Copyright (c) 2017 Peter Bjorklund

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
import {
  toHex
} from './utility.js'

export class InBitStream {

  constructor(uint8Array, bitCount) {
    if (!Number.isInteger(bitCount)) {
      throw 'bitcount must be integer';
    }
    const validType = (uint8Array instanceof Uint8Array);
    if (!validType) {
      throw "Invalid octetArray. Must be Uint8Array";
    }
    this.octetArrayIndex = 0;
    this.position = 0;
    this.remainingBitCount = 0;
    this.bitCount = bitCount;
    this.octetArray = uint8Array;
    this.octetCount = Math.ceil(bitCount / 8);
  }

  _fillAccumulator() {
    const octetsLeftInBuffer = this.octetCount - this.octetArrayIndex;
    const octetsToRead = Math.min(4, octetsLeftInBuffer);
    this.accumulator = 0;
    for (let i = 0; i < octetsToRead; ++i) {
      const shift = 24 - i * 8;
      const value = this.octetArray[this.octetArrayIndex++];
      const partial = value << shift;
      this.accumulator |= partial;
    }
    this.remainingBitCount = octetsToRead * 8;
  }

  _readBits(requestedBitCount) {
    if (this.remainingBitCount === 0) {
      this._fillAccumulator();
      if (this.remainingBitCount === 0) {
        throw "Read too far";
      }
    }

    const bitsConsumed = Math.min(this.remainingBitCount, requestedBitCount);
    const mask = (0xffffffff >>> bitsConsumed);
    const shiftCount = 32 - bitsConsumed;
    const value = (this.accumulator & (mask << shiftCount)) >>> shiftCount;

    this.accumulator <<= bitsConsumed;
    this.remainingBitCount -= bitsConsumed;
    this.position += bitsConsumed;

    const remainingBitsToRead = requestedBitCount - bitsConsumed;
    if (remainingBitsToRead > 0) {
      return (value << remainingBitsToRead) | this._readBits(remainingBitsToRead);
    }
    return value;
  }

  tell() {
    return this.position;
  }

  readBits(bitCount) {
    return this._readBits(bitCount);
  }

  readUint8() {
    return this._readBits(8);
  }

  readInt8() {
    return this.readSigned(8);
  }

  readUint16() {
    return this._readBits(16);
  }

  readInt16() {
    return this.readSigned(16);
  }

  readUint32() {
    return this._readBits(32);
  }

  readInt32() {
    return this.readSigned(32);
  }

  readSigned(bitCount) {
    const isSigned = this._readBits(1);
    const value = this._readBits(bitCount - 1);
    if (isSigned) {
      return -value;
    }
    return value;
  }
}

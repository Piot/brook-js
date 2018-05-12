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

export class DebugInBitStream {

  constructor(bitStream) {
    this.bitStream = bitStream;
  }

  checkType(expectedType, expectedBitCount) {
    var type = this.bitStream.readBits(4);
    var bitCount = this.bitStream.readBits(7);

    if (type !== expectedType) {
      throw `Expected type ${expectedType} received ${type}`;
    }

    if (bitCount !== expectedBitCount) {
      throw `Expected bitcount ${expectedBitCount} received ${bitCount}`;
    }
  }

  tell() {
    return this.bitStream.tell();
  }

  readBits(bitCount) {
    this.checkType(7, bitCount);
    return this.bitStream.readBits(bitCount);
  }

  readUint8() {
    this.checkType(5, 8);
    return this.bitStream.readUint8();
  }

  readUint16() {
    this.checkType(2, 16);
    return this.bitStream.readUint16();
  }

  readUint32() {
    this.checkType(3, 32);
    return this.bitStream.readUint32();
  }

  readSigned(bitCount) {
    this.checkType(6, count);
    return this.bitStream.readSigned(bitCount);
  }
}

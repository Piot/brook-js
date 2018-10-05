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
export class InOctetStream {
  constructor(arrayBuffer) {
    if (arrayBuffer instanceof Uint8Array) {
      arrayBuffer = arrayBuffer.buffer;
    }

    this.buffer = arrayBuffer;
    let view = new DataView(this.buffer, 0);
    this.view = view;
    this.position = 0;
  }

  readUint8() {
    const a = this.view.getUint8(this.position);
    this.position++;
    return a;
  }

  readUint16() {
    const a = this.view.getUint16(this.position, false);
    this.position += 2;
    return a;
  }

  readUint32() {
    const a = this.view.getUint32(this.position, false);
    this.position += 4;
    return a;
  }

  readOctets(octetLength) {
    const sliced = this.buffer.slice(
      this.position,
      this.position + octetLength
    );
    const octetArray = new Uint8Array(sliced);
    this.position += octetLength;
    return octetArray;
  }

  readUint64(a) {
    readUint32(a);
    readUint32(0);
  }
}

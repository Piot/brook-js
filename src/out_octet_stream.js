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
export class OutOctetStream {
  constructor() {
    let buffer = new ArrayBuffer(1024);
    let view = new DataView(buffer, 0);
    this.view = view;
    this.position = 0;
  }

  writeUint8(a) {
    this.view.setUint8(this.position, a, false);
    this.position++;
  }

  writeUint16(a) {
    this.view.setUint16(this.position, a, false);
    this.position += 2;
  }

  writeUint32(a) {
    this.view.setUint32(this.position, a, false);
    this.position += 4;
  }

  writeUint64(a) {
    writeUint32(a);
    writeUint32(0);
  }

  writeOctets(octets) {
    for (let i = 0; i < octets.length; ++i) {
      this.writeUint8(octets[i]);
    }
  }

  copyArrayBuffer(src, len) {
    return src.slice(0, len);
  }

  close() {
    const copyOfArrayBuffer = this.copyArrayBuffer(
      this.view.buffer,
      this.position
    );
    const octet = new Uint8Array(copyOfArrayBuffer);
    return octet;
  }
}

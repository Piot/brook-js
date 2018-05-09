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

  copyArrayBuffer(src, len) {
    return src.slice(0, len)
  }

  close() {
    const copyOfArrayBuffer = this.copyArrayBuffer(this.view.buffer, this.position);
    const octet = new Uint8Array(copyOfArrayBuffer);
    return octet;
  }
}

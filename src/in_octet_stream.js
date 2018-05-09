export class InOctetStream {
  constructor(arrayBuffer) {
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

  readUint64(a) {
    readUint32(a);
    readUint32(0);
  }

}

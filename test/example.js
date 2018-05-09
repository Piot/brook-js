import {
  OutOctetStream
} from '../src/out_octet_stream.js'

import {
  InOctetStream
} from '../src/in_octet_stream.js'

import {
  OutBitStream
} from '../src/out_bit_stream.js'

import {
  InBitStream
} from '../src/in_bit_stream.js'

import {
  toHex
} from '../src/utility.js'

function test1() {
  let s = new OutOctetStream();
  s.writeUint8(0xff);
  s.writeUint16(0xcafe);
  s.writeUint32(0xcd31fefe);
  const payload = s.close();
  console.log('Payload:', payload);

  let inStream = new InOctetStream(payload);
  const ax = inStream.readUint8();
  const bx = inStream.readUint16();
  const cx = inStream.readUint32();

  console.log('result:', ax.toString(16), bx.toString(16), cx.toString(16));
}

function testInBit() {
  const array = new Uint8Array([0xff, 0x33]);
  let s = new InBitStream(array);
  const bits = s.readBits(11);
  console.log('bits:', bits);
}

function testOutBit() {
  let s = new OutBitStream();
  s.writeBits(0x0fe, 9);
  const payload = s.close();
  console.log('bits:', payload, s.bitCount());
}

function testInOutBit() {
  let o = new OutBitStream();
  o.writeBits(0x0fe, 9);
  o.writeBits(0xc0ca, 16);
  o.writeBits(0xfade, 16);
  const payload = o.close();

  let i = new InBitStream(payload, o.bitCount());
  const bits = i.readBits(9);
  if (bits !== 0x0fe) {
    throw 'Bad';
  }
  const first = i.readBits(16);
  if (first !== 0xc0ca) {
    throw 'Bad';
  }
  const second = i.readUint16();
  if (second !== 0xfade) {
    throw 'Bad';
  }
}

testInOutBit();

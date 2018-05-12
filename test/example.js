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
  DebugInBitStream
} from '../src/debug_in_bit_stream.js'

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

function testDebugInBitStream() {
  const array = new Uint8Array([0x71, 0x70, 0xA8]);
  let r = new InBitStream(array, 22);
  let s = new DebugInBitStream(r);
  const bits = s.readBits(11);
  if (bits !== 1066) {
    throw 'wrong debug'
  }
  console.log('bits:', bits);
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
  console.log('read:', toHex(second));
  if (second !== 0xfade) {
    throw 'Bad';
  }
}

function testInOctet() {
  const array = new Uint8Array([0xff, 0x33, 0x48, 0xca]);
  let o = new OutOctetStream();
  o.writeOctets(array);
  const payload = o.close();

  const i = new InOctetStream(payload);
  i.readUint8();
  const octets = i.readOctets(2);
  if (octets.length !== 2) {
    throw 'wrong size';
  }
  if (octets[0] !== 0x33 || octets[1] !== 0x48) {
    throw 'wrong octet';
  }

  console.log('octet', octets);
}

testDebugInBitStream();
// testInOctet();

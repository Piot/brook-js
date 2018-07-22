class OutBitStream{constructor(uint8Array){this.array=new Uint8Array(512);this.arrayIndex=0;this.bitCountWritten=0;this.position=0;this.accumulator=0}_writeBits(value,bitCount){if(value<0){throw'must write positive numbers'}if(!Number.isInteger(bitCount)){throw`bitcount ${bitCount} must be integer`}if(!Number.isInteger(value)){throw'value must be integer'}if(bitCount==0){return}const bitCountLeftInAccumulator=32-this.bitCountWritten;const possibleToWriteCount=Math.min(bitCountLeftInAccumulator,bitCount);const bitsToWait=bitCount-possibleToWriteCount;const masked=value&4294967295>>>32-bitCount;const shift=bitCountLeftInAccumulator-possibleToWriteCount;let partial=masked;partial>>=bitsToWait;partial<<=shift;this.accumulator|=partial;this.bitCountWritten+=possibleToWriteCount;this.position+=possibleToWriteCount;if(this.bitCountWritten===32){this.array[this.arrayIndex++]=(this.accumulator&4278190080)>>24;this.array[this.arrayIndex++]=(this.accumulator&16711680)>>16;this.array[this.arrayIndex++]=(this.accumulator&65280)>>8;this.array[this.arrayIndex++]=this.accumulator&255;this.accumulator=0;this.bitCountWritten=0}if(bitsToWait>0){this._writeBits(value,bitsToWait)}}writeBits(value,bitCount){this._writeBits(value,bitCount)}writeUint8(value){this._writeBits(value,8)}writeUint16(value){this._writeBits(value,16)}writeUint32(value){this._writeBits(value,32)}writeSigned(value,bitCount){if(!Number.isInteger(bitCount)){throw`signed bitcount ${bitCount} must be integer`}if(bitCount<=2){throw`bitcount must be at least integer 2 ${bitCount}`}if(!Number.isInteger(value)){throw`signed value ${value} must be integer`}const isSigned=value<0;this._writeBits(isSigned?1:0,1);this._writeBits(value,bitCount-1)}copyArrayBuffer(src,len){return src.slice(0,len)}tell(){return this.position}close(){const octetsLeft=Math.ceil(this.bitCountWritten/8);for(let i=0;i<octetsLeft;++i){const shift=24-i*8;const mask=255<<shift;const octetValue=(this.accumulator&mask)>>shift;this.array[this.arrayIndex++]=octetValue}const copyOfOctetArray=this.copyArrayBuffer(this.array,this.arrayIndex);return copyOfOctetArray}bitCount(){return this.position}}class OutOctetStream{constructor(){let buffer=new ArrayBuffer(1024);let view=new DataView(buffer,0);this.view=view;this.position=0}writeUint8(a){this.view.setUint8(this.position,a,false);this.position++}writeUint16(a){this.view.setUint16(this.position,a,false);this.position+=2}writeUint32(a){this.view.setUint32(this.position,a,false);this.position+=4}writeUint64(a){writeUint32(a);writeUint32(0)}writeOctets(octets){for(let i=0;i<octets.length;++i){this.writeUint8(octets[i])}}copyArrayBuffer(src,len){return src.slice(0,len)}close(){const copyOfArrayBuffer=this.copyArrayBuffer(this.view.buffer,this.position);const octet=new Uint8Array(copyOfArrayBuffer);return octet}}class InBitStream{constructor(uint8Array,bitCount){if(!Number.isInteger(bitCount)){throw'bitcount must be integer'}const validType=uint8Array instanceof Uint8Array;if(!validType){throw"Invalid octetArray. Must be Uint8Array"}this.octetArrayIndex=0;this.position=0;this.remainingBitCount=0;this.bitCount=bitCount;this.octetArray=uint8Array;const arrayOctetCount=uint8Array.byteLength;this.octetCount=Math.ceil(bitCount/8);if(this.octetCount>arrayOctetCount){throw'strange octet buffer size'}}_fillAccumulator(){const octetsLeftInBuffer=this.octetCount-this.octetArrayIndex;const octetsToRead=Math.min(4,octetsLeftInBuffer);this.accumulator=0;for(let i=0;i<octetsToRead;++i){const shift=24-i*8;const value=this.octetArray[this.octetArrayIndex++];const partial=value<<shift;this.accumulator|=partial}this.remainingBitCount=octetsToRead*8}_readBits(requestedBitCount){if(this.remainingBitCount===0){this._fillAccumulator();if(this.remainingBitCount===0){throw"Read too far"}}const bitsConsumed=Math.min(this.remainingBitCount,requestedBitCount);const mask=~(4294967295>>>bitsConsumed);const shiftCount=32-bitsConsumed;const value=(this.accumulator&mask)>>>shiftCount;this.accumulator<<=bitsConsumed;this.remainingBitCount-=bitsConsumed;this.position+=bitsConsumed;const remainingBitsToRead=requestedBitCount-bitsConsumed;if(remainingBitsToRead>0){return value<<remainingBitsToRead|this._readBits(remainingBitsToRead)}return value}tell(){return this.position}readBits(bitCount){return this._readBits(bitCount)}readUint8(){return this._readBits(8)}readInt8(){return this.readSigned(8)}readUint16(){return this._readBits(16)}readInt16(){return this.readSigned(16)}readUint32(){return this._readBits(32)}readInt32(){return this.readSigned(32)}readSigned(bitCount){const isSigned=this._readBits(1);let value=this._readBits(bitCount-1);if(isSigned){value=-value}return value}}class InOctetStream{constructor(arrayBuffer){if(arrayBuffer instanceof Uint8Array){arrayBuffer=arrayBuffer.buffer}this.buffer=arrayBuffer;let view=new DataView(this.buffer,0);this.view=view;this.position=0}readUint8(){const a=this.view.getUint8(this.position);this.position++;return a}readUint16(){const a=this.view.getUint16(this.position,false);this.position+=2;return a}readUint32(){const a=this.view.getUint32(this.position,false);this.position+=4;return a}readOctets(octetLength){const sliced=this.buffer.slice(this.position,this.position+octetLength);const octetArray=new Uint8Array(sliced);this.position+=octetLength;return octetArray}readUint64(a){readUint32(a);readUint32(0)}}class DebugInBitStream{constructor(bitStream){this.bitStream=bitStream}checkType(expectedType,expectedBitCount){var type=this.bitStream.readBits(4);var bitCount=this.bitStream.readBits(7);if(type!==expectedType){throw`Expected type ${expectedType} received ${type}`}if(bitCount!==expectedBitCount){throw`Expected bitcount ${expectedBitCount} received ${bitCount}`}}tell(){return this.bitStream.tell()}readBits(bitCount){this.checkType(7,bitCount);return this.bitStream.readBits(bitCount)}readUint8(){this.checkType(5,8);return this.bitStream.readUint8()}readInt8(){throw'not implemented readInt8'}readUint16(){this.checkType(1,16);return this.bitStream.readUint16()}readInt16(){this.checkType(2,16);return this.bitStream.readInt16()}readUint32(){this.checkType(3,32);return this.bitStream.readUint32()}readInt32(){throw'not implemented readInt32'}readSigned(bitCount){this.checkType(6,bitCount);return this.bitStream.readSigned(bitCount)}}export{OutBitStream,OutOctetStream,InBitStream,InOctetStream,DebugInBitStream};
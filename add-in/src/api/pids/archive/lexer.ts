// /** This character denotes the end of file */
// const YYEOF = -1;

// /** initial size of the lookahead buffer */
// const ZZ_BUFFERSIZE = 16384;

// /** lexical states */
// const YYINITIAL = 0;

// /**
//  * ZZ_LEXSTATE[l] is the state in the DFA for the lexical state l
//  * ZZ_LEXSTATE[l+1] is the state in the DFA for the lexical state l
//  * at the beginning of a line
//  * l is of the form l = 2*k, k a non negative integer
//  */
// const ZZ_LEXSTATE = [0, 0];

// /**
//  * Translates characters to character classes
//  */
// const ZZ_CMAP_PACKED =
//   "\11\0\1\1\1\1\1\0\1\1\1\1\22\0\1\1\7\0\1\0" +
//   "\1\0\2\0\1\0\1\0\1\0\1\0\12\2\1\0\1\0\5\0" +
//   "\32\3\1\0\1\0\1\0\1\0\1\0\1\0\32\3\1\0\1\0" +
//   "\1\0\uff82\0";

// const ZZ_ACTION_PACKED_0 = "\1\0\1\1\1\2\1\3\1\4";

// const ZZ_ROWMAP_PACKED_0 = "\0\0\0\4\0\10\0\14\0\20";

// const ZZ_TRANS_PACKED_0 = "\1\2\1\3\1\4\1\5\5\0\1\3\4\0\1\4\4\0\1\5";

// const ZZ_ATTRIBUTE_PACKED_0 = "\1\0\1\11\3\1";

// /**
//  * Translates characters to character classes
//  */
// const ZZ_CMAP = zzUnpackCMap(ZZ_CMAP_PACKED);

// /**
//  * Translates DFA states to action switch labels.
//  */
// const ZZ_ACTION = zzUnpackAction();

// function zzUnpackAction() {
//   let result = Array(5);
//   let offset = 0;
//   offset = zzUnpackActionArgs(ZZ_ACTION_PACKED_0, offset, result);
//   return result;
// }

// function zzUnpackActionArgs(packed, offset, result) {
//   let i = 0; /* index in packed string */
//   let j = offset; /* index in unpacked array */
//   let l = packed.length;
//   while (i < l) {
//     let count = packed.charAt(i++);
//     let value = packed.charAt(i++);
//     do {
//       result[j++] = value;
//     } while (--count > 0);
//   }
//   return j;
// }

// /**
//  * Translates a state to a row index in the transition table
//  */
// const ZZ_ROWMAP = zzUnpackRowMap();

// function zzUnpackRowMap() {
//   let result = Array(5);
//   let offset = 0;
//   offset = zzUnpackRowMapArgs(ZZ_ROWMAP_PACKED_0, offset, result);
//   return result;
// }

// function zzUnpackRowMapArgs(packed, offset, result) {
//   let i = 0; /* index in packed string */
//   let j = offset; /* index in unpacked array */
//   let l = packed.length;
//   while (i < l) {
//     let high = packed.charAt(i++) << 16;
//     result[j++] = high | packed.charAt(i++);
//   }
//   return j;
// }

// /**
//  * The transition table of the DFA
//  */
// const ZZ_TRANS = zzUnpackTrans();

// function zzUnpackTrans() {
//   let result = new Array(20);
//   let offset = 0;
//   offset = zzUnpackTransArgs(ZZ_TRANS_PACKED_0, offset, result);
//   return result;
// }

// function zzUnpackTransArgs(packed, offset, result) {
//   let i = 0; /* index in packed string */
//   let j = offset; /* index in unpacked array */
//   let l = packed.length;
//   while (i < l) {
//     let count = packed.charAt(i++);
//     let value = packed.charAt(i++);
//     value--;
//     do result[j++] = value;
//     while (--count > 0);
//   }
//   return j;
// }

// /* error codes */
// const ZZ_UNKNOWN_ERROR = 0;
// const ZZ_NO_MATCH = 1;
// const ZZ_PUSHBACK_2BIG = 2;

// /* error messages for the codes above */
// const ZZ_ERROR_MSG = [
//   "Unkown internal scanner error",
//   "Error: could not match input",
//   "Error: pushback value was too large",
// ];

// /**
//  * ZZ_ATTRIBUTE[aState] contains the attributes of state <code>aState</code>
//  */
// const ZZ_ATTRIBUTE = zzUnpackAttribute();

// function zzUnpackAttribute() {
//   let result = Array(5);
//   let offset = 0;
//   offset = zzUnpackAttributeArgs(ZZ_ATTRIBUTE_PACKED_0, offset, result);
//   return result;
// }

// function zzUnpackAttributeArgs(packed, offset, result) {
//   let i = 0; /* index in packed string */
//   let j = offset; /* index in unpacked array */
//   let l = packed.length;
//   while (i < l) {
//     let count = packed.charAt(i++);
//     let value = packed.charAt(i++);
//     do {
//       result[j++] = value;
//     } while (--count > 0);
//   }
//   return j;
// }

// /**
//  * Unpacks the compressed character translation table.
//  *
//  * @param packed the packed character translation table
//  * @return the unpacked character translation table
//  */
// function zzUnpackCMap(packed) {
//   let map = Array(0x10000);
//   let i = 0; /* index in packed string */
//   let j = 0; /* index in unpacked array */
//   while (i < 64) {
//     let count = packed.charAt(i++);
//     let value = packed.charAt(i++);
//     do {
//       map[j++] = value;
//     } while (--count > 0);
//   }
//   return map;
// }

// class LexerOld {
//   /** the input device */
//   zzReader;

//   /** the current state of the DFA */
//   zzState;

//   /** the current lexical state */
//   zzLexicalState = YYINITIAL;

//   /**
//    * this buffer contains the current text to be matched and is
//    * the source of the yytext() string
//    */
//   zzBuffer = Array(ZZ_BUFFERSIZE);

//   /** the textposition at the last accepting state */
//   zzMarkedPos;

//   /** the current text position in the buffer */
//   zzCurrentPos;

//   /** startRead marks the beginning of the yytext() string in the buffer */
//   zzStartRead;

//   /**
//    * endRead marks the last character in the buffer, that has been read
//    * from input
//    */
//   zzEndRead;

//   /** number of newlines encountered up to the start of the matched text */
//   yyline;

//   /** the number of characters up to the start of the matched text */
//   yychar;

//   /**
//    * the number of characters from the last newline up to the start of the
//    * matched text
//    */
//   yycolumn;

//   /**
//    * zzAtBOL == true <=> the scanner is currently at the beginning of a line
//    */
//   zzAtBOL = true;

//   /** zzAtEOF == true <=> the scanner is at the EOF */
//   zzAtEOF;

//   /** denotes if the user-EOF-code has already been executed */
//   zzEOFDone;

//   constructor(reader) {
//     this.zzReader = reader;
//   }

//   scan() {
//     let zzInput;
//     let zzAction;

//     // cached fields:
//     let zzCurrentPosL;
//     let zzMarkedPosL;
//     let zzEndReadL = this.zzEndRead;
//     let zzBufferL = this.zzBuffer;
//     let zzCMapL = ZZ_CMAP;

//     let zzTransL = ZZ_TRANS;
//     let zzRowMapL = ZZ_ROWMAP;
//     let zzAttrL = ZZ_ATTRIBUTE;

//     zzForAction: {
//       while (true) {
//         if (zzCurrentPosL < zzEndReadL) {
//           zzInput = zzBufferL[zzCurrentPosL++];
//         } else if (this.zzAtEOF) {
//           zzInput = YYEOF;
//           break zzForAction;
//         } else {
//           // store back cached positions
//           this.zzCurrentPos = zzCurrentPosL;
//           this.zzMarkedPos = zzMarkedPosL;
//           let eof = "";
//           // get translated positions and possibly new buffer
//           zzCurrentPosL = this.zzCurrentPos;
//           zzMarkedPosL = this.zzMarkedPos;
//           zzBufferL = this.zzBuffer;
//           zzEndReadL = this.zzEndRead;
//           if (eof) {
//             zzInput = YYEOF;
//             break zzForAction;
//           } else {
//             zzInput = zzBufferL[zzCurrentPosL++];
//           }
//         }
//         let zzNext = zzTransL[zzRowMapL[this.zzState] + zzCMapL[zzInput]];
//         if (zzNext == -1) {
//           break zzForAction;
//         }
//         this.zzState = zzNext;

//         let zzAttributes = zzAttrL[this.zzState];
//         if ((zzAttributes & 1) == 1) {
//           zzAction = this.zzState;
//           zzMarkedPosL = zzCurrentPosL;
//           if ((zzAttributes & 8) == 8) {
//             break zzForAction;
//           }
//         }

//         // store back cached position
//         this.zzMarkedPos = zzMarkedPosL;

//         switch (zzAction < 0 ? zzAction : ZZ_ACTION[zzAction]) {
//           case 2: {
//             return new TSpace();
//           }
//           case 5:
//             break;
//           case 1: {
//             return new TSymbol(yytext());
//           }
//           case 6:
//             break;
//           case 4: {
//             return new TWord(yytext());
//           }
//           case 7:
//             break;
//           case 3: {
//             return new TInt(yytext());
//           }
//           case 8:
//             break;
//           default:
//             if (zzInput == YYEOF && this.zzStartRead == this.zzCurrentPos) {
//               this.zzAtEOF = true;
//               return null;
//             } else {
//               zzScanError(ZZ_NO_MATCH);
//             }
//         }
//       }
//     }
//   }
// }

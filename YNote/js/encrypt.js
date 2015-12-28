// base64.js
/**
 * Adapted from: http://www.webtoolkit.info/javascript-base64.html License:
 * http://www.webtoolkit.info/licence.html Which reads (2009-08-04): As long as
 * you leave the copyright notice of the original script, or link back to this
 * website, you can use any of the content published on this website free of
 * charge for any use: commercial or noncommercial.
 */

var Base64 = {

	keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		do {
			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this.keyStr.charAt(enc1)
					+ this.keyStr.charAt(enc2) + this.keyStr.charAt(enc3)
					+ this.keyStr.charAt(enc4);
			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";
		} while (i < input.length);

		return output;
	},

	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3 = "";
		var enc1, enc2, enc3, enc4 = "";
		var i = 0;

		// remove all characters that are not A-Z, a-z, 0-9, +, /, or =
		var base64test = /[^A-Za-z0-9\+\/\=]/g;
		if (base64test.exec(input)) {
			alert("There were invalid base64 characters in the input text.\n"
					+ "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n"
					+ "Expect errors in decoding.");
		}
		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		do {
			enc1 = this.keyStr.indexOf(input.charAt(i++));
			enc2 = this.keyStr.indexOf(input.charAt(i++));
			enc3 = this.keyStr.indexOf(input.charAt(i++));
			enc4 = this.keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

			chr1 = chr2 = chr3 = "";
			enc1 = enc2 = enc3 = enc4 = "";

		} while (i < input.length);

		return output;
	}

}
// end of Base64 namespace

// crc32.js
/**
 * From: http://www.webtoolkit.info/javascript-crc32.html License:
 * http://www.webtoolkit.info/licence.html Which reads (2009-08-04): As long as
 * you leave the copyright notice of the original script, or link back to this
 * website, you can use any of the content published on this website free of
 * charge for any use: commercial or noncommercial.
 */
/**
 * 
 * Javascript crc32 http://www.webtoolkit.info/
 * 
 */

var crc32 = function(str, crc) { // String should be ASCII (or UTF8-encoded)
	var table = "00000000 77073096 EE0E612C 990951BA 076DC419 "
			+ "706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 "
			+ "E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 "
			+ "90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE "
			+ "1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 "
			+ "646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 "
			+ "FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 "
			+ "A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B "
			+ "35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 "
			+ "45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A "
			+ "C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 "
			+ "B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 "
			+ "2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 "
			+ "01DB7106 98D220BC EFD5102A 71B18589 06B6B51F "
			+ "9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E "
			+ "E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 "
			+ "6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED "
			+ "1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 "
			+ "8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 "
			+ "FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 "
			+ "4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A "
			+ "346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 "
			+ "AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 "
			+ "C90C2086 5768B525 206F85B3 B966D409 CE61E49F "
			+ "5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 "
			+ "2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 "
			+ "03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 "
			+ "73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 "
			+ "E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 "
			+ "8708A3D2 1E01F268 6906C2FE F762575D 806567CB "
			+ "196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A "
			+ "67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 "
			+ "D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 "
			+ "A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C "
			+ "36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF "
			+ "4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 "
			+ "CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE "
			+ "B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 "
			+ "2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C "
			+ "026D930A 9C0906A9 EB0E363F 72076785 05005713 "
			+ "95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B "
			+ "E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 "
			+ "68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 "
			+ "18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C "
			+ "8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 "
			+ "D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 "
			+ "4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 "
			+ "37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 "
			+ "BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 "
			+ "CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 "
			+ "5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B " + "2D02EF8D";

	if (typeof (crc) == "undefined") {
		crc = 0;
	}
	var x = 0;
	var y = 0;

	crc = crc ^ (-1);
	for ( var i = 0, iTop = str.length; i < iTop; i++) {
		y = (crc ^ str.charCodeAt(i)) & 0xFF;
		x = "0x" + table.substr(y * 9, 8);
		crc = (crc >>> 8) ^ x;
	}

	return crc ^ (-1);
};

// md5.cs
// from: http://www.onicos.com/staff/iz/amuse/javascript/expert/md5.txt
/*
 * md5.js - MD5 Message-Digest Copyright (C) 1999,2002 Masanao Izumo
 * <iz@onicos.co.jp> Version: 2.0.0 LastModified: May 13 2002
 * 
 * This program is free software. You can redistribute it and/or modify it
 * without any warranty. This library calculates the MD5 based on RFC1321. See
 * RFC1321 for more information and algorism.
 */

/*
 * Interface: md5_128bits = MD5_hash(data); md5_hexstr = MD5_hexhash(data);
 */

/*
 * ChangeLog 2002/05/13: Version 2.0.0 released NOTICE: API is changed.
 * 2002/04/15: Bug fix about MD5 length.
 */

// md5_T[i] = parseInt(Math.abs(Math.sin(i)) * 4294967296.0);
var MD5_T = new Array(0x00000000, 0xd76aa478, 0xe8c7b756, 0x242070db,
		0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501, 0x698098d8,
		0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e,
		0x49b40821, 0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d,
		0x02441453, 0xd8a1e681, 0xe7d3fbc8, 0x21e1cde6, 0xc33707d6, 0xf4d50d87,
		0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a, 0xfffa3942,
		0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60,
		0xbebfbc70, 0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039,
		0xe6db99e5, 0x1fa27cf8, 0xc4ac5665, 0xf4292244, 0x432aff97, 0xab9423a7,
		0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1, 0x6fa87e4f,
		0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb,
		0xeb86d391);

var MD5_round1 = new Array(new Array(0, 7, 1), new Array(1, 12, 2), new Array(
		2, 17, 3), new Array(3, 22, 4), new Array(4, 7, 5),
		new Array(5, 12, 6), new Array(6, 17, 7), new Array(7, 22, 8),
		new Array(8, 7, 9), new Array(9, 12, 10), new Array(10, 17, 11),
		new Array(11, 22, 12), new Array(12, 7, 13), new Array(13, 12, 14),
		new Array(14, 17, 15), new Array(15, 22, 16));

var MD5_round2 = new Array(new Array(1, 5, 17), new Array(6, 9, 18), new Array(
		11, 14, 19), new Array(0, 20, 20), new Array(5, 5, 21), new Array(10,
		9, 22), new Array(15, 14, 23), new Array(4, 20, 24),
		new Array(9, 5, 25), new Array(14, 9, 26), new Array(3, 14, 27),
		new Array(8, 20, 28), new Array(13, 5, 29), new Array(2, 9, 30),
		new Array(7, 14, 31), new Array(12, 20, 32));

var MD5_round3 = new Array(new Array(5, 4, 33), new Array(8, 11, 34),
		new Array(11, 16, 35), new Array(14, 23, 36), new Array(1, 4, 37),
		new Array(4, 11, 38), new Array(7, 16, 39), new Array(10, 23, 40),
		new Array(13, 4, 41), new Array(0, 11, 42), new Array(3, 16, 43),
		new Array(6, 23, 44), new Array(9, 4, 45), new Array(12, 11, 46),
		new Array(15, 16, 47), new Array(2, 23, 48));

var MD5_round4 = new Array(new Array(0, 6, 49), new Array(7, 10, 50),
		new Array(14, 15, 51), new Array(5, 21, 52), new Array(12, 6, 53),
		new Array(3, 10, 54), new Array(10, 15, 55), new Array(1, 21, 56),
		new Array(8, 6, 57), new Array(15, 10, 58), new Array(6, 15, 59),
		new Array(13, 21, 60), new Array(4, 6, 61), new Array(11, 10, 62),
		new Array(2, 15, 63), new Array(9, 21, 64));

function MD5_F(x, y, z) {
	return (x & y) | (~x & z);
}
function MD5_G(x, y, z) {
	return (x & z) | (y & ~z);
}
function MD5_H(x, y, z) {
	return x ^ y ^ z;
}
function MD5_I(x, y, z) {
	return y ^ (x | ~z);
}

var MD5_round = new Array(new Array(MD5_F, MD5_round1), new Array(MD5_G,
		MD5_round2), new Array(MD5_H, MD5_round3), new Array(MD5_I, MD5_round4));

function MD5_pack(n32) {
	return String.fromCharCode(n32 & 0xff)
			+ String.fromCharCode((n32 >>> 8) & 0xff)
			+ String.fromCharCode((n32 >>> 16) & 0xff)
			+ String.fromCharCode((n32 >>> 24) & 0xff);
}

function MD5_unpack(s4) {
	return s4.charCodeAt(0) | (s4.charCodeAt(1) << 8)
			| (s4.charCodeAt(2) << 16) | (s4.charCodeAt(3) << 24);
}

function MD5_number(n) {
	while (n < 0)
		n += 4294967296;
	while (n > 4294967295)
		n -= 4294967296;
	return n;
}

function MD5_apply_round(x, s, f, abcd, r) {
	var a, b, c, d;
	var kk, ss, ii;
	var t, u;

	a = abcd[0];
	b = abcd[1];
	c = abcd[2];
	d = abcd[3];
	kk = r[0];
	ss = r[1];
	ii = r[2];

	u = f(s[b], s[c], s[d]);
	t = s[a] + u + x[kk] + MD5_T[ii];
	t = MD5_number(t);
	t = ((t << ss) | (t >>> (32 - ss)));
	t += s[b];
	s[a] = MD5_number(t);
}

function MD5_hash(data) {
	var abcd, x, state, s;
	var len, index, padLen, f, r;
	var i, j, k;
	var tmp;

	state = new Array(0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476);
	len = data.length;
	index = len & 0x3f;
	padLen = (index < 56) ? (56 - index) : (120 - index);
	if (padLen > 0) {
		data += "\x80";
		for (i = 0; i < padLen - 1; i++)
			data += "\x00";
	}
	data += MD5_pack(len * 8);
	data += MD5_pack(0);
	len += padLen + 8;
	abcd = new Array(0, 1, 2, 3);
	x = new Array(16);
	s = new Array(4);

	for (k = 0; k < len; k += 64) {
		for (i = 0, j = k; i < 16; i++, j += 4) {
			x[i] = data.charCodeAt(j) | (data.charCodeAt(j + 1) << 8)
					| (data.charCodeAt(j + 2) << 16)
					| (data.charCodeAt(j + 3) << 24);
		}
		for (i = 0; i < 4; i++)
			s[i] = state[i];
		for (i = 0; i < 4; i++) {
			f = MD5_round[i][0];
			r = MD5_round[i][1];
			for (j = 0; j < 16; j++) {
				MD5_apply_round(x, s, f, abcd, r[j]);
				tmp = abcd[0];
				abcd[0] = abcd[3];
				abcd[3] = abcd[2];
				abcd[2] = abcd[1];
				abcd[1] = tmp;
			}
		}

		for (i = 0; i < 4; i++) {
			state[i] += s[i];
			state[i] = MD5_number(state[i]);
		}
	}

	return MD5_pack(state[0]) + MD5_pack(state[1]) + MD5_pack(state[2])
			+ MD5_pack(state[3]);
}

function MD5_hexhash(data) {
	var i, out, c;
	var bit128;

	bit128 = MD5_hash(data);
	out = "";
	for (i = 0; i < 16; i++) {
		c = bit128.charCodeAt(i);
		out += "0123456789abcdef".charAt((c >> 4) & 0xf);
		out += "0123456789abcdef".charAt(c & 0xf);
	}
	return out;
};

// rc2.js
// RC2 JavaScript port by Igor Afanasyev <afan@mail.ru>
// Copyright Evernote Corporation, 2008-2009

var RC2 = {

	keyschedule : function(xkey_string, bits) {

		/* Converting the key string into array of bytes */

		var xkey = xkey_string.split("");
		for ( var i = 0; i < xkey.length; i++) {
			xkey[i] = xkey[i].charCodeAt(0);
		}

		/* 256-entry permutation table, probably derived somehow from pi */

		var permute = new Array(217, 120, 249, 196, 25, 221, 181, 237, 40, 233,
				253, 121, 74, 160, 216, 157, 198, 126, 55, 131, 43, 118, 83,
				142, 98, 76, 100, 136, 68, 139, 251, 162, 23, 154, 89, 245,
				135, 179, 79, 19, 97, 69, 109, 141, 9, 129, 125, 50, 189, 143,
				64, 235, 134, 183, 123, 11, 240, 149, 33, 34, 92, 107, 78, 130,
				84, 214, 101, 147, 206, 96, 178, 28, 115, 86, 192, 20, 167,
				140, 241, 220, 18, 117, 202, 31, 59, 190, 228, 209, 66, 61,
				212, 48, 163, 60, 182, 38, 111, 191, 14, 218, 70, 105, 7, 87,
				39, 242, 29, 155, 188, 148, 67, 3, 248, 17, 199, 246, 144, 239,
				62, 231, 6, 195, 213, 47, 200, 102, 30, 215, 8, 232, 234, 222,
				128, 82, 238, 247, 132, 170, 114, 172, 53, 77, 106, 42, 150,
				26, 210, 113, 90, 21, 73, 116, 75, 159, 208, 94, 4, 24, 164,
				236, 194, 224, 65, 110, 15, 81, 203, 204, 36, 145, 175, 80,
				161, 244, 112, 57, 153, 124, 58, 133, 35, 184, 180, 122, 252,
				2, 54, 91, 37, 85, 151, 49, 45, 93, 250, 152, 227, 138, 146,
				174, 5, 223, 41, 16, 103, 108, 186, 201, 211, 0, 230, 207, 225,
				158, 168, 44, 99, 22, 1, 63, 88, 226, 137, 169, 13, 56, 52, 27,
				171, 51, 255, 176, 187, 72, 12, 95, 185, 177, 205, 46, 197,
				243, 219, 71, 229, 165, 156, 119, 10, 166, 32, 104, 254, 127,
				193, 173);

		if (!bits)
			bits = 1024;

		/* Phase 1: Expand input key to 128 bytes */

		var len = xkey.length;
		for ( var i = len; i < 128; i++) {
			xkey[i] = permute[(xkey[i - 1] + xkey[i - len]) & 255];
		}

		/* Phase 2 - reduce effective key size to "bits" */

		var len = (bits + 7) >> 3;
		var i = 128 - len;
		var x = permute[xkey[i] & (255 >> (7 & -bits))];
		xkey[i] = x;
		while (i--) {
			x = permute[x ^ xkey[i + len]];
			xkey[i] = x;
		}

		/* Phase 3 - copy to key array of words in little-endian order */

		var key = new Array(64);
		i = 63;
		do {
			key[i] = (xkey[2 * i] & 255) + (xkey[2 * i + 1] << 8);
		} while (i--);

		return key;
	},

	decrypt_chunk : function(input, xkey) {
		var x76, x54, x32, x10, i;
		x76 = (input.charCodeAt(7) << 8) + input.charCodeAt(6);
		x54 = (input.charCodeAt(5) << 8) + input.charCodeAt(4);
		x32 = (input.charCodeAt(3) << 8) + input.charCodeAt(2);
		x10 = (input.charCodeAt(1) << 8) + input.charCodeAt(0);

		i = 15;
		do {
			x76 &= 65535;
			x76 = (x76 << 11) + (x76 >> 5);
			x76 -= (x10 & ~x54) + (x32 & x54) + xkey[4 * i + 3];

			x54 &= 65535;
			x54 = (x54 << 13) + (x54 >> 3);
			x54 -= (x76 & ~x32) + (x10 & x32) + xkey[4 * i + 2];

			x32 &= 65535;
			x32 = (x32 << 14) + (x32 >> 2);
			x32 -= (x54 & ~x10) + (x76 & x10) + xkey[4 * i + 1];

			x10 &= 65535;
			x10 = (x10 << 15) + (x10 >> 1);
			x10 -= (x32 & ~x76) + (x54 & x76) + xkey[4 * i + 0];

			if (i == 5 || i == 11) {
				x76 -= xkey[x54 & 63];
				x54 -= xkey[x32 & 63];
				x32 -= xkey[x10 & 63];
				x10 -= xkey[x76 & 63];
			}
		} while (i--);

		var out = String.fromCharCode(x10 & 255)
				+ String.fromCharCode((x10 >> 8) & 255)
				+ String.fromCharCode(x32 & 255)
				+ String.fromCharCode((x32 >> 8) & 255)
				+ String.fromCharCode(x54 & 255)
				+ String.fromCharCode((x54 >> 8) & 255)
				+ String.fromCharCode(x76 & 255)
				+ String.fromCharCode((x76 >> 8) & 255);

		return out;
	},

	decrypt : function(str, key, bits) {
		var out = "";
		var key_array = this.keyschedule(key, bits);

		while (str.length > 0) {
			var chunk = str.slice(0, 8);
			str = str.slice(8);
			out = out + this.decrypt_chunk(chunk, key_array);
		}

		return out;
	}

}; // end of RC2 namespace

// utf8.js
/**
 * Adapted from: http://www.webtoolkit.info/javascript-base64.html License:
 * http://www.webtoolkit.info/licence.html Which reads (2009-08-04): As long as
 * you leave the copyright notice of the original script, or link back to this
 * website, you can use any of the content published on this website free of
 * charge for any use: commercial or noncommercial.
 */
/**
 * 
 * UTF-8 data encode / decode http://www.webtoolkit.info/
 * 
 */

var Utf8 = {

	// public method for url encoding
	encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for ( var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// public method for url decoding
	decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12)
						| ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};

// en-crypt.js
// EN-Crypt helper logic by Igor Afanasyev <afan@mail.ru>
// Copyright Evernote Corporation, 2008-2009
var ENCrypt = {

	EN_RC2_ENCRYPTION_KEYSIZE : 64,

	decrypt : function(base64str, passphrase) {
		// Password is UTF8-encoded before MD5 is calculated.
		// MD5 is used in raw (not hex-encoded) form.

		var str = RC2.decrypt(Base64.decode(base64str), MD5_hash(Utf8
				.encode(passphrase)), this.EN_RC2_ENCRYPTION_KEYSIZE);

		// First 4 chars of the string is the HEX-representation of the
		// upper-byte of the CRC32 of the string.
		// If CRC32 is valid, we return the decoded string, otherwise return
		// null

		var crc = str.slice(0, 4);
		str = str.slice(4);

		var realcrc = crc32(str) ^ (-1); // Windows client implementation of
											// CRC32 is broken, hence the " ^
											// (-1)" fix
		realcrc = realcrc >>> 0; // trick to make value an uint before
									// converting to hex
		realcrc = this.d2h(realcrc).substring(0, 4).toUpperCase(); // convert
																	// to hex,
																	// take only
																	// first 4
																	// uppercase
																	// hex
																	// digits to
																	// compare

		if (realcrc == crc) {

			// Get rid of zero symbols at the end of the string, if any

			while ((str.length > 0) && (str.charCodeAt(str.length - 1) == 0))
				str = str.slice(0, str.length - 1);

			// Return Unicode string

			return Utf8.decode(str);

		} else {
			return null;
		}
	},

	d2h : function(d) {
		return d.toString(16);
	}

}; // end of ENCrypt namespace

function B64_encode(a,b){b||(b=a.length);for(var c="",d=0,e=0,f=0;b--;)for(e<<=8,e|=a[f++],d+=8;6<=d;)var g=e>>d-6&63,c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(g),d=d-6;d&&(g=e<<8>>d+8-6&63,c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(g));return c}
function base64_encode(a,b){b||(b=a.length);for(var c="",d=0,e=0,f=0;b--;)for(e<<=8,e|=a[f++],d+=8;6<=d;)var g=e>>d-6&63,c=c+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g),d=d-6;d&&(g=e<<8>>d+8-6&63,c+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(g));for(;c.length%4;)c+="=";return c}
var B64_inmap=[0,0,0,0,0,0,0,0,0,0,0,0,0,63,0,0,53,54,55,56,57,58,59,60,61,62,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,0,0,0,0,64,0,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,0,0,0,0,0];function B64_decode(a){for(var b=[],c=0,d=0,e=0;e<a.length;++e){var f=a.charCodeAt(e);if(32>f||127<f||!B64_inmap[f-32])return[];c<<=6;c|=B64_inmap[f-32]-1;d+=6;8<=d&&(b.push(c>>d-8&255),d-=8)}return b};function MifareClassic(){this.WRITE_COMMAND=160}MifareClassic.prototype.log2sec=function(a){return 2>a?0:Math.floor((a-2)/3)+1};MifareClassic.prototype.log2phy=function(a){return 2>a?a+1:4*this.log2sec(a)+(a-2)%3};MifareClassic.prototype.mif_calc_crc8=function(a){for(var b=199,c=0;c<a.length;c++)for(var b=b^a[c],d=0;8>d;d++)b=b&128?b<<1^29:b<<1;return b};MifareClassic.prototype.mif_calc_crc16=function(a){for(var b=51084,c=0;c<a.length;c++)for(var b=b^a[c]<<8,d=0;8>d;d++)b=b&32768?b<<1^4129:b<<1;return b};
MifareClassic.prototype.copy_auth_keys=function(a,b){for(var c=0;6>c;c++)a[c]=b.auth_key[c];for(c=0;6>c;c++)a[c+10]=255;return a};
MifareClassic.prototype.read_physical=function(a,b,c,d){function e(a){k.publicAuthentication(a,function(c,b){if(c)return g(c);k.read_block(a,function(c,b){if(c)return g(c);b=new Uint8Array(b);3==a%4&&(b=f.copy_auth_keys(b,k));h=UTIL_concat(h,b);if(3==a&&105!=h[57]){var m;for(m=0;3==h[2*m+18]&&225==h[2*m+19];m++);m=4*(m+1);m<l&&(l=m)}return a+1>=l?g(h):e(a+1,d)})})}var f=this,g=d,k=a,h=new Uint8Array,l=64;null!=c&&(l=b+c);e(b)};
MifareClassic.prototype.read=function(a,b){b||(b=defaultCallback);var c=b;new Uint8Array;this.read_physical(a,0,null,function(a){for(var b=0;b<Math.ceil(a.length/16);b++)console.log(UTIL_fmt("[DEBUG] Sector["+UTIL_BytesToHex([b])+"] "+UTIL_BytesToHex(a.subarray(16*b,16*b+16))));if(105==a[57])console.log("[DEBUG] Sector 0 is non-personalized (0x69).");else{var f;for(f=0;3==a[2*f+18]&&225==a[2*f+19];f++);for(var g=new Uint8Array,b=1;b<=f;b++)g=UTIL_concat(g,a.subarray(64*b,64*b+48));for(b=0;b<g.length;b++)switch(g[b]){case 0:console.log("[DEBUG] NULL TLV.");
break;case 254:console.log("[DEBUG] Terminator TLV.");return;case 3:return a=g[b+1],a+2>g.length&&console.log("[WARN] Vlen:"+a+" > totla len:"+g.length),c(0,(new Uint8Array(g.subarray(b+2,b+2+a))).buffer);default:console.log("[ERROR] Unsupported TLV: "+UTIL_BytesToHex(g[0]));return}}})};MifareClassic.prototype.read_logic=function(a,b,c,d){function e(c,b){if(0>=b)return g(k);f.read_physical(a,f.log2phy(c),1,function(a){k=UTIL_concat(k,a);e(c+1,b-1)})}var f=this,g=d,k=new Uint8Array;e(b,c)};
MifareClassic.prototype.compose=function(a){var b=new Uint8Array([3,a.length]),c=new Uint8Array([254]),d=UTIL_concat(b,UTIL_concat(new Uint8Array(a),c));a=Math.ceil(d.length/48);b=new Uint8Array;for(c=0;c<a;c++){var b=UTIL_concat(b,d.subarray(48*c,48*(c+1))),e;e=c+1==a?new Uint8Array(48-d.length%48):new Uint8Array(0);b=UTIL_concat(b,e);b=UTIL_concat(b,new Uint8Array([211,247,211,247,211,247,127,7,136,64,255,255,255,255,255,255]))}d=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,225,0,0,0,0,
0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,160,161,162,163,164,165,120,119,136,193,255,255,255,255,255,255]);for(c=0;c<a;c++)d[2*(c+1)+16]=3,d[2*(c+1)+17]=225;d[16]=this.mif_calc_crc8(d.subarray(17,48));return UTIL_concat(d,b)};
MifareClassic.prototype.write_physical=function(a,b,c,d,e){function f(a,b){if(a)return l(a);var d=h.subarray(0,16);g.write_block(k,d,function(a){if(a)return l(a);n.write_physical(g,k+1,c,h.subarray(16),l)},n.WRITE_COMMAND)}var g=a,k=b,h=d,l=e,n=this;if(0==h.length)return l(0);16>h.length&&(h=UTIL_concat(h,new Uint8Array(16-h.length)));null==c?g.publicAuthentication(k,f):g.privateAuthentication(k,c,f)};
MifareClassic.prototype.write=function(a,b,c){c||(c=defaultCallback);b=this.compose(new Uint8Array(b));if(64<Math.ceil(b.length/16))return console.log("write Classic() card is too big (max: 1024 bytes): "+b.length),c(3003);this.write_physical(a,1,null,b.subarray(16),c)};
MifareClassic.prototype.write_logic=function(a,b,c,d){function e(a,c,b){var d=c,m=b;if(0==m.length)return g(0);f.write_physical(a,f.log2phy(d),null,m.subarray(0,16),function(c){if(c)return g(c);var b=4*f.log2sec(d)+3;a.read_block(b,function(c,h){if(c)return g(c);h=new Uint8Array(h);h=f.copy_auth_keys(h,a);h[9]=3==b?193:64;a.write_block(b,h,function(c){d+=1;m=m.subarray(16);return e(a,d,m)},f.WRITE_COMMAND)})})}var f=this,g=d;e(a,b,c)};
MifareClassic.prototype.emulate=function(a,b,c,d){b=this.compose(new Uint8Array(b.compose()));return a.emulate_tag(b,c,d)};function NDEF(a,b){this.ndef=[];this.prepending=" http://www. https://www. http:// https:// tel: mailto: ftp://anonymous:anonymous@ ftp://ftp. ftps:// sftp:// smb:// nfs:// ftp:// dav:// news: telnet:// imap: rtsp:// urn: pop: sip: sips: tftp: btspp:// btl2cpa:// btgoep:// tcpobex:// irdaobex:// file:// urn:epc:id: urn:epc:tag: urn:epc:pat: urn:epc:raw: urn:epc: urn:nfc:".split(" ");a&&(this.ndef=this.parse(a,b))}
NDEF.prototype.parse=function(a,b){var c,d=[];a=new Uint8Array(a);for(c=0;c<a.length;c++){var e=(a[c]&128)>>7,f=(a[c]&64)>>6,g=(a[c]&16)>>4,k=(a[c]&8)>>3,h=(a[c]&7)>>0,l,n=a[c+1],m,p=4+n,q,r;g?(l=3,p=3+n,q=a[c+2]):(l=6,p=6+n,q=256*(256*(256*a[c+2]+a[c+3])+a[c+4])+a[c+5]);k&&(l+=1,m=a[c+l-1],p+=1+m,r=l+n,a.subarray(c+r,c+r+m));m=new Uint8Array(a.subarray(c+l,c+l+n));r=new Uint8Array(a.subarray(c+p,c+p+q));console.log("raw[i]: "+a[c]);console.log("MB: "+e);console.log("ME: "+f);console.log("SR: "+g);
console.log("IL: "+k);console.log("TNF: "+h);console.log("type_off: "+l);console.log("type_len: "+n);console.log("payload_off: "+p);console.log("payload_len: "+q);console.log("type: "+UTIL_BytesToHex(m));console.log("payload: "+UTIL_BytesToHex(r));switch(h){case 1:d.push(this.parse_RTD(m[0],r));break;case 2:d.push(this.parse_MIME(m,r));break;default:console.log("Unsupported TNF: "+h)}c=p+q-1;if(f)break}b&&b(d);return d};
NDEF.prototype.compose=function(){for(var a=new Uint8Array,b=[],c=0;c<this.ndef.length;c++){var d=this.ndef[c];switch(d.type){case "TEXT":case "Text":b.push({TNF:1,TYPE:new Uint8Array([84]),PAYLOAD:this.compose_RTD_TEXT(d.lang,d.text)});break;case "URI":b.push({TNF:1,TYPE:new Uint8Array([85]),PAYLOAD:this.compose_RTD_URI(d.uri)});break;case "MIME":b.push({TNF:2,TYPE:new Uint8Array(UTIL_StringToBytes(d.mime_type)),PAYLOAD:this.compose_MIME(d.payload)});break;default:console.log("Unsupported RTD type:"+
d.type)}}for(c=0;c<b.length;c++)var d=16|b[c].TNF,d=d|(0==c?128:0),d=d|(c==b.length-1?64:0),e=b[c].TYPE,f=b[c].PAYLOAD,a=UTIL_concat(a,[d,e.length,f.length]),a=UTIL_concat(a,e),a=UTIL_concat(a,f);return a.buffer};
NDEF.prototype.add=function(a){"uri"in a?a.type="URI":"text"in a?a.type="TEXT":"payload"in a&&(a.type="MIME");switch(a.type){case "TEXT":case "Text":"encoding"in a||(a.encoding="utf8");"lang"in a||(a.lang="en");if("text"in a)return this.ndef.push(a),!0;break;case "URI":if("uri"in a)return this.ndef.push(a),!0;break;case "MIME":if("mime_type"in a&&"payload"in a)return this.ndef.push(a),!0;default:console.log("Unsupported RTD type:"+entry.type)}return!1};
NDEF.prototype.parse_RTD=function(a,b){switch(a){case 84:return this.parse_RTD_TEXT(b);case 85:return this.parse_RTD_URI(b);default:console.log("Unsupported RTD type: "+a)}};NDEF.prototype.parse_MIME=function(a,b){return{type:"MIME",mime_type:UTIL_BytesToString(a),payload:UTIL_BytesToString(b)}};NDEF.prototype.compose_MIME=function(a){return new Uint8Array(UTIL_StringToBytes(a))};
NDEF.prototype.parse_RTD_TEXT=function(a){var b=(a[0]&128)>>7,c=a[0]&63,d=a.subarray(1,1+c);a=a.subarray(1+c,a.length);return{type:"Text",encoding:b?"utf16":"utf8",lang:UTIL_BytesToString(d),text:UTIL_BytesToString(a)}};NDEF.prototype.compose_RTD_TEXT=function(a,b){var c=a.length,c=63<c?63:c;return new Uint8Array([c].concat(UTIL_StringToBytes(a.substring(0,c))).concat(UTIL_StringToBytes(b)))};
NDEF.prototype.parse_RTD_URI=function(a){return{type:"URI",uri:this.prepending[a[0]]+UTIL_BytesToString(a.subarray(1,a.length))}};NDEF.prototype.compose_RTD_URI=function(a){for(var b=-1,c,d=0;d<this.prepending.length;d++)a.substring(0,this.prepending[d].length)==this.prepending[d]&&this.prepending[d].length>b&&(c=d,b=this.prepending[d].length);return new Uint8Array([c].concat(UTIL_StringToBytes(a.substring(b))))};function NFC(){function a(a){for(var c=new NDEF,b=0;b<a.length;b++)c.add(a[b]);return c}function b(){return{tt2:new TT2,mifare_classic:new MifareClassic}}function c(a,c,b){void 0==b&&(b=9999999999);a.wait_for_passive_target(b,function(a,b,d){if(a)return console.log("NFC.wait_for_passive_target() = "+a),c(a),a;console.log("[DEBUG] nfc.wait_for_passive_target: "+b+" with ID: "+d);c(a,b,d)})}return{getDevices:function(a){var c=new usbSCL3711;window.setTimeout(function(){c.open(0,function(b){if(b)return console.log("NFC.device.open() = "+
b),a(null),b;c.vendorId=c.dev.dev.vendorId;c.productId=c.dev.dev.productId;a([c])})},1E3)},read:function(a,e,f){c(a,function(c,e){var h=b()[e];h?h.read(a,function(a,c){if(a)return console.log("NFC.read.read() = "+a),f(null,null),a;var b=new NDEF(c);f(e+".ndef",b)}):console.log("nfc.read: unknown tag_type: "+e)},e.timeout)},read_logic:function(a,e,f,g){c(a,function(c,h){var l=b()[h];l?l.read_logic?l.read_logic(a,e,f,function(a){g(0,a)}):console.log("nfc.read: "+h+" doesn't support reading logic block"):
console.log("nfc.read_logic: unknown tag_type: "+h)})},wait_for_tag:function(a,b,f){var g=function(b){c(a,function(a,c,d){0<=a?f(c,d):0<b?window.setTimeout(function(){g(b-250)},250):f(null,null)})};g(b)},write:function(d,e,f,g){c(d,function(c,h){var g=b()[h];if(g){var n=a(e.ndef);g.write(d,n.compose(),function(a){f(a)})}else console.log("nfc.write: unknown tag_type: "+h)},g)},write_logic:function(a,e,f,g){c(a,function(c,h){var l=b()[h];l?l.read_logic?l.write_logic(a,e,f,function(a){g(a)}):console.log("nfc.read: "+
h+" doesn't support reading logic block"):console.log("nfc.write_logic: unknown tag_type: "+h)})},write_physical:function(a,e,f,g,k){c(a,function(c,l){var n=b()[l];n?n.read_physical?n.write_physical(a,e,f,g,function(a){k(a)}):console.log("nfc.read: "+l+" doesn't support reading physical block"):console.log("nfc.write_physical: unknown tag_type: "+l)})},emulate_tag:function(b,e,f,g){void 0==g&&(g=9999999999);c(b,function(c,h){var l=new TT2,n=a(e.ndef);l.emulate(b,n,g,function(a){f(a)})},g)}}}
chrome.nfc=NFC();function devManager(){this.devs=[];this.enumerators=[]}devManager.prototype.dropDevice=function(a){var b=this.devs;this.devs=[];for(var c=!1,d=0;d<b.length;++d)b[d]!==a?this.devs.push(b[d]):c=!0;c&&(a.dev&&(chrome.usb.releaseInterface(a.dev,0,function(){console.log(UTIL_fmt("released"))}),chrome.usb.closeDevice(a.dev,function(){console.log(UTIL_fmt("closed"))}),a.dev=null),console.log(this.devs.length+" devices remaining"))};
devManager.prototype.closeAll=function(){for(var a=this.devs.slice(0),b=0;b<a.length;++b)a[b].close();chrome.usb.getDevices({vendorId:1254,productId:21905},function(a){if(a)for(var b=0;b<a.length;++b)chrome.usb.closeDevice(a[b])});chrome.usb.getDevices({vendorId:1839,productId:8704},function(a){if(a)for(var b=0;b<a.length;++b)chrome.usb.closeDevice(a[b])})};
devManager.prototype.enumerate=function(a){function b(a,b){var d=0;if(a&&0!=a.length)console.log(UTIL_fmt("Enumerated "+a.length+" devices")),console.log(a),d=a.length;else if(a)console.log("No devices found");else{console.log("Lacking permission?");do(function(a){a&&window.setTimeout(function(){a(-666)},0)})(c.enumerators.shift());while(c.enumerators.length);return}for(var k=0;k<d;++k)(function(a){window.setTimeout(function(){chrome.usb.claimInterface(a,0,function(d){console.log(UTIL_fmt("claimed"));
console.log(a);c.devs.push(new llSCL3711(a,b))})},0)})(a[k]);var h=new Uint8Array(4);h[0]=d>>24;h[1]=d>>16;h[2]=d>>8;h[3]=d;for(var l=0<d?20:200;c.enumerators.length;)(function(a){window.setTimeout(function(){a&&a(0,h)},l)})(c.enumerators.shift())}var c=this;if(0!=this.devs.length){var d=new Uint8Array(4);d[0]=this.devs.length>>24;d[1]=this.devs.length>>16;d[2]=this.devs.length>>8;d[3]=this.devs.length;a&&a(0,d)}else d=0==this.enumerators.length,this.enumerators.push(a),d&&window.setTimeout(function(){chrome.usb.getDevices({vendorId:1254,
productId:21905},function(a){a&&0!=a.length?b(a,!1):chrome.usb.getDevices({vendorId:1839,productId:8704},function(a){a&&0!=a.length&&b(a,!0)})})},0)};devManager.prototype.open=function(a,b,c){var d=this;this.enumerate(function(){var e=d.devs[a];e&&e.registerClient(b);c&&c(e||null)})};devManager.prototype.close=function(a,b){for(var c=this.devs,d=0;d<c.length;++d)c[d].deregisterClient(b)};
var defaultCallback=function(a,b){var c="defaultCallback("+a;b&&(c+=", "+UTIL_BytesToHex(new Uint8Array(b)));console.log(UTIL_fmt(c+")"))},dev_manager=new devManager;var scl3711_id=0;
function usbSCL3711(){this.dev=null;this.cid=++scl3711_id&16777215;this.rxframes=[];this.authed_sector=this.auth_key=this.detected_tag=this.onclose=this.rxcb=null;this.KEYS=[new Uint8Array([255,255,255,255,255,255]),new Uint8Array([211,247,211,247,211,247]),new Uint8Array([160,161,162,163,164,165])];this.strerror=function(a){var b={1:"time out, the target has not answered",2:"checksum error during rf communication",3:"parity error during rf communication",4:"erroneous bit count in anticollision",5:"framing error during mifare operation",
6:"abnormal bit collision in 106 kbps anticollision",7:"insufficient communication buffer size",9:"rf buffer overflow detected by ciu",10:"rf field not activated in time by active mode peer",11:"protocol error during rf communication",13:"overheated - antenna drivers deactivated",14:"internal buffer overflow",16:"invalid command parameter",18:"unsupported command from initiator",19:"format error during rf communication",20:"mifare authentication error",24:"not support NFC secure",25:"i2c bus line is busy",
35:"wrong uid check byte (14443-3)",37:"command invalid in current dep state",38:"operation not allowed in this configuration",39:"not acceptable command due to context",41:"released by initiator while operating as target",42:"card ID does not match",43:"the card previously activated has disapperaed",44:"Mismatch between NFCID3 initiator and target in DEP 212/424 kbps",45:"Over-current event has been detected",46:"NAD missing in DEP frame",47:"deselected by initiator while operating as target",49:"initiator rf-off state detected in passive mode",
127:"pn53x application level error"};return a in b?"["+a+"] "+b[a]:"Unknown error: "+a}}usbSCL3711.prototype.notifyFrame=function(a){0!=this.rxframes.length?a&&window.setTimeout(a,0):this.rxcb=a};usbSCL3711.prototype.receivedFrame=function(a){if(!this.rxframes)return!1;this.rxframes.push(a);a=this.rxcb;this.rxcb=null;a&&window.setTimeout(a,0);return!0};usbSCL3711.prototype.readFrame=function(){if(0==this.rxframes.length)throw"rxframes empty!";return this.rxframes.shift()};
usbSCL3711.prototype.read=function(a,b){function c(a,c){f&&(window.clearTimeout(f),f=null);var b=g;b&&(g=null,window.setTimeout(function(){b(a,c)},0))}function d(){g&&f&&(console.log(UTIL_fmt("["+k.cid.toString(16)+"] timeout!")),f=null,c(-5))}function e(){if(g&&f){var a=new Uint8Array(k.readFrame());if(6==a.length&&0==a[0]&&0==a[1]&&255==a[2]&&0==a[3]&&255==a[4]&&0==a[5])k.notifyFrame(e);else{10<a.length&&(128==a[0]?a=UTIL_concat(new Uint8Array([0,0,255,1,255]),new Uint8Array(a.subarray(10))):131==
a[0]&&(a=UTIL_concat(new Uint8Array([0,0,255,1,255]),new Uint8Array(a.subarray(10)))));if(7==a.length){if(144==a[5]&&0==a[6]){c(0,a.buffer);return}if(99==a[5]&&0==a[6]){c(2730,a.buffer);return}}else if(6<a.length&&0==a[0]&&0==a[1]&&255==a[2]&&256==a[3]+a[4]){if(213==a[5]&&65==a[6]){0==a[7]?c(0,(new Uint8Array(a.subarray(8,a.length-2))).buffer):console.log("ERROR: InDataExchange reply status = "+k.strerror(a[7]));return}if(213==a[5]&&141==a[6]){c(0,(new Uint8Array(a.subarray(8,a.length-2))).buffer);
return}if(213==a[5]&&137==a[6]){0==a[7]?c(0,(new Uint8Array(a.subarray(8,a.length-2))).buffer):console.log("ERROR: TgGetInitiatorCommand reply status = "+k.strerror(a[7]));return}if(213==a[5]&&145==a[6]){0==a[7]?c(0,(new Uint8Array(a.subarray(8,a.length-2))).buffer):console.log("ERROR: TgResponseToInitiator reply status = "+k.strerror(a[7]));return}if(213==a[5]&&51==a[6]){c(0,(new Uint8Array(a.subarray(7,a.length-2))).buffer);return}if(213==a[5]&&75==a[6])if(1==a[7]&&1==a[8]){console.log("DEBUG: InListPassiveTarget SENS_REQ=0x"+
(256*a[9]+a[10]).toString(16)+", SEL_RES=0x"+a[11].toString(16));if(0==a[9]&&68==a[10]){console.log("DEBUG: found Mifare Ultralight (106k type A)");k.detected_tag="Mifare Ultralight";k.authed_sector=null;k.auth_key=null;c(0,"tt2");return}if(0==a[9]&&4==a[10]){console.log("DEBUG: found Mifare Classic 1K (106k type A)");k.detected_tag="Mifare Classic 1K";k.authed_sector=null;k.auth_key=null;c(0,"mifare_classic");return}}else{console.log("DEBUG: found "+a[7]+" target, tg="+a[8]);return}}c(2184,a.buffer)}}}
if(this.dev){var f=null,g=b,k=this,f=window.setTimeout(d,1E3*a);k.notifyFrame(e)}else b(1)};usbSCL3711.prototype.write=function(a){this.dev.writeFrame(a)};usbSCL3711.prototype.exchange=function(a,b,c){this.write(a);this.read(b,c)};
usbSCL3711.prototype.acr122_reset_to_good_state=function(a){var b=this;b.exchange((new Uint8Array([0,0,255,0,255,0])).buffer,1,function(c,d){b.exchange((new Uint8Array([98,0,0,0,0,0,0,1,0,0])).buffer,10,function(c,b){console.log("[DEBUG] icc_power_on: turn on the device power");a&&window.setTimeout(function(){a()},100)})})};usbSCL3711.prototype.acr122_set_buzzer=function(a,b){this.exchange((new Uint8Array([107,5,0,0,0,0,0,0,0,0,255,0,82,a?255:0,0])).buffer,1,function(a,d){b&&b(a,d)})};
usbSCL3711.prototype.acr122_load_authentication_keys=function(a,b,c){null==a?a=this.KEYS[0]:"object"!=typeof a&&(a=this.KEYS[a]);var d=new Uint8Array([107,11,0,0,0,0,0,0,0,0,255,130,0,b,6]),d=UTIL_concat(d,a);this.exchange(d.buffer,1,function(d,f){console.log("[DEBUG] acr122_load_authentication_keys(loc: "+b+", key: "+UTIL_BytesToHex(a)+") = "+d);c&&c(d,f)})};
usbSCL3711.prototype.acr122_authentication=function(a,b,c,d){this.exchange((new Uint8Array([107,10,0,0,0,0,0,0,0,0,255,134,0,0,5,1,0,a,c,b])).buffer,1,function(e,f){console.log("[DEBUG] acr122_authentication(loc: "+b+", type: "+c+", block: "+a+") = "+e);d&&d(e,f)})};
usbSCL3711.prototype.publicAuthentication=function(a,b){function c(b){3<=b?e&&e(4095):d.acr122_load_authentication_keys(b,0,function(k,h){k||d.acr122_authentication(a,0,96,function(h,k){if(h)return c(b+1);d.authed_sector=f;d.auth_key=d.KEYS[b];d.acr122_load_authentication_keys(d.KEYS[0],1,function(b,c){d.acr122_authentication(a,1,97,function(a,b){e&&e(a,b)})})})})}var d=this,e=b,f=Math.floor(a/4);"Mifare Classic 1K"==d.detected_tag?d.dev&&d.dev.acr122?d.authed_sector!=f?(console.log("[DEBUG] Public Authenticate sector "+
f),c(0)):e&&e(0,null):e&&e(0,null):e&&e(0,null)};usbSCL3711.prototype.privateAuthentication=function(a,b,c){var d=this,e=Math.floor(a/4);"Mifare Classic 1K"==d.detected_tag?d.dev&&d.dev.acr122?d.authed_sector!=e?(console.log("[DEBUG] Private Authenticate sector "+e),d.acr122_load_authentication_keys(b,1,function(b,e){d.acr122_authentication(a,1,97,function(a,b){if(a)return console.log("KEY B AUTH ERROR"),a;c&&c(a,b)})})):c&&c(0,null):c&&c(0,null):c&&c(0,null)};
usbSCL3711.prototype.acr122_set_timeout=function(a,b){var c=Math.ceil(a/5);255<=c&&(c=255);console.log("[DEBUG] acr122_set_timeout(round up to "+5*c+" secs)");this.exchange((new Uint8Array([107,5,0,0,0,0,0,0,0,0,255,0,65,c,0])).buffer,1,function(a,c){b&&b(a,c)})};
usbSCL3711.prototype.open=function(a,b,c){this.rxframes=[];this.onclose=c;this.cid&=16777215;this.cid|=a+1<<24;var d=this;dev_manager.open(a,this,function(a){d.dev=a;var c=null!=d.dev?0:1;d.dev&&d.dev.acr122?d.acr122_reset_to_good_state(function(){d.acr122_set_buzzer(!1,function(){b&&b(c)})}):b&&b(c)})};
usbSCL3711.prototype.close=function(){var a=this;(function(b){a.exchange(a.makeFrame(68,new Uint8Array([1])),1,function(b,d){a.exchange(a.makeFrame(82,new Uint8Array([1])),1,function(a,b){})})})(function(){a.rxframes=null;a.dev&&(dev_manager.close(a.dev,a),a.dev=null)})};
usbSCL3711.prototype.makeFrame=function(a,b){var c=new Uint8Array(b?b:[]),d=new Uint8Array(c.length+2),e=c.length+2;if(this.dev.acr122){var e=7+c.length,f=new Uint8Array(10);f[0]=107;f[1]=e>>0&255;f[2]=e>>8&255;f[3]=e>>16&255;f[4]=e>>24&255;f[5]=0;f[6]=0;f[7]=0;f[8]=0;f[9]=0;e=new Uint8Array(5);e[0]=255;e[1]=0;e[2]=0;e[3]=0;e[4]=c.length+2;f=UTIL_concat(f,e)}else f=new Uint8Array(8),f[0]=0,f[1]=0,f[2]=255,f[3]=255,f[4]=255,f[5]=e>>>8,f[6]=e&255,f[7]=256-(f[5]+f[6]&255);d[0]=212;d[1]=a;for(var e=d[0]+
d[1],g=0;g<c.length;++g)d[2+g]=c[g],e+=c[g];c=null;this.dev.acr122?c=new Uint8Array([]):(c=new Uint8Array(2),c[0]=256-(e&255),c[1]=0);return UTIL_concat(UTIL_concat(f,d),c).buffer};usbSCL3711.prototype.wait_for_passive_target=function(a,b){function c(a,b){d.detected_tag=null;d.exchange(d.makeFrame(74,new Uint8Array([1,0])),a,b)}var d=this;b||(b=defaultCallback);d.dev.acr122?d.acr122_set_timeout(a,function(d,f){c(a,b)}):c(a,b)};
usbSCL3711.prototype.read_block=function(a,b){var c=b;b||(b=defaultCallback);var d=new Uint8Array(2);d[0]=48;d[1]=a;this.apdu(d,function(a,b){c(a,b)})};
usbSCL3711.prototype.emulate_tag=function(a,b,c){function d(){var a=new Uint8Array([1,4,0,0,176,11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),a=f.makeFrame(140,a);f.exchange(a,g,function(a,b){0!=a?e(a):(console.log("Emulated as a tag, reply is following:"),k(new Uint8Array(b)))})}c||(c=defaultCallback);var e=c,f=this,g=b,k=function(b){switch(b[0]){case 48:b=b[1];console.log("recv TT2.READ(blk_no="+b+")");b=a.subarray(4*b,4*b+16);16>b.length&&(b=UTIL_concat(b,new Uint8Array(16-
b.length)));b=f.makeFrame(144,b);f.exchange(b,g,function(a,b){if(a)return console.log("exchange(): "+a),a;var c=f.makeFrame(136,[]);f.exchange(c,g,function(a,b){if(a)return console.log("exchange(): "+a),a;k(new Uint8Array(b))})});break;case 80:console.log("recv TT2.HALT received.");e(0);break;default:console.log("Unsupported TT2 tag: "+b[0]),e(2457)}};f.dev.acr122?f.exchange((new Uint8Array([107,5,0,0,0,0,0,0,0,0,255,0,81,0,0])).buffer,1,function(a,c){f.exchange((new Uint8Array([107,9,0,0,0,0,0,0,
0,0,255,0,0,0,4,212,50,1,0])).buffer,1,function(a,c){0!=a?e(a):f.acr122_set_timeout(b,function(a,b){0!=a?e(a):d()})})}):d()};usbSCL3711.prototype.write_block=function(a,b,c,d){null==d&&(d=162);var e=new Uint8Array(2+b.length);e[0]=d;e[1]=a;for(a=0;a<b.length;a++)e[2+a]=b[a];this.apdu(e,function(a,b){c(a)})};
usbSCL3711.prototype.apdu=function(a,b,c){b||(b=defaultCallback);a=new Uint8Array(this.makeFrame(64,UTIL_concat([1],a)));for(var d=0;d<a.length;d+=64)this.dev.writeFrame((new Uint8Array(a.subarray(d,d+64))).buffer);c?b(0,null):this.read(3,function(a,c,d){0!=a?b(a):(a=new Uint8Array(c),d?2>a.length?b(1638):(d=256*a[a.length-2]+a[a.length-1],b(36864==d?0:d,(new Uint8Array(a.subarray(0,a.length-2))).buffer)):b(0,a.buffer))})};function SHA256(){this._buf=Array(64);this._W=Array(64);this._pad=Array(64);this._k=[1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,
2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298];this._pad[0]=128;for(var a=1;64>a;++a)this._pad[a]=0;this.reset()}SHA256.prototype.reset=function(){this._chain=[1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225];this._total=this._inbuf=0};
SHA256.prototype._compress=function(a){function b(a,b){return a<<32-b|a>>>b}for(var c=this._W,d=this._k,e=0;64>e;e+=4)c[e/4]=a[e]<<24|a[e+1]<<16|a[e+2]<<8|a[e+3];for(e=16;64>e;++e){a=b(c[e-15],7)^b(c[e-15],18)^c[e-15]>>>3;var f=b(c[e-2],17)^b(c[e-2],19)^c[e-2]>>>10;c[e]=c[e-16]+a+c[e-7]+f&4294967295}a=this._chain[0];for(var f=this._chain[1],g=this._chain[2],k=this._chain[3],h=this._chain[4],l=this._chain[5],n=this._chain[6],m=this._chain[7],e=0;64>e;++e){var p=(b(a,2)^b(a,13)^b(a,22))+(a&f^a&g^f&
g)&4294967295,q=b(h,6)^b(h,11)^b(h,25),q=m+q+(h&l^~h&n)+d[e]+c[e]&4294967295,m=n,n=l,l=h,h=k+q&4294967295,k=g,g=f,f=a;a=q+p&4294967295}this._chain[0]+=a;this._chain[1]+=f;this._chain[2]+=g;this._chain[3]+=k;this._chain[4]+=h;this._chain[5]+=l;this._chain[6]+=n;this._chain[7]+=m};SHA256.prototype.update=function(a,b){b||(b=a.length);this._total+=b;for(var c=0;c<b;++c)this._buf[this._inbuf++]=a[c],64==this._inbuf&&(this._compress(this._buf),this._inbuf=0)};
SHA256.prototype.updateRange=function(a,b,c){for(this._total+=c-b;b<c;++b)this._buf[this._inbuf++]=a[b],64==this._inbuf&&(this._compress(this._buf),this._inbuf=0)};
SHA256.prototype.digest=function(){for(var a=0;a<arguments.length;++a)this.update(arguments[a]);var b=Array(32),c=8*this._total;56>this._inbuf?this.update(this._pad,56-this._inbuf):this.update(this._pad,64-(this._inbuf-56));for(a=63;56<=a;--a)this._buf[a]=c&255,c>>>=8;this._compress(this._buf);for(a=c=0;8>a;++a)for(var d=24;0<=d;d-=8)b[c++]=this._chain[a]>>d&255;return b};function TT2(){}
TT2.prototype.read=function(a,b){b||(b=defaultCallback);var c=b;a.read_block(0,function(b,e){function f(b,d,e){console.log("[DEBUG] poll_n: "+e);if(0>--e)switch(defaultCallback("[DEBUG] got a type 2 tag:",b.buffer),b[16]){case 0:console.log("[ERROR] NULL TLV.");return;case 254:console.log("[ERROR] Terminator TLV.");return;case 3:var g=b[17];g+18>b.length&&console.log("[WARN] TLV len "+g+" > card len "+b.length);return c(0,(new Uint8Array(b.subarray(18,18+g))).buffer);default:console.log("[ERROR] bad ... I assume the first TLV is NDEF, but "+b[16]);
return}a.read_block(d,function(a,g){if(a)return c(a);b=UTIL_concat(b,new Uint8Array(g));return f(b,d+4,e)})}if(b)return c(b);var g=new Uint8Array(e),k=new Uint8Array(e),h=8*k[14],l=k[12],n=k[13],m=k[15];if(225!=l||1!=(n&240)>>4||0!=(m&240))return console.log("UNsupported type 2 tag: CC0="+l+", CC1="+n+", CC3="+m),c(1911,k.buffer);f(g,4,Math.floor((h+15)/16))})};
TT2.prototype.compose=function(a){var b=new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,225,16,6,0]),c=new Uint8Array([3,a.length]),d=new Uint8Array([254]);return UTIL_concat(b,UTIL_concat(c,UTIL_concat(new Uint8Array(a),d)))};
TT2.prototype.write=function(a,b,c){function d(b,c){if(c>=f)return e(0);var h=b.subarray(4*c,4*c+4);4>h.length&&(h=UTIL_concat(h,new Uint8Array(4-h.length)));a.write_block(c,h,function(a){if(a)return e(a);d(b,c+1)})}c||(c=defaultCallback);var e=c;b=this.compose(new Uint8Array(b));var f=Math.floor((b.length+3)/4);if(16<f)return console.log("write_tt2() card is too big (max: 64 bytes): "+b.length),e(3003);d(b,3)};
TT2.prototype.emulate=function(a,b,c,d){b=this.compose(new Uint8Array(b.compose()));return a.emulate_tag(b,c,d)};function llSCL3711(a,b){this.dev=a;this.txqueue=[];this.clients=[];this.endpoint=(this.acr122=b)?2:4;this.readLoop()}llSCL3711.prototype.notifyClientOfClosure=function(a){(a=a.onclose)&&window.setTimeout(a,0)};llSCL3711.prototype.close=function(){for(;0!=this.clients.length;)this.notifyClientOfClosure(this.clients.shift());dev_manager.dropDevice(this)};
llSCL3711.prototype.publishFrame=function(a){for(var b=this.clients,c=[],d=!1,e=0;e<b.length;++e){var f=b[e];f.receivedFrame(a)?c.push(f):(d=!0,console.log(UTIL_fmt("["+f.cid.toString(16)+"] left?")))}d&&(this.clients=c)};
llSCL3711.prototype.readLoop=function(){if(this.dev){var a=this;chrome.usb.bulkTransfer(this.dev,{direction:"in",endpoint:this.endpoint,length:2048},function(b){if(b.data)if(5<=b.data.byteLength){var c=new Uint8Array(b.data);console.log(UTIL_fmt("<"+UTIL_BytesToHex(c)));a.publishFrame(b.data);window.setTimeout(function(){a.readLoop()},0)}else console.log(UTIL_fmt("tiny reply!")),console.log(b),window.setTimeout(function(){a.close()},0);else throw console.log("no x.data!"),console.log(b),"no x.data!";
})}};llSCL3711.prototype.registerClient=function(a){this.clients.push(a)};llSCL3711.prototype.deregisterClient=function(a){var b=this.clients;this.clients=[];for(var c=0;c<b.length;++c){var d=b[c];d!=a&&this.clients.push(d)}return this.clients.length};
llSCL3711.prototype.writePump=function(){function a(a){c.txqueue.shift();0!=c.txqueue.length&&window.setTimeout(function(){c.writePump()},0)}if(this.dev&&0!=this.txqueue.length){var b=this.txqueue[0],c=this,d=new Uint8Array(b);console.log(UTIL_fmt(">"+UTIL_BytesToHex(d)));chrome.usb.bulkTransfer(this.dev,{direction:"out",endpoint:this.endpoint,data:b},a)}};llSCL3711.prototype.writeFrame=function(a){if(!this.dev)return!1;var b=0==this.txqueue.length;this.txqueue.push(a);b&&this.writePump();return!0};function UTIL_StringToBytes(a,b){b=b||Array(a.length);for(var c=0;c<a.length;++c)b[c]=a.charCodeAt(c);return b}function UTIL_BytesToString(a){for(var b=new String,c=0;c<a.length;++c)b+=String.fromCharCode(a[c]);return b}function UTIL_BytesToHex(a){if(!a)return"(null)";for(var b=Array(2*a.length),c=0;c<a.length;++c)b[2*c+0]="0123456789ABCDEF".charAt(a[c]>>4&15),b[2*c+1]="0123456789ABCDEF".charAt(a[c]&15);return b.join("")}
function UTIL_BytesToHexWithSeparator(a,b){for(var c=2+(b?1:0),d=Array(a.length*c),e=0;e<a.length;++e)b&&(d[e*c+0]=b),d[e*c+c-2]="0123456789ABCDEF".charAt(a[e]>>4&15),d[e*c+c-1]="0123456789ABCDEF".charAt(a[e]&15);return(b?d.slice(1):d).join("")}function UTIL_HexToBytes(a){for(var b=new Uint8Array(a.length/2),c=0;c<a.length&&-1!="0123456789ABCDEFabcdef".indexOf(a.substring(c,c+1));c+=2)b[c/2]=parseInt(a.substring(c,c+2),16);return b}
function UTIL_equalArrays(a,b){if(!a||!b||a.length!=b.length)return!1;for(var c=0,d=0;d<a.length;++d)c|=a[d]^b[d];return 0===c}function UTIL_ltArrays(a,b){if(a.length<b.length)return!0;if(a.length>b.length)return!1;for(var c=0;c<a.length;++c){if(a[c]<b[c])return!0;if(a[c]>b[c])break}return!1}function UTIL_geArrays(a,b){return!UTIL_ltArrays(a,b)}function UTIL_getRandom(a){var b=Array(a),c=new Uint8Array(a);window.crypto.getRandomValues(c);for(var d=0;d<a;++d)b[d]=c[d]&255;return b}
function UTIL_equalArrays(a,b){if(!a||!b||a.length!=b.length)return!1;for(var c=0,d=0;d<a.length;++d)c|=a[d]^b[d];return 0===c}function UTIL_setFavicon(a){var b=document.createElement("link");b.rel="Shortcut Icon";b.type="image/x-icon";b.href=a;a=document.getElementsByTagName("head")[0];for(var c=a.getElementsByTagName("link"),d=0;d<c.length;d++){var e=c[d];e.type==b.type&&e.rel==b.rel&&a.removeChild(e)}a.appendChild(b)}
function UTIL_clear(a){if(a instanceof Array)for(var b=0;b<a.length;++b)a[b]=0}function UTIL_time(){var a=new Date,b="000"+a.getMilliseconds();return a.toTimeString().substring(0,8)+"."+b.substring(b.length-3)}function UTIL_fmt(a){return UTIL_time()+" "+a}function UTIL_concat(a,b){var c=new Uint8Array(a.length+b.length),d,e=0;for(d=0;d<a.length;d++,e++)c[e]=a[d];for(d=0;d<b.length;d++,e++)c[e]=b[d];return c};
import{_t as e}from"./index-CeP2c1kV.js";import{l as t,u as a}from"./lit-Db9NMZ6o.js";Symbol();var r=Symbol(),o=Object.getPrototypeOf,s=new WeakMap,n=e=>e&&(s.has(e)?s.get(e):o(e)===Object.prototype||o(e)===Array.prototype),i=(e,t=!0)=>{s.set(e,t)},c=e=>"object"==typeof e&&null!==e,l=new WeakMap,d=new WeakSet,[u]=((e=Object.is,t=(e,t)=>new Proxy(e,t),a=e=>c(e)&&!d.has(e)&&(Array.isArray(e)||!(Symbol.iterator in e))&&!(e instanceof WeakMap)&&!(e instanceof WeakSet)&&!(e instanceof Error)&&!(e instanceof Number)&&!(e instanceof Date)&&!(e instanceof String)&&!(e instanceof RegExp)&&!(e instanceof ArrayBuffer),o=e=>{switch(e.status){case"fulfilled":return e.value;case"rejected":throw e.reason;default:throw e}},s=new WeakMap,u=(e,t,a=o)=>{const r=s.get(e);if((null==r?void 0:r[0])===t)return r[1];const n=Array.isArray(e)?[]:Object.create(Object.getPrototypeOf(e));return i(n,!0),s.set(e,[t,n]),Reflect.ownKeys(e).forEach(t=>{if(Object.getOwnPropertyDescriptor(n,t))return;const r=Reflect.get(e,t),{enumerable:o}=Reflect.getOwnPropertyDescriptor(e,t),s={value:r,enumerable:o,configurable:!0};if(d.has(r))i(r,!1);else if(r instanceof Promise)delete s.value,s.get=()=>a(r);else if(l.has(r)){const[e,t]=l.get(r);s.value=u(e,t(),a)}Object.defineProperty(n,t,s)}),Object.preventExtensions(n)},p=new WeakMap,m=[1,1],w=o=>{if(!c(o))throw new Error("object required");const s=p.get(o);if(s)return s;let i=m[0];const g=new Set,h=(e,t=++m[0])=>{i!==t&&(i=t,g.forEach(a=>a(e,t)))};let f=m[1];const b=e=>(t,a)=>{const r=[...t];r[1]=[e,...r[1]],h(r,a)},v=new Map,C=e=>{var t;const a=v.get(e);a&&(v.delete(e),null==(t=a[1])||t.call(a))},y=Array.isArray(o)?[]:Object.create(Object.getPrototypeOf(o)),N=t(y,{deleteProperty(e,t){const a=Reflect.get(e,t);C(t);const r=Reflect.deleteProperty(e,t);return r&&h(["delete",[t],a]),r},set(t,o,s,i){const u=Reflect.has(t,o),m=Reflect.get(t,o,i);if(u&&(e(m,s)||p.has(s)&&e(m,p.get(s))))return!0;C(o),c(s)&&(s=(e=>n(e)&&e[r]||null)(s)||s);let f=s;if(s instanceof Promise)s.then(e=>{s.status="fulfilled",s.value=e,h(["resolve",[o],e])}).catch(e=>{s.status="rejected",s.reason=e,h(["reject",[o],e])});else{!l.has(s)&&a(s)&&(f=w(s));const e=!d.has(f)&&l.get(f);e&&((e,t)=>{if(g.size){const a=t[3](b(e));v.set(e,[t,a])}else v.set(e,[t])})(o,e)}return Reflect.set(t,o,f,i),h(["set",[o],s,m]),!0}});p.set(o,N);const k=[y,(e=++m[1])=>(f===e||g.size||(f=e,v.forEach(([t])=>{const a=t[1](e);a>i&&(i=a)})),i),u,e=>{g.add(e),1===g.size&&v.forEach(([e,t],a)=>{const r=e[3](b(a));v.set(a,[e,r])});return()=>{g.delete(e),0===g.size&&v.forEach(([e,t],a)=>{t&&(t(),v.set(a,[e]))})}}];return l.set(N,k),Reflect.ownKeys(o).forEach(e=>{const t=Object.getOwnPropertyDescriptor(o,e);"value"in t&&(N[e]=o[e],delete t.value,delete t.writable),Object.defineProperty(y,e,t)}),N})=>[w,l,d,e,t,a,o,s,u,p,m])();function p(e={}){return u(e)}function m(e,t,a){const r=l.get(e);let o;const s=[],n=r[3];let i=!1;const c=n(e=>{s.push(e),a?t(s.splice(0)):o||(o=Promise.resolve().then(()=>{o=void 0,i&&t(s.splice(0))}))});return i=!0,()=>{i=!1,c()}}function w(e,t){const[a,r,o]=l.get(e);return o(a,r(),t)}function g(e){return d.add(e),e}function h(e,t,a,r){let o=e[t];return m(e,()=>{const r=e[t];Object.is(o,r)||a(o=r)},r)}var f={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin",cosmos:"Cosmos"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network",SECURE_SITE_SDK_ORIGIN:("undefined"!=typeof process?{}.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org"},b={caipNetworkIdToNumber:e=>e?Number(e.split(":")[1]):void 0,parseEvmChainId(e){return"string"==typeof e?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace:(e,t)=>e?.filter(e=>e.chainNamespace===t)||[],getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]},getNetworkNameByCaipNetworkId(e,t){if(!t)return;const a=e.find(e=>e.caipNetworkId===t);if(a)return a.name;const[r]=t.split(":");return f.CHAIN_NAME_MAP?.[r]||void 0}},v=1e6,C=1e6,y="[big.js] ",N=y+"Invalid ",k=N+"decimal places",A=N+"rounding mode",I=y+"Division by zero",E={},S=void 0,x=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function T(e,t,a,r){var o=e.c;if(a===S&&(a=e.constructor.RM),0!==a&&1!==a&&2!==a&&3!==a)throw Error(A);if(t<1)r=3===a&&(r||!!o[0])||0===t&&(1===a&&o[0]>=5||2===a&&(o[0]>5||5===o[0]&&(r||o[1]!==S))),o.length=1,r?(e.e=e.e-t+1,o[0]=1):o[0]=e.e=0;else if(t<o.length){if(r=1===a&&o[t]>=5||2===a&&(o[t]>5||5===o[t]&&(r||o[t+1]!==S||1&o[t-1]))||3===a&&(r||!!o[0]),o.length=t,r)for(;++o[--t]>9;)if(o[t]=0,0===t){++e.e,o.unshift(1);break}for(t=o.length;!o[--t];)o.pop()}return e}function _(e,t,a){var r=e.e,o=e.c.join(""),s=o.length;if(t)o=o.charAt(0)+(s>1?"."+o.slice(1):"")+(r<0?"e":"e+")+r;else if(r<0){for(;++r;)o="0"+o;o="0."+o}else if(r>0)if(++r>s)for(r-=s;r--;)o+="0";else r<s&&(o=o.slice(0,r)+"."+o.slice(r));else s>1&&(o=o.charAt(0)+"."+o.slice(1));return e.s<0&&a?"-"+o:o}E.abs=function(){var e=new this.constructor(this);return e.s=1,e},E.cmp=function(e){var t,a=this,r=a.c,o=(e=new a.constructor(e)).c,s=a.s,n=e.s,i=a.e,c=e.e;if(!r[0]||!o[0])return r[0]?s:o[0]?-n:0;if(s!=n)return s;if(t=s<0,i!=c)return i>c^t?1:-1;for(n=(i=r.length)<(c=o.length)?i:c,s=-1;++s<n;)if(r[s]!=o[s])return r[s]>o[s]^t?1:-1;return i==c?0:i>c^t?1:-1},E.div=function(e){var t=this,a=t.constructor,r=t.c,o=(e=new a(e)).c,s=t.s==e.s?1:-1,n=a.DP;if(n!==~~n||n<0||n>v)throw Error(k);if(!o[0])throw Error(I);if(!r[0])return e.s=s,e.c=[e.e=0],e;var i,c,l,d,u,p=o.slice(),m=i=o.length,w=r.length,g=r.slice(0,i),h=g.length,f=e,b=f.c=[],C=0,y=n+(f.e=t.e-e.e)+1;for(f.s=s,s=y<0?0:y,p.unshift(0);h++<i;)g.push(0);do{for(l=0;l<10;l++){if(i!=(h=g.length))d=i>h?1:-1;else for(u=-1,d=0;++u<i;)if(o[u]!=g[u]){d=o[u]>g[u]?1:-1;break}if(!(d<0))break;for(c=h==i?o:p;h;){if(g[--h]<c[h]){for(u=h;u&&!g[--u];)g[u]=9;--g[u],g[h]+=10}g[h]-=c[h]}for(;!g[0];)g.shift()}b[C++]=d?l:++l,g[0]&&d?g[h]=r[m]||0:g=[r[m]]}while((m++<w||g[0]!==S)&&s--);return b[0]||1==C||(b.shift(),f.e--,y--),C>y&&T(f,y,a.RM,g[0]!==S),f},E.eq=function(e){return 0===this.cmp(e)},E.gt=function(e){return this.cmp(e)>0},E.gte=function(e){return this.cmp(e)>-1},E.lt=function(e){return this.cmp(e)<0},E.lte=function(e){return this.cmp(e)<1},E.minus=E.sub=function(e){var t,a,r,o,s=this,n=s.constructor,i=s.s,c=(e=new n(e)).s;if(i!=c)return e.s=-c,s.plus(e);var l=s.c.slice(),d=s.e,u=e.c,p=e.e;if(!l[0]||!u[0])return u[0]?e.s=-c:l[0]?e=new n(s):e.s=1,e;if(i=d-p){for((o=i<0)?(i=-i,r=l):(p=d,r=u),r.reverse(),c=i;c--;)r.push(0);r.reverse()}else for(a=((o=l.length<u.length)?l:u).length,i=c=0;c<a;c++)if(l[c]!=u[c]){o=l[c]<u[c];break}if(o&&(r=l,l=u,u=r,e.s=-e.s),(c=(a=u.length)-(t=l.length))>0)for(;c--;)l[t++]=0;for(c=t;a>i;){if(l[--a]<u[a]){for(t=a;t&&!l[--t];)l[t]=9;--l[t],l[a]+=10}l[a]-=u[a]}for(;0===l[--c];)l.pop();for(;0===l[0];)l.shift(),--p;return l[0]||(e.s=1,l=[p=0]),e.c=l,e.e=p,e},E.mod=function(e){var t,a=this,r=a.constructor,o=a.s,s=(e=new r(e)).s;if(!e.c[0])throw Error(I);return a.s=e.s=1,t=1==e.cmp(a),a.s=o,e.s=s,t?new r(a):(o=r.DP,s=r.RM,r.DP=r.RM=0,a=a.div(e),r.DP=o,r.RM=s,this.minus(a.times(e)))},E.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e},E.plus=E.add=function(e){var t,a,r,o=this,s=o.constructor;if(e=new s(e),o.s!=e.s)return e.s=-e.s,o.minus(e);var n=o.e,i=o.c,c=e.e,l=e.c;if(!i[0]||!l[0])return l[0]||(i[0]?e=new s(o):e.s=o.s),e;if(i=i.slice(),t=n-c){for(t>0?(c=n,r=l):(t=-t,r=i),r.reverse();t--;)r.push(0);r.reverse()}for(i.length-l.length<0&&(r=l,l=i,i=r),t=l.length,a=0;t;i[t]%=10)a=(i[--t]=i[t]+l[t]+a)/10|0;for(a&&(i.unshift(a),++c),t=i.length;0===i[--t];)i.pop();return e.c=i,e.e=c,e},E.pow=function(e){var t=this,a=new t.constructor("1"),r=a,o=e<0;if(e!==~~e||e<-1e6||e>C)throw Error(N+"exponent");for(o&&(e=-e);1&e&&(r=r.times(t)),e>>=1;)t=t.times(t);return o?a.div(r):r},E.prec=function(e,t){if(e!==~~e||e<1||e>v)throw Error(N+"precision");return T(new this.constructor(this),e,t)},E.round=function(e,t){if(e===S)e=0;else if(e!==~~e||e<-v||e>v)throw Error(k);return T(new this.constructor(this),e+this.e+1,t)},E.sqrt=function(){var e,t,a,r=this,o=r.constructor,s=r.s,n=r.e,i=new o("0.5");if(!r.c[0])return new o(r);if(s<0)throw Error(y+"No square root");0===(s=Math.sqrt(+_(r,!0,!0)))||s===1/0?((t=r.c.join("")).length+n&1||(t+="0"),n=((n+1)/2|0)-(n<0||1&n),e=new o(((s=Math.sqrt(t))==1/0?"5e":(s=s.toExponential()).slice(0,s.indexOf("e")+1))+n)):e=new o(s+""),n=e.e+(o.DP+=4);do{a=e,e=i.times(a.plus(r.div(a)))}while(a.c.slice(0,n).join("")!==e.c.slice(0,n).join(""));return T(e,(o.DP-=4)+e.e+1,o.RM)},E.times=E.mul=function(e){var t,a=this,r=a.constructor,o=a.c,s=(e=new r(e)).c,n=o.length,i=s.length,c=a.e,l=e.e;if(e.s=a.s==e.s?1:-1,!o[0]||!s[0])return e.c=[e.e=0],e;for(e.e=c+l,n<i&&(t=o,o=s,s=t,l=n,n=i,i=l),t=new Array(l=n+i);l--;)t[l]=0;for(c=i;c--;){for(i=0,l=n+c;l>c;)i=t[l]+s[c]*o[l-c-1]+i,t[l--]=i%10,i=i/10|0;t[l]=i}for(i?++e.e:t.shift(),c=t.length;!t[--c];)t.pop();return e.c=t,e},E.toExponential=function(e,t){var a=this,r=a.c[0];if(e!==S){if(e!==~~e||e<0||e>v)throw Error(k);for(a=T(new a.constructor(a),++e,t);a.c.length<e;)a.c.push(0)}return _(a,!0,!!r)},E.toFixed=function(e,t){var a=this,r=a.c[0];if(e!==S){if(e!==~~e||e<0||e>v)throw Error(k);for(e=e+(a=T(new a.constructor(a),e+a.e+1,t)).e+1;a.c.length<e;)a.c.push(0)}return _(a,!1,!!r)},E[Symbol.for("nodejs.util.inspect.custom")]=E.toJSON=E.toString=function(){var e=this,t=e.constructor;return _(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])},E.toNumber=function(){var e=+_(this,!0,!0);if(!0===this.constructor.strict&&!this.eq(e.toString()))throw Error(y+"Imprecise conversion");return e},E.toPrecision=function(e,t){var a=this,r=a.constructor,o=a.c[0];if(e!==S){if(e!==~~e||e<1||e>v)throw Error(N+"precision");for(a=T(new r(a),e,t);a.c.length<e;)a.c.push(0)}return _(a,e<=a.e||a.e<=r.NE||a.e>=r.PE,!!o)},E.valueOf=function(){var e=this,t=e.constructor;if(!0===t.strict)throw Error(y+"valueOf disallowed");return _(e,e.e<=t.NE||e.e>=t.PE,!0)};var U=function e(){function t(a){var r=this;if(!(r instanceof t))return a===S?e():new t(a);if(a instanceof t)r.s=a.s,r.e=a.e,r.c=a.c.slice();else{if("string"!=typeof a){if(!0===t.strict&&"bigint"!=typeof a)throw TypeError(N+"value");a=0===a&&1/a<0?"-0":String(a)}!function(e,t){var a,r,o;if(!x.test(t))throw Error(N+"number");e.s="-"==t.charAt(0)?(t=t.slice(1),-1):1,(a=t.indexOf("."))>-1&&(t=t.replace(".",""));(r=t.search(/e/i))>0?(a<0&&(a=r),a+=+t.slice(r+1),t=t.substring(0,r)):a<0&&(a=t.length);for(o=t.length,r=0;r<o&&"0"==t.charAt(r);)++r;if(r==o)e.c=[e.e=0];else{for(;o>0&&"0"==t.charAt(--o););for(e.e=a-r-1,e.c=[],a=0;r<=o;)e.c[a++]=+t.charAt(r++)}}(r,a)}r.constructor=t}return t.prototype=E,t.DP=20,t.RM=1,t.NE=-7,t.PE=21,t.strict=false,t.roundDown=0,t.roundHalfUp=1,t.roundHalfEven=2,t.roundUp=3,t}(),P={bigNumber:e=>new U(e||0),multiply(e,t){if(void 0===e||void 0===t)return new U(0);const a=new U(e),r=new U(t);return a.times(r)},formatNumberToLocalString:(e,t=2)=>void 0===e?"0.00":"number"==typeof e?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}),parseLocalStringToNumber:e=>void 0===e?0:parseFloat(e.replace(/,/gu,""))},O=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}],R=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}],B=e=>f.USDT_CONTRACT_ADDRESSES.includes(e)?R:O,D="@appkit/active_caip_network_id",M="@appkit/connected_social",L="@appkit-wallet/SOCIAL_USERNAME",W="@appkit/recent_wallets",F="WALLETCONNECT_DEEPLINK_CHOICE",j="@appkit/active_namespace",$="@appkit/connected_namespaces",H="@appkit/connection_status",z="@appkit/social_provider",V="@appkit/native_balance_cache",q="@appkit/portfolio_cache",K="@appkit/ens_cache",G="@appkit/identity_cache",J="@appkit/preferred_account_types",Y="@appkit/connections";function X(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var Q={setItem(e,t){Z()&&void 0!==t&&localStorage.setItem(e,t)},getItem(e){if(Z())return localStorage.getItem(e)||void 0},removeItem(e){Z()&&localStorage.removeItem(e)},clear(){Z()&&localStorage.clear()}};function Z(){return"undefined"!=typeof window&&"undefined"!=typeof localStorage}function ee(e,t){return"light"===t?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var te=("undefined"!=typeof process?{}.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",ae=[{label:"Coinbase",name:"coinbase",feeRange:"1-2%",url:"",supportedChains:["eip155"]},{label:"Meld.io",name:"meld",feeRange:"1-2%",url:"https://meldcrypto.com",supportedChains:["eip155","solana"]}],re="WXETMuFUQmqqybHuRkSgxv:25B8LJHSfpG6LVjR2ytU5Cwh7Z4Sch2ocoU",oe={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:te,SECURE_SITE_DASHBOARD:`${te}/dashboard`,SECURE_SITE_FAVICON:`${te}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x",cosmos:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in the wallet app",WEB:"Open and continue in the wallet app"},SEND_SUPPORTED_NAMESPACES:["eip155","solana"],DEFAULT_REMOTE_FEATURES:{swaps:["1inch"],onramp:["coinbase","meld"],email:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],activity:!0,reownBranding:!0},DEFAULT_REMOTE_FEATURES_DISABLED:{email:!1,socials:!1,swaps:!1,onramp:!1,activity:!1,reownBranding:!1},DEFAULT_FEATURES:{receive:!0,send:!0,emailShowWallets:!0,connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0,pay:!1},DEFAULT_SOCIALS:["google","x","farcaster","discord","apple","github","facebook"],DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}},se={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired:(e,t)=>Date.now()-e>t,getActiveNetworkProps(){const e=se.getActiveNamespace(),t=se.getActiveCaipNetworkId(),a=t?t.split(":")[1]:void 0;return{namespace:e,caipNetworkId:t,chainId:a?isNaN(Number(a))?a:Number(a):void 0}},setWalletConnectDeepLink({name:e,href:t}){try{Q.setItem(F,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{const e=Q.getItem(F);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{Q.removeItem(F)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{Q.setItem(j,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{Q.setItem(D,e),se.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return Q.getItem(D)}catch{return void console.info("Unable to get active caip network id")}},deleteActiveCaipNetworkId(){try{Q.removeItem(D)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{const t=X(e);Q.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{const t=se.getRecentWallets();t.find(t=>t.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),Q.setItem(W,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{const e=Q.getItem(W);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{const a=X(e);Q.setItem(a,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return Q.getItem(j)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{const t=X(e);return Q.getItem(t)}catch(t){console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{Q.setItem(M,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return Q.getItem(M)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{Q.removeItem(M)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return Q.getItem(L)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId:()=>Q.getItem(D)?.split(":")?.[1],setConnectionStatus(e){try{Q.setItem(H,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return Q.getItem(H)}catch{return}},getConnectedNamespaces(){try{const e=Q.getItem($);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{const t=Array.from(new Set(e));Q.setItem($,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{const t=se.getConnectedNamespaces();t.includes(e)||(t.push(e),se.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{const t=se.getConnectedNamespaces(),a=t.indexOf(e);a>-1&&(t.splice(a,1),se.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return Q.getItem(z)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{Q.setItem(z,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{Q.removeItem(z)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{const t=Q.getItem(q);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{const t=se.getBalanceCache();Q.setItem(q,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{const t=se.getBalanceCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.portfolio))return t.balance;se.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{const t=se.getBalanceCache();t[e.caipAddress]=e,Q.setItem(q,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{const t=Q.getItem(V);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{const t=se.getBalanceCache();Q.setItem(V,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{const t=se.getNativeBalanceCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.nativeBalance))return t;console.info("Discarding cache for address",e),se.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{const t=se.getNativeBalanceCache();t[e.caipAddress]=e,Q.setItem(V,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{const t=Q.getItem(K);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{const t=se.getEnsCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.ens))return t.ens;se.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{const t=se.getEnsCache();t[e.address]=e,Q.setItem(K,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{const t=se.getEnsCache();Q.setItem(K,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{const t=Q.getItem(G);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{const t=se.getIdentityCache()[e];if(t&&!this.isCacheExpired(t.timestamp,this.cacheExpiry.identity))return t.identity;se.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{const t=se.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},Q.setItem(G,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{const t=se.getIdentityCache();Q.setItem(G,JSON.stringify({...t,[e]:void 0}))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{Q.removeItem(q),Q.removeItem(V),Q.removeItem(K),Q.removeItem(G)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{Q.setItem(J,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{const e=Q.getItem(J);return e?JSON.parse(e):{}}catch{console.info("Unable to get preferred account types")}return{}},setConnections(e,t){try{const a={...se.getConnections(),[t]:e};Q.setItem(Y,JSON.stringify(a))}catch(a){console.error("Unable to sync connections to storage",a)}},getConnections(){try{const e=Q.getItem(Y);return e?JSON.parse(e):{}}catch(e){return console.error("Unable to get connections from storage",e),{}}}},ne={isMobile(){return!!this.isClient()&&Boolean("function"==typeof window?.matchMedia&&window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent))},checkCaipNetwork:(e,t="")=>e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase()),isAndroid(){if(!this.isMobile())return!1;const e=window?.navigator.userAgent.toLowerCase();return ne.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;const e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return!!this.isClient()&&(window?.navigator.userAgent.toLowerCase()).includes("safari")},isClient:()=>"undefined"!=typeof window,isPairingExpired:e=>!e||e-Date.now()<=oe.TEN_SEC_MS,isAllowedRetry:(e,t=oe.ONE_SEC_MS)=>Date.now()-e>=t,copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch(e){return!1}},isSafeApp(){if(ne.isClient()&&window.self!==window.top)try{const e=window?.location?.ancestorOrigins?.[0],t="https://app.safe.global";if(e){const a=new URL(e),r=new URL(t);return a.hostname===r.hostname}}catch{return!1}return!1},getPairingExpiry:()=>Date.now()+oe.FOUR_MINUTES_MS,getNetworkId:e=>e?.split(":")[1],getPlainAddress:e=>e?.split(":")[2],wait:async e=>new Promise(t=>{setTimeout(t,e)}),debounce(e,t=500){let a;return(...r)=>{a&&clearTimeout(a),a=setTimeout(function(){e(...r)},t)}},isHttpUrl:e=>e.startsWith("http://")||e.startsWith("https://"),formatNativeUrl(e,t,a=null){if(ne.isHttpUrl(e))return this.formatUniversalUrl(e,t);let r=e,o=a;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),o&&!o?.endsWith("/")&&(o=`${o}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));const s=encodeURIComponent(t);return{redirect:`${r}wc?uri=${s}`,redirectUniversalLink:o?`${o}wc?uri=${s}`:void 0,href:r}},formatUniversalUrl(e,t){if(!ne.isHttpUrl(e))return this.formatNativeUrl(e,t);let a=e;return a.endsWith("/")||(a=`${a}/`),{redirect:`${a}wc?uri=${encodeURIComponent(t)}`,href:a}},getOpenTargetForPlatform(e){return"popupWindow"===e?e:this.isTelegram()?se.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,a){window?.open(e,this.getOpenTargetForPlatform(t),a||"noreferrer noopener")},returnOpenHref(e,t,a){return window?.open(e,this.getOpenTargetForPlatform(t),a||"noreferrer noopener")},isTelegram:()=>"undefined"!=typeof window&&(Boolean(window.TelegramWebviewProxy)||Boolean(window.Telegram)||Boolean(window.TelegramWebviewProxyProto)),isPWA(){if("undefined"==typeof window)return!1;const e=window.matchMedia?.("(display-mode: standalone)")?.matches,t=window?.navigator?.standalone;return Boolean(e||t)},async preloadImage(e){const t=new Promise((t,a)=>{const r=new Image;r.onload=t,r.onerror=a,r.crossOrigin="anonymous",r.src=e});return Promise.race([t,ne.wait(2e3)])},formatBalance(e,t){let a="0.000";if("string"==typeof e){const t=Number(e);if(t){const e=Math.floor(1e3*t)/1e3;e&&(a=e.toString())}}return`${a}${t?` ${t}`:""}`},formatBalance2(e,t){let a;if("0"===e)a="0";else if("string"==typeof e){const t=Number(e);t&&(a=t.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:a??"0",rest:"0"===a?"000":"",symbol:t}},getApiUrl:()=>f.W3M_API_URL,getBlockchainApiUrl:()=>f.BLOCKCHAIN_API_RPC_URL,getAnalyticsUrl:()=>f.PULSE_API_URL,getUUID:()=>crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{const t=16*Math.random()|0;return("x"===e?t:3&t|8).toString(16)}),parseError:e=>"string"==typeof e?e:"string"==typeof e?.issues?.[0]?.message?e.issues[0].message:e instanceof Error?e.message:"Unknown error",sortRequestedNetworks(e,t=[]){const a={};return t&&e&&(e.forEach((e,t)=>{a[e]=t}),t.sort((e,t)=>{const r=a[e.id],o=a[t.id];return void 0!==r&&void 0!==o?r-o:void 0!==r?-1:void 0!==o?1:0})),t},calculateBalance(e){let t=0;for(const a of e)t+=a.value??0;return t},formatTokenBalance(e){const[t,a]=e.toFixed(2).split(".");return{dollars:t,pennies:a}},isAddress(e,t="eip155"){switch(t){case"eip155":return!!/^(?:0x)?[0-9a-f]{40}$/iu.test(e)&&!(!/^(?:0x)?[0-9a-f]{40}$/iu.test(e)&&!/^(?:0x)?[0-9A-F]{40}$/iu.test(e));case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){const a=new Set;return e.filter(e=>{const r=e[t];return!a.has(r)&&(a.add(r),!0)})},generateSdkVersion:(e,t,a)=>`${t}-${0===e.length?oe.ADAPTER_TYPES.UNIVERSAL:e.map(e=>e.adapterType).join(",")}-${a}`,createAccount:(e,t,a,r,o)=>({namespace:e,address:t,type:a,publicKey:r,path:o}),isCaipAddress(e){if("string"!=typeof e)return!1;const t=e.split(":"),a=t[0];return 3===t.filter(Boolean).length&&a in f.CHAIN_NAME_MAP},isMac(){const e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){const t=`--${encodeURIComponent(window?.location.href)}`,a="state=";if("auth.magic.link"===new URL(e).host){const r=e.substring(e.indexOf("provider_authorization_url=")+27),o=this.injectIntoUrl(decodeURIComponent(r),a,t);return e.replace(r,encodeURIComponent(o))}return this.injectIntoUrl(e,a,t)},injectIntoUrl(e,t,a){const r=e.indexOf(t);if(-1===r)throw new Error(`${t} parameter not found in the URL: ${e}`);const o=e.indexOf("&",r),s=t.length,n=-1!==o?o:e.length;return e.substring(0,r+s)+(e.substring(r+s,n)+a)+e.substring(o)}};async function ie(...e){const t=await fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t}var ce=class{constructor({baseUrl:e,clientId:t}){this.baseUrl=e,this.clientId=t}async get({headers:e,signal:t,cache:a,...r}){return(await ie(this.createUrl(r),{method:"GET",headers:e,signal:t,cache:a})).json()}async getBlob({headers:e,signal:t,...a}){return(await ie(this.createUrl(a),{method:"GET",headers:e,signal:t})).blob()}async post({body:e,headers:t,signal:a,...r}){return(await ie(this.createUrl(r),{method:"POST",headers:t,body:e?JSON.stringify(e):void 0,signal:a})).json()}async put({body:e,headers:t,signal:a,...r}){return(await ie(this.createUrl(r),{method:"PUT",headers:t,body:e?JSON.stringify(e):void 0,signal:a})).json()}async delete({body:e,headers:t,signal:a,...r}){return(await ie(this.createUrl(r),{method:"DELETE",headers:t,body:e?JSON.stringify(e):void 0,signal:a})).json()}createUrl({path:e,params:t}){const a=new URL(e,this.baseUrl);return t&&Object.entries(t).forEach(([e,t])=>{t&&a.searchParams.append(e,t)}),this.clientId&&a.searchParams.append("clientId",this.clientId),a}},le={getFeatureValue(e,t){const a=t?.[e];return void 0===a?oe.DEFAULT_FEATURES[e]:a},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(ne.isTelegram()){if(ne.isIos())return e.filter(e=>"google"!==e);if(ne.isMac())return e.filter(e=>"x"!==e);if(ne.isAndroid())return e.filter(e=>!["facebook","x"].includes(e))}return e}},de=p({features:oe.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:oe.DEFAULT_ACCOUNT_TYPES,enableNetworkSwitch:!0,experimental_preferUniversalLinks:!1,remoteFeatures:{}}),ue={state:de,subscribeKey:(e,t)=>h(de,e,t),setOptions(e){Object.assign(de,e)},setRemoteFeatures(e){e&&(de.remoteFeatures={...de.remoteFeatures,...e},de.remoteFeatures?.socials&&(de.remoteFeatures.socials=le.filterSocialsByPlatform(de.remoteFeatures.socials)))},setFeatures(e){e&&(de.features||(de.features=oe.DEFAULT_FEATURES),de.features={...de.features,...e})},setProjectId(e){de.projectId=e},setCustomRpcUrls(e){de.customRpcUrls=e},setAllWallets(e){de.allWallets=e},setIncludeWalletIds(e){de.includeWalletIds=e},setExcludeWalletIds(e){de.excludeWalletIds=e},setFeaturedWalletIds(e){de.featuredWalletIds=e},setTokens(e){de.tokens=e},setTermsConditionsUrl(e){de.termsConditionsUrl=e},setPrivacyPolicyUrl(e){de.privacyPolicyUrl=e},setCustomWallets(e){de.customWallets=e},setIsSiweEnabled(e){de.isSiweEnabled=e},setIsUniversalProvider(e){de.isUniversalProvider=e},setSdkVersion(e){de.sdkVersion=e},setMetadata(e){de.metadata=e},setDisableAppend(e){de.disableAppend=e},setEIP6963Enabled(e){de.enableEIP6963=e},setDebug(e){de.debug=e},setEnableWalletConnect(e){de.enableWalletConnect=e},setEnableWalletGuide(e){de.enableWalletGuide=e},setEnableAuthLogger(e){de.enableAuthLogger=e},setEnableWallets(e){de.enableWallets=e},setPreferUniversalLinks(e){de.experimental_preferUniversalLinks=e},setHasMultipleAddresses(e){de.hasMultipleAddresses=e},setSIWX(e){de.siwx=e},setConnectMethodsOrder(e){de.features={...de.features,connectMethodsOrder:e}},setWalletFeaturesOrder(e){de.features={...de.features,walletFeaturesOrder:e}},setSocialsOrder(e){de.remoteFeatures={...de.remoteFeatures,socials:e}},setCollapseWallets(e){de.features={...de.features,collapseWallets:e}},setEnableEmbedded(e){de.enableEmbedded=e},setAllowUnsupportedChain(e){de.allowUnsupportedChain=e},setManualWCControl(e){de.manualWCControl=e},setEnableNetworkSwitch(e){de.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([e,t])=>{t&&(de.defaultAccountTypes[e]=t)})},setUniversalProviderConfigOverride(e){de.universalProviderConfigOverride=e},getUniversalProviderConfigOverride:()=>de.universalProviderConfigOverride,getSnapshot:()=>w(de)},pe=Object.freeze({enabled:!0,events:[]}),me=new ce({baseUrl:ne.getAnalyticsUrl(),clientId:null}),we=p({...pe}),ge={state:we,subscribeKey:(e,t)=>h(we,e,t),async sendError(e,t){if(!we.enabled)return;const a=Date.now();if(we.events.filter(e=>a-new Date(e.properties.timestamp||"").getTime()<6e4).length>=5)return;const r={type:"error",event:t,properties:{errorType:e.name,errorMessage:e.message,stackTrace:e.stack,timestamp:(new Date).toISOString()}};we.events.push(r);try{if("undefined"==typeof window)return;const{projectId:a,sdkType:r,sdkVersion:o}=ue.state;await me.post({path:"/e",params:{projectId:a,st:r,sv:o||"html-wagmi-4.2.2"},body:{eventId:ne.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:(new Date).toISOString(),props:{type:"error",event:t,errorType:e.name,errorMessage:e.message,stackTrace:e.stack}}})}catch{}},enable(){we.enabled=!0},disable(){we.enabled=!1},clearEvents(){we.events=[]}},he=class e extends Error{constructor(t,a,r){super(t),this.name="AppKitError",this.category=a,this.originalError=r,Object.setPrototypeOf(this,e.prototype);let o=!1;if(r instanceof Error&&"string"==typeof r.stack&&r.stack){const e=r.stack,t=e.indexOf("\n");if(t>-1){const a=e.substring(t+1);this.stack=`${this.name}: ${this.message}\n${a}`,o=!0}}o||(Error.captureStackTrace?Error.captureStackTrace(this,e):this.stack||(this.stack=`${this.name}: ${this.message}`))}};function fe(e,t){const a=e instanceof he?e:new he(e instanceof Error?e.message:String(e),t,e);throw ge.sendError(a,a.category),a}function be(e,t="INTERNAL_SDK_ERROR"){const a={};return Object.keys(e).forEach(r=>{const o=e[r];if("function"==typeof o){let e=o;e="AsyncFunction"===o.constructor.name?async(...e)=>{try{return await o(...e)}catch(a){return fe(a,t)}}:(...e)=>{try{return o(...e)}catch(a){return fe(a,t)}},a[r]=e}else a[r]=o}),a}var ve,Ce={PHANTOM:{id:"a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393",url:"https://phantom.app"},SOLFLARE:{id:"1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79",url:"https://solflare.com"},COINBASE:{id:"fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa",url:"https://go.cb-w.com"}},ye={handleMobileDeeplinkRedirect(e,t){const a=window.location.href,r=encodeURIComponent(a);if(e===Ce.PHANTOM.id&&!("phantom"in window)){const e=a.startsWith("https")?"https":"http",t=a.split("/")[2],o=encodeURIComponent(`${e}://${t}`);window.location.href=`${Ce.PHANTOM.url}/ul/browse/${r}?ref=${o}`}e!==Ce.SOLFLARE.id||"solflare"in window||(window.location.href=`${Ce.SOLFLARE.url}/ul/v1/browse/${r}?ref=${r}`),t===f.CHAIN.SOLANA&&(e!==Ce.COINBASE.id||"coinbaseSolana"in window||(window.location.href=`${Ce.COINBASE.url}/dapp?cb_url=${r}`))}},Ne=p({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),ke=be({state:Ne,subscribeNetworkImages:e=>m(Ne.networkImages,()=>e(Ne.networkImages)),subscribeKey:(e,t)=>h(Ne,e,t),subscribe:e=>m(Ne,()=>e(Ne)),setWalletImage(e,t){Ne.walletImages[e]=t},setNetworkImage(e,t){Ne.networkImages[e]=t},setChainImage(e,t){Ne.chainImages[e]=t},setConnectorImage(e,t){Ne.connectorImages={...Ne.connectorImages,[e]:t}},setTokenImage(e,t){Ne.tokenImages[e]=t},setCurrencyImage(e,t){Ne.currencyImages[e]=t}}),Ae={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00",cosmos:""},Ie=p({networkImagePromises:{}}),Ee={async fetchWalletImage(e){if(e)return await De._fetchWalletImage(e),this.getWalletImageById(e)},async fetchNetworkImage(e){if(!e)return;const t=this.getNetworkImageById(e);return t||(Ie.networkImagePromises[e]||(Ie.networkImagePromises[e]=De._fetchNetworkImage(e)),await Ie.networkImagePromises[e],this.getNetworkImageById(e))},getWalletImageById(e){if(e)return ke.state.walletImages[e]},getWalletImage:e=>e?.image_url?e?.image_url:e?.image_id?ke.state.walletImages[e.image_id]:void 0,getNetworkImage:e=>e?.assets?.imageUrl?e?.assets?.imageUrl:e?.assets?.imageId?ke.state.networkImages[e.assets.imageId]:void 0,getNetworkImageById(e){if(e)return ke.state.networkImages[e]},getConnectorImage:e=>e?.imageUrl?e.imageUrl:e?.imageId?ke.state.connectorImages[e.imageId]:void 0,getChainImage:e=>ke.state.networkImages[Ae[e]]},Se=p({message:"",variant:"info",open:!1}),xe=be({state:Se,subscribeKey:(e,t)=>h(Se,e,t),open(e,t){const{debug:a}=ue.state,{shortMessage:r,longMessage:o}=e;a&&(Se.message=r,Se.variant=t,Se.open=!0),o&&console.error("function"==typeof o?o():o)},close(){Se.open=!1,Se.message="",Se.variant="info"}}),Te=new ce({baseUrl:ne.getAnalyticsUrl(),clientId:null}),_e=["MODAL_CREATED"],Ue=p({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),Pe={state:Ue,subscribe:e=>m(Ue,()=>e(Ue)),getSdkProperties(){const{projectId:e,sdkType:t,sdkVersion:a}=ue.state;return{projectId:e,st:t,sv:a||"html-wagmi-4.2.2"}},async _sendAnalyticsEvent(e){try{const t=bt.state.address;if(_e.includes(e.data.event)||"undefined"==typeof window)return;await Te.post({path:"/e",params:Pe.getSdkProperties(),body:{eventId:ne.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:{...e.data,address:t}}}),Ue.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===f.HTTP_STATUS_CODES.FORBIDDEN&&!Ue.reportedErrors.FORBIDDEN&&(xe.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${Z()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),Ue.reportedErrors.FORBIDDEN=!0)}},sendEvent(e){Ue.timestamp=Date.now(),Ue.data=e,ue.state.features?.analytics&&Pe._sendAnalyticsEvent(Ue)}},Oe=ne.getApiUrl(),Re=new ce({baseUrl:Oe,clientId:null}),Be=p({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],filteredWallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),De={state:Be,subscribeKey:(e,t)=>h(Be,e,t),_getSdkProperties(){const{projectId:e,sdkType:t,sdkVersion:a}=ue.state;return{projectId:e,st:t||"appkit",sv:a||"html-wagmi-4.2.2"}},_filterOutExtensions:e=>ue.state.isUniversalProvider?e.filter(e=>Boolean(e.mobile_link||e.desktop_link||e.webapp_link)):e,async _fetchWalletImage(e){const t=`${Re.baseUrl}/getWalletImage/${e}`,a=await Re.getBlob({path:t,params:De._getSdkProperties()});ke.setWalletImage(e,URL.createObjectURL(a))},async _fetchNetworkImage(e){const t=`${Re.baseUrl}/public/getAssetImage/${e}`,a=await Re.getBlob({path:t,params:De._getSdkProperties()});ke.setNetworkImage(e,URL.createObjectURL(a))},async _fetchConnectorImage(e){const t=`${Re.baseUrl}/public/getAssetImage/${e}`,a=await Re.getBlob({path:t,params:De._getSdkProperties()});ke.setConnectorImage(e,URL.createObjectURL(a))},async _fetchCurrencyImage(e){const t=`${Re.baseUrl}/public/getCurrencyImage/${e}`,a=await Re.getBlob({path:t,params:De._getSdkProperties()});ke.setCurrencyImage(e,URL.createObjectURL(a))},async _fetchTokenImage(e){const t=`${Re.baseUrl}/public/getTokenImage/${e}`,a=await Re.getBlob({path:t,params:De._getSdkProperties()});ke.setTokenImage(e,URL.createObjectURL(a))},_filterWalletsByPlatform:e=>ne.isMobile()?e?.filter(e=>!!e.mobile_link||(e.id===Ce.COINBASE.id||"solana"===ut.state.activeChain&&(e.id===Ce.SOLFLARE.id||e.id===Ce.PHANTOM.id))):e,fetchProjectConfig:async()=>(await Re.get({path:"/appkit/v1/config",params:De._getSdkProperties()})).features,async fetchAllowedOrigins(){try{const{allowedOrigins:e}=await Re.get({path:"/projects/v1/origins",params:De._getSdkProperties()});return e}catch(e){return[]}},async fetchNetworkImages(){const e=ut.getAllRequestedCaipNetworks()?.map(({assets:e})=>e?.imageId).filter(Boolean).filter(e=>!Ee.getNetworkImageById(e));e&&await Promise.allSettled(e.map(e=>De._fetchNetworkImage(e)))},async fetchConnectorImages(){const{connectors:e}=Ve.state,t=e.map(({imageId:e})=>e).filter(Boolean);await Promise.allSettled(t.map(e=>De._fetchConnectorImage(e)))},async fetchCurrencyImages(e=[]){await Promise.allSettled(e.map(e=>De._fetchCurrencyImage(e)))},async fetchTokenImages(e=[]){await Promise.allSettled(e.map(e=>De._fetchTokenImage(e)))},async fetchWallets(e){const t=e.exclude??[];De._getSdkProperties().sv.startsWith("html-core-")&&t.push(...Object.values(Ce).map(e=>e.id));const a=await Re.get({path:"/getWallets",params:{...De._getSdkProperties(),...e,page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:t.join(",")}});return{data:De._filterWalletsByPlatform(a?.data)||[],count:a?.count}},async fetchFeaturedWallets(){const{featuredWalletIds:e}=ue.state;if(e?.length){const t={...De._getSdkProperties(),page:1,entries:e?.length??4,include:e},{data:a}=await De.fetchWallets(t),r=[...a].sort((t,a)=>e.indexOf(t.id)-e.indexOf(a.id)),o=r.map(e=>e.image_id).filter(Boolean);await Promise.allSettled(o.map(e=>De._fetchWalletImage(e))),Be.featured=r,Be.allFeatured=r}},async fetchRecommendedWallets(){try{Be.isFetchingRecommendedWallets=!0;const{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:a}=ue.state,r={page:1,entries:4,include:e,exclude:[...t??[],...a??[]].filter(Boolean),chains:ut.getRequestedCaipNetworkIds().join(",")},{data:o,count:s}=await De.fetchWallets(r),n=se.getRecentWallets(),i=o.map(e=>e.image_id).filter(Boolean),c=n.map(e=>e.image_id).filter(Boolean);await Promise.allSettled([...i,...c].map(e=>De._fetchWalletImage(e))),Be.recommended=o,Be.allRecommended=o,Be.count=s??0}catch{}finally{Be.isFetchingRecommendedWallets=!1}},async fetchWalletsByPage({page:e}){const{includeWalletIds:t,excludeWalletIds:a,featuredWalletIds:r}=ue.state,o=ut.getRequestedCaipNetworkIds().join(","),s={page:e,entries:40,include:t,exclude:[...Be.recommended.map(({id:e})=>e),...a??[],...r??[]].filter(Boolean),chains:o},{data:n,count:i}=await De.fetchWallets(s),c=n.slice(0,20).map(e=>e.image_id).filter(Boolean);await Promise.allSettled(c.map(e=>De._fetchWalletImage(e))),Be.wallets=ne.uniqueBy([...Be.wallets,...De._filterOutExtensions(n)],"id").filter(e=>e.chains?.some(e=>o.includes(e))),Be.count=i>Be.count?i:Be.count,Be.page=e},async initializeExcludedWallets({ids:e}){const t={page:1,entries:e.length,include:e},{data:a}=await De.fetchWallets(t);a&&a.forEach(e=>{Be.excludedWallets.push({rdns:e.rdns,name:e.name})})},async searchWallet({search:e,badge:t}){const{includeWalletIds:a,excludeWalletIds:r}=ue.state,o=ut.getRequestedCaipNetworkIds().join(",");Be.search=[];const s={page:1,entries:100,search:e?.trim(),badge_type:t,include:a,exclude:r,chains:o},{data:n}=await De.fetchWallets(s);Pe.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});const i=n.map(e=>e.image_id).filter(Boolean);await Promise.allSettled([...i.map(e=>De._fetchWalletImage(e)),ne.wait(300)]),Be.search=De._filterOutExtensions(n)},initPromise(e,t){const a=Be.promises[e];return a||(Be.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:a=!0,fetchNetworkImages:r=!0}={}){const o=[e&&De.initPromise("connectorImages",De.fetchConnectorImages),t&&De.initPromise("featuredWallets",De.fetchFeaturedWallets),a&&De.initPromise("recommendedWallets",De.fetchRecommendedWallets),r&&De.initPromise("networkImages",De.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(o)},prefetchAnalyticsConfig(){ue.state.features?.analytics&&De.fetchAnalyticsConfig()},async fetchAnalyticsConfig(){try{const{isAnalyticsEnabled:e}=await Re.get({path:"/getAnalyticsConfig",params:De._getSdkProperties()});ue.setFeatures({analytics:e})}catch(e){ue.setFeatures({analytics:!1})}},filterByNamespaces(e){if(!e?.length)return Be.featured=Be.allFeatured,void(Be.recommended=Be.allRecommended);const t=ut.getRequestedCaipNetworkIds().join(",");Be.featured=Be.allFeatured.filter(e=>e.chains?.some(e=>t.includes(e))),Be.recommended=Be.allRecommended.filter(e=>e.chains?.some(e=>t.includes(e))),Be.filteredWallets=Be.wallets.filter(e=>e.chains?.some(e=>t.includes(e)))},clearFilterByNamespaces(){Be.filteredWallets=[]},setFilterByNamespace(e){if(!e)return Be.featured=Be.allFeatured,void(Be.recommended=Be.allRecommended);const t=ut.getRequestedCaipNetworkIds().join(",");Be.featured=Be.allFeatured.filter(e=>e.chains?.some(e=>t.includes(e))),Be.recommended=Be.allRecommended.filter(e=>e.chains?.some(e=>t.includes(e))),Be.filteredWallets=Be.wallets.filter(e=>e.chains?.some(e=>t.includes(e)))}},Me=p({view:"Connect",history:["Connect"],transactionStack:[]}),Le=be({state:Me,subscribeKey:(e,t)=>h(Me,e,t),pushTransactionStack(e){Me.transactionStack.push(e)},popTransactionStack(e){const t=Me.transactionStack.pop();if(!t)return;const{onSuccess:a,onError:r,onCancel:o}=t;switch(e){case"success":a?.();break;case"error":r?.(),Le.goBack();break;case"cancel":o?.(),Le.goBack()}},push(e,t){e!==Me.view&&(Me.view=e,Me.history.push(e),Me.data=t)},reset(e,t){Me.view=e,Me.history=[e],Me.data=t},replace(e,t){Me.history.at(-1)!==e&&(Me.view=e,Me.history[Me.history.length-1]=e,Me.data=t)},goBack(){const e=ut.state.activeCaipAddress,t="ConnectingFarcaster"===Le.state.view,a=!e&&t;if(Me.history.length>1){Me.history.pop();const[t]=Me.history.slice(-1);t&&(Me.view=e&&"Connect"===t?"Account":t)}else yt.close();Me.data?.wallet&&(Me.data.wallet=void 0),setTimeout(()=>{if(a){bt.setFarcasterUrl(void 0,ut.state.activeChain);const e=Ve.getAuthConnector();e?.provider?.reload();const t=w(ue.state);e?.provider?.syncDappData?.({metadata:t.metadata,sdkVersion:t.sdkVersion,projectId:t.projectId,sdkType:t.sdkType})}},100)},goBackToIndex(e){if(Me.history.length>1){Me.history=Me.history.slice(0,e+1);const[t]=Me.history.slice(-1);t&&(Me.view=t)}},goBackOrCloseModal(){Le.state.history.length>1?Le.goBack():yt.close()}}),We=p({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),Fe={state:We,subscribe:e=>m(We,()=>e(We)),setThemeMode(e){We.themeMode=e;try{const t=Ve.getAuthConnector();if(t){const a=Fe.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:a,w3mThemeVariables:ee(a,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){We.themeVariables={...We.themeVariables,...e};try{const e=Ve.getAuthConnector();if(e){const t=Fe.getSnapshot().themeVariables;e.provider.syncTheme({themeVariables:t,w3mThemeVariables:ee(We.themeVariables,We.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot:()=>w(We)},je=be(Fe),$e={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0,cosmos:void 0},He=p({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:{...$e},filterByNamespaceMap:{eip155:!0,solana:!0,polkadot:!0,bip122:!0,cosmos:!0}}),ze={state:He,subscribe:e=>m(He,()=>{e(He)}),subscribeKey:(e,t)=>h(He,e,t),initialize(e){e.forEach(e=>{const t=se.getConnectedConnectorId(e);t&&Ve.setConnectorId(t,e)})},setActiveConnector(e){e&&(He.activeConnector=g(e))},setConnectors(e){e.filter(e=>!He.allConnectors.some(t=>t.id===e.id&&Ve.getConnectorName(t.name)===Ve.getConnectorName(e.name)&&t.chain===e.chain)).forEach(e=>{"MULTI_CHAIN"!==e.type&&He.allConnectors.push(g(e))});const t=Ve.getEnabledNamespaces(),a=Ve.getEnabledConnectors(t);He.connectors=Ve.mergeMultiChainConnectors(a)},filterByNamespaces(e){Object.keys(He.filterByNamespaceMap).forEach(e=>{He.filterByNamespaceMap[e]=!1}),e.forEach(e=>{He.filterByNamespaceMap[e]=!0}),Ve.updateConnectorsForEnabledNamespaces()},filterByNamespace(e,t){He.filterByNamespaceMap[e]=t,Ve.updateConnectorsForEnabledNamespaces()},updateConnectorsForEnabledNamespaces(){const e=Ve.getEnabledNamespaces(),t=Ve.getEnabledConnectors(e),a=Ve.areAllNamespacesEnabled();He.connectors=Ve.mergeMultiChainConnectors(t),a?De.clearFilterByNamespaces():De.filterByNamespaces(e)},getEnabledNamespaces:()=>Object.entries(He.filterByNamespaceMap).filter(([e,t])=>t).map(([e])=>e),getEnabledConnectors:e=>He.allConnectors.filter(t=>e.includes(t.chain)),areAllNamespacesEnabled:()=>Object.values(He.filterByNamespaceMap).every(e=>e),mergeMultiChainConnectors(e){const t=Ve.generateConnectorMapByName(e),a=[];return t.forEach(e=>{const t=e[0],r=t?.id===f.CONNECTOR_ID.AUTH;e.length>1&&t?a.push({name:t.name,imageUrl:t.imageUrl,imageId:t.imageId,connectors:[...e],type:r?"AUTH":"MULTI_CHAIN",chain:"eip155",id:t?.id||""}):t&&a.push(t)}),a},generateConnectorMapByName(e){const t=new Map;return e.forEach(e=>{const{name:a}=e,r=Ve.getConnectorName(a);if(!r)return;const o=t.get(r)||[];o.find(t=>t.chain===e.chain)||o.push(e),t.set(r,o)}),t},getConnectorName:e=>e&&{"Trust Wallet":"Trust"}[e]||e,getUniqueConnectorsByName(e){const t=[];return e.forEach(e=>{t.find(t=>t.chain===e.chain)||t.push(e)}),t},addConnector(e){if(e.id===f.CONNECTOR_ID.AUTH){const t=e,a=w(ue.state),r=je.getSnapshot().themeMode,o=je.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:a.metadata,sdkVersion:a.sdkVersion,projectId:a.projectId,sdkType:a.sdkType}),t?.provider?.syncTheme({themeMode:r,themeVariables:o,w3mThemeVariables:ee(o,r)}),Ve.setConnectors([e])}else Ve.setConnectors([e])},getAuthConnector(e){const t=e||ut.state.activeChain,a=He.connectors.find(e=>e.id===f.CONNECTOR_ID.AUTH);if(a)return a?.connectors?.length?a.connectors.find(e=>e.chain===t):a},getAnnouncedConnectorRdns:()=>He.connectors.filter(e=>"ANNOUNCED"===e.type).map(e=>e.info?.rdns),getConnectorById:e=>He.allConnectors.find(t=>t.id===e),getConnector:(e,t)=>He.allConnectors.filter(e=>e.chain===ut.state.activeChain).find(a=>a.explorerId===e||a.info?.rdns===t),syncIfAuthConnector(e){if("ID_AUTH"!==e.id)return;const t=e,a=w(ue.state),r=je.getSnapshot().themeMode,o=je.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:a.metadata,sdkVersion:a.sdkVersion,sdkType:a.sdkType,projectId:a.projectId}),t.provider.syncTheme({themeMode:r,themeVariables:o,w3mThemeVariables:ee(o,r)})},getConnectorsByNamespace(e){const t=He.allConnectors.filter(t=>t.chain===e);return Ve.mergeMultiChainConnectors(t)},selectWalletConnector(e){const t=Ve.getConnector(e.id,e.rdns),a=ut.state.activeChain;ye.handleMobileDeeplinkRedirect(t?.explorerId||e.id,a),t?Le.push("ConnectingExternal",{connector:t}):Le.push("ConnectingWalletConnect",{wallet:e})},getConnectors:e=>e?Ve.getConnectorsByNamespace(e):Ve.mergeMultiChainConnectors(He.allConnectors),setFilterByNamespace(e){He.filterByNamespace=e,He.connectors=Ve.getConnectors(e),De.setFilterByNamespace(e)},setConnectorId(e,t){e&&(He.activeConnectorIds={...He.activeConnectorIds,[t]:e},se.setConnectedConnectorId(t,e))},removeConnectorId(e){He.activeConnectorIds={...He.activeConnectorIds,[e]:void 0},se.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return He.activeConnectorIds[e]},isConnected:e=>e?Boolean(He.activeConnectorIds[e]):Object.values(He.activeConnectorIds).some(e=>Boolean(e)),resetConnectorIds(){He.activeConnectorIds={...$e}}},Ve=be(ze),qe={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}},Ke=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),Ge=p({...Ke}),Je={state:Ge,subscribeKey:(e,t)=>h(Ge,e,t),showLoading(e,t={}){this._showMessage({message:e,variant:"loading",...t})},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){const t=ne.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){Ge.message=Ke.message,Ge.variant=Ke.variant,Ge.svg=Ke.svg,Ge.open=Ke.open,Ge.autoClose=Ke.autoClose},_showMessage({message:e,svg:t,variant:a="success",autoClose:r=Ke.autoClose}){Ge.open?(Ge.open=!1,setTimeout(()=>{Ge.message=e,Ge.variant=a,Ge.svg=t,Ge.open=!0,Ge.autoClose=r},150)):(Ge.message=e,Ge.variant=a,Ge.svg=t,Ge.open=!0,Ge.autoClose=r)}},Ye=p({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),Xe={state:Ye,subscribe:e=>m(Ye,()=>e(Ye)),setLastNetworkInView(e){Ye.lastNetworkInView=e},async fetchTransactions(e,t){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");Ye.loading=!0;try{const a=await gt.fetchTransactions({account:e,cursor:Ye.next,onramp:t,cache:"coinbase"===t?"no-cache":void 0,chainId:ut.state.activeCaipNetwork?.caipNetworkId}),r=Qe.filterSpamTransactions(a.data),o=Qe.filterByConnectedChain(r),s=[...Ye.transactions,...o];Ye.loading=!1,"coinbase"===t?Ye.coinbaseTransactions=Qe.groupTransactionsByYearAndMonth(Ye.coinbaseTransactions,a.data):(Ye.transactions=s,Ye.transactionsByYear=Qe.groupTransactionsByYearAndMonth(Ye.transactionsByYear,o)),Ye.empty=0===s.length,Ye.next=a.next?a.next:void 0}catch(a){const t=ut.state.activeChain;Pe.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:ue.state.projectId,cursor:Ye.next,isSmartAccount:bt.state.preferredAccountTypes?.[t]===qe.ACCOUNT_TYPES.SMART_ACCOUNT}}),Je.showError("Failed to fetch transactions"),Ye.loading=!1,Ye.empty=!0,Ye.next=void 0}},groupTransactionsByYearAndMonth(e={},t=[]){const a=e;return t.forEach(e=>{const t=new Date(e.metadata.minedAt).getFullYear(),r=new Date(e.metadata.minedAt).getMonth(),o=a[t]??{},s=(o[r]??[]).filter(t=>t.id!==e.id);a[t]={...o,[r]:[...s,e].sort((e,t)=>new Date(t.metadata.minedAt).getTime()-new Date(e.metadata.minedAt).getTime())}}),a},filterSpamTransactions:e=>e.filter(e=>!e.transfers.every(e=>!0===e.nft_info?.flags.is_spam)),filterByConnectedChain(e){const t=ut.state.activeCaipNetwork?.caipNetworkId;return e.filter(e=>e.metadata.chain===t)},clearCursor(){Ye.next=void 0},resetTransactions(){Ye.transactions=[],Ye.transactionsByYear={},Ye.lastNetworkInView=void 0,Ye.loading=!1,Ye.empty=!1,Ye.next=void 0}},Qe=be(Xe,"API_ERROR"),Ze=p({connections:new Map,wcError:!1,buffering:!1,status:"disconnected"}),et=be({state:Ze,subscribeKey:(e,t)=>h(Ze,e,t),_getClient:()=>Ze._client,setClient(e){Ze._client=g(e)},async connectWalletConnect(){if(ne.isTelegram()||ne.isSafari()&&ne.isIos()){if(ve)return await ve,void(ve=void 0);if(!ne.isPairingExpired(Ze?.wcPairingExpiry))return void(Ze.wcUri=Ze.wcUri);ve=et._getClient()?.connectWalletConnect?.().catch(()=>{}),et.state.status="connecting",await ve,ve=void 0,Ze.wcPairingExpiry=void 0,et.state.status="connected"}else await(et._getClient()?.connectWalletConnect?.())},async connectExternal(e,t,a=!0){await(et._getClient()?.connectExternal?.(e)),a&&ut.setActiveNamespace(t)},async reconnectExternal(e){await(et._getClient()?.reconnectExternal?.(e));const t=e.chain||ut.state.activeChain;t&&Ve.setConnectorId(e.id,t)},async setPreferredAccountType(e,t){yt.setLoading(!0,ut.state.activeChain);const a=Ve.getAuthConnector();a&&(bt.setPreferredAccountType(e,t),await a.provider.setPreferredAccount(e),se.setPreferredAccountTypes(bt.state.preferredAccountTypes??{[t]:e}),await et.reconnectExternal(a),yt.setLoading(!1,ut.state.activeChain),Pe.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:ut.state.activeCaipNetwork?.caipNetworkId||""}}))},signMessage:async e=>et._getClient()?.signMessage(e),parseUnits:(e,t)=>et._getClient()?.parseUnits(e,t),formatUnits:(e,t)=>et._getClient()?.formatUnits(e,t),sendTransaction:async e=>et._getClient()?.sendTransaction(e),getCapabilities:async e=>et._getClient()?.getCapabilities(e),grantPermissions:async e=>et._getClient()?.grantPermissions(e),walletGetAssets:async e=>et._getClient()?.walletGetAssets(e)??{},estimateGas:async e=>et._getClient()?.estimateGas(e),writeContract:async e=>et._getClient()?.writeContract(e),getEnsAddress:async e=>et._getClient()?.getEnsAddress(e),getEnsAvatar:async e=>et._getClient()?.getEnsAvatar(e),checkInstalled:e=>et._getClient()?.checkInstalled?.(e)||!1,resetWcConnection(){Ze.wcUri=void 0,Ze.wcPairingExpiry=void 0,Ze.wcLinking=void 0,Ze.recentWallet=void 0,Ze.status="disconnected",Qe.resetTransactions(),se.deleteWalletConnectDeepLink()},resetUri(){Ze.wcUri=void 0,Ze.wcPairingExpiry=void 0,ve=void 0},finalizeWcConnection(){const{wcLinking:e,recentWallet:t}=et.state;e&&se.setWalletConnectDeepLink(e),t&&se.setAppKitRecent(t),Pe.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:Le.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){Ze.wcBasic=e},setUri(e){Ze.wcUri=e,Ze.wcPairingExpiry=ne.getPairingExpiry()},setWcLinking(e){Ze.wcLinking=e},setWcError(e){Ze.wcError=e,Ze.buffering=!1},setRecentWallet(e){Ze.recentWallet=e},setBuffering(e){Ze.buffering=e},setStatus(e){Ze.status=e},async disconnect(e){try{await(et._getClient()?.disconnect(e))}catch(t){throw new he("Failed to disconnect","INTERNAL_SDK_ERROR",t)}},setConnections(e,t){Ze.connections.set(t,e)},switchAccount({connection:e,address:t,namespace:a}){if(Ve.state.activeConnectorIds[a]===e.connectorId){const e=ut.state.activeCaipNetwork;if(e){const r=`${a}:${e.id}:${t}`;bt.setCaipAddress(r,a)}else console.warn(`No current network found for namespace "${a}"`)}else{const t=Ve.getConnector(e.connectorId);t?et.connectExternal(t,a):console.warn(`No connector found for namespace "${a}"`)}}}),tt=p({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),at={state:tt,subscribe:e=>m(tt,()=>e(tt)),subscribeOpen:e=>h(tt,"open",e),set(e){Object.assign(tt,{...tt,...e})}},rt={createBalance(e,t){const a={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:a.name,symbol:a.symbol,chainId:t,address:"native"===e.address?void 0:this.convertAddressToCAIP10Address(e.address,t),value:a.value,price:a.price,quantity:{decimals:a.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:a.decimals})},iconUrl:a.iconUrl}},convertHexToBalance:({hex:t,decimals:a})=>e(BigInt(t),a),convertAddressToCAIP10Address:(e,t)=>`${t}:${e}`,createCAIP2ChainId:(e,t)=>`${t}:${parseInt(e,16)}`,getChainIdHexFromCAIP2ChainId(e){const t=e.split(":");if(t.length<2||!t[1])return"0x0";const a=t[1],r=parseInt(a,10);return isNaN(r)?"0x0":`0x${r.toString(16)}`},isWalletGetAssetsResponse(e){return"object"==typeof e&&null!==e&&Object.values(e).every(e=>Array.isArray(e)&&e.every(e=>this.isValidAsset(e)))},isValidAsset:e=>"object"==typeof e&&null!==e&&"string"==typeof e.address&&"string"==typeof e.balance&&("ERC20"===e.type||"NATIVE"===e.type)&&"object"==typeof e.metadata&&null!==e.metadata&&"string"==typeof e.metadata.name&&"string"==typeof e.metadata.symbol&&"number"==typeof e.metadata.decimals&&"number"==typeof e.metadata.price&&"string"==typeof e.metadata.iconUrl},ot={async getMyTokensWithBalance(e){const t=bt.state.address,a=ut.state.activeCaipNetwork;if(!t||!a)return[];if("eip155"===a.chainNamespace){const e=await this.getEIP155Balances(t,a);if(e)return this.filterLowQualityTokens(e)}const r=await gt.getBalance(t,a.caipNetworkId,e);return this.filterLowQualityTokens(r.balances)},async getEIP155Balances(e,t){try{const a=rt.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(await et.getCapabilities(e))?.[a]?.assetDiscovery?.supported)return null;const r=await et.walletGetAssets({account:e,chainFilter:[a]});return rt.isWalletGetAssetsResponse(r)?(r[a]||[]).map(e=>rt.createBalance(e,t.caipNetworkId)):null}catch(a){return null}},filterLowQualityTokens:e=>e.filter(e=>"0"!==e.quantity.decimals),mapBalancesToSwapTokens:e=>e?.map(e=>({...e,address:e?.address?e.address:ut.getActiveNetworkTokenAddress(),decimals:parseInt(e.quantity.decimals,10),logoUri:e.iconUrl,eip2612:!1}))||[]},st=p({tokenBalances:[],loading:!1}),nt=be({state:st,subscribe:e=>m(st,()=>e(st)),subscribeKey:(e,t)=>h(st,e,t),setToken(e){e&&(st.token=g(e))},setTokenAmount(e){st.sendTokenAmount=e},setReceiverAddress(e){st.receiverAddress=e},setReceiverProfileImageUrl(e){st.receiverProfileImageUrl=e},setReceiverProfileName(e){st.receiverProfileName=e},setNetworkBalanceInUsd(e){st.networkBalanceInUSD=e},setLoading(e){st.loading=e},async sendToken(){try{switch(nt.setLoading(!0),ut.state.activeCaipNetwork?.chainNamespace){case"eip155":return void(await nt.sendEvmToken());case"solana":return void(await nt.sendSolanaToken());default:throw new Error("Unsupported chain")}}finally{nt.setLoading(!1)}},async sendEvmToken(){const e=ut.state.activeChain,t=bt.state.preferredAccountTypes?.[e];if(!nt.state.sendTokenAmount||!nt.state.receiverAddress)throw new Error("An amount and receiver address are required");if(!nt.state.token)throw new Error("A token is required");nt.state.token?.address?(Pe.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===qe.ACCOUNT_TYPES.SMART_ACCOUNT,token:nt.state.token.address,amount:nt.state.sendTokenAmount,network:ut.state.activeCaipNetwork?.caipNetworkId||""}}),await nt.sendERC20Token({receiverAddress:nt.state.receiverAddress,tokenAddress:nt.state.token.address,sendTokenAmount:nt.state.sendTokenAmount,decimals:nt.state.token.quantity.decimals})):(Pe.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===qe.ACCOUNT_TYPES.SMART_ACCOUNT,token:nt.state.token.symbol||"",amount:nt.state.sendTokenAmount,network:ut.state.activeCaipNetwork?.caipNetworkId||""}}),await nt.sendNativeToken({receiverAddress:nt.state.receiverAddress,sendTokenAmount:nt.state.sendTokenAmount,decimals:nt.state.token.quantity.decimals}))},async fetchTokenBalance(e){st.loading=!0;const t=ut.state.activeCaipNetwork?.caipNetworkId,a=ut.state.activeCaipNetwork?.chainNamespace,r=ut.state.activeCaipAddress,o=r?ne.getPlainAddress(r):void 0;if(st.lastRetry&&!ne.isAllowedRetry(st.lastRetry,30*oe.ONE_SEC_MS))return st.loading=!1,[];try{if(o&&t&&a){const e=await ot.getMyTokensWithBalance();return st.tokenBalances=e,st.lastRetry=void 0,e}}catch(s){st.lastRetry=Date.now(),e?.(s),Je.showError("Token Balance Unavailable")}finally{st.loading=!1}return[]},fetchNetworkBalance(){if(0===st.tokenBalances.length)return;const e=ot.mapBalancesToSwapTokens(st.tokenBalances);if(!e)return;const t=e.find(e=>e.address===ut.getActiveNetworkTokenAddress());t&&(st.networkBalanceInUSD=t?P.multiply(t.quantity.numeric,t.price).toString():"0")},async sendNativeToken(e){Le.pushTransactionStack({});const t=e.receiverAddress,a=bt.state.address,r=et.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));await et.sendTransaction({chainNamespace:"eip155",to:t,address:a,data:"0x",value:r??BigInt(0)}),Pe.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:bt.state.preferredAccountTypes?.eip155===qe.ACCOUNT_TYPES.SMART_ACCOUNT,token:nt.state.token?.symbol||"",amount:e.sendTokenAmount,network:ut.state.activeCaipNetwork?.caipNetworkId||""}}),et._getClient()?.updateBalance("eip155"),nt.resetSend()},async sendERC20Token(e){Le.pushTransactionStack({onSuccess(){Le.replace("Account")}});const t=et.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));if(bt.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){const a=ne.getPlainAddress(e.tokenAddress);await et.writeContract({fromAddress:bt.state.address,tokenAddress:a,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:B(a),chainNamespace:"eip155"}),nt.resetSend()}},async sendSolanaToken(){if(!nt.state.sendTokenAmount||!nt.state.receiverAddress)throw new Error("An amount and receiver address are required");Le.pushTransactionStack({onSuccess(){Le.replace("Account")}}),await et.sendTransaction({chainNamespace:"solana",to:nt.state.receiverAddress,value:nt.state.sendTokenAmount}),et._getClient()?.updateBalance("solana"),nt.resetSend()},resetSend(){st.token=void 0,st.sendTokenAmount=void 0,st.receiverAddress=void 0,st.receiverProfileImageUrl=void 0,st.receiverProfileName=void 0,st.loading=!1,st.tokenBalances=[]}}),it={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},ct={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},lt=p({chains:function(e){const t=p({data:Array.from(e||[]),has(e){return this.data.some(t=>t[0]===e)},set(e,t){const a=this.data.find(t=>t[0]===e);return a?a[1]=t:this.data.push([e,t]),this},get(e){var t;return null==(t=this.data.find(t=>t[0]===e))?void 0:t[1]},delete(e){const t=this.data.findIndex(t=>t[0]===e);return-1!==t&&(this.data.splice(t,1),!0)},clear(){this.data.splice(0)},get size(){return this.data.length},toJSON(){return new Map(this.data)},forEach(e){this.data.forEach(t=>{e(t[1],t[0],this)})},keys(){return this.data.map(e=>e[0]).values()},values(){return this.data.map(e=>e[1]).values()},entries(){return new Map(this.data).entries()},get[Symbol.toStringTag](){return"Map"},[Symbol.iterator](){return this.entries()}});return Object.defineProperties(t,{data:{enumerable:!1},size:{enumerable:!1},toJSON:{enumerable:!1}}),Object.seal(t),t}(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),dt={state:lt,subscribe:e=>m(lt,()=>{e(lt)}),subscribeKey:(e,t)=>h(lt,e,t),subscribeChainProp(e,t,a){let r;return m(lt.chains,()=>{const o=a||lt.activeChain;if(o){const a=lt.chains.get(o)?.[e];r!==a&&(r=a,t(a))}})},initialize(e,t,a){const{chainId:r,namespace:o}=se.getActiveNetworkProps(),s=t?.find(e=>e.id.toString()===r?.toString()),n=e.find(e=>e?.namespace===o)||e?.[0],i=e.map(e=>e.namespace).filter(e=>void 0!==e),c=ue.state.enableEmbedded?new Set([...i]):new Set([...t?.map(e=>e.chainNamespace)??[]]);0!==e?.length&&n||(lt.noAdapters=!0),lt.noAdapters||(lt.activeChain=n?.namespace,lt.activeCaipNetwork=s,ut.setChainNetworkData(n?.namespace,{caipNetwork:s}),lt.activeChain&&at.set({activeChain:n?.namespace})),c.forEach(e=>{const r=t?.filter(t=>t.chainNamespace===e);ut.state.chains.set(e,{namespace:e,networkState:p({...ct,caipNetwork:r?.[0]}),accountState:p(it),caipNetworks:r??[],...a}),ut.setRequestedCaipNetworks(r??[],e)})},removeAdapter(e){if(lt.activeChain===e){const t=Array.from(lt.chains.entries()).find(([t])=>t!==e);if(t){const e=t[1]?.caipNetworks?.[0];e&&ut.setActiveCaipNetwork(e)}}lt.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:a},r){lt.chains.set(e.namespace,{namespace:e.namespace,networkState:{...ct,caipNetwork:r[0]},accountState:it,caipNetworks:r,connectionControllerClient:a,networkControllerClient:t}),ut.setRequestedCaipNetworks(r?.filter(t=>t.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){const t=lt.chains.get(e.chainNamespace);if(t){const a=[...t.caipNetworks||[]];t.caipNetworks?.find(t=>t.id===e.id)||a.push(e),lt.chains.set(e.chainNamespace,{...t,caipNetworks:a}),ut.setRequestedCaipNetworks(a,e.chainNamespace),Ve.filterByNamespace(e.chainNamespace,!0)}},removeNetwork(e,t){const a=lt.chains.get(e);if(a){const r=lt.activeCaipNetwork?.id===t,o=[...a.caipNetworks?.filter(e=>e.id!==t)||[]];r&&a?.caipNetworks?.[0]&&ut.setActiveCaipNetwork(a.caipNetworks[0]),lt.chains.set(e,{...a,caipNetworks:o}),ut.setRequestedCaipNetworks(o||[],e),0===o.length&&Ve.filterByNamespace(e,!1)}},setAdapterNetworkState(e,t){const a=lt.chains.get(e);a&&(a.networkState={...a.networkState||ct,...t},lt.chains.set(e,a))},setChainAccountData(e,t,a=!0){if(!e)throw new Error("Chain is required to update chain account data");const r=lt.chains.get(e);if(r){const a={...r.accountState||it,...t};lt.chains.set(e,{...r,accountState:a}),1!==lt.chains.size&&lt.activeChain!==e||(t.caipAddress&&(lt.activeCaipAddress=t.caipAddress),bt.replaceState(a))}},setChainNetworkData(e,t){if(!e)return;const a=lt.chains.get(e);if(a){const r={...a.networkState||ct,...t};lt.chains.set(e,{...a,networkState:r})}},setAccountProp(e,t,a,r=!0){ut.setChainAccountData(a,{[e]:t},r),"status"===e&&"disconnected"===t&&a&&Ve.removeConnectorId(a)},setActiveNamespace(e){lt.activeChain=e;const t=e?lt.chains.get(e):void 0,a=t?.networkState?.caipNetwork;a?.id&&e&&(lt.activeCaipAddress=t?.accountState?.caipAddress,lt.activeCaipNetwork=a,ut.setChainNetworkData(e,{caipNetwork:a}),se.setActiveCaipNetworkId(a?.caipNetworkId),at.set({activeChain:e,selectedNetworkId:a?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;lt.activeChain!==e.chainNamespace&&ut.setIsSwitchingNamespace(!0);const t=lt.chains.get(e.chainNamespace);lt.activeChain=e.chainNamespace,lt.activeCaipNetwork=e,ut.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),lt.activeCaipAddress=t?.accountState?.address?`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:void 0,ut.setAccountProp("caipAddress",lt.activeCaipAddress,e.chainNamespace),t&&bt.replaceState(t.accountState),nt.resetSend(),at.set({activeChain:lt.activeChain,selectedNetworkId:lt.activeCaipNetwork?.caipNetworkId}),se.setActiveCaipNetworkId(e.caipNetworkId),ut.checkIfSupportedNetwork(e.chainNamespace)||!ue.state.enableNetworkSwitch||ue.state.allowUnsupportedChain||et.state.wcBasic||ut.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;const t=lt.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},async switchActiveNamespace(e){if(!e)return;const t=e!==ut.state.activeChain,a=ut.getNetworkData(e)?.caipNetwork,r=ut.getCaipNetworkByNamespace(e,a?.id);t&&r&&await ut.switchActiveNetwork(r)},async switchActiveNetwork(e){const t=!ut.state.chains.get(ut.state.activeChain)?.caipNetworks?.some(e=>e.id===lt.activeCaipNetwork?.id),a=ut.getNetworkControllerClient(e.chainNamespace);if(a){try{await a.switchCaipNetwork(e),t&&yt.close()}catch(r){Le.goBack()}Pe.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}})}},getNetworkControllerClient(e){const t=e||lt.activeChain,a=lt.chains.get(t);if(!a)throw new Error("Chain adapter not found");if(!a.networkControllerClient)throw new Error("NetworkController client not set");return a.networkControllerClient},getConnectionControllerClient(e){const t=e||lt.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");const a=lt.chains.get(t);if(!a?.connectionControllerClient)throw new Error("ConnectionController client not set");return a.connectionControllerClient},getAccountProp(e,t){let a=lt.activeChain;if(t&&(a=t),!a)return;const r=lt.chains.get(a)?.accountState;return r?r[e]:void 0},getNetworkProp(e,t){const a=lt.chains.get(t)?.networkState;if(a)return a[e]},getRequestedCaipNetworks(e){const{approvedCaipNetworkIds:t=[],requestedCaipNetworks:a=[]}=lt.chains.get(e)?.networkState||{};return ne.sortRequestedNetworks(t,a)},getAllRequestedCaipNetworks(){const e=[];return lt.chains.forEach(t=>{const a=ut.getRequestedCaipNetworks(t.namespace);e.push(...a)}),e},setRequestedCaipNetworks(e,t){ut.setAdapterNetworkState(t,{requestedCaipNetworks:e});const a=ut.getAllRequestedCaipNetworks().map(e=>e.chainNamespace),r=Array.from(new Set(a));Ve.filterByNamespaces(r)},getAllApprovedCaipNetworkIds(){const e=[];return lt.chains.forEach(t=>{const a=ut.getApprovedCaipNetworkIds(t.namespace);e.push(...a)}),e},getActiveCaipNetwork:()=>lt.activeCaipNetwork,getActiveCaipAddress:()=>lt.activeCaipAddress,getApprovedCaipNetworkIds:e=>lt.chains.get(e)?.networkState?.approvedCaipNetworkIds||[],async setApprovedCaipNetworksData(e){const t=await(ut.getNetworkControllerClient()?.getApprovedCaipNetworksData());ut.setAdapterNetworkState(e,{approvedCaipNetworkIds:t?.approvedCaipNetworkIds,supportsAllNetworks:t?.supportsAllNetworks})},checkIfSupportedNetwork(e,t){const a=t||lt.activeCaipNetwork,r=ut.getRequestedCaipNetworks(e);return!r.length||r?.some(e=>e.id===a?.id)},checkIfSupportedChainId:e=>!lt.activeChain||ut.getRequestedCaipNetworks(lt.activeChain)?.some(t=>t.id===e),setSmartAccountEnabledNetworks(e,t){ut.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){const e=b.caipNetworkIdToNumber(lt.activeCaipNetwork?.caipNetworkId),t=lt.activeChain;if(!t||!e)return!1;const a=ut.getNetworkProp("smartAccountEnabledNetworks",t);return Boolean(a?.includes(Number(e)))},getActiveNetworkTokenAddress(){const e=lt.activeCaipNetwork?.chainNamespace||"eip155";return`${e}:${lt.activeCaipNetwork?.id||1}:${oe.NATIVE_TOKEN_ADDRESS[e]}`},showUnsupportedChainUI(){yt.open({view:"UnsupportedChain"})},checkIfNamesSupported(){const e=lt.activeCaipNetwork;return Boolean(e?.chainNamespace&&oe.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){ut.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){const t=e;if(!t)throw new Error("Chain is required to set account prop");lt.activeCaipAddress=void 0,ut.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),Ve.removeConnectorId(t)},setIsSwitchingNamespace(e){lt.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){const e=[];let t;if(lt.chains.forEach(t=>{f.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(e=>e===t.namespace)&&t.namespace&&e.push(t.namespace)}),e.length>0){const a=e[0];return t=a?lt.chains.get(a)?.caipNetworks?.[0]:void 0,t}},getAccountData:e=>e?ut.state.chains.get(e)?.accountState:bt.state,getNetworkData(e){const t=e||lt.activeChain;if(t)return ut.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;const a=ut.state.chains.get(e),r=a?.caipNetworks?.find(e=>e.id===t);return r||(a?.networkState?.caipNetwork||a?.caipNetworks?.[0])},getRequestedCaipNetworkIds(){const e=Ve.state.filterByNamespace;return(e?[lt.chains.get(e)]:Array.from(lt.chains.values())).flatMap(e=>e?.caipNetworks||[]).map(e=>e.caipNetworkId)},getCaipNetworks:e=>e?ut.getRequestedCaipNetworks(e):ut.getAllRequestedCaipNetworks()},ut=be(dt),pt={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},mt=ne.getBlockchainApiUrl(),wt=p({clientId:null,api:new ce({baseUrl:mt,clientId:null}),supportedChains:{http:[],ws:[]}}),gt={state:wt,async get(e){const{st:t,sv:a}=gt.getSdkProperties(),r=ue.state.projectId,o={...e.params||{},st:t,sv:a,projectId:r};return wt.api.get({...e,params:o})},getSdkProperties(){const{sdkType:e,sdkVersion:t}=ue.state;return{st:e||"unknown",sv:t||"unknown"}},async isNetworkSupported(e){if(!e)return!1;try{wt.supportedChains.http.length||await gt.getSupportedNetworks()}catch(t){return!1}return wt.supportedChains.http.includes(e)},async getSupportedNetworks(){try{const e=await gt.get({path:"v1/supported-chains"});return wt.supportedChains=e,e}catch{return wt.supportedChains}},async fetchIdentity({address:e,caipNetworkId:t}){if(!(await gt.isNetworkSupported(t)))return{avatar:"",name:""};const a=se.getIdentityFromCacheForAddress(e);if(a)return a;const r=await gt.get({path:`/v1/identity/${e}`,params:{sender:ut.state.activeCaipAddress?ne.getPlainAddress(ut.state.activeCaipAddress):void 0}});return se.updateIdentityCache({address:e,identity:r,timestamp:Date.now()}),r},fetchTransactions:async({account:e,cursor:t,onramp:a,signal:r,cache:o,chainId:s})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:a,chainId:s},signal:r,cache:o}):{data:[],next:void 0},fetchSwapQuote:async({amount:e,userAddress:t,from:a,to:r,gasPrice:o})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:a,to:r,gasPrice:o}}):{quotes:[]},fetchSwapTokens:async({chainId:e})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]},fetchTokenPrice:async({addresses:e})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?wt.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:ue.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]},fetchSwapAllowance:async({tokenAddress:e,userAddress:t})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"},async fetchGasPrice({chainId:e}){const{st:t,sv:a}=gt.getSdkProperties();if(!(await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Gas Price");return gt.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:t,sv:a}})},async generateSwapCalldata({amount:e,from:t,to:a,userAddress:r,disableEstimate:o}){if(!(await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Swaps");return wt.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:oe.CONVERT_SLIPPAGE_TOLERANCE},projectId:ue.state.projectId,from:t,to:a,userAddress:r,disableEstimate:o}})},async generateApproveCalldata({from:e,to:t,userAddress:a}){const{st:r,sv:o}=gt.getSdkProperties();if(!(await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Swaps");return gt.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:a,from:e,to:t,st:r,sv:o}})},async getBalance(e,t,a){const{st:r,sv:o}=gt.getSdkProperties();if(!(await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)))return Je.showError("Token Balance Unavailable"),{balances:[]};const s=`${t}:${e}`,n=se.getBalanceCacheForCaipAddress(s);if(n)return n;const i=await gt.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:a,st:r,sv:o}});return se.updateBalanceCache({caipAddress:s,balance:i,timestamp:Date.now()}),i},lookupEnsName:async e=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]},reverseLookupEnsName:async({address:e})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:`/v1/profile/reverse/${e}`,params:{sender:bt.state.address,apiVersion:"2"}}):[],getEnsNameSuggestions:async e=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]},registerEnsName:async({coinType:e,address:t,message:a,signature:r})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?wt.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:a,signature:r},headers:{"Content-Type":"application/json"}}):{success:!1},generateOnRampURL:async({destinationWallets:e,partnerUserId:t,defaultNetwork:a,purchaseAmount:r,paymentAmount:o})=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?(await wt.api.post({path:"/v1/generators/onrampurl",params:{projectId:ue.state.projectId},body:{destinationWallets:e,defaultNetwork:a,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:r,presetFiatAmount:o}})).url:"",async getOnrampOptions(){if(!(await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return await gt.get({path:"/v1/onramp/options"})}catch(e){return pt}},async getOnrampQuote({purchaseCurrency:e,paymentCurrency:t,amount:a,network:r}){try{return await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?await wt.api.post({path:"/v1/onramp/quote",params:{projectId:ue.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:a,network:r}}):null}catch(o){return{coinbaseFee:{amount:a,currency:t.id},networkFee:{amount:a,currency:t.id},paymentSubtotal:{amount:a,currency:t.id},paymentTotal:{amount:a,currency:t.id},purchaseAmount:{amount:a,currency:t.id},quoteId:"mocked-quote-id"}}},getSmartSessions:async e=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?gt.get({path:`/v1/sessions/${e}`}):[],revokeSmartSession:async(e,t,a)=>await gt.isNetworkSupported(ut.state.activeCaipNetwork?.caipNetworkId)?wt.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:ue.state.projectId},body:{pci:t,signature:a}}):{success:!1},setClientId(e){wt.clientId=e,wt.api=new ce({baseUrl:mt,clientId:e})}},ht=p({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),ft={state:ht,replaceState(e){e&&Object.assign(ht,g(e))},subscribe:e=>ut.subscribeChainProp("accountState",t=>{if(t)return e(t)}),subscribeKey(e,t,a){let r;return ut.subscribeChainProp("accountState",a=>{if(a){const o=a[e];r!==o&&(r=o,t(o))}},a)},setStatus(e,t){ut.setAccountProp("status",e,t)},getCaipAddress:e=>ut.getAccountProp("caipAddress",e),setCaipAddress(e,t){const a=e?ne.getPlainAddress(e):void 0;t===ut.state.activeChain&&(ut.state.activeCaipAddress=e),ut.setAccountProp("caipAddress",e,t),ut.setAccountProp("address",a,t)},setBalance(e,t,a){ut.setAccountProp("balance",e,a),ut.setAccountProp("balanceSymbol",t,a)},setProfileName(e,t){ut.setAccountProp("profileName",e,t)},setProfileImage(e,t){ut.setAccountProp("profileImage",e,t)},setUser(e,t){ut.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){ut.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){ut.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){ut.setAccountProp("currentTab",e,ut.state.activeChain)},setTokenBalance(e,t){e&&ut.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){ut.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){ut.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,a){const r=ut.getAccountProp("addressLabels",a)||new Map;r.set(e,t),ut.setAccountProp("addressLabels",r,a)},removeAddressLabel(e,t){const a=ut.getAccountProp("addressLabels",t)||new Map;a.delete(e),ut.setAccountProp("addressLabels",a,t)},setConnectedWalletInfo(e,t){ut.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){ut.setAccountProp("preferredAccountTypes",{...ht.preferredAccountTypes,[t]:e},t)},setPreferredAccountTypes(e){ht.preferredAccountTypes=e},setSocialProvider(e,t){e&&ut.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){ut.setAccountProp("socialWindow",e?g(e):void 0,t)},setFarcasterUrl(e,t){ut.setAccountProp("farcasterUrl",e,t)},async fetchTokenBalance(e){ht.balanceLoading=!0;const t=ut.state.activeCaipNetwork?.caipNetworkId,a=ut.state.activeCaipNetwork?.chainNamespace,r=ut.state.activeCaipAddress,o=r?ne.getPlainAddress(r):void 0;if(ht.lastRetry&&!ne.isAllowedRetry(ht.lastRetry,30*oe.ONE_SEC_MS))return ht.balanceLoading=!1,[];try{if(o&&t&&a){const e=(await gt.getBalance(o,t)).balances.filter(e=>"0"!==e.quantity.decimals);return bt.setTokenBalance(e,a),ht.lastRetry=void 0,ht.balanceLoading=!1,e}}catch(s){ht.lastRetry=Date.now(),e?.(s),Je.showError("Token Balance Unavailable")}finally{ht.balanceLoading=!1}return[]},resetAccount(e){ut.resetAccount(e)}},bt=be(ft),vt={onSwitchNetwork({network:e,ignoreSwitchConfirmation:t=!1}){const a=ut.state.activeCaipNetwork,r=Le.state.data;if(e.id===a?.id)return;const o=bt.getCaipAddress(ut.state.activeChain),s=e.chainNamespace!==ut.state.activeChain,n=bt.getCaipAddress(e.chainNamespace),i=Ve.getConnectorId(ut.state.activeChain)===f.CONNECTOR_ID.AUTH,c=f.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(t=>t===e.chainNamespace);t||i&&c?Le.push("SwitchNetwork",{...r,network:e}):o&&s&&!n?Le.push("SwitchActiveChain",{switchToChain:e.chainNamespace,navigateTo:"Connect",navigateWithReplace:!0,network:e}):Le.push("SwitchNetwork",{...r,network:e})}},Ct=p({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),yt=be({state:Ct,subscribe:e=>m(Ct,()=>e(Ct)),subscribeKey:(e,t)=>h(Ct,e,t),async open(e){const t="connected"===bt.state.status,a=e?.namespace,r=ut.state.activeChain,o=a&&a!==r,s=ut.getAccountData(e?.namespace)?.caipAddress;if(et.state.wcBasic?De.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):await De.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),Ve.setFilterByNamespace(e?.namespace),yt.setLoading(!0,a),a&&o){const e=ut.getNetworkData(a)?.caipNetwork||ut.getRequestedCaipNetworks(a)[0];e&&vt.onSwitchNetwork({network:e,ignoreSwitchConfirmation:!0})}else{const t=ut.state.noAdapters;ue.state.manualWCControl||t&&!s?ne.isMobile()?Le.reset("AllWallets"):Le.reset("ConnectingWalletConnectBasic"):e?.view?Le.reset(e.view,e.data):s?Le.reset("Account"):Le.reset("Connect")}Ct.open=!0,at.set({open:!0}),Pe.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:Boolean(s)}})},close(){const e=ue.state.enableEmbedded,t=Boolean(ut.state.activeCaipAddress);Ct.open&&Pe.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),Ct.open=!1,Le.reset("Connect"),yt.clearLoading(),e?t?Le.replace("Account"):Le.push("Connect"):at.set({open:!1}),et.resetUri()},setLoading(e,t){t&&Ct.loadingNamespaceMap.set(t,e),Ct.loading=e,at.set({loading:e})},clearLoading(){Ct.loadingNamespaceMap.clear(),Ct.loading=!1},shake(){Ct.shake||(Ct.shake=!0,setTimeout(()=>{Ct.shake=!1},500))}}),Nt=void 0,kt=void 0,At=void 0;function It(e,t){Nt=document.createElement("style"),kt=document.createElement("style"),At=document.createElement("style"),Nt.textContent=xt(e).core.cssText,kt.textContent=xt(e).dark.cssText,At.textContent=xt(e).light.cssText,document.head.appendChild(Nt),document.head.appendChild(kt),document.head.appendChild(At),Et(t)}function Et(e){kt&&At&&("light"===e?(kt.removeAttribute("media"),At.media="enabled"):(At.removeAttribute("media"),kt.media="enabled"))}function St(e){Nt&&kt&&At&&(Nt.textContent=xt(e).core.cssText,kt.textContent=xt(e).dark.cssText,At.textContent=xt(e).light.cssText)}function xt(e){return{core:t`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${a(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${a(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${a(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${a(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${a(e?.["--w3m-z-index"]||999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,light:t`
      :root {
        --w3m-color-mix: ${a(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${a(ee(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${a(ee(e,"dark")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,dark:t`
      :root {
        --w3m-color-mix: ${a(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${a(ee(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${a(ee(e,"light")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `}}var Tt=t`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,_t=t`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,Ut=t`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`,Pt={getSpacingStyles:(e,t)=>Array.isArray(e)?e[t]?`var(--wui-spacing-${e[t]})`:void 0:"string"==typeof e?`var(--wui-spacing-${e})`:void 0,getFormattedDate:e=>new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e),getHostName(e){try{return new URL(e).hostname}catch(t){return""}},getTruncateString:({string:e,charsStart:t,charsEnd:a,truncate:r})=>e.length<=t+a?e:"end"===r?`${e.substring(0,t)}...`:"start"===r?`...${e.substring(e.length-a)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(a))}`,generateAvatarColors(e){const t=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),a=this.hexToRgb(t),r=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),o=100-3*Number(r?.replace("px","")),s=`${o}% ${o}% at 65% 40%`,n=[];for(let i=0;i<5;i+=1){const e=this.tintColor(a,.15*i);n.push(`rgb(${e[0]}, ${e[1]}, ${e[2]})`)}return`\n    --local-color-1: ${n[0]};\n    --local-color-2: ${n[1]};\n    --local-color-3: ${n[2]};\n    --local-color-4: ${n[3]};\n    --local-color-5: ${n[4]};\n    --local-radial-circle: ${s}\n   `},hexToRgb(e){const t=parseInt(e,16);return[t>>16&255,t>>8&255,255&t]},tintColor(e,t){const[a,r,o]=e;return[Math.round(a+(255-a)*t),Math.round(r+(255-r)*t),Math.round(o+(255-o)*t)]},isNumber:e=>/^[0-9]+$/u.test(e),getColorTheme:e=>e||("undefined"!=typeof window&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark"),splitBalance(e){const t=e.split(".");return 2===t.length?[t[0],t[1]]:["0","00"]},roundNumber:(e,t,a)=>e.toString().length>=t?Number(e).toFixed(a):e,formatNumberToLocalString:(e,t=2)=>void 0===e?"0.00":"number"==typeof e?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})};function Ot(e){return function(t){return"function"==typeof t?function(e,t){return customElements.get(e)||customElements.define(e,t),t}(e,t):function(e,t){const{kind:a,elements:r}=t;return{kind:a,elements:r,finisher(t){customElements.get(e)||customElements.define(e,t)}}}(e,t)}}var Rt={ACCOUNT_TABS:[{label:"Tokens"},{label:"NFTs"},{label:"Activity"}],SECURE_SITE_ORIGIN:("undefined"!=typeof process?{}.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",VIEW_DIRECTION:{Next:"next",Prev:"prev"},DEFAULT_CONNECT_METHOD_ORDER:["email","social","wallet"],ANIMATION_DURATIONS:{HeaderText:120,ModalHeight:150,ViewTransition:150}};export{se as A,Pe as C,be as D,ke as E,f as F,h as I,p as L,re as M,ae as N,ue as O,b as P,g as R,De as S,Ee as T,Je as _,_t as a,je as b,Et as c,bt as d,gt as f,et as g,at as h,Ut as i,oe as j,ne as k,St as l,nt as m,Ot as n,It as o,ut as p,Pt as r,Tt as s,Rt as t,yt as u,qe as v,xe as w,Le as x,Ve as y,m as z};
//# sourceMappingURL=ConstantsUtil-DVCzMna8.js.map
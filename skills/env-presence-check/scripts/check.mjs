import {open} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const MAX_BYTES=1024*1024, keyPattern=/^[A-Z][A-Z0-9_]{0,63}$/;
const fail=code=>{const error=new Error(code);error.publicCode=code;throw error;};

export function validateContract(input){
 if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).some(k=>!['required','optional'].includes(k)))fail('CONTRACT_INVALID');
 const required=input.required,optional=input.optional??[];
 if(!Array.isArray(required)||!Array.isArray(optional))fail('CONTRACT_INVALID');
 const names=[...required,...optional];
 if(names.length<1||names.length>128||names.some(k=>typeof k!=='string'||!keyPattern.test(k))||new Set(names).size!==names.length)fail('CONTRACT_INVALID');
 return {required:[...required],optional:[...optional]};
}

export function parseEnvironment(text){
 const values=new Map();
 for(const raw of text.replace(/^\uFEFF/,'').split(/\r?\n/)){
  const line=raw.trim();if(!line||line.startsWith('#'))continue;
  if(line.length>65536||line.includes('\0'))fail('ENV_SYNTAX_UNSUPPORTED');
  const match=line.match(/^(?:export\s+)?([A-Z][A-Z0-9_]{0,63})\s*=\s*(.*)$/);if(!match)fail('ENV_SYNTAX_UNSUPPORTED');
  const name=match[1];if(values.has(name))fail('ENV_DUPLICATE_KEY');let value=match[2];
  if(value.startsWith('"')||value.startsWith("'")){
   const quote=value[0],end=value.lastIndexOf(quote);
   if(end===0||!/^\s*(?:#.*)?$/.test(value.slice(end+1)))fail('ENV_SYNTAX_UNSUPPORTED');
   value=value.slice(1,end);if(value.includes(quote)||value.includes('\\'))fail('ENV_SYNTAX_UNSUPPORTED');
  }else{value=value.split('#')[0].trim();if(/["']/.test(value))fail('ENV_SYNTAX_UNSUPPORTED');}
  values.set(name,value);
 }
 return values;
}

export function diagnose(contractInput,lookup,source){
 const contract=validateContract(contractInput);if(!['file','process'].includes(source)||typeof lookup!=='function')fail('INPUT_INVALID');
 const records=[];
 for(const [required,names] of [[true,contract.required],[false,contract.optional]])for(const name of names){
  const value=lookup(name);let state;
  if(value===undefined)state='MISSING';else if(typeof value!=='string')fail('INPUT_INVALID');
  else if(!value.trim())state='EMPTY';else if(source==='file'&&/\$(?:[A-Za-z_]|\{)/.test(value))state='UNRESOLVED';else state='PRESENT';
  records.push({name,required,state});
 }
 const passed=records.every(r=>!r.required||r.state==='PRESENT');
 return {schemaVersion:1,evidence:source==='file'?'FILE_PRESENCE_INSPECTION':'SELECTED_PROCESS_KEYS_INSPECTION',source,passed,records,counts:{required:contract.required.length,optional:contract.optional.length,missing:records.filter(x=>x.state==='MISSING').length,empty:records.filter(x=>x.state==='EMPTY').length,unresolved:records.filter(x=>x.state==='UNRESOLVED').length},limitations:['Presence does not establish valid values, authentication, connectivity or deployment readiness','Names themselves may be sensitive; review before sharing','File mode does not evaluate substitutions, full dotenv syntax or Compose precedence']};
}

async function readBounded(path){
 const handle=await open(path,'r');try{
  if(!(await handle.stat()).isFile())fail('INPUT_NOT_REGULAR_FILE');
  const buffer=Buffer.alloc(MAX_BYTES+1);let total=0;
  while(total<buffer.length){const {bytesRead}=await handle.read(buffer,total,buffer.length-total,total);if(!bytesRead)break;total+=bytesRead;}
  if(total>MAX_BYTES)fail('INPUT_TOO_LARGE');
  return new TextDecoder('utf-8',{fatal:true}).decode(buffer.subarray(0,total));
 }finally{await handle.close();}
}

export async function main(args,environment=process.env){
 if(args.length===1&&args[0]==='--help')return {help:'node check.mjs --contract CONTRACT.json (--env-file FILE | --process)',exitCode:0};
 if(args[0]!=='--contract'||!args[1]||!((args.length===4&&args[2]==='--env-file'&&args[3])||(args.length===3&&args[2]==='--process')))fail('USAGE');
 let contract;try{contract=JSON.parse(await readBounded(args[1]));}catch(error){if(error.publicCode)throw error;if(error instanceof SyntaxError)fail('CONTRACT_JSON_INVALID');throw error;}
 contract=validateContract(contract);
 const processMode=args[2]==='--process';let lookup;
 if(processMode)lookup=name=>Object.hasOwn(environment,name)?environment[name]:undefined;
 else{const values=parseEnvironment(await readBounded(args[3]));lookup=name=>values.get(name);}
 const report=diagnose(contract,lookup,processMode?'process':'file');return {report,exitCode:report.passed?0:1};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 try{const result=await main(process.argv.slice(2));console.log(JSON.stringify(result.report??{usage:result.help},null,2));process.exitCode=result.exitCode;}
 catch(error){console.error(JSON.stringify({error:error.publicCode||'INPUT_READ_FAILED',evidence:'ENVIRONMENT_OR_INPUT_ERROR'}));process.exitCode=2;}
}

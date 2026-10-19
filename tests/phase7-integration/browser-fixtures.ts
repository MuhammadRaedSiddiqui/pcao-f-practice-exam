// Controlled test fixtures only, exposed by the excluded loopback configuration.
import {catalog} from 'virtual:phase7-catalog';
import {startSession,applyCommand} from '../../src/domain/guided/session';
import {createAttempt,submitAttempt} from '../../src/domain/attemptModel';
import {validateQuestionBank} from '../../src/domain/bankValidation';
import type {GuidedResult} from '../../src/domain/guided/errors';
const take=<T>(r:GuidedResult<T>):T=>{if(!r.ok)throw Error(r.code);return r.value;};
async function bank(){const v=validateQuestionBank(await(await fetch('/easy-question-bank.json')).json());if(!v.ok)throw Error('bank');return v.bank;}
export async function legacySession(){const b=await bank(),release=await(await fetch('/guided/intermediate-1.0.0.json')).json(),now=Date.now();let s=take(await startSession({kind:'standalone',bank:b,difficulty:'intermediate',selectionSize:5,setIndex:0,id:crypto.randomUUID(),now},release,catalog));const q=s.items[0].question;
 for(let h=0;h<2;h++)s=take(applyCommand(s,{kind:'revealNextHint',questionId:q.id},s.revision,Date.now())).session;
 s=take(applyCommand(s,{kind:'select',questionId:q.id,ids:q.correctOptionIds},s.revision,Date.now())).session;
 return take(applyCommand(s,{kind:'commit',questionId:q.id,commandId:crypto.randomUUID()},s.revision,Date.now())).session;
}
export async function actualReport(){const b=await bank(),now=Date.now(),attempt=createAttempt(b,now-1000,'phase7-controlled-ui-report');attempt.answers.Q1=b.questions[0].correctOptionIds;attempt.flags=['Q4','Q26'];return submitAttempt(attempt,now);}
export {catalog};

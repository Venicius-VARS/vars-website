export const keys=['food','joy','clean','sleep'];
export const rates={food:8,joy:6,clean:4,energy:7,sleepRecovery:200};
export const clamp=n=>Math.max(0,Math.min(100,n));
export function fresh(){return {food:80,joy:80,clean:80,energy:80,sleeping:false,updatedAt:Date.now(),careCount:0,ageSeconds:0,busy:0,activity:4,actionAt:0,notice:'welcome',ack:{food:0,joy:0,clean:0,sleep:0}};}
export function normalize(s){return {...fresh(),...s,busy:0};}
export function advance(s,elapsed){
  if(!Number.isFinite(elapsed)||elapsed<=0)return s;
  elapsed=Math.min(elapsed,604800);s.ageSeconds=(s.ageSeconds||0)+elapsed;s.busy=Math.max(0,(s.busy||0)-elapsed);
  while(elapsed>0){let seconds=Math.min(elapsed,60);if(s.sleeping&&s.energy<100)seconds=Math.min(seconds,(100-s.energy)*3600/rates.sleepRecovery);if(seconds<0.001){if(s.sleeping&&s.energy>99.99){s.energy=100;s.sleeping=false;continue;}break;}const h=seconds/3600,low=s.food<25||s.energy<20||s.clean<25;
    s.food=clamp(s.food-8*h*(s.sleeping?0.35:1));s.joy=clamp(s.joy-(s.sleeping?0:6*h*(low?1.8:1)));s.clean=clamp(s.clean-4*h*(s.sleeping?0.25:1));s.energy=clamp(s.energy+h*(s.sleeping?rates.sleepRecovery:-7));if(s.sleeping&&s.energy>=99.999){s.energy=100;s.sleeping=false;}elapsed-=seconds;
  }return s;
}
export function act(s,key,now=Date.now()){
  const action=keys.indexOf(key);if(action<0)return 2;if(s.busy>0.01)return 0;
  const reason=s.sleeping&&action!==3?'sleeping':action===0&&s.food>=95?'full':action===1&&s.energy<20?'tired':action===1&&s.food<15?'hungry':action===2&&s.clean>=95?'alreadyClean':action===3&&!s.sleeping&&s.energy>=98?'rested':null;
  s.actionAt=now;s.activity=action;s.notice=reason||'ok';s.busy=reason?2.5:6.5;
  if(reason){s.activity=6;return 2;}s.careCount=(s.careCount||0)+1;
  if(action===0){s.food=clamp(s.food+25);s.joy=clamp(s.joy+3);s.energy=clamp(s.energy+2);s.clean=clamp(s.clean-3);}
  if(action===1){s.joy=clamp(s.joy+22);s.energy=clamp(s.energy-8);s.food=clamp(s.food-5);s.clean=clamp(s.clean-3);}
  if(action===2){s.clean=clamp(s.clean+40);s.joy=clamp(s.joy+5);}
  if(action===3){s.sleeping=!s.sleeping;s.activity=s.sleeping?3:5;}return 1;
}
export const notices={welcome:'Croac! Que bom ter você por perto.',ok:'Croac! Obrigado pelo carinho.',full:'Minha barriguinha já está cheia!',sleeping:'Zzz… acorde o Pingo antes de cuidar dele.',tired:'Estou cansadinho. Preciso dormir primeiro.',hungry:'Uma comidinha antes de brincar?',alreadyClean:'Já estou limpinho!',rested:'Já estou descansado. Vamos brincar?'};
export function mood(s,now=Date.now()){
  if(s.activity===6&&now-s.actionAt<6500)return notices[s.notice]||'Um cuidado por vez.';
  if(s.sleeping)return 'Sonhando com uma lagoa cheia de estrelas…';
  if(s.energy<20)return 'Meus olhinhos estão ficando pesados.';
  if(s.food<25)return 'Croac… minha barriguinha está roncando.';
  if(s.clean<25)return 'Acho que estou precisando de um banho.';
  if(s.joy<25)return 'Pula comigo? Estou com saudade de brincar.';
  return now-s.actionAt<6500?['Nham! Uma mosquinha deliciosa.','Olha só esse pulo!','Bolhinhas, bolhinhas por todo lado.','Boa noite…','Croac!','Bom dia! Que soninho gostoso.'][s.activity]||notices.ok:notices.welcome;
}

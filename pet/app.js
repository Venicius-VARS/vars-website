import {firebaseConfig} from './config.js';
import {fresh,normalize,advance,act,keys,mood,notices} from './model.js';
import {drawFrog} from './frog.js?v=0.2.2';
import {createPresentation} from './presentation.js?v=0.2.3';
const presentation=createPresentation();
const $=id=>document.getElementById(id);
let state=fresh(),user=null,api=null,unsubscribe=null,deviceUid='',mobileUid='',haveState=false,demo=false,waiting=null,loading=true,transportError='',lastTick=Date.now();
const labels={food:'Saciedade',joy:'Felicidade',clean:'Higiene',energy:'Energia'};
for(const [key,label] of Object.entries(labels)){const box=document.createElement('div');box.innerHTML=`<div class="meter-label"><label for="${key}">${label}</label><span id="${key}Value"></span></div><progress id="${key}" max="100" value="80"></progress>`;$('meters').append(box);}
function status(text){$('settingsStatus').textContent=text;}
function render(){
  const now=Date.now(),online=haveState&&now-state.updatedAt<45000;
  $('userEmail').textContent=user?.email||'';$('settingsButton').textContent=user?'Desconectar':'Conexão';$('pairSettings').hidden=!user;
  $('unpairMobile').hidden=!user||!mobileUid;$('mobileStatus').textContent=mobileUid?'Android vinculado. Você pode remover o acesso aqui.':'';$('login').hidden=!!user;$('login').disabled=loading;$('pairFields').hidden=!user;$('demoButton').hidden=!!user||demo;
  for(const key of Object.keys(labels)){$(key).value=state[key];$(key).classList.toggle('low',state[key]<25);$(key+'Value').textContent=haveState||demo?Math.round(state[key])+'%':'—';}
  let message='Entre com Google para cuidar do mesmo sapinho que vive no seu ESP32.';
  if(user){
    $('connection').textContent=!deviceUid?'Vincule seu ESP32':!haveState?'Aguardando ESP32':online?'ESP32 conectado':'ESP32 desconectado';
    message=!deviceUid?'Abra Vincular ESP32 para conectar seu bichinho.':!haveState?'Placa vinculada. Aguardando o primeiro estado real do ESP32.':online?'Este é o mesmo Pingo da sua placa. Todo cuidado é confirmado pelo ESP32.':'Mostrando o último estado real. A placa está desconectada; cuidados aguardam sua reconexão.';
    if(waiting)message=online?'Cuidado enviado. Aguardando confirmação do ESP32…':'Cuidado enviado e pendente. Será aplicado quando o ESP32 reconectar.';
  }else $('connection').textContent=demo?'Demonstração local':'Entre para cuidar';
  if(demo)message='Demonstração separada, salva só neste navegador. Entre com Google para cuidar do ESP32.';
  if(transportError)message=transportError;
  $('message').textContent=message;
  $('mood').textContent=user&&!haveState?'Seu sapinho está na placa. Aguardando conexão…':mood(demo?state:presentation.view(state),now);
  document.querySelector('[data-action="sleep"]').lastChild.textContent=state.sleeping?'Acordar':'Dormir';
  const cooling=demo?state.busy>0.01:haveState&&presentation.active();
  document.querySelectorAll('[data-action]').forEach(b=>b.disabled=!!waiting||cooling||(!demo&&(!user||!deviceUid||!haveState)));
  $('careCount').textContent=haveState||demo?`${state.careCount||0} cuidados recebidos`:'Um sapinho. Na tela e na sua mesa.';
}
const ctx=$('pet').getContext('2d');function animate(t){drawFrog(ctx,demo?state:presentation.view(state),t);requestAnimationFrame(animate);}requestAnimationFrame(animate);
$('settingsButton').onclick=async()=>{if(user){try{await api.signOut(api.auth);}catch(e){transportError='Não foi possível sair: '+e.message;render();}}else $('settings').showModal();};
$('pairSettings').onclick=()=>$('settings').showModal();
$('demoButton').onclick=()=>{demo=true;state=fresh();try{const saved=JSON.parse(localStorage.getItem('vars-pet-frog-demo'));if(saved&&Object.keys(labels).every(k=>Number.isFinite(saved[k]))){state=normalize(saved);advance(state,(Date.now()-saved.updatedAt)/1000);}}catch{}render();};
async function setupFirebase(){
  try{
    const [app,auth,db]=await Promise.all([import('https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js')]);
    const instance=app.initializeApp(firebaseConfig);api={...auth,...db,auth:auth.getAuth(instance),db:db.getDatabase(instance)};
    auth.onAuthStateChanged(api.auth,u=>{
      unsubscribe?.();unsubscribe=null;presentation.reset();user=u;loading=false;waiting=null;haveState=false;deviceUid='';mobileUid='';demo=false;state=fresh();transportError='';$('account').textContent=u?u.email:'';
      status(u?`Sua identificação: ${u.uid}`:'Entre com Google para conectar o sapinho da sua placa.');render();
      if(!u)return;
      unsubscribe=db.onValue(db.ref(api.db,`pets/${u.uid}`),snap=>{
        const value=snap.val();deviceUid=value?.deviceUid||'';$('device').value=deviceUid;mobileUid=value?.mobileUid||'';if(mobileUid)$('mobile').value=mobileUid;
        if(value?.state&&Object.keys(labels).every(k=>Number.isFinite(value.state[k]))){state=normalize(value.state);presentation.receive(state);haveState=true;if(waiting&&(state.ack?.[waiting.action]||0)>=waiting.expected){waiting=null;transportError='';}}
        else haveState=false;
        render();
      },e=>{transportError='Não foi possível sincronizar: '+e.message;render();});
    });
  }catch(e){loading=false;transportError='Falha na conexão: '+e.message;status(transportError);render();}
}
$('login').onclick=async()=>{if(!api)return;status('Abrindo login com Google…');try{await api.signInWithPopup(api.auth,new api.GoogleAuthProvider());}catch(e){status('Login não concluído: '+e.message);}};
$('pair').onclick=async()=>{if(!user)return;const uid=$('device').value.trim();if(!/^[A-Za-z0-9_-]{20,128}$/.test(uid))return status('Confira o identificador exibido pela placa.');try{await api.set(api.ref(api.db,`pets/${user.uid}/deviceUid`),uid);status(`Placa vinculada. Sua identificação: ${user.uid}`);}catch(e){status('Não foi possível vincular: '+e.message);}};
document.querySelectorAll('[data-action]').forEach(button=>button.onclick=async()=>{
  const action=button.dataset.action;if(waiting)return;
  if(demo&&!user){act(state,action);render();return;}
  if(!user||!deviceUid||!haveState)return;
  transportError='';waiting={action,expected:Infinity};render();
  try{const result=await api.runTransaction(api.ref(api.db,`pets/${user.uid}/commands/${action}`),value=>(Number.isSafeInteger(value)?value:0)+1);waiting={action,expected:result.snapshot.val()};if((state.ack?.[action]||0)>=waiting.expected)waiting=null;render();}
  catch(e){waiting=null;transportError='Cuidado não enviado: '+e.message;render();}
});
setInterval(()=>{const now=Date.now();if(demo&&!user){advance(state,(now-lastTick)/1000);state.updatedAt=now;localStorage.setItem('vars-pet-frog-demo',JSON.stringify(state));}lastTick=now;render();},500);
render();setupFirebase();

$('pairMobile').onclick=async()=>{
  if(!user)return;const uid=$('mobile').value.trim();
  if(!/^[A-Za-z0-9_-]{20,128}$/.test(uid))return status('Confira o código exibido em Conexão no aplicativo Android.');
  try{
    const changes={};if(mobileUid&&mobileUid!==uid)changes[`mobileLinks/${mobileUid}`]=null;
    changes[`pets/${user.uid}/mobileUid`]=uid;changes[`mobileLinks/${uid}`]=user.uid;
    await api.update(api.ref(api.db),changes);status('Android vinculado. No aplicativo, escolha Usar Pingo do ESP32.');
  }catch(e){status('Não foi possível vincular o Android: '+e.message);}
};
$('unpairMobile').onclick=async()=>{
  if(!user||!mobileUid)return;
  try{const changes={};changes[`pets/${user.uid}/mobileUid`]=null;changes[`mobileLinks/${mobileUid}`]=null;await api.update(api.ref(api.db),changes);$('mobile').value='';status('Acesso do Android removido.');}
  catch(e){status('Não foi possível remover o Android: '+e.message);}
};

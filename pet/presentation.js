// Replay confirmed care locally. Device/browser wall clocks may disagree, and
// network delivery can consume a short animation before the browser sees it.
export function createPresentation(){
  let lastKey=null,started=0,duration=0;
  return {
    reset(){lastKey=null;started=0;duration=0;},
    receive(s,now=performance.now()){
      const key=JSON.stringify([s.actionAt,s.activity,s.careCount,s.notice,s.ack]);
      if(key===lastKey)return;
      const first=lastKey===null;lastKey=key;
      const age=Number(s.updatedAt)-Number(s.actionAt);
      const length=s.activity===6?2500:6500;
      duration=0;
      if(s.actionAt>0&&Number.isFinite(age)&&age>=0){
        // First load only resumes a still-active animation. Newly delivered
        // confirmations get their full animation, including delayed responses.
        if(first&&age<length)duration=length-age;
        else if(!first&&age<30000)duration=length;
      }
      started=now;
    },
    active(now=performance.now()){return duration>0&&now-started<duration;},
    view(s,now=performance.now(),wallNow=Date.now()){
      const active=this.active(now);
      return {...s,activity:active?s.activity:(s.sleeping?3:4),actionAt:active?wallNow-Math.max(0,now-started):0};
    }
  };
}

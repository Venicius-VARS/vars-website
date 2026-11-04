export const keys=['food','joy','clean','sleep'];
export function fresh(){return {food:80,joy:80,clean:80,energy:80,sleeping:false,updatedAt:Date.now()};}
export function advance(s,seconds){seconds=Math.max(0,Math.min(seconds,604800));s.food=Math.max(0,s.food-seconds/1800);s.joy=Math.max(0,s.joy-seconds/2400);s.clean=Math.max(0,s.clean-seconds/3600);s.energy=Math.max(0,Math.min(100,s.energy+seconds*(s.sleeping?1/120:-1/2400)));if(s.energy>=100)s.sleeping=false;return s;}
export function act(s,a){if(a==='food'){s.food=Math.min(100,s.food+20);s.clean=Math.max(0,s.clean-2);}if(a==='joy'){s.joy=Math.min(100,s.joy+20);s.energy=Math.max(0,s.energy-5);s.sleeping=false;}if(a==='clean')s.clean=Math.min(100,s.clean+30);if(a==='sleep')s.sleeping=!s.sleeping;return s;}

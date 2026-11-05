// Original vector artwork and animations for Pingo. No third-party sprites.
export function drawFrog(ctx,s,t,now=Date.now()){
  ctx.clearRect(0,0,320,200);
  const active=now-(s.actionAt||0)<6500,mode=active?s.activity:(s.sleeping?3:4);
  const jump=mode===1?Math.abs(Math.sin(t/230))*25:0;
  const bob=mode===3?Math.sin(t/800)*1.5:Math.sin(t/470)*2;
  const shake=mode===6?Math.sin(t/65)*3:0;
  const x=160+shake,y=117-jump+bob;
  const ellipse=(x,y,rx,ry,color)=>{ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();};
  const circle=(x,y,r,color)=>ellipse(x,y,r,r,color);
  const line=(x1,y1,x2,y2,color,width=2)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();};
  ellipse(160,163,63,12,'#2e3a4f');ellipse(160,163,46,6,'#1f242b');
  // Tiny ripples and fireflies stay within the VARS neutral/blue palette.
  ctx.strokeStyle='#9aa0a650';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(160,164,70+Math.sin(t/1000)*4,16,0,0,Math.PI*2);ctx.stroke();
  for(let i=0;i<5;i++)circle(35+i*62,35+Math.sin(t/1500+i)*7,1.2,'#f6f7f980');
  ctx.save();ctx.translate(x,y);
  ellipse(-34,28,19,12,'#28643c');ellipse(34,28,19,12,'#28643c');
  ellipse(0,17,37,31,'#469c4a');ellipse(0,22,24,21,'#b7da78');
  ellipse(-35,37,17,6,'#75bc55');ellipse(35,37,17,6,'#75bc55');
  ellipse(0,-3,47,31,'#244e35');ellipse(0,-5,45,30,'#75bc55');
  for(const side of [-1,1]){
    circle(side*24,-29,20,'#244e35');circle(side*24,-30,18,'#75bc55');
    const blink=mode===3||(t%6100<150);
    if(blink){line(side*24-10,-30,side*24-5,-27,'#244e35',2.5);line(side*24-5,-27,side*24+5,-27,'#244e35',2.5);line(side*24+5,-27,side*24+10,-30,'#244e35',2.5);}
    else {circle(side*24,-31,13.5,'#f6f7f9');const look=Math.sin(t/1900)*2;circle(side*24+look,-29,8.5,'#0b0b0d');circle(side*24+look-3,-33,3.2,'#fff');circle(side*24+look+4,-25,1.3,'#fff');}
  }
  ellipse(-30,1,7,3,'#b21e2e65');ellipse(30,1,7,3,'#b21e2e65');circle(-7,-5,1.6,'#28643c');circle(7,-5,1.6,'#28643c');
  if(mode===0){const reach=Math.max(0,Math.sin(t/330));line(0,9,-65*reach,4-15*reach,'#dd8190',4);circle(-65, -10+Math.sin(t/130)*3,4,'#9aa0a6');ellipse(-69,-16,4,2,'#f6f7f9');ellipse(-61,-16,4,2,'#f6f7f9');circle(0,9,5,'#244e35');}
  else if(mode===5){ellipse(0,10,7,9,'#244e35');line(-33,13,-50,Math.sin(t/300)*7,'#75bc55',7);line(33,13,50,Math.sin(t/300)*7,'#75bc55',7);}
  else {ctx.strokeStyle='#244e35';ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(0,4,12,0.2,Math.PI-0.2);ctx.stroke();}
  if(mode===2){for(let i=0;i<7;i++){const bx=-40+i*13,by=-48+Math.sin(t/350+i)*6;circle(bx,by,6+(i%3),'#f6f7f9');}for(let i=0;i<8;i++){const bx=Math.sin(i*4.2)*65,by=35-((t/25+i*17)%90);ctx.strokeStyle='#f6f7f9bb';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(bx,by,3+i%4,0,Math.PI*2);ctx.stroke();}}
  if(mode===1){const bx=60+Math.sin(t/280)*9,by=28-Math.abs(Math.cos(t/260))*23;circle(bx,by,10,'#b21e2e');line(bx-7,by,bx+7,by,'#f6f7f9');}
  if(mode===3){ctx.font='16px Montserrat,sans-serif';ctx.fillStyle='#f6f7f9';ctx.fillText('z',49,-30-Math.sin(t/900)*5);ctx.font='21px Montserrat,sans-serif';ctx.fillText('Z',65,-48-Math.sin(t/900)*7);}
  if(mode===6){ctx.fillStyle='#f6f7f9';ctx.font='bold 18px sans-serif';ctx.fillText('…',53,-35);}
  ctx.restore();
}

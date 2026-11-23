async (page) => {
  const names=(await (await page.request.get('http://localhost:8098/list.txt')).text()).trim().split('\n');
  await page.goto('http://localhost:8098/list.txt');
  await page.setViewportSize({width:1640,height:1790});
  const out=[];
  for(const n of names){
    out.push(await page.evaluate(async n=>{
      const load=async p=>{const i=new Image();i.src=`/${p}/${n}?${Math.random()}`;await i.decode();const c=document.createElement('canvas');c.width=402;c.height=874;const x=c.getContext('2d');x.drawImage(i,0,0);return x.getImageData(0,0,402,874).data};
      const a=await load('ref'),b=await load('app');let c=0,t=0,first=null,last=0;
      for(let y=56;y<840;y++)for(let x=0;x<392;x++){const k=(y*402+x)*4;t++;if(Math.abs(a[k]-b[k])+Math.abs(a[k+1]-b[k+1])+Math.abs(a[k+2]-b[k+2])>60){c++;first??=y;last=y}}
      return `${n} ${(100*c/t).toFixed(2)}% y:${first}-${last}`;},n).catch(e=>n+' ERR '+e.message.slice(0,60)));
  }
  return out.join('\n');
}

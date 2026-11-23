async (page) => {
  const groups=[['01-resumen','10-resumen-oscuro'],['11-detalle','15-pdf'],['24-form-ia','23-leyendo'],['09-ajustes-oscuro','12-detalle-fin'],['13-extender','21-camara']];
  await page.goto('http://localhost:8098/list.txt');
  let i=0;
  for(const g of groups){
    await page.setViewportSize({width:1218,height:1760});
    await page.setContent('<body style="margin:0;display:grid;grid-template-columns:repeat(3,402px);gap:6px">'+g.map(n=>`<img src="http://localhost:8098/ref/${n}.png?${Math.random()}"><img src="http://localhost:8098/app/${n}.png?${Math.random()}"><div style="position:relative;width:402px;height:874px;isolation:isolate"><img style="position:absolute" src="http://localhost:8098/ref/${n}.png?2${Math.random()}"><img style="position:absolute;mix-blend-mode:difference" src="http://localhost:8098/app/${n}.png?2${Math.random()}"></div>`).join('')+'</body>');
    await page.waitForTimeout(900); await page.screenshot({path:`playwright/side-${i++}.png`});
  }
}

// Interface preferences only: connect these to an audio player.
const $ = selector => document.querySelector(selector);
const defaults = {eq:true,preset:'balanced',bands:[0,0,0,0,0],quality:'high',normalize:true,gapless:true,crossfade:4};
const profiles = {balanced:[0,0,0,0,0],bass:[6,4,0,-1,-2],vocal:[-2,-1,4,3,1],night:[2,1,-1,1,2]};
let state = structuredClone(defaults);
try {
 const saved = JSON.parse(localStorage.getItem('loud-audio-settings'));
 if(saved && typeof saved === 'object') {
  for(const key of ['eq','normalize','gapless']) if(typeof saved[key] === 'boolean') state[key]=saved[key];
  if(['balanced','bass','vocal','night','custom'].includes(saved.preset)) state.preset=saved.preset;
  if(['standard','high','very-high'].includes(saved.quality)) state.quality=saved.quality;
  if(Array.isArray(saved.bands) && saved.bands.length===5 && saved.bands.every(n=>Number.isInteger(n)&&n>=-6&&n<=6)) state.bands=saved.bands;
  if(Number.isInteger(saved.crossfade)&&saved.crossfade>=0&&saved.crossfade<=12) state.crossfade=saved.crossfade;
 }
} catch { /* Browser storage may be unavailable. */ }
['60 Hz','230 Hz','910 Hz','4 kHz','14 kHz'].forEach((frequency,i)=>{
 const band = document.createElement('div');band.className='band';
 band.innerHTML=`<output id="value-${i}" for="band-${i}">0</output><input id="band-${i}" type="range" min="-6" max="6" step="1" value="0" aria-label="${frequency}, gain in decibels"><label for="band-${i}">${frequency}</label>`;
 $('#bands').append(band);
 band.querySelector('input').addEventListener('input',event=>{state.bands[i]=Number(event.target.value);state.preset='custom';render();save();});
});
function save(){
 try {localStorage.setItem('loud-audio-settings',JSON.stringify(state));$('#status').textContent='Settings saved on this device.';}
 catch {$('#status').textContent='Settings applied for this visit only.';}
}
function render(){
 for(const [id,key] of [['eq-switch','eq'],['normalize','normalize'],['gapless','gapless']]) $('#'+id).setAttribute('aria-checked',String(state[key]));
 $('#bands').disabled=!state.eq;$('#preset').disabled=!state.eq;$('#preset').value=state.preset;$('#quality').value=state.quality;
 state.bands.forEach((value,i)=>{$('#band-'+i).value=value;$('#value-'+i).value=(value>0?'+':'')+value;$('#band-'+i).setAttribute('aria-valuetext',value+' decibels');});
 $('#crossfade').value=state.crossfade;$('#crossfade').style.setProperty('--position',state.crossfade/12*100+'%');
 $('#fade-value').value=state.crossfade===0?'Off':state.crossfade+' s';
}
for(const [id,key] of [['eq-switch','eq'],['normalize','normalize'],['gapless','gapless']]) $('#'+id).addEventListener('click',()=>{state[key]=!state[key];render();save();});
$('#preset').addEventListener('change',event=>{state.preset=event.target.value;if(profiles[state.preset])state.bands=[...profiles[state.preset]];render();save();});
$('#quality').addEventListener('change',event=>{state.quality=event.target.value;save();});
$('#crossfade').addEventListener('input',event=>{state.crossfade=Number(event.target.value);render();save();});
$('#reset').addEventListener('click',()=>{state=structuredClone(defaults);render();save();$('#status').textContent='Default settings restored.';});
$('#settings').addEventListener('submit',event=>event.preventDefault());
render();

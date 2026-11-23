// Démonstration de l’interface : aucun fichier audio n’est inclus.
const initialTracks = [
  {id:'chemical',title:'Chemical',artist:'Post Malone',cover:'chemical.jpg',duration:184},
  {id:'tears',title:'Save Your Tears',artist:'The Weeknd',cover:'the-weeknd.jpg',duration:215},
  {id:'snooze',title:'Snooze',artist:'SZA',cover:'snooze.jpeg',duration:201},
  {id:'ocean',title:'OCEAN EYES',artist:'Billie Eilish',cover:'ocean-eyes.jpg',duration:333},
  {id:'petals',title:'Petals',artist:'Ariana Grande',cover:'petals.jpg',duration:180},
  {id:'birds',title:'BIRDS OF A FEATHER',artist:'Billie Eilish',cover:'hit-me-hard-and-soft.jpg',duration:210}
];
const $ = selector => document.querySelector(selector);
let current = initialTracks[0], queue = initialTracks.slice(1), playing = true, autoplay = true;
let draggedId = null, toastTimer;
const formatTime = value => `${Math.floor(value / 60)}:${String(value % 60).padStart(2,'0')}`;
function announce(message) {
  $('#status').textContent = message;
  $('#toast').textContent = message;
  $('#toast').hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 2800);
}
function updateProgress() {
  const input = $('#progress');
  input.style.setProperty('--position', `${Number(input.value) / Number(input.max) * 100}%`);
  $('#elapsed').textContent = formatTime(Number(input.value));
}
function updatePlay() {
  $('#play').setAttribute('aria-pressed', String(playing));
  $('#play').setAttribute('aria-label', playing ? 'Pause' : 'Resume playback');
  $('#play span').textContent = playing ? 'Ⅱ' : '▶';
  $('.player').classList.toggle('paused', !playing);
}
function selectTrack(id) {
  const index = queue.findIndex(track => track.id === id);
  if(index < 0) return;
  current = queue.splice(index, 1)[0];
  $('#current-cover').src = `assets/${current.cover}`;
  $('#current-cover').alt = `${current.title} cover art`;
  $('#current-title').textContent = current.title;
  $('#current-artist').textContent = current.artist;
  $('#progress').max = current.duration;
  $('#progress').value = 0;
  $('#duration').textContent = formatTime(current.duration);
  playing = true;
  updatePlay(); updateProgress(); renderQueue();
  announce(`${current.title} selected — simulated playback`);
}
function moveTrack(id, targetId) {
  const from = queue.findIndex(t => t.id === id);
  const to = queue.findIndex(t => t.id === targetId);
  if(from < 0 || to < 0 || from === to) return;
  const [track] = queue.splice(from, 1);
  queue.splice(to, 0, track);
  renderQueue();
  announce('Queue order updated');
}
function renderQueue() {
  $('#tracks').replaceChildren();
  $('#empty').hidden = queue.length > 0;
  $('#clear').disabled = queue.length === 0;
  queue.forEach((track, index) => {
    const li = document.createElement('li');
    li.className = 'track'; li.draggable = true;
    li.innerHTML = `<img src="assets/${track.cover}" alt="${track.title} cover art" draggable="false"><button class="track-select" aria-label="Select ${track.title}"><span class="track-title">${track.title}</span><span class="track-artist">${track.artist}</span></button><span class="track-time">${formatTime(track.duration)}</span><button class="reorder" aria-label="Move ${track.title} up" title="Click to move up · Drag to reorder">☰</button>`;
    li.querySelector('.track-select').addEventListener('click', () => selectTrack(track.id));
    li.querySelector('.reorder').addEventListener('click', () => {
      if(index === 0) { announce('This track is already first in the queue'); return; }
      moveTrack(track.id, queue[index - 1].id);
      $('#tracks').children[index - 1].querySelector('.reorder').focus();
    });
    li.addEventListener('dragstart', e => {
      draggedId = track.id; e.dataTransfer.setData('text/plain', track.id);
      e.dataTransfer.effectAllowed = 'move'; li.classList.add('dragging');
    });
    li.addEventListener('dragover', e => { e.preventDefault(); li.classList.add('drop-target'); });
    li.addEventListener('dragleave', () => li.classList.remove('drop-target'));
    li.addEventListener('drop', e => { e.preventDefault(); moveTrack(draggedId, track.id); });
    li.addEventListener('dragend', () => { draggedId = null; document.querySelectorAll('.track').forEach(row => row.classList.remove('dragging','drop-target')); });
    $('#tracks').append(li);
  });
}
$('#play').addEventListener('click', () => { playing = !playing; updatePlay(); });
$('#progress').addEventListener('input', updateProgress);
$('#autoplay').addEventListener('click', () => {
  autoplay = !autoplay;
  $('#autoplay').setAttribute('aria-checked', String(autoplay));
});
$('#clear').addEventListener('click', () => { queue = []; renderQueue(); announce('Queue cleared'); });
$('#more').addEventListener('click', () => {
  $('#options').hidden = !$('#options').hidden;
  $('#more').setAttribute('aria-expanded', String(!$('#options').hidden));
});
$('#reset').addEventListener('click', () => {
  queue = initialTracks.slice(); selectTrack('chemical');
  $('#progress').value = 72; updateProgress();
  $('#options').hidden = true; $('#more').setAttribute('aria-expanded','false');
});
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') { $('#options').hidden = true; $('#more').setAttribute('aria-expanded','false'); }
});
setInterval(() => {
  if(!playing) return;
  const progress = $('#progress');
  if(Number(progress.value) < current.duration) { progress.value = Number(progress.value) + 1; updateProgress(); }
  else if(autoplay && queue.length) selectTrack(queue[0].id);
  else { playing = false; updatePlay(); }
},1000);
renderQueue(); updateProgress(); updatePlay();

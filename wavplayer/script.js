const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const file_input = document.getElementById('filein');
const file_el = document.getElementById('file');
const file_prompt = document.getElementById('prompt');

let wav_bytes = null;
let audio_ctx = null;
let audio_buf = null;
let play_start = 0;
let is_playing = false;

// ── Setup ───────────────────────────────────────────────────
const line_h = 14;
const title_h = 18;

function resize() {
    canvas.width = file_el.offsetWidth;
    canvas.height = file_el.offsetHeight;
}
window.onresize = resize;
resize();

// ── File Logic ──────────────────────────────────────────────
file_el.onclick = () => file_input.click();
file_input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const array_buf = await file.arrayBuffer();
    wav_bytes = new Uint8Array(array_buf);
    
    audio_ctx = new AudioContext();
    audio_buf = await audio_ctx.decodeAudioData(array_buf.slice(0));
    
    file_prompt.style.display = 'none';
    play();
};

function play() {
    const src = audio_ctx.createBufferSource();
    src.buffer = audio_buf;
    src.connect(audio_ctx.destination);
    
    play_start = audio_ctx.currentTime;
    is_playing = true;
    src.start();
    loop();
}

// ── Rendering ───────────────────────────────────────────────
function loop() {
    if (!is_playing) return;

    const elapsed = audio_ctx.currentTime - play_start;
    const progress = Math.min(elapsed / audio_buf.duration, 1);
    
    // Calculate which byte and line we are on
    const current_byte = Math.floor(progress * wav_bytes.length);
    const current_line = Math.floor(current_byte / 16);
    
    // Center the current line in the view
    const scroll_y = (current_line * line_h) - (canvas.height / 2) + (line_h / 2);

    // Clear
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Hex
    ctx.font = '12px monospace';
    ctx.textBaseline = 'top';
    
    const start_row = Math.max(0, Math.floor(scroll_y / line_h));
    const end_row = start_row + Math.ceil(canvas.height / line_h) + 1;

    for (let i = start_row; i <= end_row; i++) {
        if (i * 16 >= wav_bytes.length) break;

        const y = title_h + (i * line_h) - scroll_y;
        if (y < title_h - line_h) continue;

        // Address
        ctx.fillStyle = '#aaa';
        ctx.fillText((i * 16).toString(16).padStart(6, '0').toUpperCase(), 5, y);

        // Bytes
        for (let j = 0; j < 16; j++) {
            const idx = i * 16 + j;
            if (idx >= wav_bytes.length) break;

            const is_active = idx === current_byte;
            ctx.fillStyle = is_active ? 'red' : '#000';
            
            const val = wav_bytes[idx].toString(16).padStart(2, '0').toUpperCase();
            ctx.fillText(val, 60 + (j * 20), y);
        }
    }

    // Title Bar (Drawn last to stay on top)
    ctx.fillStyle = '#000080';
    ctx.fillRect(0, 0, canvas.width, title_h);
    ctx.fillStyle = '#fff';
    ctx.fillText('HEX PLAYER', 5, 3);

    requestAnimationFrame(loop);
}
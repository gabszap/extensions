/**
 * Bot Interativo do Pinboard
 * Resolva problemas no seu canal de backups usando comandos pelo próprio app do Telegram.
 *
 * COMO USAR:
 * 1. Coloque seu TOKEN no arquivo .env: TELEGRAM_BOT_TOKEN=seu_token
 * 2. Abra o terminal nessa pasta e rode: node telegram_bot.js
 * 3. Lá no Telegram, SELECIONE a mensagem com a imagem quebrada/errada e clique em "Responder".
 * 4. Ao responder, envie a IMAGEM CORRETA e digite `/edit` na legenda da foto.
 * -------------------------------------------------------------
 */

const fs   = require('fs');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { spawn, execSync } = require('child_process');

let TOKEN = '';
try {
  const envFile = fs.readFileSync('.env', 'utf8');
  const tokenMatch = envFile.match(/^TELEGRAM_BOT_TOKEN=(.*)$/m);
  if (tokenMatch) TOKEN = tokenMatch[1].trim();
} catch (e) {}

if (!TOKEN || TOKEN === 'YOUR_TOKEN_HERE') {
  console.log("❌ ERRO: Não foi possível encontrar o TELEGRAM_BOT_TOKEN no arquivo .env!");
  process.exit(1);
}

const GALLERY_DL_DIR   = path.join(__dirname, 'gallery-dl');
const COOKIES_PATH     = path.join(GALLERY_DL_DIR, 'cookies.txt');
const GALLERY_DL_CONF  = path.join(GALLERY_DL_DIR, 'config.json');

// ── Helpers gallery-dl ────────────────────────────────────────────────────────

function getMediaFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(getMediaFiles(full));
    } else if (file.match(/\.(jpg|jpeg|png|mp4|webm)$/i)) {
      results.push(full);
    }
  }
  return results;
}

function getTopQualities(image_versions2) {
  return (image_versions2?.candidates || []).slice(0, 2).map(c => ({
    url: c.url, width: c.width, height: c.height,
  }));
}

function getTopVideoVersions(video_versions) {
  return (video_versions || []).slice(0, 2).map(v => ({
    url: v.url, width: v.width, height: v.height, type: v.type,
  }));
}

function getItemMedia(item) {
  const hasVideo = Array.isArray(item.video_versions) && item.video_versions.length > 0;
  return hasVideo
    ? { type: 'video', versions: getTopVideoVersions(item.video_versions) }
    : { type: 'image', versions: getTopQualities(item.image_versions2) };
}

/**
 * Roda gallery-dl numa URL e retorna os metadados extraídos.
 * Retorna: { username, caption, mediaFiles, isCarousel, slides? }
 */
async function runGalleryDl(url) {
  const before = new Set(getMediaFiles(GALLERY_DL_DIR));

  // download com spawn (log em tempo real)
  await new Promise((resolve, reject) => {
    const proc = spawn('python', ['-m', 'gallery_dl', '--config', GALLERY_DL_CONF, url], {
      cwd: __dirname,
      shell: false,
      windowsHide: true,
      env: { ...process.env },
    });

    const logLines = [`URL: ${url}`];

    proc.stdout.on('data', d => {
      const line = d.toString().trim();
      if (line) {
        console.log('[gallery-dl]', line);
        logLines.push(`stdout: ${line}`);
      }
    });

    proc.stderr.on('data', d => {
      const line = d.toString().trim();
      if (line) {
        console.log('[gallery-dl stderr]', line);
        logLines.push(`stderr: ${line}`);
      }
    });

    proc.on('close', code => {
      logLines.push(`exit code: ${code}`);
      writeLog('gallery-dl', logLines);
      if (code === 0) resolve();
      else reject(new Error(`gallery-dl saiu com código ${code}`));
    });

    proc.on('error', err => {
      const msg = `spawn error: ${err.message}`;
      writeLog('gallery-dl', [msg]);
      reject(new Error(`Falha ao iniciar gallery-dl: ${err.message}`));
    });
  });

  // acha o .txt da API gerado na raiz
  const txtFiles = fs.readdirSync(__dirname)
    .filter(f => f.endsWith('.txt') && f.includes('media_') && f.includes('_info_'))
    .map(f => path.join(__dirname, f));

  let igData = null;

  for (const txtPath of txtFiles) {
    const matchId = path.basename(txtPath).match(/media_(\d+)_info_/);
    if (!matchId) continue;
    const postId = matchId[1];

    let raw;
    try { raw = JSON.parse(fs.readFileSync(txtPath, 'utf8')); }
    catch (e) { fs.unlinkSync(txtPath); continue; }

    const item = raw.items?.[0];
    if (!item) { fs.unlinkSync(txtPath); continue; }

    const username   = item.user?.username || null;
    const caption    = item.caption?.text  || null;
    const isCarousel = Array.isArray(item.carousel_media) && item.carousel_media.length > 0;

    const after    = getMediaFiles(GALLERY_DL_DIR);
    const newFiles = after.filter(f => !before.has(f));

    if (isCarousel) {
      const slides = item.carousel_media.map((slide, i) => {
        const media   = getItemMedia(slide);
        const slidePk = String(slide.pk || slide.id || '');
        const file    = newFiles.find(f => path.basename(f).includes(slidePk))
          || newFiles.find(f => path.basename(f).match(new RegExp(`_${i + 1}\\.`)));
        return { slide_index: i + 1, media_type: media.type, versions: media.versions, localFile: file || null };
      });
      igData = { username, caption, isCarousel: true, slides, mediaFiles: newFiles, postId };
    } else {
      const media = getItemMedia(item);
      const file  = newFiles.find(f => path.basename(f).includes(postId)) || newFiles[0] || null;
      igData = { username, caption, isCarousel: false, media_type: media.type, versions: media.versions, mediaFiles: newFiles, localFile: file, postId };
    }

    fs.unlinkSync(txtPath);
    break;
  }

  return igData;
}

// ── Polling ───────────────────────────────────────────────────────────────────

let offset = 0;

async function poll() {
  try {
    const res  = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`);
    const data = await res.json();
    if (data.ok) {
      for (const update of data.result) {
        offset = update.update_id + 1;
        await handleUpdate(update);
      }
    }
  } catch (err) {
    console.error("⚠️ Erro de conexão com Telegram:", err.message);
  }
  setTimeout(poll, 1000);
}

// ── handleUpdate ──────────────────────────────────────────────────────────────

async function handleUpdate(update) {
  const msg = update.message;
  if (!msg) return;

  const text = (msg.caption || msg.text || '').trim();

  // ── /edit ──────────────────────────────────────────────────────────────────
  if (text.startsWith('/edit')) {
    console.log(`[Comando] /edit processando chamada de @${msg.from.username}...`);

    if (!msg.reply_to_message) {
      await sendMessage(msg.chat.id, "❌ **Erro:** Você precisa selecionar a imagem velha, clicar em **Responder**, anexar a imagem nova e colocar `/edit` na legenda.", msg.message_id);
      return;
    }

    let newCaptionRaw = text.slice(5).trim();
    const parts = newCaptionRaw.split(' ');
    const isAi     = parts.includes('-ai');
    const isSus    = parts.includes('-sus');
    const isSilent = parts.includes('-s');

    newCaptionRaw = parts.filter(p => p !== '-ai' && p !== '-sus' && p !== '-s').join(' ').trim();

    let finalCaption = newCaptionRaw || msg.reply_to_message.caption || '';
    if (isAi && !finalCaption.endsWith(' | Feito por IA'))           finalCaption = `${finalCaption} | Feito por IA`;
    if (isSus && !finalCaption.endsWith(' | Possivelmente IA'))      finalCaption = `${finalCaption} | Possivelmente IA`;

    const hasTextChanges = newCaptionRaw || isAi || isSus;
    const hasNewMedia    = msg.photo || msg.document || msg.animation;
    let successMsgId = null;

    if (hasNewMedia) {
      let mediaType, fileId;
      if (msg.photo)     { mediaType = 'photo';     fileId = msg.photo[msg.photo.length - 1].file_id; }
      else if (msg.document)  { mediaType = 'document';  fileId = msg.document.file_id; }
      else if (msg.animation) { mediaType = 'animation'; fileId = msg.animation.file_id; }

      try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageMedia`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: msg.chat.id,
            message_id: msg.reply_to_message.message_id,
            media: {
              type: mediaType, media: fileId, caption: finalCaption,
              caption_entities: hasTextChanges ? [] : (msg.reply_to_message.caption_entities || []),
            },
          }),
        });
        const result = await res.json();
        if (result.ok) {
          const sentMsg = await sendMessage(msg.chat.id, "✅ Mídia substituída com sucesso!", msg.message_id);
          if (sentMsg?.result) successMsgId = sentMsg.result.message_id;
        } else {
          await sendMessage(msg.chat.id, `❌ Falha do Telegram: ${result.description}`, msg.message_id);
        }
      } catch (e) { console.error("Erro no editMessageMedia:", e); }

    } else {
      if (!hasTextChanges) {
        await sendMessage(msg.chat.id, "❌ **Erro:** Você não enviou nenhuma imagem, nem digitou um novo texto. Para mudar apenas a legenda: `/edit Nova legenda` ou `/edit -ia`.", msg.message_id);
        return;
      }
      try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageCaption`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: msg.chat.id, message_id: msg.reply_to_message.message_id, caption: finalCaption }),
        });
        const result = await res.json();
        if (result.ok) {
          const sentMsg = await sendMessage(msg.chat.id, "✅ Legenda atualizada com sucesso!", msg.message_id);
          if (sentMsg?.result) successMsgId = sentMsg.result.message_id;
        } else {
          await sendMessage(msg.chat.id, `❌ Falha do Telegram: ${result.description}`, msg.message_id);
        }
      } catch (e) { console.error("Erro no editMessageCaption:", e); }
    }

    if (isSilent && successMsgId) {
      setTimeout(async () => {
        await deleteMessage(msg.chat.id, msg.message_id);
        await deleteMessage(msg.chat.id, successMsgId);
      }, 5000);
    }
  }

  // ── /start | /help ─────────────────────────────────────────────────────────
  if (text === '/start' || text === '/help') {
    const help = "🛠️ **Bot de Manutenção Pinboard**\n\n" +
      "**📌 /edit** — Substitua mídia quebrada/errada em mensagens minhas.\n" +
      "  1. Selecione a mensagem com problema e clique em **Responder**\n" +
      "  2. Anexe a imagem/vídeo correto\n" +
      "  3. Envie `/edit` na legenda (ou `/edit Nova legenda` para mudar o texto também)\n" +
      "  Flags: `-ai` (Feito por IA), `-sus` (Possivelmente IA), `-s` (silencioso)\n\n" +
      "**📥 /baixar** ou **/dl** — Baixe mídia de qualquer URL e envie aqui.\n" +
      "  Suporta Instagram (gallery-dl), YouTube, Twitter e outros (yt-dlp)\n" +
      "  Ex: `/baixar https://instagram.com/p/ABC123`\n" +
      "  Flags: `-ai`, `-sus`, `-s`\n\n" +
      "**🎭 /impersonate** — Reposte uma mensagem minha como se fosse eu.\n" +
      "  Responda a qualquer mensagem (foto, vídeo, GIF, doc, texto) com `/impersonate`\n" +
      "  Flag: `-d` para enviar também como documento\n\n" +
      "**🔍 /search** — Descubra o autor de um post do Instagram.\n" +
      "  Responda a uma mensagem que contenha um link do Instagram na legenda\n" +
      "  O bot encontra o @username e atualiza a mensagem automaticamente\n\n" +
      "**💡 Flags podem ser combinadas:** `/baixar <url> -sus -s`";
    await sendMessage(msg.chat.id, help, msg.message_id);
  }

  // ── /baixar | /dl ──────────────────────────────────────────────────────────
if (text.startsWith('/baixar ') || text.startsWith('/dl ')) {
  const parts = text.split(' ').slice(1);
  let urlTarget = parts.find(p => !p.startsWith('-'));
  const isAi     = parts.includes('-ai');
  const isSus    = parts.includes('-sus');
  const isSilent = parts.includes('-s');

  if (urlTarget) {
    // só remove query string em URLs do Instagram
    if (urlTarget.includes('instagram.com') && urlTarget.includes('?')) {
      urlTarget = urlTarget.split('?')[0];
    }
    await handleBaixar(msg.chat.id, urlTarget, msg.message_id, isAi, isSus, isSilent, msg.message_thread_id || null);
  } else {
    await sendMessage(msg.chat.id, "❌ Por favor, informe uma URL após o comando.", msg.message_id);
  }
}

  // ── /impersonate ───────────────────────────────────────────────────────────
	if (text.startsWith('/impersonate')) {
	  console.log(`[Comando] /impersonate chamado por @${msg.from.username}`);

	  if (!msg.reply_to_message) {
		await sendMessage(msg.chat.id, "❌ Responda a uma mensagem (ou álbum) com `/impersonate` para eu repostá-la.", msg.message_id);
		return;
	  }

	  const parts    = text.split(' ');
	  const asDoc    = parts.includes('-d');
	  const impThreadId = msg.message_thread_id || null;

	  await impersonateMessage(msg.chat.id, msg.reply_to_message, impThreadId, asDoc);
	  await deleteMessage(msg.chat.id, msg.message_id);
	}

  // ── /search ────────────────────────────────────────────────────────────────
  if (text === '/search' || text.startsWith('/search')) {
    console.log(`[Comando] /search chamado por @${msg.from.username}`);

    if (!msg.reply_to_message) {
      await sendMessage(msg.chat.id, "❌ Responda a uma mensagem cuja legenda contenha um link do Instagram.", msg.message_id);
      return;
    }

    const targetCaption = msg.reply_to_message.caption || msg.reply_to_message.text || '';
    const igLinkMatch = targetCaption.match(/https?:\/\/(?:www\.)?instagram\.com\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/i);

    if (!igLinkMatch) {
      await sendMessage(msg.chat.id, "❌ Não encontrei nenhum link de post do Instagram na legenda da mensagem respondida.", msg.message_id);
      return;
    }

    const urlTarget = igLinkMatch[0].split('?')[0];
    const statusMsg = await sendMessage(msg.chat.id, "🔍 Buscando autor do post...", msg.message_id);
    const statusMsgId = statusMsg?.result?.message_id || null;

    try {
      const igData = await runGalleryDl(urlTarget);

      if (statusMsgId) await deleteMessage(msg.chat.id, statusMsgId);

      const owner = igData?.username || null;

      if (owner) {
        await sendMessage(msg.chat.id, `@${owner} — ${urlTarget}`, msg.message_id);

        // Limpa arquivos baixados pelo /search (não precisa da mídia)
        if (igData?.mediaFiles) {
          for (const f of igData.mediaFiles) {
            try { fs.unlinkSync(f); } catch {}
          }
        }
      } else {
        await sendMessage(msg.chat.id, "⚠️ Não foi possível identificar o autor do post.", msg.message_id);
      }

    } catch (e) {
      if (statusMsgId) await deleteMessage(msg.chat.id, statusMsgId);
      console.error("Erro no /search:", e.message);
      await sendMessage(msg.chat.id, `❌ Erro ao buscar: ${e.message}`, msg.message_id);
    }
  }
}

// ── handleBaixar ──────────────────────────────────────────────────────────────
// resolve o caminho completo do yt-dlp uma vez na inicialização
let YTDLP_PATH = 'yt-dlp';
try {
  YTDLP_PATH = execSync('where yt-dlp', { encoding: 'utf8' }).split('\n')[0].trim();
  console.log(`[yt-dlp] Executável encontrado: ${YTDLP_PATH}`);
} catch {
  console.log('[yt-dlp] "where yt-dlp" falhou, usando "yt-dlp" genérico');
}

// ── Sistema de log ─────────────────────────────────────────────────────────────
const LOG_DIR  = path.join(__dirname, 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR);

function getLogPath(tool) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return path.join(LOG_DIR, `${tool}_${date}.log`);
}

function writeLog(tool, lines) {
  const logPath  = getLogPath(tool);
  const timestamp = new Date().toISOString();
  const content  = lines.map(l => `[${timestamp}] ${l}`).join('\n') + '\n';
  fs.appendFileSync(logPath, content, 'utf8');
}

// ── ytdlpDownload ──────────────────────────────────────────────────────────────
function ytdlpDownload(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(YTDLP_PATH, args, {
      shell: false, // false + caminho completo = mais confiável no Windows
      windowsHide: true,
      env: { ...process.env },
    });

    const logLines = [`CMD: yt-dlp ${args.join(' ')}`];

    proc.stdout.on('data', d => {
      const line = d.toString().trim();
      console.log('[yt-dlp]', line);
      logLines.push(`stdout: ${line}`);
    });

    proc.stderr.on('data', d => {
      const line = d.toString().trim();
      console.log('[yt-dlp stderr]', line);
      logLines.push(`stderr: ${line}`);
    });

    proc.on('close', code => {
      logLines.push(`exit code: ${code}`);
      writeLog('ytdlp', logLines);
      if (code === 0) resolve();
      else reject(new Error(`yt-dlp saiu com código ${code}`));
    });

    proc.on('error', err => {
      logLines.push(`spawn error: ${err.message}`);
      writeLog('ytdlp', logLines);
      reject(new Error(`Falha ao iniciar yt-dlp: ${err.message}`));
    });
  });
}

async function handleBaixar(chatId, urlTarget, commandMsgId = null, isAi = false, isSus = false, isSilent = false, threadId = null) {
  const statusMsg = await sendMessage(chatId, "⏳ Baixando mídia...", commandMsgId);
  let statusMsgId = statusMsg?.result?.message_id || null;

  try {
    const isInstagram = urlTarget.includes('instagram.com');
    let captionText = '';

    if (isInstagram) {
      // ── Instagram: gallery-dl ──────────────────────────────────────────────
      console.log(`[gallery-dl] Baixando ${urlTarget}`);
      const igData = await runGalleryDl(urlTarget);

      const author = igData?.username ? `@${igData.username}` : '';
      captionText = author ? `${author} — ${urlTarget}` : urlTarget;
      if (isAi)      captionText += ' | Feito por IA';
      else if (isSus) captionText += ' | Possivelmente IA';

      if (igData?.isCarousel) {
        for (let i = 0; i < igData.slides.length; i++) {
          const slide = igData.slides[i];
          if (slide.localFile && fs.existsSync(slide.localFile)) {
            await sendLocalFile(chatId, slide.localFile, slide.media_type, i === 0 ? captionText : '', threadId);
          } else if (slide.versions?.length > 0) {
            const v   = slide.versions[0];
            const ext = slide.media_type === 'video' ? 'mp4' : 'jpg';
            await sendMediaToTelegram(chatId, v.url, `slide_${i + 1}.${ext}`, slide.media_type, i === 0 ? captionText : '', threadId);
          }
        }
      } else {
        if (igData?.localFile && fs.existsSync(igData.localFile)) {
          await sendLocalFile(chatId, igData.localFile, igData.media_type, captionText, threadId);
        } else if (igData?.versions?.length > 0) {
          const v   = igData.versions[0];
          const ext = igData.media_type === 'video' ? 'mp4' : 'jpg';
          await sendMediaToTelegram(chatId, v.url, `media.${ext}`, igData.media_type, captionText, threadId);
        }
      }

    } else {
  // ── Outros sites: yt-dlp ───────────────────────────────────────────────
  console.log(`[yt-dlp] Baixando ${urlTarget}`);

  const tmpDir = path.join(__dirname, `ytdlp_${Date.now()}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  try {
    // metadados pra legenda
    try {
      const { stdout } = await exec(
        `yt-dlp --dump-json --no-playlist --js-runtimes node "${urlTarget}"`,
        { maxBuffer: 10 * 1024 * 1024 }
      );
      const meta  = JSON.parse(stdout);
      let author  = meta.channel || meta.uploader || meta.creator || meta.uploader_id || '';
      if (author && !author.startsWith('@') && !author.includes(' ')) author = `@${author}`;
      captionText = author ? `${author} — ${urlTarget}` : urlTarget;
    } catch (e) {
      console.log('[yt-dlp] metadados falharam:', e.message);
      captionText = urlTarget;
    }

    if (isAi)      captionText += ' | Feito por IA';
    else if (isSus) captionText += ' | Possivelmente IA';

    // download com spawn (sem limite de buffer)
    await ytdlpDownload([
      '--no-playlist',
      '--js-runtimes', 'node',
      '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best[height<=1080]',
      '--merge-output-format', 'mp4',
      '-o', `${tmpDir}/%(title)s.%(ext)s`,
      urlTarget,
    ]);

    const downloaded = fs.readdirSync(tmpDir).map(f => path.join(tmpDir, f));
    console.log(`[yt-dlp] Arquivos baixados:`, downloaded);

    if (downloaded.length === 0) throw new Error('yt-dlp não gerou nenhum arquivo.');

    for (let i = 0; i < downloaded.length; i++) {
      const filePath = downloaded[i];
      const ext      = path.extname(filePath).toLowerCase();
      let mediaType  = 'document';
      if (['.mp4', '.mkv', '.webm', '.mov'].includes(ext))       mediaType = 'video';
      else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) mediaType = 'image';
      else if (['.mp3', '.m4a', '.wav', '.ogg'].includes(ext))   mediaType = 'audio';

      console.log(`[yt-dlp] Enviando: ${path.basename(filePath)} | ${mediaType}`);
      await sendLocalFile(chatId, filePath, mediaType, i === 0 ? captionText : '', threadId);
    }

  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
  }
}

    if (statusMsgId) await deleteMessage(chatId, statusMsgId);

    if (isSilent) {
      if (commandMsgId) await deleteMessage(chatId, commandMsgId);
    } else {
      await sendMessage(chatId, "✅ Processo concluído!", commandMsgId, threadId);
    }

  } catch (e) {
    if (statusMsgId) await deleteMessage(chatId, statusMsgId);
    console.error('[handleBaixar] Erro:', e.message);
    await sendMessage(chatId, `❌ Erro ao processar:\n${e.message}`, commandMsgId);
  }
}

// ── Helpers de envio ──────────────────────────────────────────────────────────

async function sendLocalFile(chatId, filePath, mediaType, caption = '', threadId = null) {
  const fileBuffer = fs.readFileSync(filePath);
  const filename   = path.basename(filePath);
  const sizeMB     = (fileBuffer.byteLength / 1024 / 1024).toFixed(1);
  console.log(`[sendLocalFile] ${filename} | ${mediaType} | ${sizeMB}MB`);

  // Telegram limita 50MB via Bot API
  if (fileBuffer.byteLength > 50 * 1024 * 1024) {
    throw new Error(`Arquivo muito grande para o Telegram: ${sizeMB}MB (limite 50MB)`);
  }

  const blob     = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append('chat_id', chatId);
  if (threadId) formData.append('message_thread_id', threadId);
  if (caption)  formData.append('caption', caption);

  let endpoint  = 'sendDocument';
  let fieldName = 'document';
  if (mediaType === 'video' || filename.match(/\.mp4$/i))                    { endpoint = 'sendVideo';     fieldName = 'video'; }
  else if (mediaType === 'image' || filename.match(/\.(jpg|jpeg|png|webp)$/i)) { endpoint = 'sendPhoto';     fieldName = 'photo'; }
  else if (mediaType === 'audio' || filename.match(/\.(mp3|m4a|wav|ogg)$/i))   { endpoint = 'sendAudio';     fieldName = 'audio'; }

  formData.append(fieldName, blob, filename);

  const tgRes  = await fetch(`https://api.telegram.org/bot${TOKEN}/${endpoint}`, { method: 'POST', body: formData });
  const tgData = await tgRes.json();

  if (!tgData.ok) throw new Error(`Erro do Telegram (${endpoint}): ${tgData.description}`);

  try { fs.unlinkSync(filePath); } catch {}
}

async function sendMediaToTelegram(chatId, downloadUrl, filename, type, caption = '', threadId = null) {
  const fileRes = await fetch(downloadUrl);
  if (!fileRes.ok) throw new Error(`Falha ao baixar arquivo: ${fileRes.statusText}`);
  const blob = new Blob([await fileRes.arrayBuffer()]);

  const formData = new FormData();
  formData.append('chat_id', chatId);
  if (threadId) formData.append('message_thread_id', threadId);
  if (caption)  formData.append('caption', caption);

  let endpoint  = 'sendDocument';
  let fieldName = 'document';
  const nameLower = filename.toLowerCase();
  if (type === 'video' || nameLower.endsWith('.mp4'))                                                         { endpoint = 'sendVideo';     fieldName = 'video'; }
  else if (type === 'photo' || nameLower.match(/\.(jpg|jpeg|png|webp)/) || nameLower.includes('?'))          { endpoint = 'sendPhoto';     fieldName = 'photo'; }
  else if (type === 'gif'   || nameLower.endsWith('.gif'))                                                    { endpoint = 'sendAnimation'; fieldName = 'animation'; }
  else if (type === 'audio' || nameLower.match(/\.(mp3|m4a|wav)$/))                                          { endpoint = 'sendAudio';     fieldName = 'audio'; }

  formData.append(fieldName, blob, filename);

  const tgRes  = await fetch(`https://api.telegram.org/bot${TOKEN}/${endpoint}`, { method: 'POST', body: formData });
  const tgData = await tgRes.json();
  if (!tgData.ok) throw new Error(`Erro do Telegram: ${tgData.description}`);
}

// ── Impersonate ───────────────────────────────────────────────────────────────

async function impersonateMessage(chatId, target, threadId = null, asDoc = false) {
  const caption = target.caption || '';

  function buildForm(fieldName, fileId) {
    const f = new FormData();
    f.append('chat_id', chatId);
    if (threadId) f.append('message_thread_id', threadId);
    f.append(fieldName, fileId);
    if (caption) f.append('caption', caption);
    return f;
  }

  if (target.photo) {
    const fileId = target.photo[target.photo.length - 1].file_id;
    // envia como foto (padrão) ou documento (-d)
    if (asDoc) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`, { method: 'POST', body: buildForm('document', fileId) });
    } else {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: buildForm('photo', fileId) });
    }
    // se -d, envia os dois
    if (asDoc) {
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`, { method: 'POST', body: buildForm('photo', fileId) });
    }
    return;
  }

  if (target.video)     { await fetch(`https://api.telegram.org/bot${TOKEN}/sendVideo`,     { method: 'POST', body: buildForm('video',     target.video.file_id) }); return; }
  if (target.animation) { await fetch(`https://api.telegram.org/bot${TOKEN}/sendAnimation`, { method: 'POST', body: buildForm('animation', target.animation.file_id) }); return; }
  if (target.document)  { await fetch(`https://api.telegram.org/bot${TOKEN}/sendDocument`,  { method: 'POST', body: buildForm('document',  target.document.file_id) }); return; }
  if (target.text)      { await sendMessage(chatId, target.text, null, threadId); }
}

// ── Utilitários Telegram ──────────────────────────────────────────────────────

async function sendMessage(chatId, text, replyToMessageId = null, threadId = null) {
  const body = { chat_id: chatId, text, parse_mode: 'Markdown' };
  if (replyToMessageId) body.reply_to_message_id = replyToMessageId;
  if (threadId) body.message_thread_id = threadId;
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function deleteMessage(chatId, messageId) {
  if (!messageId) return;
  try {
    const res  = await fetch(`https://api.telegram.org/bot${TOKEN}/deleteMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId }),
    });
    const data = await res.json();
    if (!data.ok) console.error(`Erro do Telegram ao deletar (chat: ${chatId}, msg: ${messageId}):`, data.description);
  } catch (e) { console.error("Erro ao deletar mensagem:", e.message); }
}

// ── Start ─────────────────────────────────────────────────────────────────────

console.log("==========================================");
console.log("🤖 PINBOARD BOT SERVER INICIADO");
console.log("==========================================");
console.log("🔌 O Bot está online e escutando o chat...");
console.log("Deixe essa aba de terminal aberta para os comandos funcionarem.");
poll();
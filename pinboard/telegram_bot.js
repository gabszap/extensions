/**
 * Bot Interativo do Pinboard
 * Resolva problemas no seu canal de backups usando comandos pelo próprio app do Telegram.
 *
 * COMO USAR:
 * 1. Coloque seu TOKEN abaixo.
 * 2. Abra o terminal nessa pasta e rode: node telegram_bot.js
 * 3. Lá no Telegram, SELECIONE a mensagem com a imagem quebrada/errada e clique em "Responder".
 * 4. Ao responder, envie a IMAGEM CORRETA e digite `/edit` na legenda da foto.
 * -------------------------------------------------------------
 */

const fs = require('fs');
let TOKEN = '';

try {
    const envFile = fs.readFileSync('.env', 'utf8');
    const tokenMatch = envFile.match(/^TELEGRAM_BOT_TOKEN=(.*)$/m);
    if (tokenMatch) {
        TOKEN = tokenMatch[1].trim();
    }
} catch (e) {
    // .env não encontrado ou sem permissão
}

if (!TOKEN || TOKEN === 'YOUR_TOKEN_HERE') {
    console.log("❌ ERRO: Não foi possível encontrar o TELEGRAM_BOT_TOKEN no arquivo .env!");
    process.exit(1);
}

let offset = 0;

async function poll() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`);
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
    // Loop infinito
    setTimeout(poll, 1000);
}

async function handleUpdate(update) {
    const msg = update.message;
    if (!msg) return;

    const text = (msg.caption || msg.text || '').trim();

    if (text.startsWith('/edit')) {
        console.log(`[Comando] /edit processando chamada de @${msg.from.username}...`);

        if (!msg.reply_to_message) {
            await sendMessage(msg.chat.id, "❌ **Erro:** Você precisa selecionar a imagem velha, clicar em **Responder**, anexar a imagem nova e colocar `/edit` na legenda.", msg.message_id);
            return;
        }

        const newCaptionRaw = text.slice(5).trim();
        const hasNewMedia = msg.photo || msg.document || msg.animation;

        if (hasNewMedia) {
            let mediaType, fileId;

            if (msg.photo) {
                mediaType = 'photo';
                fileId = msg.photo[msg.photo.length - 1].file_id;
            } else if (msg.document) {
                mediaType = 'document';
                fileId = msg.document.file_id;
            } else if (msg.animation) {
                mediaType = 'animation';
                fileId = msg.animation.file_id;
            }

            try {
                const res = await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageMedia`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: msg.chat.id,
                        message_id: msg.reply_to_message.message_id,
                        media: {
                            type: mediaType,
                            media: fileId,
                            caption: newCaptionRaw || msg.reply_to_message.caption || '',
                            caption_entities: newCaptionRaw ? [] : (msg.reply_to_message.caption_entities || [])
                        }
                    })
                });

                const result = await res.json();
                if (result.ok) {
                    await sendMessage(msg.chat.id, "✅ Mídia substituída com sucesso! (Você já pode apagar esta mensagem de comando).", msg.message_id);
                } else {
                    await sendMessage(msg.chat.id, `❌ Falha do Telegram: ${result.description}`, msg.message_id);
                }
            } catch (e) {
                console.error("Erro no editMessageMedia:", e);
            }
        } else {
            // SÓ MUDAR A LEGENDA
            if (!newCaptionRaw) {
                await sendMessage(msg.chat.id, "❌ **Erro:** Você não enviou nenhuma imagem e nem digitou um novo texto. Para mudar apenas a legenda, responda à mensagem digitando algo como: `/edit Nova legenda legal`.", msg.message_id);
                return;
            }

            try {
                const res = await fetch(`https://api.telegram.org/bot${TOKEN}/editMessageCaption`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: msg.chat.id,
                        message_id: msg.reply_to_message.message_id,
                        caption: newCaptionRaw
                    })
                });

                const result = await res.json();
                if (result.ok) {
                    await sendMessage(msg.chat.id, "✅ Legenda atualizada com sucesso! (Você já pode apagar esta mensagem de comando).", msg.message_id);
                } else {
                    await sendMessage(msg.chat.id, `❌ Falha do Telegram: ${result.description}`, msg.message_id);
                }
            } catch (e) {
                console.error("Erro no editMessageCaption:", e);
            }
        }
    }

    if (text === '/start' || text === '/help') {
        const help = "🛠️ **Bot de Manutenção Pinboard**\n\nResponda a uma mensagem minha contendo algum anexo defeituoso/errado usando uma **Nova Imagem + Legenda `/edit`** para eu substituir silenciosamente a imagem quebrada pra você e preservar a legenda do Twitter!";
        await sendMessage(msg.chat.id, help, msg.message_id);
    }
}

async function sendMessage(chatId, text, replyToMessageId = null) {
    const body = { chat_id: chatId, text: text, parse_mode: 'Markdown' };
    if (replyToMessageId) body.reply_to_message_id = replyToMessageId;

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

console.log("==========================================");
console.log("🤖 PINBOARD BOT SERVER INICIADO");
console.log("==========================================");
console.log("🔌 O Bot está online e escutando o chat...");
console.log("Deixe essa aba de terminal aberta para os comandos funcionarem.");
poll();

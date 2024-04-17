const BaleBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '795580184:c3uQWPVDTRZLwAMk3Q6QTa5THqQOKkUapVZBt8DY'; // your bale bot token

const options = {
    baseApiUrl: 'https://tapi.bale.ai',
};

const bot = new BaleBot(token, options);

bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const msg_id = msg.message_id;
    await bot.sendMessage(chatId, 'سلام این رباد توسط\n@Devehsan\nطراحی و توسعه داده شده است برای جشنواره خوارزمی نویسنده ربات:\nاحسان فضلی', {
        reply_to_message_id: msg_id
    });
});

bot.on('message', async (msg) => {
    if (msg.text.toString().toLowerCase().indexOf('/start') === 0) {
        return;
    }

    const chatId = msg.chat.id;
    const userText = msg.text;
    const msg_id = msg.message_id;

    const please = await bot.sendMessage(chatId, 'لطفا کمی صبر کنید...', {
        reply_to_message_id: msg_id
    });

    try {
        const response = await axios.post('https://mrapiweb.ir/ai', {
            text: userText
        });

        if (response.status === 200) {
            const replyText = response.data.message;
            await bot.editMessageText(replyText, {
                chat_id: chatId,
                message_id: please.message_id
            });
        } else {
            throw new Error('متاسفانه خطایی رخ داده است.');
        }
    } catch (error) {
        await bot.editMessageText('متاسفانه خطایی رخ داده است.', {
            chat_id: chatId,
            message_id: please.message_id
        });
    }
});

bot.startPolling();
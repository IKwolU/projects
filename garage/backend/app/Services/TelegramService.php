<?php

namespace App\Services;

use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramService
{
    public function SendMassageToTG($chatId, $massage)
    {
        Telegram::sendMessage([
            'chat_id' => $chatId,
            'text' => $massage,
        ]);
    }
}
// 4243409391

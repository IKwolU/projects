<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Telegram\Bot\Exceptions\TelegramResponseException;
use Telegram\Bot\Laravel\Facades\Telegram;

class TelegramService
{
    public function SendMassageToTG($chatId, $massage)
    {
        try {
            Telegram::sendMessage([
                'chat_id' => $chatId,
                'text' => $massage,
            ]);
        } catch (TelegramResponseException $e) {
            Log::error('Telegram API Error: ' . $e->getMessage());
        }
    }
}
// 4243409391

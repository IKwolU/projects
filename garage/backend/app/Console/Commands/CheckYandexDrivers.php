<?php

namespace App\Console\Commands;

use App\Models\Park;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CheckYandexDrivers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-yandex-drivers';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Проверка Броней на совпадение с Ядексом';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info("Проверяем яндекс");
        $date = Carbon::now()->subDays(7);

        $parks = Park::whereHas('bookings', function ($query) use ($date) {
            $query->whereNotNull("yandex_keys")->where('bookings.created_at', '>=', $date);
        })->with(['bookings' => function ($query) use ($date) {
            $query->where('bookings.created_at', '>=', $date)->with(['user' => function ($query) {
                $query->select('users.id', 'users.phone');
            }])->select('bookings.driver_id', 'bookings.id', 'bookings.created_at')->orderBy('bookings.created_at', 'desc');
        }])->select('yandex_keys', 'id')->get();

        foreach ($parks as $park) {
            $park->yandex_keys = json_decode($park->yandex_keys);

            foreach ($park->bookings as $booking) {
                $booking->user->phone = str_replace(['(', ')', ' ', '-'], '', $booking->user->phone);
            }

            foreach ($park->yandex_keys as $keys) {
                $response = $this->getYandexDriverByPhone($keys);

                // Получаем все телефоны водителей в одном массиве
                $phones = collect($response["driver_profiles"])
                    ->pluck('driver_profile.phones')
                    ->flatten();

                // Фильтруем бронирования, которые нужно подтвердить
                $bookingsToConfirm = $park->bookings->groupBy('driver_id')->map(function ($bookings) {
                    return $bookings->sortByDesc('created_at')->first();
                })->filter(function ($booking) use ($phones) {
                    return $phones->contains($booking->user->phone);
                });
                // Проверяем каждое бронирование для подтверждения
                foreach ($bookingsToConfirm as $booking) {
                    if ($booking->hire_confirmed !== null) {
                        $matchingDriver = collect($response["driver_profiles"])
                            ->first(function ($item) use ($booking) {
                                return collect($item["driver_profile"]["phones"])
                                    ->contains($booking->user->phone);
                            });

                        if ($matchingDriver && $booking->created_at < $matchingDriver["driver_profile"]["hire_date"]) {
                            $booking->hire_confirmed = true;
                            $booking->save();
                        }
                    }
                }
            }
        }
    }

    private function getYandexDriverByPhone($yandexKeys)
    {
        $url = 'https://fleet-api.taxi.yandex.net/v1/parks/driver-profiles/list';
        $clientId = $yandexKeys->X_Client_ID;
        $apiKey = $yandexKeys->X_Api_Key;
        $yaParkId = $yandexKeys->park_id;
        $headers = [
            'X-Client-ID' => $clientId,
            'X-Api-Key' => $apiKey,
            'Content-Type' => 'application/json',
            'Cookie' => '_yasc=tMESW9JwcRsF+cMArjznJ3ttm5mmAc77SnR77ohsW7nxVh254LxnEhgRgAhPvhSn'
        ];
        $data = [
            'query' => [
                'park' => [
                    'id' => $yaParkId,
                    'driver_profile' => [
                        'work_status' => ['working']
                    ]
                ]
            ],
            'limit' => 1000,
            'fields' => [
                'car' => [],
                'park' => [],
                'driver_profile' => ['id', 'phones', 'hire_date'],
                'account' => [],
                'current_status' => []
            ]
        ];

        try {
            $response = Http::withHeaders($headers)->post($url, $data);
        } catch (\Exception $e) {
            // Обработка ошибки при отправке email
            Log::error('Парк ' . $yaParkId . ' Произошла ошибка получения Яндекс Апи: ' . $e->getMessage());
        }

        return $response->json();
    }
}

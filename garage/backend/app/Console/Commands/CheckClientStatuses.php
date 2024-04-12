<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Http\Controllers\CarsController;
use App\Http\Controllers\ManagerController;
use App\Models\Booking;
use App\Models\Car;
use App\Models\Manager;
use App\Models\Park;
use App\Models\Status;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Support\Facades\Http;

class CheckClientStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-client-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // .!!!!!!!!!!!!!!! ЯТЪ!!!!!!!!!!!!!
        set_time_limit(300);
        // ,!!!!!!!!!!!!!!! ЯТЪ!!!!!!!!!!!!!
        $parks = Park::whereNotNull('url')->get();
        $controller = new ManagerController;
        foreach ($parks as $park) {
            $clientCars = json_decode($this->getCarsFromParkClient($park->id));
            $statuses = Status::where('park_id', $park->id)->select('status_value', 'custom_status_name', 'id')->get();
            $cars = Car::where('park_id', $park->id)->get();

            foreach ($clientCars as $car) {
                $carVin = $car->VIN;
                $carStatus = $car->Status;

                $existingCar = $cars->where('car_id', $carVin)->first();

                if ($existingCar && $controller->checkCarDataIsFilled($existingCar)) {
                    $matchingStatusValue = null;
                    $matchingStatusId = null;
                    foreach ($statuses as $status) {
                        if ($carStatus === $status->custom_status_name) {
                            $matchingStatusValue = $status->status_value;
                            $matchingStatusId = $status->id;
                            break;
                        }
                    }
                    $existingCar->status = $matchingStatusValue;
                    $oldStatus = $existingCar->status_id;
                    if ($oldStatus !== $matchingStatusId) {
                        if ($existingCar->status === CarStatus::Booked->value) {
                            $booking = Booking::where('car_id', $existingCar->id)->first();
                            if ($matchingStatusValue === CarStatus::AvailableForBooking) {
                                $booking->status = BookingStatus::UnBooked;
                                $booking->save();
                            }
                            if ($matchingStatusValue === CarStatus::Rented) {
                                $booking->status = BookingStatus::RentStart;
                                $booking->save();
                            }
                        }
                        if ($existingCar->status === CarStatus::Rented->value && $matchingStatusValue === CarStatus::AvailableForBooking) {
                            $booking = Booking::where('car_id', $existingCar->id)->first();
                            $booking->status = BookingStatus::RentOver;
                            $booking->save();
                        }
                        $existingCar->status_id = $matchingStatusId;
                        $existingCar->old_status_id = $oldStatus;
                        $existingCar->save();
                    }
                }
            }
            return response()->json(['message' => 'Статусы успешно обновлены'], 200);
        }
    }
    private function getCarsFromParkClient($parkId)
    {
        $url = Park::where('id', $parkId)->select('url')->first()->url;
        $url .= '/hs/Car/v1/Get';

        $manager = Manager::where('park_id', $parkId)->first();
        if ($manager) {
            $user = $manager->user();
            $username = $user->name;
            $password = $user->password;
            $auth = base64_encode($username . ':' . $password);

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                'Authorization: Basic ' . $auth
            ));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

            $response = curl_exec($ch);

            if ($response === false) {
                return 'Curl error: ' . curl_error($ch);
            }
            curl_close($ch);
            return $response;
        }
    }
}

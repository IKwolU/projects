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
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Contracts\Queue\Queue;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

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
        set_time_limit(600);
        // ,!!!!!!!!!!!!!!! ЯТЪ!!!!!!!!!!!!!
        try {
            $parks = Park::whereNotNull('url')->get();
            foreach ($parks as $park) {
                $clientCars = [];
                $response = $this->getCarsFromParkClient($park->id);
                if ($response && $response->status() === 200) {
                    $clientCars = json_decode($response->body());
                } else {
                    continue;
                }

                $statuses = Status::where('park_id', $park->id)->select('status_value', 'custom_status_name', 'id')->get();
                $cars = Car::where('park_id', $park->id)->get();
                if (is_array($clientCars)) {
                    usort($clientCars, function ($a, $b) {
                        return strtotime($b->STSIssueDate) - strtotime($a->STSIssueDate);
                    });
                    $statuses = Status::where('park_id', $park->id)->select('status_value', 'custom_status_name', 'id')->get();
                    $cars = Car::where('park_id', $park->id)->get();
                    usort($clientCars, function ($a, $b) {
                        return strtotime($b->STSIssueDate) - strtotime($a->STSIssueDate);
                    });
                    foreach ($clientCars as $car) {
                        if ($car && $car->Activity === true) {

                            $carVin = $car->VIN;
                            $carStatus = $car->Status;
                            $existingCar = $cars->where('car_id', $carVin)->first();
                            if ($existingCar && ManagerController::checkCarDataIsFilled($existingCar)) {
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
                                        $booking = Booking::where('car_id', $existingCar->id)->where('status', BookingStatus::Booked->value)->first();
                                        if ($matchingStatusValue === CarStatus::AvailableForBooking->value || $matchingStatusValue === CarStatus::Hidden->value) {
                                            $booking->status = BookingStatus::UnBooked->value;
                                            $booking->save();
                                        }
                                        if ($matchingStatusValue === CarStatus::Rented->value) {
                                            $booking->status = BookingStatus::RentStart->value;
                                            $booking->save();
                                        }
                                    }
                                    if ($existingCar->status === CarStatus::Rented->value && ($matchingStatusValue === CarStatus::AvailableForBooking->value || $matchingStatusValue === CarStatus::Hidden->value)) {
                                        $booking = Booking::where('car_id', $existingCar->id)->where('status', BookingStatus::Booked->value)->first();
                                        $booking->status = BookingStatus::RentOver->value;
                                        $booking->save();
                                    }
                                    $existingCar->status_id = $matchingStatusId;
                                    $existingCar->old_status_id = $oldStatus;
                                    $existingCar->save();
                                }
                            }
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('Произошла ошибка: ' . $e->getMessage());
        }
    }

    private function getCarsFromParkClient($parkId)
    {
        try {
            $park = Park::where('id', $parkId)->select('url', 'login_1c', 'password_1c')->first();
            $url = $park->url . '/hs/Car/v1/Get';
            $manager = Manager::where('park_id', $parkId)->first();
            if ($manager) {
                $username = $park->login_1c;
                $password = $park->password_1c;
                $response = Http::withoutVerifying()->withBasicAuth($username, $password)->get($url);
                return $response;
            }
        } catch (\Exception $e) {
            Log::error('Error fetching cars from park client: ' . $e->getMessage());
        }
    }
}

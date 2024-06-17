<?php

namespace App\Console\Commands;

use App\Enums\BookingStatus;
use App\Enums\CancellationSources;
use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Http\Controllers\APIController;
use App\Models\Booking;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CheckBookingTimers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-booking-timers';

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
        $bookings = Booking::where('status', BookingStatus::Booked->value)->get();
        $timeNow = Carbon::now('UTC');
        if ($bookings) {
            $apiController = new APIController;

            foreach ($bookings as $booking) {
                if ($booking->booked_until < $timeNow) {
                    $booking->status = BookingStatus::BookingTimeOver->value;
                    $booking->car->status = CarStatus::AvailableForBooking->value;
                    $booking->cancellation_source = CancellationSources::System->value;
                    $booking->car->save();
                    $booking->save();
                    $apiController->notifyParkOnBookingStatusChanged(booking_id: $booking->id, is_booked: false, reason: 'Истек срок бронирования');
                }
            }
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationLogType;
use App\Enums\ApplicationStage;
use App\Enums\BookingStatus;
use App\Enums\CancellationSources;
use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\UserStatus;
use App\Models\Application;
use App\Models\Booking;
use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Driver;
use App\Models\DriverDoc;
use App\Models\Park;
use App\Models\RentTerm;
use App\Models\Schema;
use App\Models\Status;
use App\Models\User;
use App\Services\FileService;
use Carbon\Carbon;

class DriverController extends Controller
{

    /**
     * Загрузка файла
     *
     * Этот эндпоинт позволяет аутентифицированным пользователям загружать файл и связывать его с их документами водителя.
     *
     * @OA\Post(
     *     path="/driver/upload-file",
     *     operationId="uploadFile",
     *     tags={"Files"},
     *     security={{"bearerAuth": {}}},
     *     summary="Загрузить файл",
     *     description="Загрузить файл и связать его с документами водителя аутентифицированного пользователя",
     *     @OA\RequestBody(
     *         required=true,
     *         description="Файл для загрузки",
     *         @OA\MediaType(
     *             mediaType="multipart/form-data",
     *             @OA\Schema(
     *                 type="object",
     *                 @OA\Property(
     *                     property="file",
     *                     description="Файл для загрузки",
     *                     type="string",
     *                     format="binary"
     *                 ),
     *                 @OA\Property(
     *                     property="driverDocumentType",
     *                     description="Тип файла",
     *                     type="string",
     *                     ref="#/components/schemas/DriverDocumentType"
     *                 ),
     *             ),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Файл успешно загружен",
     *         @OA\JsonContent(
     *             @OA\Property(property="url", type="string"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Неверный запрос",
     *         @OA\JsonContent(
     *             @OA\Property(property="error", type="string", example="Недопустимый тип файла"),
     *         ),
     *     ),
     *     security={
     *         {"bearerAuth": {}}
     *     }
     * )
     *
     * @param \Illuminate\Http\Request $request The request object containing the file and its type
     * @return \Illuminate\Http\JsonResponse JSON response indicating the success or failure of the file upload
     */


    public function uploadDocs(Request $request)
    {
        $request->validate([
            'driverDocumentType' => 'required|string|in:image_licence_front,image_licence_back,image_pasport_front,image_pasport_address,image_fase_and_pasport',
            'file' => 'required|file|mimes:png,jpg,jpeg|max:7168',
        ]);

        $type = $request->driverDocumentType;
        $user = Auth::guard('sanctum')->user();
        $user_id = $user->id;
        $driver = Driver::where('user_id', $user_id)->first();
        $docs = DriverDoc::where('driver_id', $driver->id)->first();


        if (!$docs) {
            $docs = new DriverDoc(['driver_id' => $driver->id]);
        }
        $oldFileName = $docs->{$type};

        $fileService = new FileService;
        $name = uuid_create(UUID_TYPE_RANDOM);
        $docs->{$type} = $name;
        $fileService->saveFile($request->file('file'), $name, $oldFileName);
        $docs->save();
        $readyToVerify = $docs->image_licence_front && $docs->image_licence_back && $docs->image_pasport_front && $docs->image_pasport_address && $docs->image_fase_and_pasport;
        if ($readyToVerify) {
            $user->user_status = UserStatus::Verification->value;
            $user->save();
        }
        $url = asset('uploads') . '/' . $docs->{$type};

        return response()->json(['url' => $url]);
    }

    /**
     * Бронирование автомобиля
     *
     * @OA\Post(
     *     path="/auth/cars/booking",
     *     operationId="Book",
     *     summary="Бронирование автомобиля",
     *     tags={"Cars"},
     *     security={{"bearerAuth": {}}},
     * @OA\RequestBody(
     *     required=true,
     *     @OA\JsonContent(
     *         @OA\Property(property="id", type="integer", description="Идентификатор машины"),
     *         @OA\Property(property="schema_id", type="integer", description="Идентификатор схемы аренды"),
     *     ),
     * ),
     * @OA\Response(
     *     response="200",
     *     description="Успешное бронирование",
     *     @OA\MediaType(
     *         mediaType="application/json",
     *         @OA\Schema(
     *             @OA\Property(property="booking", type="object",
     *                 @OA\Property(property="status", type="string",ref="#/components/schemas/BookingStatus"),
     *                 @OA\Property(property="id", type="integer"),
     *                 @OA\Property(property="start_date", type="string"),
     *                 @OA\Property(property="end_date", type="string"),
     *                 @OA\Property(property="car", type="object",
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                     @OA\Property(property="transmission_type", type="string", description="Тип трансмиссии",ref="#/components/schemas/TransmissionType"),
     *                     @OA\Property(property="brand", type="string"),
     *                     @OA\Property(property="model", type="string"),
     *                     @OA\Property(property="year_produced", type="integer"),
     *                     @OA\Property(property="images", type="array", @OA\Items(type="string"), description="Ссылки на изображения"),
     *                     @OA\Property(property="сar_class", type="string", description="Класс тарифа", ref="#/components/schemas/CarClass"),
     *                     @OA\Property(property="division", type="object",
     *                         @OA\Property(property="coords", type="string"),
     *                         @OA\Property(property="address", type="string"),
     *                         @OA\Property(property="phone", type="string"),
     *             @OA\Property(
     *                 property="working_hours",
     *                 type="array",
     *                 description="Расписание работы парка",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="day", type="string", description="День недели на английском",ref="#/components/schemas/DayOfWeek"),
     *                     @OA\Property(
     *                         property="start",
     *                         type="object",
     *                         description="Время начала работы",
     *                         @OA\Property(property="hours", type="integer", description="Часы (0-23)"),
     *                         @OA\Property(property="minutes", type="integer", description="Минуты (0-59)")
     *                     ),
     *                     @OA\Property(
     *                         property="end",
     *                         type="object",
     *                         description="Время окончания работы",
     *                         @OA\Property(property="hours", type="integer", description="Часы (0-23)"),
     *                         @OA\Property(property="minutes", type="integer", description="Минуты (0-59)")
     *                     )
     *                 )
     *             ),
     *                         @OA\Property(property="park", type="object",
     *                             @OA\Property(property="url", type="string"),
     *                             @OA\Property(property="commission", type="integer"),
     *                             @OA\Property(property="park_name", type="string"),
     *                             @OA\Property(property="about", type="string")
     *                         ),
     *                     ),
     *                 ),
     *                 @OA\Property(property="rent_term", type="object",
     *                     @OA\Property(property="deposit_amount_daily", type="number"),
     *                     @OA\Property(property="deposit_amount_total", type="number"),
     *                     @OA\Property(property="minimum_period_days", type="integer"),
     *                     @OA\Property(property="is_buyout_possible", type="integer"),
     *                     @OA\Property(property="schemas", type="array",
     *                         @OA\Items(
     *                             @OA\Property(property="daily_amount", type="integer"),
     *                             @OA\Property(property="non_working_days", type="integer"),
     *                             @OA\Property(property="working_days", type="integer"),
     *                         ),
     *                     ),
     *                 ),
     *             ),
     *         ),
     *     ),
     * ),
     *     @OA\Response(
     *         response="403",
     *         description="Пользователь не зарегистрирован или не верифицирован",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Пользователь не зарегистрирован или не верифицирован")
     *         )
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Машина не найдена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Машина не найдена")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор автомобиля для бронирования
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом бронирования
     */
    public function Book(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'schema_id' => 'required|integer'
        ]);

        $user = Auth::guard('sanctum')->user();

        // Проверка статуса пользователя
        // if ($user->user_status !== UserStatus::Verified->value) {
        //     return response()->json(['message' => 'Пользователь не зарегистрирован или не верифицирован'], 403);
        // }

        $schema = Schema::where('id', $request->schema_id)->first();
        if (!$schema) {
            return response()->json(['message' => 'Схема аренды не найдена'], 404);
        }
        $selectedCar = Car::where('id', $request->id)->with('booking', 'division', 'division.park')->first();

        if (!$selectedCar) {
            return response()->json(['message' => 'Машина не найдена'], 404);
        }

        if ($selectedCar->status !== CarStatus::AvailableForBooking->value) {
            $car = Car::where('division_id', $selectedCar->division_id)
                ->where('park_id', $selectedCar->park_id)
                ->where('tariff_id', $selectedCar->tariff_id)
                ->where('rent_term_id', $selectedCar->rent_term_id)
                ->where('fuel_type', $selectedCar->fuel_type)
                ->where('transmission_type', $selectedCar->transmission_type)
                ->where('brand', $selectedCar->brand)
                ->where('model', $selectedCar->model)
                ->where('year_produced', $selectedCar->year_produced)
                ->where('images', $selectedCar->images)
                ->where('status', CarStatus::AvailableForBooking->value)
                ->whereHas('booking', function ($query) {
                    $query->where('status', '!=', 1)
                        ->where('status', '!=', 3);
                })
                ->with('booking', 'division', 'division.park')
                ->first();
            if (!$car) {
                return response()->json(['message' => 'Машина не найдена'], 404);
            }
        } else {
            $car = $selectedCar;
        }

        $checkBook = Booking::where('driver_id', $user->driver->id)->where('status', BookingStatus::Booked->value)->first();

        if ($checkBook) {
            return response()->json(['message' => 'Уже есть активная бронь!'], 409);
        }

        $car->status = CarStatus::Booked->value;
        $car->save();

        $division = $car->division;
        $rent_time = $division->park->booking_window;
        $driver = $user->driver;

        //date_default_timezone_set('UTC');
        $workingHours = json_decode($division->working_hours, true);
        $divisionTimezone = $division->timezone_difference;
        $currentDayOfWeek = Carbon::now()->format('l');
        $currentTime = Carbon::now();
        $isNonWorkingDayToday = false;
        $todayWorkingHours = null;

        foreach ($workingHours as $workingDay) {
            if ($workingDay['day'] === $currentDayOfWeek) {
                $todayWorkingHours = $workingDay;
                break;
            }
        }
        if (!$todayWorkingHours) {
            $isNonWorkingDayToday = true;
        }
        if ($todayWorkingHours) {
            $endTimeOfWorkDayToday = Carbon::createFromTime($todayWorkingHours['end']['hours'], $todayWorkingHours['end']['minutes'], 0)->addHours(-$rent_time - $divisionTimezone);
            $startTimeOfWorkDayToday = Carbon::createFromTime($todayWorkingHours['start']['hours'], $todayWorkingHours['start']['minutes'], 0)->addHours(-$rent_time - $divisionTimezone);
        } else {
            $endTimeOfWorkDayToday = null;
            $startTimeOfWorkDayToday = null;
        }

        if ((($endTimeOfWorkDayToday < $currentTime && $currentTime > $startTimeOfWorkDayToday) || $isNonWorkingDayToday)) {

            $nextWorkingDayInfo = $this->findNextWorkingDay(Carbon::now()->format('l'), $workingHours);
            $nextWorkingDay = Carbon::now()->next($nextWorkingDayInfo['day']);

            $startTimeOfWorkDayTomorrow = Carbon::create($nextWorkingDay->year, $nextWorkingDay->month, $nextWorkingDay->day, $nextWorkingDayInfo['start']['hours'], $nextWorkingDayInfo['start']['minutes'], 0);
            $newEndTime = $startTimeOfWorkDayTomorrow->addHours($rent_time - $divisionTimezone);
        } elseif ($currentTime < $startTimeOfWorkDayToday) {
            $newEndTime = $startTimeOfWorkDayToday->addHours($rent_time);
        } else {
            $newEndTime = $currentTime->addHours($rent_time);
        }
        $booking = new Booking();
        $booking->car_id = $request->id;
        $booking->park_id = $division->park_id;
        $booking->schema_id = $schema->id;
        $booking->booked_at = Carbon::now()->toIso8601ZuluString();
        $booking->booked_until = Carbon::parse($newEndTime)->toIso8601ZuluString();
        $booking->status = BookingStatus::Booked->value;
        $booking->driver_id = $driver->id;
        $booking->save();

        $customStatusBooked = Status::where('status_value', CarStatus::Booked->value)->where('park_id', $car->park_id)->first();
        if ($customStatusBooked) {
            if ($car->status_id) {
                $car->old_status_id = $car->status_id;
            }
            $car->status_id = $customStatusBooked->id;
        }
        $car->save();

        $workingHours = json_decode($car->division->working_hours, true);

        $car->division->working_hours = $workingHours;
        $booked = $booking;
        $booked->status = BookingStatus::from($booked->status)->name;
        $booked->start_date = $booked->booked_at;
        $booked->end_date = $booked->booked_until;
        $booked->car = $car;
        $booked->car->сar_class = CarClass::from($car->tariff->class)->name;
        $booked->car->transmission_type = TransmissionType::from($booked->car->transmission_type)->name;
        $booked->car->images = json_decode($booked->car->images);
        $booked->car->fuel_type = FuelType::from($booked->car->fuel_type)->name;
        $booked->rent_term = RentTerm::where('id', $car->rent_term_id)
            ->with(['schemas' => function ($query) use ($booked) {
                $query->where('id', $booked->schema_id);
            }])
            ->select('deposit_amount_daily', 'deposit_amount_total', 'minimum_period_days', 'is_buyout_possible', 'id')
            ->first();

$divisionId=$car->division->id;

        unset(
            $booked->created_at,
            $booked->updated_at,
            $booked->booked_at,
            $booked->booked_until,
            $booked->park_id,
            $booked->driver_id,
            $car->booking,
            $car->created_at,
            $car->updated_at,
            $car->status,
            $car->car_id,
            $car->division_id,
            $car->park_id,
            $car->tariff_id,
            $car->rent_term_id,
            $car->division->id,
            $car->division->park_id,
            $car->division->city_id,
            $car->division->created_at,
            $car->division->updated_at,
            $car->division->name,
            $car->division->park->id,
            $car->division->park->id,
            $car->division->park->API_key,
            $car->division->park->created_at,
            $car->division->park->updated_at,
            $car->tariff,
            $car->division->park->created_at,
            $booked->rent_term->id
        );
        foreach ($booked->rent_term->schemas as $schema) {
            unset($schema->created_at, $schema->updated_at, $schema->id, $schema->rent_term_id);
        }

        $kanban = new KanbanController;
        $request->merge([
            'division_id' => $divisionId,
            'driver_user_id'=> $user->id,
            'booking_id'=>$booking->id
        ]);
        $applicationId = $kanban->createApplication($request);
        $request->merge([
            'type'=>ApplicationLogType::Create->value,
            'creator'=>'Водитель',
            'creator_id'=>$user->id,
            'id'=>$applicationId
        ]);
        $kanban->createApplicationsLogItem($request);

        $api = new APIController;
        $api->notifyParkOnBookingStatusChanged($booking->id, true, $schema);

        return response()->json(['booking' => $booking], 200);
    }

    private function findNextWorkingDay($currentDay, $workingHours)
    {
        $nextDay = Carbon::now()->addDay();
        for ($i = 0; $i < 7; $i++) {
            $nextDayName = $nextDay->format('l');
            $nextDayInfo = collect($workingHours)->firstWhere('day', $nextDayName);
            if ($nextDayInfo) {
                return $nextDayInfo;
            }
            $nextDay->addDay();
        }
        return null;
    }

    /**
     * Отмена бронирования автомобиля (аутентифицированный запрос)
     *
     * @OA\Post(
     *     path="/auth/cars/cancel-booking",
     *     operationId="cancelBooking",
     *     summary="Отмена бронирования автомобиля (аутентифицированный запрос)",
     *     tags={"Cars"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="Идентификатор автомобиля, для которого необходимо отменить бронирование"),
     *             @OA\Property(property="reason", type="string", description="Причина отмены")
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Сообщение об успешной отмене бронирования")
     *         ),
     *     ),
     *     @OA\Response(
     *         response="401",
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Требуется аутентификация для выполнения запроса")
     *         )
     *     ),
     *     @OA\Response(
     *         response="403",
     *         description="Ошибка доступа",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="У вас нет разрешения на выполнение этого действия")
     *         )
     *     ),
     *     @OA\Response(
     *         response="404",
     *         description="Машина не найдена",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Автомобиль с указанным идентификатором не найден")
     *         )
     *     ),
     *     @OA\Response(
     *         response="409",
     *         description="Машина не забронирована",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Машина не забронирована")
     *         )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор автомобиля для отмены бронирования
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом отмены бронирования
     */
    public function cancelBooking(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'reason' => 'required|string'
        ]);
        $user = Auth::guard('sanctum')->user();
        $booking = Booking::where('id', $request->id)->with('car')->first();
        if (!$booking) {
            return response()->json(['message' => 'Бронь не найдена'], 404);
        }
        if ($booking->status !== BookingStatus::Booked->value) {
            return response()->json(['message' => 'Статус не "забронирован"'], 409);
        }
        //date_default_timezone_set('UTC');
        $car = $booking->car;
        $booking->booked_until = Carbon::now()->toIso8601ZuluString();

        $reason = null;
        if ($request->reason) {
            $reason = $request->reason;
            $booking->cancellation_reason = $reason;
        }
        $booking->cancellation_source = CancellationSources::Driver->value;
        $booking->status = BookingStatus::UnBooked->value;
        $booking->save();

        $customStatusAvailable = Status::where('status_value', CarStatus::AvailableForBooking->value)->where('park_id', $car->park_id)->first();
        if ($customStatusAvailable) {
            $car->status_id = $customStatusAvailable->id;
        }
        $car->status = CarStatus::AvailableForBooking->value;
        $car->save();

        $kanban = new KanbanController;
        $application= Application::where('booking_id',$booking->id)->first();
        $request->merge([
            'type'=>ApplicationLogType::Content->value,
            'column'=>'current_stage',
            'old_content'=>$application->current_stage,
            'new_content'=>ApplicationStage::ReservationCanceled->value,
            'id'=>$application->id,
            'advertising_source'=>"BeeBeep"
        ]);
        $application->current_stage =ApplicationStage::ReservationCanceled->value;
        $application->save();
        $kanban->createApplicationsLogItem($request);

        $api = new APIController;
        $api->notifyParkOnBookingStatusChanged(booking_id: $booking->id, is_booked: false, fromDriver: true, reason: $reason);
        return response()->json(['message' => 'Бронирование автомобиля успешно отменено'], 200);
    }

    /**
     * Показать список брендов
     *
     * @OA\Post(
     *     path="/cars/app-data",
     *     operationId="getFinderFilterData",
     *     summary="Показать список брендов",
     *     tags={"Cars"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
      *         @OA\Property(property="metros", type="array",
*             @OA\Items(
*                 @OA\Property(property="station", type="string"),
*                 @OA\Property(property="colors", type="array", @OA\Items(type="string")),
*             )
*         ),
     * @OA\Property(property="brands", type="array",
     * @OA\Items(
     *                             @OA\Property(property="name", type="string"),
     *                             @OA\Property(property="models", type="array", @OA\Items(type="string")),
     *                         )),
     * @OA\Property(property="avito_ids", type="array",
     * @OA\Items(
     *                             @OA\Property(property="park", type="string"),
     *                             @OA\Property(property="avito_id", type="string"),
     *                         )),
     *                 @OA\Property(property="parks", type="array", @OA\Items(type="string")),
     *                 )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор автомобиля для отмены бронирования
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом отмены бронирования
     */
    public function getFinderFilterData()
    {
        $cars = Car::where('division_id',"!=",null)->with(['division.park', 'division.city'])->orderBy('brand')->orderBy('model')->get(['id', 'brand', 'model', 'division_id']);

        $brandList = $cars->groupBy('brand')->map(function ($group) {
            return [
                'name' => $group->first()->brand,
                'models' => $group->pluck('model')->unique()->sort()->values()->all()
            ];
        })->values()->all();



        $parkList = $cars->pluck('division.park.park_name')->unique()->sort()->values()->all();
        $avito_ids = [];

        $metro = $cars->first()->division->city->metro;
        if ($metro) {
            $cityData = json_decode($cars->first()->division->city->metro)->lines;
        $stationColors = [];
        foreach ($cityData as $line) {
            foreach ($line->stations as $station) {
                if (!isset($stationColors[$station])) {
                    $stationColors[$station] = [];
                }
                $stationColors[$station][] = $line->color;
            }
        }

        }

        $uniqueStations = [];
        $metroList = [];

        foreach ($cars as $car) {
            $division = $car->division;
            if ($division && $division->park && $division->city->metro) {
                $parkName = $division->park->park_name;
                $avitoId = $division->park->avito_id;
                if (!array_key_exists($parkName, $avito_ids)) {
                    $avito_ids[$parkName] = ['park' => $parkName, 'avito_id' => $avitoId];
                }
                if ($metro) {
                   $matchingStation = $division->metro;
                if (array_key_exists($matchingStation, $stationColors) && !in_array($matchingStation, $uniqueStations)) {
                    $colors = $stationColors[$matchingStation];
                    $metroList[] = ["station" => $matchingStation, "colors" => array_unique($colors)];
                    $uniqueStations[] = $matchingStation;
                }
                }

            }
        }

        $avito_ids = array_values($avito_ids);

        return response()->json(['brands' => $brandList, 'parks' => $parkList, 'avito_ids' => $avito_ids, 'metros' => $metroList]);
    }

    /**
     * Проверить активную бронь
     *
     * @OA\Post(
     *     path="/driver/booking/check",
     *     operationId="checkActiveBookingDriver",
     *     summary="Проверить активную бронь",
     *     tags={"Driver"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="Идентификатор брони")
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="result", type="boolean", description="Результат проверки активной брони (true/false)")
     *         )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор брони для проверки
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом проверки активной брони (true/false)
     */



    public function checkActiveBookingDriver(Request $request)
    {
        $bookingStatus = Booking::where('id', $request->id)->select('id', 'status')->first()->status;
        if ($bookingStatus === BookingStatus::Booked->value) {
            return response()->json(['result' => false], 200);
        }
        return response()->json(['result' => true], 200);
    }


        /**
     * Создать заявку в канбан
     *
     * @OA\Post(
     *     path="/driver/application",
     *     operationId="createApplicationDriver",
     *     summary="Создать заявку в канбан",
     *     tags={"Driver"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="car_id", type="integer", description="id машины"),
     *             @OA\Property(property="phone", type="string", description="Модель авто")
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="успешно")
     *         )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор брони для проверки
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом проверки активной брони (true/false)
     */



     public function createApplicationDriver(Request $request)
     {
        $driver_user= User::where('phone',$request->phone)->firstOrCreate();
        if (!$driver_user->phone) {
            $driver_user->phone=$request->phone;
            $driver_user->save();
        }
        $driver_user_id=$driver_user->id;
 $car = Car::where('id', $request->car_id)->with('division')->first();
        $request->merge([
            'driver_user_id'=> $driver_user_id,
            'division_id'=>$car->division->id,
            'chosen_brand'=>$car->brand,
            'chosen_model'=>$car->model
        ]);
        $kanban = new KanbanController;
        $applicationId = $kanban->createApplication($request);
        $request->merge([
            'type'=>ApplicationLogType::Create->value,
            'creator'=>'Водитель',
            'creator_id'=>$driver_user_id,
            'id'=>$applicationId
        ]);
        $kanban->createApplicationsLogItem($request);
        return response()->json(['id' => $applicationId]);
     }
}

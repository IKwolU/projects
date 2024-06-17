<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationLogType;
use App\Enums\ApplicationStage;
use App\Enums\BookingStatus;
use App\Enums\CancellationSources;
use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\ParkInventoryTypes;
use App\Enums\TransmissionType;
use App\Enums\UserRole;
use App\Enums\UserType;
use App\Models\Application;
use App\Models\ApplicationLog;
use App\Models\ApplicationLogs;
use App\Models\Booking;
use App\Models\Car;
use App\Models\Division;
use App\Models\Manager;
use App\Models\Park;
use App\Models\ParkInventory;
use App\Models\RentTerm;
use App\Models\Request as ModelsRequest;
use App\Models\Schema;
use App\Models\Status;
use App\Models\Tariff;
use App\Models\User;
use App\Services\FileService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class ManagerController extends Controller
{
    /**
     * Показать список парков
     *
     * @OA\Get(
     *     path="manager/park",
     *     operationId="getParkManager",
     *     summary="Показать парк",
     *     tags={"Manager"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="park",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="url", type="string", description="Endpoint парка для ответа"),
     *                     @OA\Property(property="commission", type="number", description="Комиссия парка"),
     *                     @OA\Property(property="api_key", type="string", description="ключ"),
       * @OA\Property(
 *     property="metro_lines",
 *     type="object",
 *     @OA\Property(
 *         property="city",
 *         type="string"),
 *     @OA\Property(
 *         property="stations",
 *         type="array",
 *         @OA\Items(
 *             type="string"))
 * ),
     *                     @OA\Property(property="booking_window", type="integer", description="Время брони парка"),
     *                     @OA\Property(property="park_name", type="string", description="Название парка"),
     *                     @OA\Property(property="about", type="string", description="Описание парка"),
     *                     @OA\Property(property="avito_id", type="string", description="id avito"),
     *                     @OA\Property(property="created_at", type="string", description="Дата создания парка"),
     *                     @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо парка"),
     *                     @OA\Property(property="self_employed_discount", type="number", description="Скидка парка для самозанятых"),
     *                             @OA\Property(
     *                                 property="cars",
     *                                 type="array",
     *                                 description="Список автомобилей в отделении",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="id", type="integer", description="id автомобиля"),
     *                                     @OA\Property(property="tariff_id", type="integer", description="id тарифа"),
     *                                     @OA\Property(property="division_id", type="integer", description="id Подразделения"),
     *                                     @OA\Property(property="division_name_info", type="string", description="найменование Подразделения"),
     *                                     @OA\Property(property="mileage", type="number", description="Пробег автомобиля"),
     *                                     @OA\Property(property="license_plate", type="string", description="Государственный номер автомобиля"),
     *                                     @OA\Property(property="rent_term_id", type="integer", description="id условия аренды"),
     *                                     @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                                     @OA\Property(property="transmission_type", type="string", description="Тип коробки передач",ref="#/components/schemas/TransmissionType"),
     *                                     @OA\Property(property="brand", type="string", description="Марка автомобиля"),
     *                                     @OA\Property(property="model", type="string", description="Модель автомобиля"),
     *                                     @OA\Property(property="year_produced", type="integer", description="Год выпуска автомобиля"),
     *                                     @OA\Property(property="vin", type="string", description="vin автомобиля"),
     *                                     @OA\Property(property="status_id", type="integer", description="status_id автомобиля"),
     *                                     @OA\Property(property="images", type="array", description="Ссылки на изображения автомобиля",
     *                                         @OA\Items(type="string")
     *                                     ),
     *                                     @OA\Property(property="status", type="string", description="Статус доступности для бронирования",ref="#/components/schemas/CarStatus"),
     *                                     @OA\Property(property="created_at", type="string", description="Дата создания записи об автомобиле"),
     *                                     @OA\Property(property="updated_at", type="string", description="Последнее обновление записи об автомобиле"),
     *                                     @OA\Property(
     *                                          property="booking",
     *                                          type="array",
     *                                          description="Список бронирований для данного автомобиля",
     *                                          @OA\Items(
     *                                              type="object",
     *                                              @OA\Property(property="id", type="integer", description="id бронирования"),
     *                                              @OA\Property(property="status", type="integer", description="статус бронирования"),
     *                                              @OA\Property(property="schema_id", type="integer", description="id схемы"),
     *                                              @OA\Property(property="car_id", type="integer", description="id автомобиля"),
     *                                              @OA\Property(property="driver_id", type="integer", description="id водителя"),
     *                                              @OA\Property(property="booked_at", type="string", format="datetime", description="дата и время начала бронирования"),
     *                                              @OA\Property(property="booked_until", type="string", format="datetime", description="дата и время окончания бронирования"),
     *                                              @OA\Property(property="park_id", type="integer", description="id парка"),
     *                                              @OA\Property(property="created_at", type="string", format="datetime", description="дата создания записи"),
     *                                              @OA\Property(property="updated_at", type="string", format="datetime", description="дата последнего обновления записи")
     *                                          )
     *                                          )
     *                                 )
     *                             ),
     *                     @OA\Property(
     *                         property="divisions",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", description="id отделения"),
     *                             @OA\Property(property="coords", type="string", description="Координаты отделения"),
     *                             @OA\Property(property="address", type="string", description="Адрес отделения"),
     *                             @OA\Property(property="metro", type="string", description="Станция метро ближайшая к отделению"),
     *                             @OA\Property(
     *                                 property="working_hours",
     *                                 type="array",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="day", type="string", description="День недели"),
     *                                     @OA\Property(
     *                                         property="end",
     *                                         type="object",
     *                                         @OA\Property(property="hours", type="integer", description="Час окончания"),
     *                                         @OA\Property(property="minutes", type="integer", description="Минуты окончания")
     *                                     ),
     *                                     @OA\Property(
     *                                         property="start",
     *                                         type="object",
     *                                         @OA\Property(property="hours", type="integer", description="Час начала"),
     *                                         @OA\Property(property="minutes", type="integer", description="Минуты начала")
     *                                     )
     *                                 ),
     *                                 description="Рабочие часы отделения"
     *                             ),

     *                             @OA\Property(property="timezone_difference", type="integer", description="Разница во времени"),
     *                             @OA\Property(property="created_at", type="string", description="Дата создания отделения"),
     *                             @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо отделения"),
     *                             @OA\Property(property="name", type="string", description="Название отделения"),
     *                             @OA\Property(property="phone", type="string", description="Телефон отделения"),
     *                             @OA\Property(property="city", type="string", description="Город, в котором находится отделение")
     *                     )
     *                 ),
     *                      @OA\Property(
     *                         property="rent_terms",
     *                         type="array",
     *                         description="Список тарифов аренды",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", description="id тарифа"),
     *                             @OA\Property(property="deposit_amount_daily", type="string", description="Сумма депозита на день"),
     *                             @OA\Property(property="deposit_amount_total", type="string", description="Общая сумма депозита"),
     *                             @OA\Property(property="minimum_period_days", type="integer", description="Минимальный период аренды в днях"),
     *                             @OA\Property(property="name", type="string", description="Название тарифа"),
     *                             @OA\Property(property="is_buyout_possible", type="integer", description="Возможность выкупа"),
     *                             @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *                             @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи"),
     *                             @OA\Property(
     *                                 property="schemas",
     *                                 type="array",
     *                                 description="Схемы тарифов",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="id", type="integer", description="id схемы"),
     *                                     @OA\Property(property="daily_amount", type="number", description="Сумма за день"),
     *                                     @OA\Property(property="non_working_days", type="integer", description="Количество нерабочих дней"),
     *                                     @OA\Property(property="working_days", type="integer", description="Количество рабочих дней"),
     *                                     @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *                                     @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи")
     *                                 )
     *                             )
     *                         )
     *                      ),
     *                      @OA\Property(
     *                          property="tariffs",
     *                          type="array",
     *                          description="Список тарифов",
     *                          @OA\Items(
     *                              type="object",
     *                              @OA\Property(property="id", type="integer", description="id тарифа"),
     *                              @OA\Property(property="class", type="string", description="Класс" , ref="#/components/schemas/CarClass"),
     *                              @OA\Property(property="city", type="string", description="Город"),
     *                              @OA\Property(property="criminal_ids", type="string", description="id преступлений"),
     *                              @OA\Property(property="has_caused_accident", type="integer", description="Было ли аварий"),
     *                              @OA\Property(property="experience", type="integer", description="Опыт"),
     *                              @OA\Property(property="max_fine_count", type="integer", description="Максимальное количество штрафов"),
     *                              @OA\Property(property="abandoned_car", type="integer", description="Брошенный автомобиль"),
     *                              @OA\Property(property="min_scoring", type="integer", description="Минимальный балл"),
     *                              @OA\Property(property="is_north_caucasus", type="integer", description="Северный Кавказ"),
     *                              @OA\Property(property="forbidden_republic_ids", type="string", description="Запрещенные республики"),
     *                              @OA\Property(property="alcohol", type="integer", description="Алкоголь"),
     *                              @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *                              @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи")
     *                          )
     *                      ))))),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера ")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор автомобиля для отмены бронирования
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом отмены бронирования
     */
    public function getParkManager(Request $request)
    {

        $park = Park::where('id', $request->park_id)->with('divisions', 'divisions.city', 'rent_terms', 'tariffs', 'tariffs.city', 'rent_terms.schemas', 'cars', 'divisions.cars.booking')->first();

        unset($park->API_key,$park->password_1c,$park->login_1c,$park->status_api_tocken);

        $park->metro_lines = [];
        $divisionsByCity = [];
        foreach ($park->divisions as $division) {
            $division->working_hours = json_decode($division->working_hours);
            $city = $division->city->name;
            $division->metro_lines = json_decode($division->city->metro);

            if (!isset($divisionsByCity[$city])) {
                $divisionsByCity[$city] = [];
            }

            $divisionsByCity[$city][] = $division;
            $division->city = $city;
            unset($division->city, $division->park_id, $division->city_id);
        }

        foreach ($divisionsByCity as $city => $divisions) {
            $cityMetroLines = [];
            foreach ($divisions as $division) {
                $uniqueStations = [];
                if ($division->metro_lines) {
                    foreach ($division->metro_lines->lines as $line) {
                    $uniqueStations = array_merge($uniqueStations, $line->stations);
                }
                }

                $uniqueStations = array_unique($uniqueStations);
                $cityMetroLines[$city] = ['city' => $city, 'stations' => array_values($uniqueStations)];
                unset($division->metro_lines);
            }
            $park->metro_lines = array_merge($park->metro_lines, $cityMetroLines);
        }

        $park->metro_lines = array_values($park->metro_lines);

        foreach ($park->cars as $car) {
            $car->images = json_decode($car->images);
            $car->fuel_type = FuelType::from($car->fuel_type)->name;
            $car->transmission_type = TransmissionType::from($car->transmission_type)->name;
            $car->status = CarStatus::from($car->status)->name;
            $car->vin = $car->car_id;
            unset($car->park_id, $car->forbidden_republic_ids, $car->car_id);
        }
        foreach ($park->rent_terms as $rent_term) {
            unset($rent_term->park_id);
            foreach ($rent_term->schemas as $schema) {
                unset($schema->rent_term_id);
            }
        }
        foreach ($park->tariffs as $tariff) {
            $city = $tariff->city->name;
            unset($tariff->city, $tariff->park_id, $tariff->city_id);
            $tariff->class = CarClass::from($tariff->class)->name;
            $tariff->city = $city;
        }


        return response()->json(['park' => $park], 200);
    }

    /**
     * Показать ключ
     *
     * @OA\Get(
     *     path="manager/park/key",
     *     operationId="getParkKeyManager",
     *     summary="Показать ключ",
     *     tags={"Manager"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="API_key",type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response="500",
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", description="Внутренняя ошибка сервера ")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий идентификатор автомобиля для отмены бронирования
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом отмены бронирования
     */

    public function getParkKeyManager(Request $request)
    {
        $key = Park::where('id', $request->park_id)->select('API_key')->first();
        return response()->json($key, 200);
    }


/**
     * Обновление информации о парке
     *
     * Этот метод позволяет обновлять информацию о парке.
     *
     * @OA\Put(
     *     path="manager/parks",
     *     operationId="updateParkInfoManager",
     *     summary="Обновление информации о парке",
     *     tags={"API"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="url", type="string", description="URL парка"),
     *             @OA\Property(property="commission", type="number", description="Комиссия"),
     *             @OA\Property(property="park_name", type="string", description="Название парка"),
     *             @OA\Property(property="booking_window", type="number", description="Срок на который можно забронировать авто, в часах"),
     *             @OA\Property(property="about", type="string", description="Описание парка"),
     *             @OA\Property(property="avito_id", type="string", description="id avito"),
     *             @OA\Property(property="self_employed_discount", type="integer", description="Скидка от парка при работе с самозанятыми(не обязателньое поле)"),
     *     )),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление информации о парке",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Парк обновлен")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Неверный ключ авторизации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка валидации"),
     *             @OA\Property(property="errors", type="object", example={
     *                 "url": {"Поле url должно быть строкой."},
     *                 "commission": {"Поле commission должно быть числом."},
     *                 "park_name": {"Поле park_name должно быть строкой."},
     *                 "about": {"Поле about должно быть строкой."},
     *                 "working_hours": {"Поле working_hours должно быть в формате JSON."},
     *                 "phone": {"Поле phone должно быть строкой."},
     *             })
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления информации о парке
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */

    public function updateParkInfoManager(Request $request)
    {
        return $this->callRoute('/parks', 'PUT', $request->all(), $request->key);
    }
    /**
     * Добавить несколько автомобилей
     *
     * @OA\Post(
     *     path="/manager/cars",
     *     operationId="pushCarsManager",
     *     summary="Добавить несколько автомобилей, все добавленные автомобили будут доступны к бронированию сразу после привязки к ним Условий бронирования (метод: /cars/rent-term). Выполнение метода возможно только после выполнения методов: обновление информации о парке, создание подразделения, создание тарифа. Статус допуска в бронированию по умолчанию будет 'допущено'",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="cars",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="string", maxLength=17, description="VIN-номер автомобиля"),
     *                     @OA\Property(property="division_id", type="integer", maxLength=250, description="id подразделения"),
     *                     @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                     @OA\Property(property="transmission_type", type="string", description="Тип трансмиссии",ref="#/components/schemas/TransmissionType"),
     *                     @OA\Property(property="brand", type="string", maxLength=50, description="Бренд автомобиля"),
     *                     @OA\Property(property="model", type="string", maxLength=80, description="Модель автомобиля"),
     *                     @OA\Property(property="mileage", type="number", description="Пробег автомобиля"),
     *                     @OA\Property(property="license_plate", type="string", description="Госномер автомобиля"),
     *                     @OA\Property(property="car_class", type="string", description="Класс автомобиля (1 - Эконом, 2 - Комфорт, 3 - Комфорт+, 4 - Бизнес)",ref="#/components/schemas/CarClass"),
     *                     @OA\Property(property="year_produced", type="integer", description="Год выпуска автомобиля"),
     *                     @OA\Property(property="images", type="array", @OA\Items(type="string"), description="Ссылки на фотографии автомобиля")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное добавление автомобилей",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Автомобили успешно добавлены")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Неверные или недостающие параметры в запросе"),
     *             @OA\Property(property="errors", type="object", nullable=true, description="Список ошибок валидации")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий информацию о добавляемых автомобилях
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом добавления автомобилей
     */
    public function pushCarsManager(Request $request)
    {
        $newCars = [];
        foreach ($request->cars as $car) {
            $car['transmission_type']=TransmissionType::{$car['transmission_type']}->value;
            $car['fuel_type']=FuelType::{$car['fuel_type']}->value;
            $car['class']=CarClass::{$car['car_class']}->value;
            $newCars[] = $car;
        }
        $request->merge(['cars' => $newCars]);
        return $this->callRoute('/cars', 'POST', $request->all(), $request->key);
    }

    /**
     * Обновление информации о машине
     *
     * @OA\Put(
     *     path="/manager/cars",
     *     operationId="updateCarManager",
     *     summary="Обновление информации о машине",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="string", maxLength=20, description="VIN-номер машины"),
     *             @OA\Property(property="division_id", type="integer", maxLength=250, description="id подразделения"),
     *             @OA\Property(property="mileage", type="number", description="Пробег автомобиля"),
     *             @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *             @OA\Property(property="license_plate", type="string", description="Госномер автомобиля"),
     *             @OA\Property(property="car_class", type="string", description="Класс автомобиля (1 - Эконом, 2 - Комфорт, 3 - Комфорт+, 4 - Бизнес)",ref="#/components/schemas/CarClass"),
     *             @OA\Property(property="images", type="array", @OA\Items(type="string"), nullable=true, description="Изображения машины"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление информации о машине",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Машина успешно обновлена")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "id": {"Поле id обязательно для заполнения."},
     *                 "city": {"Поле city должно быть строкой."}
     *             })
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий информацию об обновляемой машине
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом обновления информации о машине
     */
    public function updateCarManager(Request $request)
    {
        $request->merge([
            'fuel_type'=>FuelType::{$request->fuel_type}->value
        ]);
        return $this->callRoute('/cars', 'PUT', $request->all(), $request->key);
    }

    /**
     * Обновление условия аренды для автомобиля
     *
     * Этот метод позволяет обновлять условие аренды для конкретного автомобиля по его VIN-номеру.
     *
     * @OA\Put(
     *     path="/manager/cars/rent-term",
     *     operationId="updateCarRentTermManager",
     *     summary="Обновление условия аренды для автомобиля",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="string", description="VIN-номер автомобиля"),
     *             @OA\Property(property="rent_term_id", type="integer", description="Идентификатор условия аренды")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление условия аренды для автомобиля",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Условие аренды успешно обновлено для автомобиля")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "rent_term_id": {"Поле rent_term_id обязательно для заполнения и должно быть целым числом."},
     *                 "id": {"Поле id обязательно для заполнения и должно быть целым числом."}
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Условие аренды или автомобиль не найдены",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Условие аренды или автомобиль не найдены")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function updateCarRentTermManager(Request $request)
    {
        return $this->callRoute('/cars/rent-term', 'PUT', $request->all(), $request->key);
    }

    /**
     * Обновление статуса допуска к бронированию автомобиля
     *
     * @OA\Put(
     *     path="/manager/cars/status",
     *     operationId="updateCarStatusManager",
     *     summary="Обновление статуса допуска к бронированию",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="string", maxLength=20, description="VIN-номер автомобиля"),
     *             @OA\Property(property="status", type="integer", description="Допуск автомобиля к бронированию. 1 - допущен, 0 - заблокирован",ref="#/components/schemas/CarStatus")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление статуса автомобиля",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Статус автомобиля успешно обновлен")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "id": {"Поле id обязательно для заполнения."},
     *                 "status": {"Поле status должно быть числом."}
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="Конфликт",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Автомобиль сейчас забронирован, изменение статуса невозможно")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса, содержащий информацию об обновляемом статусе автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом обновления статуса автомобиля
     */
    public function updateCarStatusManager(Request $request)
    {
        $request->merge(['status'=>CarStatus::{$request->status}->value]);
        return $this->callRoute('/cars/status', 'PUT', $request->all(), $request->key);
    }

    /**
     * Создание или обновление условий аренды
     *
     * Этот метод позволяет создавать новые или обновлять существующие условия аренды для парков.
     *
     * @OA\Post(
     *     path="/manager/parks/rent-terms",
     *     operationId="createOrUpdateRentTermManager",
     *     summary="Создание или обновление условий аренды",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="rent_term_id", type="integer", nullable=true, description="Идентификатор существующего условия аренды (для обновления)"),
     *             @OA\Property(property="deposit_amount_daily", type="number", description="Сумма ежедневного залога"),
     *             @OA\Property(property="deposit_amount_total", type="number", description="Общая сумма залога"),
     *             @OA\Property(property="is_buyout_possible", type="boolean", description="Возможность выкупа (true/false)"),
     *             @OA\Property(property="minimum_period_days", type="integer", description="Минимальный период аренды в днях"),
     *             @OA\Property(property="name", type="string", description="Название условия аренды"),
     *             @OA\Property(
     *                 property="schemas",
     *                 type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="daily_amount", type="number", format="float", description="Стоимость аренды авто"),
     *                     @OA\Property(property="non_working_days", type="integer", description="Количество нерабочих дней"),
     *                     @OA\Property(property="working_days", type="integer", description="Количество рабочих дней")
     *                 ),
     *                 description="Схемы аренды"
     *             ),
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное создание или обновление условий аренды",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Условие аренды успешно создано или изменено"),
     *             @OA\Property(property="id", type="integer", example="Идентификатор условия аренды")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "deposit_amount_daily": {"Поле deposit_amount_daily обязательно для заполнения и должно быть числом."},
     *                 "deposit_amount_total": {"Поле deposit_amount_total обязательно для заполнения и должно быть числом."},
     *                 "is_buyout_possible": {"Поле is_buyout_possible обязательно для заполнения и должно быть булевым значением."},
     *                 "minimum_period_days": {"Поле minimum_period_days обязательно для заполнения и должно быть целым числом."},
     *                 "name": {"Поле name обязательно для заполнения и должно быть строкой."},
     *                 "schemas": {"Поле schemas обязательно для заполнения и должно быть массивом строк."},
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Парк с указанным API ключом не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Парк не найден")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для создания или обновления условий аренды
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function createOrUpdateRentTermManager(Request $request)
    {
        return $this->callRoute('/parks/rent-terms', 'POST', $request->all(), $request->key);
    }

    /**
     * Создание подразделения парка
     *
     * Этот метод позволяет создавать подразделение в парке.
     *
     * @OA\Post(
     *     path="/manager/parks/division",
     *     operationId="createParkDivisionManager",
     *     summary="Создание подразделения парка",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="city", type="string", description="Город подразделения"),
     *             @OA\Property(property="coords", type="string", description="Координаты подразделения"),
     *             @OA\Property(property="address", type="string", description="Адрес подразделения"),
     *             @OA\Property(property="metro", type="string", description="Название ближайшего метро"),
     *             @OA\Property(property="name", type="string", description="Название подразделения"),
     *             @OA\Property(property="phone", type="string", description="Телефон парка"),
     *             @OA\Property(property="timezone_difference", type="integer", description="Часовой пояс, разница во времени с +0"),
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
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное создание подразделения",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Подразделение создано"),
     *             @OA\Property(property="id", type="integer", example="Идентификатор созданного подразделения")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Неверный ключ авторизации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка валидации"),
     *             @OA\Property(property="errors", type="object", example={
     *                 "city": {"Поле city обязательно для заполнения и должно быть строкой."},
     *                 "coords": {"Поле coords обязательно для заполнения и должно быть строкой."},
     *                 "address": {"Поле address обязательно для заполнения и должно быть строкой."},
     *                 "name": {"Поле name обязательно для заполнения и должно быть строкой."},
     *             })
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для создания подразделения
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function createParkDivisionManager(Request $request)
    {
        return $this->callRoute('/parks/division', 'POST', $request->all(), $request->key);
    }

    /**
     * Требования к кандидатам
     *
     * Этот метод позволяет создавать новые тарифы авто с критериями блокерами для парков. В одном городе для парка может быть толкьо один тариф заданного класса.
     *
     * @OA\Post(
     *     path="/manager/parks/tariff",
     *     operationId="createTariffManager",
     *     summary="Требования к кандидатам",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="class", type="integer", nullable=true, description="Тариф машины (1 - эконом, 2 - комфорт, 3 - комфорт+, 4 - бизнес)",ref="#/components/schemas/CarClass"),
     *             @OA\Property(property="city", type="string", description="Город тарифа"),
     *             @OA\Property(property="has_caused_accident", type="bool", description="Участие в ДТП, true/false"),
     *             @OA\Property(property="experience", type="integer", description="Минимальный опыт вождения"),
     *             @OA\Property(property="max_fine_count", type="integer", description="Максимальное количество штрафов"),
     *             @OA\Property(property="abandoned_car", type="bool", description="Бросал ли машину, true/false"),
     *             @OA\Property(property="min_scoring", type="integer", description="минимальный скоринг"),
     *             @OA\Property(property="is_north_caucasus", type="bool", description="Права выданы в Северном Кавказе"),
     *             @OA\Property(property="criminal_ids", type="array", description="Массив запрещенных республик", @OA\Items(type="string")),
     *             @OA\Property(property="alcohol", type="bool", description="Принимает ли что-то водитель, алкоголь/иное, true/false")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное создание  тарифа",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Тариф успешно создан"),
     *             @OA\Property(property="id", type="integer", example="Идентификатор тарифа")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Парк с указанным API ключом не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Парк не найден")
     *         )
     *     ),
     *     @OA\Response(
     *         response=409,
     *         description="В этом городе уже есть такой тариф",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="В этом городе уже есть такой тариф")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для создания или обновления условий аренды
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function createTariffManager(Request $request)
    {
        $request->merge([
            'class'=>CarClass::{$request->class}->value
        ]);
        return $this->callRoute('/parks/tariff', 'POST', $request->all(), $request->key);
    }

    /**
     * Обновление требований к кандидатам
     *
     * Этот метод позволяет обновлять тарифы авто с критериями блокерами для парков.
     *
     * @OA\Put(
     *     path="/manager/parks/tariff",
     *     operationId="updateTariffManager",
     *     summary="Обновление требований к кандидатам",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="id тарифа"),
     *             @OA\Property(property="has_caused_accident", nullable=true, type="bool", description="Участие в ДТП, true/false"),
     *             @OA\Property(property="experience", type="integer", nullable=true, description="Минимальный опыт вождения"),
     *             @OA\Property(property="max_fine_count", type="integer", nullable=true, description="Максимальное количество штрафов"),
     *             @OA\Property(property="abandoned_car", type="bool", nullable=true, description="Бросал ли машину, true/false"),
     *             @OA\Property(property="min_scoring", type="integer", nullable=true, description="минимальный скоринг"),
     *             @OA\Property(property="is_north_caucasus", nullable=true, type="bool", description="Права выданы в Северном Кавказе"),
     *             @OA\Property(property="criminal_ids", type="string", nullable=true, description="Массив запрещенных республик"),
     *             @OA\Property(property="alcohol", type="bool", nullable=true, description="Принимает ли что-то водитель, алкоголь/иное, true/false")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление тарифа",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Тариф успешно обнолвен"),
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Парк с указанным API ключом не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Парк не найден")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для создания или обновления условий аренды
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function updateTariffManager(Request $request)
    {
        return $this->callRoute('/parks/tariff', 'PUT', $request->all(), $request->key);
    }

    /**
     * Обновление подразделения парка
     *
     * Этот метод позволяет обновлять подразделение в парке.
     *
     * @OA\Put(
     *     path="/manager/parks/division",
     *     operationId="updateParkDivisionManager",
     *     summary="Обновление подразделения парка",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="Идентификатор подразделения"),
     *             @OA\Property(property="coords", type="string", description="Координаты подразделения"),
     *             @OA\Property(property="address", type="string", description="Адрес подразделения"),
     *             @OA\Property(property="metro", type="string", description="Название ближайшего метро" ),
     *             @OA\Property(property="name", type="string", description="Название подразделения"),
     *             @OA\Property(property="phone", type="string", description="Телефон парка"),
     *             @OA\Property(property="timezone_difference", type="integer", description="Часовой пояс, разница во времени с +0"),
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
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление подразделения",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Подразделение успешно обновлено")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Неверный ключ авторизации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка валидации"),
     *             @OA\Property(property="errors", type="object", example={
     *                 "coords": {"Поле coords должно быть строкой."},
     *                 "address": {"Поле address должно быть строкой."},
     *                 "name": {"Поле name должно быть строкой и уникальным в пределах парка."},
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Подразделение не найдено",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Подразделение не найдено")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления подразделения
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function updateParkDivisionManager(Request $request)
    {
        return $this->callRoute('/parks/division', 'PUT', $request->all(), $request->key);
    }

    /**
     * Обновление статуса брони автомобиля
     *
     * Этот метод позволяет обновлять статус брони для конкретного автомобиля по его VIN-номеру.
     *
     * @OA\Put(
     *     path="/manager/cars/booking",
     *     operationId="updateCarBookingStatusManager",
     *     summary="Обновление статуса брони автомобиля",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="vin", type="string", description="VIN-номер автомобиля"),
     *             @OA\Property(property="reason", type="string", nullable=true, description="Причина отмены"),
     *             @OA\Property(property="status", type="string", description="Статус бронирования: UnBooked - бронь снята и авто может быть доступно к бронированию, RentStart - автомобиль выдан водителю в аренду, RentOver - аренда авто закончена и авто может быть доступно к бронированию", ref="#/components/schemas/BookingStatus")

     * )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Успешное обновление статуса брони автомобиля",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="статуса брони автомобиля")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "status": {"Поле status обязательно для заполнения и должно быть строкой."},
     *                 "vin": {"Поле id обязательно для заполнения и должно быть строкой."}
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Автомобиль не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Автомобиль не найден или бронирование не найдено")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function updateCarBookingStatusManager(Request $request)
    {
        $request->merge([
            'car_id' => $request->vin,
            'class' => BookingStatus::{$request->status}->value
     ]);

        return $this->callRoute('/cars/booking', 'PUT', $request->all(), $request->key);
    }

    /**
     * Пролонгация брони
     *
     * Этот метод позволяет продлить время бронирования для конкретного автомобиля по его VIN-номеру.
     *
     * @OA\Put(
     *     path="/manager/cars/booking/prolongation",
     *     operationId="BookProlongationManager",
     *     summary="Пролонгация брони автомобиля",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="vin", type="string", description="VIN-номер автомобиля"),
     *             @OA\Property(property="hours", type="integer", description="Время в часах, на которое нужно продлить бронь")

     * )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Бронь продлена на hours ч.",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "car_id": {"Поле car_id обязательно для заполнения и должно быть строкой."}
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Автомобиль не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Автомобиль не найден или бронирование не найдено")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function BookProlongationManager(Request $request)
    {
        $request->merge(['car_id' => $request->vin]);
        return $this->callRoute('/cars/booking/prolongation', 'PUT', $request->all(), $request->key);
    }

    /**
     * Замена забронированного авто
     *
     * Этот метод позволяет заменить один автообиль на другой в рамках текущей брони по VIN-номеру.
     *
     * @OA\Put(
     *     path="/manager/cars/booking/replace",
     *     operationId="BookReplaceManager",
     *     summary="Замена забронированного авто",
     *     tags={"Manager"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="vin", type="string", description="VIN-номер текущего автомобиля"),
     *             @OA\Property(property="new_vin", type="string", description="VIN-номер нового автомобиля")

     * )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Замена авто прошла успешно",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Ошибки валидации",
     *         @OA\JsonContent(
     *             @OA\Property(property="errors", type="object", example={
     *                 "car_id": {"Поле car_id обязательно для заполнения и должно быть строкой."}
     *             })
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Автомобиль не найден",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Автомобиль не найден или бронирование не найдено")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function BookReplaceManager(Request $request)
    {
        $request->merge([
            'car_id' => $request->vin,
            'new_car_id' => $request->new_vin
        ]);
        return $this->callRoute('/cars/booking/replace', 'PUT', $request->all(), $request->key);
    }

    /**
     * Добавление автомобилей из базы клиента
     *
     * Этот метод позволяет добавить автомобили из базы клиента
     *
     * @OA\Post(
     *     path="/manager/cars/client",
     *     operationId="pushCarsFromParkClientManager",
     *     summary="Добавление автомобилей из базы клиента",
     *     tags={"Manager"},
     *     @OA\Response(
     *         response=200,
     *         description="Успешное добавление автомобилей",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function pushCarsFromParkClientManager(Request $request) {

        $divisions=Division::where('park_id',$request->park_id)->select('id','name')->get();
        $clientCars= $this->getCarsFromParkClient($request->park_id);
        $cars = [];
        $licenses = [];
        $licenseDates = [];
        foreach (json_decode($clientCars) as $car) {
            if ($car->Activity) {
                $formattedCar = [
                    'license_plate' => $car->Number,
                    'division_id' => $this->getDivisionIdByName($car->Department, $divisions),
                    'year_produced' => date("Y", strtotime($car->YearCar)),
                    'mileage' => $car->MileAge,
                    'transmission_type' => $this->getTransmissionTypeByName($car->KPPType),
                    'id' => $car->VIN,
                    'date_sts' => $car->STSIssueDate,
                    'division_name_info' => $car->Department,
                ];

                foreach ($cars as $index => $existingCar) {
                    if ($existingCar['license_plate'] === $car->Number) {
                        if ($car->STSIssueDate > $existingCar['date_sts']) {
                            unset($cars[$index]);
                            $cars[] = $formattedCar;
                        }
                        break;
                    }
                }

                if (!in_array($car->Number, array_column($cars, 'license_plate'))) {
                    $cars[] = $formattedCar;
                }
            }
        };
        $request->merge([
            'cars' => $cars
        ]);

        return $this->callRoute('/cars', 'POST', $request->all(), $request->key);
    }

    /**
     * Добавление статусов автомобилей из базы клиента
     *
     * Этот метод позволяет добавить автомобили из базы клиента
     *
     * @OA\Post(
     *     path="/manager/statuses/client",
     *     operationId="pushStatusesFromParkClientManager",
     *     summary="Добавление статусов автомобилей из базы клиента",
     *     tags={"Manager"},
     *     @OA\Response(
     *         response=200,
     *         description="Успешное добавление статусов автомобилей",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Ошибка аутентификации",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
     *         )
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Ошибка сервера",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Ошибка сервера")
     *         )
     *     )
     * )
     *
     * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
     * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
     */
    public function pushStatusesFromParkClientManager(Request $request) {
        $clientCars = $this->getCarsFromParkClient($request->park_id);
        $unicStatuses = [];

        foreach (json_decode($clientCars) as $car) {
            $status = $car->Status;
            if (!in_array($status, $unicStatuses) && $status) {
                $unicStatuses[] = $status;
            }
        }

        foreach ($unicStatuses as $status) {
            Status::firstOrCreate([
                'park_id' => $request->park_id,
                'custom_status_name' => $status,
                'status_name' => CarStatus::Hidden->name,
                'status_value' => CarStatus::Hidden->value,
            ]);
        }
        return response()->json(['message' => 'Статусы добавлены'], 200);
    }

    /**
        * Получение статусов автомобилей парка
        *
        * Этот метод позволяет получить статусы автомобилей парка
        *
        * @OA\Get(
        *     path="/manager/statuses",
        *     operationId="getParkStatusesManager",
        *     summary="Получение статусов автомобилей парка",
        *     tags={"Manager"},
        *     @OA\Response(
        *         response=200,
        *         description="Получение статусов автомобилей парка",
        *         @OA\JsonContent(
        *             @OA\Property(
        *                 property="statuses",
        *                 type="array",
        *                 @OA\Items(
        *                     @OA\Property(property="id", type="integer"),
        *                     @OA\Property(property="status_name", type="string", ref="#/components/schemas/CarStatus"),
        *                     @OA\Property(property="custom_status_name", type="string")
        *                 )
        *             )
        *         )
        *     ),
        *     @OA\Response(
        *         response=401,
        *         description="Ошибка аутентификации",
        *         @OA\JsonContent(
        *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
        *         )
        *     ),
        *     @OA\Response(
        *         response=500,
        *         description="Ошибка сервера",
        *         @OA\JsonContent(
        *             @OA\Property(property="message", type="string", example="Ошибка сервера")
        *         )
        *     )
        * )
        *
        * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
        * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
        */
    public function getParkStatusesForCarsManager(Request $request)
    {
        $statuses = Status::where('park_id', $request->park_id)->select('id','status_name','custom_status_name')->get();
        return response()->json(['statuses'=>$statuses], 200);
    }

    /**
         * Изменение статуса автомобиля парка
         *
         * Этот метод позволяет изменить статус автомобиля парка
         *
         * @OA\Put(
         *     path="/manager/status",
         *     operationId="changeParkStatusManager",
         *     summary="Изменение статуса автомобиля парка",
         *     tags={"Manager"},
          *     @OA\RequestBody(
        *         @OA\JsonContent(
        *             @OA\Property(property="id", type="number", description="Id статуса"),
        *             @OA\Property(property="status_name", type="string", description="Значение статуса")
        *         )
        *     ),
         *     @OA\Response(
         *         response=200,
         *         description="Изменение статуса автомобиля парка",
         *         @OA\JsonContent(
         *             @OA\Property(property="message",type="string",)
         *         )
         *     ),
         *     @OA\Response(
         *         response=401,
         *         description="Ошибка аутентификации",
         *         @OA\JsonContent(
         *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
         *         )
         *     ),
         *     @OA\Response(
         *         response=500,
         *         description="Ошибка сервера",
         *         @OA\JsonContent(
         *             @OA\Property(property="message", type="string", example="Ошибка сервера")
         *         )
         *     )
         * )
         *
         * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
         * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
         */
    public function changeParkStatusManager(Request $request)
    {
        Status::where('park_id', $request->park_id)->where('id', $request->id)
            ->update([
                'status_name' => $request->status_name,
                'status_value' => CarStatus::{$request->status_name}->value
            ]);
$cars = Car::where('park_id', $request->park_id)->where('status_id', $request->id)->update([
    'status' => CarStatus::{$request->status_name}->value
]);
        return response()->json(['message' => 'Статус успешно обновлен'], 200);
    }

    /**
        * Изменение логина и пароля менеджера для связи с клиентом
        *
        * Этот метод позволяет изменить логин и пароль менеджера для связи с клиентом
        *
        * @OA\Put(
        *     path="/manager/auth/data",
        *     operationId="pushAuthDataManager",
        *     summary="Изменение логина и пароля менеджера для связи с клиентом",
        *     tags={"Manager"},
        *     @OA\RequestBody(
        *         @OA\JsonContent(
        *             @OA\Property(property="name", type="string", description="Новое имя пользователя 1с"),
        *             @OA\Property(property="password", type="string", description="Новый пароль пользователя 1с")
        *         )
        *     ),
        *     @OA\Response(
        *         response=200,
        *         description="Успешно",
        *         @OA\JsonContent(
        *             @OA\Property(property="message", type="string")
        *         )
        *     ),
        *     @OA\Response(
        *         response=401,
        *         description="Ошибка аутентификации",
        *         @OA\JsonContent(
        *             @OA\Property(property="message", type="string", example="Ошибка аутентификации")
        *         )
        *     ),
        *     @OA\Response(
        *         response=500,
        *         description="Ошибка сервера",
        *         @OA\JsonContent(
        *             @OA\Property(property="message", type="string", example="Ошибка сервера")
        *         )
        *     )
        * )
        *
        * @param \Illuminate\Http\Request $request Объект запроса с данными для обновления условия аренды для автомобиля
        * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
        */
    public function pushAuthDataManager(Request $request)  {
        $user = Auth::guard('sanctum')->user();
        $user->name = $request->name;
        $user->password = bcrypt($request->password);

        $user->save();

        return response()->json(['message' => 'Успешно'], 200);
    }

    /**
         * Добавление фотографий автомобилям
         *
         * Метод для добавления фотографий к массиву автомобилей
         *
         * @OA\Post(
         *     path="/manager/cars/photos",
         *     operationId="pushPhotosToCarsManager",
         *     summary="Добавление фотографий автомобилям",
         *     tags={"Manager"},
        * @OA\RequestBody(
        *     required=true,
        *     description="Файлы для загрузки",
        *     @OA\MediaType(
        *         mediaType="multipart/form-data",
        *         @OA\Schema(
        *             type="object",
        *             @OA\Property(
        *                 property="file[]",
        *                 description="Файлы для загрузки",
        *                 type="array",
        *                 @OA\Items(type="string", format="binary")
        *             ),
        *             @OA\Property(
        *                 property="ids",
        *                 description="Идентификаторы автомобилей",
        *                 type="string",
        *             )
        *         )
        *     )
        * ),
         *     @OA\Response(
         *         response=200,
         *         description="Успешно",
         *         @OA\JsonContent(
         *             @OA\Property(property="message", type="string")
         *         )
         *     ),
         *     @OA\Response(
         *         response=400,
         *         description="Неверный запрос",
         *         @OA\JsonContent(
         *             @OA\Property(property="message", type="string", example="Загрузите ровно 3 фото")
         *         )
         *     ),
         *     @OA\Response(
         *         response=500,
         *         description="Ошибка сервера",
         *         @OA\JsonContent(
         *             @OA\Property(property="message", type="string", example="Ошибка сервера")
         *         )
         *     )
         * )
         *
         * @param \Illuminate\Http\Request $request Объект запроса с данными для загрузки фотографий
         * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
         */

         public function pushPhotosToCarsManager(Request $request) {
            $request->validate([
                'ids' => 'string',
                'file.*' => 'required|image|mimes:png,jpg,jpeg,webp|max:7168',
            ]);
            $idsString = $request->ids;
            $ids = explode(',', $idsString);
            $ids = array_map('intval', $ids);

            $cars = Car::whereIn('id', $ids)->get();
            $fileService = new FileService;
            $images = [];
            foreach ($request->file('file') as $file) {
                $name = uuid_create(UUID_TYPE_RANDOM);
                $fileService->saveFile($file, $name);
                $imageUrl = config('app.url') . "/uploads/" . $name;
                $images[] = stripslashes($imageUrl);
            }
            foreach ($cars as $car) {
                $imagesJson = json_encode($images, JSON_UNESCAPED_SLASHES);
                DB::statement("UPDATE cars SET images = '$imagesJson' WHERE id = $car->id");
            }
            return response()->json(['message' => 'Success'], 200);
        }

    /**
 * Привязка группе автомобилей division_id
 *
 * Метод для привязки группе автомобилей division_id
 *
 * @OA\Post(
 *     path="/manager/cars/division",
 *     operationId="assignCarsToDivisionManager",
 *     summary="Привязка группе автомобилей division_id",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *                 @OA\Property(
 *                     property="division_id",
 *                     description="Идентификатор division",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="car_ids",
 *                     description="Идентификаторы автомобилей",
 *                     type="array",
 *                     @OA\Items(type="integer")
 *                 )
 *                 ),
 *         ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите division_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function assignCarsToDivisionManager(Request $request) {
    $request->validate([
        'division_id' => 'required|integer',
        'car_ids' => 'required|array',
        'car_ids.*' => 'required|integer',
    ]);

    $divisionId = $request->input('division_id');
    $carIds = $request->input('car_ids');
    $division = Division::where('park_id', $request->park_id)->where('id', $request->division_id)->first();
    if (!$division) {
        return response()->json(['message' => 'Division not found'], 400);
    }

    $cars = Car::whereIn('id', $carIds)->get();
    if ($cars->count() !== count($carIds)) {
        return response()->json(['message' => 'One or more cars not found'], 400);
    }

    foreach ($cars as $car) {
        $car->division_id = $divisionId;
        $car->save();
    }

    return response()->json(['message' => 'Cars assigned to division successfully'], 200);
}

/**
 * Привязка группе автомобилей тарифа
 *
 * Метод для привязки группе автомобилей к тарифа
 *
 * @OA\Post(
 *     path="/manager/cars/tariff",
 *     operationId="assignCarsToTariffManager",
 *     summary="Привязка группе автомобилей тарифа",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *                 @OA\Property(
 *                     property="tariff_id",
 *                     description="Идентификатор тарифа",
 *                     type="integer"
 *                 ),
 *                 @OA\Property(
 *                     property="car_ids",
 *                     description="Идентификаторы автомобилей",
 *                     type="array",
 *                     @OA\Items(type="integer")
 *                 ),
 *         ),
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите tariff_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к тарифу
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function assignCarsToTariffManager(Request $request) {
    $request->validate([
        'tariff_id' => 'required|integer',
        'car_ids' => 'required|array',
        'car_ids.*' => 'required|integer',
    ]);

    $tariffId = $request->input('tariff_id');
    $carIds = $request->input('car_ids');

    $tariff = Tariff::find($tariffId);
    if (!$tariff) {
        return response()->json(['message' => 'Tariff not found'], 400);
    }

    $cars = Car::whereIn('id', $carIds)->get();
    if ($cars->count() !== count($carIds)) {
        return response()->json(['message' => 'One or more cars not found'], 400);
    }

    foreach ($cars as $car) {
        $car->tariff_id = $tariffId;
        $car->save();
    }

    return response()->json(['message' => 'Cars assigned to tariff successfully'], 200);
}

/**
 * Привязка группе автомобилей rent_term
 *
 * Метод для привязки группе автомобилей к сроку аренды rent_term_id
 *
 * @OA\Post(
 *     path="/manager/cars/rent-term",
 *     operationId="assignCarsToRentTermManager",
 *     summary="Привязка группе автомобилей rent_term",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="rent_term_id",
 *                 description="Идентификатор срока аренды",
 *                 type="integer"
 *             ),
 *             @OA\Property(
 *                 property="car_ids",
 *                 description="Идентификаторы автомобилей",
 *                 type="array",
 *                     @OA\Items(type="integer")
 *             ),
 *         ),
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите rent_term_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function assignCarsToRentTermManager(Request $request) {
    $request->validate([
        'rent_term_id' => 'required|integer',
        'car_ids' => 'required|array',
        'car_ids.*' => 'required|integer',
    ]);

    $rentTermId = $request->input('rent_term_id');
    $carIds = $request->input('car_ids');

    $rentTerm = RentTerm::find($rentTermId);
    if (!$rentTerm) {
        return response()->json(['message' => 'Rent term not found'], 400);
    }

    $cars = Car::whereIn('id', $carIds)->get();
    if ($cars->count() !== count($carIds)) {
        return response()->json(['message' => 'One or more cars not found'], 400);
    }

    foreach ($cars as $car) {
        $car->rent_term_id = $rentTermId;
        $car->save();
    }

    return response()->json(['message' => 'Cars assigned to rent term successfully'], 200);
}

/**
 * Удаление схемы
 *
 * @OA\Delete(
 *     path="/manager/schema",
 *     operationId="deleteSchemaManager",
 *     summary="Удаление схемы",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="id",
 *                 description="Идентификатор",
 *                 type="integer"
 *             ))),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите rent_term_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function deleteSchemaManager(Request $request) {
    $request->validate([
        'id' => 'required|integer',
    ]);

    $schema = Schema::find($request->id);

    if (!$schema) {
        return response()->json(['error' => 'Schema not found'], 404);
    }

    $schema->delete();

    return response()->json(['message' => 'Schema deleted'], 200);
}

/**
 * Получение активных бронирований
 *
 * Метод для получения активных бронирований
 *
 * @OA\Get(
 *     path="/manager/bookings",
 *     operationId="getParkBookingsManager",
 *     summary="Получение активных бронирований",
 *     tags={"Manager"},
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="bookings", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="status", type="string",ref="#/components/schemas/BookingStatus"),
 *                 @OA\Property(property="schema_id", type="integer"),
 *                 @OA\Property(property="car_id", type="integer"),
 *                 @OA\Property(property="driver_id", type="integer"),
 *                 @OA\Property(property="booked_at", type="string"),
 *                 @OA\Property(property="end_date", type="string"),
 *                 @OA\Property(property="park_id", type="integer"),
 *                 @OA\Property(property="cancellation_source", type="string",ref="#/components/schemas/CancellationSources"),
 *                 @OA\Property(property="cancellation_reason", type="string"),
 *                 @OA\Property(property="created_at", type="string"),
 *                 @OA\Property(property="updated_at", type="string"),
 *                 @OA\Property(property="car", type="object", properties={
 *                     @OA\Property(property="car_id", type="string"),
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="division_id", type="integer"),
 *                     @OA\Property(property="park_id", type="integer"),
 *                     @OA\Property(property="tariff_id", type="integer"),
 *                     @OA\Property(property="mileage", type="string"),
 *                     @OA\Property(property="license_plate", type="string"),
 *                     @OA\Property(property="rent_term_id", type="integer"),
 *                     @OA\Property(property="fuel_type", type="integer"),
 *                     @OA\Property(property="transmission_type", type="integer"),
 *                     @OA\Property(property="brand", type="string"),
 *                     @OA\Property(property="model", type="string"),
 *                     @OA\Property(property="year_produced", type="integer"),
 *                     @OA\Property(property="images", type="array", @OA\Items(type="string")),
 *                     @OA\Property(property="status", type="integer"),
 *                     @OA\Property(property="status_id", type="integer"),
 *                     @OA\Property(property="old_status_id", type="integer"),
 *                     @OA\Property(property="created_at", type="string"),
 *                     @OA\Property(property="updated_at", type="string"),
 *                     @OA\Property(property="division", type="object", properties={
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="park_id", type="integer"),
 *                         @OA\Property(property="city_id", type="integer"),
 *                         @OA\Property(property="coords", type="string"),
 *                         @OA\Property(property="address", type="string"),
 *                         @OA\Property(property="metro", type="string"),
 *                         @OA\Property(property="working_hours", type="array", @OA\Items(
 *                             @OA\Property(property="day", type="string"),
 *                             @OA\Property(property="end", type="object", properties={
 *                                 @OA\Property(property="hours", type="integer"),
 *                                 @OA\Property(property="minutes", type="integer")
 *                             }),
 *                             @OA\Property(property="start", type="object", properties={
 *                                 @OA\Property(property="hours", type="integer"),
 *                                 @OA\Property(property="minutes", type="integer")
 *                             })
 *                         )),
 *                         @OA\Property(property="timezone_difference", type="integer"),
 *                         @OA\Property(property="created_at", type="string"),
 *                         @OA\Property(property="updated_at", type="string"),
 *                         @OA\Property(property="name", type="string"),
 *                         @OA\Property(property="phone", type="string"),
 *                         @OA\Property(property="city", type="object", properties={
 *                             @OA\Property(property="id", type="integer"),
 *                             @OA\Property(property="name", type="string"),
 *                             @OA\Property(property="created_at", type="string"),
 *                             @OA\Property(property="updated_at", type="string")
 *                         })
 *                     })
 *                 }),
 *                 @OA\Property(property="driver", type="object", properties={
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="user_id", type="integer"),
 *                     @OA\Property(property="city_id", type="integer"),
 *                     @OA\Property(property="created_at", type="string"),
 *                     @OA\Property(property="updated_at", type="string"),
 *                     @OA\Property(property="user", type="object", properties={
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="code", type="integer"),
 *                         @OA\Property(property="role_id", type="integer"),
 *                         @OA\Property(property="user_status", type="integer"),
 *                         @OA\Property(property="phone", type="string"),
 *                         @OA\Property(property="name", type="string"),
 *                         @OA\Property(property="email", type="string"),
 *                         @OA\Property(property="avatar", type="string"),
 *                         @OA\Property(property="email_verified_at", type="string"),
 *                         @OA\Property(property="created_at", type="string"),
 *                         @OA\Property(property="updated_at", type="string"),
 *                         @OA\Property(property="user_type", type="integer")
 *                     })
 *                 }),
 *                 @OA\Property(property="schema", type="object", properties={
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="rent_term_id", type="integer"),
 *                     @OA\Property(property="daily_amount", type="integer"),
 *                     @OA\Property(property="non_working_days", type="integer"),
 *                     @OA\Property(property="working_days", type="integer"),
 *                     @OA\Property(property="created_at", type="string"),
 *                     @OA\Property(property="updated_at", type="string")
 *                 })
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите rent_term_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getParkBookingsManager(Request $request) {

    $bookings = Booking::where('park_id', $request->park_id)
    ->with('car', 'driver', 'driver.user', 'schema', 'car.division', 'car.division.city')
    ->orderBy('created_at', 'desc')
    ->get();
foreach ($bookings as $booking) {
    $booking->end_date = Carbon::parse($booking->booked_until)->toIso8601ZuluString();
    $booking->status = BookingStatus::from($booking->status)->name;
    $booking->cancellation_source = $booking->cancellation_source?CancellationSources::from($booking->cancellation_source)->name:null;
    unset($booking->driver->user->code);
}
    return response()->json(['bookings' => $bookings], 200);
}

/**
 * Проверка статусов клиента
 *
 * Метод для проверки статусов клиента
 *
 * @OA\Get(
 *     path="/manager/cars/statuses/client",
 *     operationId="getCarsCurrentStatusesFromClientManager",
 *     summary="Проверка статусов клиента",
 *     tags={"Manager"},
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите rent_term_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
    public function getCarsCurrentStatusesFromClientManager(Request $request) {

        // .!!!!!!!!!!!!!!! ЯТЪ!!!!!!!!!!!!!
        set_time_limit(300);
        // ,!!!!!!!!!!!!!!! ЯТЪ!!!!!!!!!!!!!
        Log::info('getCarsCurrentStatusesFromClientManager started');
        $clientCars = json_decode($this->getCarsFromParkClient($request->park_id));
        $statuses = Status::where('park_id', $request->park_id)->select('status_value', 'custom_status_name','id')->get();
        $cars = Car::where('park_id', $request->park_id)->get();

        usort($clientCars, function($a, $b) {
            return strtotime($b->STSIssueDate) - strtotime($a->STSIssueDate);
        });

        foreach ($clientCars as $car) {
            if (!$car->Activity) {
                continue;
            }
            $carVin = $car->VIN;
            $carStatus = $car->Status;
            $existingCar = $cars->where('car_id', $carVin)->first();

            if ($existingCar && $this->checkCarDataIsFilled($existingCar)) {
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
        return response()->json(['message' => 'Статусы успешно обновлены'], 200);
    }
/**
 * Получение заявок
 *
 * Метод для получения списка заявок
 *
 * @OA\Post(
 *     path="manager/applications",
 *     operationId="getParkApplicationsManager",
 *     summary="Получение заявок",
 *     tags={"Manager"},
  *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="last_update_time",
 *                 description="Время последнего обновления",
 *                 type="timestamp"
 *             ))),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="applications", type="array", @OA\Items(
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="manager_id", type="integer"),
 *                 @OA\Property(property="division_id", type="integer"),
 *                 @OA\Property(property="advertising_source", type="string"),
 *                 @OA\Property(property="booking_id", type="integer", nullable=true),
 *                 @OA\Property(property="planned_arrival", type="string"),
 *                 @OA\Property(property="driver_license", type="string"),
 *                 @OA\Property(property="license_issuing_country", type="string"),
 *                 @OA\Property(property="chosen_model", type="string"),
 *                 @OA\Property(property="chosen_brand", type="string"),
 *                 @OA\Property(property="reason_for_rejection", type="string", nullable=true),
 *                 @OA\Property(property="current_stage", type="string", ref="#/components/schemas/ApplicationStage"),
 *                 @OA\Property(property="user_id", type="integer", nullable=true),
 *                 @OA\Property(property="created_at", type="string"),
 *                 @OA\Property(property="updated_at", type="string"),
 *                 @OA\Property(property="user", type="object", properties={
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="phone", type="string"),
 *                     @OA\Property(property="name", type="string"),
 *                     @OA\Property(property="email", type="string")
 *                 }),
 *                 @OA\Property(property="booking", nullable=true, type="object", properties={
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="status", type="integer"),
 *                     @OA\Property(property="car_id", type="integer"),
 *                     @OA\Property(property="car", type="object", properties={
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="license_plate", type="string"),
 *                         @OA\Property(property="brand", type="string"),
 *                         @OA\Property(property="model", type="string"),
 *                         @OA\Property(property="year_produced", type="integer"),
 *                         @OA\Property(property="car_id", type="string")
 *                     }),
 *                     @OA\Property(property="schema_id", type="integer"),
 *                     @OA\Property(property="schema", type="object", properties={
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="daily_amount", type="integer"),
 *                         @OA\Property(property="non_working_days", type="integer"),
 *                         @OA\Property(property="working_days", type="integer")
 *                     }),
 *                     @OA\Property(property="driver_id", type="integer"),
 *                     @OA\Property(property="booked_at", type="string"),
 *                     @OA\Property(property="booked_until", type="string"),
 *                     @OA\Property(property="park_id", type="integer"),
 *                     @OA\Property(property="cancellation_source", type="integer"),
 *                     @OA\Property(property="cancellation_reason", type="string")
 *                 }),
 *                 @OA\Property(property="division", type="object", properties={
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="city_id", type="integer"),
 *                     @OA\Property(property="name", type="string"),
 *                     @OA\Property(property="phone", type="string"),
 *                     @OA\Property(property="city", type="object", properties={
 *                         @OA\Property(property="name", type="integer")
 *                     }),
 *                     @OA\Property(property="manager", type="object", properties={
 *                         @OA\Property(property="id", type="integer"),
 *                         @OA\Property(property="user_id", type="integer"),
 *                         @OA\Property(property="user", type="object", properties={
 *                             @OA\Property(property="id", type="integer"),
 *                             @OA\Property(property="user_status", type="integer"),
 *                             @OA\Property(property="phone", type="string"),
 *                             @OA\Property(property="name", type="string"),
 *                             @OA\Property(property="email", type="string")
 *                         })
 *                     })
 *                 })
 *             ))
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Укажите rent_term_id и car_ids")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getParkApplicationsManager(Request $request) {
    $user = Auth::guard('sanctum')->user();

    $applicationsQuery = Application::whereHas('division', function ($query) use ($user) {
            $query->where('park_id', $user->manager->park_id);
        })
        ->with([
            'user' => function ($query) {
                $query->select('id', 'user_status', 'phone', 'name', 'email');
            },
            'booking' => function ($query) {
                $query->select('id', 'status', 'car_id', 'schema_id', 'driver_id', 'booked_at', 'booked_until', 'park_id', 'cancellation_source', 'cancellation_reason');
            },
            'booking.car' => function ($query) {
                $query->select('id', 'license_plate', 'brand', 'model', 'year_produced', 'car_id');
            },
            'booking.schema' => function ($query) {
                $query->select('id', 'daily_amount', 'non_working_days', 'working_days');
            },
            'division' => function ($query) {
                $query->select('id', 'city_id', 'name', 'phone');
            },
            'manager' => function ($query) {
                $query->select('id', 'user_id');
            },
            'manager.user' => function ($query) {
                $query->select('id', 'user_status', 'phone', 'name', 'email');
            },
            'division.city' => function ($query) {
                $query->select('id','name');
            }
        ])
        ->orderBy('updated_at', 'desc');

    if ($request->has('last_update_time')) {
        $applicationsQuery->where('updated_at', '>', $request->last_update_time);
    }

    $applications = $applicationsQuery->get();

    foreach ($applications as $application) {
        $application->current_stage = ApplicationStage::from($application->current_stage)->name;
        if ($application->booking && $application->booking->cancellation_source) {
            $application->booking->cancellation_source=CancellationSources::from($application->booking->cancellation_source)->name;
        }
    }

    return response()->json(['applications' => $applications], 200);
}
/**
 * Создание заявки
 *
 * Метод для создания заявки
 *
 * @OA\post(
 *     path="manager/application",
 *     operationId="createApplicationManager",
 *     summary="Создание заявки",
 *     tags={"Manager"},
 * @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="phone",
 *                 description="телефон",
 *                 type="string",nullable=true
 *             ),@OA\Property(
 *                 property="division_id",
 *                 description="id подразделения",
 *                 type="integer",nullable=true
 *             ),@OA\Property(
 *                 property="advertising_source",
 *                 description="источник рекламы",
 *                 type="sting",nullable=true
 *             ),@OA\Property(
 *                 property="chosen_model",
 *                 description="модель авто",
 *                 type="sting",nullable=true,
 *              ),
 *
 * @OA\Property(
 *                 property="citizenship",
 *                 description="гражданство",
 *                 type="sting",nullable=true
 *             ),
 * @OA\Property(
 *                 property="chosen_brand",
 *                 description="Марка авто",
 *                 type="sting",nullable=true
 *             ),@OA\Property(
 *                 property="license_issuing_country",
 *                 description="страна выдачи прав",
 *                 type="sting",nullable=true
 *             ),@OA\Property(
 *                 property="driver_license",
 *                 description="номер удостоверения",
 *                 type="sting",nullable=true
 *             ),@OA\Property(
 *                 property="planned_arrival",
 *                 description="дата и время когда планирует прийти",
 *                 type="datetime",nullable=true
 *             ))),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function createApplicationManager(Request $request) {
    $user = Auth::guard('sanctum')->user();
    $managerId = $user->manager->id;
    $driver_user_id =null;
    if ($request->phone) {
        $driver_user= User::where('phone',$request->phone)->firstOrCreate();
        if (!$driver_user->phone) {
            $driver_user->phone=$request->phone;
            $driver_user->save();
        }
        $driver_user_id=$driver_user->id;
    }
    $request->merge([
        'manager_id' => $managerId,
        'driver_user_id'=> $driver_user_id,
    ]);
    $kanban = new KanbanController;
    $applicationId = $kanban->createApplication($request);
    $request->merge([
        'type'=>ApplicationLogType::Create->value,
        'creator'=>'Менеджер',
        'creator_id'=>$managerId,
        'id'=>$applicationId
    ]);
    $kanban->createApplicationsLogItem($request);
    return response()->json(['id' => $applicationId]);
}

/**
 * Создание комментария
 *
 * Метод для создания комментария
 *
 * @OA\post(
 *     path="manager/application/comment",
 *     operationId="createApplicationCommentManager",
 *     summary="Создание заявки",
 *     tags={"Manager"},
 * @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(
 *                 property="id",
 *                 description="id",
 *                 type="integer",nullable=false
 *             ),@OA\Property(
 *                 property="comment",
 *                 description="комментарий",
 *                 type="sting",nullable=false,
 *              ))),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function createApplicationCommentManager(Request $request) {
    $user = Auth::guard('sanctum')->user();
    $managerId = $user->manager->id;
    $kanban = new KanbanController;
    $request->merge([
        'type'=>ApplicationLogType::Comment->value,
        'manager_id' => $managerId,
    ]);
    return $kanban->createApplicationsLogItem($request);
}
/**
 * Изменение заявки
 *
 * Метод для изменения заявки
 *
 * @OA\put(
 *     path="manager/application",
 *     operationId="updateApplicationManager",
 *     summary="Изменение заявки",
 *     tags={"Manager"},
 * @OA\RequestBody(
 *         @OA\JsonContent(
*       @OA\Property(
 *                 property="id",
 *                 description="id заявки",
 *                 type="integer",nullable=false
 *             ),
*       @OA\Property(
 *                 property="division_id",
 *                 description="id подразделения",
 *                 type="integer",nullable=true
 *             ),
 * @OA\Property(
 *                 property="advertising_source",
 *                 description="источник рекламы",
 *                 type="sting",nullable=true
 *             ),
 * @OA\Property(
 *                 property="reason_for_rejection",
 *                 description="причина отказа от авто",
 *                 type="sting",nullable=true
 *             ),
 * @OA\Property(
 *                 property="user_name",
 *                 description="Имя пользователя",
 *                 type="sting",nullable=true
 *             ),
 * @OA\Property(
 *                 property="current_stage",
 *                 description="текущий статус",
 *                 type="sting",nullable=true, ref="#/components/schemas/ApplicationStage")
 *             ),
 * @OA\Property(
 *                 property="citizenship",
 *                 description="гражданство",
 *                 type="sting",nullable=true
 *             ),
 * @OA\Property(
 *                 property="planned_arrival",
 *                 description="дата и время когда планирует прийти",
 *                 type="datetime",nullable=true
 *             )),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function updateApplicationManager(Request $request) {
    $request->validate([
        'id' => 'required|integer'
    ]);

    $user = Auth::guard('sanctum')->user();
    $managerId = $user->manager->id;
    $application = Application::find($request->id);

    $kanban = new KanbanController;
    $request->merge([
        'manager_id' => $managerId
    ]);
    if (!$application) {
        return response()->json(['success' => true]);
    }
        if ($request->user_name)
        {
            $userDriver = User::where('id',$application->user_id)->first();
            $this->updateFieldAndCreateLog($request, $userDriver->name, $request->user_name, 'user_name',  $kanban);
            $userDriver->name=$request->user_name;
            $userDriver->save();
        }
        if ($request->division_id)
        {
            $this->updateFieldAndCreateLog($request, $application->division_id, $request->division_id, 'division_id',  $kanban);
            $application->division_id=$request->division_id;
        }
        if ($request->advertising_source) {
            $this->updateFieldAndCreateLog($request, $application->advertising_source, $request->advertising_source, 'advertising_source',  $kanban);
            $application->advertising_source=$request->advertising_source;
        }
        if ($request->planned_arrival) {
            $this->updateFieldAndCreateLog($request, $application->planned_arrival, $request->planned_arrival, 'planned_arrival',  $kanban);
            $application->planned_arrival=$request->planned_arrival;
        }
        if ($application->manager_id!==$managerId) {
            $this->updateFieldAndCreateLog($request, $application->manager_id, $managerId, 'manager_id', $kanban);
            $manager = Manager::where('id',$application->manager_id)->first();
            $this->updateFieldAndCreateLog($request, $manager?$manager->name:'Без менеджера', $user->name, 'manager_name', $kanban);
            $application->manager_id=$managerId;
        }
        if ($request->reason_for_rejection) {
            $this->updateFieldAndCreateLog($request, $application->reason_for_rejection, $request->reason_for_rejection, 'reason_for_rejection', $kanban);
            $application->reason_for_rejection=$request->reason_for_rejection;
        }
        if ($request->license_issuing_country) {
            $this->updateFieldAndCreateLog($request, $application->license_issuing_country, $request->license_issuing_country, 'license_issuing_country', $kanban);
            $application->license_issuing_country=$request->license_issuing_country;
        }
        if ($request->driver_license) {
            $this->updateFieldAndCreateLog($request, $application->driver_license, $request->driver_license, 'driver_license', $kanban);
            $application->driver_license=$request->driver_license;
        }
        if ($request->citizenship) {
            $this->updateFieldAndCreateLog($request, $application->citizenship, $request->citizenship, 'citizenship', $kanban);
            $application->citizenship=$request->citizenship;
        }
        if ($request->chosen_model) {
            $this->updateFieldAndCreateLog($request, $application->chosen_model, $request->chosen_model, 'chosen_model', $kanban);
            $application->chosen_model=$request->chosen_model;
        }
        if ($request->chosen_brand) {
            $this->updateFieldAndCreateLog($request, $application->chosen_brand, $request->chosen_brand, 'chosen_brand', $kanban);
            $application->chosen_brand=$request->chosen_brand;
        }
        if ($request->current_stage) {
            $old = $application->current_stage;
            $application->current_stage=ApplicationStage::{$request->current_stage}->value;
            $request->merge([
                'type' => ApplicationLogType::Stage->value,
                'new_stage' => $application->current_stage,
                'old_stage' => ApplicationStage::from($old)->name,
            ]);
            $kanban->createApplicationsLogItem($request);
        }
        $application->save();
        return response()->json(['success' => true]);
}

/**
 * Получение логов заявки
 *
 * Метод для получения логов заввки
 *
 * @OA\Post(
 *     path="manager/application/log",
 *     operationId="getParkApplicationsLogItemsManager",
 *     summary="Получение логов заявки",
 *     tags={"Manager"},
  * @OA\RequestBody(
 *         @OA\JsonContent(
*       @OA\Property(
 *                 property="id",
 *                 description="id заявки",
 *                 type="integer",nullable=false
 *             ),
 *       @OA\Property(
 *                 property="last_update_time",
 *                 description="время последнего обновления",
 *                 type="timestamp",nullable=false
 *             ))),
  * @OA\Response(
 *     response=200,
 *     description="Успешно",
 *     @OA\JsonContent(
 *         @OA\Property(property="logs", type="array",
*             @OA\Items(
*                 @OA\Property(property="id", type="integer"),
*                 @OA\Property(property="manager_id", type="integer"),
*                 @OA\Property(property="application_id", type="integer"),
*                 @OA\Property(property="type", type="string"),
*                 @OA\Property(property="content", type="object"),
*                 @OA\Property(property="created_at", type="string"),
*                 @OA\Property(property="updated_at", type="string"),
*                 @OA\Property(property="application", type="object", properties={
*                     @OA\Property(property="id", type="integer"),
*                     @OA\Property(property="manager_id", type="integer")}),
*                 @OA\Property(property="manager", type="object",properties={
*                     @OA\Property(property="id", type="integer"),
*                     @OA\Property(property="user_id", type="integer"),
*                     @OA\Property(property="user", type="object",properties={
*                         @OA\Property(property="id", type="integer"),
*                         @OA\Property(property="name", type="string")
*                     })
*                 })
*             )
*         )
*     )
* ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getParkApplicationsLogItemsManager(Request $request) {
    $logs = ApplicationLogs::where('application_id',$request->id)->with([
        'application' => function ($query) {
            $query->select('id', 'manager_id');
        },
        'manager' => function ($query) {
            $query->select('id', 'user_id');
        },
        'manager.user' => function ($query) {
            $query->select('id', 'name');
        }
    ])->orderBy('updated_at', 'asc');
    if ($request->has('last_update_time')) {
        $logs->where('updated_at', '>', $request->last_update_time);
    }
    $logs=$logs->get();
    foreach ($logs as $log ) {
        $log->type = ApplicationLogType::from($log->type)->name;
    }
    return response()->json(['logs' => $logs], 200);
}
/**
 * Получение уведомлений
 *
 * Метод для получения уведомлений
 *
 * @OA\Get(
 *     path="manager/notifications",
 *     operationId="getNotificationsManager",
 *     summary="Получение уведомлений",
 *     tags={"Manager"},
*     @OA\Response(
 *         response=200,
 *         description="Success",
 *         @OA\JsonContent(
 *             @OA\Property(property="notifications", type="array",
 *                 @OA\Items(
 *                     @OA\Property(property="id", type="integer"),
 *                     @OA\Property(property="application_id", type="integer"),
 *                     @OA\Property(property="content", type="string"),
 *                     @OA\Property(property="created_at", type="string")
 *                 )
 *             ))),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getNotificationsManager(Request $request) {
    $user = Auth::guard('sanctum')->user();
    $notifications = ApplicationLogs::where('type', ApplicationLogType::Notification->value)
        ->whereHas('application.division', function ($query) use ($user) {
            $query->where('park_id', $user->manager->park_id);
        })
        ->where('content->result', null)
        ->where('content->date', '>=', Carbon::today()->format('Y-m-d 00:00:00'))
        ->where('content->date', '<=', Carbon::tomorrow()->format('Y-m-d 00:00:00'))
        ->get();
    return response()->json(['notifications' => $notifications], 200);
}

/**
 * Получение всех уведомлений
 *
 * Метод для получения всех уведомлений
 *
 * @OA\Get(
 *     path="manager/notifications/all",
 *     operationId="getAllNotificationsManager",
 *     summary="Получение всех уведомлений",
 *     tags={"Manager"},
*@OA\Response(
*    response=200,
*    description="Success",
*    @OA\JsonContent(
*@OA\Property(property="notifications", type="array",
*            @OA\Items(
*                @OA\Property(property="id", type="integer"),
*                @OA\Property(property="application_id", type="integer"),
*                @OA\Property(property="content", type="string"),
*                @OA\Property(property="created_at", type="string"),
*                @OA\Property(property="updated_at", type="string"),
*                @OA\Property(property="manager", type="object",
*                    @OA\Property(property="id", type="integer"),
*                    @OA\Property(property="user_id", type="integer"),
*                    @OA\Property(property="user", type="object",
*                        @OA\Property(property="id", type="integer"),
*                        @OA\Property(property="name", type="string")
*                    )
*                ),
*                @OA\Property(property="application", type="object",
*                    @OA\Property(property="id", type="integer"),
*                    @OA\Property(property="user_id", type="integer"),
*                    @OA\Property(property="user", type="object",
*                        @OA\Property(property="id", type="integer"),
*                        @OA\Property(property="phone", type="string")
*                    )
*                )
*            )
*        ))),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getAllNotificationsManager(Request $request) {
    $user = Auth::guard('sanctum')->user();
    $notifications = ApplicationLogs::where('type', ApplicationLogType::Notification->value)
    ->whereHas('application.division', function ($query) use ($user) {
        $query->where('park_id', $user->manager->park_id);
    })
    ->with(['manager' => function ($query) {
        $query->select('id', 'user_id');
    }, 'manager.user' => function ($query) {
        $query->select('id', 'name');
    }, 'application' => function ($query) {
        $query->select('id', 'user_id');
    }, 'application.user' => function ($query) {
        $query->select('id', 'phone');
    }])
    ->get();
    return response()->json(['notifications' => $notifications], 200);
}
/**
 * Создание уведомлений
 *
 * Метод для создания уведомлений
 *
 * @OA\Post(
 *     path="manager/notification",
 *     operationId="createNotificationManager",
 *     summary="Создание уведомлений",
 *     tags={"Manager"},
   * @OA\RequestBody(
*         @OA\JsonContent(

*                         @OA\Property(property="message", type="text"),
*                         @OA\Property(property="date", type="timestamp"),
*                         @OA\Property(property="result", type="text"),
  *                      @OA\Property(property="id", type="integer")

    *          )),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string"),
 *             @OA\Property(property="id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function createNotificationManager(Request $request) {

    $user = Auth::guard('sanctum')->user();
    $managerId = $user->manager->id;

    $kanban = new KanbanController;
    $request->merge([
        'manager_id' => $managerId,
        'type'=> ApplicationLogType::Notification->value
    ]);

    return $kanban->createApplicationsLogItem($request);
}
/**
 * Изменение уведомлений
 *
 * Метод для изменение уведомлений
 *
 * @OA\Put(
 *     path="manager/notification",
 *     operationId="updateNotificationManager",
 *     summary="Изменение уведомлений",
 *     tags={"Manager"},
     * @OA\RequestBody(
*         @OA\JsonContent(
  *                      @OA\Property(property="result", type="text"),
  *                      @OA\Property(property="id", type="integer")
* )),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=400,
 *         description="Неверный запрос",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="")
 *         )
 *     ),
 *     @OA\Response(
 *         response=500,
 *         description="Ошибка сервера",
 *         @OA\JsonContent(
 *             @OA\Property(property="message", type="string", example="Ошибка сервера")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для привязки автомобилей к сроку аренды
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function updateNotificationManager(Request $request) {

    $user = Auth::guard('sanctum')->user();
    $managerId = $user->manager->id;

    $kanban = new KanbanController;
    $request->merge([
        'manager_id' => $managerId,
        'type'=> ApplicationLogType::Notification->name
    ]);

    return $kanban->updateApplicationsLogItem($request);
}


/**
 * Получение списков инвентаря парка
 *
 * Метод для получения списков инвентаря парка
 *
 * @OA\Get(
 *     path="/manager/park/inventory-lists",
 *     operationId="getParkInventoryListsManager",
 *     summary="Получение списков инвентаря парка",
 *     tags={"Manager"},
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="lists", type="array", @OA\Items(type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="type", type="string", ref="#/components/schemas/ParkInventoryTypes"),
 *                 @OA\Property(property="park_id", type="integer"),
 *                 @OA\Property(property="content", type="string"),
 *                 @OA\Property(property="created_at", type="string"),
 *                 @OA\Property(property="updated_at", type="string"),
 *                 @OA\Property(property="defaultValue", type="integer")
 *             ))
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с ID парка
 * @return \Illuminate\Http\JsonResponse JSON-ответ со списками инвентаря
 */
public function getParkInventoryListsManager(Request $request)  {
    $lists = ParkInventory::where('park_id',$request->park_id)->orWhere('defaultValue', true)->get();
    foreach ($lists as $listItem) {
        $listItem->type = ParkInventoryTypes::from($listItem->type)->name;
    }
    return response()->json(['lists' => $lists], 200);
}


/**
 * Изменение элемента списка инвентаря парка
 *
 * Метод для изменения элемента списка инвентаря парка
 *
 * @OA\Put(
 *     path="/manager/park/inventory-list",
 *     operationId="changeParkInventoryListItemManager",
 *     summary="Изменение элемента списка инвентаря парка",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer"),
 *             @OA\Property(property="content", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для изменения элемента списка инвентаря
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function changeParkInventoryListItemManager(Request $request)  {
    $listItem = ParkInventory::where('park_id',$request->park_id)->where('id', $request->id)->get();
if ($request->content) {
    $listItem->content = $request->content;
}
$listItem->save();
    return response()->json(['success' => true], 200);
}


/**
 * Создание элемента списка инвентаря парка
 *
 * Метод для создания элемента списка инвентаря парка
 *
 * @OA\Post(
 *     path="/manager/park/inventory-list",
 *     operationId="createParkInventoryListItemManager",
 *     summary="Создание элемента списка инвентаря парка",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="content", type="string"),
 *             @OA\Property(property="type", type="integer", ref="#/components/schemas/ParkInventoryTypes")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для создания элемента списка инвентаря
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function createParkInventoryListItemManager(Request $request)
{
    $listItem = new ParkInventory();
    $listItem->park_id = $request->park_id;
    $listItem->content = $request->content;
    $listItem->type = ParkInventoryTypes::{$request->type}->value;
    $listItem->defaultValue = false;

    $listItem->save();

    return response()->json(['success' => true], 200);
}


/**
 * Удаление элемента списка инвентаря парка
 *
 * Метод для удаления элемента списка инвентаря парка
 *
 * @OA\Delete(
 *     path="/manager/park/inventory-list",
 *     operationId="deleteParkInventoryListItemManager",
 *     summary="Удаление элемента списка инвентаря парка",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Элемент не найден",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для удаления элемента списка инвентаря
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function deleteParkInventoryListItemManager(Request $request)
{
    $listItem = ParkInventory::where('id', $request->id)
                             ->where('park_id', $request->park_id)
                             ->whete('default', false)
                             ->first();

    if ($listItem) {
        $listItem->delete();
        return response()->json(['success' => true, 'message' => 'Item deleted successfully'], 200);
    } else {
        return response()->json(['success' => false, 'message' => 'Item not found'], 404);
    }
}

/**
 * Выбор парка
 * Изменение парка для этого менеджера
 *
 * @OA\Post(
 *     path="/manager/park/select",
 *     operationId="selectParkForSuperManager",
 *     summary="Изменение парка для этого менеджера",
 *     tags={"Manager"},
 *     @OA\RequestBody(
 *         @OA\JsonContent(
 *             @OA\Property(property="id", type="integer")
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Элемент не найден",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для удаления элемента списка инвентаря
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function selectParkForSuperManager(Request $request)
{
    $user = Auth::guard('sanctum')->user();
    $manager = $user->manager;

if ($user->role_id !== UserRole::Admin->value) {
    return response()->json(['success' => false], 401);
    }
$manager->park_id = $request->id;
$manager->save();
return response()->json(['success' => true], 200);

}
/**
 * Данные парков
 * Получение данных парков
 *
 * @OA\Get(
 *     path="/manager/parks/data",
 *     operationId="getParksInitDataSuperManager",
 *     summary="Получение данных парков",
 *     tags={"Manager"},
 *     @OA\Response(
 *         response=200,
 *         description="Успешно",
 *         @OA\JsonContent(
* @OA\Property(property="parks", type="array", @OA\Items(type="object",
 *                 @OA\Property(property="id", type="integer"),
 *                 @OA\Property(property="park_name", type="string")
 *             )),
 *         )
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Элемент не найден",
 *         @OA\JsonContent(
 *             @OA\Property(property="success", type="boolean"),
 *             @OA\Property(property="message", type="string")
 *         )
 *     )
 * )
 *
 * @param \Illuminate\Http\Request $request Объект запроса с данными для удаления элемента списка инвентаря
 * @return \Illuminate\Http\JsonResponse JSON-ответ с результатом операции
 */
public function getParksInitDataSuperManager(Request $request)
{
    $user = Auth::guard('sanctum')->user();
    $manager = $user->manager;

if ($user->role_id !== UserRole::Admin->value) {
    return response()->json(['success' => false], 401);
    }
    $parks=Park::select('id',"park_name")->get();

    return response()->json(['parks' => $parks], 200);

}


    static function checkCarDataIsFilled($car) {
        $requiredFields = ['division_id', 'park_id', 'tariff_id', 'license_plate', 'mileage', 'rent_term_id', 'fuel_type', 'transmission_type', 'brand', 'model', 'year_produced', 'car_id', 'images'];
        foreach ($requiredFields as $field) {
            if ($car->$field === null) {
                return false;
            }
        }

        return true;
    }


     private function callRoute($url, $method, $requestData, $apiKey = null)
     {
         $subRequest = Request::create($url, $method, $requestData);
         $apiKey &&$subRequest->headers->set('X-API-key', $apiKey);
         $response = app()->handle($subRequest);
         return $response;
     }

    private function getDivisionIdByName($name, $divisions)
    {
        foreach ($divisions as $division) {
            if ($division->name === $name) {
                return $division->id;
            }
        }
        return null;
    }

    private function getTransmissionTypeByName($transmissionType)
    {
        if ($transmissionType ==='МКПП') {
            return 0;
        }
        if ($transmissionType ==='АКПП') {
            return 1;
        }

        return null;
    }

     private function getCarsFromParkClient($parkId) {
        $park = Park::where('id', $parkId)->select('url','login_1c','password_1c')->first();
        $url=$park->url;
        $url .= '/hs/Car/v1/Get';
        $username = $park->login_1c;
        $password = $park->password_1c;
        $response = Http::withoutVerifying()->withBasicAuth($username, $password)->get($url);

            if ($response->successful()) {
                return $response;
            } else {
                Log::info($response);
                return [];
            }
        return $response;
     }

     private function updateFieldAndCreateLog($request,  $oldValue, $newValue, $field,  $kanban) {
        if ($newValue !== $oldValue) {
            $request->merge([
                'type' => ApplicationLogType::Content->value,
                'column' => $field,
                'old_content' => $oldValue,
                'new_content' => $newValue
            ]);
            $kanban->createApplicationsLogItem($request);
        }
    }
}

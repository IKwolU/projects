<?php

namespace App\Http\Controllers;

use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\UserType;
use App\Models\Division;
use App\Models\Manager;
use App\Models\Park;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
     *                     @OA\Property(property="booking_window", type="integer", description="Время брони парка"),
     *                     @OA\Property(property="park_name", type="string", description="Название парка"),
     *                     @OA\Property(property="about", type="string", description="Описание парка"),
     *                     @OA\Property(property="created_at", type="string", description="Дата создания парка"),
     *                     @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо парка"),
     *                     @OA\Property(property="self_employed_discount", type="number", description="Скидка парка для самозанятых"),
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
     *                             @OA\Property(property="city", type="string", description="Город, в котором находится отделение"),
     *                             @OA\Property(
     *                                 property="cars",
     *                                 type="array",
     *                                 description="Список автомобилей в отделении",
     *                                 @OA\Items(
     *                                     type="object",
     *                                     @OA\Property(property="id", type="integer", description="id автомобиля"),
     *                                     @OA\Property(property="tariff_id", type="integer", description="id тарифа"),
     *                                     @OA\Property(property="mileage", type="number", description="Пробег автомобиля"),
     *                                     @OA\Property(property="license_plate", type="string", description="Государственный номер автомобиля"),
     *                                     @OA\Property(property="rent_term_id", type="integer", description="id условия аренды"),
     *                                     @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                                     @OA\Property(property="transmission_type", type="string", description="Тип коробки передач",ref="#/components/schemas/TransmissionType"),
     *                                     @OA\Property(property="brand", type="string", description="Марка автомобиля"),
     *                                     @OA\Property(property="model", type="string", description="Модель автомобиля"),
     *                                     @OA\Property(property="year_produced", type="integer", description="Год выпуска автомобиля"),
     *                                     @OA\Property(property="vin", type="string", description="vin автомобиля"),
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
     *                         description="Список подразделений в парке"
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

        $park = Park::where('id', $request->park_id)->with('divisions', 'divisions.city', 'rent_terms', 'tariffs', 'tariffs.city', 'rent_terms.schemas', 'divisions.cars', 'divisions.cars.booking')->first();

        unset($park->API_key);
        foreach ($park->divisions as $division) {
            $division->working_hours = json_decode($division->working_hours);
            $city = $division->city->name;
            unset($division->city, $division->park_id, $division->city_id);

            $division->city = $city;
            foreach ($division->cars as $car) {
                $car->images = json_decode($car->images);
                $car->fuel_type = FuelType::from($car->fuel_type)->name;
                $car->transmission_type = TransmissionType::from($car->transmission_type)->name;
                $car->status = CarStatus::from($car->status)->name;
                $car->vin = $car->car_id;
                unset($car->division_id, $car->park_id, $car->forbidden_republic_ids, $car->car_id);
            }
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
        return $this->callRouteWithApiKey('/cars', 'POST', $request->all(), $request->key);
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
            'fuel_type'=>FuelType::{$request->fuel_type}->value,
            'class'=>CarClass::{$request->car_class}->value
        ]);
        return $this->callRouteWithApiKey('/cars', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/cars/rent-term', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/cars/status', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/parks/rent-terms', 'POST', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/parks/division', 'POST', $request->all(), $request->key);
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
        $request->class=CarClass::{$car->class}->value;
        return $this->callRouteWithApiKey('/parks/tariff', 'POST', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/parks/tariff', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/parks/division', 'PUT', $request->all(), $request->key);
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
     *                 "id": {"Поле id обязательно для заполнения и должно быть строкой."}
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
        $request->merge(['car_id' => $request->vin ]);
        return $this->callRouteWithApiKey('/cars/booking', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/cars/booking/prolongation', 'PUT', $request->all(), $request->key);
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
        return $this->callRouteWithApiKey('/cars/booking/replace', 'PUT', $request->all(), $request->key);
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
            $formattedCar = [
                'license_plate' => $car->Number,
                'division_id' => $this->getDivisionIdByName($car->Department,$divisions),
                'year_produced' => date("Y", strtotime($car->YearCar)),
                'mileage' => $car->MileAge,
                'transmission_type' => $this->getTransmissionTypeByName($car->KPPType),
                'id' => $car->VIN,
                'date_sts' => $car->STSIssueDate,
            ];
            if (in_array($car->Number, $licenses)) {
                $index = array_search($car->Number, $licenses);
                if ($car->STSIssueDate > $licenseDates[$index]) {
                    unset($cars[$index]);
                    $licenses[$index] = $car->Number;
                    $licenseDates[$index] = $car->STSIssueDate;
                } else {
                    continue;
                }
            } else {
                $licenses[] = $car->Number;
                $licenseDates[] = $car->STSIssueDate;
            }
            $cars[] = $formattedCar;
        }

        $request->merge([
            'cars' => $cars
        ]);

        return $this->callRouteWithApiKey('/cars', 'POST', $request->all(), $request->key);
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
    public function getParkStatusesManager(Request $request)
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
         *     path="/manager/statuses",
         *     operationId="changeParkStatusManager",
         *     summary="Изменение статуса автомобиля парка",
         *     tags={"Manager"},
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

        return response()->json(['message' => 'Статус успешно обновлен'], 200);
    }

    private function callRouteWithApiKey($url, $method, $requestData, $apiKey)
    {
        $subRequest = Request::create($url, $method, $requestData);
        $subRequest->headers->set('X-API-key', $apiKey);
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
        $url = Park::where('id', $parkId)->select('url')->first()->url;
        $url .= '/hs/Car/v1/Get';


        $user = Auth::guard('sanctum')->user();
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

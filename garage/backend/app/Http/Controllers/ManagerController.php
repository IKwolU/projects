<?php

namespace App\Http\Controllers;

use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\UserType;
use App\Models\Manager;
use App\Models\Park;
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
     *     operationId="getParkKey",
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
    public function getParkKey(Request $request)
    {
        $key = Park::where('id', $request->park_id)->select('API_key')->first();
        return response()->json($key, 200);
    }
}
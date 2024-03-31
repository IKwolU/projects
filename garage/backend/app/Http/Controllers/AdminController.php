<?php

namespace App\Http\Controllers;

use App\Enums\CarClass;
use App\Enums\CarStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\UserStatus;
use App\Models\Park;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\UserType;
use App\Models\Division;
use App\Models\Manager;
use App\Models\User;
use Illuminate\Support\Facades\Validator;




class AdminController extends Controller
{

    /**
     * Показать список парков
     *
     * @OA\Get(
     *     path="api/admin/parks",
     *     operationId="getParks",
     *     summary="Показать список парков",
     *     tags={"Admin"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="parks",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", description="id парка"),
     *                     @OA\Property(property="park_name", type="string", description="Название парка")
     *                 )
     *             ))),
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
    public function getParks()
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $parks = Park::select('id', 'park_name')->get();
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['parks' => $parks], 200);
    }

    /**
     * Показать данные парка
     *
     * @OA\Get(
     *     path="api/admin/park",
     *     operationId="getParkWithDetails",
     *     summary="Показать данные парка",
     *     tags={"Admin"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="id парка")
     *         ),
     *     ),
     *              @OA\Response(
     *                  response="200",
     *                  description="Успешный ответ",
     *                  @OA\JsonContent(
     *                      @OA\Property(
     *                          property="parks",
     *                          type="array",
     *                          @OA\Items(
     *                              type="object",
     *                              @OA\Property(property="url", type="string", description="Endpoint парка для ответа"),
     *                              @OA\Property(property="commission", type="number", description="Комиссия парка"),
     *                              @OA\Property(property="period_for_book", type="integer", description="Время брони парка"),
     *                              @OA\Property(property="park_name", type="string", description="Название парка"),
     *                              @OA\Property(property="about", type="string", description="Описание парка"),
     *                              @OA\Property(property="created_at", type="string", description="Дата создания парка"),
     *                              @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо парка"),
     *                              @OA\Property(property="self_imployeds_discount", type="number", description="Скидка парка для самозанятых"),
     *                              @OA\Property(
     *                                  property="divisions",
     *                                  type="array",
     *                                  @OA\Items(
     *                                      type="object",
     *                                      @OA\Property(property="id", type="integer", description="id отделения"),
     *                                      @OA\Property(property="coords", type="string", description="Координаты отделения"),
     *                                      @OA\Property(property="address", type="string", description="Адрес отделения"),
     *                                      @OA\Property(property="metro", type="string", description="Станция метро ближайшая к отделению"),
     *                                      @OA\Property(
     *                                          property="working_hours",
     *                                          type="array",
     *                                          @OA\Items(
     *                                              type="object",
     *                                              @OA\Property(property="day", type="string", description="День недели"),
     *                                              @OA\Property(
     *                                                  property="end",
     *                                                  type="object",
     *                                                  @OA\Property(property="hours", type="integer", description="Час окончания"),
     *                                                  @OA\Property(property="minutes", type="integer", description="Минуты окончания")
     *                                              ),
     *                                              @OA\Property(
     *                                                  property="start",
     *                                                  type="object",
     *                                                  @OA\Property(property="hours", type="integer", description="Час начала"),
     *                                                  @OA\Property(property="minutes", type="integer", description="Минуты начала")
     *                                              )
     *                                          ),
     *                                          description="Рабочие часы отделения"
     *                                      ),
     *                                      @OA\Property(property="timezone_difference", type="integer", description="Разница во времени"),
     *                                      @OA\Property(property="created_at", type="string", description="Дата создания отделения"),
     *                                      @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо отделения"),
     *                                      @OA\Property(property="name", type="string", description="Название отделения"),
     *                                      @OA\Property(property="phone", type="string", description="Телефон отделения"),
     *                                      @OA\Property(property="city", type="string", description="Город, в котором находится отделение"),
     *                                      @OA\Property(
     *                                          property="cars",
     *                                          type="array",
     *                                          description="Список автомобилей в отделении",
     *                                          @OA\Items(
     *                                              type="object",
     *                                              @OA\Property(property="id", type="integer", description="id автомобиля"),
     *                                              @OA\Property(property="tariff_id", type="integer", description="id тарифа"),
     *                                              @OA\Property(property="mileage", type="number", description="Пробег автомобиля"),
     *                                              @OA\Property(property="license_plate", type="string", description="Государственный номер автомобиля"),
     *                                              @OA\Property(property="rent_term_id", type="integer", description="id условия аренды"),
     *                                              @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                                              @OA\Property(property="transmission_type", type="string", description="Тип коробки передач",ref="#/components/schemas/TransmissionType"),
     *                                              @OA\Property(property="brand", type="string", description="Марка автомобиля"),
     *                                              @OA\Property(property="model", type="string", description="Модель автомобиля"),
     *                                              @OA\Property(property="year_produced", type="integer", description="Год выпуска автомобиля"),
     *                                              @OA\Property(property="vin", type="string", description="vin автомобиля"),
     *                                              @OA\Property(property="images", type="array", description="Ссылки на изображения автомобиля",
     *                                                  @OA\Items(type="string")
     *                                              ),
     *                                              @OA\Property(property="status", type="string", description="Статус доступности для бронирования",ref="#/components/schemas/CarStatus"),
     *                                              @OA\Property(property="created_at", type="string", description="Дата создания записи об автомобиле"),
     *                                              @OA\Property(property="updated_at", type="string", description="Последнее обновление записи об автомобиле"),
     *                                              @OA\Property(
     *                          property="booking",
     *                          type="array",
     *                          description="Список бронирований для данного автомобиля",
     *                          @OA\Items(
     *                              type="object",
     *                              @OA\Property(property="id", type="integer", description="id бронирования"),
     *                              @OA\Property(property="status", type="integer", description="статус бронирования"),
     *                              @OA\Property(property="schema_id", type="integer", description="id схемы"),
     *                              @OA\Property(property="car_id", type="integer", description="id автомобиля"),
     *                              @OA\Property(property="driver_id", type="integer", description="id водителя"),
     *                              @OA\Property(property="booked_at", type="string", format="datetime", description="дата и время начала бронирования"),
     *                              @OA\Property(property="booked_until", type="string", format="datetime", description="дата и время окончания бронирования"),
     *                              @OA\Property(property="park_id", type="integer", description="id парка"),
     *                              @OA\Property(property="created_at", type="string", format="datetime", description="дата создания записи"),
     *                              @OA\Property(property="updated_at", type="string", format="datetime", description="дата последнего обновления записи")
     *                          )
     *                          )
     *                                                           )
     *                                                       )
     *                                                   )
     *                                                   ),
     *                                                   description="Список отделений в парке"
     *                                               )
     *                                           )
     *                                       )
     *         ),
     * @OA\Property(
     *    property="rent_terms",
     *    type="array",
     *    description="Список тарифов аренды",
     *    @OA\Items(
     *        type="object",
     *        @OA\Property(property="id", type="integer", description="id тарифа"),
     *        @OA\Property(property="deposit_amount_daily", type="string", description="Сумма депозита на день"),
     *        @OA\Property(property="deposit_amount_total", type="string", description="Общая сумма депозита"),
     *        @OA\Property(property="minimum_period_days", type="integer", description="Минимальный период аренды в днях"),
     *        @OA\Property(property="name", type="string", description="Название тарифа"),
     *        @OA\Property(property="is_buyout_possible", type="integer", description="Возможность выкупа"),
     *        @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *        @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи"),
     *        @OA\Property(
     *            property="schemas",
     *            type="array",
     *            description="Схемы тарифов",
     *            @OA\Items(
     *                type="object",
     *                @OA\Property(property="id", type="integer", description="id схемы"),
     *                @OA\Property(property="daily_amount", type="number", description="Сумма за день"),
     *                @OA\Property(property="non_working_days", type="integer", description="Количество нерабочих дней"),
     *                @OA\Property(property="working_days", type="integer", description="Количество рабочих дней"),
     *                @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *                @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи")
     *            )
     *        )
     *    )
     *),
     *@OA\Property(
     *    property="tariffs",
     *    type="array",
     *    description="Список тарифов",
     *    @OA\Items(
     *        type="object",
     *        @OA\Property(property="id", type="integer", description="id тарифа"),
     *        @OA\Property(property="class", type="string", description="Класс" , ref="#/components/schemas/CarClass"),
     *        @OA\Property(property="city", type="string", description="Город"),
     *        @OA\Property(property="criminal_ids", type="string", description="id преступлений"),
     *        @OA\Property(property="has_caused_accident", type="integer", description="Было ли аварий"),
     *        @OA\Property(property="experience", type="integer", description="Опыт"),
     *        @OA\Property(property="max_fine_count", type="integer", description="Максимальное количество штрафов"),
     *        @OA\Property(property="abandoned_car", type="integer", description="Брошенный автомобиль"),
     *        @OA\Property(property="min_scoring", type="integer", description="Минимальный балл"),
     *        @OA\Property(property="is_north_caucasus", type="integer", description="Северный Кавказ"),
     *        @OA\Property(property="forbidden_republic_ids", type="string", description="Запрещенные республики"),
     *        @OA\Property(property="alcohol", type="integer", description="Алкоголь"),
     *        @OA\Property(property="created_at", type="string", format="datetime", description="Дата создания записи"),
     *        @OA\Property(property="updated_at", type="string", format="datetime", description="Дата последнего обновления записи")
     *    )
     *)
     *     ,
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

    public function getParkWithDetails(Request $request)
    {
        $request->validate([
            'id' => 'required|integer'
        ]);
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type !== UserType::Admin->value) {
            return response()->json(['Нет прав доступа'], 409);
        }
        $park = Park::where('id', $request->id)->with('divisions', 'divisions.city', 'rent_terms', 'tariffs', 'tariffs.city', 'rent_terms.schemas', 'divisions.cars', 'divisions.cars.booking')->get();
        foreach ($park as $item) {
            unset($item->API_key, $item->id);
            foreach ($item->divisions as $division) {
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
            foreach ($item->rent_terms as $rent_term) {
                unset($rent_term->park_id);
                foreach ($rent_term->schemas as $schema) {
                    unset($schema->rent_term_id);
                }
            }
            foreach ($item->tariffs as $tariff) {
                $city = $tariff->city->name;
                unset($tariff->city, $tariff->park_id, $tariff->city_id);
                $tariff->class = CarClass::from($tariff->class)->name;
                $tariff->city = $city;
            }
        }
        return response()->json(['park' => $park], 200);
    }

    /**
     * Создать парк
     *
     * @OA\Post(
     *     path="api/admin/parks",
     *     operationId="createPark",
     *     summary="Создать парк",
     *     tags={"Admin"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", description="Имя парка"),
     *             @OA\Property(property="manager_phone", type="string", description="Телефон менеджера"),
     *         ),
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="park",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", description="id парка"),
     *                     @OA\Property(property="park_name", type="string", description="Название парка")
     *                 )
     *             ))),
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

    public function createPark(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type !== UserType::Admin->value) {
            return response()->json(['Нет прав доступа'], 409);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'manager_phone' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => $validator->errors()], 400);
        }

        $name = $request->input('name');
        $managerPhone = $request->input('manager_phone');

        if (Park::where('park_name', $name)->exists()) {
            return response()->json(['message' => 'Имя парка уже используется'], 400);
        }

        if (User::where('phone', $managerPhone)->exists()) {
            return response()->json(['message' => 'Номер телефона уже используется'], 400);
        }
        $apiKey = uuid_create(UUID_TYPE_RANDOM);

        $managerUser = User::create();
        $managerUser->phone = $managerPhone;
        $managerUser->user_type = UserType::Manager->value;
        $managerUser->user_status = UserStatus::Verification->value;
        $managerUser->save();

        $park = Park::create([
            'API_key' => $apiKey,
            'park_name' => $name,
        ]);

        $manager = Manager::create([
            'park_id' => $park->id,
            'user_id' => $managerUser->id,
        ]);

        $parkData = [
            'id' => $park->id,
            'park_name' => $park->park_name,
        ];

        return response()->json(['park' => $parkData], 200);
    }


    /**
     * Показать список парков
     *
     * @OA\Get(
     *     path="api/admin/users",
     *     operationId="getUsers",
     *     summary="Показать список парков",
     *     tags={"Admin"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     * @OA\JsonContent(
     *     @OA\Property(
     *         property="users",
     *         type="array",
     *         @OA\Items(
     *             type="object",
     *             @OA\Property(property="id", type="integer", description="User ID"),
     *             @OA\Property(property="user_status", type="string", description="Status of the user",ref="#/components/schemas/UserStatus"),
     *             @OA\Property(property="phone", type="string", description="Phone number of the user"),
     *             @OA\Property(property="name", type="string", description="Name of the user"),
     *             @OA\Property(property="email", type="string", description="Email of the user"),
     *             @OA\Property(property="email_verified_at", type="string", description="Timestamp of email verification"),
     *             @OA\Property(property="created_at", type="string", description="Timestamp of user creation"),
     *             @OA\Property(property="updated_at", type="string", description="Timestamp of last user update"),
     *             @OA\Property(property="user_type", type="string", description="Type of user",ref="#/components/schemas/UserType")
     *         )
     *     )
     * )),
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
    public function getUsers()
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $users = User::get();
            foreach ($users as $userItem) {
                $userItem->user_type = UserType::from($userItem->user_type)->name;
                $userItem->user_status = UserStatus::from($userItem->user_status)->name;
                unset($userItem->code, $userItem->avatar, $userItem->settings, $userItem->role_id);
            }
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['users' => $users], 200);
    }
}

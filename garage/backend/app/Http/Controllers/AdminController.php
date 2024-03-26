<?php

namespace App\Http\Controllers;

use App\Models\Park;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Enums\UserType;
use App\Models\Division;
use Illuminate\Support\Facades\Validator;




class AdminController extends Controller
{

    /**
     * Показать список парков
     *
     * @OA\Get(
     *     path="admin/parks",
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
     *                     @OA\Property(property="API_key", type="string", description="Ключ парка"),
     *                     @OA\Property(property="url", type="string", description="Endpoint парка для ответа"),
     *                     @OA\Property(property="commission", type="number", description="Комиссия парка"),
     *                     @OA\Property(property="period_for_book", type="integer", description="Время брони парка"),
     *                     @OA\Property(property="park_name", type="string", description="Название парка"),
     *                     @OA\Property(property="about", type="string", description="Описание парка"),
     *                     @OA\Property(property="created_at", type="string", description="Дата создания парка"),
     *                     @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо парка"),
     *                     @OA\Property(property="self_imployeds_discount", type="number", description="Скидка парка для самозанятых")
     *                 )
     *             ),
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
            $parks = Park::all();
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['parks' => $parks], 200);
    }

    /**
     * Показать список парков
     *
     * @OA\Post(
     *     path="admin/parks",
     *     operationId="createPark",
     *     summary="Создать парк",
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
     *                     @OA\Property(property="API_key", type="string", description="Ключ парка"),
     *                 )
     *             ),
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

    public function createPark()
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $apiKey = uuid_create(UUID_TYPE_RANDOM);
            $park = Park::create();
            $park->api_key = $apiKey;
            $park->save();
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }

        unset(
            $park->updated_at,
            $park->created_at
        );
        return response()->json(['park' => $park], 200);
    }


    /**
     * Показать список парков
     *
     * @OA\Post(
     *     path="admin/parks",
     *     operationId="createPark",
     *     summary="Создать парк",
     *     tags={"Admin"},
     *     @OA\RequestBody(
     *         required=true,
     * @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", description="id парка"),
     *             @OA\Property(property="url", type="string", description="URL парка"),
     *             @OA\Property(property="commission", type="number", description="Комиссия"),
     *             @OA\Property(property="park_name", type="string", description="Название парка"),
     *             @OA\Property(property="period_for_book", type="number", description="Срок на который можно забронировать авто, в часах"),
     *             @OA\Property(property="about", type="string", description="Описание парка"),
     *             @OA\Property(property="self_imployeds_discount", type="integer", description="Скидка от парка при работе с самозанятыми(не обязателньое поле)"),
     *     )),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
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

    public function changeParks(Request $request)
    {

        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $validator = Validator::make($request->all(), [
                'id' => 'required|integer',
                'url' => 'string',
                'commission' => 'numeric',
                'park_name' => 'string',
                'about' => 'string', 'phone' => 'string',
                'self_imployeds_discount' => 'integer',
                'phone' => 'string',
                'period_for_book' => 'integer',
            ]);
            $park = Park::where('id', $request->id)->first();
            if ($validator->fails()) {
                return response()->json(['message' => 'Ошибка валидации', 'errors' => $validator->errors()], 400);
            }
            if ($request->period_for_book) {
                $park->period_for_book = $request->period_for_book;
            }
            if ($request->url) {
                $park->url = $request->url;
            }
            if ($request->commission) {
                $park->commission = $request->commission;
            }
            if ($request->park_name) {
                $park->park_name = $request->park_name;
            }
            if ($request->about) {
                $park->about = $request->about;
            }
            if ($request->self_imployeds_discount) {
                $park->self_imployeds_discount = $request->self_imployeds_discount;
            }
            $park->save();
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }

        return response()->json(['message' => 'Парк обновлен'], 200);
    }

    /**
     * Показать список подразделений
     *
     * @OA\Get(
     *     path="admin/division",
     *     operationId="getDivisions",
     *     summary="Показать список подразделений",
     *     tags={"Admin"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="divisions",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", description="id подразделения"),
     *                     @OA\Property(property="park_id", type="integer", description="id парка"),
     *                     @OA\Property(property="city", type="string", description="Город подразделения"),
     *                     @OA\Property(property="coords", type="string", description="Координаты подразделения"),
     *                     @OA\Property(property="address", type="string", description="Адрес"),
     *                     @OA\Property(property="metro", type="integer", description="Ближайшее метро"),
     *                      @OA\Property(
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
     *                     @OA\Property(property="timezone_difference", type="string", description="Разница часовых поясов подразделения"),
     *                     @OA\Property(property="created_at", type="string", description="Дата создания подразделения"),
     *                     @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо подразделения"),
     *                     @OA\Property(property="name", type="string", description="Название подразделения"),
     *                     @OA\Property(property="phone", type="string", description="Телефон подразделения")
     *                 )
     *             ),
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

    public function getDivisions(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $request->park_id ? $divisions = Division::where('park_id', $request->park_id)->with('city')->get() : $divisions = Division::with('city')->get();;

            foreach ($divisions as $division) {
                $city = $division->city->name;
                $division->working_hours = json_decode($division->working_hours);
                unset($division->city);
                unset($division->city_id);
                $division->city = $city;
            }
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['divisions' => $divisions], 200);
    }

    /**
     * Показать список подразделений
     *
     * @OA\Post(
     *     path="admin/division",
     *     operationId="getDivisions",
     *     summary="Показать список подразделений",
     *     tags={"Admin"},
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(
     *                 property="divisions",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", description="id подразделения"),
     *                     @OA\Property(property="park_id", type="integer", description="id парка"),
     *                     @OA\Property(property="city", type="string", description="Город подразделения"),
     *                     @OA\Property(property="coords", type="string", description="Координаты подразделения"),
     *                     @OA\Property(property="address", type="string", description="Адрес"),
     *                     @OA\Property(property="metro", type="integer", description="Ближайшее метро"),
     *                      @OA\Property(
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
     *                     @OA\Property(property="timezone_difference", type="string", description="Разница часовых поясов подразделения"),
     *                     @OA\Property(property="created_at", type="string", description="Дата создания подразделения"),
     *                     @OA\Property(property="updated_at", type="string", description="Последнее обновление инфо подразделения"),
     *                     @OA\Property(property="name", type="string", description="Название подразделения"),
     *                     @OA\Property(property="phone", type="string", description="Телефон подразделения")
     *                 )
     *             ),
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

    public function createDivisions(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $request->park_id ? $divisions = Division::where('park_id', $request->park_id)->with('city')->get() : $divisions = Division::with('city')->get();;

            foreach ($divisions as $division) {
                $city = $division->city->name;
                $division->working_hours = json_decode($division->working_hours);
                unset($division->city);
                unset($division->city_id);
                $division->city = $city;
            }
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['divisions' => $divisions], 200);
    }

    public function changeDivisions(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        if ($user->user_type === UserType::Admin->value) {
            $request->park_id ? $divisions = Division::where('park_id', $request->park_id)->with('city')->get() : $divisions = Division::with('city')->get();;

            foreach ($divisions as $division) {
                $city = $division->city->name;
                $division->working_hours = json_decode($division->working_hours);
                unset($division->city);
                unset($division->city_id);
                $division->city = $city;
            }
        } else {
            return response()->json(['Нет прав доступа'], 409);
        }
        return response()->json(['divisions' => $divisions], 200);
    }
}

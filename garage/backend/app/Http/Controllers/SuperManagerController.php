<?php

namespace App\Http\Controllers;

use App\Models\Park;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SuperManagerController extends Controller
{
    /**
     * Выбор парка
     * Изменение парка для этого менеджера
     *
     * @OA\Post(
     *     path="/manager/super/park/select",
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
        $manager->park_id = $request->id;
        $manager->save();
        return response()->json(['success' => true], 200);
    }
    /**
     * Блокирование парка
     *
     * @OA\Post(
     *     path="/manager/super/park/block",
     *     operationId="blockParkSuperManager",
     *     summary="Блокирование парка",
     *     tags={"Manager"},
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
    public function blockParkSuperManager(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $park = Park::where('id', $user->manager->park_id)->first();
        $park->is_blocked = true;
        $park->save();
        return response()->json(['success' => true], 200);
    }
    /**
     * Разблокирование парка
     *
     * @OA\Post(
     *     path="/manager/super/park/unblock",
     *     operationId="unblockParkSuperManager",
     *     summary="Разблокирование парка",
     *     tags={"Manager"},
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
    public function unblockParkSuperManager(Request $request)
    {
        $user = Auth::guard('sanctum')->user();
        $park = Park::where('id', $user->manager->park_id)->first();
        $park->is_blocked = false;
        $park->save();
        return response()->json(['success' => true], 200);
    }
}

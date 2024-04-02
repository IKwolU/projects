<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="DayOfWeek",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum DayOfWeek: string
{
    case Monday = 'Понедельник';
    case Tuesday = 'Вторник';
    case Wednesday = 'Среда';
    case Thursday = 'Четверг';
    case Friday = 'Пятница';
    case Saturday = 'Суббота';
    case Sunday = 'Воскресенье';
}

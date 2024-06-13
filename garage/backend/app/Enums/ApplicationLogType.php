<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="ApplicationLogType",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum ApplicationLogType: int
{
    case Create = 1;
    case Stage = 2;
    case Content = 3;
    case Notification = 4;
    case Comment = 5;

}

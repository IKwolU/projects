<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;


/**
 * @OA\Schema(
 *   schema="UserRole",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */
enum UserRole: int
{   case Admin = 1;
    case Driver = 2;
    case Manager = 3;

}

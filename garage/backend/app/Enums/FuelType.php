<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="FuelType",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum FuelType: int
{
    case methane = 1;
    case propane = 0;
    case gasoline = 2;
    case electric = 3;
}

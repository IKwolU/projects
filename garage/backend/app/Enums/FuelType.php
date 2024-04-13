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
    case Gasoline = 0;
    case Methane = 1;
    case Propane = 2;
    case Electric = 3;
}

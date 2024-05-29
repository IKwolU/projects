<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="CarStatus",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum CarStatus: int
{
    case AvailableForBooking = 1;
    case Hidden = 0;
    case Booked = 2;
    case Rented = 3;
}

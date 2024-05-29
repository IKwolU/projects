<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="CancellationSources",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum CancellationSources: int
{
    case Driver = 1;
    case Manager = 2;
    case System = 3;
}

<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="ParkInventoryTypes",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

 enum ParkInventoryTypes: string
 {
     case AdSource = '1'; // Advertising source
     case BookingRejectionReason = '2'; // Booking rejection reason
     case CarRejectionReason = '3'; // Car rejection reason
 }

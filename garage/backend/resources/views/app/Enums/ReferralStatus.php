<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="ReferralStatus",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

enum ReferralStatus: string
{
    case NoInvited = 'NoInvited';
    case Invited = 'Invited';
    case Approved = 'Approved';
}

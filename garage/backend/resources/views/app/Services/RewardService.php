<?php

namespace App\Services;

use App\Enums\ReferralStatus;
use App\Models\Referral;
use Illuminate\Support\Facades\File;


class RewardService
{
    public function rewardingReferral($userId)
    {
        $referralReward = 200;
        $inviterReward = 100;
        $referral = Referral::where('user_id', $userId)->first();
        $inviter = Referral::where('user_id', $referral->invited_id)->first();
        $referral->coins = $referral->coins + $referralReward;
        $inviter->coins = $inviter->coins + $inviterReward;
        $referral->status = ReferralStatus::Approved->name;
        $referral->save();
        $inviter->save();
        return true;
    }
}

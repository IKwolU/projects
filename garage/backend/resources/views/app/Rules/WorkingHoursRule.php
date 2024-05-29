<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class WorkingHoursRule implements Rule
{
    public function passes($attribute, $value)
    {

        foreach ($value as $workingDay) {
            if (
                !isset($workingDay['start']['hours']) || !isset($workingDay['start']['minutes']) ||
                !isset($workingDay['end']['hours']) || !isset($workingDay['end']['minutes']) ||
                $workingDay['start']['hours'] < 0 || $workingDay['start']['hours'] > 23 ||
                $workingDay['start']['minutes'] < 0 || $workingDay['start']['minutes'] > 59 ||
                $workingDay['end']['hours'] < 0 || $workingDay['end']['hours'] > 23 ||
                $workingDay['end']['minutes'] < 0 || $workingDay['end']['minutes'] > 59
            ) {
                return false;
            }
        }

        return true;
    }

    public function message()
    {
        return 'The :attribute field must have valid working hours for each day of the week.';
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use App\Models\Car;
use App\Models\Tariff;
use App\Models\City;
use App\Models\Driver;
use App\Models\DriverSpecification;
use App\Models\Division;use App\Models\Park;
use App\Models\RentTerm;
use App\Models\Schema;
use Illuminate\Support\Facades\Auth;
use App\Enums\UserStatus;
use App\Enums\FuelType;
use App\Enums\TransmissionType;
use App\Enums\CarStatus;
use App\Http\Controllers\ParserController;
use App\Enums\CarClass;
use Carbon\Carbon;
use App\Http\Controllers\APIController;
use App\Enums\BookingStatus;
use App\Enums\DayOfWeek;
use Illuminate\Support\Facades\DB;

class CarsController extends Controller

{

    /**
     * Получение списка автомобилей с учетом фильтров (аутентифицированный запрос)
     *
     * @OA\Post(
     *     path="/cars/search",
     *     operationId="SearchCars",
     *     summary="Получение списка автомобилей с учетом фильтров (аутентифицированный запрос)",
     *     tags={"Cars"},
     *     security={{"bearerAuth": {}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="offset", type="integer", description="Смещение (начальная позиция) для выборки"),
     *             @OA\Property(property="limit", type="integer", description="Максимальное количество записей для выборки"),
     *             @OA\Property(property="city", type="string", description="Название города"),
     *             @OA\Property(property="commission", type="number", description="Комиссия парка"),
     *             @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *             @OA\Property(property="transmission_type", type="string", description="Тип трансмиссии",ref="#/components/schemas/TransmissionType"),
     *             @OA\Property(property="brand", type="array", description="Марка автомобиля", @OA\Items()),
     *             @OA\Property(property="park_name", type="array", description="Парк автомобиля", @OA\Items()),
     *             @OA\Property(property="search", type="array", description="Марка или модель автомобиля",@OA\Items()),
     *             @OA\Property(property="sorting", type="string", description="сортировка, asc или desc"),
     *             @OA\Property(property="car_vin", type="string", description="VIN авто"),
     *             @OA\Property(property="schemas", type="object", description="Данные о сроке аренды",
     *                 @OA\Property(property="non_working_days", type="integer", description="Количество нерабочих дней"),
     *                 @OA\Property(property="working_days", type="integer", description="Количество рабочих дней"),
     *             ),
     *             @OA\Property(property="is_buyout_possible", type="boolean", description="Возможность выкупа"),
     *             @OA\Property(property="model", type="array", description="Модель автомобиля",@OA\Items()),
     *             @OA\Property(property="car_class", type="array", description="Класс автомобиля (1 - Эконом, 2 - Комфорт, 3 - Комфорт+, 4 - Бизнес)",@OA\Items(ref="#/components/schemas/CarClass"))
     *         )
     *     ),
     *     @OA\Response(
     *         response="200",
     *         description="Успешный ответ",
     *         @OA\JsonContent(
     *             @OA\Property(property="cars", type="array", @OA\Items(
     *                 @OA\Property(property="id", type="integer", description="Идентификатор автомобиля"),
     *                 @OA\Property(property="fuel_type", type="string", description="Тип топлива",ref="#/components/schemas/FuelType"),
     *                 @OA\Property(property="transmission_type", type="string", description="Тип трансмиссии",ref="#/components/schemas/TransmissionType"),
     *                 @OA\Property(property="brand", type="string", description="Марка автомобиля"),
     *                 @OA\Property(property="model", type="string", description="Модель автомобиля"),
     *                 @OA\Property(property="mileage", type="string", description="Пробег автомобиля"),
     *                 @OA\Property(property="commission", type="number", description="Комиссия парка"),
     *                 @OA\Property(property="vin", type="string", description="VIN автомобиля"),
     *                 @OA\Property(property="year_produced", type="integer", description="Год производства"),
     *                 @OA\Property(property="images", type="array", @OA\Items(type="string"), description="Ссылки на изображения"),
     *                 @OA\Property(property="сar_class", type="string", description="Класс тарифа", ref="#/components/schemas/CarClass"),
     *                 @OA\Property(property="park_name", type="string", description="Название парка"),
     *                 @OA\Property(property="cars_count", type="number", description="Количество одинаковых"),
     *             @OA\Property(
     *                 property="working_hours",
     *                 type="array",
     *                 description="Расписание работы парка",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="day", type="string", description="День недели на английском",ref="#/components/schemas/DayOfWeek"),
     *                     @OA\Property(
     *                         property="start",
     *                         type="object",
     *                         description="Время начала работы",
     *                         @OA\Property(property="hours", type="integer", description="Часы (0-23)"),
     *                         @OA\Property(property="minutes", type="integer", description="Минуты (0-59)")
     *                     ),
     *                     @OA\Property(
     *                         property="end",
     *                         type="object",
     *                         description="Время окончания работы",
     *                         @OA\Property(property="hours", type="integer", description="Часы (0-23)"),
     *                         @OA\Property(property="minutes", type="integer", description="Минуты (0-59)")
     *                     )
     *                 )
     *             ),
     *                 @OA\Property(property="about", type="string", description="Описание парка"),
     *                 @OA\Property(property="city", type="string"),
     *                 @OA\Property(property="division", type="object", description="Данные о подразделении",
     *                     @OA\Property(property="address", type="string", description="Адрес"),
     *                     @OA\Property(property="coords", type="string", description="Координаты подразделения"),
     *                     @OA\Property(property="phone", type="string"),
     *                 ),
     *                 @OA\Property(property="rent_term", type="object", description="Данные о сроке аренды",
     *                     @OA\Property(property="deposit_amount_daily", type="number", description="Сумма депозита за день"),
     *                     @OA\Property(property="deposit_amount_total", type="number", description="Общая сумма депозита"),
     *                     @OA\Property(property="minimum_period_days", type="integer", description="Минимальный период в днях"),
     *                     @OA\Property(property="is_buyout_possible", type="boolean", description="Возможность выкупа"),
     *                     @OA\Property(property="schemas", type="array", @OA\Items(
     *                         @OA\Property(property="daily_amount", type="integer", description="Суточная стоимость"),
     *                         @OA\Property(property="id", type="integer"),
     *                         @OA\Property(property="non_working_days", type="integer", description="Количество нерабочих дней"),
     *                         @OA\Property(property="working_days", type="integer", description="Количество рабочих дней"),
     *                     )),
     *                 ),
     *             )),
     *         ),
     *     ),
     *     @OA\Response(response="401", description="Ошибка аутентификации"),
     *     @OA\Response(response="422", description="Ошибки валидации"),
     *     @OA\Response(response="500", description="Ошибка сервера"),
     * )
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */


    public function SearchCars(Request $request)
    {
        $request->validate([
            'offset' => 'required|integer',
            'limit' => 'required|integer',
            'city' => ['required', 'string', 'max:250', 'exists:cities,name'],
        ]);
        $offset = $request->offset;
        $sorting = $request->sorting ?? 'asc';
        $limit = $request->limit;
        $user = Auth::guard('sanctum')->user();
        $fuelType = $request->fuel_type ? FuelType::{$request->fuel_type}->value : null;
        $transmissionType = $request->transmission_type ? TransmissionType::{$request->transmission_type}->value : null;
        $city = City::where('name', $request->city)->first();
        $search = $request->search;
        $carVin = $request->car_vin;
        $cityId = $city->id;
        $rentTerm = $request->schemas;
        if (!$city) {
            return response()->json(['error' => 'Город не найден'], 404);
        }

        $brand = $request->brand;
        $model = $request->model;
        $parksName = $request->park_name;
        $carClassValues = $request->car_class ? $request->car_class : [];
        $translatedValues = [];

        if (count($carClassValues) > 0) {
            foreach ($carClassValues as $key) {
                $keyNew = CarClass::{$key}->value;
                $translatedValues[$key] = $keyNew;
            }
        }
        $translatedValues = array_values($translatedValues);
        $carClass = $translatedValues;
        $isBuyoutPossible = $request->is_buyout_possible;
        $commission = $request->commission;

        $carsQuery = Car::query()->where('rent_term_id', '!=', null)->where('status', CarStatus::AvailableForBooking->value)
            ->whereHas('division', function ($query) use ($cityId) {
                $query->where('city_id', $cityId);
            });

        // отключена проверка по спецификации!
        // if ($user && $user->user_status == UserStatus::Verified->value) {
        //     $driverSpecifications = $user->driver->driverSpecification;
        //     if ($driverSpecifications) {
        //         $carsQuery->whereHas('tariff', function ($query) use ($driverSpecifications) {
        //             $criminalIds = explode(',', $driverSpecifications->criminal_ids);
        //             $criminalIds = array_map('intval', $criminalIds);
        //             if (!empty(array_filter($criminalIds, 'is_numeric'))) {
        //                 $query->whereNotIn('criminal_ids', $criminalIds);
        //             }
        //             if ($driverSpecifications->is_north_caucasus) {
        //                 $query->where('is_north_caucasus', 0);
        //             }
        //             $query->where('experience', '<=', $driverSpecifications->experience);
        //             $query->where('max_fine_count', '>=', $driverSpecifications->fine_count);
        //             $query->where('min_scoring', '<=', $driverSpecifications->scoring);
        //             if ($driverSpecifications->has_caused_accident == 1) {
        //                 $query->where('has_caused_accident', 0);
        //             }
        //             if ($driverSpecifications->abandoned_car == 1) {
        //                 $query->where('abandoned_car', 0);
        //             }
        //             if ($driverSpecifications->has_caused_accident == 1) {
        //                 $query->where('has_caused_accident', 0);
        //             }
        //             if ($driverSpecifications->alcohol == 1) {
        //                 $query->where('alcohol', 0);
        //             }
        //         });
        //     }
        // }
        if ($fuelType!==null) {
            $carsQuery->where('fuel_type', $fuelType);
        }
        if ($transmissionType!==null) {
            $carsQuery->where('transmission_type', $transmissionType);
        }

        if ($brand && count($brand) > 0) {
            $brandArray = is_array($brand) ? $brand : [$brand];
            $carsQuery->whereIn('brand', $brandArray);
        }

        if ($model && count($model) > 0) {
            $modelArray = is_array($model) ? $model : [$model];
            $carsQuery->whereIn('model', $modelArray);
        }
        if ($search) {
            $keywords = explode(' ', $search);
            $carsQuery->where(function ($query) use ($keywords) {
                foreach ($keywords as $keyword) {
                    $query->orWhere('brand', 'like', '%' . str_replace(' ', '%', $keyword) . '%')
                        ->orWhere('model', 'like', '%' . str_replace(' ', '%', $keyword) . '%');
                }
            });
        }
        if ($carVin) {
            $carsQuery->where(function ($query) use ($carVin) {
                $query->where('car_id', 'like', '%' . $carVin . '%');
            });
        }
        if (count($carClass) > 0) {
            $carsQuery->whereHas('tariff', function ($query) use ($carClass) {
                $query->whereIn('class', $carClass);
            });
        }
        if ($commission) {
            $carsQuery->whereHas('division.park', function ($query) use ($commission) {
                $query->where('commission', '<=', $commission);
            });
        }
        if ($parksName) {
            $carsQuery->whereHas('division.park', function ($query) use ($parksName) {
                $query->whereIn('park_name', $parksName);
            });
        }
        if ($isBuyoutPossible) {
            $carsQuery->whereHas('rentTerm', function ($query) use ($isBuyoutPossible) {
                $query->where('is_buyout_possible', $isBuyoutPossible);
            });
        }
        if ($rentTerm) {
            $carsQuery->whereHas('rentTerm.schemas', function ($query) use ($rentTerm) {
                $query->where('non_working_days', $rentTerm['non_working_days'])
                    ->where('working_days', $rentTerm['working_days']);
            });
        }
        $carsQuery->with([
            'division.city' => function ($query) {
                $query->select('id', 'name');
            },
            'tariff' => function ($query) {
                $query->select('id', 'class');
            },
            'rentTerm' => function ($query) {
                $query->select('id', 'deposit_amount_daily', 'deposit_amount_total', 'minimum_period_days', 'is_buyout_possible');
            },
            'rentTerm.schemas' => function ($query) use ($sorting) {
                $query->select('id', 'daily_amount', 'non_working_days', 'working_days', 'rent_term_id')->orderBy('daily_amount', $sorting);
            },
            'division.park' => function ($query) {
                $query->select('id', 'park_name', 'commission', 'about');
            },
            'division' => function ($query) {
                $query->select('id', 'coords', 'address', 'name', 'park_id','phone', 'city_id', 'working_hours');
            }
        ])
            ->select(
                'cars.id',
                'cars.division_id',
                'cars.park_id',
                'cars.tariff_id',
                'cars.rent_term_id',
                'cars.fuel_type',
                'cars.transmission_type',
                'cars.brand',
                'cars.model',
                'cars.year_produced',
                'cars.car_id',
                'cars.images',
                'cars.mileage',
            );

        $carsQuery->orderBy(function ($query) use ($sorting) {
            $query->selectRaw('MIN(schemas.daily_amount)')
                ->from('schemas')
                ->whereColumn('schemas.rent_term_id', 'cars.rent_term_id')
                ->orderBy('schemas.daily_amount', $sorting)
                ->limit(1);
        }, $sorting);

        $carsQuery->selectRaw('id, division_id, park_id, tariff_id, rent_term_id, fuel_type, transmission_type, brand, model, year_produced, COUNT(*) as cars_count')
        ->where('rent_term_id', '!=', null)
        ->where('status', 1)
        ->whereExists(function ($query) {
            $query->select(DB::raw(1))
                ->from('divisions')
                ->whereColumn('cars.division_id', 'divisions.id')
                ->where('city_id', 1);
        })
        ->groupBy('year_produced', 'model', 'brand', 'transmission_type', 'fuel_type', 'rent_term_id', 'tariff_id', 'park_id','division_id')
        ->orderByRaw('(select MIN(schemas.daily_amount) from `schemas` where `schemas`.`rent_term_id` = `cars`.`rent_term_id` order by `schemas`.`daily_amount` asc limit 1) asc');

        $carsQuery->offset($offset)->limit($limit);

        $cars = $carsQuery->get();

        // $uniqueCars = $cars->unique(function ($item) {
        //     return $item->division_id . $item->park_id . $item->tariff_id . $item->rent_term_id .
        //         $item->fuel_type . $item->transmission_type . $item->brand . $item->model . $item->year_produced;
        // });

        // $similarCars = Car::where('rent_term_id', '!=', null)->where('status', CarStatus::AvailableForBooking->value)
        // ->where(function ($query) use ($uniqueCars) {
        //     foreach ($uniqueCars as $uniqueCar) {
        //         $query->orWhere(function ($subQuery) use ($uniqueCar) {
        //             $subQuery->where('division_id', $uniqueCar->division_id)
        //                 ->where('park_id', $uniqueCar->park_id)
        //                 ->where('tariff_id', $uniqueCar->tariff_id)
        //                 ->where('rent_term_id', $uniqueCar->rent_term_id)
        //                 ->where('fuel_type', $uniqueCar->fuel_type)
        //                 ->where('transmission_type', $uniqueCar->transmission_type)
        //                 ->where('brand', $uniqueCar->brand)
        //                 ->where('model', $uniqueCar->model)
        //                 ->where('year_produced', $uniqueCar->year_produced);
        //         });
        //     }
        // })->get();

        // foreach ($uniqueCars as $car) {
        //     $car['variants'] = $similarCars->filter(function ($similarCar) use ($car) {
        //         return $similarCar->division_id == $car->division_id &&
        //             $similarCar->park_id == $car->park_id &&
        //             $similarCar->tariff_id == $car->tariff_id &&
        //             $similarCar->rent_term_id == $car->rent_term_id &&
        //             $similarCar->fuel_type == $car->fuel_type &&
        //             $similarCar->transmission_type == $car->transmission_type &&
        //             $similarCar->brand == $car->brand &&
        //             $similarCar->model == $car->model &&
        //             $similarCar->year_produced == $car->year_produced;
        //     })->map(function ($similarCar) {
        //         return [
        //             'id' => $similarCar->id,
        //             'images' => json_decode($similarCar->images),
        //             'vin'=>$similarCar->car_id,
        //             'mileage'=>$similarCar->mileage
        //         ];
        //     })->values()->all();
        // }

            $formattedCars = [];
            foreach ($cars as $car) {
                $formattedCar = $car;
                $formattedCar['images'] = json_decode($car['images']);
                $formattedCar['images'] = array_slice($formattedCar['images'], 0, 3);
                $formattedCar['fuel_type'] = FuelType::from($car['fuel_type'])->name;
                $formattedCar['transmission_type'] = TransmissionType::from($car['transmission_type'])->name;
                $classCar = $car['tariff']['class'];
                $end = CarClass::from($classCar)->name;
                $commission = $car['division']['park']['commission'];
                $phone = $car['division']['park']['phone'];
                $about = $car['division']['park']['about'];
                $workingHours = json_decode($car['division']['working_hours'], true);
                $parkName = $car['division']['park']['park_name'] ?? 'Не удалось получить название парка';
                $city = $car['division']['city']['name'];
                $formattedCar['city'] = $city;
                $formattedCar['CarClass'] = $end;
                $formattedCar['park_name'] = $parkName;
                $formattedCar['working_hours'] = $workingHours;
                $formattedCar['phone'] = $phone;
                $formattedCar['vin'] = $car['car_id'];
                $formattedCar['about'] = $about;
                $commissionFormatted = number_format($commission, 2);
                $formattedCar['commission'] = rtrim(rtrim($commissionFormatted, '0'), '.');

                $formattedCars[] = $formattedCar;
            }

        foreach ($formattedCars as $car) {
            unset(
                $car['division']['park'],
                $car['division']['id'],
                $car['tariff'],
                $car['division']['city'],
                $car['division']['name'],
                $car['division']['city_id'],
                $car['division']['working_hours'],
                $car['division_id'],
                $car['park_id'],
                $car['tariff_id'],
                $car['rent_term_id'],
                $car['car_id'],
                $car['division']['park_id'],
            );
        }
        return response()->json(['cars' => $formattedCars]);
    }

    static function formattedWorkingHours($workingHours) {
        $weekdays = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
        $output = [];
        $allDaysMatch = true;
        $weekendAbsent = true;

        $daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


        for ($i = 0; $i < count($workingHours)-1; $i++) {
            if ($i < 5) {
                if ($workingHours[$i]['start'] != $workingHours[$i + 1]['start'] || $workingHours[$i]['end'] != $workingHours[$i + 1]['end']) {
                    $allDaysMatch = false;
                }
                if (count($workingHours)>5) {
                    $weekendAbsent = false;
                }
            }
        }
        if ($allDaysMatch && $weekendAbsent) {
            $output[] = 'Понедельник-Пятница';
            $output[] = sprintf("%02d:%02d - %02d:%02d", $workingHours[0]['start']['hours'], $workingHours[0]['start']['minutes'], $workingHours[0]['end']['hours'], $workingHours[0]['end']['minutes']);
            $output[] = 'Суббота-Воскресенье';
            $output[] = 'Выходной';
        }else{ foreach ($daysOfWeek as $day) {
            $found = false;
            foreach ($workingHours as $workingDay) {
                if ($workingDay['day'] === $day) {
                    $output[] = $weekdays[array_search($day, $daysOfWeek)] . ': ' . sprintf("%02d:%02d - %02d:%02d", $workingDay['start']['hours'], $workingDay['start']['minutes'], $workingDay['end']['hours'], $workingDay['end']['minutes']);
                    $found = true;
                    break;
                }
            }
            if (!$found) {
                $output[] = $weekdays[array_search($day, $daysOfWeek)] . ': выходной';

            }
        }}

        return $output;
    }


}


<?php

namespace App\Enums;

use OpenApi\Attributes as OAT;



/**
 * @OA\Schema(
 *   schema="ApplicationStage",
 *   type="enum",
 *   description="The unique identifier of a product in our catalog"
 * )
 */

 enum ApplicationStage: int
 {
     case New = 1; // Новая заявка
     case InProgress = 2; // В работе
     case NoAnswer = 3; // Не берет трубку
     case Thinking = 4; // Думает
     case ReservationCanceled = 5; // Отменил бронь
     case ReservationConfirmed = 6; // Подтвердил бронь
     case ArrivedAtOffice = 7; // Дошел в офис
     case ArrivedAtOfficeNoCar = 8; // Дошел в офис без вялого авто
     case CarRented = 9; // Взял авто
     case NotRealized = 10; // Не реализовано
 }

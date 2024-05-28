<?php

namespace App\Http\Controllers;

use App\Enums\ApplicationLogType;
use App\Enums\ApplicationStage;
use App\Events\KanbanUpdated;
use App\Models\Application;
use App\Models\ApplicationLogs;
use Illuminate\Http\Request;

class KanbanController extends Controller
{
    public function createApplication(Request $request) {
        $application = Application::create();
        if ($request->driver_user_id) {
            $userId=$request->driver_user_id;
            $application->user_id = $userId;
        }
        if ($request->division_id) {
            $application->division_id=$request->division_id;
        }
        if ($request->advertising_source) {
            $application->advertising_source=$request->advertising_source;
        }
        if ($request->planned_arrival) {
            $application->planned_arrival=$request->planned_arrival;
        }
        if ($request->booking_id) {
            $application->booking_id=$request->booking_id;
        }
        if ($request->license_issuing_country) {
            $application->license_issuing_country=$request->license_issuing_country;
        }
        if ($request->driver_license) {
            $application->driver_license=$request->driver_license;
        }
        if ($request->chosen_model) {
            $application->chosen_model=$request->chosen_model;
        }
        if ($request->chosen_brand) {
            $application->chosen_brand=$request->chosen_brand;
        }
        if ($request->manager_id) {
            $application->manager_id=$request->manager_id;
            $application->current_stage=ApplicationStage::InProgress->value;
        }
        if (!$request->manager_id) {
            $application->current_stage=ApplicationStage::New->value;
            $application->advertising_source='BeeBeep';

        }
        $application->save();
        return $application->id;

    }

    public function createApplicationsLogItem(Request $request)  {
        $logItem = ApplicationLogs::create();
        $logItem->manager_id = $request->manager_id;
        $logItem->application_id = $request->id;
        $logItem->type = $request->type;
        if ($request->type === ApplicationLogType::Create->value) {
            $logItem->content = json_encode([
                "creator" => $request->creator,
                "creator_id"=>$request->creator_id
            ]);
        }
        if ($request->type === ApplicationLogType::Stage->value) {
            $logItem->content = json_encode([
                "old_stage" => $request->old_stage,
                "new_stage" => $request->current_stage
            ]);
        }
        if ($request->type === ApplicationLogType::Content->value) {
                $logItem->content = [
                    "column" => $request->column,
                    "old_content" => $request->old_content,
                    "new_content" => $request->new_content
                ];
        }
        if ($request->type === ApplicationLogType::Notification->value) {
            if (!$request->date) {
                return response()->json(['error' => 'Не указана дата']);
            }
            $logItem->content = json_encode([
                "message" => $request->message,
                "date" => $request->date,
                "result" => null
            ]);
        }
        $logItem->save();

        return response()->json(['success' => true, 'id'=>$logItem->id]);
    }

    public function updateApplicationsLogItem(Request $request) {
        $logItem = ApplicationLogs::where('id', $request->id)->first();

        if ($request->type === ApplicationLogType::Notification->name) {
            $content = json_decode($logItem->content, true);

            $logItem->content = json_encode([
                "message" => $content["message"],
                "date" => $content["date"],
                "result" => $request->result
            ]);
        }

        $logItem->save();

        return response()->json(['success' => true]);
    }



}

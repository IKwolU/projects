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
        if ($request->manager_id) {
            $application->manager_id=$request->manager_id;
            $application->current_stage=ApplicationStage::InProgress->value;
        }
        if (!$request->manager_id) {
            $application->current_stage=ApplicationStage::New->value;
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
            $logItem->content = json_encode([
                "massage" => $request->massage,
                "date" => $request->date,
                "result" => null
            ]);
        }
        $logItem->save();
        event(new KanbanUpdated($request->id));

        return response()->json(['success' => true]);
    }

    public function updateApplicationsLogItem(Request $request) {
        $logItem = ApplicationLogs::where('application_id', $request->id)->first();

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

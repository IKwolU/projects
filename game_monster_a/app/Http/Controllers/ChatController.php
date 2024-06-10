<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;

class ChatController extends Controller
{
  public function fetchMessages(Request $request)
  {
    $messages = Message::where(function ($query) use ($request) {
      $query->where('from_user_id', $request->user()->id)
        ->where('to_user_id', $request->to_user_id);
    })->orWhere(function ($query) use ($request) {
      $query->where('from_user_id', $request->to_user_id)
        ->where('to_user_id', $request->user()->id);
    })->get();

    return response()->json($messages);
  }

  public function sendMessage(Request $request)
  {
    $message = Message::create([
      'from_user_id' => $request->user()->id,
      'to_user_id' => $request->to_user_id,
      'message' => $request->message,
    ]);

    return response()->json($message);
  }
}

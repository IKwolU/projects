<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Http\RedirectResponse;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
  public function Login(Request $request)
  {
    $validate = $request->validate([
      'email' => 'required|max:255|min:6|email',
      'password' => 'required|max:255|min:6',
    ]);
    if (!Auth::attempt($request->all())) {
      return Redirect::back()->withErrors(['email' => __('ERROR: Wrong login or password')]);
    }
    $user = User::where('email', '=', $validate['email'])->first();
    Auth::login($user);

    return Redirect::back();
  }

  public function Logout(Request $request): Response
  {
    Auth::logout();

    $request->session()->invalidate();

    $request->session()->regenerateToken();

    return Inertia::location('/');
  }

  public function CreateUser(Request $request): void
  {
    $request->validate([
      'email' => 'required|unique:users|max:255|min:6|email',
      'password' => 'required|max:255|min:6',
    ]);
    $data = [
      'login' => $request->email,
      'email' => $request->email,
      'password' => $request->password
    ];
    $user = User::create($data);
    // Todo решить как создать суперпользователя.
    $user->assignRole('SuperAdmin');
    Auth::login($user);
  }

  function socialAuthorization($platform, $login, $avatar, $email): RedirectResponse
  {
    if(Auth::check()){
      $user = Auth::user();
      $user->update([
        (string)$platform => $login
      ]);
      return redirect()->route('profile');
    }else{
      if($user = User::where('login', '=', $login)->first()){
        Auth::login($user);
        return redirect()->route('home');
      }
      $generatedPassword = Str::password(10) . $login;
      $data = [
        'login' => $login,
        (string)$platform => $login,
        'password' => $generatedPassword,
        'avatar' => $avatar,
        'email' => $email,
        'nickName' => $login
      ];
      $user = User::create($data);
      $user->assignRole('User');
    }
    return redirect()->route('home');
  }

  public function Vk()
  {
    return Socialite::driver('vkontakte')->redirect();
  }

  public function Steam()
  {
    return Socialite::driver('steam')->redirect();
  }

  public function Google()
  {
    return Socialite::driver('google')->redirect();
  }

  public function Facebook()
  {
    return Socialite::driver('facebook')->redirect();
  }


  public function GoogleRollBack()
  {
    $user = Socialite::driver('google')->user();
    return $this->socialAuthorization('google', $user->GetNickname(), $user->getAvatar(), $user->getEmail());
  }

  public function VkRollBack()
  {
    $user = Socialite::driver('vkontakte')->user();
    return $this->socialAuthorization('vk', $user->GetNickname(), $user->getAvatar(), $user->getEmail());
  }

  public function SteamRollBack()
  {
    $user = Socialite::driver('steam')->user();
    return $this->socialAuthorization('steam', $user->GetNickname(), $user->getAvatar(), $user->getEmail());
  }

  public function FacebookRollBack()
  {
    $user = Socialite::driver('facebook')->user();
    return $this->socialAuthorization('facebook', $user->GetNickname(), $user->getAvatar(), $user->getEmail());
  }
}

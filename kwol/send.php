<?php
$name = $_POST['name'] ?? '';
$phone = $_POST['phone'] ?? '';
$email = $_POST['email'] ?? '';

if ($name && $phone && $email) {
    $to = 'you@example.com';
    $subject = 'Новая заявка с рекламного сайта';
    $message = "Имя: $name\nТелефон: $phone\nEmail: $email";

    if (mail($to, $subject, $message)) {
        $response = array(
            'message' => 'Данные успешно получены и отправлены на почту',
            'name' => $name,
            'phone' => $phone,
            'email' => $email
        );
        header('Content-Type: application/json');
        echo json_encode($response);
    } else {
        http_response_code(500);
        echo json_encode(array('error' => 'Ошибка при отправке почты'));
    }
} else {
    http_response_code(400);
    echo json_encode(array('error' => 'Не все данные были переданы'));
}

<?php
namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use app\models\User;
use Firebase\JWT\JWT;

class AuthController extends Controller
{
    public $enableCsrfValidation = false;

    public function verbs()
    {
        return [
            'register' => ['POST'],
            'login' => ['POST'],
        ];
    }

    public function actionRegister()
    {
        $data = json_decode(Yii::$app->request->getRawBody(), true);

        if (empty($data['username']) || empty($data['password'])) {
            Yii::$app->response->statusCode = 400;
            return ['status' => 'failed', 'message' => 'Username dan password wajib diisi'];
        }

        if (User::findOne(['username' => $data['username']])) {
            Yii::$app->response->statusCode = 409;
            return ['status' => 'failed', 'message' => 'Username sudah digunakan'];
        }

        $user = new User();
        $user->username = trim($data['username']);
        $user->setPassword($data['password']);

        if ($user->save()) {
            Yii::$app->response->statusCode = 201;
            return [
                'status' => 'success',
                'message' => 'Registrasi berhasil',
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'created_at' => $user->created_at,
                ],
            ];
        } else {
            Yii::$app->response->statusCode = 400;
            return ['status' => 'failed', 'errors' => $user->errors];
        }
    }

    public function actionLogin()
    {
        $data = json_decode(Yii::$app->request->getRawBody(), true);

        if (empty($data['username']) || empty($data['password'])) {
            Yii::$app->response->statusCode = 400;
            return ['error' => 'Username dan password wajib diisi'];
        }

        $user = User::findByUsername($data['username']);
        if (!$user || !$user->validatePassword($data['password'])) {
            Yii::$app->response->statusCode = 401;
            return ['error' => 'Username atau password salah'];
        }

        $payload = [
            'uid' => $user->id,
            'username' => $user->username,
            'iat' => time(),
            'exp' => time() + (3600 * 12) 
        ];

        $jwt = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');

        return [
            'status' => 'success',
            'token' => $jwt,
            'user' => [
                'id' => $user->id,
                'username' => $user->username
            ]
        ];
    }
}

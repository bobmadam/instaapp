<?php
namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use app\models\Like;
use app\models\Post;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LikeController extends Controller
{
    public $enableCsrfValidation = false;

    private function getUserId()
    {
        $headers = apache_request_headers();
        if (empty($headers['Authorization'])) {
            throw new \yii\web\UnauthorizedHttpException('Token tidak ditemukan');
        }

        $token = str_replace('Bearer ', '', $headers['Authorization']);
        try {
            $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'], 'HS256'));
            return $decoded->uid;
        } catch (\Exception $e) {
            throw new \yii\web\UnauthorizedHttpException('Token tidak valid');
        }
    }

    public function actionToggle($post_id)
    {
        $uid = $this->getUserId();

        $post = Post::findOne($post_id);

        if (!$post) {
            Yii::$app->response->statusCode = 404;
            return ['error' => 'Post tidak ditemukan'];
        }

        $like = Like::findOne(['post_id' => $post_id, 'user_id' => $uid]);
        if ($like) {
            $like->delete();
            return ['status' => 'unliked'];
        } else {
            $like = new Like();
            $like->post_id = $post_id;
            $like->user_id = $uid;
            $like->save();
            return ['status' => 'liked'];
        }
    }
}

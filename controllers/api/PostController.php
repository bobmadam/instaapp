<?php
namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use app\models\Post;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use yii\web\UploadedFile;

class PostController extends Controller
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

    public function actionIndex()
    {
        $posts = Post::find()
            ->with(['user', 'likes', 'comments.user'])
            ->orderBy(['id' => SORT_DESC])
            ->asArray()
            ->all();
        return $posts;
    }

    public function actionCreate()
    {
        $uid = $this->getUserId();
        $post = new Post();
        $post->user_id = $uid;
        $post->caption = Yii::$app->request->post('caption');

        $file = UploadedFile::getInstanceByName('image');
        if ($file) {
            $uploadDir = Yii::getAlias('@app/web/uploads');

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            $filename = uniqid() . '.' . $file->extension;
            $path = $uploadDir . DIRECTORY_SEPARATOR . $filename;

            if ($file->saveAs($path)) {
                $post->image_url = '/uploads/' . $filename;
            } else {
                Yii::$app->response->statusCode = 500;
                return ['status' => 'failed', 'message' => 'Gagal menyimpan file gambar'];
            }
        }
        if ($post->save()) {
            return ['status' => 'success', 'post' => $post];
        }
        Yii::$app->response->statusCode = 400;
        return ['status' => 'failed', 'errors' => $post->errors];
    }

    public function actionDelete($id)
    {
        $uid = $this->getUserId();
        $post = Post::findOne($id);

        if (!$post) {
            Yii::$app->response->statusCode = 404;
            return ['error' => 'Post tidak ditemukan'];
        }

        if ($post->user_id != $uid) {
            Yii::$app->response->statusCode = 403;
            return ['error' => 'Tidak diizinkan menghapus post orang lain'];
        }

        $post->delete();
        return ['status' => 'deleted'];
    }
}

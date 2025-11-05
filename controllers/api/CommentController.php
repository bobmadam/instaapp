<?php
namespace app\controllers\api;

use Yii;
use yii\rest\Controller;
use app\models\Comment;
use app\models\Post;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class CommentController extends Controller
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

    public function actionIndex($post_id)
    {
        $comments = Comment::find()
            ->where(['post_id' => $post_id])
            ->with('user')
            ->orderBy(['id' => SORT_ASC])
            ->asArray()
            ->all();
        return $comments;
    }

    public function actionCreate($post_id)
    {
        $uid = $this->getUserId();

        $post = Post::findOne($post_id);

        if (!$post) {
            Yii::$app->response->statusCode = 404;
            return ['error' => 'Post tidak ditemukan'];
        }

        $data = json_decode(Yii::$app->request->getRawBody(), true);

        $comment = new Comment();
        $comment->post_id = $post_id;
        $comment->user_id = $uid;
        $comment->content = $data['content'];

        if ($comment->save()) {
            return ['status' => 'success', 'comment' => $comment];
        }
        Yii::$app->response->statusCode = 400;
        return ['status' => 'failed', 'errors' => $comment->errors];
    }

    public function actionDelete($id)
    {
        $uid = $this->getUserId();

        $comment = Comment::findOne($id);

        if (!$comment) {
            Yii::$app->response->statusCode = 404;
            return ['error' => 'Komentar tidak ditemukan'];
        }

        if ($comment->user_id != $uid) {
            Yii::$app->response->statusCode = 403;
            return ['error' => 'Tidak diizinkan menghapus komentar orang lain'];
        }

        $comment->delete();
        return ['status' => 'deleted'];
    }
}

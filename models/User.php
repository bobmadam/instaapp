<?php
namespace app\models;
use Yii;
use yii\db\ActiveRecord;

class User extends ActiveRecord
{
  public static function tableName() { return 'users'; }

  public static function findByUsername($username) {
    return self::findOne(['username' => $username]);
  }

  public function setPassword($password) {
    $this->password_hash = Yii::$app->security->generatePasswordHash($password);
  }

  public function validatePassword($password) {
    return Yii::$app->security->validatePassword($password, $this->password_hash);
  }
}

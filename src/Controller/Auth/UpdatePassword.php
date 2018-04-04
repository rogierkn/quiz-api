<?php
declare(strict_types=1);


namespace App\Controller\Auth;


use App\Entity\User;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoder;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UpdatePassword
{

    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function __invoke(User $data)
    {
        // Encode the user's password
        $data->setPassword($this->encoder->encodePassword($data, $data->getPassword()));
        return $data;
    }
}
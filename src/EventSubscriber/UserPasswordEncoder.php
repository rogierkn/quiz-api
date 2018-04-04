<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use App\Entity\User;
use Doctrine\ORM\Event\LifecycleEventArgs;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserPasswordEncoder
{
    /**
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    /**
     * @param LifecycleEventArgs $event
     * @throws \Doctrine\ORM\ORMInvalidArgumentException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function prePersist(LifecycleEventArgs $event): void
    {
        $user = $event->getEntity();

        // Only execute this on a User entity
        if (!($user instanceof User)) {
            return;
        }

        $user->setPassword($this->encoder->encodePassword($user, $user->getPassword()));
    }
}

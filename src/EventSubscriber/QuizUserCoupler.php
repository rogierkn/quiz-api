<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Activity;
use App\Entity\Quiz;
use App\Entity\User;
use App\Enum\ActivityEvent;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Event\LifecycleEventArgs;
use InvalidArgumentException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class QuizUserCoupler
{
    /**
     * @var User
     */
    private $user;

    /**
     * @throws \InvalidArgumentException
     */
    public function __construct(TokenStorageInterface $tokenStorage)
    {
        if (null !== $tokenStorage->getToken()) {
            $this->user = $tokenStorage->getToken()->getUser();
        } else {
            throw new InvalidArgumentException('Expected authenticated user, instead got anonymous user');
        }
    }


    /**
     * @param LifecycleEventArgs $event
     * @throws \Doctrine\ORM\ORMInvalidArgumentException
     * @throws \Doctrine\ORM\ORMException
     * @throws \Doctrine\ORM\OptimisticLockException
     */
    public function postPersist(LifecycleEventArgs $event): void
    {
        $quiz = $event->getEntity();

        // Only execute this on a Quiz entity
        if (!($quiz instanceof Quiz)) {
            return;
        }

        $this->user->addQuiz($quiz);

        $event->getEntityManager()->persist($this->user);
        $event->getEntityManager()->flush();
    }
}

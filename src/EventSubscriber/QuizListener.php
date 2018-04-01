<?php

declare(strict_types=1);

namespace App\EventSubscriber;

use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Activity;
use App\Entity\User;
use App\Enum\ActivityEvent;
use InvalidArgumentException;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Symfony\Component\Security\Core\User\UserInterface;

class ActivityListener implements EventSubscriberInterface
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

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['deriveActivityState', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function deriveActivityState(GetResponseForControllerResultEvent $event): void
    {
        $activity = $event->getControllerResult();

        // Only execute this on an Activity entity
        if (!($activity instanceof Activity)) {
            return;
        }

        // Attach the user to the activity
        $activity->setUser($this->user);

        // Attach the correct Event to the activity, determined based on their input
        if (null !== $activity->getAnswer()) {
            $activity->setEvent(ActivityEvent::QUESTION_ANSWER);
        } else {
            $activity->setEvent(ActivityEvent::QUESTION_DODGE);
        }
    }
}

<?php
declare(strict_types=1);


namespace App\EventSubscriber;


use App\Entity\User;
use Exception;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use RuntimeException;

class JwtListener
{
    /**
     * @param JWTCreatedEvent $event
     * @throws Exception
     */
    public function addIdToJwt(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();
        if (!($user instanceof User)) {
            throw new RuntimeException('Expected user of class ' . User::class . ', received ' . \get_class($user));
        }
        $payload = $event->getData();
        $payload['id'] = $user->getId();
        $event->setData($payload);
    }
}
<?php

declare(strict_types=1);

namespace App\Socket;

use Thruway\Module\RealmModuleInterface;
use Thruway\Module\RouterModuleClient;

class QuizRouter extends RouterModuleClient implements RealmModuleInterface
{

    /** @return array */
    public function getSubscribedRealmEvents(): array
    {
        return [
//            "wamp.meta"
        ];
    }
}

<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 * Class ActivityEvent.
 *
 * @Annotation
 */
class ActivityEvent extends Constraint
{
    public $message = 'The event "{{ event }}" is invalid';
}

<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;

/**
 *
 * Class SessionStatus.
 *
 * @Annotation
 */
class SessionType extends Constraint
{
    public $message = 'The type "{{ type }}" is invalid';
}

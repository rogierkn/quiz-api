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
class SessionStatus extends Constraint
{
    public $message = 'The status "{{ status }}" is invalid';
}

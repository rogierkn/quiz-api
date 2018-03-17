<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates whether an activity event is valid
 * Class ActivityEventValidator.
 */
class ActivityEventValidator extends ConstraintValidator
{
    /**
     * Checks if the passed value is valid.
     *
     * @param mixed                    $value      The value that should be validated
     * @param ActivityEvent|Constraint $constraint The ActivityEvent constraint for the validation
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!defined(\App\Enum\ActivityEvent::class.'::'.$value) && $constraint instanceof ActivityEvent) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ event }}', $value)
                ->addViolation();
        }
    }
}

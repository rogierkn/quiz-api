<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates whether a session status is valid
 * Class ActivityEventValidator.
 */
class SessionStatusValidator extends ConstraintValidator
{
    /**
     * Checks if the passed value is valid.
     *
     * @param string                   $value      The value that should be validated
     * @param SessionStatus|Constraint $constraint The ActivityEvent constraint for the validation
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!defined(\App\Enum\SessionStatus::class.'::'.$value) && $constraint instanceof SessionStatus) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ status }}', $value)
                ->addViolation();
        }
    }
}

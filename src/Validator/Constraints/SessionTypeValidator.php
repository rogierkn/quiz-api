<?php

declare(strict_types=1);

namespace App\Validator\Constraints;

use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

/**
 * Validates whether a session type is valid
 */
class SessionTypeValidator extends ConstraintValidator
{
    /**
     * Checks if the passed value is valid.
     *
     * @param string                   $value      The value that should be validated
     * @param SessionType|Constraint $constraint The ActivityEvent constraint for the validation
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!\defined(\App\Enum\SessionType::class.'::'.$value) && $constraint instanceof SessionType) {
            $this->context->buildViolation($constraint->message)
                ->setParameter('{{ type }}', $value)
                ->addViolation();
        }
    }
}

<?php
declare(strict_types=1);


namespace App\Tests\unit\Validator\Constraints;


use App\Enum\SessionStatus;
use App\Validator\Constraints\ActivityEvent;
use App\Validator\Constraints\ActivityEventValidator;
use App\Enum\ActivityEvent as Event;
use App\Validator\Constraints\SessionStatus as SessionStatusConstraint;
use App\Validator\Constraints\SessionStatusValidator;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Context\ExecutionContext;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilder;


/**
 * Class ActivityEventValidatorTest
 * @package App\Tests\unit\Validator\Constraints
 */
class SessionStatusValidatorTest extends TestCase
{

    /**
     * @param null|string $expectedMessage
     * @return SessionStatusValidator
     */
    private function configureValidator(?string $expectedMessage): SessionStatusValidator
    {
        // mock the violation builder
        $builder = $this->getMockBuilder(ConstraintViolationBuilder::class)
            ->disableOriginalConstructor()
            ->setMethods(array('addViolation'))
            ->getMock()
        ;

        // mock the validator context
        $context = $this->getMockBuilder(ExecutionContext::class)
            ->disableOriginalConstructor()
            ->setMethods(array('buildViolation'))
            ->getMock()
        ;

        if ($expectedMessage) {
            $builder->expects($this->once())
                ->method('addViolation')
            ;

            $context->expects($this->once())
                ->method('buildViolation')
                ->with($this->equalTo($expectedMessage))
                ->will($this->returnValue($builder))
            ;
        }
        else {
            $context->expects($this->never())
                ->method('buildViolation')
            ;
        }

        // initialize the validator with the mocked context
        $validator = new SessionStatusValidator();
        $validator->initialize($context);

        // return the SomeConstraintValidator
        return $validator;

    }

    public function testValid(): void
    {
        $validator = $this->configureValidator(null);
        $validator->validate(SessionStatus::CLOSED, new SessionStatusConstraint);
    }

    public function testInvalid(): void
    {
        $validator = $this->configureValidator((new SessionStatusConstraint)->message);
        $validator->validate("Invalid event", new SessionStatusConstraint);
    }
}

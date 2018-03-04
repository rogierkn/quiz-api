<?php
declare(strict_types=1);


namespace App\Tests\unit\Validator\Constraints;


use App\Validator\Constraints\ActivityEvent;
use App\Validator\Constraints\ActivityEventValidator;
use App\Enum\ActivityEvent as Event;
use PHPUnit\Framework\TestCase;
use Symfony\Component\Validator\Context\ExecutionContext;
use Symfony\Component\Validator\Violation\ConstraintViolationBuilder;


/**
 * Class ActivityEventValidatorTest
 * @package App\Tests\unit\Validator\Constraints
 */
class ActivityEventValidatorTest extends TestCase
{

    /**
     * @param null|string $expectedMessage
     * @return ActivityEventValidator
     */
    private function configureValidator(?string $expectedMessage): ActivityEventValidator
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
        $validator = new ActivityEventValidator();
        $validator->initialize($context);

        // return the SomeConstraintValidator
        return $validator;

    }

    public function testValid()
    {
        $validator = $this->configureValidator(null);

        $validator->validate(Event::QUESTION_ANSWER, new ActivityEvent);

    }

    public function testInvalid()
    {
        $validator = $this->configureValidator((new ActivityEvent)->message);
        $validator->validate("Invalid event", new ActivityEvent);
    }
}

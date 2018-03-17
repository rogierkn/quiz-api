<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Enum\ActivityEvent as Event;
use App\Validator\Constraints\ActivityEvent;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\ActivityRepository")
 * @ORM\HasLifecycleCallbacks()
 */
class Activity
{
    /**
     * The id of an activity.
     *
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Session|null $session
     * @ORM\ManyToOne(targetEntity="Session", inversedBy="activities")
     */
    private $session;

    /**
     * @var Question|null
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="activities")
     * @ORM\JoinColumn(name="question_id", nullable=true)
     */
    private $question;

    /**
     * @var User|null
     * @ORM\ManyToOne(targetEntity="User", inversedBy="activities")
     */
    private $user;

    /**
     * @var string
     * @ORM\Column(type="string")
     * @ActivityEvent()
     */
    private $event;

    /**
     * @var Answer|null
     * @ORM\ManyToOne(targetEntity="Answer", inversedBy="activities")
     * @ORM\JoinColumn("answer_id", nullable=true)
     */
    private $answer;

    /**
     * @var bool
     * @ORM\Column(type="boolean", nullable=true)
     * @Assert\Type(type="boolean")
     */
    private $correct;

    /**
     * @var \DateTime
     * @ORM\Column(type="datetime")
     *
     */
    private $createdAt;

    /**
     * Set the datetime before creating the entity.
     *
     * @ORM\PrePersist()
     */
    public function setCreatedAt()
    {
        $this->createdAt = new \DateTime();
    }

    /**
     * Determine on creation of activity whether the given answer is correct.
     *
     * @ORM\PrePersist()
     */
    public function setCorrect()
    {
        if (Event::QUESTION_ANSWER === $this->event) {
            if ($this->getAnswer() !== null && $this->getAnswer()->isCorrect()) {
                $this->correct = true;
            } else {
                $this->correct = false;
            }
        } else {
            $this->correct = false; // If undeterminable set it to false
        }
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * @return Session|null
     */
    public function getSession(): ?Session
    {
        return $this->session;
    }

    /**
     * @param Session|null $session
     */
    public function setSession(?Session $session): void
    {
        $this->session = $session;
    }

    /**
     * @return Question
     */
    public function getQuestion(): ?Question
    {
        return $this->question;
    }

    /**
     * @param Question|null $question
     */
    public function setQuestion(?Question $question): void
    {
        $this->question = $question;
    }

    /**
     * @return User
     */
    public function getUser(): ?User
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     */
    public function setUser(?User $user): void
    {
        $this->user = $user;
    }

    /**
     * @return string
     */
    public function getEvent(): string
    {
        return $this->event;
    }

    /**
     * @param string $event
     */
    public function setEvent(string $event): void
    {
        $this->event = $event;
    }

    /**
     * @return Answer|null
     */
    public function getAnswer(): ?Answer
    {
        return $this->answer;
    }

    /**
     * @param Answer|null $answer
     */
    public function setAnswer(?Answer $answer): void
    {
        $this->answer = $answer;
    }

    /**
     * @return bool
     */
    public function isCorrect(): bool
    {
        return $this->correct;
    }
}

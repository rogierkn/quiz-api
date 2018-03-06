<?php

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Validator\Constraints\ActivityEvent;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\AnswerRepository")
 */
class Answer
{
    /**
     * The unique id of the answer.
     *
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The text of the answer.
     *
     * @var string
     * @ORM\Column(type="string", length=250)
     * @Assert\NotBlank()
     * @Assert\Length(min="1", max="250")
     */
    private $text;

    /**
     * The question the answer belongs to.
     *
     * @var Question
     * @ORM\ManyToOne(targetEntity="Question", inversedBy="answers")
     */
    private $question;

    /**
     * Whether this answer is a correct answer for the question
     * @var bool $correct
     * @ORM\Column(type="boolean")
     * @Assert\Type("boolean")
     */
    private $correct;

    /**
     * The activities of the session
     * @var Activity[]|Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="answer", cascade={"remove"})
     */
    private $activities;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
    }


    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getText(): string
    {
        return $this->text;
    }

    /**
     * @param string $text
     */
    public function setText(string $text): void
    {
        $this->text = $text;
    }

    /**
     * @return Question
     */
    public function getQuestion(): Question
    {
        return $this->question;
    }

    /**
     * @param Question $question
     */
    public function setQuestion(Question $question): void
    {
        $this->question = $question;
    }

    /**
     * @return Activity[]|Collection
     */
    public function getActivities(): Collection
    {
        return $this->activities;
    }

    /**
     * @param Activity $activity
     */
    public function addActivities(Activity $activity): void
    {
        $this->activities->add($activity);
        $activity->setAnswer($this);
    }

    /**
     * @param Activity $activity
     */
    public function removeActivity(Activity $activity): void
    {
        $this->activities->remove($activity);
        $activity->setAnswer(null);
    }

    /**
     * @return bool
     */
    public function isCorrect(): bool
    {
        return $this->correct;
    }

    /**
     * @param bool $correct
     */
    public function setCorrect(bool $correct): void
    {
        $this->correct = $correct;
    }
}

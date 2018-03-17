<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use App\Enum\QuestionType;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\QuestionRepository")
 */
class Question
{
    /**
     * The unique id of the question.
     *
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The text of a question.
     *
     * @var string
     * @ORM\Column(type="text")
     * @Assert\NotBlank()
     * @Assert\Length(max="500")
     */
    private $text;

    /**
     * The type of a question, for example a single answer type question
     * Note: this exists to allow extension of question types later on. Currently is just defaults to SINGLE_ANSWER, the single answer type.
     * Don't forget to update choices in assert.
     *
     * @var string
     * @ORM\Column(type="string")
     * @Assert\Choice({"SINGLE_ANSWER"})
     * @Assert\Type("string")
     */
    private $type = QuestionType::SINGLE_ANSWER;

    /**
     * The quiz the question belongs to.
     *
     * @var Quiz|null
     * @ORM\ManyToOne(targetEntity="Quiz", inversedBy="questions")
     */
    private $quiz;

    /**
     * The answers of the question.
     *
     * @var Answer[]|Collection
     * @ORM\OneToMany(targetEntity="Answer", mappedBy="question", cascade={"all"})
     */
    private $answers;

    /**
     * The activities of the question
     * @var Activity[]|Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="question", cascade={"remove"})
     *
     */
    private $activities;

    public function __construct()
    {
        $this->answers = new ArrayCollection();
        $this->activities = new ArrayCollection();
    }

    /**
     * @return int
     */
    public function getId(): int
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
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * @param string $type
     */
    public function setType(string $type): void
    {
        $this->type = $type;
    }

    /**
     * @return Quiz|null
     */
    public function getQuiz(): ?Quiz
    {
        return $this->quiz;
    }

    /**
     * @param Quiz|null $quiz
     */
    public function setQuiz(?Quiz $quiz): void
    {
        $this->quiz = $quiz;
    }

    /**
     * @return Answer[]|Collection
     */
    public function getAnswers(): Collection
    {
        return $this->answers;
    }

    /**
     * @param Answer $answer
     */
    public function addAnswer(Answer $answer): void
    {
        $this->answers->add($answer);
        $answer->setQuestion($this);
    }

    /**
     * @param Answer $answer
     */
    public function removeAnswer(Answer $answer)
    {
        $this->answers->removeElement($answer);
        $answer->setQuestion(null);
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
    public function addActivity(Activity $activity): void
    {
        $this->activities->add($activity);
        $activity->setQuestion($this);
    }

    /**
     * @param Activity $activity
     */
    public function removeActivity(Activity $activity)
    {
        $this->activities->removeElement($activity);
        $activity->setQuestion(null);
    }
}

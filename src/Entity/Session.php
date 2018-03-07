<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiResource;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Ramsey\Uuid\Uuid;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\SessionRepository")
 */
class Session
{
    /**
     * The unique id of the session.
     *
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The quiz the session belongs to.
     *
     * @var Quiz
     * @ORM\ManyToOne(targetEntity="Quiz", inversedBy="sessions")
     */
    private $quiz;

    /**
     * The uuid of the session
     * Used to have others join a session.
     *
     * @var string
     * @ORM\Column(type="string", length=36)
     * @Assert\Uuid(versions={"4"})
     */
    private $uuid;

    /**
     * The activities of the session
     * @var Activity[]|Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="session", cascade={"remove"})
     */
    private $activities;

    public function __construct()
    {
        $this->uuid = Uuid::uuid4();
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
     * @return Quiz
     */
    public function getQuiz(): Quiz
    {
        return $this->quiz;
    }

    /**
     * @param Quiz $quiz
     */
    public function setQuiz(Quiz $quiz): void
    {
        $this->quiz = $quiz;
    }

    /**
     * @return string
     */
    public function getUuid(): string
    {
        return $this->uuid;
    }

    /**
     * @return Activity[]|ArrayCollection
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
        $activity->setSession($this);
    }

    /**
     * @param Activity $activity
     */
    public function removeActivity(Activity $activity)
    {
        $this->activities->remove($activity);
        $activity->setSession(null);
    }
}

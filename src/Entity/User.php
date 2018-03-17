<?php
declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use ApiPlatform\Core\Annotation\ApiResource;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User
{
    /**
     * The unique id of the user
     *
     * @var int $id
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The email address of the user
     *
     * @var string $email
     * @ORM\Column(type="string")
     * @Assert\Email()
     */
    private $email;

    /**
     * The activities of the session
     * @var Activity[]|Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="user", cascade={"remove"})
     */
    private $activities;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
    }

    /**
     * @return string
     */
    public function getEmail(): string
    {
        return $this->email;
    }

    /**
     * @param string $email
     */
    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

    /**
     * @return int
     */
    public function getId(): int
    {
        return $this->id;
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
        $activity->setUser($this);
    }

    /**
     * @param Activity $activity
     */
    public function removeActivity(Activity $activity)
    {
        $this->activities->removeElement($activity);
        $activity->setUser(null);
    }

}

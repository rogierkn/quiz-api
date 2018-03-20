<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Serializable;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 */
class User implements UserInterface, Serializable
{
    /**
     * The unique id of the user.
     *
     * @var int
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * The email address of the user.
     *
     * @var string
     * @ORM\Column(type="string", unique=true)
     * @Assert\Email()
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=64)
     * // Todo add min length before encoding it
     */
    private $password;

    /**
     * The activities of the session.
     *
     * @var Activity[]|Collection
     * @ORM\OneToMany(targetEntity="Activity", mappedBy="user", cascade={"remove"})
     */
    private $activities;

    public function __construct()
    {
        $this->activities = new ArrayCollection();
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): void
    {
        $this->email = $email;
    }

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

    public function addActivity(Activity $activity): void
    {
        $this->activities->add($activity);
        $activity->setUser($this);
    }

    public function removeActivity(Activity $activity): void
    {
        $this->activities->removeElement($activity);
        $activity->setUser(null);
    }

    public function serialize(): string
    {
        return serialize([
            $this->getId(),
            $this->getUsername(),
            $this->getPassword(),
        ]);
    }

    public function unserialize($serialized): void
    {
        [$this->id, $this->email, $this->password] = unserialize($serialized, false);
    }

    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function getSalt(): ?string
    {
        return null;
    }

    public function getUsername(): string
    {
        return $this->getEmail();
    }

    public function eraseCredentials(): void
    {
    }

    public function setPassword(string $password): void
    {
        $this->password = $password;
    }
}

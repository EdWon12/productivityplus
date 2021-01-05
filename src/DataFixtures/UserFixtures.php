<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class UserFixtures extends Fixture
{
	private $passwordEncoder;
    public function __construct(UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->passwordEncoder = $passwordEncoder;
    }

    public function load(ObjectManager $manager)
    {

        // creating 10 users
        for ($i = 0; $i < 10; $i++) {
            $user = new User();
            $user->setEmail(sprintf('testuser%d@mail.com', $i));
            $user->setPassword($this->passwordEncoder->encodePassword(
                $user,
                'devenv'
            ));
            $user->setNotificationsSub(rand(0,1));
            $manager->persist($user);

        }

        $manager->flush();
    }
}


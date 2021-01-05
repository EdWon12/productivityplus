<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Activity;
use App\Entity\Action;
use App\Entity\IsGood;
use App\Form\ActivityType;
use App\Form\DelActivityType;
use App\Form\EdtActivityType;
use App\Form\LocationType;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;


class IndexController extends AbstractController
{
    /**
     * @Route("/index", name="homepage")
     */
    public function loggedIn()
    {
        return $this->render('loggeduser/index.html.twig', [
            'controller_name' => 'LoggedUserController',
        ]);
    }

    /**
     * @Route("/Tutorial", name="tutorial")
     */
    public function tutorial()
    {
        return $this->render('loggeduser/tutorial.html.twig');
    }

}

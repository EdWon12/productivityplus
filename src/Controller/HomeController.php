<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;

class HomeController extends AbstractController
{
    /**
     * for unauthentified clients
     * @Route("/", name="home")
     */
    public function index()
    {

        // if logged in redirects to the logged in menu (if user intentionnally select the "/" route so the user doesn't get stuck //he would need to manually type /index)                              

        if($this->isGranted('IS_AUTHENTICATED_REMEMBERED')){
            return $this->redirectToRoute('homepage');
        }      
        return $this->render('home/index.html.twig');

    }

    /**
     * @Route("/About", name="about")
     */
    public function about()
    {   
        return $this->render('home/about.html.twig');

    }
}

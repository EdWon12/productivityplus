<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\Contact;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class ContactController extends AbstractController
{
    /**
     * Contact
     * @Route("/Contact", methods={"POST"}, name="Contact")
     */
    public function Contact(Request $request)
    {
    	$response=['ok'];
        $data = json_decode($request->getContent());
        if (filter_var($data->email, FILTER_VALIDATE_EMAIL) && strlen($data->message) <= 1000 &&  strlen($data->message) > 0 ){	//validation
            $new_message= new Contact();
            $new_message->setEmail($data->email);
            $new_message->setMessage($data->message);
            $new_message->setDate(new \DateTime());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($new_message);
            $entityManager->flush();
            return $this->json($response);
        } 
        return new Response('An error occured, please try to recontact the page administrator a few minutes later');
    }
}
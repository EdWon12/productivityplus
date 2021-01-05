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

class ActivityController extends AbstractController
{
    /**
     * @Route("/NewActivity", name="addactivity")
     */
    public function addActivity(Request $request)
    {
    	$form = $this->createForm(ActivityType::class);

        $form->handleRequest($request);
    	if ($form->isSubmitted() && $form->isValid()) {

            $activity = $form->getData();
            $activity->setUser($this->getUser());
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($activity);
            $entityManager->flush();
            $this->addFlash('success','Activity added!');
            return $this->redirectToRoute('addactivity');  //MAKE THIS RETURN TO ROUTE ADDACTIVITY AGAIN & DECOMPOSE THE IF SO IT PASSES AND OPTION WHILE RENDERING "ADDACTIVITY" WHEN EVEREYTHING IS ALRIGHT IT SHOULD SHOW A MESSAGE (ADD AN ELSE ) -- DO THE SAME FOR OTHER FORMS
   		}

    	return $this->render('loggeduser/addactivity.html.twig', [
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/DelActivity", methods={"GET","POST"}, name="deleteactivity")
     */
    public function delActivity(Request $request)       //TEST IF IT REMOVES ASSOSSIATED ACTIONS WHEN ACTIONS ARE ABLE TO BE MADE ++ do it properly like the add route
    {
        $user=$this->getUser();
        $activities=$user->getActivities();
        $activityNames=[];
        foreach ($activities as $key=> $value) {
            $activityNames[$value->getName()]=$value->getId();
        }

        $form = $this->createForm(DelActivityType::class, null , array('activities'=>$activityNames));
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $idActivity = $form->getData()['idActivity'];
            $repository = $this->getDoctrine()->getRepository(Activity::class);
            $activityToRemove=$repository->find($idActivity);
            $entityManager = $this->getDoctrine()->getManager();
            if($activityToRemove->getUser() == $this->getUser())    //makes sure the user doesn't delete activities from another user by malicious intent
            {
                $assossiatedActions=$activityToRemove->getActions();
                foreach ($assossiatedActions as $key => $value) {
                    $activityToRemove->removeAction($value);
                }
                $user->removeActivity($activityToRemove);
                $entityManager->flush();
                $this->addFlash('success', 'Activity deleted!');
                return $this->redirect($request->getUri());
                        // REDIREECTTOROUTE SUCCESS & MAKE SUCESSROUTE -------------   check addactivity
            }
        }
        
        return $this->render('loggeduser/delactivity.html.twig', [          //just shows the form
            'form' => $form->createView(),
        ]);
    }

    /**
     * @Route("/EdtActivity", methods={"GET","POST"}, name="editactivity")
     */
    public function editActivity(Request $request)                                 
    {
        $user=$this->getUser();
        $activities=$user->getActivities();
        $activityNames=[];
        foreach ($activities as $key=> $value) {
            $activityNames[$value->getName()]=$value->getId();
        }

        $form = $this->createForm(EdtActivityType::class, null , array('activities'=>$activityNames));
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $formData = $form->getData();

            $repository = $this->getDoctrine()->getRepository(Activity::class);
            $activityToEdit=$repository->find($formData['idActivity']);
            $entityManager = $this->getDoctrine()->getManager();
            if($activityToEdit->getUser() == $this->getUser())    //makes sure the user doesn't edit activities from another user by malicious intent
            {

                $activityToEdit->setName($formData['name']);
                $activityToEdit->setDescription($formData['description']);
                $entityManager->flush();
                $this->addFlash('success', 'Activity edited!');   
            }
        }

         return $this->render('loggeduser/edtactivity.html.twig', [
            'form' => $form->createView(),
            'activities' => $activities,
        ]);
    }

    /**
    * @Route("/activities", methods={"GET"}, name="activities")
    */
    public function activities()
    {
        //infos for generating draggable elements in calendar
        $activities=$this->getUser()->getActivities();
        $response=[];
        foreach ($activities as $key => $value) {
            $ID=$activities[$key]->getId();
            $response[$ID]['title']=$activities[$key]->getName();
            $response[$ID]['id']=$ID;
        }
        return $this->json($response);
    }
}

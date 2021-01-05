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

class ActionController extends AbstractController
{
	/**
    * @Route("/Action", methods={"GET","POST"}, name="action")
    */
    public function CRUDAction()
    {
        return $this->render('loggeduser/crudaction.html.twig');
    }
	
	/**
    * @Route("/newaction", methods={"POST","GET"}, name="newactions")
    */
    public function addAction(Request $request)
    {
        $response=[];
        $data = json_decode($request->getContent());
        $repository = $this->getDoctrine()->getRepository(Activity::class);
        $activity=$repository->find($data->idActivity);
        $repository = $this->getDoctrine()->getRepository(IsGood::class);
        $isgood=$repository->find($data->isGood);
        $start=new \DateTime($data->start);
        $end=new \DateTime($data->end);
        if ($activity->getUser() == $this->getUser()) {
            $action=new Action();
            $action->setStartDatetime($start);
            $action->setEndDatetime($end);
            $action->setActivity($activity);
            $action->setisGood($isgood);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($action);
            $entityManager->flush();
            $response['id']=$action->getId();
            return $this->json($response);
        }
    }

    /**
    * @Route("/edtaction", methods={"POST"}, name="editaction")
    */
    public function editAction(Request $request)
    {
        $response=['ok'];
        $data = json_decode($request->getContent());
        $start=new \DateTime($data->start);
        $end=new \DateTime($data->end);
        $repository = $this->getDoctrine()->getRepository(Action::class);
        $action=$repository->find($data->id);
        if ($action->getActivity()->getUser() == $this->getUser()) {
            $action->setStartDatetime($start);
            $action->setEndDatetime($end);
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($action);
            $entityManager->flush();
            return $this->json($response);
        }
    }

    /**
    * @Route("/delaction", methods={"POST"}, name="deleteaction")
    */
    public function removeAction(Request $request)
    {
        $response=['ok'];
        $data = json_decode($request->getContent());
        $repository = $this->getDoctrine()->getRepository(Action::class);
        $action=$repository->find($data->id);
        if ($action->getActivity()->getUser() == $this->getUser()) {
            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->remove($action);
            $entityManager->flush();
            return $this->json($response);
        } 
    }

    /**
    * @Route("/actions", methods={"GET"}, name="actions")
    */
    public function actions()
    {
        //infos for generating draggable elements in calendar
        $activities=$this->getUser()->getActivities();
        $actions=[];
        $i=0;
        foreach ($activities as $key => $activity) {					//hydrates $actions
        	foreach ($activity->getActions() as $key => $value) {
        				$actions[$i]=$value;
        				$i++;
        			}		
        }
        $response=[];
        foreach ($actions as $key => $value) {
        	$response[$key]['idAction']=$actions[$key]->getId();
            $response[$key]['idActivity']=$actions[$key]->getActivity()->getId();
            $response[$key]['isGood']=$actions[$key]->getIsGood()->getId();
        	$response[$key]['start']= $actions[$key]->getStartDatetime(); 
        	$response[$key]['end']= $actions[$key]->getEndDatetime();
    	}
        return $this->json($response);
    }
}

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

class StatisticsController extends AbstractController
{
    /**
    * @Route("/Statistics", methods={"GET"}, name="statistics")
    */
    public function viewStatistics()
    {

        $activities=$this->getUser()->getActivities();
        $data=[];
        $i=0;
        foreach ($activities as $key => $activity) {
            $name=$activity->getName();
            $actions=$activity->getActions();
            foreach ($actions as $key => $action) {
                $data[$i]['name']=$name;
                $data[$i]['start']=$action->getStartDatetime()->getTimestamp();
                $data[$i]['end']=$action->getEndDatetime()->getTimestamp();
                $data[$i]['isgood']=$action->getIsGood()->getId();
                $i++;
            }
        }
            //return $this->json($data);


        return $this->render('loggeduser/statistics.html.twig', [
            'data' => $data,
        ]);
    }

    /**
    * @Route("/ActivityStatistics", methods={"GET"}, name="activitystatistics")
    */
    public function viewActivityStatistics()    //makes this display a message if no activities are available (in js file)
    {

        $activities=$this->getUser()->getActivities();
        $data=[];
        $activityNames=[];
        $i=0;
        foreach ($activities as $key => $activity) {
            $name=$activity->getName();
            $actions=$activity->getActions();
            foreach ($actions as $key => $action) {
                $data[$i]['name']=$name;
                $data[$i]['start']=$action->getStartDatetime()->getTimestamp();
                $data[$i]['end']=$action->getEndDatetime()->getTimestamp();
                $data[$i]['isgood']=$action->getIsGood()->getId();
                $i++;
                if (in_array($name, $activityNames) == false) {
                    $activityNames[]=$name;  //a list that only contains activity names that have actions assosiated with them
                }
                
            }
        }


        return $this->render('loggeduser/activityStatistics.html.twig', [
            'data' => $data,
            'names' => $activityNames,
        ]);
    }
}

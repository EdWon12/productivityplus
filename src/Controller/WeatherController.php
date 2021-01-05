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

class WeatherController extends AbstractController
{
    /**
    * @Route("/Weather ", methods={"GET","POST"}, name="weather")
    */
    public function weather(Request $request)
    {
        $form = $this->createForm(LocationType::class);
        
        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {

            $data = $form->getData();
            $city = $data['CityName'];
            $country = $data['Country'];
            $geocoding = file_get_contents('https://eu1.locationiq.com/v1/search.php?key=14de1e0690a30c&city='.$city.'&country='.$country.'&format=json');
            $geocoding = json_decode($geocoding, true);
            $weather = file_get_contents('https://api.openweathermap.org/data/2.5/onecall?lat='.$geocoding['0']['lat'].'&lon='.$geocoding['0']['lon'].'&exclude=minutely,hourly&appid=450388bdda6fdd542c72f78fa6736995');
            $weather = json_decode($weather, true);

            return $this->render('loggeduser/weather.html.twig', [
                'form' => $form->createView(),
                'currentWeather' => $weather['current']['weather']['0']['id'],
                'tomorrowWeather' => $weather['daily']['1']['weather']['0']['id'],
                'city' => $city,
            ]);
        }
        else
        {
            $ip=$request->getClientIp();
            $latlong = explode(",", file_get_contents('https://ipapi.co/' . $ip . '/latlong/'));
            $weather = file_get_contents('https://api.openweathermap.org/data/2.5/onecall?lat='.$latlong[0].'&lon='.$latlong[1].'&exclude=minutely,hourly&appid=450388bdda6fdd542c72f78fa6736995');
            $weather = json_decode($weather, true);
            $city = file_get_contents('https://eu1.locationiq.com/v1/reverse.php?key=14de1e0690a30c&lat='.$weather['lat'].'&lon='.$weather['lon'].'&normalizeaddress=1&format=json');
            $city = json_decode($city, true);
            $city = $city['address']['city'].'('.$city['address']['county'].')';

            return $this->render('loggeduser/weather.html.twig', [
                'form' => $form->createView(),
                'currentWeather' => $weather['current']['weather']['0']['id'],
                'tomorrowWeather' => $weather['daily']['1']['weather']['0']['id'],
                'city' => $city,
            ]);
        }
    }
}

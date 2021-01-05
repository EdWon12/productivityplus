<?php

namespace App\Form;

use App\Entity\Activity;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;

class EdtActivityType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        
        $activities= $options['activities'];
        $builder
            ->add('idActivity', ChoiceType::class, ['choices' => $activities , 'label' => 'Activity'])
            ->add('name', TextType::class)
            ->add('description', TextType::class)
            ->add('edit', SubmitType::class)
        ;
    }

    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults([
            'activities' => null,
        ]);
    }
}

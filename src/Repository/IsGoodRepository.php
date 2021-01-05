<?php

namespace App\Repository;

use App\Entity\IsGood;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Common\Persistence\ManagerRegistry;

/**
 * @method IsGood|null find($id, $lockMode = null, $lockVersion = null)
 * @method IsGood|null findOneBy(array $criteria, array $orderBy = null)
 * @method IsGood[]    findAll()
 * @method IsGood[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IsGoodRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IsGood::class);
    }

    // /**
    //  * @return IsGood[] Returns an array of IsGood objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('i.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?IsGood
    {
        return $this->createQueryBuilder('i')
            ->andWhere('i.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}

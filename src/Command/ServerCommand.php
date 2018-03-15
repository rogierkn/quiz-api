<?php
declare(strict_types=1);


namespace App\Command;


use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Thruway\Peer\Router;
use Thruway\Transport\RatchetTransportProvider;

/**
 * Class ServerCommand
 * @package App\Command
 */
class ServerCommand extends Command
{

    protected function configure()
    {
        $this
            ->setName('quiz:server')
            ->setDescription("Launch the quiz live server");
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int|null|void
     * @throws \Exception
     */
    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $router = new Router();
        $transportProvider = new RatchetTransportProvider("0.0.0.0", 7070);
        $router->addTransportProvider($transportProvider);
        $router->start();

    }
}
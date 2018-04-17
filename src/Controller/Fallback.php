<?php
declare(strict_types=1);


namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;


class Fallback
{
    /**
     * @Route(path="/{fallback}", name="fallback", methods={"GET"}, requirements={"fallback"=".*"})
     * @param string $fallback
     * @return Response
     */
    public function __invoke($fallback = '')
    {
        return new Response(<<<HTML
<html>
  <head>
    <title>Quiz Platform</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/main.css">
  </head>
  <body>
    <div id="root"></div>
    <script src="/bundle.js"></script>
  </body>
</html>       
HTML
        );
    }
}
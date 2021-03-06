<?php

namespace App\GraphQL\Queries;

use Illuminate\Support\Facades\Http;
use Kevinrob\GuzzleCache\Strategy\GreedyCacheStrategy;
use GuzzleHttp\HandlerStack;
use Illuminate\Support\Arr;
use Kevinrob\GuzzleCache\CacheMiddleware;
use Kevinrob\GuzzleCache\Storage\FlysystemStorage;
use League\Flysystem\Adapter\Local;

class Cats
{
    /**
     * cats query resolver
     * @param  null  $_
     * @param  array<string, mixed>  $args
     */
    public function __invoke($_, array $args)
    {
        // Create default HandlerStack
        $stack = HandlerStack::create();

        // Add this middleware to the top with `push`
        $stack->push(new CacheMiddleware(
            new GreedyCacheStrategy(
                new FlysystemStorage(
                    new Local(storage_path('app/public/cache'))
                ),
                10 * 60, // the TTL in seconds (30 seconds)
            )
        ), 'cache');

        // add cache ability to the underlying guzzle framework
        $response = Http::withOptions([
            'handler' => $stack
        ])->withHeaders([
            'x-api-key' => 'c1d2da0c-b43b-4fbc-b8e8-e50895b42778',
        ])->get('https://api.thecatapi.com/v1/images/search', [
            'limit' => 20,
            'format' => 'json',
            'breed_id' => Arr::get($args, 'breed_id', '') ?: null
        ]);

        //return decoded response body from api
        return $response->json();
    }
}

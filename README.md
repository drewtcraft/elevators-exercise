# Elevator Problem

## Run
`node index.js <path-to-file>`

## Test
`npm run test`

## Notes
### On Unreliable Input
The instructions are intentionally vague about handling unexpected values in the input, specifically with the variable representing the number of floors. For example, in the file `input1.txt`, we seem to have an argument of `4` for the number of floors in the building, but the first passenger is going to floor `71`. So I could either turn away passengers who wish to go above the building's cieling, or throw out the number of floors as bad data and take the customers where they want to go (potentially a Wonka Glass Elevator?). I chose the latter, mainly because the former would involve throwing out more data (multiple passengers), and because throwing out the floor count made for a more interesting problem.

### Solution
We need to dequeue the passengers in order. We also want the elevators to take efficient trips, which means we want to batch people who are going to floors that are close together. We only have batching options if there is more than one elevator in the lobby at the same time.  

In my solution, the first round of passengers is taken up in the largest batch possible -- that is, all of the elevators start in the lobby so we can group the passengers easily. The algorithm then calculates which elevator(s) will return to the lobby first and calculates the efficiency of the next trip. It then "looks ahead" and calculates the efficiency of the trip if we waited for the next elevator(s) to return, accounting for the wait time of the existing lobby elevator. We look at these potential batches of trips (TripSets in the code) and dispatch on the most efficient set of trips.  

### Output
The function both returns and writes an array of trips, represented by the passengers in the trip, along with the departure time from the lobby. The data is structured so that an elevator display can render something intelligible to the passengers. The Starret-Lehigh building's elevators work in a similar way if I remember correctly -- you input your desired floor into a terminal and in response receive which elevator to take (no departure time though).


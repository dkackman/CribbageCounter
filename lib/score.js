module.exports.scoreHand = function(hand, isCrib) {
    if (typeof hand !== "string") throw 'A hand must be supplied';
    
    // normalize the input
    var fullHand = hand.trim().toUpperCase().split(",");
    if (fullHand.length != 5) throw '5 cards must be supplied';
    if (uniqueCount(fullHand) != 5) throw "Duplicate cards are not valid";
  
    var cards = new Array();
    for (var i = 0; i < 5; i++) {
      var c = fullHand[i].trim(); // be forgiving with embedded spaces
      if (!isValid(c)) throw c + ' is not a valid card';
  
      var card = new Object();
      card.name = c[0];
      card.suit = c[1];
      card.ordinal = values.indexOf(c[0]);
      card.value = card.ordinal < 9 ? card.ordinal + 1 : 10;
      cards.push(card);
    }

    // this is so we can look for nobs
    var cutCard = cards[4];
    var fourCards = cards.slice(0, 4);

    // sort so finding runs is easier
    cards.sort(function(a, b){ return a.ordinal - b.ordinal });

    score = count15s(cards);
    score += countRuns(cards);
    score += countPairs(cards);
    
    if (isCrib) { // the crib requires 5 cards for a flush
        score += countFlush(cards);
    }
    else if (cards[0].suit == cutCard.suit) { // possibility of 4 or 5 card flush
        score += countFlush(cards);
    }
    else { // possibility of 4 card flush
        score += countFlush(fourCards);
    }

    score += countNobs(fourCards, cutCard);

    return score;
}

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K' ];
const suits = [ 'S', 'H', 'C', 'D' ];

function isValid(c)
{
    if (c.length != 2) return false;
    if (!values.includes(c[0])) return false;
    if (!suits.includes(c[1])) return false;

    return true;
}

function uniqueCount(cards) {
    let unique = [...new Set(cards)]; 
    return unique.length;
}

function count15s(fullHand)
{
    var score = 0;

    // Look through the "2" sets, then the 3, 4 and 5
    for (var setIndex = 2; setIndex < 6; setIndex++)
    {
        for (var setLength = 0; setLength < _setMatrix[setIndex].length; setLength++)
        {
            var sum = 0;

            // Add up the cards pointed to by the indicies of the set.
            for (var setMember = 0; setMember < _setMatrix[setIndex][setLength].length; setMember++) {
                sum += fullHand[_setMatrix[setIndex][setLength][setMember]].value;
            }

            if (sum == 15)
            {
                score += 2;
            }
        }
    }

    return score;
}

function countRuns(fullHand)
{
    var runFound = false;
    var score = 0;

    // Look for 5 card runs first, then 4 then 3.
    for (var i = 5; i > 2; i--)
    {
        var sets = _setMatrix[i];

        // Iterate over each of the sets available for the length under examination.
        for (var setIndex = 0; setIndex < sets.length; setIndex++)
        {
            var localRunFound = true;

            // Look at each each index in the set, from the first to the second-to-last.
            for (var setMember = 0; setMember < sets[setIndex].length - 1; setMember++)
            {
                var first = fullHand[sets[setIndex][setMember]];
                var second = fullHand[sets[setIndex][setMember + 1]];

                // Check to see if the second card is only 1 more than the current
                // card.  If it isn't, skip out of the loop.  The two cards are
                // not consecutive, so we can't have a run of this length.
                if (second.ordinal - first.ordinal != 1)
                {
                    localRunFound = false;
                    break;
                }
            }

            // If we're this far and the localRunFound flag has not been reset, 
            // the current set defines a group of array indicies that are a run.
            if (localRunFound)
            {
                var localRun = new Array(i);

                // Copy the cards of the set into an array.
                for (var setMember = 0; setMember < i; setMember++) {
                    localRun[setMember] = fullHand[sets[setIndex][setMember]];
                }
                
                score += i;
                runFound = true;
            }
        }

        // If a run has been found, don't look at smaller runs.
        if (runFound) {
            break;
        }
    }

    return score;
}

function countPairs(fullHand)
{
    var score = 0;

    // Look through the sets of indicies in the "2" set.
    var matrix = _setMatrix[2];
    for (var setLength = 0; setLength < matrix.length; setLength++)
    {
        // Check the two cards pointed at by the indicies and see if they're the same             
        if (fullHand[matrix[setLength][0]].name == fullHand[matrix[setLength][1]].name)
        {
            score += 2;
        }
    }

    return score;
}

function countNobs(hand, cutCard) {
    // Loop over all the cards in the hand, check to see if it's a Jack, and if it
    // is check the suit.
    for (var i = 0; i < hand.length; i++) {
        if (hand[i].name == 'J' && hand[i].suit == cutCard.suit) {
            return 1;
        }
    }

    // We haven't left the routine yet, so the right jack is not in the hand.
    return 0;
}

function countFlush(hand) {
    var suit = hand[0].suit;

    // Check the suit of each Card in the hand against the suit of the first
    // card.  As soon as they don't match, skip out of the routine.
    for (var i = 1; i < hand.length; i++) {
        if (hand[i].suit != suit) {
            return 0;
        }
    }

    // If we're here, a flush exists.
    return hand.length;
}

const _setMatrix = [
    [   // 0 length sets
    ],
    [   // sets of 1
        [0],
        [1],
        [2],
        [3],
        [4]
    ],
    [   // sets of 2
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 2],
        [1, 3],
        [1, 4],
        [2, 3],
        [2, 4],
        [3, 4]
    ],
    [   // sets of 3
        [0, 1, 2],     
        [0, 1, 3],
        [0, 2, 3],
        [1, 2, 3],
        [0, 1, 4],
        [0, 2, 4],
        [1, 2, 4],
        [0, 3, 4],
        [1, 3, 4],
        [2, 3, 4]
    ],
    [   // sets of 4
        [0, 1, 2, 3],
        [0, 1, 2, 4],
        [0, 1, 3, 4],
        [0, 2, 3, 4],
        [1, 2, 3, 4]
    ],
    [   // set of 5
        [0, 1, 2, 3, 4]
    ]
 ];
module.exports.scoreHand = function (hand, isCrib) {
    if (typeof hand !== "string") throw 'A hand must be supplied';

    // normalize the input and then split into individual cards
    const fullHand = hand.trim().toUpperCase().split(",");
    if (fullHand.length != 5) throw '5 cards must be supplied as a comma separated list';
    if (new Set(fullHand).size != 5) throw "Duplicate cards are not valid"; // set eliminates duplicates

    const cards = [];
    for (let i = 0; i < 5; i++) {
        const c = fullHand[i];
        if (!isValid(c)) throw '[' + c + '] is not a valid card';

        const card = {};
        card.display = c;
        card.name = c[0];
        card.suit = c[1];
        card.ordinal = values.indexOf(c[0]);
        card.value = card.ordinal < 9 ? card.ordinal + 1 : 10;
        cards.push(card);
    }

    // this is so we can look for nobs and it's used in flush logic
    const cutCard = cards[4];
    const playersHand = cards.slice(0, 4);

    // sort for finding runs
    cards.sort((a, b) => a.ordinal - b.ordinal);

    const result = {};
    result.points = [];

    let score = count15s(cards, result);
    score += countRuns(cards, result);
    score += countPairs(cards, result);

    // the crib requires 5 cards for a flush 
    // or try for all five if first card matches    
    // non-crib flush (if not 5) must all be in hand
    score += (isCrib || cards[0].suit == cutCard.suit) ? countFlush(cards, result) : countFlush(playersHand, result);
    score += countNobs(playersHand, cutCard, result);

    result.score = score;
    return result;
};

const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
const suits = ['S', 'H', 'C', 'D'];

function isValid(c) {
    if (c.length != 2) return false;
    if (!values.includes(c[0])) return false;
    if (!suits.includes(c[1])) return false;

    return true;
}

function count15s(fullHand, result) {
    let score = 0;

    // Look through the "2" sets, then the 3, 4 and 5
    for (let i = 2; i < 6; i++) {
        const sets = _setMatrix[i];

        for (let setLength = 0; setLength < _setMatrix[i].length; setLength++) {
            let sum = 0;

            const cards = [];
            // Add up the cards pointed to by the indicies of the set.
            for (let setMember = 0; setMember < sets[setLength].length; setMember++) {
                sum += fullHand[sets[setLength][setMember]].value;
                cards.push(fullHand[sets[setLength][setMember]].display);
            }

            if (sum == 15) {
                const explanation = {};
                explanation.name = "Fifteen";
                explanation.cards = cards;
                explanation.points = 2;
                result.points.push(explanation);

                score += 2;
            }
        }
    }

    return score;
}

function countRuns(fullHand, result) {
    let runFound = false;
    let score = 0;

    // Look for 5 card runs first, then 4 then 3.
    for (let i = 5; i > 2; i--) {
        const sets = _setMatrix[i];

        // Iterate over each of the sets available for the length under examination.
        for (let setLength = 0; setLength < sets.length; setLength++) {
            let localRunFound = true;

            // Look at each each index in the set, from the first to the second-to-last.
            for (let setMember = 0; setMember < sets[setLength].length - 1; setMember++) {
                const first = fullHand[sets[setLength][setMember]];
                const second = fullHand[sets[setLength][setMember + 1]];

                // Check to see if the second card is only 1 more than the current
                // card. If it isn't, skip out of the loop. The two cards are
                // not consecutive, so we can't have a run of this length.
                if (second.ordinal - first.ordinal != 1) {
                    localRunFound = false;
                    break;
                }
            }

            // If we're this far and the localRunFound flag has not been reset, 
            // the current set defines a group of array indicies that are a run.
            if (localRunFound) {
                const localRun = new Array(i);

                // Copy the cards of the set into an array.
                for (let setMember = 0; setMember < i; setMember++) {
                    localRun[setMember] = fullHand[sets[setLength][setMember]];
                }

                const explanation = {};
                explanation.name = "Run of " + i.toString();
                explanation.cards = localRun.map(item => item.display);
                explanation.points = i;
                result.points.push(explanation);

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

function countPairs(fullHand, result) {
    let score = 0;

    // Look through the sets of indicies in the "2" set.
    const sets = _setMatrix[2];
    for (let setLength = 0; setLength < sets.length; setLength++) {
        // Check the two cards pointed at by the indicies and see if they're the same             
        if (fullHand[sets[setLength][0]].name == fullHand[sets[setLength][1]].name) {
            const explanation = {};
            explanation.name = "Pair";
            explanation.cards = [fullHand[sets[setLength][0]].display, fullHand[sets[setLength][1]].display];
            explanation.points = 2;
            result.points.push(explanation);

            score += 2;
        }
    }

    return score;
}

function countNobs(hand, cutCard, result) {
    // Loop over all the cards in the hand, check to see if it's a Jack, and if it is check the suit.
    for (let i = 0; i < hand.length; i++) {
        if (hand[i].name == 'J' && hand[i].suit == cutCard.suit) {
            const explanation = {};
            explanation.name = "Nobs";
            explanation.cards = [hand[i].display, cutCard.display];
            explanation.points = 1;
            result.points.push(explanation);

            return 1;
        }
    }

    // We haven't left the routine yet, so the correct jack is not in the hand.
    return 0;
}

function countFlush(hand, result) {
    const suit = hand[0].suit;
    const explanation = {};
    explanation.name = "Flush";
    explanation.cards = [];
    explanation.cards.push(hand[0].display); // first card doesn't get inspected below

    // Check the suit of each Card in the hand against the suit of the first
    // card. As soon as they don't match, skip out of the routine.
    for (let i = 1; i < hand.length; i++) {
        explanation.cards.push(hand[i].display);
        if (hand[i].suit != suit) {
            return 0;
        }
    }

    // If we're here, a flush exists.
    explanation.points = hand.length;
    result.points.push(explanation);

    return hand.length;
}

// indices into the hand used for counting & comparisons
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
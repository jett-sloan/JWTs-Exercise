class MarkovMachine {
  
    constructor(text) {
      let words = text.split(/[ \r\n]+/);
      this.words = words.filter(c => c !== "");
      this.makeChains();
    }
  
  
    makeChains() {
        let chains = new Map();
    
        for (let i = 0; i < this.words.length; i++) {
            let currentWord = this.words[i];
            let nextWord = this.words[i + 1] || null;
    
            if (!chains.has(currentWord)) {
                // If we haven't seen this word before, create an empty list for it
                chains.set(currentWord, []);
            }
            chains.get(currentWord).push(nextWord);
        }
    
        this.chains = chains;
    }
  
  
    /** Pick random choice from array */
  
    getRandomChoiceFromArray(array) {
        // Generate a random index within the length of the array
        const randomIndex = Math.floor(Math.random() * array.length);
    
        // Return the element at the random index
        return array[randomIndex];
    }
  
  
    /** return random text from chains */
  
    makeText(numWords = 100) {

        let keys = Array.from(this.chains.keys()); // Get all the keys (words) from our Markov chains
        let key = this.getRandomChoiceFromArray(keys); // Randomly pick one of those keys (words)

      // pick a random key to begin
        let out = [];
  
      // produce markov chain until reaching termination word
        while (out.length < numWords && key !== null) {
            out.push(key);
        let nextWords = this.chains.get(key);
        key = this.getRandomChoiceFromArray(nextWords)
      }
  
      return out.join(" ");
    }
  }
  

  module.exports = MarkovMachine;


let mm = new MarkovMachine("Say I like green eggs and ham I do I like them Sam I am And I would eat them in a boat And I would eat them with a goat And I will eat them in the rain And in the dark And on a train And in a car And in a tree They are so good so good you see I do so likeGreen eggs and ham Thank you Thank you Sam I am")


mm.makeText();

mm.makeText(numWords=100);

console.log(mm.makeText(100));


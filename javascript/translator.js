const brailleDict = {
    'a': 'O.....', 'b': 'O.O...', 'c': 'OO....', 'd': 'OO.O..', 'e': 'O..O..', 
    'f': 'OOO...', 'g': 'OOOO..', 'h': 'O.OO..', 'i': '.OO...', 'j': '.OOO..', 
    'k': 'O...O.', 'l': 'O.O.O.', 'm': 'OO..O.', 'n': 'OO.OO.', 'o': 'O..OO.', 
    'p': 'OOO.O.', 'q': 'OOOOO.', 'r': 'O.OOO.', 's': '.OO.O.', 't': '.OOOO.', 
    'u': 'O...OO', 'v': 'O.O.OO', 'w': '.OOO.O', 'x': 'OO..OO', 'y': 'OO.OOO', 
    'z': 'O..OOO',

    'capital_follows': '.....O', 'decimal_follows': '.O...O', 'number_follows': '.O.OOO',

    '.': '..OO.O', ',': '..O...', '?': '..O.OO', '!': '..OOO.', ':': '..OO..', 
    ';': '..O.O.', '-': '....OO', '/': '.O..O.', '<': '.OO..O', '>': 'O..OO.',
    '(': 'O.O..O', ')': '.O.OO.', ' ': '......',
};

const brailleNumDict = {
    '1': 'O.....', '2': 'O.O...', '3': 'OO....', '4': 'OO.O..', '5': 'O..O..', 
    '6': 'OOO...', '7': 'OOOO..', '8': 'O.OO..', '9': '.OO...', '0': '.OOO..', 
}

const englishDict = Object.fromEntries(
    Object.entries(brailleDict).map(([key, val]) => [val, key]),
);

const englishNumDict = Object.fromEntries(
    Object.entries(brailleNumDict).map(([key, val]) => [val, key]),
);

const brailleToEnglishPropertyCheck = (char, output, flags) => {
    const {capitalize, isNumber} = flags;

    if (englishDict.hasOwnProperty(char)){
        const englishChar = englishDict[char];

        if (englishChar === 'capital_follows'){
            flags.capitalize = true;

        } else if (englishChar === 'number_follows'){
            flags.isNumber = true;

        } else if (englishChar === ' '){
            output += englishChar;
            flags.isNumber = false;

        } else{

            if (isNumber){
                if(englishNumDict.hasOwnProperty(char)){
                    output += englishNumDict[char]
                }
                
            } else {
                output += flags.capitalize ? englishChar.toUpperCase() : englishChar;
                flags.capitalize = false;
            }
        }
    }
    else {
        output += 'unknown input'
    }

    return output;

};

const englishToBraillePropertyCheck = (char, output, flag) => {

    const {isNumberSequence} = flag;
    const capitalChar = brailleDict['capital_follows'];
    const numberChar = brailleDict['number_follows'];

    const lowerCaseEnglishChar = char.toLowerCase();

    if (brailleDict.hasOwnProperty(lowerCaseEnglishChar) || brailleNumDict.hasOwnProperty(char)){

        if (/^[A-Z]$/.test(char)){
            output += capitalChar;
            output += brailleDict[lowerCaseEnglishChar];

        } else if (/^[0-9]$/.test(char)){

            if (!flag.isNumberSequence){
                output += numberChar;
                flag.isNumberSequence = true;
            }

            output += brailleNumDict[char];

        } else if (lowerCaseEnglishChar === ' '){
                output += brailleDict[lowerCaseEnglishChar];
                flag.isNumberSequence = false;

        } else {
            output += brailleDict[lowerCaseEnglishChar];
        
        }

    }
    else {
        output += 'unknown input'
    }

    return output;
};

const brailleToEnglish = (userInput) => {
    let output = '';
    const flags = {capitalize: false, isNumber: false};

    try {
        for (let i = 0; i < userInput.length; i += 6){
            const brailleChar = userInput.slice(i, i + 6);

            output = brailleToEnglishPropertyCheck(brailleChar, output, flags);
        }

    } catch (error) {
        console.error(error);
    }

    return output === '' ? 'invalid input' : output;


};

const englishToBraille = (userInput) => {
    let output = '';
    const flag = {isNumberSequence : false};
    

    try {
        for (let i = 0; i < userInput.length; i++){
            const englishChar = userInput.slice(i, i + 1);
           
            output = englishToBraillePropertyCheck(englishChar, output, flag);
        }
    } catch (error) {
        console.error(error);
    }

    return output === '' ? 'invalid input' : output;
};


const translator = () => {

    let output = null;
    const userInput = process.argv.slice(2).join(' ');
    const isBraille = /^[O.]+$/.test(userInput);

    if (isBraille){
        output = brailleToEnglish(userInput);
        console.log(output);
    } else {
        output = englishToBraille(userInput);
        console.log(output);
    }

};

translator();
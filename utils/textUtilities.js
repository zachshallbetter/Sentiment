// textUtilities.js

import natural from 'natural';
import { WordTokenizer } from 'natural';
import spellcheck from 'spellchecker';
import customWordlist from '../config/customWordlist.json';
import analysisUtilities from './analysisUtilities.js';

const tokenizer = new WordTokenizer();

// Initialize an empty object for custom corrections
const customCorrections = {};

// Function to log transformations with styling and color
function logTransformation(stage, original, transformed) {
    console.log(`[${stage}] Original: ${original} -> Transformed: ${transformed}`);
}

// Macro function to process an array of transformation stages
function processTextStages(textStages) {
    textStages.forEach(stage => {
        switch (stage.type) {
            case "normalize":
                stage.result = enhancedNormalizeText(stage.text);
                break;
            case "tokenizeAndStem":
                stage.result = tokenizeAndStem(stage.text);
                break;
            case "correctSpelling":
                stage.result = correctSpelling(stage.text);
                break;
            default:
                console.error("Unknown stage type");
        }
        logTransformation(stage.type, stage.text, stage.result);
    });
}

// Function to enhance text normalization: converts to lowercase and removes non-alphanumeric characters
function enhancedNormalizeText(text) {
    let normalizedText = text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '');
    return normalizedText;
}

// Function to tokenize and stem text: tokenizes the text into words, stems each token
function tokenizeAndStem(text) {
    const tokens = tokenizer.tokenize(text);
    const stemmedTokens = tokens.map(token => {
        let stemmed = natural.PorterStemmer.stem(token);
        // Correctly using shouldAdjustStemming from analysisUtilities
        // Fix applied: Check if the function exists before calling it
        if (analysisUtilities.shouldAdjustStemming && analysisUtilities.shouldAdjustStemming(token, stemmed)) {
            stemmed = analysisUtilities.adjustStem(token, stemmed);
        }
        return stemmed;
    });
    return stemmedTokens;
}

// Function to correct spelling in a given text
function correctSpelling(text) {
    const tokens = tokenizer.tokenize(text);
    const correctedTokens = tokens.map(token => {
        if (customCorrections.hasOwnProperty(token)) {
            return customCorrections[token];
        }
        if (spellcheck.isMisspelled(token)) {
            const corrections = spellcheck.getCorrectionsForMisspelling(token);
            const bestCorrection = analysisUtilities.selectBestCorrection ? analysisUtilities.selectBestCorrection(corrections, customWordlist) : token;
            return bestCorrection ? bestCorrection : token;
        } else {
            return token;
        }
    });
    const correctedText = correctedTokens.join(' ');
    return correctedText;
}

// Exporting the functions for use in other parts of the application
module.exports = { enhancedNormalizeText, tokenizeAndStem, correctSpelling, processTextStages };

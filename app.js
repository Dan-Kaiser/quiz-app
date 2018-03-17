var state = {
	items: [
		{
		question: "What does 'tomat' mean?",
		options: ["Tomato","Potato","Jam","Onion"],
		answer: "Tomato"
	},
	{
		question: "What does 'applesin' mean?",
		options: ["Orange","Sugar","Hamburger","Salad"],
		answer: "Orange"
	},
	{
		question: "What does 'agurk' mean?",
		options: ["Cucumber", "Almond", "Pork", "Celery"],
		answer: "Cucumber"
	},
	{
		question: "What does 'suppe' mean?",
		options: ["Soup", "Fish", "Beef", "Crackers"],
		answer: "Soup"
	},
	{
		question: "What does 'mandel' mean?",
		options: ["Almond", "Ginger", "Chicken", "Monkfish"],
		answer: "Almond"
	},
	{
		question: "What does 'frukt' mean?",
		options: ["Fruit", "Vegetable", "Juice", "Milk"],
		answer: "Fruit"
	},
	{
		question: "What does 'banan' mean?",
		options: ["Banana", "Apple", "Orange", "Peach"],
		answer: "Banana"
	},
	{
		question: "What does 'eple' mean?",
		options: ["Apple", "Peanut", "Spinach", "Hotdog"],
		answer: "Apple"
	},
	{
		question: "What does 'fisk' mean?",
		options: ["Fish", "Lunch", "Lettuce", "Ice-cream"],
		answer: "Fish"
	},
	{
		question: "What does 'panekaker' mean?",
		options: ["Pancakes", "Waffles", "French-Toast", "Cereal"],
		answer: "Pancakes"
	},
	]
};


//compares the answer text to the correct answer and returns true or false
function compareAnswer(answerText, state){
	if (answerText === state.items[state.counter].answer) {
		//console.log("true");
		return true;
	} else {
		//console.log("false");
		return false
	};

}




//State Modifiers

//adds 1 to the total correct variable in state
function increaseTotalCorrect(state){
	state.totalCorrect += 1;
}

//increases the question # counter by 1
function increaseQuestionCounter(state){
		state.counter += 1;
}



//HTML modifiers

//removes the 'hidden' class tag from an element
function removeHidden(element){
	element.removeClass('hidden');
}

//add the 'hidden' class to an element
function addHidden(element){
	element.addClass('hidden');
}



//Text Updaters

//increases the "question #" text by 1 and updates the text
function questionNumberUpdater(state){
	var questionNumber = $('.js-question-number');
	questionNumber.text("question" + " " + (state.counter + 1) + " of " + state.items.length);
}

//updates the "# of # correct" text
function answerRatioUpdater(state){
	var answerRatio = $('.js-ratio-results');
	answerRatio.text(state.totalCorrect + " of " + (state.counter + 1) + " correct");
}

//updates the text of the question to the new question number
function questionTextUpdater(questionElement, state){
	questionElement.text(state.items[state.counter].question);
}

//updates the button text for the answers
function answerButtonsUpdater(answersElement, state){

	var currentOptions = state.items[state.counter].options.map(
		function(item, index){
			return state.items[state.counter].options[index]
	});
	//loops through buttons via ID and replaces their text
	for (i=0; i < currentOptions.length; i++){
		answersElement.find('#' + i).text(currentOptions[i]);
	}
}

//updates the correct text to the current answer
function correctionTextUpdater(correctionText, state){
	correctionText.text("The correct answer was " + state.items[state.counter].answer);
}



//Event Listeners

//creates a listener for the "Next" button
function nextButtonListener(nextButtonID, questionElement, answersElement, correctionText, state){
	nextButtonID.click(function(event){
		event.preventDefault();
		if (state.counter < state.items.length - 1){
			increaseQuestionCounter(state);
		}
		questionTextUpdater(questionElement, state);
		answerButtonsUpdater(answersElement, state);
		addHidden(nextButtonID);
		addHidden(correctionText);
		questionNumberUpdater(state);
		state.guessed = false;

	});
}

//creates a listener for the answer buttons
function answerButtonListener(nextButtonElement, correctionText, startButtonID, state){
	$('#0, #1, #2, #3').click(function(event){
		var currentAnswer = $(event.currentTarget).text();

		if (state.counter === state.items.length -1){
			removeHidden(startButtonID);
		} else {
			removeHidden(nextButtonElement);
		}

		if(compareAnswer(currentAnswer, state)) {
			correctionText.css({"color":"green"});
			if(state.guessed === false) {
				increaseTotalCorrect(state);
			}
		} else { 
				correctionText.css({"color":"red"});
		}
		state.guessed = true;
		answerRatioUpdater(state);
		removeHidden(correctionText);
		correctionTextUpdater(correctionText, state);
	});
}

//creates a listener for the start button, which starts or resets the quiz.
function startButtonListener(startButtonID, questionElement, answersContainer, nextButtonID, correctionText, state){
	startButtonID.click(function(event){
		event.preventDefault();

		var startButtonElement = startButtonID;
		var answersElement = answersContainer;
		var nextButtonElement = nextButtonID;

		//resets the quiz if it has been completed
		if(state.counter === state.items.length - 1){	
			state.counter = 0;
			state.totalCorrect = 0;
			state.guessed = false;

			answerRatioUpdater(state);
			questionNumberUpdater(state);
			addHidden(correctionText);
		
		} else 
		//starts the quiz
		{
			removeHidden(questionElement);
			removeHidden(answersElement);

			answerButtonListener(nextButtonElement, correctionText, startButtonID, state);
			nextButtonListener(nextButtonID, questionElement, answersElement, correctionText, state);
			
		}
		questionTextUpdater(questionElement, state);
		answerButtonsUpdater(answersElement, state);
		questionNumberUpdater(state);
		addHidden(startButtonElement);
	});
}

//Sets up the event listener and starts the game.
$(function(){
	var questionElement = $('.js-question-prompt');
	var startButtonID = $('.js-start');
	var answersContainer = $('.js-answers-container');
	var nextButtonID = $('.next-button');
	var correctionText = $('.js-correct-answer');

	state.totalCorrect = 0;
	state.guessed = false;
	state.counter = 0;

	startButtonListener(startButtonID, questionElement, answersContainer, nextButtonID, correctionText, state);

});
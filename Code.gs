function showCustomUI() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile('scheduling')
      .setTitle('Formatted Scheduler')
      .setWidth(500);
  FormApp.getUi().showSidebar(htmlOutput)
}

function isResponseNA(responseString) {
  const responsesNA = [
    "n/a",
    "na",
    "none"
  ];

  return responsesNA.includes(responseString.toLowerCase().trim());
}

function getValidNames() {
  const QUESTION_INDICES = {
      firstNameIndex: 0,  
      lastNameIndex: 1,   
      sessionIndices: {
          // WEEKDAY SESSIONS
          "Weekday Session #1 M/W": {
              sessionIndex: 9, 
              datesUnavailableIndex: 11 
          },
          "Weekday Session #1 T/TH": {
              sessionIndex: 10, 
              datesUnavailableIndex: 11 
          },
          "Weekday Session #2 M/W": {
              sessionIndex: 12, 
              datesUnavailableIndex: 14 
          },
          "Weekday Session #2 T/TH": {
              sessionIndex: 13, 
              datesUnavailableIndex: 14 
          },
          "Weekday Session #3 M/W": {
              sessionIndex: 15, 
              datesUnavailableIndex: 17 
          },
          "Weekday Session #3 T/TH": {
              sessionIndex: 16, 
              datesUnavailableIndex: 17 
          },

          // WEEKEND SESSIONS
          "Weekend Session #1": {
              sessionIndex: 18, 
              datesUnavailableIndex: 19 
          },
          "Weekend Session #2": {
              sessionIndex: 20, 
              datesUnavailableIndex: 21 
          },
          "Weekend Session #3": {
              sessionIndex: 22, 
              datesUnavailableIndex: 23 
          },
          "Weekend Session #4": {
              sessionIndex: 24, 
              datesUnavailableIndex: 25 
          },
          "Weekend Session #5": {
              sessionIndex: 26, 
              datesUnavailableIndex: 27 
          }
      }
  };

  var responses = FormApp.getActiveForm().getResponses();

  var result = [];

  // Iterate over each response
  for (var i = 0; i < responses.length; i++) {
      var formResponse = responses[i];
      var itemResponses = formResponse.getItemResponses();
      
      var firstName = itemResponses[QUESTION_INDICES.firstNameIndex].getResponse();
      var lastName = itemResponses[QUESTION_INDICES.lastNameIndex].getResponse();

      for (var session in QUESTION_INDICES.sessionIndices) {
          const availability = itemResponses[QUESTION_INDICES.sessionIndices[session].sessionIndex].getResponse();
          const datesUnavailable = itemResponses[QUESTION_INDICES.sessionIndices[session].datesUnavailableIndex].getResponse();

          const hasAvailability = availability.filter(item => !item.toLowerCase().includes("not available")).length > 0;

          let sessionEntry = result.find(entry => entry.title === session);

          if (!sessionEntry) {
              sessionEntry = {
                  title: session,
                  fullAvailable: [],
                  someAvailable: [],
                  notAvailable: [],
              };
              result.push(sessionEntry);
          } 
        
          if (availability.length > 0 && hasAvailability && (datesUnavailable.length <= 1 || isResponseNA(datesUnavailable))) {
              sessionEntry.fullAvailable.push({
                  "name": `${firstName} ${lastName}`,
                  "availability": availability,
                  "unavailability": ""
              });
          } else if (availability.length > 0 && hasAvailability) {
              sessionEntry.someAvailable.push({
                  "name": `${firstName} ${lastName}`,
                  "availability": availability,
                  "unavailability": datesUnavailable.toString()
              });
          } else {
              sessionEntry.notAvailable.push({
                  "name": `${firstName} ${lastName}`,
                  "availability": [],
                  "unavailability": ""
              });
          }
      }
  }
  
  return result;
}

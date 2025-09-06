# Brainstorming

This file is used to document your thoughts, approaches and research conducted across all tasks in the Technical Assessment.

## Firmware

## Spyder

### Task 1
- I ran the UI, and noticed that the values being displayed were mostly float integers. However, some of the values were also strings, and outlier integers (e.g., 400). I suspected that the valid datapoints were all floats, and the remaining entries were invalid.
- Looking at the console, I was able to verify my theory. I added a line that printed the data type of each entry, and saw that most were numbers but some were strings.
- First, I filtered out the strings using typeof. Dealing with the outlier integers was more difficult, since TS doesn't differentiate between integers and floats.
- I thougth about using the Number.isInteger() function. However, this could potentially filter out valid data, where the float entry is coincidentally an integer (e.g., 24.000000000000000).
- As such, I just checked if the data entry (as a string) contained a decimal point or not. This filters out the non-float values. I don't need to worry if the entry includes multiple '.' characters since I already check if the entry type is a number when filtering out strings.
- In terms of handling the invalid data, I left the console logs as is (i.e., all data is still logged onto the console), and only prevented the invalid data from being sent to the UI. My main reasoning behind this was to ensure that there was still a way to see all the data coming through, in case theres an error in the code.
- Another option could've been to have a separate data stream to the UI, which shows all the readings in a hidden view. However, in the interest of time, I opted against this.


### Task 2
- For this task, I immediately decided to use an array to store the relevant timestamps. First, the data received would be cleaned as per Task 1, and then it would check if it exceeded the range of 20-80 degrees. 
- My code's logic seemed sound, but it wasn't printing anything in the console. Then I realised that I had forgotten to write it as a global array, rather writing it within the server call (meaning it reset with each new entry).
- I found an issue with my logic for checking if a data entry was a float or not, so I rectified it
- Found another issue with me using a tLen variable (since, if the array was shortened, then the length would be updated, but this wouldn't be reflected in the tLen variable)


### Task 3
- First, I checked the UI source code to look for any red flags. I noticed that the update for the "Connection" label was handled using a useEffect hook with readyState. I also noticed that there was a "connectionStatus" state, and the issue could've been there as well. Looking further, I also noticed that, in the HTML code returned, that the "Badge" tag had a condition on the variant.
- I ruled out the "Badge" variant condition as an issue, since it already displays and wouldn't affect the inner text. I also didn't see an issue with the use of the "connectionStatus" state, so I directed my attention to the use of "readyState" in the useEffect hook.
- The logic of the switch case appeared to be sound. However, unlike the other useEffect hooks, I noticed that the hook in question didn't contain any dependencies. This means that it wouldn't have made React re-render the page once the readyState or connectionStatus were updated, and only set the Badge text on the first render. I added these two dependencies to the hook, and it appeared to function as required.

### Task 4
- **Rounding Temperature**: this was relatively simple, using the toFixed function. I rounded the temperature on the frontend, as opposed to the server end, in case other recipients of the data need a more accurate temperature reading.
- **Temperature Colours**: for this, I used the cn function that was provided. Looking at the code, it appears to just merge the classes together. So, I gave it the classes that were already set, and added a second parameter for the conditional colour class. I abstracted this code into its own function, for readability. I created classes in global.css within the utilities layer, and used colours from the tailwind framework (red, amber, and emerald). I felt that these looked nicest in the dark mode colour scheme. However, if I add a light mode feature later on, I may need to review these choices to ensure readability, or just add a separate collection of classes for light mode colours.

## Cloud
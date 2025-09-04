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

## Cloud
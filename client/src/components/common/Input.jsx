import React from "react";

// export default function Input({ name, state, setState, label = false }) { ... }: Defines a functional component named Input and accepts props for:
// name: The name of the input field (used for identification and labeling).
// state: The current value of the input field.
// setState: A function to update the value of the input field.
// label (optional): A boolean to indicate whether a label should be displayed for the input (defaults to false).
export default function Input({ name, state, setState, label = false }) {
  return (
    <div className="flex gap-1 flex-col">
      {label && (
        <label htmlFor={name} className="text-teal-light text-lg px-1">
          {name}
        </label>
      )}
      <div>
        <input
          name={name}
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="bg-input-background text-sm focus:outline-none text-white h-10 rounded-lg pl-5 pr-5 py-4 w-full"
        />
      </div>
    </div>
  );
}

// Returns the JSX for the input field:
// A div element:
// Sets the layout with flex and flex-col classes for a row arrangement.
// Sets a gap between elements using the gap-1 class.
// Conditionally renders the label based on the label prop:
// If label is true:
// Creates a label element for the input:
// Sets the for attribute to the name prop to link the label to the input field.
// Sets styles for the label: light teal color, large size, padding on the left, and white text.
// Displays the name of the input field as the label text.
// A nested div for styling.
// An input element with styles:
// Sets the name attribute to the provided name prop.
// Sets the type to "text" for text input.
// Sets the value to the current state of the input field.
// Defines an onChange event handler that gets called whenever the input value changes:
// Updates the state using the provided setState function with the new value from the event target (the input field).
// Sets additional styles: background color, small font size, outline removal on focus, white text, fixed height, rounded corners, padding left and right, and full width.

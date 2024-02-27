import Image from "next/image";
import React from "react";

function Empty() {
  return (
    <div className="border-conversation-border border-l w-full bg-panel-header-background flex flex-col h-[100vh] border-b-4 border-b-icon-green items-center justify-center">
      <Image src="/whatsapp.gif" alt="whatsapp-gif" height={300} width={300} />
    </div>
  );
}

export default Empty;

// Returns the JSX for an empty state representation:
// A div element:
// Sets border styles with specific classes: conversation border, left border, full width, header background color, flex layout with column direction, full viewport height, bottom border with specific size and color (green icon), centered content.
// An Image component:
// Displays an image from "/whatsapp.gif" with alternate text "whatsapp-gif".
// Sets the image dimensions (height and width) to 300 pixels.

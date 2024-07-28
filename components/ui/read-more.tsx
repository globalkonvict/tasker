"use client";
import React, { useState, useRef, useEffect } from "react";

type ReadMoreParagraphProps = {
  text: string;
  lines: number;
};

const ReadMoreParagraph: React.FC<ReadMoreParagraphProps> = ({
  text,
  lines,
}) => {
  const [expanded, setExpanded] = useState(false);

  const paragraphStyle = {
    display: "-webkit-box",
    WebkitLineClamp: expanded ? "unset" : lines.toString(),
    WebkitBoxOrient: "vertical" as "vertical",
    overflow: expanded ? "visible" : "hidden",
    whiteSpace: expanded ? "pre-wrap" : "normal",
    textOverflow: expanded ? "unset" : "ellipsis",
  };

  return (
    <div>
      <div style={paragraphStyle}>{text}</div>

      <a onClick={() => setExpanded(!expanded)}>
        {expanded ? "Read Less" : "Read More"}
      </a>
    </div>
  );
};

export default ReadMoreParagraph;

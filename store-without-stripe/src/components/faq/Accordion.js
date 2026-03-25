import React from 'react'
import { useState, useRef, useEffect } from "react";

const AccordionItem = ({ title, content, isOpen, onClick }) => {
    const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");
  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);
    return (
      <div className={`faqAccordionitems transition-all ${isOpen ? 'active' : ''}`}>
        <button className="w-full flex items-center" onClick={onClick}>
            <span className='faqarrows'>{isOpen ? "-" : "+"}</span>
            <span className="faqtitles">{title}</span>
        </button>
        <div className="faqbodycont transition-all duration-300 ease-in-out" ref={contentRef} style={{maxHeight: height,overflow: "hidden",}}>
            <div className='incont'>{content}</div>
        </div>
      </div>
    );
  };

const Accordion = ({ items }) => {
      // State to track which index is open; default to 0 (first item)
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };
  return (
    <div className="faqAccordion">
        {items.map((item, index) => (
            <AccordionItem key={index} title={item.title} content={item.content} isOpen={openIndex === index} onClick={() => handleToggle(index)}/>
        ))}
      </div>
  )
}

export default Accordion
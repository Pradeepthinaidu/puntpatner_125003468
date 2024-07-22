import React, { useEffect, useState } from 'react';
import fontsData from '../fonts.json';
import '../styles.css'; // Ensure this path is correct

type FontVariants = {
  [weight: string]: string;
};

type Fonts = {
  [family: string]: FontVariants;
};

const fonts: Fonts = fontsData;

const TextEditor: React.FC = () => {
  const [text, setText] = useState(localStorage.getItem('text') || '');
  const [fontFamily, setFontFamily] = useState(localStorage.getItem('fontFamily') || Object.keys(fonts)[0]);
  const [fontWeight, setFontWeight] = useState(localStorage.getItem('fontWeight') || '400');
  const [italic, setItalic] = useState(localStorage.getItem('italic') === 'true');

  useEffect(() => {
    localStorage.setItem('text', text);
  }, [text]);

  useEffect(() => {
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('fontWeight', fontWeight);
    localStorage.setItem('italic', italic.toString());
  }, [fontFamily, fontWeight, italic]);

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontFamily = e.target.value;
    setFontFamily(newFontFamily);
    setFontWeight('400');
    setItalic(false);
  };

  const handleFontWeightChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newFontWeight = e.target.value;
    if (newFontWeight.includes('italic')) {
      setItalic(true);
      setFontWeight(newFontWeight.replace('italic', ''));
    } else {
      setItalic(false);
      setFontWeight(newFontWeight);
    }
  };

  const handleItalicToggle = () => {
    setItalic(!italic);
  };

  const getFontWeights = (): string[] => {
    return fonts[fontFamily] ? Object.keys(fonts[fontFamily]) : [];
  };

  const getClosestVariant = (): string => {
    const weights = getFontWeights();
    if (italic) {
      const italicWeights = weights.filter(weight => weight.includes('italic'));
      if (italicWeights.length > 0) {
        return italicWeights[0];
      }
    }
    return weights[0] || '400';
  };

  useEffect(() => {
    const fontVariant = `${fontWeight}${italic ? 'italic' : ''}`;
    if (!fonts[fontFamily] || !fonts[fontFamily][fontVariant]) {
      const closestVariant = getClosestVariant();
      setFontWeight(closestVariant.replace('italic', ''));
      setItalic(closestVariant.includes('italic'));
    }
  }, [fontFamily, fontWeight, italic]);

  useEffect(() => {
    console.log('Font Family:', fontFamily);
    console.log('Font Weight:', fontWeight);
    console.log('Font Style:', italic ? 'italic' : 'normal');
  }, [fontFamily, fontWeight, italic]);

  return (
    <div>
      <div className="font-family-selector">
        <label htmlFor="fontFamily">Font Family:</label>
        <select id="fontFamily" value={fontFamily} onChange={handleFontFamilyChange}>
          {Object.keys(fonts).map(font => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>
      <div className="font-weight-selector">
        <label htmlFor="fontWeight">Font Weight:</label>
        <select id="fontWeight" value={`${fontWeight}${italic ? 'italic' : ''}`} onChange={handleFontWeightChange}>
          {getFontWeights().map(weight => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </div>
      <div className="italic-toggle">
        <label htmlFor="italic">Italic:</label>
        <input
          type="checkbox"
          id="italic"
          checked={italic}
          onChange={handleItalicToggle}
          disabled={!fonts[fontFamily] || !fonts[fontFamily][`${fontWeight}italic`]}
        />
      </div>
      <textarea
        style={{
          fontFamily: fontFamily,
          fontWeight: fontWeight,
          fontStyle: italic ? 'italic' : 'normal',
          border: '1px solid #ccc',
          padding: '10px',
          boxSizing: 'border-box'
        }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};

export default TextEditor;
